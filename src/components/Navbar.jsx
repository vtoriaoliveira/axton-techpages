import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { navItems } from "../data/services";

/**
 * MagneticLink
 * Cada link "atrai" o cursor quando ele passa perto,
 * e volta suavemente ao lugar quando sai.
 */
function MagneticLink({ children, className, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // força: quanto o elemento se move em relação ao cursor (0–1)
    const strength = 0.35;
    // raio de atração em px
    const radius = 80;

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }

    function onMouseLeave() {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    }

    // ouve o mouse na janela inteira para capturar aproximação
    window.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <a ref={ref} className={className} onClick={onClick}
       style={{ display: "inline-block", cursor: "pointer" }}>
      {children}
    </a>
  );
}

/**
 * MagneticButton
 * Mesma lógica magnética, mas para o botão CTA.
 */
function MagneticButton({ children, className, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const strength = 0.4;
    const radius   = 90;

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }

    function onMouseLeave() {
      gsap.to(el, {
        x: 0, y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <button ref={ref} className={className} onClick={onClick}>
      {children}
    </button>
  );
}

/* ── Hamburger ─────────────────────────────────────────────────── */
function Hamburger({ open, onClick }) {
  return (
    <button className="hamburger" onClick={onClick} aria-label="Menu">
      <span className={`ham-line ${open ? "open-1" : ""}`} />
      <span className={`ham-line ${open ? "open-2" : ""}`} />
      <span className={`ham-line ${open ? "open-3" : ""}`} />
    </button>
  );
}

/* ── Navbar ────────────────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <div className={`overlay${menuOpen ? " active" : ""}`} onClick={closeMenu} />

      {/* Mobile drawer */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navItems.map(item => (
          <a key={item} className="mobile-link" onClick={closeMenu}>{item}</a>
        ))}
        <button className="mobile-cta" onClick={closeMenu}>Fale Conosco</button>
      </div>

      {/* Navbar */}
      <nav>
        <div className="nav-logo"><span>AXTON</span> TECH</div>

        {/* Links com efeito magnético — desktop */}
        <div className="nav-links">
          {navItems.map(item => (
            <MagneticLink key={item}>{item}</MagneticLink>
          ))}
        </div>

        {/* Botão CTA magnético */}
        <MagneticButton className="nav-cta">Fale Conosco</MagneticButton>

        <Hamburger open={menuOpen} onClick={() => setMenuOpen(o => !o)} />
      </nav>
    </>
  );
}
