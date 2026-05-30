import { SiteHeader } from "./landing/site-header"
import { HeroSection } from "./landing/hero-section"
import { CourseSection } from "./landing/course-section"
import { ServicesSection } from "./landing/services-section"
import { ContactSection } from "./landing/contact-section"
import { SiteFooter } from "./landing/site-footer"
import { WhatsAppFab } from "./landing/whatsapp-cta"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Degradados sutiles de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px]" />
      </div>

      <SiteHeader />
      <HeroSection />
      <CourseSection />
      <ServicesSection />
      <ContactSection />
      <SiteFooter />
      <WhatsAppFab />
    </div>
  )
}
