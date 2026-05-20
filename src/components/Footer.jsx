import { useRef, useState, useEffect } from "react";

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

function Reveal({ children, from = "bottom" }) {
  const [ref, visible] = useReveal();
  const origins = { bottom: "translateY(40px)" };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0,0)" : origins[from],
      transition: "opacity 0.65s ease, transform 0.65s ease",
    }}>
      {children}
    </div>
  );
}

/**
 * Footer.jsx
 */
export default function Footer() {
  return (
    <Reveal from="bottom">
      <footer>
        <div className="footer-logo"><span>AXTON</span> TECH</div>
        <span>© {new Date().getFullYear()} Axton Tech. Todos os direitos reservados.</span>
      </footer>
    </Reveal>
  );
}
