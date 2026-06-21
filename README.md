"# 🏠 KOLI INVENTORY — Kollégiumi Leltár Dashboard

Webfejlesztés 2 beadandó projekt — kollégiumi felszerelések digitális nyilvántartására készített, modern full-stack webalkalmazás. A Miskolci Egyetem kollégiumainak (Room 104, 210, 312, 408) szobánkénti leltárát kezeli, hallgatókhoz és kategóriákhoz rendelve.

---

## ✨ Funkciók

- 🔐 **JWT-alapú bejelentkezés és regisztráció** (bcrypt jelszó-hash)
- 📦 **Leltár teljes CRUD** (létrehozás, listázás, szerkesztés, törlés)
- 🏷️ **9 oszlopos táblázat**: név, cikkszám, ár, készlet, szoba, kategória, tulajdonos, státusz, műveletek
- 📊 **Statisztika kártyák**: összes tétel, aktív tételek, kategóriák száma, leltár érték
- 💰 **Speciális üzleti logika**: a **„rántott hús\"** nevű tételek (kis/nagybetű érzéketlen) **kizárásra kerülnek** a leltár érték összegéből
- 👥 **Hallgatók szekció**: minden hallgatóhoz tartozó tételek aggregálva
- 📈 **Kategóriánkénti megoszlás**: progress barokkal vizualizálva
- 🎨 **Modern UI**: lebegő pill-alakú navbar, dekoratív hullám háttér, sima animációk

---

## 🛠️ Technológiai stack

### Backend
- **Python 3.10+** + **FastAPI** (REST API)
- **MongoDB** + **Motor** (aszinkron driver)
- **PyJWT** (token alapú auth) + **bcrypt** (jelszó hash)
- **Pydantic v2** (adatvalidáció)

### Frontend
- **React 19** + **React Router 7**
- **Tailwind CSS 3** + **Radix UI** + **shadcn/ui** komponensek
- **Axios** (HTTP), **sonner** (toast üzenetek), **lucide-react** (ikonok)
- **CRACO** + **Create React App** (build)

---

## 🚀 Lokális telepítés és futtatás

### Előfeltételek

| Eszköz | Verzió | Letöltés |
|---|---|---|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Yarn | 1.22+ | `npm install -g yarn` |
| MongoDB | 6+ | [mongodb.com](https://www.mongodb.com/try/download/community) |

### 1️⃣ MongoDB indítása

Telepítés után a MongoDB Windowson **service-ként** automatikusan elindul. Ellenőrzés:
```bash
mongosh
```
Ha bejön a prompt → fut. (Kilépés: `exit`)

### 2️⃣ Backend (FastAPI)

```bash
cd backend

# Virtuális környezet létrehozása
python -m venv venv

# Aktiválás
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Függőségek
pip install -r requirements.txt
```

**Hozd létre a `backend/.env` fájlt** (ezzel a pontos tartalommal):
```env
MONGO_URL=\"mongodb://localhost:27017\"
DB_NAME=\"test_database\"
CORS_ORIGINS=\"*\"
JWT_SECRET=\"b7e3a9f5c2d8e4a6b1c9d7f3e5a8b2c6d4e7f1a9b3c5d8e2f6a4b7c1d9e3f5a8\"
ADMIN_EMAIL=\"admin@pkcentral.hu\"
ADMIN_PASSWORD=\"admin123\"
```

Indítás:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

A backend **automatikusan beseedeli** az admin felhasználót és a 8 minta leltár tételt az első indításkor.

### 3️⃣ Frontend (React)

Új terminálban:
```bash
cd frontend
```

**Hozd létre a `frontend/.env` fájlt**:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Telepítés és indítás:
```bash
yarn install
yarn start
```

A frontend automatikusan megnyílik: **http://localhost:3000**

---

## 🔑 Bejelentkezési adatok

| Felhasználó | Email | Jelszó |
|---|---|---|
| **Admin** (seedelt) | `admin@pkcentral.hu` | `admin123` |

Vagy regisztrálj saját fiókot a `/register` oldalon.

---

## 📡 API Endpointok

Minden inventory endpoint `Authorization: Bearer <token>` headert vár.

| Method | Endpoint | Leírás |
|---|---|---|
| POST | `/api/auth/register` | Új felhasználó regisztráció |
| POST | `/api/auth/login` | Bejelentkezés (visszaadja: `token`, `user`) |
| GET | `/api/auth/me` | Aktuális felhasználó adatai |
| GET | `/api/inventory` | Összes leltár tétel |
| POST | `/api/inventory` | Új tétel létrehozása |
| PUT | `/api/inventory/{id}` | Tétel módosítása |
| DELETE | `/api/inventory/{id}` | Tétel törlése |
| GET | `/api/stats` | Statisztikák (rántott hús kizárva!) |

API dokumentáció (Swagger UI): **http://localhost:8001/docs**

---

## 🗂️ Mappastruktúra

```
.
├── backend/
│   ├── server.py            # FastAPI app, route-ok, modellek, seed
│   ├── requirements.txt     # Python függőségek
│   └── .env                 # Környezeti változók (létrehozandó!)
│
├── frontend/
│   ├── src/
│   │   ├── App.js                       # Router + AuthProvider
│   │   ├── index.js                     # React entry point
│   │   ├── index.css                    # Tailwind + globális stílusok
│   │   ├── context/AuthContext.jsx      # JWT auth state
│   │   ├── lib/
│   │   │   ├── api.js                   # Axios instance Bearer headerrel
│   │   │   └── utils.js                 # cn() helper
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Bejelentkező oldal
│   │   │   ├── Register.jsx             # Regisztrációs oldal
│   │   │   └── Dashboard.jsx            # Fő dashboard
│   │   └── components/
│   │       ├── Navbar.jsx               # Lebegő pill-alakú navbar
│   │       ├── SystemOverview.jsx       # Hero kártya (dark navy)
│   │       ├── StatsRow.jsx             # 4 statisztika kártya
│   │       ├── InventoryTable.jsx       # Leltár táblázat
│   │       ├── NewItemDialog.jsx        # Új tétel modal
│   │       ├── EditItemDialog.jsx       # Szerkesztés modal
│   │       ├── AddItemForm.jsx          # Form (+ CATEGORIES, STUDENTS, ROOMS export)
│   │       ├── StudentsSection.jsx      # Hallgatók aggregálva
│   │       ├── CategoriesSection.jsx    # Kategóriák progress barokkal
│   │       ├── WaveBackground.jsx       # Dekoratív cyan háttér
│   │       └── ui/                      # shadcn/ui komponensek
│   ├── package.json
│   └── .env                             # REACT_APP_BACKEND_URL (létrehozandó!)
│
└── README.md
```

---

## 💡 Speciális üzleti logika

A `/api/stats` endpoint a **leltár értéket** (`total_value`) a következőképp számolja:

```python
total_value = Σ (price × stock)  minden tételre,
              kivéve azokat, ahol name.lower() == \"rántott hús\"
```

A seed adatok között szándékosan szerepel egy „rántott hús\" nevű tétel **1500 Ft × 100 db = 150 000 Ft** értékben — ennek **nem szabad** megjelennie a `total_value`-ban. (Tesztelve: a végeredmény `2 121 400 Ft`, nem `2 271 400 Ft`.)

---

## ⚠️ Gyakori hibák

| Hiba | Megoldás |
|---|---|
| `KeyError: 'MONGO_URL'` | A `backend/.env` fájl hiányzik. Hozd létre a fenti tartalommal. |
| `Network Error` / `undefined/api/...` URL | A `frontend/.env` hiányzik, vagy a `yarn start` nem lett újraindítva mentés után. |
| `ECONNREFUSED` MongoDB-re | A MongoDB szerver nem fut. Indítsd el. |
| `401 Unauthorized` | Lejárt token (24h után) — jelentkezz be újra. |
| `ENOSPC: no space left` | Megtelt a C: meghajtó. `npm cache clean --force` |

---

## 👤 Készítő

Egyed Martin, CLZPRE
