// Contenido del landing de servicios. Extraído del PDF "Paquetes Exclusivos MC".

export const CONTACT = {
  // Se mantiene el WhatsApp actual del landing (+591 78482245), no el del PDF.
  whatsappNumber: "59178482245",
  whatsappUrl: "https://wa.me/59178482245",
  instagram: "mirko_calzadilla",
  instagramUrl: "https://instagram.com/mirko_calzadilla",
  email: "mirkocalzadilla@gmail.com",
} as const

export type PriceTier = {
  label: string
  price: string
}

export type ServicePackage = {
  name: string
  /** Resalta la opción con integración de IA / premium. */
  featured?: boolean
  /** Muestra el sello "IA" en la tarjeta. */
  ai?: boolean
  /** Entregables / lo que incluye. */
  features: string[]
  /** Precio único, cuando aplica. */
  price?: string
  /** Precios por volumen, cuando hay más de una opción. */
  tiers?: PriceTier[]
  /** Aclaración de producción o entrega. */
  note?: string
}

export type ServiceCategory = {
  id: string
  title: string
  subtitle: string
  packages: ServicePackage[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "produccion",
    title: "Producción audiovisual",
    subtitle: "Sesión completa de video y fotografía",
    packages: [
      {
        name: "Paquete 1",
        features: ["5 videos", "12 fotografías", "2 días de producción"],
        price: "Bs. 5.500",
      },
      {
        name: "Paquete 2",
        featured: true,
        ai: true,
        features: [
          "5 videos",
          "12 fotografías",
          "Integración con IA",
          "2 días de producción",
        ],
        price: "Bs. 9.500",
      },
    ],
  },
  {
    id: "edicion",
    title: "Edición de videos",
    subtitle: "Edición mensual de tu contenido",
    packages: [
      {
        name: "CapCut",
        features: ["Edición profesional en CapCut"],
        tiers: [
          { label: "5 videos / mes", price: "Bs. 1.800" },
          { label: "10 videos / mes", price: "Bs. 3.000" },
        ],
        note: "Primer video entregado en 2 días; luego un nuevo video cada 2 días hasta completar la entrega.",
      },
      {
        name: "After Effects",
        featured: true,
        ai: true,
        features: ["Edición avanzada en After Effects", "Integración con IA: +Bs. 150 / video"],
        tiers: [
          { label: "5 videos", price: "Bs. 7.000" },
          { label: "10 videos", price: "Bs. 12.000" },
        ],
      },
    ],
  },
  {
    id: "individual",
    title: "Servicios individuales",
    subtitle: "Piezas sueltas a medida",
    packages: [
      {
        name: "Video individual",
        features: ["1 video a medida"],
        price: "desde Bs. 3.800",
        note: "El precio depende del tipo de contenido.",
      },
      {
        name: "Producción cinematográfica con IA",
        featured: true,
        ai: true,
        features: ["Pieza cinematográfica de 15 a 30 seg", "Producción con IA"],
        price: "Bs. 2.800",
      },
      {
        name: "Ediciones de IA",
        features: ["Edición puntual con IA"],
        price: "Bs. 450",
      },
    ],
  },
]

export type CourseVideo = {
  title: string
  description: string
  points: string[]
  /** Ruta del .mp4 web (ver public/portfolio/README.md para generarlo). */
  src: string
  poster: string
  orientation: "horizontal" | "vertical"
}

// Videos promocionales del curso de producción audiovisual.
// NOTA: copy provisional — falta detalle real del curso (qué incluye, precio, duración).
export const COURSE_VIDEOS: CourseVideo[] = [
  {
    title: "Contenido para redes",
    description: "Reels que enganchan desde el primer segundo.",
    points: ["Edición dinámica con IA", "Texto y ritmo para retención", "Formato vertical 9:16 para redes"],
    src: "/portfolio/reel-vertical.mp4",
    poster: "/portfolio/reel-vertical.jpg",
    orientation: "vertical",
  },
  {
    title: "Producción profesional",
    description: "Graba como un profesional, de la idea a la entrega.",
    points: ["Cámara, luz y composición", "Dirección y narrativa visual", "Flujo de producción completo"],
    src: "/portfolio/reel-horizontal.mp4",
    poster: "/portfolio/reel-horizontal.jpg",
    orientation: "horizontal",
  },
]
