"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { WORK_ITEMS } from "./data"
import { MediaModal } from "./media-modal"

type ModalState = { kind: "video"; src: string } | { kind: "gallery"; images: string[]; index: number } | null

const TILE =
  "group relative block w-full overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.02] [aspect-ratio:9/16]"

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-white/60 bg-black/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
        <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
      </span>
    </span>
  )
}

function VideoTile({ src, title, onOpen }: { src: string; title: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className={`${TILE} cursor-pointer`}>
      <video className="absolute inset-0 h-full w-full object-cover" src={src} muted loop playsInline autoPlay preload="metadata" />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,7,18,.7)_100%)]" />
      <PlayBadge />
      <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.14em] text-white/85">{title}</span>
    </button>
  )
}

function GalleryTile({ images, title, onOpen }: { images: string[]; title: string; onOpen: () => void }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % images.length), 2600)
    return () => window.clearInterval(id)
  }, [images.length])

  return (
    <button type="button" onClick={onOpen} className={`${TILE} cursor-pointer`}>
      {images.map((img, i) => (
        <Image
          key={img}
          src={img}
          alt={`${title} ${i + 1}`}
          fill
          sizes="(max-width:768px) 90vw, 30vw"
          className={`object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,7,18,.7)_100%)]" />
      <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.14em] text-white/85">{title}</span>
    </button>
  )
}

export function WorkGallery() {
  const [modal, setModal] = useState<ModalState>(null)

  // Navegación de la galería con flechas del teclado.
  useEffect(() => {
    if (modal?.kind !== "gallery") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setModal((m) => (m?.kind === "gallery" ? { ...m, index: (m.index + 1) % m.images.length } : m))
      if (e.key === "ArrowLeft")
        setModal((m) => (m?.kind === "gallery" ? { ...m, index: (m.index - 1 + m.images.length) % m.images.length } : m))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [modal?.kind])

  return (
    <>
      <div className="reveal-up mt-[42px] grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {WORK_ITEMS.map((item) =>
          item.kind === "video" ? (
            <VideoTile key={item.src} src={item.src} title={item.title} onOpen={() => setModal({ kind: "video", src: item.src })} />
          ) : (
            <GalleryTile
              key={item.title}
              images={item.images}
              title={item.title}
              onOpen={() => setModal({ kind: "gallery", images: item.images, index: 0 })}
            />
          ),
        )}
      </div>

      {modal?.kind === "video" && (
        <MediaModal onClose={() => setModal(null)}>
          <video src={modal.src} controls autoPlay playsInline className="max-h-[88vh] w-auto max-w-[92vw] rounded-2xl" />
        </MediaModal>
      )}

      {modal?.kind === "gallery" && (
        <MediaModal onClose={() => setModal(null)}>
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center">
              <Image
                src={modal.images[modal.index]}
                alt={`Foto ${modal.index + 1}`}
                width={1080}
                height={1350}
                className="h-auto max-h-[78vh] w-auto max-w-[92vw] rounded-2xl object-contain"
              />
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={() => setModal({ kind: "gallery", images: modal.images, index: (modal.index - 1 + modal.images.length) % modal.images.length })}
                className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-2xl text-white/90 backdrop-blur-sm transition-colors hover:border-[var(--a2)] hover:bg-black/60 md:left-[-58px]"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={() => setModal({ kind: "gallery", images: modal.images, index: (modal.index + 1) % modal.images.length })}
                className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-2xl text-white/90 backdrop-blur-sm transition-colors hover:border-[var(--a2)] hover:bg-black/60 md:right-[-58px]"
              >
                ›
              </button>
            </div>
            <div className="flex items-center gap-3">
              {modal.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setModal({ kind: "gallery", images: modal.images, index: i })}
                  aria-label={`Foto ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${i === modal.index ? "bg-[var(--a2)]" : "bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>
          </div>
        </MediaModal>
      )}
    </>
  )
}
