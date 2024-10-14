import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, ArrowRight, CheckCircle, Zap, BarChart, Globe, Menu, Shield, List, Bell, Play, Pause } from 'lucide-react'

// Button component
const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={`button ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

// Input component
const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={`input ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// Label component
const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`label ${className}`}
      {...props}
    />
  )
})
Label.displayName = "Label"

// Accordion components
const Accordion = ({ children, ...props }) => {
  return (
    <div className="accordion" {...props}>
      {children}
    </div>
  )
}

const AccordionItem = ({ children, value, ...props }) => {
  return (
    <div className="accordion-item" data-state={value} {...props}>
      {children}
    </div>
  )
}

const AccordionTrigger = ({ children, ...props }) => {
  return (
    <h3 className="accordion-trigger" data-state="closed" {...props}>
      <button type="button">
        {children}
        <ChevronDown className="accordion-icon" />
      </button>
    </h3>
  )
}

const AccordionContent = ({ children, ...props }) => {
  return (
    <div className="accordion-content" data-state="closed" {...props}>
      <div>{children}</div>
    </div>
  )
}

export default function Scana() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', { name, email, company })
    setName('')
    setEmail('')
    setCompany('')
  }

  const toggleVideo = () => {
    const video = document.getElementById('demo-video')
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const AnimatedSection = ({ children, className }) => {
    const controls = useAnimation()
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

    useEffect(() => {
      if (inView) {
        controls.start('visible')
      }
    }, [controls, inView])

    return (
      <motion.section
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={shouldReduceMotion ? {} : fadeInUp}
        className={className}
      >
        {children}
      </motion.section>
    )
  }

  return (
    <div className="landing-page">
      <style jsx>{`
        /* CSS Variables for consistent theming */
        :root {
          --color-primary: #3182ce;
          --color-primary-dark: #2c5282;
          --color-secondary: #48bb78;
          --color-text: #2d3748;
          --color-text-light: #718096;
          --color-background: #ffffff;
          --color-background-alt: #f7fafc;
          --color-border: #e2e8f0;
          --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --transition-base: all 0.3s ease-in-out;
        }

        /* Global Styles */
        .landing-page {
          font-family: var(--font-sans);
          color: var(--color-text);
          line-height: 1.5;
        }

        /* Utility Classes */
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .text-center {
          text-align: center;
        }

        .flex {
          display: flex;
        }

        .flex-col {
          flex-direction: column;
        }

        .items-center {
          align-items: center;
        }

        .justify-between {
          justify-content: space-between;
        }

        .gap-4 {
          gap: 1rem;
        }

        /* Typography */
        .h1, .h2, .h3 {
          font-weight: 700;
          line-height: 1.2;
        }

        .h1 {
          font-size: 2.5rem;
        }

        .h2 {
          font-size: 2rem;
        }

        .h3 {
          font-size: 1.5rem;
        }

        .text-lg {
          font-size: 1.125rem;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        /* Buttons */
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.5;
          color: var(--color-background);
          background-color: var(--color-primary);
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: var(--transition-base);
        }

        .button:hover {
          background-color: var(--color-primary-dark);
        }

        .button-secondary {
          color: var(--color-primary);
          background-color: var(--color-background);
          border: 1px solid var(--color-primary);
        }

        .button-secondary:hover {
          color: var(--color-background);
          background-color: var(--color-primary);
        }

        /* Forms */
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          color: var(--color-text);
          background-color: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 0.25rem;
          transition: var(--transition-base);
        }

        .input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        }

        .label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text);
        }

        /* Header Styles */
        .header {
          background-color: var(--color-background);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-content {
          height: 4rem;
        }

        .logo {
          height: 2rem;
          width: auto;
        }

        .nav {
          display: none;
        }

        .nav a {
          color: var(--color-text-light);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-base);
        }

        .nav a:hover {
          color: var(--color-primary);
        }

        .menu-button {
          display: block;
        }

        /* Hero Section Styles */
        .hero {
          position: relative;
          padding: 5rem 0;
          background: linear-gradient(135deg, #ebf8ff 0%, #e6e6ff 100%);
          overflow: hidden;
        }

        .hero-content {
          max-width: 600px;
          margin-bottom: 2rem;
        }

        .hero-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          font-weight: 600;
        }

        .hero-feature svg {
          color: var(--color-secondary);
          margin-right: 0.75rem;
        }

        .signup-form {
          background-color: var(--color-background);
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 400px;
        }

        /* Features Section Styles */
        .features {
          padding: 5rem 0;
          background-color: var(--color-background);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background-color: var(--color-background);
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-base);
        }

        .feature-card:hover {
          box-shadow: var(--shadow-md);
        }

        .feature-icon {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .feature-icon svg {
          width: 2rem;
          height: 2rem;
          color: var(--color-primary);
        }

        /* Video Demo Section Styles */
        .video-demo {
          padding: 5rem 0;
          background-color: var(--color-background-alt);
        }

        .video-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-lg);
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-button {
          background-color: var(--color-primary);
          color: var(--color-background);
          border: none;
          border-radius: 9999px;
          padding: 1rem;
          cursor: pointer;
          transition: var(--transition-base);
        }

        .video-button:hover {
          background-color: var(--color-primary-dark);
          transform: scale(1.1);
        }

        /* Benefits Section Styles */
        .benefits {
          padding: 5rem 0;
          background-color: var(--color-background);
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          text-align: center;
        }

        .benefit-icon {
          width: 3rem;
          height: 3rem;
          color: var(--color-secondary);
          margin-bottom: 1rem;
        }

        /* Use Cases Section Styles */
        .use-cases {
          padding: 5rem 0;
          background-color: var(--color-primary);
          color: var(--color-background);
        }

        .use-cases-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .use-case-tag {
          background-color: var(--color-background);
          color: var(--color-primary);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-base);
        }

        .use-case-tag:hover {
          box-shadow: var(--shadow-md);
        }

        /* Testimonial Section Styles */
        .testimonial {
          padding: 5rem 0;
          background-color: var(--color-background);
        }

        .testimonial-quote {
          font-size: 1.5rem;
          font-style: italic;
          color: var(--color-text-light);
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        /* Progress Section Styles */
        .progress {
          padding: 5rem 0;
          background-color: var(--color-background-alt);
        }

        /* FAQ Section Styles */
        
        .faq {
          padding: 5rem 0;
          background-color: var(--color-background);
        }

        .accordion {
          max-width: 800px;
          margin: 0 auto;
        }

        .accordion-item {
          border-bottom: 1px solid var(--color-border);
        }

        .accordion-trigger {
          width: 100%;
          padding: 1rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text);
          cursor: pointer;
        }

        .accordion-icon {
          width: 1.5rem;
          height: 1.5rem;
          transition: transform 0.3s ease-in-out;
        }

        .accordion-item[data-state="open"] .accordion-icon {
          transform: rotate(180deg);
        }

        .accordion-content {
          padding-bottom: 1rem;
          font-size: 1rem;
          color: var(--color-text-light);
        }

        /* Footer Styles */
        .footer {
          background-color: var(--color-text);
          color: var(--color-background);
          padding: 4rem 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
        }

        .footer-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .footer-section p,
        .footer-section a {
          color: var(--color-text-light);
          margin-bottom: 0.5rem;
        }

        .footer-section a:hover {
          color: var(--color-background);
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .footer-bottom {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
          text-align: center;
          color: var(--color-text-light);
        }

        /* Final CTA Section Styles */
        .final-cta {
          background-color: var(--color-primary);
          color: var(--color-background);
          padding: 4rem 0;
          text-align: center;
        }

        /* Responsive Styles */
        @media (min-width: 768px) {
          .h1 {
            font-size: 3.5rem;
          }

          .h2 {
            font-size: 3rem;
          }

          .h3 {
            font-size: 2rem;
          }

          .nav {
            display: flex;
            gap: 2rem;
          }

          .menu-button {
            display: none;
          }

          .hero-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .hero-content {
            margin-bottom: 0;
          }

          .signup-form {
            margin-left: 2rem;
          }
        }
      `}</style>

      {/* Animated background */}
      <motion.div
        className="animated-background"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0.05) 25%, rgba(66, 153, 225, 0) 50%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="header"
      >
        <div className="container">
          <div className="header-content flex items-center justify-between">
            <div className="flex items-center">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20principal%20(1)-CsVSuWQ2PnSCq8owjvJ5fHvYdAy5XL.png"
                alt="Escana Logo"
                className="logo"
              />
            </div>
            <nav className="nav">
              {['Características', 'Demo', 'Beneficios', 'Casos de Uso', 'Contacto'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            <div className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="button">
                  Únete a la Lista de Espera
                </Button>
              </motion.div>
            </div>
            <motion.button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
          >
            <nav className="flex flex-col gap-4 p-4">
              {['Características', 'Demo', 'Beneficios', 'Casos de Uso', 'Contacto'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="button">
                  Únete a la Lista de Espera
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <AnimatedSection className="hero">
        <div className="container hero-container">
          <motion.div
            className="hero-content"
            variants={staggerChildren}
          >
            <motion.h1 variants={fadeInUp} className="h1">
              Verifica Identidades.{' '}
              <span style={{ color: 'var(--color-primary)' }}>Protege tu Local.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg">
              Simplifica la seguridad en tu local nocturno con verificación de identidad instantánea y análisis en tiempo real. Escana te ofrece control en segundos, listas inteligentes y datos para decisiones acertadas.
            </motion.p>
            <motion.div variants={staggerChildren} className="hero-features">
              {[
                'Verificación en 2 segundos',
                'Listas inteligentes de acceso',
                'Análisis en tiempo real'
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp} className="hero-feature">
                  <CheckCircle />
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="signup-form"
            variants={fadeInUp}
          >
            <h3 className="h3">Únete a la Lista de Espera</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="Tu nombre" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="tu@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="company">Nombre de Empresa</Label>
                <Input 
                  id="company"
                  type="text" 
                  placeholder="Tu empresa" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  required 
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit" className="button w-full">
                  Sé el Primero en Saber
                </Button>
              </motion.div>
            </form>
            <p className="text-sm text-center mt-4">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" style={{ color: 'var(--color-primary)' }}>Términos de Servicio</a>{' '}
              y{' '}
              <a href="#" style={{ color: 'var(--color-primary)' }}>Política de Privacidad</a>.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection id="características" className="features">
        <div className="container">
          <motion.h2 variants={fadeInUp} className="h2 text-center mb-16">Características del Producto</motion.h2>
          <motion.div variants={staggerChildren} className="features-grid">
            {[
              { icon: <Zap />, title: 'Control en 2 segundos', description: 'Escaneo rápido de documentos de identidad.' },
              { icon: <List />, title: 'Listas Inteligentes', description: 'Gestión de listas de vetados e invitados.' },
              { icon: <BarChart />, title: 'Analítica y Reportes', description: 'Información detallada del flujo de personas.' },
              { icon: <Bell />, title: 'Automatización de Seguridad', description: 'Alertas directas a la administración.' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="h3">{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Video Demo Section */}
      <AnimatedSection id="demo" className="video-demo">
        <div className="container">
          <motion.h2 variants={fadeInUp} className="h2 text-center mb-16">Ve Escana en Acción</motion.h2>
          <div className="video-wrapper">
            <motion.div
              variants={fadeInUp}
              className="video-player"
            >
              <video
                id="demo-video"
                poster="/placeholder.svg?height=720&width=1280"
                preload="metadata"
              >
                <source src="/demo-video.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              <div className="video-overlay">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={toggleVideo}
                    className="video-button"
                    aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <motion.p variants={fadeInUp} className="text-center mt-6">
            Mira cómo Escana simplifica la verificación de identidad y mejora la seguridad en locales nocturnos.
          </motion.p>
        </div>
      </AnimatedSection>

      {/* Benefits */}
      <AnimatedSection id="beneficios" className="benefits">
        <div className="container">
          <motion.h2 variants={fadeInUp} className="h2 text-center mb-16">Beneficios del SaaS</motion.h2>
          <motion.div variants={staggerChildren} className="benefits-grid">
            {[
              { title: 'Verificación Instantánea', description: 'Escanea y verifica identidades en menos de 2 segundos.' },
              { title: 'Mayor Seguridad', description: 'Evita el ingreso de personas no autorizadas con listas actualizadas.' },
              { title: 'Decisiones Inteligentes', description: 'Accede a reportes y analíticas para una gestión eficiente.' },
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp} className="benefit-card">
                <motion.div
                  className="benefit-icon"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle />
                </motion.div>
                <h3 className="h3">{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Use Cases */}
      <AnimatedSection id="casos-de-uso" className="use-cases">
        <div className="container">
          <motion.h2 variants={fadeInUp} className="h2 text-center mb-16">Sectores Beneficiados</motion.h2>
          <motion.div variants={staggerChildren} className="use-cases-grid">
            {['Locales Nocturnos', 'Bares', 'Discotecas'].map((sector, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="use-case-tag"
              >
                {sector}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Testimonial */}
      <AnimatedSection className="testimonial">
        <div className="container text-center">
          <motion.h2 variants={fadeInUp} className="h2 mb-8">Lo que dicen nuestros usuarios</motion.h2>
          <motion.blockquote variants={fadeInUp} className="testimonial-quote">
            "Gracias a Escana, logramos reducir los tiempos de ingreso en un 50% y mejorar la seguridad en nuestro local."
          </motion.blockquote>
          <motion.p variants={fadeInUp} className="text-lg font-semibold">Usuario Beta (Local Nocturno)</motion.p>
        </div>
      </AnimatedSection>

      {/* Progress */}
      <AnimatedSection className="progress">
        <div className="container text-center">
          <motion.h2 variants={fadeInUp} className="h2 mb-8">Estado del Desarrollo</motion.h2>
          <motion.p variants={fadeInUp} className="text-lg mb-10 max-w-2xl mx-auto">
            Escana está actualmente en fase de pruebas internas. El lanzamiento de la versión beta está programado para noviembre de 2024.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="button">Únete como Beta Tester</Button>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FAQs */}
      <AnimatedSection className="faq">
        <div className="container">
          <motion.h2 variants={fadeInUp} className="h2 text-center mb-16">Preguntas Frecuentes</motion.h2>
          <Accordion type="single" collapsible className="accordion">
            {[
              { question: '¿Cuándo estará disponible la beta?', answer: 'La beta estará disponible a partir de noviembre de 2024 para un grupo selecto de usuarios.' },
              { question: '¿Cómo puedo participar en la beta?', answer: 'Solo tienes que inscribirte en nuestra lista de espera para tener la oportunidad de ser seleccionado como beta tester.' },
              { question: '¿Qué hace diferente a Escana de otras soluciones?', answer: 'Escana ofrece una verificación de identidad en menos de 2 segundos, junto con la gestión de listas de invitados y vetados, y una analítica básica para optimizar la seguridad y la eficiencia del local.' },
            ].map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AccordionItem value={`item-${index}`} className="accordion-item">
                  <AccordionTrigger className="accordion-trigger">{faq.question}</AccordionTrigger>
                  <AccordionContent className="accordion-content">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <AnimatedSection className="footer">
        <div className="container">
          <motion.div variants={staggerChildren} className="footer-grid">
            <motion.div variants={fadeInUp} className="footer-section">
              <h3>Contacto</h3>
              <p>Email: contacto@escana.com</p>
              <p>Teléfono: +56 9 1234 5678</p>
              <p>Dirección: Santiago, Chile</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="footer-section">
              <h3>Síguenos</h3>
              <div className="social-links">
                {['Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><a href="#">Política de Privacidad</a></li>
                <li><a href="#">Términos de Servicio</a></li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeInUp} className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Escana. Todos los derechos reservados.</p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection className="final-cta">
        <div className="container text-center">
          <motion.h2 variants={fadeInUp} className="h2 mb-8">¿Listo para revolucionar el control de acceso en tu local?</motion.h2>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="button button-secondary">
              Únete a la Lista de Espera
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  )
}