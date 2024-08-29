import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const navItems = [
  { 
    name: "Soluciones", 
    href: "#",
    subItems: [
      { name: "Cloud Computing", href: "#" },
      { name: "Inteligencia Artificial", href: "#" },
      { name: "Big Data & Analytics", href: "#" },
      { name: "Ciberseguridad", href: "#" },
    ]
  },
  { name: "Industrias", href: "#" },
  { name: "Recursos", href: "#" },
  { name: "Nosotros", href: "#" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito:wght@400;600;700&display=swap');

        .navbar-wrapper {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: 90%;
          max-width: 1400px;
        }

        .navbar {
          background-color: rgba(18, 18, 18, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 0 24px;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .navbar-scrolled {
          background-color: rgba(18, 18, 18, 0.95);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .navbar-logo {
          color: white;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
        }

        .navbar-menu {
          display: flex;
          list-style-type: none;
          margin: 0;
          padding: 0;
          justify-content: center;
          flex-grow: 1;
        }

        .navbar-item {
          position: relative;
          margin: 0 15px;
        }

        .navbar-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 8px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar-link:hover {
          color: white;
        }

        .navbar-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(24, 24, 24, 0.95);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: none;
          min-width: 200px;
          padding: 16px 0;
          z-index: 1000;
        }

        .navbar-item:hover .navbar-dropdown {
          display: block;
        }

        .navbar-dropdown-link {
          display: block;
          padding: 10px 20px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          text-align: center;
        }

        .navbar-dropdown-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .navbar-buttons {
          display: flex;
          align-items: center;
        }

        .navbar-button {
          margin-left: 20px;
          padding: 8px 20px;
          border: none;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .navbar-button-ghost {
          background-color: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .navbar-button-ghost:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: white;
        }

        .navbar-button-primary {
          background: linear-gradient(45deg, #F33F31, #E77171);
          color: white;
          box-shadow: 0 4px 20px rgba(243, 63, 49, 0.3);
        }

        .navbar-button-primary:hover {
          background: linear-gradient(45deg, #E02D1F, #D55F5F);
          box-shadow: 0 6px 25px rgba(243, 63, 49, 0.5);
        }

        .navbar-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .navbar-mobile-menu {
          position: fixed;
          top: 90px;
          left: 5%;
          right: 5%;
          background-color: rgba(18, 18, 18, 0.98);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow-y: auto;
          max-height: 80vh;
        }

        .navbar-mobile-link {
          display: block;
          padding: 12px 0;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          text-align: center;
        }

        .navbar-mobile-link:hover {
          color: white;
        }

        @media (max-width: 1024px) {
          .navbar-menu, .navbar-buttons {
            display: none;
          }

          .navbar-mobile-toggle {
            display: block;
          }

          .navbar-wrapper {
            width: 95%;
          }

          .navbar {
            padding: 0 20px;
          }

          .navbar-container {
            justify-content: space-between;
          }
        }

        .animated-background {
          background: linear-gradient(-45deg, #F33F31, #E77171, #fb5607, #ffbe0b);
          background-size: 300% 300%;
          animation: gradientAnimation 15s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }

        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <div className="navbar-wrapper">
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
          <div className="navbar-container">
            <a href="/" className="navbar-logo">
              <span className="animated-background">CloudHub</span>
            </a>
            <ul className="navbar-menu" ref={dropdownRef}>
              {navItems.map((item, index) => (
                <li key={item.name} className="navbar-item">
                  {item.subItems ? (
                    <>
                      <button 
                        className="navbar-link"
                        onClick={() => handleDropdownToggle(index)}
                        aria-expanded={activeDropdown === index}
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDown size={16} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="navbar-dropdown"
                          >
                            {item.subItems.map((subItem) => (
                              <a key={subItem.name} href={subItem.href} className="navbar-dropdown-link">
                                {subItem.name}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a href={item.href} className="navbar-link">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="navbar-buttons">
              <button className="navbar-button navbar-button-ghost">
                Iniciar sesión
              </button>
              <button className="navbar-button navbar-button-primary">
                Empezar ahora
              </button>
            </div>
            <button 
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="navbar-mobile-menu"
            >
              {navItems.map((item) => (
                <React.Fragment key={item.name}>
                  <a href={item.href} className="navbar-mobile-link">{item.name}</a>
                  {item.subItems && item.subItems.map((subItem) => (
                    <a key={subItem.name} href={subItem.href} className="navbar-mobile-link" style={{fontSize: '0.9rem'}}>
                      {subItem.name}
                    </a>
                  ))}
                </React.Fragment>
              ))}
              <a href="#" className="navbar-mobile-link">Iniciar sesión</a>
              <a href="#" className="navbar-mobile-link navbar-button-primary" style={{display: 'inline-block', marginTop: '20px', textAlign: 'center'}}>
                Empezar ahora
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}