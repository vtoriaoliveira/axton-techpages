import { useState, useEffect } from "react";

/**
 * useLoader
 * Simula progresso de carregamento em múltiplos passos.
 * Retorna: progress (0-100), loaded (bool), showPage (bool)
 */
export function useLoader() {
  const [progress, setProgress] = useState(0);
  const [loaded,   setLoaded]   = useState(false);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const steps = [
      { target: 30,  delay: 200, speed: 18 },
      { target: 65,  delay: 0,   speed: 28 },
      { target: 85,  delay: 0,   speed: 45 },
      { target: 100, delay: 0,   speed: 22 },
    ];
    let current = 0, step = 0;

    function runStep() {
      if (step >= steps.length) return;
      const { target, delay, speed } = steps[step];
      setTimeout(() => {
        const iv = setInterval(() => {
          current++;
          setProgress(current);
          if (current >= target) {
            clearInterval(iv); step++;
            if (current >= 100) {
              setTimeout(() => { setLoaded(true); setTimeout(() => setShowPage(true), 50); }, 400);
            } else runStep();
          }
        }, speed);
      }, delay);
    }
    runStep();
  }, []);

  return { progress, loaded, showPage };
}
