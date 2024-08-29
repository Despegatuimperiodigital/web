import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formState);
    // Resetear el formulario después del envío
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section className="contact-section">
      <h2 className="contact-title">Contáctenos</h2>
      <p className="contact-intro">¿Tiene alguna pregunta o comentario? No dude en ponerse en contacto con nosotros.</p>
      <motion.form 
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <User size={20} />
            <span>Nombre</span>
          </label>
          <motion.input 
            whileFocus={{ scale: 1.02 }}
            type="text" 
            id="name" 
            name="name" 
            value={formState.name}
            onChange={handleInputChange}
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <Mail size={20} />
            <span>Correo Electrónico</span>
          </label>
          <motion.input 
            whileFocus={{ scale: 1.02 }}
            type="email" 
            id="email" 
            name="email" 
            value={formState.email}
            onChange={handleInputChange}
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            <MessageSquare size={20} />
            <span>Mensaje</span>
          </label>
          <motion.textarea 
            whileFocus={{ scale: 1.02 }}
            id="message" 
            name="message" 
            value={formState.message}
            onChange={handleInputChange}
            required
            className="form-textarea"
          ></motion.textarea>
        </div>
        <motion.button 
          type="submit"
          className="submit-button-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enviar Mensaje <Send size={20} className="send-icon" />
        </motion.button>
      </motion.form>
      <style jsx>{`
        .contact-section {
          padding: 6rem 2rem;
          background-color: #0a0a0a;
          color: #e0e0e0;
        }

        .contact-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #F33F31, #E77171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-intro {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
          font-size: 1.2rem;
          color: #b0b0b0;
        }

        .contact-form {
          max-width: 600px;
          margin: 0 auto;
          background-color: rgba(255, 255, 255, 0.03);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #ffffff;
          font-size: 1rem;
        }

        .form-label span {
          margin-left: 0.5rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #F33F31;
          box-shadow: 0 0 0 2px rgba(243, 63, 49, 0.2);
        }

        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }

        .submit-button-2 {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #F33F31, #E77171);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-2-button:hover {
          background: linear-gradient(45deg, #E77171, #F33F31);
        }

        .send-icon {
          margin-left: 0.5rem;
        }

        @media (max-width: 768px) {
          .contact-section {
            padding: 4rem 1.5rem;
          }

          .contact-title {
            font-size: 2rem;
          }

          .contact-intro {
            font-size: 1rem;
          }

          .contact-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}