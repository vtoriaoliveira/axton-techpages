import { useRef, useState, useEffect } from "react";
import { services, stats } from "../data/services";
import Pricing from "./Pricing";

/**
 * useReveal — dispara animação quando o elemento entra na viewport.
 */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

/**
 * Reveal — wrapper que anima os filhos ao entrar na tela.
 */
function Reveal({ children, delay = 0, from = "bottom", style = {} }) {
  const [ref, visible] = useReveal();
  const origins = { bottom: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)" };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0,0)" : (origins[from] || origins.bottom),
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/**
 * Services.jsx
 * Faixa de stats + grid de cards de serviços + CTA band.
 */
export default function Services() {
  return (
    <>
      {/* Stats */}
      <div className="divider" />
      <div className="stats">
        {stats.map(({ number, label }, i) => (
          <Reveal key={label} delay={i * 100} from="bottom">
            <div className="stat-item">
              <div className="stat-number">{number}</div>
              <div className="stat-label">{label}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="divider" />

      {/* Cards de serviços */}
      <div className="section">
        <Reveal from="left">
          <p className="section-label">O que fazemos</p>
          <h2 className="section-title">Nossas Soluções</h2>
        </Reveal>
        <div className="cards">
          {services.map(({ icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 110} from="bottom">
              <div className="card" style={{ height: "100%" }}>
                <span className="card-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Planos */}
      <Pricing />

      {/* CTA band */}
      <Reveal from="bottom">
        <div className="cta-band">
          <h2>PRONTO PARA DECOLAR?</h2>
          <p>Entre em contato e descubra como podemos transformar o seu negócio com tecnologia de ponta.</p>
          <button className="btn-primary">Falar com um especialista</button>
        </div>
      </Reveal>
    </>
  );
}
