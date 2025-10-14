import "./home.css";
import { Leaf, Brain, Users, Camera, Trash2 } from "lucide-react";
import { useRef } from "react";
import Classifier from "./Classifier";

function Home() {
  const classifierRef = useRef(null);

  const scrollToClassifier = () => {
    classifierRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Clasifica tus residuos con inteligencia</h1>
          <p>
            SmartWaste AI te ayuda a reconocer automáticamente el tipo de desecho
            y a separarlo correctamente para cuidar el planeta.
          </p>
          <button onClick={scrollToClassifier}>Comenzar clasificación</button>
        </div>
        <img
          className="hero-section_image"
          src="/hero-section-image.png"
          alt="Hero"
        />
      </div>

      {/* INFO CARDS */}
      <div className="info-cards">
        <div className="info-card">
          <Leaf size={40} />
          <h3>Impacto ecológico</h3>
          <p>Reduce la contaminación y promueve un entorno más limpio.</p>
        </div>

        <div className="info-card">
          <Brain size={40} />
          <h3>Aprendizaje automático</h3>
          <p>La IA mejora su precisión reconociendo diferentes residuos.</p>
        </div>

        <div className="info-card">
          <Users size={40} />
          <h3>Conciencia ciudadana</h3>
          <p>Fomenta la educación ambiental en tu comunidad.</p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        <div className="steps">
          <div className="step">
            <Camera size={48} color="#2ecc71" />
            <h3>1. Toma una foto</h3>
            <p>Captura una imagen del residuo que deseas clasificar.</p>
          </div>
          <div className="step">
            <Brain size={48} color="#2ecc71" />
            <h3>2. La IA lo analiza</h3>
            <p>SmartWaste AI identifica el tipo de desecho con precisión.</p>
          </div>
          <div className="step">
            <Trash2 size={48} color="#2ecc71" />
            <h3>3. Recibe la recomendación</h3>
            <p>Te indicamos en qué caneca debes depositarlo.</p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <h2>¿Listo para probar SmartWaste AI?</h2>
        <button onClick={scrollToClassifier}>Ir al Clasificador</button>
      </section>
      <div ref={classifierRef}>
        <Classifier />
      </div>
    </div>
  );
}

export default Home;
