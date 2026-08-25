import { useEffect, useRef } from 'react';
import './styles/Content.css';


function mapRange(val, inMin, inMax) {
  const result = (val - inMin) / (inMax - inMin);
  return Math.max(0, Math.min(1, result));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const PHASES = {
  t1: { in: [0.0, 0.12],  hold: [0.12, 0.28], out: [0.28, 0.42] },
  t2: { in: [0.38, 0.50], hold: [0.50, 0.62], out: [0.62, 0.74] },
  t3: { in: [0.70, 0.80], hold: [0.80, 0.88], out: [0.88, 0.96] },
  bgFadeIn:  [0.0, 0.12],
  bgFadeOut: [0.86, 0.96],
};

function computePhase(p, phase, travel, startScale, scaleRange, maxBlur, exitBlur) {
  if (p < phase.in[0]) {
    return { opacity: 0, y: travel, scale: startScale, blur: maxBlur };
  }
  if (p < phase.in[1]) {
    const e = easeInOutCubic(mapRange(p, phase.in[0], phase.in[1]));
    return {
      opacity: e,
      y: travel * (1 - e),
      scale: startScale + scaleRange * e,
      blur: maxBlur * (1 - e),
    };
  }
  if (p < phase.hold[1]) {
    return { opacity: 1, y: 0, scale: startScale + scaleRange, blur: 0 };
  }
  if (p < phase.out[1]) {
    const e = easeInOutCubic(mapRange(p, phase.out[0], phase.out[1]));
    return {
      opacity: 1 - e,
      y: -travel * e,
      scale: (startScale + scaleRange) - scaleRange * e,
      blur: exitBlur * e,
    };
  }
  return { opacity: 0, y: -travel, scale: startScale, blur: exitBlur };
}

export default function Content() {
  const morphSectionRef = useRef(null);
  const ambientBgRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useEffect(() => {
    const morphSection = morphSectionRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const text3 = text3Ref.current;
    const ambientBg = ambientBgRef.current;
    if (!morphSection || !text1 || !text2 || !text3 || !ambientBg) return;


    function applyFrame() {
      const rect = morphSection.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return;

      const p = Math.max(0, Math.min(1, -rect.top / totalScroll));

      let bgOpacity = 0;
      if (p > 0 && p < 1) {
        if (p < PHASES.bgFadeIn[1]) {
          bgOpacity = easeInOutCubic(mapRange(p, PHASES.bgFadeIn[0], PHASES.bgFadeIn[1]));
        } else if (p < PHASES.bgFadeOut[0]) {
          bgOpacity = 1;
        } else if (p < PHASES.bgFadeOut[1]) {
          bgOpacity = 1 - easeInOutCubic(mapRange(p, PHASES.bgFadeOut[0], PHASES.bgFadeOut[1]));
        }
      }

      ambientBg.style.setProperty('--bg-opacity', bgOpacity.toFixed(3));
      ambientBg.style.setProperty('--bg-y', `${Math.round(p * 100)}px`);
      ambientBg.style.setProperty('--bg-rot', `${(p * 15).toFixed(1)}deg`);

      const t1 = computePhase(p, PHASES.t1, 40, 0.96, 0.04, 8, 12);
      text1.style.setProperty('--opacity', t1.opacity.toFixed(3));
      text1.style.setProperty('--translateY', `${Math.round(t1.y)}px`);
      text1.style.setProperty('--scale', t1.scale.toFixed(3));
      text1.style.setProperty('--blur', `${Math.round(t1.blur)}px`);

      const t2 = computePhase(p, PHASES.t2, 35, 1.05, -0.05, 10, 10);
      text2.style.setProperty('--opacity', t2.opacity.toFixed(3));
      text2.style.setProperty('--translateY', `${Math.round(t2.y)}px`);
      text2.style.setProperty('--scale', t2.scale.toFixed(3));
      text2.style.setProperty('--blur', `${Math.round(t2.blur)}px`);

      const t3 = computePhase(p, PHASES.t3, 25, 0.82, 0.18, 12, 14);
      text3.style.setProperty('--opacity', t3.opacity.toFixed(3));
      text3.style.setProperty('--translateY', `${Math.round(t3.y)}px`);
      text3.style.setProperty('--scale', t3.scale.toFixed(3));
      text3.style.setProperty('--blur', `${Math.round(t3.blur)}px`);
    }

    let rafId = null;
    let isVisible = false;

    function loop() {
      applyFrame();
      rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (rafId !== null) return; 
      applyFrame(); 
      rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(morphSection);

    window.addEventListener('resize', applyFrame);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', applyFrame);
    };
  }, []);

  return (
    <section className="scroll-morph-container" id="morph-section" ref={morphSectionRef}>
      <div className="sticky-content">
        <div className="ambient-bg" ref={ambientBgRef} />

        <div className="morph-text" id="text-1" ref={text1Ref}>
          <h2>
            Struggling to visualize complex
            <br />
            Computer Science concepts?
          </h2>
        </div>

        <div className="morph-text" id="text-2" ref={text2Ref}>
          <h2>
            You are in the right place.
            <br />
       
          </h2>
        </div>

        <div className="morph-text massive" id="text-3" ref={text3Ref}>
          <h2>SYSTEM ZERO</h2>
        </div>
      </div>
    </section>
  );
}