"const WAVE_URL =
  \assets/images/wave.png\"; // Replace with the actual path to your wave image

export default function WaveBackground() {
  return (
    <div
      className=\"pointer- events-none fixed inset-0 overflow-hidden z-0\"
      aria-hidden=\"true\"
      data-testid=\"wave-background\"
    >
      {/* Left edge wave — offset upward, flipped horizontally so the curl points right */}
      <img
        src={WAVE_URL}
        alt=\"\"
        className=\"absolute -left-32 -top-20 w-[42rem] max-w-[55vw] opacity-90 mix-blend-multiply select-none scale-x-[-1]\"
      />
      {/* Right edge wave — offset downward */}
      <img
        src={WAVE_URL}
        alt=\"\"
        className=\"absolute -right-32 -bottom-24 w-[42rem] max-w-[55vw] opacity-90 mix-blend-multiply select-none\"
      />
    </div>
    );
}