"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseVideo } from "./data"

export function VideoPlayer({ video }: { video: CourseVideo }) {
  const [playing, setPlaying] = useState(false)
  const isVertical = video.orientation === "vertical"

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-950",
        isVertical ? "aspect-[9/16] w-full" : "aspect-video w-full",
      )}
    >
      {playing ? (
        <video
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          className="h-full w-full bg-black object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Reproducir ${video.title}`}
          className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${video.poster})` }}
        >
          {/* Capa de oscurecimiento sobre el poster */}
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 transition-colors group-hover:from-black/60" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
          </span>
        </button>
      )}
    </figure>
  )
}
