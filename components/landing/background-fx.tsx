// Ruido procedural (reemplaza al grain.png del diseño original).
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Blobs animados + viñeta + grano, fijos detrás de todo el contenido. */
export function BackgroundFx() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute h-[52vw] w-[52vw] rounded-full bg-[var(--a1)] blur-[95px]"
          style={{ left: "-10vw", top: "-12vw", opacity: "calc(.5*var(--glow) + .14)", animation: "floatA 22s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute h-[46vw] w-[46vw] rounded-full bg-[var(--a2)] blur-[100px]"
          style={{ right: "-8vw", top: "-6vw", opacity: "calc(.42*var(--glow) + .1)", animation: "floatB 26s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute h-[60vw] w-[60vw] rounded-full bg-[var(--a1)] blur-[120px]"
          style={{ left: "24vw", top: "46vh", opacity: "calc(.4*var(--glow) + .08)", animation: "floatC 30s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,18,0)_0%,rgba(10,7,18,.4)_55%,#0a0712_100%)]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
        style={{
          opacity: "calc(.075*var(--grain))",
          backgroundImage: GRAIN_URI,
          backgroundSize: "220px 220px",
          animation: "grain 5s steps(6) infinite",
        }}
      />
    </>
  )
}
