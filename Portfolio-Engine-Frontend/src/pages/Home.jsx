import HeroCanvas from "../canvas/HeroCanvas";
import Navbar from "../components/Navbar";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";

const Home = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <h1 className="text-4xl">Welcome to My 3D Portfolio</h1>
      <HeroCanvas />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
};

export default Home;