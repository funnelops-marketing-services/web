"use client"

import { useRef, useState } from "react"

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-[18px] w-[18px] border-white/55 ${className}`} />
}

const pad = (n: number) => String(n).padStart(2, "0")

/** Formatea segundos de reproducción como timecode HH:MM:SS:FF a 24fps. */
function timecode(seconds: number): string {
  const f = Math.floor((seconds % 1) * 24)
  const s = Math.floor(seconds) % 60
  const m = Math.floor(seconds / 60) % 60
  const h = Math.floor(seconds / 3600) % 24
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`
}

export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [code, setCode] = useState("00:00:00:00")

  function play() {
    const video = videoRef.current
    if (!video) return
    // Reset del tilt para ver el video derecho mientras se reproduce.
    if (figureRef.current) figureRef.current.style.transform = "perspective(1300px)"
    video.muted = false
    void video.play()
    setPlaying(true)
  }

  return (
    <section className="relative z-[2] px-[clamp(18px,4vw,52px)] pb-[clamp(40px,6vw,80px)]">
      <div
        ref={figureRef}
        data-tilt={playing ? undefined : ""}
        className="group relative mx-auto w-[min(1180px,100%)] overflow-hidden rounded-[22px] border border-white/[0.14] shadow-[0_50px_130px_rgba(0,0,0,.6)] transition-transform duration-200 ease-out"
        style={{
          aspectRatio: "16/9",
          background:
            "linear-gradient(135deg,color-mix(in srgb,var(--a1) 26%,#0b0916),color-mix(in srgb,var(--a2) 22%,#0b0916))",
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/portfolio/reel-horizontal.mp4"
          poster="/portfolio/reel-horizontal.jpg"
          playsInline
          controls={playing}
          preload="metadata"
          onTimeUpdate={(e) => setCode(timecode(e.currentTarget.currentTime))}
          onEnded={() => setPlaying(false)}
        />

        {/* Barrido de luz mientras el video no se reproduce. */}
        {!playing && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-y-[-20%] left-0 w-[36%] blur-[7px]"
              style={{
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent)",
                animation: "sweep 6.5s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* HUD cinematográfico (no intercepta clicks). */}
        <div className="pointer-events-none absolute inset-0">
          <Corner className="left-4 top-4 border-l-2 border-t-2" />
          <Corner className="right-4 top-4 border-r-2 border-t-2" />
          <Corner className="bottom-4 left-4 border-b-2 border-l-2" />
          <Corner className="bottom-4 right-4 border-b-2 border-r-2" />
          <div className="absolute left-[30px] top-[26px] inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-white/85">
            <span className="h-[7px] w-[7px] rounded-full bg-[#ff3b6b] shadow-[0_0_10px_#ff3b6b]" style={{ animation: "blink 1.6s ease-in-out infinite" }} />
            REC
          </div>
          <div className="absolute right-[30px] top-[26px] font-mono text-[11px] tracking-[0.1em] text-white/85">{code}</div>
          {!playing && (
            <>
              <div className="absolute bottom-[26px] left-[30px] font-mono text-[11px] tracking-[0.12em] text-white/70">
                2.39 : 1 · 4K · 24FPS
              </div>
              <div className="absolute bottom-[26px] right-[30px] font-mono text-[11px] tracking-[0.18em] text-white/70">REEL 2026</div>
            </>
          )}
        </div>

        {/* Botón de reproducción: reproduce el video con sonido. */}
        {!playing && (
          <button
            type="button"
            onClick={play}
            aria-label="Reproducir showreel"
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-5"
          >
            <span className="relative h-[88px] w-[88px]">
              <span className="absolute inset-0 rounded-full border border-[var(--a2)]" style={{ animation: "pulseRing 2.6s ease-out infinite" }} />
              <span className="absolute inset-0 flex items-center justify-center rounded-full border border-white/60 bg-white/[0.07] backdrop-blur-[4px] transition-transform duration-300 group-hover:scale-110">
                <span className="ml-[5px] h-0 w-0 border-y-[12px] border-l-[19px] border-y-transparent border-l-white" />
              </span>
            </span>
            <span className="font-mono text-xs tracking-[0.32em] text-white/[0.78]">VER SHOWREEL</span>
          </button>
        )}
      </div>
    </section>
  )
}
