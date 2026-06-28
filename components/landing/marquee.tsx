import { Fragment } from "react"
import { MARQUEE_ITEMS } from "./data"

// Repetimos los ítems para que cada mitad del track supere el ancho de la
// pantalla (incluye ultrawide); así el loop empalma sin dejar espacio en blanco.
const SEQUENCE = Array.from({ length: 3 }, () => MARQUEE_ITEMS).flat()

function Row() {
  return (
    <div className="flex items-center gap-[42px] whitespace-nowrap pr-[42px] font-mono text-[15px] uppercase tracking-[0.12em] text-[#f3f0fa]/80">
      {SEQUENCE.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          <span>{item}</span>
          <span className="text-[var(--a2)]">◆</span>
        </Fragment>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <section
      aria-hidden
      className="relative z-[2] overflow-hidden border-y border-white/[0.08] bg-white/[0.012] py-5"
    >
      <div className="flex w-max" style={{ animation: "marquee 80s linear infinite" }}>
        <Row />
        <Row />
      </div>
    </section>
  )
}
