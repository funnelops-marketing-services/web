import { Check } from "lucide-react"
import { COURSE_VIDEOS } from "./data"
import { VideoPlayer } from "./video-player"
import { WhatsAppCta } from "./whatsapp-cta"

export function CourseSection() {
  return (
    <section id="curso" className="relative z-10 px-6 py-20 md:py-28 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado del curso */}
        <div className="text-center mb-16">
          <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
            Curso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 tracking-tight">
            Curso de producción audiovisual
          </h2>
          <p className="text-zinc-400 text-base font-normal mt-4 max-w-xl mx-auto leading-relaxed">
            Aprende a grabar y editar contenido profesional para tu marca o tus redes.
          </p>
        </div>

        {/* Lista: cada video con su info a la izquierda */}
        <div className="space-y-14 md:space-y-16">
          {COURSE_VIDEOS.map((video) => {
            const isVertical = video.orientation === "vertical"
            return (
              <div key={video.src} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Info a la izquierda */}
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{video.title}</h3>
                  <p className="text-zinc-400 text-sm font-normal mt-2 leading-relaxed">
                    {video.description}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {video.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-zinc-300 text-sm font-normal"
                      >
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video a la derecha */}
                <div className={isVertical ? "flex justify-center" : ""}>
                  <div className={isVertical ? "w-full max-w-[260px]" : "w-full"}>
                    <VideoPlayer video={video} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <WhatsAppCta
            label="Quiero el curso"
            message="Hola Mirko, me interesa el curso de producción audiovisual."
          />
        </div>
      </div>
    </section>
  )
}
