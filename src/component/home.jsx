import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Send, ArrowRight } from "lucide-react"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    color: #333;
  }

  .hero-section {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow: hidden;
    z-index:999;
  }

  .background-image {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .background-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.75) contrast(1.25);
  }

  .background-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
  z-index: 5; /* El fondo debe estar por detrás del título */
}

  .content-wrapper {
    max-width: 64rem;
    width: 100%;
    position: relative;
    z-index: 10;
  }

  .content-wrapper > * + * {
    margin-top: 2.5rem;
  }

  .text-center {
    text-align: center;
  }

  .space-y-4 > * + * {
    margin-top: 1rem;
  }

 .hero-title {
  font-family: 'Nunito', sans-serif;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  overflow: hidden;
  z-index: 10000; /* Asegurar que el título esté en la capa superior */
  position: bock; /* Garantizar que no sea afectado por otras posiciones absolutas */
  margin-top: 2rem; /* Asegurar que el título tenga un margen visible */

}

  @media (min-width: 768px) {
    .hero-title {
      font-size: 3rem;
      line-height: 1;
    }
  }

  .hero-title span {
    display: inline-block;
    margin-right: 0.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
    line-height: 1.5rem;
    color: #e5e7eb;
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.625;
  }

  @media (min-width: 768px) {
    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  }

  .chat-container {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.5s ease-in-out;
  }

  .chat-container.expanded {
    height: 450px;
  }

  .chat-title {
    font-family: 'Nunito', sans-serif;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: #f3f4f6;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .challenge-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (min-width: 768px) {
    .challenge-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .challenge-button {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f3f4f6;
    padding: 0.75rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    text-align: left;
  }

  .challenge-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .challenge-button-content {
    display: flex;
    align-items: center;
  }

  .challenge-button-content span:first-child {
    margin-right: 0.5rem;
    font-size: 1rem;
  }

  .challenge-button svg {
    width: 1rem;
    height: 1rem;
    color: #d1d5db;
  }

  .input-form {
    display: flex;
    align-items: center;
    max-width: 28rem;
    margin: 0 auto;
  }

  .input-form > * + * {
    margin-left: 0.5rem;
  }

  .text-input {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #f3f4f6;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    outline: none;
  }

  .text-input:focus {
    box-shadow: 0 0 0 2px rgba(243, 63, 49, 0.5);
  }

  .text-input::placeholder {
    color: #9ca3af;
  }

  .submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-weight: 500;
    color: white;
    background-image: linear-gradient(to right, #F33F31, #E77171);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }

  .submit-button:hover {
    background-image: linear-gradient(to right, #E02D1F, #D55F5F);
  }

  .submit-button svg {
    width: 1rem;
    height: 1rem;
  }

  .chat-messages {
    height: 350px;
    overflow-y: auto;
    padding-right: 1rem;
    margin-bottom: 1rem;
  }

  .chat-message {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    max-width: 80%;
    margin-bottom: 0.5rem;
  }

  .chat-message-user {
    background-image: linear-gradient(to right, #F33F31, #E77171);
    color: white;
    margin-left: auto;
  }

  .chat-message-bot {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    margin-right: auto;
  }

  .trusted-companies {
    margin-top: 2.5rem;
  }

  .trusted-companies h3 {
    font-family: 'Nunito', sans-serif;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: white;
    text-align: center;
    margin-bottom: 1rem;
  }

  .company-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (min-width: 768px) {
    .company-grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }

  .company-card {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border-radius: 0.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .company-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .company-card img {
    height: 1.25rem;
    object-fit: contain;
    margin-bottom: 0.25rem;
  }

  .company-card p:first-of-type {
    font-weight: 500;
    color: #e5e7eb;
    font-size: 0.75rem;
    text-align: center;
  }

  .company-card p:last-of-type {
    font-size: 0.625rem;
    color: #9ca3af;
    text-align: center;
  }

  .more-cases-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    color: #F33F31;
    background-color: transparent;
    border: 2px solid #F33F31;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .more-cases-button:hover {
    background-color: #F33F31;
    color: white;
  }
    .chat-message-bot p {
  white-space: pre-wrap;
}

  .more-cases-button svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
  }
`

// Button component
const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

// Input component
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

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
  { name: "Decohaus", logo: "/placeholder.svg?height=30&width=100", industry: "Comercio" },
  { name: "Cruzeiro", logo: "https://images.jumpseller.com/store/cruzeiro-gomas/store/logo/Captura_de_pantalla_2024-08-20_a_la_s__10.02.46.png?1724162674?height=30&width=100", industry: "Comercio" },
  { name: "CISS", logo: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_300/https://ciss.cl/wp-content/uploads/2021/12/Logo-CISS-1.png?height=30&width=100", industry: "Inmobiliaria" }
]

export default function ElegantHeroSection() {
  const [userQuery, setUserQuery] = useState("")
  const [conversation, setConversation] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState("")
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge)
    setShowChat(true)
    handleSubmit(challenge)
  }
  const handleSubmit = async (query) => {
    if (query.trim()) {
      setConversation(prev => [...prev, { type: 'user', content: query }]);
      setIsLoading(true);
      setUserQuery("");
  
      try {
        // Realiza la solicitud POST a tu API
        const response = await fetch('http://localhost:4008/api/despega-ai/crear', { // Asegúrate de que esta URL es la correcta para tu API
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ searchText: query })
        });
        
        console.log(response)
        if (!response.ok) {
          throw new Error('Error en la solicitud al servidor');
        }
  
        const data = await response.json();
  
        // Actualiza la conversación con la respuesta del bot
        setConversation(prev => [...prev, { type: 'bot', content: data.message }]);
  
      } catch (error) {
        console.error('Error:', error);
        setConversation(prev => [...prev, { type: 'bot', content: 'Hubo un error al procesar su consulta. Intente nuevamente más tarde.' }]);
      }
  
      setIsLoading(false);
    }
  }
  
  const titleWords = "Eleve su Visión Empresarial con CloudHub".split(" ")

  return (
    <>
      <style>{styles}</style>
      <section className="hero-section">
        <div className="background-image">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/document-pveiX76s4q42lmGwQ2odGa3He7XWwQ.jpeg" 
            alt="Cityscape with cloud technology" 
          />
          <div className="background-overlay"></div>
        </div>
        <div className="content-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="hero-title" Style="margin-top:56px">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                 
                  transition={{
                    opacity: { duration: 1, delay: i * 0.2 },
                    filter: { duration: 1, delay: i * 0.2 },
                    y: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeInOut"
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
              className="hero-subtitle"
            >
              Descubra soluciones cloud vanguardistas para potenciar la innovación y el crecimiento sostenible.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="chat-container"
          >
            {!showChat ? (
              <div>
                <h2 className="chat-title">
                  ¿Qué desafío empresarial le gustaría abordar?
                </h2>
                <div className="challenge-grid">
                  {businessChallenges.map((challenge, index) => (
                    <Button
                      key={index}
                      onClick={() => handleChallengeSelect(challenge.title)}
                      className="challenge-button"
                    >
                      <div className="challenge-button-content">
                        <span>{challenge.icon}</span>
                        <span>{challenge.title}</span>
                      </div>
                      <ChevronDown />
                    </Button>
                  ))}
                </div>
                <div className="text-center" style={{marginTop: '1rem'}}>
                  <p style={{fontSize: '0.75rem', color: '#d1d5db', marginBottom: '0.75rem'}}>
                    ¿No encuentra su desafío específico? Descríbalo aquí:
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(userQuery); setShowChat(true); }} className="input-form">
                    <Input
                      type="text"
                      placeholder="Describa su desafío empresarial..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="text-input"
                    />
                    <Button 
                      type="submit" 
                      className="submit-button"
                    >
                      <Send />
                      <span className="sr-only">Enviar mensaje</span>
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <div className="chat-messages">
                  <AnimatePresence>
                    {conversation.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`chat-message ${message.type === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}
                      >
                        <p>{message.content}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="chat-message chat-message-bot"
                    >
                      <p>Analizando su consulta...</p>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(userQuery); }} className="input-form">
                  <Input
                    type="text"
                    placeholder="Haga una pregunta o describa otro desafío..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="text-input"
                  />
                  <Button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading}
                  >
                    <Send />
                    <span className="sr-only">Enviar mensaje</span>
                  </Button>
                </form>
              </>
            )}
          </motion.div>
{/*
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="trusted-companies"
          >
            <h3>
              Empresas Líderes que Confían en CloudHub
            </h3>
            <div className="company-grid">
              {trustedCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="company-card"
                >
                  <img src={company.logo} alt={`${company.name} logo`} />
                  <p>{company.name}</p>
                  <p>{company.industry}</p>
                </motion.div>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <Button className="more-cases-button">
                Ver Más Casos de Éxito
                <ArrowRight />
              </Button>
            </div>
          </motion.div>
        */}
        </div>
      </section>
    </>
  )
}