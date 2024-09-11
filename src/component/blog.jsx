import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';
import Music from './music.mp3'
import { useNavigate } from 'react-router-dom'; // Importar useNavigate


const blogPosts = [
  {
    title: "Innovaciones en IA para Empresas en 2023",
    excerpt: "Descubra cómo las últimas innovaciones en IA están transformando el panorama empresarial...",
    date: "15 Jun 2023",
    author: "María González",
    category: "Inteligencia Artificial",
    image: "https://z-p3-scontent.fscl29-1.fna.fbcdn.net/o1/v/t0/f1/m340/genai_m4_lla_ncg_v3:upload_img_80175273_08_29_2024_08_51_35_027758_4628620993048329551.jpeg?_nc_ht=z-p3-scontent.fscl29-1.fna.fbcdn.net&_nc_cat=106&ccb=9-4&oh=00_AYAYOEhp2OscVpPpvIFar8kxGXbGPY-AJ127PNQbJgVgdQ&oe=66D271A3&_nc_sid=5b3566?height=200&width=300"
  },
  {
    title: "Guía de Microservicios para Startups",
    excerpt: "Aprenda cómo implementar una arquitectura de microservicios eficiente en su startup...",
    date: "22 May 2023",
    author: "Carlos Rodríguez",
    category: "Arquitectura de Software",
    image: "https://z-p3-scontent.fscl29-1.fna.fbcdn.net/o1/v/t0/f1/m258/upload_img_2745826_08_29_2024_08_48_33_338419_6672666805160491856.jpeg?_nc_ht=z-p3-scontent.fscl29-1.fna.fbcdn.net&_nc_cat=104&ccb=9-4&oh=00_AYCAA0p3uXZID2OLfTvZRHBKYe7oEu2VgNyMsNCOXFo2Uw&oe=66D2653D&_nc_sid=5b3566?height=200&width=300"
  },
  {
    title: "Seguridad en la Nube: Mejores Prácticas",
    excerpt: "Proteja sus activos digitales con estas estrategias probadas de seguridad en la nube...",
    date: "7 Apr 2023",
    author: "Ana Martínez",
    category: "Seguridad",
    image: "https://z-p3-scontent.fscl29-1.fna.fbcdn.net/o1/v/t0/f1/m340/genai_m4_ldc_pnb_v3:upload_img_42651702_08_29_2024_08_58_04_647633_300758316709215497.jpeg?_nc_ht=z-p3-scontent.fscl29-1.fna.fbcdn.net&_nc_cat=101&ccb=9-4&oh=00_AYCiwejuphOKpzD-1KoVwoGkZSUs3cfxMCWIa5oGC0fLDA&oe=66D25CDD&_nc_sid=5b3566?height=200&width=300"
  },
  {
    title: "El Futuro del E-commerce con Integración Omnicanal",
    excerpt: "Explore cómo la integración omnicanal está redefiniendo la experiencia de compra en línea...",
    date: "18 Mar 2023",
    author: "Javier López",
    category: "E-commerce",
    image: "https://z-p3-scontent.fscl29-1.fna.fbcdn.net/o1/v/t0/f1/m257/upload_img_18678706_08_29_2024_08_58_47_162968_2532303705320648567.jpeg?_nc_ht=z-p3-scontent.fscl29-1.fna.fbcdn.net&_nc_cat=108&ccb=9-4&oh=00_AYAEPlngf0NxGNpMoIOUWE_aX1A3zG7N_R4l_ao6KG3P5Q&oe=66D2733C&_nc_sid=5b3566?height=200&width=300"
  }
];

export default function BlogSection() {

  const [expandedPost, setExpandedPost] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [playHoverSound] = useSound(Music, {
    volume: volume,
    soundEnabled: isSoundEnabled,
  });
  const handlePostClick = (id) => {
    // Redirige a la página del post específico usando su ID
    navigate(`/blog/${id}`);
  };

  const navigate = useNavigate(); // Hook para redirigir
// Función para obtener los posts desde la API
useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:4010/api/posts'); // URL de tu API
      
      if (!response.ok) {
      
        throw new Error('Error al obtener los posts');
      }
      const data = await response.json(); // Parsear los datos en JSON
      setBlogPosts(data); // Guardar los posts en el estado
      setLoading(false);  // Desactivar el estado de carga
    console.log(data)
    } catch (err) {
      console.error('Error al obtener los posts:', err);
      setError('No se pudieron cargar los posts');
      setLoading(false);  // Desactivar el estado de carga en caso de error
    }
  };

  fetchPosts();
}, []);
const handleMouseEnter = () => {
  if (isSoundEnabled) {
    playHoverSound();
  }
};

  // Mostrar un mensaje mientras los posts están cargando
  if (loading) {
    return <p>Cargando posts...</p>;
  }

  // Mostrar un mensaje si hay un error al cargar los posts
  if (error) {
    return <p>{error}</p>;
  }


  return (
    <section className="blog-section">
     <h2>Nuestro Blog</h2>
      <p className="blog-intro">Explore nuestros últimos artículos sobre tecnología, innovación y estrategias empresariales.</p>
      <div className="sound-controls">
        <label className="sound-toggle">
          <input
            type="checkbox"
            checked={isSoundEnabled}
            onChange={() => setIsSoundEnabled(!isSoundEnabled)}
          />
          {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </label>
        {isSoundEnabled && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        )}
      </div>
      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <motion.div 
            key={post._id}
            className="blog-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => handlePostClick(post._id)}  // Al hacer clic, redirigir a la página del post
          >
            <div className="blog-image">
              <img src={ "http://localhost:4010" +post.image} alt={post.title} />
            </div>
            <div className="blog-content">
              <h3>{post.title}</h3>
              <div className="blog-meta">
                <span><Calendar size={14} /> {new Date(post.date).toLocaleDateString()}</span>
                <span><User size={14} /> {post.author}</span>
                <span><Tag size={14} /> {post.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .blog-section {
          padding: 6rem 2rem;
          background-color: #0a0a0a;
          color: #e0e0e0;
        }

        h2 {
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

        .blog-intro {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 2rem;
          font-size: 1.2rem;
          color: #b0b0b0;
        }

        .sound-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .sound-toggle {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #F33F31;
        }

        .sound-toggle input {
          display: none;
        }

        .volume-slider {
          width: 100px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #F33F31;
          cursor: pointer;
          border: 4px solid #333;
          box-shadow: -407px 0 0 400px #F33F31;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .blog-card {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .blog-card:hover {
          background-color: rgba(255, 255, 255, 0.05);
          box-shadow: 0 15px 40px rgba(243, 63, 49, 0.1);
        }

        .blog-image {
          height: 200px;
          overflow: hidden;
        }

        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .blog-card:hover .blog-image img {
          transform: scale(1.05);
        }

        .blog-content {
          padding: 1.5rem;
        }

        .blog-content h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #ffffff;
          font-weight: 600;
        }

        .blog-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .blog-meta span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .blog-excerpt p {
          font-size: 0.9rem;
          color: #b0b0b0;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .read-more {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #F33F31;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0;
          transition: color 0.3s ease;
        }

        .read-more:hover {
          color: #E77171;
        }

        .read-more svg {
          margin-left: 0.5rem;
        }

        @media (max-width: 768px) {
          .blog-section {
            padding: 4rem 1.5rem;
          }

          h2 {
            font-size: 2rem;
          }

          .blog-intro {
            font-size: 1rem;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}