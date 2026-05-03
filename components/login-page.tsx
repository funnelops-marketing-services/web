"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginPageProps {
  onLogin: () => void
  onBack?: () => void
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState("mirko@calzadilla.com")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Brand panel */}
      <div className="relative md:w-1/2 min-h-[40vh] md:min-h-screen flex items-end p-8 md:p-14 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-violet-900/40 to-black" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-fuchsia-700/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-blue-700/15 rounded-full blur-[100px]" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 md:top-14 md:left-14 z-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-white/80 font-bold text-xs tracking-[0.2em]">MIRKO • CRM</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.05] mb-5 text-balance">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">CRM</span>{" "}
            que trabaja
            <br />
            contigo
          </h2>
          <p className="text-zinc-400 font-normal leading-relaxed text-sm md:text-base text-pretty">
            Tu agente IA atiende los leads de WhatsApp, los califica y los mueve por el pipeline.
            Tú intervienes solo cuando hace falta.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-14 bg-black relative">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-white font-bold text-xs tracking-[0.2em]">MIRKO • CRM</span>
          </div>

          {/* Desktop brand top */}
          <div className="hidden md:flex items-center gap-2 mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-white font-bold text-xs tracking-[0.2em]">MIRKO • CRM</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-zinc-500 font-normal text-sm mb-10">
            Ingresa para gestionar tus oportunidades y conversaciones.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-500 text-xs font-normal tracking-widest uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 h-11 text-white placeholder:text-zinc-700 focus:border-violet-500 focus-visible:ring-0 focus-visible:ring-offset-0 font-normal"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-500 text-xs font-normal tracking-widest uppercase">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 h-11 text-white placeholder:text-zinc-700 focus:border-violet-500 focus-visible:ring-0 focus-visible:ring-offset-0 font-normal"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button type="button" className="text-zinc-500 hover:text-violet-400 text-sm font-normal transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-b from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 text-white font-bold rounded-full shadow-[0_0_30px_-8px_rgba(139,92,246,0.7)] transition-all"
            >
              Iniciar sesión
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="text-zinc-700 text-xs font-normal">o</span>
            <div className="flex-1 h-px bg-zinc-900" />
          </div>

          {/* Back link */}
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-white text-sm font-normal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la landing
          </button>
        </div>
      </div>
    </div>
  )
}
