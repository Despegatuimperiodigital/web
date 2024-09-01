import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Volume2, VolumeX, ThumbsUp, MessageSquare, Share2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import useSound from 'use-sound';
import Interrestellar from '../music/interestellar.mp3'

// Simulación de datos de un post de blog
const blogPost = {
  title: "Innovaciones en IA para Empresas en 2023",
  content: `
    <p>La Inteligencia Artificial (IA) está revolucionando el mundo empresarial a un ritmo sin precedentes. En 2023, estamos presenciando avances significativos que están transformando la forma en que las empresas operan, toman decisiones y se relacionan con sus clientes.</p>
    
    <h2>1. IA Generativa en la Creación de Contenido</h2>
    <p>Una de las innovaciones más impactantes es el uso de IA generativa para la creación de contenido. Herramientas como GPT-3 están permitiendo a las empresas producir textos, imágenes y hasta código de manera automatizada, ahorrando tiempo y recursos.</p>
    
    <h2>2. Análisis Predictivo Avanzado</h2>
    <p>Los algoritmos de IA están mejorando drásticamente en la predicción de tendencias de mercado, comportamiento del consumidor y riesgos potenciales. Esto permite a las empresas tomar decisiones más informadas y estratégicas.</p>
    
    <h2>3. Automatización Inteligente de Procesos</h2>
    <p>La automatización robótica de procesos (RPA) combinada con IA está llevando la eficiencia operativa a nuevos niveles. Tareas complejas que antes requerían intervención humana ahora pueden ser manejadas por sistemas inteligentes.</p>
    
    <h2>Conclusión</h2>
    <p>La IA está dejando de ser una tecnología futurista para convertirse en una herramienta esencial en el presente de las empresas. Aquellas que sepan aprovechar estas innovaciones estarán mejor posicionadas para liderar sus respectivos mercados en los años venideros.</p>
  `,
  date: "15 Jun 2023",
  author: "María González",
  category: "Inteligencia Artificial",
  image: "/placeholder.svg?height=400&width=800",
  likes: 127,
  comments: 23
};

// Lista de canciones de ejemplo
const playlist = [
  { title: "Ambient Melody", artist: "CloudHub Music", src: Interrestellar },
  { title: "Tech Groove", artist: "CloudHub Music", src: "/tech-groove.mp3" },
  { title: "AI Symphony", artist: "CloudHub Music", src: "/ai-symphony.mp3" },
];

export default function BlogPostPage() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const [playHoverSound] = useSound('/hover.mp3', {
    volume: volume,
    soundEnabled: isSoundEnabled,
  });

  const [playLikeSound] = useSound('/like.mp3', {
    volume: volume,
    soundEnabled: isSoundEnabled,
  });

  useEffect(() => {
    // Simular carga de contenido
    setTimeout(() => {
      document.querySelector('.blog-content').innerHTML = blogPost.content;
    }, 100);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isSoundEnabled) {
      playLikeSound();
    }
  };

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
  };

  const playPrevious = () => {
    setCurrentTrack((prevTrack) => (prevTrack - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="blog-post-page" Style="padding-top:100px;">
      <motion.div 
        className="back-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        <span>Volver al Blog</span>
      </motion.div>

      <div className="content-wrapper">
        <article className="blog-post">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {blogPost.title}
          </motion.h1>

          <div className="blog-meta">
            <span><Calendar size={14} /> {blogPost.date}</span>
            <span><User size={14} /> {blogPost.author}</span>
            <span><Tag size={14} /> {blogPost.category}</span>
          </div>

          <motion.div 
            className="blog-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={blogPost.image} alt={blogPost.title} />
          </motion.div>

          <motion.div 
            className="blog-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Contenido del post se cargará aquí */}
          </motion.div>

          <div className="blog-actions">
            <motion.button 
              className={`action-button ${isLiked ? 'liked' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
            >
              <ThumbsUp size={20} />
              <span>{blogPost.likes + (isLiked ? 1 : 0)}</span>
            </motion.button>
            <motion.button 
              className="action-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageSquare size={20} />
              <span>{blogPost.comments}</span>
            </motion.button>
            <motion.button 
              className="action-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={20} />
              <span>Compartir</span>
            </motion.button>
          </div>
        </article>

        <aside className="music-player">
          <h3>Música Ambiental</h3>
          <div className="current-track">
            <img src="https://cloudhub.cl/wp-content/uploads/2024/08/guzheng.png?height=60&width=60" alt="Album Cover" />
            <div>
              <p className="track-title">{playlist[currentTrack].title}</p>
              <p className="track-artist">{playlist[currentTrack].artist}</p>
            </div>
          </div>
          <div className="player-controls">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playPrevious}
            >
              <SkipBack size={24} />
            </motion.button>
            <motion.button
              className="play-pause"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playNext}
            >
              <SkipForward size={24} />
            </motion.button>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
          <audio
            ref={audioRef}
            src={playlist[currentTrack].src}
            onEnded={playNext}
          />
        </aside>
      </div>

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

      <style jsx>{`
        .blog-post-page {
          padding: 4rem 2rem;
          background-color: #0a0a0a;
          color: #e0e0e0;
          min-height: 100vh;
        }

        .content-wrapper {
          display: flex;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          color: #F33F31;
          font-size: 1rem;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: #E77171;
        }

        .back-button span {
          margin-left: 0.5rem;
        }

        .blog-post {
          flex: 1;
          max-width: 800px;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #F33F31, #E77171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .blog-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .blog-meta span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .blog-image {
          margin-bottom: 2rem;
          border-radius: 20px;
          overflow: hidden;
        }

        .blog-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        .blog-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #d0d0d0;
        }

        .blog-content h2 {
          font-size: 1.8rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .blog-content p {
          margin-bottom: 1.5rem;
        }

        .blog-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .action-button {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #b0b0b0;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .action-button:hover, .action-button.liked {
          color: #F33F31;
        }

        .action-button span {
          margin-left: 0.5rem;
        }

        .music-player {
          width: 300px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 1.5rem;
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .music-player h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .current-track {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .current-track img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
        }

        .track-title {
          font-weight: bold;
          color: #ffffff;
        }

        .track-artist {
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .player-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .player-controls button {
          background: none;
          border: none;
          color: #F33F31;
          cursor: pointer;
        }

        .play-pause {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(243, 63, 49, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .volume-slider {
          width: 100%;
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

        .sound-controls {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 20px;
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

        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
          }

          .music-player {
            width: 100%;
            position: static;
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .blog-post-page {
            padding: 3rem 1.5rem;
          }

          h1 {
            font-size: 2rem;
          }

          .blog-content {
            font-size: 1rem;
          }

          .blog-actions {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .sound-controls {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}