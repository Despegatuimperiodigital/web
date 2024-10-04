import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';

export default function Component() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Para manejar errores de autenticación
  const navigate = useNavigate();

  const [playHoverSound] = useSound('/hover.mp3', { volume: 0.5 });
  const [playClickSound] = useSound('/click.mp3', { volume: 0.5 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Limpiar mensajes de error

    try {
      // Llamada al backend para iniciar sesión
      const response = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Si todo va bien, maneja el token (guardarlo en localStorage, etc.)
      console.log('Token recibido:', data.token);
      localStorage.setItem('token', data.token); // Guardar token en localStorage
      alert('Inicio de sesión exitoso');
      navigate('/panel-usuario'); 
    } catch (error) {
      setErrorMessage(error.message); // Mostrar mensaje de error
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (isSoundEnabled) {
      playHoverSound();
    }
  };

  const handleButtonClick = () => {
    if (isSoundEnabled) {
      playClickSound();
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={20} />
            <motion.input 
              whileFocus={{ scale: 1.05 }}
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <motion.input 
              whileFocus={{ scale: 1.05 }}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <motion.button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={handleMouseEnter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </div>
          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span>Recuérdame</span>
            </label>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Mostrar error si lo hay */}
          <motion.button 
            className="login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
            onClick={handleButtonClick}
            type="submit"
            disabled={isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="loading-spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="button-content"
                >
                  Iniciar Sesión <ArrowRight size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
        <div className="additional-options">
          <motion.a 
            href="#" 
            whileHover={{ scale: 1.05 }}
            onMouseEnter={handleMouseEnter}
          >
            ¿Olvidaste tu contraseña?
          </motion.a>
          <motion.a 
            href="#" 
            whileHover={{ scale: 1.05 }}
            onMouseEnter={handleMouseEnter}
          >
            Crear una cuenta
          </motion.a>
        </div>
      </motion.div>
      <motion.button
        className="sound-toggle"
        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          backgroundColor: isSoundEnabled ? "rgba(243, 63, 49, 0.8)" : "rgba(255, 255, 255, 0.1)",
        }}
      >
        {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #0a0a0a;
          padding: 2rem;
          position: relative;
        }

        .login-card {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 3rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 15px 40px rgba(243, 63, 49, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        h2 {
          color: #ffffff;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 300;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #F33F31, #E77171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-group svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #b0b0b0;
        }

        input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #F33F31;
          box-shadow: 0 0 0 2px rgba(243, 63, 49, 0.2);
        }

        input::placeholder {
          color: #b0b0b0;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #b0b0b0;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .toggle-password:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .remember-me {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .remember-me label {
          display: flex;
          align-items: center;
          color: #b0b0b0;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .remember-me input {
          margin-right: 0.5rem;
          width: auto;
        }

        .login-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #F33F31, #E77171);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1);
          z-index: -1;
          filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .login-button:hover::before {
          opacity: 1;
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .additional-options {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
        }

        .additional-options a {
          color: #b0b0b0;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .additional-options a:hover {
          color: #F33F31;
        }

        .sound-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .sound-toggle:hover {
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem;
          }

          h2 {
            font-size: 2rem;
          }

          .additional-options {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .sound-toggle {
            bottom: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}