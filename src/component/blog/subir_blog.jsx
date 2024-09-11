import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Info } from 'lucide-react';

export default function BlogUpload() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    setWordCount(formData.content.trim().split(/\s+/).length);
  }, [formData.content]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es requerido";
    if (formData.content.trim().split(/\s+/).length < 50) newErrors.content = "El contenido debe tener al menos 50 palabras";
    if (!formData.author.trim()) newErrors.author = "El autor es requerido";
    if (!formData.category) newErrors.category = "La categoría es requerida";
    if (!formData.image) newErrors.image = "La imagen es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "La imagen no debe exceder 5MB" }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(0);
    setSubmitError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('author', formData.author);
    data.append('category', formData.category);
    data.append('image', formData.image);
     console.log(formData)

    try {
      const response = await fetch('http://localhost:4010/api/posts', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Simulación de progreso de carga
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      const result = await response.json();
      console.log('Success:', result);

      setIsSubmitting(false);
      setUploadProgress(0);
      setFormData({ title: '', content: '', author: '', category: '', image: null });
      setPreviewImage(null);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Hubo un error al enviar el blog. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '56rem',
          padding: '2rem',
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          color: '#e0e0e0',
          overflow: 'auto',
          maxHeight: '90vh',
        }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #F33F31, #E77171)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(243, 63, 49, 0.5)',
        }}>
          Subir Nuevo Blog
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontWeight: '500', color: '#f0f0f0' }}>Título</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Ingresa el título del blog"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #4a4a4a',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                color: '#e0e0e0',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
              }}
            />
            {errors.title && <p style={{ color: '#F33F31', fontSize: '0.875rem' }}>{errors.title}</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="content" style={{ fontWeight: '500', color: '#f0f0f0' }}>Contenido</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              placeholder="Escribe el contenido de tu blog aquí"
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '0.75rem',
                border: '1px solid #4a4a4a',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                color: '#e0e0e0',
                fontSize: '1rem',
                resize: 'vertical',
                transition: 'all 0.3s ease',
              }}
            />
            {errors.content && <p style={{ color: '#F33F31', fontSize: '0.875rem' }}>{errors.content}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#b0b0b0' }}>
              <span>{wordCount} palabras</span>
              <span>{formData.content.length} caracteres</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="author" style={{ fontWeight: '500', color: '#f0f0f0' }}>Autor</label>
              <input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Nombre del autor"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #4a4a4a',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  color: '#e0e0e0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
              />
              {errors.author && <p style={{ color: '#F33F31', fontSize: '0.875rem' }}>{errors.author}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="category" style={{ fontWeight: '500', color: '#f0f0f0' }}>Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #4a4a4a',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  color: '#e0e0e0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
              {errors.category && <p style={{ color: '#F33F31', fontSize: '0.875rem' }}>{errors.category}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="image" style={{ fontWeight: '500', color: '#f0f0f0' }}>Imagen del Blog</label>
            <div style={{
              border: '2px dashed #4a4a4a',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}>
              <label htmlFor="image" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}>
                {previewImage ? (
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => { setPreviewImage(null); setFormData(prev => ({ ...prev, image: null })) }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: '#F33F31',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#b0b0b0' }}>
                    <Upload size={40} />
                    <p style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Haz clic para subir</span> o arrastra y suelta</p>
                    <p style={{ textAlign: 'center' }}>PNG, JPG o GIF (MAX. 5MB)</p>
                  </div>
                )}
                <input id="image" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            {errors.image && <p style={{ color: '#F33F31', fontSize: '0.875rem' }}>{errors.image}</p>}
          </div>

          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ marginTop: '1rem' }}
              >
                <div style={{ width: '100%', height: '0.5rem', backgroundColor: '#4a4a4a', borderRadius: '0.25rem', overflow: 'hidden' }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(45deg, #F33F31, #E77171)',
                    transition: 'width 0.3s ease',
                  }}></div>
                </div>
                <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#b0b0b0' }}>Subiendo blog... {uploadProgress}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          {submitError && (
            <p style={{ color: '#F33F31', fontSize: '0.875rem', textAlign: 'center' }}>{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(45deg, #F33F31, #E77171)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: isSubmitting ? '0.7' : '1',
              boxShadow: '0 0 10px rgba(243, 63, 49, 0.5)',
            }}
          >
            {isSubmitting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                Publicando...
              </motion.div>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Check size={20} />
                Publicar Blog
              </span>
            )}
          </button>
        </form>

        <div style={{ position: 'relative', display: 'inline-block', marginTop: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#b0b0b0', cursor: 'pointer' }}>
            <Info size={20} />
          </button>
          <span style={{
            visibility: 'hidden',
            width: '200px',
            backgroundColor: 'rgba(74, 74, 74, 0.9)',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '6px',
            padding: '5px',
            position: 'absolute',
            zIndex: '1',
            bottom: '125%',
            left: '50%',
            marginLeft: '-100px',
            opacity: '0',
            transition: 'opacity 0.3s',
          }}>
            Asegúrate de revisar tu contenido antes de publicar.
          </span>
        </div>

        {isDialogOpen && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
          }}>
            <div style={{
              backgroundColor: 'rgba(26, 26, 26, 0.9)',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e0e0e0' }}>¡Blog Publicado con Éxito!</h3>
              <p style={{ marginBottom: '1.5rem', color: '#b0b0b0' }}>Tu artículo ha sido subido y está listo para ser leído por la comunidad. ¿Qué te gustaría hacer ahora?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(74, 74, 74, 0.8)',
                    color: '#e0e0e0',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {/* Lógica para ver el blog */}}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(243, 63, 49, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Ver Blog
                </button>
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setFormData({ title: '', content: '', author: '', category: '', image: null });
                    setPreviewImage(null);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(243, 63, 49, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Crear Otro Blog
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}