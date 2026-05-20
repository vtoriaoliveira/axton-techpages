import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * useParticles
 * Canvas com rede de partículas animadas.
 */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let pts = [];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initPoints();
    }

    function initPoints() {
      pts = Array.from({ length: 90 }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 1.6 + 0.5,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* move pontos */
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        /* ponto */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168,85,247,0.75)";
        ctx.fill();
      });

      /* linhas entre pontos próximos */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / 100) * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [canvasRef]);
}

/**
 * Hero.jsx
 * Seção principal com partículas GSAP + headline animada.
 */
export default function Hero() {
  const canvasRef  = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef   = useRef(null);
  const descRef    = useRef(null);
  const btnsRef    = useRef(null);

  useParticles(canvasRef);

  /* entrada do conteúdo com GSAP stagger */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 20, letterSpacing: "0.8em" },
      { opacity: 1, y: 0,  letterSpacing: "0.45em", duration: 0.9, ease: "power3.out" }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0,  scale: 1,    duration: 1,   ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(descRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0,  duration: 0.8, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(btnsRef.current.children,
      { opacity: 0, y: 16, scale: 0.95 },
      { opacity: 1, y: 0,  scale: 1,
        duration: 0.6, ease: "back.out(1.6)", stagger: 0.12 },
      "-=0.4"
    );
  }, []);

  return (
    <section className="hero">
      {/* canvas de partículas — fundo absoluto */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* conteúdo */}
      <div className="hero-content">
        <p ref={eyebrowRef} className="hero-eyebrow" style={{ opacity: 0 }}>
          Inovação sem limites
        </p>

        <h1 ref={titleRef} style={{ opacity: 0 }}>
          O FUTURO <br /> É <em>DIGITAL</em>
        </h1>

        <p ref={descRef} style={{ opacity: 0 }}>
          Desenvolvemos soluções tecnológicas de alta performance que transformam
          negócios e aceleram o crescimento da sua empresa.
        </p>

        <div ref={btnsRef} className="hero-btns">
          <button className="btn-primary">Começar Agora</button>
          <button className="btn-ghost">Ver Projetos</button>
        </div>
      </div>
    </section>
  );
}
