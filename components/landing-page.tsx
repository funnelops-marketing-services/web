"use client"

import { useRef } from "react"
import { About } from "./landing/about"
import { BackgroundFx } from "./landing/background-fx"
import { ContactSection } from "./landing/contact-section"
import { CourseSection } from "./landing/course-section"
import { Gear } from "./landing/gear"
import { Hero } from "./landing/hero"
import { Marquee } from "./landing/marquee"
import { PremiumSection } from "./landing/premium-section"
import { Process } from "./landing/process"
import { ServicesSection } from "./landing/services-section"
import { Showreel } from "./landing/showreel"
import { SiteFooter } from "./landing/site-footer"
import { SiteNav } from "./landing/site-nav"
import { useLandingFx } from "./landing/use-landing-fx"
import { Work } from "./landing/work"

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  useLandingFx(rootRef)

  return (
    <div
      ref={rootRef}
      className="relative overflow-x-hidden bg-[#0a0712] font-display text-[#f3f0fa]"
      style={{ ["--a1" as string]: "#8b3df5", ["--a2" as string]: "#ef4488", ["--a3" as string]: "#7a1330", ["--glow" as string]: "0.65", ["--grain" as string]: "1" }}
    >
      {/* Barra de progreso de scroll */}
      <div className="fixed inset-x-0 top-0 z-[130] h-0.5 bg-white/5">
        <div
          data-progress
          className="h-full w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--a1),var(--a2))] shadow-[0_0_14px_var(--a2)]"
        />
      </div>

      <BackgroundFx />
      <SiteNav />
      <Hero />
      <Showreel />
      <Marquee />
      <About />
      <Process />
      <Gear />
      <Work />
      <ServicesSection />
      <CourseSection />
      <PremiumSection />
      <ContactSection />
      <SiteFooter />
    </div>
  )
}
