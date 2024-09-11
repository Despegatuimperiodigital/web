import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Importa el contexto de autenticación
import ProtectedRoute from './ProtectedRoute'; // Importa la ruta protegida
import Navbar from './Navbar';
import ElegantHeroSection from './ElegantHeroSection';
import BlogSection from './BlogSection';
import ServicesSection from './ServicesSection';
import ContactForm from './ContactForm';
import BlogPostPage from './BlogPostPage';
import Login from './Login';
import Register from './Register';
import Usuario from './Usuario';
import Panel_usuario from './Panel_usuario';
import BlogUpload from './BlogUpload';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ElegantHeroSection />
                  <BlogSection />
                  <ServicesSection />
                  <ContactForm />
                </>
              }
            />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Proteger las siguientes rutas */}
            <Route
              path="/usuario"
              element={<ProtectedRoute element={<Usuario />} />}
            />
            <Route
              path="/panel-usuario"
              element={<ProtectedRoute element={<Panel_usuario />} />}
            />
            <Route
              path="/subir-blog"
              element={<ProtectedRoute element={<BlogUpload />} />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
