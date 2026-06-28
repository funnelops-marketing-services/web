// Contenido del landing "Rediseño de portafolio audiovisual" (Mirko Calzadilla).

export const CONTACT = {
  whatsappNumber: "59178482245",
  whatsappUrl: "https://wa.me/59178482245",
  instagram: "mirko_calzadilla_",
  instagramUrl: "https://www.instagram.com/mirko_calzadilla_/",
  email: "mirkocalzadilla4@gmail.com",
  location: "Santa Cruz, Bolivia",
} as const

/** Arma el link de WhatsApp con un mensaje prellenado opcional. */
export function whatsappLink(message?: string): string {
  return message ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}` : CONTACT.whatsappUrl
}

export const NAV_ITEMS = [
  { href: "#trabajo", label: "Trabajo" },
  { href: "#servicios", label: "Servicios" },
  { href: "#curso", label: "Curso" },
  { href: "#contacto", label: "Contacto" },
] as const

export const STATS = [
  { value: 5, prefix: "+", label: "años de experiencia" },
  { value: 50, prefix: "+", label: "empresas a nivel nacional" },
] as const

export const MARQUEE_ITEMS = [
  "Producción cinematográfica",
  "Fotografía editorial",
  "Edición con IA",
  "Marca personal premium",
  "Contenido para redes",
] as const

export type WorkItem =
  | { kind: "video"; title: string; src: string }
  | { kind: "gallery"; title: string; images: string[] }

export const WORK_ITEMS: WorkItem[] = [
  { kind: "video", title: "Pieza 01", src: "/landing/post1.mp4" },
  {
    kind: "gallery",
    title: "Sesión de fotos",
    images: ["/landing/post2/p1.jpg", "/landing/post2/p2.jpg", "/landing/post2/p3.jpg", "/landing/post2/p4.jpg"],
  },
  { kind: "video", title: "Pieza 03", src: "/landing/post3.mp4" },
]

export const PROCESS_STEPS = [
  { step: "01", title: "Preproducción", description: "Estrategia, concepto y guion para cada pieza." },
  { step: "02", title: "Rodaje", description: "Equipo de cine, iluminación y dirección en set." },
  { step: "03", title: "Postproducción", description: "Edición, motion graphics y colorización." },
  { step: "04", title: "Entrega", description: "Contenido listo para publicar, a tiempo." },
] as const

export const GEAR = [
  { label: "CÁMARAS", value: "Sony FX3 · A7 IV · a6400" },
  { label: "LENTES", value: "G Master 24–70 · 50mm · 11mm" },
  { label: "ESTABILIZACIÓN", value: "Gimbal DJI RS3 Mini" },
  { label: "ILUMINACIÓN", value: "Luces RGB profesionales · difusores" },
  { label: "AÉREO", value: "Drone DJI · video vertical" },
  { label: "POST", value: "After Effects · Premiere · DaVinci · IA" },
] as const

export type PriceTier = { label: string; price: string }

export type ProductionPackage = {
  name: string
  /** Sello superior (ESTÁNDAR / PREMIUM · CINE). */
  badge: string
  featured?: boolean
  ai?: boolean
  description: string
  features: string[]
  price: string
  message: string
}

export const PRODUCTION_PACKAGES: ProductionPackage[] = [
  {
    name: "Paquete 1",
    badge: "ESTÁNDAR",
    description: "Cámara Sony a6400 · trípode · luz principal + relleno RGB · edición en CapCut.",
    features: ["5 videos", "12 fotografías", "2 días de producción"],
    price: "Bs 5.500",
    message: "Hola Mirko, me interesa el Paquete 1 de producción audiovisual.",
  },
  {
    name: "Paquete 2",
    badge: "PREMIUM · CINE",
    featured: true,
    ai: true,
    description:
      "Sony FX3 / A7 IV · lentes G Master · gimbal RS3 · luces RGB + difusores + drone · edición AE · Premiere · DaVinci + IA.",
    features: ["5 videos cinematográficos", "12 fotografías editoriales", "Integración con IA", "2 días de producción"],
    price: "Bs 9.500",
    message: "Hola Mirko, me interesa el Paquete 2 premium cinematográfico.",
  },
]

export type EditingPlan = {
  name: string
  ai?: boolean
  description: string
  tiers: PriceTier[]
  message: string
}

export const EDITING_PLANS: EditingPlan[] = [
  {
    name: "CapCut",
    description: "Edición profesional accesible, lista para redes.",
    tiers: [
      { label: "5 videos / mes", price: "Bs 1.800" },
      { label: "10 videos / mes", price: "Bs 3.000" },
    ],
    message: "Hola Mirko, me interesa el plan de edición en CapCut.",
  },
  {
    name: "After Effects",
    ai: true,
    description: "Premium · Premiere · DaVinci. Integración con IA +Bs 150 / video.",
    tiers: [
      { label: "5 videos / mes", price: "Bs 3.700" },
      { label: "10 videos / mes", price: "Bs 6.000" },
    ],
    message: "Hola Mirko, me interesa el plan de edición en After Effects.",
  },
]

export const EDITING_NOTE =
  "Entrega: el primer video en 2 días; luego, uno nuevo cada 2 días hasta completar el plan."

export type IndividualService = {
  name: string
  ai?: boolean
  description: string
  price: string
  message: string
}

export const INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    name: "Video individual",
    description: "Producción a medida según el tipo de contenido.",
    price: "desde Bs 3.800",
    message: "Hola Mirko, me interesa un video individual.",
  },
  {
    name: "Cinematográfico con IA",
    ai: true,
    description: "Pieza de 15 a 30 segundos, look de cine.",
    price: "Bs 2.800",
    message: "Hola Mirko, me interesa una pieza cinematográfica con IA.",
  },
  {
    name: "Ediciones de IA",
    description: "Retoque y generación puntual con IA.",
    price: "Bs 450",
    message: "Hola Mirko, me interesan las ediciones de IA.",
  },
]

export type CourseWorkshop = {
  step: string
  title: string
  description: string
  price: string
}

export const COURSE_WORKSHOPS: CourseWorkshop[] = [
  {
    step: "TALLER 1",
    title: "Preproducción",
    description: "Iluminación, composición, hablar a cámara y línea gráfica.",
    price: "Bs 150",
  },
  {
    step: "TALLER 2",
    title: "CapCut Pro básico",
    description: "Manejo de la app, cortes, títulos, textos y música.",
    price: "Bs 250",
  },
  {
    step: "TALLER 3",
    title: "CapCut Pro avanzado",
    description: "Keyframes, animaciones, transiciones y color (pro).",
    price: "Bs 350",
  },
  {
    step: "TALLER 4",
    title: "Integración con IA",
    description: "Higgsfield, foto y video con IA, prompts profesionales.",
    price: "Bs 250",
  },
]

export const COURSE_BUNDLE = {
  badge: "CURSO COMPLETO · PREVENTA",
  price: "Bs 650",
  strikethrough: "Bs 1.000",
  message: "Hola Mirko, me interesa el curso completo de producción audiovisual + IA.",
}

export type PremiumProgram = {
  badge: string
  title: string
  description: string
  tags: string[]
  message: string
  glow: "a1" | "a2"
}

export const PREMIUM_PROGRAMS: PremiumProgram[] = [
  {
    badge: "PLAN ESTRELLA",
    title: "Marca de Alto Impacto",
    description:
      "Programa mensual de marca personal premium: estrategia, producción cinematográfica, fotografía editorial, manejo de redes y un equipo de cine de 6 personas dedicado a tu marca, mes a mes.",
    tags: ["Estrategia", "Producción", "Redes", "Equipo de 6"],
    message: "Hola Mirko, quiero info del programa Marca de Alto Impacto.",
    glow: "a1",
  },
  {
    badge: "A TU RUBRO",
    title: "Capacitación Personalizada",
    description:
      "Los 4 talleres del curso, 100% dirigidos a tu sector: inmobiliaria, médico, tienda, marca o empresa. Formación a medida con acceso directo a mí y a mi equipo.",
    tags: ["A medida", "Práctico", "Acceso directo"],
    message: "Hola Mirko, quiero info de la Capacitación Personalizada para mi rubro.",
    glow: "a2",
  },
]
