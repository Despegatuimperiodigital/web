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
import Scana from './component/scana';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Scana />
                  
                </>
              }
            />
           
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
