import BlogSection from './component/blog';
import ElegantHeroSection from './component/home'
import Navbar from './component/navBar';
import ServicesSection from './component/servicios';
import ContactForm from './component/contacto';
import BlogPostPage from './component/blog/entrada';

function App() {
  return (
    <div>
    <Navbar/>
    
    <BlogPostPage/>
    </div>
  );
}

export default App;