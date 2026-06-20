// Contenido de la Política de Privacidad. Ver docs/SPEC_privacy_policy.md.
// UI copy en español (cliente boliviano); válido para Meta/WhatsApp.

export const CONTACT_EMAIL = "mirko@mirkocalzadilla.com"
export const LAST_UPDATED = "20 de junio de 2026"

export type Block = { type: "p"; text: string } | { type: "list"; items: string[] }
export type Section = { title: string; blocks: Block[] }

export const SECTIONS: Section[] = [
  {
    title: "Responsable",
    blocks: [
      {
        type: "p",
        text: `El responsable del tratamiento de tus datos es Mirko Calzadilla. Para cualquier consulta sobre esta política o sobre tus datos, puedes escribir a ${CONTACT_EMAIL}.`,
      },
    ],
  },
  {
    title: "Qué datos recogemos",
    blocks: [
      {
        type: "p",
        text: "Cuando nos contactas por WhatsApp recogemos únicamente los datos necesarios para atenderte:",
      },
      {
        type: "list",
        items: [
          "Tu número de teléfono de WhatsApp.",
          "Tu nombre (el que muestra tu perfil de WhatsApp o el que nos indiques).",
          "El contenido de los mensajes que envías y que intercambiamos contigo.",
        ],
      },
    ],
  },
  {
    title: "Para qué usamos tus datos",
    blocks: [
      {
        type: "p",
        text: "Usamos tus datos exclusivamente para:",
      },
      {
        type: "list",
        items: [
          "Responder tus consultas sobre el curso y los servicios.",
          "Gestionar el seguimiento de leads y de las ventas (atención y coordinación de la compra).",
        ],
      },
      {
        type: "p",
        text: "No usamos tus datos para publicidad de terceros ni los vendemos a nadie.",
      },
    ],
  },
  {
    title: "Con quién compartimos tus datos",
    blocks: [
      {
        type: "p",
        text: "Para poder atenderte, tus datos se procesan a través de los siguientes proveedores:",
      },
      {
        type: "list",
        items: [
          "Meta / WhatsApp: es el canal por el que nos escribes; el envío y la recepción de mensajes pasa por su plataforma.",
          "OpenAI: procesa el contenido de los mensajes para generar las respuestas automáticas del asistente.",
          "Proveedor de hosting: aloja la infraestructura donde se guardan y procesan las conversaciones.",
        ],
      },
      {
        type: "p",
        text: "Cada uno de estos proveedores trata los datos según sus propias políticas de privacidad.",
      },
    ],
  },
  {
    title: "Conservación de los datos",
    blocks: [
      {
        type: "p",
        text: "Conservamos tus datos mientras dure tu consulta o la relación comercial y durante el tiempo necesario para dar seguimiento. Cuando dejan de ser necesarios, los eliminamos o los anonimizamos.",
      },
    ],
  },
  {
    title: "Tus derechos",
    blocks: [
      {
        type: "p",
        text: "En cualquier momento puedes solicitar:",
      },
      {
        type: "list",
        items: [
          "Acceder a los datos que tenemos sobre ti.",
          "Rectificar datos incorrectos o desactualizados.",
          "Eliminar tus datos de nuestros registros.",
        ],
      },
      {
        type: "p",
        text: `Para ejercer cualquiera de estos derechos, escríbenos a ${CONTACT_EMAIL} y atenderemos tu solicitud.`,
      },
    ],
  },
  {
    title: "Canal de WhatsApp y Meta",
    blocks: [
      {
        type: "p",
        text: "El contacto se realiza a través de WhatsApp. Además de esta política, el uso de WhatsApp se rige también por las políticas y condiciones de Meta, propietaria de la plataforma.",
      },
    ],
  },
  {
    title: "Cambios a esta política",
    blocks: [
      {
        type: "p",
        text: "Podemos actualizar esta política cuando sea necesario. La versión vigente es siempre la publicada en esta página, con la fecha de última actualización indicada arriba.",
      },
    ],
  },
]
