from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------- DB ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


# ---------- App ----------
app = FastAPI(title="KOLI INVENTORY Dormitory API")
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str
    user: dict


class InventoryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    sku: str
    price: float
    stock: int
    category: str
    owner: str
    dormitory_room: str
    status: str = "active"  # 'active' | 'inactive'
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class InventoryCreate(BaseModel):
    name: str
    sku: str
    price: float
    stock: int
    category: str
    owner: str
    dormitory_room: str
    status: str = "active"


class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    owner: Optional[str] = None
    dormitory_room: Optional[str] = None
    status: Optional[str] = None


# ---------- Password & JWT helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Hiányzó token")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Érvénytelen token típus")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Felhasználó nem található")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Lejárt token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Érvénytelen token")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "KOLI INVENTORY API"}


@api_router.post("/auth/register", response_model=LoginResponse, status_code=201)
async def register(data: LoginRequest):
    email = data.email.lower()
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="A jelszónak legalább 6 karakteresnek kell lennie")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="Ez az email cím már foglalt")
    user_id = str(uuid.uuid4())
    await db.users.insert_one({
        "id": user_id,
        "email": email,
        "password_hash": hash_password(data.password),
        "name": email.split("@")[0],
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    token = create_access_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email, "name": email.split("@")[0], "role": "user"},
    }


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Hibás email vagy jelszó")
    token = create_access_token(user["id"], user["email"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"),
        },
    }


@api_router.get("/auth/me")
async def me(current=Depends(get_current_user)):
    return current


@api_router.get("/inventory", response_model=List[InventoryItem])
async def list_inventory(current=Depends(get_current_user)):
    items = await db.inventory.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/inventory", response_model=InventoryItem, status_code=201)
async def create_inventory(payload: InventoryCreate, current=Depends(get_current_user)):
    item = InventoryItem(**payload.model_dump())
    await db.inventory.insert_one(item.model_dump())
    return item


@api_router.put("/inventory/{item_id}", response_model=InventoryItem)
async def update_inventory(item_id: str, payload: InventoryUpdate, current=Depends(get_current_user)):
    existing = await db.inventory.find_one({"id": item_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Tétel nem található")
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await db.inventory.update_one({"id": item_id}, {"$set": updates})
    updated = await db.inventory.find_one({"id": item_id}, {"_id": 0})
    return updated


@api_router.delete("/inventory/{item_id}")
async def delete_inventory(item_id: str, current=Depends(get_current_user)):
    result = await db.inventory.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tétel nem található")
    return {"ok": True}


@api_router.get("/stats")
async def stats(current=Depends(get_current_user)):
    items = await db.inventory.find({}, {"_id": 0}).to_list(1000)
    total_items = len(items)
    active_items = sum(1 for i in items if i.get("status") == "active")
    categories = len({i.get("category", "") for i in items if i.get("category")})
    # Total Inventory Value (price * stock), EXCLUDE "rántott hús" (case-insensitive)
    total_value = 0.0
    for i in items:
        if (i.get("name", "") or "").strip().lower() == "rántott hús":
            continue
        total_value += float(i.get("price", 0)) * int(i.get("stock", 0))
    return {
        "total_items": total_items,
        "active_items": active_items,
        "categories": categories,
        "total_value": round(total_value, 2),
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Seed ----------
SEED_ITEMS = [
    {"name": "Mini Hűtő", "sku": "DRM-MFG-001", "price": 42000, "stock": 8, "category": "Konyhai eszköz", "owner": "Kovács Anna", "dormitory_room": "Miskolc Uni Dorm - Room 104", "status": "active"},
    {"name": "Asztali Lámpa", "sku": "DRM-LMP-002", "price": 6500, "stock": 25, "category": "Világítás", "owner": "Nagy Bence", "dormitory_room": "Miskolc Uni Dorm - Room 210", "status": "active"},
    {"name": "Mikrohullámú Sütő", "sku": "DRM-MCW-003", "price": 28900, "stock": 5, "category": "Konyhai eszköz", "owner": "Szabó Réka", "dormitory_room": "Miskolc Uni Dorm - Room 312", "status": "active"},
    {"name": "Vasaló", "sku": "DRM-IRN-004", "price": 9800, "stock": 12, "category": "Háztartás", "owner": "Tóth Levente", "dormitory_room": "Miskolc Uni Dorm - Room 104", "status": "inactive"},
    {"name": "Tanulóasztal", "sku": "DRM-DSK-005", "price": 34500, "stock": 30, "category": "Bútor", "owner": "Horváth Eszter", "dormitory_room": "Miskolc Uni Dorm - Room 210", "status": "active"},
    {"name": "Polc", "sku": "DRM-SHF-006", "price": 12500, "stock": 18, "category": "Bútor", "owner": "Varga Máté", "dormitory_room": "Miskolc Uni Dorm - Room 408", "status": "active"},
    {"name": "Vízforraló", "sku": "DRM-KTL-007", "price": 7200, "stock": 14, "category": "Konyhai eszköz", "owner": "Balogh Petra", "dormitory_room": "Miskolc Uni Dorm - Room 312", "status": "active"},
    {"name": "rántott hús", "sku": "DRM-RHS-999", "price": 1500, "stock": 100, "category": "Egyéb", "owner": "Konyha", "dormitory_room": "Miskolc Uni Dorm - Room 104", "status": "active"},
]


@app.on_event("startup")
async def startup_event():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.inventory.create_index("sku")

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@pkcentral.hu").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Updated admin password hash")

    # Seed inventory
    count = await db.inventory.count_documents({})
    if count == 0:
        docs = []
        for it in SEED_ITEMS:
            item = InventoryItem(**it)
            docs.append(item.model_dump())
        if docs:
            await db.inventory.insert_many(docs)
            logger.info(f"Seeded {len(docs)} inventory items")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
