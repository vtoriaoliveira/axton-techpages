import { useLoader } from "./hooks/useLoader";

import Loader   from "./components/Loader";
import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Services from "./components/Services";
import Footer   from "./components/Footer";

import "./styles/global.css";
import "./styles/loader.css";
import "./styles/landing.css";

/**
 * App.jsx
 * Raiz da aplicação — orquestra Loader → Landing page.
 */
export default function App() {
  const { progress, loaded, showPage } = useLoader();

  return (
    <>
      <Loader progress={progress} exit={loaded} />

      <div className={`page${showPage ? " visible" : ""}`}>
        <Navbar />
        <Hero />
        <Services />
        <Footer />
      </div>
    </>
  );
}
