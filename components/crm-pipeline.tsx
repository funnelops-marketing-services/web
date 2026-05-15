"use client"

import { useState } from "react"
import { Phone, Calendar, GripVertical, Send, Bot } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Lead {
  id: string
  name: string
  phone: string
  date: string
  course: string
  messages: { from: "lead" | "agent" | "ai"; text: string; time: string }[]
}

const initialLeads: Record<string, Lead[]> = {
  "Nuevo Lead": [
    {
      id: "1",
      name: "Carla Méndez",
      phone: "+58 412 555 1234",
      date: "03 May 2026",
      course: "Curso Tomas de Cámara Pro",
      messages: [
        { from: "lead", text: "Hola, vi tu anuncio en Instagram sobre el curso de tomas de cámara", time: "09:24" },
        { from: "ai", text: "¡Hola Carla! Gracias por tu interés. El curso incluye 8 módulos sobre composición, movimiento de cámara, iluminación y color. ¿Eres creadora de contenido o tienes una marca?", time: "09:24" },
        { from: "lead", text: "Tengo una marca de skincare y quiero mejorar mis videos", time: "09:31" },
      ],
    },
    {
      id: "2",
      name: "Diego Ramírez",
      phone: "+58 414 998 7766",
      date: "02 May 2026",
      course: "Mentoría 1:1",
      messages: [
        { from: "lead", text: "Buenas, ¿cómo es la mentoría 1:1?", time: "14:02" },
        { from: "ai", text: "¡Hola Diego! La mentoría es de 8 sesiones individuales con Mirko, enfocadas en tu marca. Incluye análisis de tu contenido actual, plan de producción y revisión semanal. ¿Te paso el PDF con detalles?", time: "14:02" },
      ],
    },
  ],
  "Seguimiento": [
    {
      id: "3",
      name: "Studio Verde",
      phone: "+58 424 333 1010",
      date: "01 May 2026",
      course: "Branding para Empresas",
      messages: [
        { from: "lead", text: "Somos una agencia y queremos capacitar al equipo", time: "11:15" },
        { from: "ai", text: "¡Excelente! Mirko ofrece programas in-company personalizados. ¿Cuántas personas serían y qué áreas quieren reforzar?", time: "11:15" },
        { from: "lead", text: "Somos 6 entre community managers y editores", time: "11:48" },
        { from: "ai", text: "Perfecto. Te armo una propuesta con módulos enfocados en tu equipo. ¿Te llamamos hoy o prefieres mañana?", time: "11:49" },
      ],
    },
  ],
  "PDF Enviado": [
    {
      id: "4",
      name: "Lucía Torres",
      phone: "+58 416 222 4567",
      date: "29 Abr 2026",
      course: "Curso Tomas de Cámara Pro",
      messages: [
        { from: "lead", text: "Recibí el PDF del curso, lo estoy revisando", time: "16:30" },
        { from: "ai", text: "Genial Lucía. Si tienes cualquier duda sobre los módulos o las facilidades de pago, escríbeme. Tenemos cupos limitados para la próxima cohorte.", time: "16:31" },
      ],
    },
    {
      id: "5",
      name: "Andrés Pacheco",
      phone: "+58 412 778 9900",
      date: "28 Abr 2026",
      course: "Mentoría 1:1",
      messages: [
        { from: "lead", text: "Ya leí la propuesta, lo conversaré con mi socio", time: "10:05" },
        { from: "ai", text: "Perfecto Andrés. Quedamos atentos. Si quieren agendar una llamada con Mirko para resolver dudas antes de decidir, también es posible.", time: "10:06" },
      ],
    },
  ],
}

const columns = [
  { name: "Nuevo Lead", color: "violet" },
  { name: "Seguimiento", color: "fuchsia" },
  { name: "PDF Enviado", color: "blue" },
]

export function CrmPipeline() {
  const [leads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(initialLeads["Nuevo Lead"][0])
  const [autoReply, setAutoReply] = useState(true)
  const [messageInput, setMessageInput] = useState("")
  const [draggedLead, setDraggedLead] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
        {/* Left - Kanban */}
        <div className="w-full lg:w-[70%] p-6 overflow-hidden flex flex-col">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Oportunidades activas</h2>
              <p className="text-zinc-500 font-normal text-xs mt-0.5">
                Arrastra las tarjetas entre columnas para actualizar el estado.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-normal">Agente IA activo</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
            {columns.map((column) => (
              <div
                key={column.name}
                className="flex flex-col bg-gradient-to-b from-white/[0.03] to-white/0 border border-white/5 rounded-2xl overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => setDraggedLead(null)}
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        column.color === "violet"
                          ? "bg-violet-400"
                          : column.color === "fuchsia"
                          ? "bg-fuchsia-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <h3 className="font-bold text-white text-sm">{column.name}</h3>
                  </div>
                  <span className="bg-white/5 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-normal border border-white/5">
                    {leads[column.name]?.length || 0}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {leads[column.name]?.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setDraggedLead(lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      className={`group bg-zinc-950/80 border rounded-xl p-3.5 cursor-pointer transition-all ${
                        selectedLead?.id === lead.id
                          ? "border-violet-500/60 shadow-[0_0_25px_-10px_rgba(139,92,246,0.6)] bg-violet-950/20"
                          : "border-white/5 hover:border-violet-500/30 hover:bg-white/[0.03]"
                      } ${draggedLead === lead.id ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-zinc-700 mt-0.5 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate mb-1">{lead.name}</p>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Phone className="w-3 h-3 text-violet-400" />
                            <span className="text-zinc-400 font-normal text-xs truncate">{lead.phone}</span>
                          </div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-2">
                            <span className="text-violet-300 text-[10px] font-normal">{lead.course}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                              <Calendar className="w-2.5 h-2.5" />
                              <span className="font-normal">{lead.date}</span>
                            </div>
                            <span className="text-[10px] text-zinc-600 font-normal">
                              {lead.messages.length} msgs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!leads[column.name] || leads[column.name].length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-zinc-700 text-xs font-normal">Sin leads</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Chat */}
        <div className="hidden lg:flex w-[30%] border-l border-white/5 flex-col bg-zinc-950/40">
          {selectedLead ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                      {selectedLead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{selectedLead.name}</p>
                      <p className="text-zinc-500 text-xs font-normal">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 text-[10px] font-normal">Live</span>
                  </div>
                </div>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                  <span className="text-violet-300 text-[10px] font-normal">{selectedLead.course}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedLead.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === "lead" ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-[85%]">
                      {msg.from === "ai" && (
                        <div className="flex items-center gap-1 mb-1 justify-end">
                          <Bot className="w-3 h-3 text-violet-400" />
                          <span className="text-violet-400 text-[10px] font-normal">Agente IA</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 ${
                          msg.from === "lead"
                            ? "bg-white/5 border border-white/5 text-white rounded-bl-md"
                            : msg.from === "ai"
                            ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-md shadow-[0_0_20px_-10px_rgba(139,92,246,0.6)]"
                            : "bg-fuchsia-600 text-white rounded-br-md"
                        }`}
                      >
                        <p className="text-sm font-normal leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-[10px] text-zinc-600 mt-1 font-normal ${msg.from === "lead" ? "text-left" : "text-right"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 space-y-3">
                {/* Auto-reply toggle */}
                <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Bot className={`w-4 h-4 flex-shrink-0 ${autoReply ? "text-violet-400" : "text-zinc-600"}`} />
                    <Label htmlFor="auto-reply" className="text-zinc-300 text-xs font-normal cursor-pointer truncate">
                      Auto-reply <span className="text-zinc-500">(IA contesta por ti)</span>
                    </Label>
                  </div>
                  <Switch
                    id="auto-reply"
                    checked={autoReply}
                    onCheckedChange={setAutoReply}
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder={autoReply ? "El agente IA está respondiendo..." : "Escribe un mensaje..."}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={autoReply}
                    className={`flex-1 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-600 h-10 rounded-full text-sm font-normal ${
                      autoReply ? "opacity-50 cursor-not-allowed" : "focus:border-violet-500/50"
                    }`}
                  />
                  <Button
                    disabled={autoReply || !messageInput.trim()}
                    className="h-10 w-10 p-0 bg-gradient-to-b from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-full"
                    aria-label="Enviar"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5">
                  <Phone className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-zinc-500 font-normal text-sm">Selecciona un lead para ver la conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

