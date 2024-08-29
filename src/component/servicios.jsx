import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Globe, Layers, Link, ChevronDown, ArrowRight } from 'lucide-react';

const servicios = [
  { icon: Bot, title: "IA y Automatización", desc: "Soluciones inteligentes que optimizan sus procesos empresariales" },
  { icon: Globe, title: "Entornos Web Avanzados", desc: "Plataformas web de alto rendimiento y máxima seguridad" },
  { icon: Layers, title: "Microservicios Escalables", desc: "Arquitecturas flexibles para un crecimiento sin límites" },
  { icon: Link, title: "Integración Omnicanal", desc: "Conexión perfecta entre CRM, E-commerce, ERP y más" },
  { icon: Bot, title: "Optimización de Procesos", desc: "Mejore la eficiencia operativa con nuestras soluciones de IA" },
  { icon: Globe, title: "Experiencia del Cliente", desc: "Transforme la interacción con sus clientes mediante tecnologías avanzadas" }
];

const integraciones = [
  "Salesforce", "SAP", "Shopify", "Microsoft Dynamics", 
  "HubSpot", "Oracle", "Magento", "Odoo", "Woocommerce", "Wordpress","Monday","Google","Clickup"
];

export default function Component() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="app">
   
      <section className="servicios">
        <h2>Nuestros Servicios</h2>
        <div className="servicios-grid">
          {servicios.map((servicio, index) => (
            <motion.div 
              key={index}
              className={`servicio-card card-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedService(index === selectedService ? null : index)}
            >
              <motion.div 
                className="servicio-icon-wrapper"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <servicio.icon className="servicio-icon" strokeWidth={1} />
              </motion.div>
              <h3>{servicio.title}</h3>
              <AnimatePresence>
                {selectedService === index && (
                  <motion.div
                    className="servicio-desc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{servicio.desc}</p>
                    <motion.button
                      className="learn-more"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Saber más <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="integraciones">
        <h2>Nuestras Integraciones</h2>
        <div className="integraciones-grid">
          {integraciones.map((integracion, index) => (
            <motion.div 
              key={integracion}
              className="integracion-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(243, 63, 49, 0.1)' }}
            >
              <span>{integracion}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .app {
          font-family: 'Nunito', sans-serif;
          color: #e0e0e0;
          background-color: #0a0a0a;
          padding: 6rem 2rem;
          min-height: 100vh;
        }

        .hero {
          text-align: center;
          margin-bottom: 8rem;
        }

        h1 {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #F33F31, #E77171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .hero p {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto;
          color: #b0b0b0;
        }

        h2 {
          font-size: 2.5rem;
          margin-bottom: 4rem;
          text-align: center;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 1px;
        }

        .servicios-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, minmax(200px, auto));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .servicio-card {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          position: relative;
        }

        .card-0 { grid-area: 1 / 1 / 3 / 2; }
        .card-1 { grid-area: 1 / 2 / 2 / 4; }
        .card-2 { grid-area: 2 / 2 / 3 / 3; }
        .card-3 { grid-area: 2 / 3 / 4 / 4; }
        .card-4 { grid-area: 3 / 1 / 4 / 2; }
        .card-5 { grid-area: 3 / 2 / 4 / 3; }

        .servicio-card:hover {
          background-color: rgba(255, 255, 255, 0.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .servicio-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(243, 63, 49, 0.1), rgba(231, 113, 113, 0.1));
          margin-bottom: 1.5rem;
        }

        .servicio-icon {
          width: 30px;
          height: 30px;
          color: #F33F31;
        }

        .servicio-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #ffffff;
          font-weight: 600;
        }

        .servicio-desc {
          margin-top: 1rem;
        }

        .servicio-desc p {
          font-size: 0.9rem;
          color: #b0b0b0;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .learn-more {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #F33F31;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0;
        }

        .learn-more svg {
          margin-left: 0.5rem;
        }

        .integraciones {
          margin-top: 8rem;
        }

        .integraciones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .integracion-card {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .integracion-card span {
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .servicios-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }

          .card-0, .card-1, .card-2, .card-3, .card-4, .card-5 {
            grid-area: auto;
          }
        }

        @media (max-width: 768px) {
          .servicios-grid, .integraciones-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 3rem;
          }

          h2 {
            font-size: 2rem;
          }

          .app {
            padding: 4rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}