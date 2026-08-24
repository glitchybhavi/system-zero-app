import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Layers } from 'lucide-react';

export default function OsVisualizer() {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    // ========== SCENE ==========
    const scene = new THREE.Scene();
    const W = container.clientWidth;
    const H = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // ========== PARTICLE CLOUD (the outer sphere of fine dust) ==========
    const CLOUD_COUNT = 5000;
    const cloudPositions = new Float32Array(CLOUD_COUNT * 3);
    const cloudColors = new Float32Array(CLOUD_COUNT * 3);
    const cloudBaseAngles = new Float32Array(CLOUD_COUNT);   // azimuthal
    const cloudBasePhi = new Float32Array(CLOUD_COUNT);      // polar
    const cloudBaseRadius = new Float32Array(CLOUD_COUNT);
    const cloudSpeeds = new Float32Array(CLOUD_COUNT);

    const SPHERE_RADIUS = 8;

    const isDark = theme === 'dark';

    for (let i = 0; i < CLOUD_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SPHERE_RADIUS * (0.6 + Math.random() * 0.5);

      cloudBaseAngles[i] = theta;
      cloudBasePhi[i] = phi;
      cloudBaseRadius[i] = r;
      cloudSpeeds[i] = (Math.random() - 0.5) * 0.003;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      cloudPositions[i * 3] = x;
      cloudPositions[i * 3 + 1] = y;
      cloudPositions[i * 3 + 2] = z;

      if (isDark) {
        const brightness = 0.55 + Math.random() * 0.45;
        cloudColors[i * 3] = brightness * 0.85;
        cloudColors[i * 3 + 1] = brightness * 0.88;
        cloudColors[i * 3 + 2] = brightness;
      } else {
        // Dark particles for light mode
        const brightness = 0.1 + Math.random() * 0.25;
        cloudColors[i * 3] = brightness * 0.6;
        cloudColors[i * 3 + 1] = brightness * 0.65;
        cloudColors[i * 3 + 2] = brightness;
      }
    }

    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeo.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));

    // Soft circular sprite for particles
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const cloudMat = new THREE.PointsMaterial({
      size: 0.12,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.7 : 0.85,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const cloudPoints = new THREE.Points(cloudGeo, cloudMat);
    scene.add(cloudPoints);

    // ========== INNER RIBBONS / TENDRILS (bright flowing trails inside the sphere) ==========
    const RIBBON_COUNT = 12;
    const RIBBON_LENGTH = 120;
    const ribbons = [];

    for (let r = 0; r < RIBBON_COUNT; r++) {
      const ribbonPositions = new Float32Array(RIBBON_LENGTH * 3);
      const ribbonColors = new Float32Array(RIBBON_LENGTH * 3);
      const ribbonSizes = new Float32Array(RIBBON_LENGTH);

      // Each ribbon starts at a random point inside the sphere
      const startTheta = Math.random() * Math.PI * 2;
      const startPhi = Math.acos(2 * Math.random() - 1);
      const startR = Math.random() * SPHERE_RADIUS * 0.7;

      for (let j = 0; j < RIBBON_LENGTH; j++) {
        const t = j / RIBBON_LENGTH;
        ribbonPositions[j * 3] = startR * Math.sin(startPhi + t * 3) * Math.cos(startTheta + t * 5);
        ribbonPositions[j * 3 + 1] = startR * Math.sin(startPhi + t * 3) * Math.sin(startTheta + t * 5);
        ribbonPositions[j * 3 + 2] = startR * Math.cos(startPhi + t * 3);

        const fade = Math.sin(t * Math.PI);
        if (isDark) {
          ribbonColors[j * 3] = 0.9 + fade * 0.1;
          ribbonColors[j * 3 + 1] = 0.92 + fade * 0.08;
          ribbonColors[j * 3 + 2] = 1.0;
        } else {
          ribbonColors[j * 3] = 0.05 + fade * 0.15;
          ribbonColors[j * 3 + 1] = 0.08 + fade * 0.12;
          ribbonColors[j * 3 + 2] = 0.2 + fade * 0.2;
        }
        ribbonSizes[j] = 0.06 + fade * 0.18;
      }

      const ribbonGeo = new THREE.BufferGeometry();
      ribbonGeo.setAttribute('position', new THREE.BufferAttribute(ribbonPositions, 3));
      ribbonGeo.setAttribute('color', new THREE.BufferAttribute(ribbonColors, 3));

      const ribbonMat = new THREE.PointsMaterial({
        size: 0.2,
        map: spriteTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const ribbonPoints = new THREE.Points(ribbonGeo, ribbonMat);
      scene.add(ribbonPoints);

      ribbons.push({
        geo: ribbonGeo,
        points: ribbonPoints,
        mat: ribbonMat,
        // Animation parameters
        baseTheta: startTheta,
        basePhi: startPhi,
        baseR: startR,
        speed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.4,
        curl: 2 + Math.random() * 5,
        verticalCurl: 1.5 + Math.random() * 3,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }

    // ========== MOUSE INTERACTION ==========
    const mouseNDC = new THREE.Vector2(-9999, -9999);
    const targetNDC = new THREE.Vector2(-9999, -9999);
    const raycaster = new THREE.Raycaster();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let mouseWorld = new THREE.Vector3();

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMouseMove);

    // ========== ANIMATION ==========
    let reqId;
    const clock = new THREE.Clock();
    const tmpVec = new THREE.Vector3();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Mouse interpolation
      mouseNDC.lerp(targetNDC, 0.08);
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(mousePlane, mouseWorld);

      // ---- Animate cloud particles ----
      const cPos = cloudGeo.attributes.position.array;
      for (let i = 0; i < CLOUD_COUNT; i++) {
        cloudBaseAngles[i] += cloudSpeeds[i];
        const theta = cloudBaseAngles[i];
        const phi = cloudBasePhi[i];
        const r = cloudBaseRadius[i];

        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);

        // Subtle breathing
        const breathe = 1 + Math.sin(t * 0.5 + phi * 2) * 0.04;
        x *= breathe;
        y *= breathe;
        z *= breathe;

        // Mouse repulsion
        tmpVec.set(x, y, z);
        const dist = tmpVec.distanceTo(mouseWorld);
        if (dist < 5.0) {
          const force = (5.0 - dist) * 0.3;
          tmpVec.sub(mouseWorld).normalize().multiplyScalar(force);
          x += tmpVec.x;
          y += tmpVec.y;
          z += tmpVec.z;
        }

        cPos[i * 3] = x;
        cPos[i * 3 + 1] = y;
        cPos[i * 3 + 2] = z;
      }
      cloudGeo.attributes.position.needsUpdate = true;

      // ---- Animate ribbon tendrils ----
      for (let r = 0; r < ribbons.length; r++) {
        const rb = ribbons[r];
        const rPos = rb.geo.attributes.position.array;
        const time = t * rb.speed + rb.phaseOffset;

        for (let j = 0; j < RIBBON_LENGTH; j++) {
          const s = j / RIBBON_LENGTH;

          // Create flowing, curling paths confined within the sphere
          const theta = rb.baseTheta + time + s * rb.curl;
          const phi = rb.basePhi + Math.sin(time * 0.7 + s * rb.verticalCurl) * 1.2;
          const radius = rb.baseR * (0.3 + s * 0.7) * (1 + Math.sin(time + s * 4) * 0.15);

          // Clamp to sphere
          const clampedR = Math.min(radius, SPHERE_RADIUS * 0.85);

          let x = clampedR * Math.sin(phi) * Math.cos(theta);
          let y = clampedR * Math.sin(phi) * Math.sin(theta);
          let z = clampedR * Math.cos(phi);

          // Add organic drift
          x += Math.sin(time * 1.3 + j * 0.1) * rb.drift;
          y += Math.cos(time * 0.9 + j * 0.15) * rb.drift;

          rPos[j * 3] = x;
          rPos[j * 3 + 1] = y;
          rPos[j * 3 + 2] = z;
        }
        rb.geo.attributes.position.needsUpdate = true;
      }

      // Slow auto-rotate the whole sphere for dynamism
      cloudPoints.rotation.y = t * 0.05;
      cloudPoints.rotation.x = Math.sin(t * 0.03) * 0.1;

      for (const rb of ribbons) {
        rb.points.rotation.y = t * 0.05;
        rb.points.rotation.x = Math.sin(t * 0.03) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ========== RESIZE ==========
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      spriteTex.dispose();
      for (const rb of ribbons) {
        rb.geo.dispose();
        rb.mat.dispose();
      }
    };
  }, [theme]);

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden">
      {/* 3D Canvas — right-aligned to match chip & computer */}
      <div ref={mountRef} className="absolute top-0 right-0 w-full md:w-[60%] h-full z-0 pointer-events-auto cursor-crosshair" />

      {/* Text Overlay — Left Side */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center">
        <div className="max-w-7xl mx-auto px-10 w-full">
          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-bold rounded-full tracking-wider">
              <Layers size={14} />
              PHASE 02 : OPERATING SYSTEMS
            </span>

            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              The Brain Behind <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
                Multitasking.
              </span>
            </h2>

            <p className="text-base text-textMuted leading-relaxed">
              Thousands of tasks compete for attention every second. The system orchestrates their flow in real time, distributing workload evenly so everything runs in harmony.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}