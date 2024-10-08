import BlogSection from './component/blog';
import ElegantHeroSection from './component/home';
import Navbar from './component/navBar';
import ServicesSection from './component/servicios';
import ContactForm from './component/contacto';
import BlogPostPage from './component/blog/entrada';
import Login from './component/login/login';
import Register from './component/login/register';
import Usuario from './component/login/usuario';
import Panel_usuario from './component/login/panel_usuario';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogUpload from './component/blog/subir_blog';
import { AuthProvider } from './context';
import ProtectedRoute from './ProtectedRoute';

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
            <Route path="/usuario" element={<Usuario />} />
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
