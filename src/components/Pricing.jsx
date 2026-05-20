import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── dados dos planos ───────────────────────────────────────────── */
const plans = [
  {
    name: "Starter",
    price: "197",
    tag: "Ideal para começar",
    highlight: false,
    desc: "Mini landing page profissional para apresentar seu negócio e captar contatos com eficiência.",
    features: [
      "Landing page de 1 página",
      "Formulário de captação de leads",
      "Design responsivo (mobile/desktop)",
      "Integração com WhatsApp",
      "Domínio configurado",
      "1 mês de hospedagem grátis",
    ],
    cta: "Quero meu site",
    ctaNote: "Entrar em contato",
  },
  {
    name: "Business",
    price: "557",
    tag: "Mais popular",
    highlight: true,
    desc: "Site completo com vitrine de produtos e pedidos finalizados direto pelo WhatsApp.",
    features: [
      "Até 5 páginas personalizadas",
      "Catálogo de produtos",
      "Finalização de pedido via WhatsApp",
      "Painel de gerenciamento simples",
      "SEO básico configurado",
      "1 mês de hospedagem grátis",
    ],
    cta: "Quero o Business",
    ctaNote: "Entrar em contato",
  },
  {
    name: "E-commerce",
    price: "Sob consulta",
    tag: "Solução completa",
    highlight: false,
    desc: "Loja virtual completa com checkout, blog integrado e gestão de pedidos em tempo real.",
    features: [
      "Loja virtual completa",
      "Checkout integrado (Pix/Cartão)",
      "Blog para SEO e conteúdo",
      "Painel admin completo",
      "Integração com marketplaces",
      "1 mês de hospedagem grátis",
    ],
    cta: "Quero o E-commerce",
    ctaNote: "Falar com especialista",
  },
];

/* ─── card magnético com GSAP ────────────────────────────────────── */
function PlanCard({ plan, index }) {
  const cardRef   = useRef(null);
  const glowRef   = useRef(null);
  const btnRef    = useRef(null);

  /* entrada com ScrollTrigger — cada card desliza do fundo com delay */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(el,
      { opacity: 0, y: 60, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [index]);

  /* efeito de glow seguindo o mouse dentro do card */
  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(glow, {
        x, y,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    function onEnter() {
      gsap.to(glow, { opacity: 1, duration: 0.3 });
      gsap.to(card, { scale: 1.025, duration: 0.4, ease: "power2.out" });
    }
    function onLeave() {
      gsap.to(glow, { opacity: 0, duration: 0.4 });
      gsap.to(card, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    }

    card.addEventListener("mousemove",  onMove);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove",  onMove);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* efeito magnético no botão CTA */
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const RADIUS = 80, STRENGTH = 0.4;

    function onMouseMove(e) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RADIUS) {
        gsap.to(btn, { x: dx * STRENGTH, y: dy * STRENGTH, duration: 0.4, ease: "power2.out" });
      }
    }
    function onMouseLeave() {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    }

    window.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const whatsappMsg = encodeURIComponent(`Olá! Tenho interesse no plano ${plan.name} da Axton Tech.`);
  const whatsappUrl = `https://wa.me/5500000000000?text=${whatsappMsg}`;

  return (
    <div
      ref={cardRef}
      className={`plan-card ${plan.highlight ? "plan-card--highlight" : ""}`}
      style={{ opacity: 0 }}
    >
      {/* glow que segue o mouse */}
      <div ref={glowRef} className="plan-glow" />

      {plan.highlight && <div className="plan-badge">⭐ Mais popular</div>}

      <div className="plan-header">
        <span className="plan-tag">{plan.tag}</span>
        <h3 className="plan-name">{plan.name}</h3>
        <div className="plan-price">
          {plan.price !== "Sob consulta" && <span className="plan-currency">R$</span>}
          <span className="plan-amount">{plan.price}</span>
          {plan.price !== "Sob consulta" && <span className="plan-period">/único</span>}
        </div>
        <p className="plan-desc">{plan.desc}</p>
      </div>

      <ul className="plan-features">
        {plan.features.map((f, i) => (
          <li key={i} className={f.includes("hospedagem grátis") ? "plan-feature plan-feature--highlight" : "plan-feature"}>
            <span className="plan-check">{f.includes("hospedagem grátis") ? "🎁" : "✓"}</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="plan-footer">
        <a ref={btnRef} href={whatsappUrl} target="_blank" rel="noopener noreferrer"
           className={`plan-btn ${plan.highlight ? "plan-btn--primary" : "plan-btn--ghost"}`}>
          {plan.cta}
        </a>
        <p className="plan-cta-note">{plan.ctaNote} via WhatsApp</p>
      </div>
    </div>
  );
}

/* ─── seção principal ────────────────────────────────────────────── */
export default function Pricing() {
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
  }, []);

  return (
    <section className="pricing-section">
      <div ref={titleRef} className="pricing-header" style={{ opacity: 0 }}>
        <p className="section-label">Nossos Planos</p>
        <h2 className="section-title">Escolha o plano ideal<br />para o seu negócio</h2>
        <p className="pricing-subtitle">
          Todos os planos incluem <strong>1 mês de hospedagem grátis</strong> e suporte dedicado durante o desenvolvimento.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>
    </section>
  );
}
