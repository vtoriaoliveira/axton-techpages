/**
 * Loader.jsx
 * Tela de carregamento fullscreen com barra de progresso animada.
 */
export default function Loader({ progress, exit }) {
  return (
    <div className={`loader-wrap${exit ? " exit" : ""}`}>
      <div className="loader-logo"><span>AXTON</span> TECH</div>
      <div className="loader-tagline">Engineering the future</div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <div className="progress-shine" />
      </div>
      <div className="progress-pct">{progress}%</div>
    </div>
  );
}
