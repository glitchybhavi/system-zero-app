// Landing Page content component 
// Dev Notes: I  used LERP Scroll technique and Lenis engine to make this landing page Smooth and to achieve desirable output. 
// Contents of Page are still in prototype and will be updated


import { useEffect, useRef } from 'react';
import './Content.css';

// --- SCROLL-MORPH LERP ENGINE (module scope helpers) ---
function mapRange(val, inMin, inMax) {
  const result = (val - inMin) / (inMax - inMin);
  return Math.max(0, Math.min(1, result));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a, b, n) {
  return a + (b - a) * n;
}

const PHASES = {
  t1: { in: [0.0, 0.08], hold: [0.08, 0.28], out: [0.28, 0.36] },
  t2: { in: [0.34, 0.42], hold: [0.42, 0.62], out: [0.62, 0.70] },
  t3: { in: [0.68, 0.76], hold: [0.76, 0.86], out: [0.86, 0.93] },
  bgFadeIn: [0.0, 0.08],
  bgFadeOut: [0.85, 0.93],
};

export default function Content() {
  const morphSectionRef = useRef(null);
  const ambientBgRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  // --- Effect: cinematic scroll-morph text sequence (Lerp-smoothed) ---
  useEffect(() => {
    const morphSection = morphSectionRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const text3 = text3Ref.current;
    const ambientBg = ambientBgRef.current;
    if (!morphSection || !text1 || !text2 || !text3 || !ambientBg) return;

    // Target state — recomputed whenever scroll position changes
    const target = {
      bg: { opacity: 0, y: 0, rot: 0 },
      t1: { opacity: 0, y: 40, scale: 0.96, blur: 8 },
      t2: { opacity: 0, y: 35, scale: 1.05, blur: 10 },
      t3: { opacity: 0, y: 25, scale: 0.82, blur: 12 },
    };

    // Current on-screen state — chases target every frame via lerp
    const current = {
      bg: { opacity: 0, y: 0, rot: 0 },
      t1: { opacity: 0, y: 40, scale: 0.96, blur: 8 },
      t2: { opacity: 0, y: 35, scale: 1.05, blur: 10 },
      t3: { opacity: 0, y: 25, scale: 0.82, blur: 12 },
    };

    function computeTargets(p) {
      // --- Ambient background glow ---
      let bgOpacity = 0;
      if (p > 0 && p < 1) {
        if (p < PHASES.bgFadeIn[1]) {
          bgOpacity = easeInOutCubic(mapRange(p, PHASES.bgFadeIn[0], PHASES.bgFadeIn[1]));
        } else if (p < PHASES.bgFadeOut[0]) {
          bgOpacity = 1;
        } else if (p < PHASES.bgFadeOut[1]) {
          bgOpacity = 1 - easeInOutCubic(mapRange(p, PHASES.bgFadeOut[0], PHASES.bgFadeOut[1]));
        } else {
          bgOpacity = 0;
        }
      }
      target.bg.opacity = bgOpacity;
      target.bg.y = p * 100;
      target.bg.rot = p * 15;

      // --- Phase 1 text ---
      let t1Opacity = 0,
        t1Y = 40,
        t1Scale = 0.96,
        t1Blur = 8;
      const p1 = PHASES.t1;
      if (p < p1.in[0]) {
        t1Opacity = 0;
        t1Y = 40;
        t1Scale = 0.96;
        t1Blur = 8;
      } else if (p < p1.in[1]) {
        const e = easeInOutCubic(mapRange(p, p1.in[0], p1.in[1]));
        t1Opacity = e;
        t1Y = 40 * (1 - e);
        t1Scale = 0.96 + 0.04 * e;
        t1Blur = 8 * (1 - e);
      } else if (p < p1.hold[1]) {
        t1Opacity = 1;
        t1Y = 0;
        t1Scale = 1;
        t1Blur = 0;
      } else if (p < p1.out[1]) {
        const e = easeInOutCubic(mapRange(p, p1.out[0], p1.out[1]));
        t1Opacity = 1 - e;
        t1Y = -40 * e;
        t1Scale = 1 - 0.04 * e;
        t1Blur = 12 * e;
      } else {
        t1Opacity = 0;
        t1Y = -40;
        t1Scale = 0.96;
        t1Blur = 12;
      }
      target.t1 = { opacity: t1Opacity, y: t1Y, scale: t1Scale, blur: t1Blur };

      // --- Phase 2 text ---
      let t2Opacity = 0,
        t2Y = 35,
        t2Scale = 1.05,
        t2Blur = 10;
      const p2 = PHASES.t2;
      if (p < p2.in[0]) {
        t2Opacity = 0;
        t2Y = 35;
        t2Scale = 1.05;
        t2Blur = 10;
      } else if (p < p2.in[1]) {
        const e = easeInOutCubic(mapRange(p, p2.in[0], p2.in[1]));
        t2Opacity = e;
        t2Y = 35 * (1 - e);
        t2Scale = 1.05 - 0.05 * e;
        t2Blur = 10 * (1 - e);
      } else if (p < p2.hold[1]) {
        t2Opacity = 1;
        t2Y = 0;
        t2Scale = 1;
        t2Blur = 0;
      } else if (p < p2.out[1]) {
        const e = easeInOutCubic(mapRange(p, p2.out[0], p2.out[1]));
        t2Opacity = 1 - e;
        t2Y = -35 * e;
        t2Scale = 1 - 0.03 * e;
        t2Blur = 10 * e;
      } else {
        t2Opacity = 0;
        t2Y = -35;
        t2Scale = 0.97;
        t2Blur = 10;
      }
      target.t2 = { opacity: t2Opacity, y: t2Y, scale: t2Scale, blur: t2Blur };

      // --- Phase 3 text (massive SYSTEM ZERO reveal & exit) ---
      let t3Opacity = 0,
        t3Y = 25,
        t3Scale = 0.82,
        t3Blur = 12;
      const p3 = PHASES.t3;
      if (p < p3.in[0]) {
        t3Opacity = 0;
        t3Y = 25;
        t3Scale = 0.82;
        t3Blur = 12;
      } else if (p < p3.in[1]) {
        const e = easeInOutCubic(mapRange(p, p3.in[0], p3.in[1]));
        t3Opacity = e;
        t3Y = 25 * (1 - e);
        t3Scale = 0.82 + 0.18 * e;
        t3Blur = 12 * (1 - e);
      } else if (p < p3.hold[1]) {
        t3Opacity = 1;
        t3Y = 0;
        t3Scale = 1;
        t3Blur = 0;
      } else if (p < p3.out[1]) {
        const e = easeInOutCubic(mapRange(p, p3.out[0], p3.out[1]));
        t3Opacity = 1 - e;
        t3Y = -25 * e;
        t3Scale = 1 + 0.08 * e;
        t3Blur = 14 * e;
      } else {
        t3Opacity = 0;
        t3Y = -25;
        t3Scale = 1.08;
        t3Blur = 14;
      }
      target.t3 = { opacity: t3Opacity, y: t3Y, scale: t3Scale, blur: t3Blur };
    }

    function updateScrollProgress() {
      const rect = morphSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScroll = rect.height - windowHeight;
      let p = -rect.top / totalScroll;
      p = Math.max(0, Math.min(1, p));
      computeTargets(p);
    }

    // Frame-rate independent lerp constant. 8 complements Lenis duration:1.2
    const LERP_SPEED = 8;
    let lastTime = 0;
    let isFirstFrame = true;
    let rafId;

    function lerpGroup(cur, tgt, factor) {
      for (const key in tgt) {
        cur[key] = lerp(cur[key], tgt[key], factor);
      }
    }

    function snapCurrentToTarget() {
      for (const key in target.bg) current.bg[key] = target.bg[key];
      for (const key in target.t1) current.t1[key] = target.t1[key];
      for (const key in target.t2) current.t2[key] = target.t2[key];
      for (const key in target.t3) current.t3[key] = target.t3[key];
    }

    function applyStyles() {
      ambientBg.style.setProperty('--bg-opacity', current.bg.opacity.toFixed(4));
      ambientBg.style.setProperty('--bg-y', `${current.bg.y.toFixed(2)}px`);
      ambientBg.style.setProperty('--bg-rot', `${current.bg.rot.toFixed(2)}deg`);

      text1.style.setProperty('--opacity', current.t1.opacity.toFixed(4));
      text1.style.setProperty('--translateY', `${current.t1.y.toFixed(2)}px`);
      text1.style.setProperty('--scale', current.t1.scale.toFixed(4));
      text1.style.setProperty('--blur', `${current.t1.blur.toFixed(2)}px`);

      text2.style.setProperty('--opacity', current.t2.opacity.toFixed(4));
      text2.style.setProperty('--translateY', `${current.t2.y.toFixed(2)}px`);
      text2.style.setProperty('--scale', current.t2.scale.toFixed(4));
      text2.style.setProperty('--blur', `${current.t2.blur.toFixed(2)}px`);

      text3.style.setProperty('--opacity', current.t3.opacity.toFixed(4));
      text3.style.setProperty('--translateY', `${current.t3.y.toFixed(2)}px`);
      text3.style.setProperty('--scale', current.t3.scale.toFixed(4));
      text3.style.setProperty('--blur', `${current.t3.blur.toFixed(2)}px`);
    }

    function animationLoop(time) {
      if (!isVisible) {
        rafId = requestAnimationFrame(animationLoop);
        return;
      }

      // On first frame, snap to correct state instantly (no lerp-from-zero flash)
      if (isFirstFrame) {
        lastTime = time;
        updateScrollProgress();
        snapCurrentToTarget();
        applyStyles();
        isFirstFrame = false;
        rafId = requestAnimationFrame(animationLoop);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const factor = 1 - Math.exp(-LERP_SPEED * dt);

      lerpGroup(current.bg, target.bg, factor);
      lerpGroup(current.t1, target.t1, factor);
      lerpGroup(current.t2, target.t2, factor);
      lerpGroup(current.t3, target.t3, factor);

      applyStyles();
      rafId = requestAnimationFrame(animationLoop);
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          updateScrollProgress();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(morphSection);

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
    rafId = requestAnimationFrame(animationLoop);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
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
            Welcome to
          </h2>
        </div>

        <div className="morph-text massive" id="text-3" ref={text3Ref}>
      
          <h2>SYSTEM ZERO</h2>
        </div>
      </div>
    </section>
  );
}
