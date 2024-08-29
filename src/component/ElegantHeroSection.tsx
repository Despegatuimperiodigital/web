import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send, Sparkles, MessageSquare, ChevronDown, Check } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const businessChallenges = [
  { icon: "📊", title: "Optimizar procesos" },
  { icon: "🤝", title: "Experiencia del cliente" },
  { icon: "🔒", title: "Seguridad de datos" },
  { icon: "🚀", title: "Escalar infraestructura" },
  { icon: "🧠", title: "Soluciones de IA" },
  { icon: "💡", title: "Innovación de productos" }
]

const trustedCompanies = [
  { name: "TechNova", logo: "/placeholder.svg?height=30&width=100", industry: "Tecnología" },
  { name: "FinEdge", logo: "/placeholder.svg?height=30&width=100", industry: "Finanzas" },
  { name: "EcoSmart", logo: "/placeholder.svg?height=30&width=100", industry: "Sostenibilidad" },
  { name: "HealthPulse", logo: "/placeholder.svg?height=30&width=100", industry: "Salud" },
  { name: "LogiPro", logo: "/placeholder.svg?height=30&width=100", industry: "Logística" },
  { name: "RetailFuture", logo: "/placeholder.svg?height=30&width=100", industry: "Comercio" }
]

export default function ElegantHeroSection() {
  const [userQuery, setUserQuery] = useState("")
  const [conversation, setConversation] = useState<{ type: 'user' | 'bot', content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const handleChallengeSelect = (challenge: string) => {
    setSelectedChallenge(challenge)
    setShowChat(true)
    handleSubmit(challenge)
  }

  const handleSubmit = (query: string) => {
    if (query.trim()) {
      setConversation(prev => [...prev, { type: 'user', content: query }])
      setIsLoading(true)
      setUserQuery("")
      
      setTimeout(() => {
        const responses = [
          `Excelente elección. Nuestra solución de IA Adaptativa está diseñada para abordar "${query}". ¿Le interesaría conocer cómo hemos ayudado a empresas a aumentar su eficiencia en un 30%?`,
          `"${query}" es crucial en el panorama actual. Nuestro Análisis Predictivo ha permitido a clientes anticipar tendencias con un 85% de precisión. ¿Exploramos su aplicación en su sector?`,
          `Su interés en "${query}" refleja visión. Nuestra Plataforma de Integración Cloud ha reducido costos de IT hasta en un 40%. ¿Le gustaría una demo personalizada?`,
          `"${query}" es un desafío común. Nuestras Soluciones de Automatización han reducido errores en un 60% y aumentado productividad en un 25%. ¿Analizamos su potencial impacto?`,
          `Enfocarse en "${query}" demuestra innovación. Nuestro Sistema de Gestión de Datos en Tiempo Real acelera decisiones un 50%. ¿Exploramos cómo podría darle ventaja competitiva?`
        ]
        const botResponse = responses[Math.floor(Math.random() * responses.length)]
        setConversation(prev => [...prev, { type: 'bot', content: botResponse }])
        setIsLoading(false)
      }, 1500)
    }
  }

  const titleWords = "Eleve su Visión Empresarial con CloudHub".split(" ")

  return (
    <section className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/document-pveiX76s4q42lmGwQ2odGa3He7XWwQ.jpeg" 
          alt="Cityscape with cloud technology" 
          className="w-full h-full object-cover brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-900/20"></div>
      </div>
      <div className="max-w-5xl w-full space-y-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ 
                  opacity: 1, 
                  filter: "blur(0px)",
                  y: [0, -5, 0],
                  transition: {
                    opacity: { duration: 1, delay: i * 0.2 },
                    filter: { duration: 1, delay: i * 0.2 },
                    y: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }
                  }
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: titleWords.length * 0.2 }}
            className="text-base md:text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Descubra soluciones cloud vanguardistas para potenciar la innovación y el crecimiento sostenible.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className={`bg-white/60 backdrop-blur-md shadow-lg rounded-xl p-6 transition-all duration-500 ease-in-out ${showChat ? 'h-[450px]' : 'h-auto'}`}>
            {!showChat ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  ¿Qué desafío empresarial le gustaría abordar?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {businessChallenges.map((challenge, index) => (
                    <Button
                      key={index}
                      onClick={() => handleChallengeSelect(challenge.title)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg p-2 text-xs text-left transition duration-300 flex items-center justify-between group h-full"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{challenge.icon}</span>
                        <span className="font-medium">{challenge.title}</span>
                      </div>
                      <ChevronDown className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  ))}
                </div>
                <div className="text-center space-y-3">
                  <p className="text-xs text-gray-700">
                    ¿No encuentra su desafío específico? Descríbalo aquí:
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(userQuery); setShowChat(true); }} className="flex items-center space-x-2 max-w-md mx-auto">
                    <Input
                      type="text"
                      placeholder="Describa su desafío empresarial..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="flex-grow bg-white/50 border-none focus:ring-1 focus:ring-blue-400 rounded-lg py-1.5 text-xs"
                    />
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg p-1.5 transition duration-300"
                    >
                      <Send className="h-3 w-3" />
                      <span className="sr-only">Enviar mensaje</span>
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 h-[350px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-4">
                  <AnimatePresence>
                    {conversation.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-2 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                            : 'bg-white/70 text-gray-800'
                        }`}>
                          <p className="text-xs" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/70 text-gray-800 p-2 rounded-lg">
                        <p className="text-xs" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Analizando su consulta...</p>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(userQuery); }} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Haga una pregunta o describa otro desafío..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="flex-grow bg-white/50 border-none focus:ring-1 focus:ring-blue-400 rounded-lg py-1.5 text-xs"
                  />
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg p-1.5 transition duration-300"
                    disabled={isLoading}
                  >
                    <Send className="h-3 w-3" />
                    <span className="sr-only">Enviar mensaje</span>
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Empresas Líderes que Confían en CloudHub
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {trustedCompanies.map((company, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg shadow-sm p-2 flex flex-col items-center justify-center space-y-1 transition-all duration-300 hover:shadow-md"
              >
                <img src={company.logo} alt={`${company.name} logo`} className="h-5 object-contain" />
                <p className="font-medium text-gray-800 text-xs text-center">{company.name}</p>
                <p className="text-[10px] text-gray-600 text-center">{company.industry}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Button className="bg-white/80 text-blue-600 hover:bg-white/90 rounded-full px-4 py-1.5 text-xs font-medium transition duration-300">
              Ver Más Casos de Éxito
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}