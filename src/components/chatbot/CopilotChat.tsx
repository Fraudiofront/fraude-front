import React, { useState, useEffect, useRef } from "react"
import { claimsService, ChatMessage } from "@/services/claims"
import { MessageSquare, Sparkles, Send, X, ArrowRight, User, Terminal, Database } from "lucide-react"

interface CopilotChatProps {
  claimId: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function CopilotChat({ claimId, isOpen, setIsOpen }: CopilotChatProps) {
  const [activeTab, setActiveTab] = useState<"case" | "global">("case")
  
  // Historial de mensajes independiente para el Siniestro (Contextual)
  const [caseMessages, setCaseMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `Hola, soy tu **Copiloto AI de Siniestro**. Estoy conectado al expediente **${claimId}** (Alejandro Mendoza). Interrógame sobre las banderas de fraude disparadas o pregúntame qué responderle al asegurado.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  // Historial de mensajes independiente para la Consulta Agéntica (Global)
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Bienvenido al **Centro de Control e Integridad**. Aquí puedes hacer **Consultas Agénticas Globales** sobre la concentración de alertas rojas, proveedores marcados u anomalías en sucursales a nivel nacional.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Prompts sugeridos por pestaña (Escenarios A, B y C descritos en el reto)
  const casePrompts = [
    {
      title: "¿Por qué el riesgo es alto?",
      text: "¿Por qué este caso tiene score de riesgo alto?"
    },
    {
      title: "¿Qué responderle al cliente?",
      text: "El cliente me pregunta qué documento le hace falta para pasar el flujo normal. ¿Qué le respondo?"
    }
  ]

  const globalPrompts = [
    {
      title: "Concentración de alertas rojas",
      text: "¿Qué proveedores concentran la mayor cantidad de alertas rojas este mes?"
    }
  ]

  // Mantener scroll al final de la burbuja activa
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [caseMessages, globalMessages, isTyping, activeTab])

  // Manejar el envío de mensajes
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    // Crear mensaje del usuario
    const userMsg: ChatMessage = {
      sender: "user",
      text,
      timestamp
    }

    // Guardar en la pestaña correspondiente
    if (activeTab === "case") {
      setCaseMessages((prev) => [...prev, userMsg])
    } else {
      setGlobalMessages((prev) => [...prev, userMsg])
    }

    setInputValue("")
    setIsTyping(true)

    try {
      // Simular latencia del LLM (500ms)
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const reply = await claimsService.sendMessageToAgent(claimId, text, activeTab)
      
      const aiMsg: ChatMessage = {
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      if (activeTab === "case") {
        setCaseMessages((prev) => [...prev, aiMsg])
      } else {
        setGlobalMessages((prev) => [...prev, aiMsg])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsTyping(false)
    }
  }

  // Renderizador de Markdown simple para negritas
  const formatText = (txt: string) => {
    return txt.split("\n").map((line, i) => {
      let formatted = line
      
      // Reemplazar negritas **text** con <strong>text</strong>
      const boldRegex = /\*\*(.*?)\*\*/g
      formatted = formatted.replace(boldRegex, "<strong>$1</strong>")

      return (
        <p key={i} className="text-xs my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
      )
    })
  }

  // Obtener mensajes de la pestaña activa
  const activeMessages = activeTab === "case" ? caseMessages : globalMessages
  const activePrompts = activeTab === "case" ? casePrompts : globalPrompts

  return (
    <>
      {/* Botón flotante para abrir (Subtly Rounded) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-brand-blue text-white rounded-lg flex items-center justify-center hover:bg-brand-navy border border-brand-lightBlue/30 z-50 hover:scale-105 shadow-md transition-all duration-300"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00adef] rounded-full animate-ping" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00adef] rounded-full" />
        </button>
      )}

      {/* Panel de Chat Lateral Colapsable */}
      <div 
        className={`fixed top-0 right-0 h-screen w-96 bg-white border-l border-slate-200 flex flex-col justify-between transition-transform duration-300 z-40 shadow-premium ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera del chat */}
        <div className="p-4 bg-brand-navy text-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-lightBlue/10 flex items-center justify-center text-brand-lightBlue border border-brand-lightBlue/20 rounded-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-white">
                  CENTRO DE CONTROL IA
                </h4>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block -mt-0.5">
                  Auditoría Agéntica
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de Pestañas (Subtly Rounded y de alto contraste) */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-md">
            <button
              onClick={() => setActiveTab("case")}
              className={`py-1.5 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                activeTab === "case"
                  ? "bg-brand-blue text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Caso Actual
            </button>
            <button
              onClick={() => setActiveTab("global")}
              className={`py-1.5 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                activeTab === "global"
                  ? "bg-brand-blue text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Consulta Global
            </button>
          </div>
        </div>

        {/* Historial de Mensajes de la Pestaña Activa */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {activeMessages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-full shrink-0 ${
                msg.sender === "user" 
                  ? "bg-brand-lightBlue text-white" 
                  : "bg-brand-navy text-brand-lightBlue border border-brand-lightBlue/20"
              }`}>
                {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-brand-lightBlue" />}
              </div>

              {/* Burbuja Soft Rounded */}
              <div className={`p-3 text-xs border rounded-md shadow-sm ${
                msg.sender === "user"
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white text-brand-navy border-slate-200"
              }`}>
                <div className="space-y-1.5">
                  {formatText(msg.text)}
                </div>
                <span className={`text-[8px] block text-right mt-1 font-semibold ${
                  msg.sender === "user" ? "text-slate-200" : "text-slate-400"
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Escribiendo */}
          {isTyping && (
            <div className="flex gap-2 max-w-[80%]">
              <div className="w-7 h-7 bg-brand-navy flex items-center justify-center border border-brand-lightBlue/20 text-brand-lightBlue shrink-0 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-brand-lightBlue animate-spin" />
              </div>
              <div className="p-3 bg-white border border-slate-200 text-xs flex items-center gap-1 rounded-md shadow-sm">
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Panel de Preguntas Sugeridas / Prompts por Escenarios */}
        <div className="p-3 border-t border-slate-200 bg-white space-y-1.5">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block px-1 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-brand-blue" />
            {activeTab === "case" ? "Preguntas sobre el Siniestro" : "Consultas de Control Agéntico"}
          </span>
          <div className="flex flex-col gap-1.5">
            {activePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                className="w-full text-left px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-brand-lightBlue hover:bg-slate-50 text-[10.5px] font-bold text-brand-navy hover:text-brand-blue flex items-center justify-between group transition-all"
              >
                <span>{prompt.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Input de Texto */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder={activeTab === "case" ? "Pregunta al copiloto..." : "Escribe tu consulta agéntica..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
            className="flex-1 px-3.5 py-2.5 border border-slate-200 text-xs text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-lightBlue focus:border-brand-lightBlue rounded-md font-sans transition-all"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="w-10 h-10 bg-brand-blue text-white flex items-center justify-center hover:bg-brand-navy cursor-pointer shrink-0 rounded-md shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </>
  )
}
