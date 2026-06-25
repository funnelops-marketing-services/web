import { redirect } from 'next/navigation'

// Inbox y Conversaciones convergen en una sola vista (Lote 4, mínima). Mantener el
// item de nav redirigiendo evita la pantalla muerta que confundió en la UAT (C1).
export default function ConversationsPage() {
  redirect('/crm/inbox')
}
