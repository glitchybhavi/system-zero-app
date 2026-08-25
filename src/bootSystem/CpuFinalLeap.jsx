import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { Power, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CpuFinalLeap() {
  const sectionRef = useRef(null);
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const [smashed, setSmashed] = useState(false);
  const animControllerRef = useRef(null);

  // Trigger precisely when the user scrolls into view
  const isInView = useInView(sectionRef, { amount: 0.35, once: false });

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera angled slightly higher looking down at the motherboard
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 15, 14.5);
    camera.lookAt(0, -1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Board Group shifted slightly downwards so it never overlaps the top text
    const boardGroup = new THREE.Group();
    boardGroup.position.set(0, -1.5, 0);
    scene.add(boardGroup);

    // ========== MATERIALS ==========
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1A9A49, roughness: 0.85, metalness: 0.15 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.15, metalness: 0.9 });
    const heatSinkMat = new THREE.MeshStandardMaterial({ color: 0xa0aec0, roughness: 0.25, metalness: 0.85 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4, metalness: 0.5 });
    const portMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.7 });

    // Distinct Solid Group Materials: Left (Red), Center (Yellow), Right (Cyan)
    const redTraceMat = new THREE.MeshStandardMaterial({
      color: 0x220505,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.2,
      metalness: 0.8
    });

    const yellowTraceMat = new THREE.MeshStandardMaterial({
      color: 0x221805,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.2,
      metalness: 0.8
    });

    const cyanTraceMat = new THREE.MeshStandardMaterial({
      color: 0x051a22,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.2,
      metalness: 0.8
    });

    // ========== 2. MOTHERBOARD GEOMETRY ==========
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8), pcbMat);
    pcb.receiveShadow = true;
    boardGroup.add(pcb);

    const socket = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.24, 2.7), plasticMat);
    socket.position.set(0, 0.08, 0);
    boardGroup.add(socket);

    // Socket Pins inside bed
    for (let x = -1; x <= 1; x += 0.2) {
      for (let z = -1; z <= 1; z += 0.2) {
        if (Math.abs(x) < 0.3 && Math.abs(z) < 0.3) continue;
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.06), goldMat);
        pin.position.set(x, 0.20, z);
        boardGroup.add(pin);
      }
    }

    // Circuit Traces Grouped into Left (Red), Center (Yellow), Right (Cyan)
    const createTrace = (w, h, d, x, z, mat) => {
      const trace = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      trace.position.set(x, 0.11, z);
      boardGroup.add(trace);
    };

    // Left Trace Group (Red)
    for (let i = 0; i < 9; i++) {
      const zOffset = -3.4 + i * 0.85;
      createTrace(2.8, 0.02, 0.05, -4.5, zOffset, redTraceMat);
      if (i > 1 && i < 7) {
        createTrace(1.4, 0.02, 0.05, -2.4, zOffset, redTraceMat);
        createTrace(0.05, 0.02, 0.6, -1.7, zOffset + 0.3, redTraceMat);
      }
    }

    // Center Trace Group (Yellow)
    for (let i = 0; i < 6; i++) {
      const xOffset = -1.1 + i * 0.44;
      createTrace(0.05, 0.02, 2.4, xOffset, -2.7, yellowTraceMat);
      createTrace(0.05, 0.02, 2.4, xOffset, 2.7, yellowTraceMat);
    }

    // Right Trace Group (Cyan Blue)
    for (let i = 0; i < 9; i++) {
      const zOffset = -3.4 + i * 0.85;
      createTrace(2.6, 0.02, 0.05, 4.4, zOffset, cyanTraceMat);
      createTrace(0.05, 0.02, 0.7, 3.1, zOffset + 0.2, cyanTraceMat);
    }

    // Motherboard Peripherals
    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 2.5), heatSinkMat);
    vrmLeft.position.set(-1.8, 0.35, 0);
    boardGroup.add(vrmLeft);
    
    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 0.8), heatSinkMat);
    vrmTop.position.set(0, 0.35, -1.8);
    boardGroup.add(vrmTop);

    for (let i = 0; i < 5; i++) {
      const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16), capMat);
      cap1.position.set(-2.5, 0.25, -1.5 + (i * 0.75));
      boardGroup.add(cap1);

      const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16), capMat);
      cap2.position.set(-1.5 + (i * 0.75), 0.25, -2.5);
      boardGroup.add(cap2);
    }

    for (let i = 0; i < 4; i++) {
      const ramSlot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 4.5), plasticMat);
      ramSlot.position.set(2.2 + (i * 0.5), 0.2, 0);
      boardGroup.add(ramSlot);
    }

    const nbSink = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 1.4), heatSinkMat);
    nbSink.position.set(2.5, 0.35, -2.5);
    boardGroup.add(nbSink);

    for (let i = 0; i < 3; i++) {
      const pcie = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 0.4), plasticMat);
      pcie.position.set(-1.5, 0.25, 1.8 + (i * 0.8));
      boardGroup.add(pcie);
    }

    const ioBlock1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.5), portMat);
    ioBlock1.position.set(-5.6, 0.4, -2.5);
    boardGroup.add(ioBlock1);

    const ioBlock2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.0), portMat);
    ioBlock2.position.set(-5.6, 0.5, -1.0);
    boardGroup.add(ioBlock2);

    // ========== 3. THE 3D CPU DIE (Extracted cleanly from cpu_clean.png) ==========
    const textureLoader = new THREE.TextureLoader();
    const cpuTexture = textureLoader.load('cpu_clean.png');
    cpuTexture.generateMipmaps = true;
    cpuTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const cpuGroup = new THREE.Group();
    // Starts high up in the sky, clearly visible dropping down
    cpuGroup.position.set(0, 16.0, 0);
    boardGroup.add(cpuGroup);

    // Silicon Substrate
    const cpuSubstrate = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.14, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x081320, roughness: 0.25, metalness: 0.85 })
    );
    cpuGroup.add(cpuSubstrate);

    // Microarchitecture Die Image Top
    const cpuDie = new THREE.Mesh(
      new THREE.PlaneGeometry(2.45, 2.45),
      new THREE.MeshStandardMaterial({ 
        map: cpuTexture, 
        transparent: true, 
        roughness: 0.2, 
        metalness: 0.9,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.2
      })
    );
    cpuDie.rotation.x = -Math.PI / 2;
    cpuDie.position.y = 0.08;
    cpuGroup.add(cpuDie);

    // Gold Contact Rim
    const goldRim = new THREE.Mesh(
      new THREE.BoxGeometry(2.52, 0.04, 2.52),
      goldMat
    );
    goldRim.position.y = 0.02;
    cpuGroup.add(goldRim);

    // Shockwave Ring upon impact
    const ringGeo = new THREE.RingGeometry(0.4, 0.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x00f2fe, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0 
    });
    const shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
    shockwaveRing.rotation.x = -Math.PI / 2;
    shockwaveRing.position.set(0, 0.14, 0);
    boardGroup.add(shockwaveRing);

    // Steady Socket Illumination
    const socketGlow = new THREE.PointLight(0x00f2fe, 0, 8);
    socketGlow.position.set(0, 1.0, 0);
    boardGroup.add(socketGlow);

    // Scene Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(8, 16, 8);
    scene.add(dirLight);

    // ========== 4. DROP & SMASH PHYSICS ENGINE ==========
    let isFalling = false;
    let isImpacted = false;
    let fallVelocity = 0;
    let traceGlowProgress = 0;
    let shockwaveScale = 0;
    let shockwaveOpacity = 0;
    let shakeIntensity = 0;

    const startDropSequence = () => {
      // Reset CPU to sky height
      cpuGroup.position.set(0, 15.0, 0);
      fallVelocity = 0;
      isFalling = true;
      isImpacted = false;
      traceGlowProgress = 0;
      setSmashed(false);

      // Darken traces until impact
      redTraceMat.emissiveIntensity = 0;
      yellowTraceMat.emissiveIntensity = 0;
      cyanTraceMat.emissiveIntensity = 0;
      socketGlow.intensity = 0;
    };

    animControllerRef.current = {
      triggerDrop: startDropSequence
    };

    // ========== 5. RENDER LOOP ==========
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera Shake decay on impact
      if (shakeIntensity > 0.001) {
        camera.position.x = (Math.random() - 0.5) * shakeIntensity;
        camera.position.y = 15 + (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.85;
      } else {
        camera.position.x = 0;
        camera.position.y = 15;
      }

      // Calm ambient levitation of the motherboard
      boardGroup.position.y = -1.5 + Math.sin(time * 1.2) * 0.05;
      boardGroup.rotation.y = Math.sin(time * 0.3) * 0.015;

      // Accelerating downward drop
      if (isFalling) {
        fallVelocity += delta * 52; // Gravity acceleration
        cpuGroup.position.y -= fallVelocity * delta;

        // Smash into socket plane y = 0.26
        const targetSocketY = 0.26;
        if (cpuGroup.position.y <= targetSocketY) {
          cpuGroup.position.y = targetSocketY;
          isFalling = false;
          isImpacted = true;
          setSmashed(true);

          // Trigger Impact effects
          shakeIntensity = 0.45; // Camera jitter
          shockwaveScale = 0.4;
          shockwaveOpacity = 0.85;
        }
      }

      // After Impact: Dissolve Shockwave & Solid Wire Glow
      if (isImpacted) {
        if (shockwaveOpacity > 0.01) {
          shockwaveScale += delta * 14;
          shockwaveOpacity *= 0.90;
          shockwaveRing.scale.set(shockwaveScale, shockwaveScale, 1);
          ringMat.opacity = shockwaveOpacity;
        }

        // Smooth steady trace illumination (No blinking)
        if (traceGlowProgress < 1.0) {
          traceGlowProgress = Math.min(1.0, traceGlowProgress + delta * 2.2);
        }

        // Solid distinct emissive groups
        redTraceMat.emissive.setHex(0xef4444);
        redTraceMat.emissiveIntensity = traceGlowProgress * 2.5;

        yellowTraceMat.emissive.setHex(0xf59e0b);
        yellowTraceMat.emissiveIntensity = traceGlowProgress * 2.5;

        cyanTraceMat.emissive.setHex(0x06b6d4);
        cyanTraceMat.emissiveIntensity = traceGlowProgress * 2.5;

        // Solid steady socket light
        socketGlow.intensity = traceGlowProgress * 3.8;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [theme]);

  // Trigger drop when scrolled into view
  useEffect(() => {
    if (isInView && animControllerRef.current) {
      animControllerRef.current.triggerDrop();
    }
  }, [isInView]);

  const handleReplaySeat = () => {
    if (animControllerRef.current) {
      animControllerRef.current.triggerDrop();
    }
  };

  const handleUnboot = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      id="cpu-forge" 
      className="relative w-full min-h-screen bg-background flex flex-col items-center justify-between overflow-hidden pt-8 pb-14"
    >
      
      {/* 1. TOP HEADER OVERLAY (Cleanly positioned above the motherboard with zero overlap) */}
      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto px-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/85 backdrop-blur-xl border border-borderLine px-8 py-5 rounded-2xl shadow-2xl max-w-xl pointer-events-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-textMain tracking-tight mb-2">
            System Architecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">Synthesized.</span>
          </h2>
          <p className="text-textMuted text-xs md:text-sm leading-relaxed">
            The Central Processing Unit is now seated into the mainboard socket. System interconnects energized: <span className="text-red-400 font-mono font-medium">Power</span>, <span className="text-amber-400 font-mono font-medium">Buses</span>, and <span className="text-cyan-400 font-mono font-medium">Data Channels</span>.
          </p>
        </motion.div>
      </div>

      {/* 2. 3D MOTHERBOARD & SMASHING CPU CANVAS (Positioned cleanly below the header) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* 3. BOTTOM ACTION CONTROLS */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 px-6 mt-auto pointer-events-auto">
        

        {/* Reinitialize / Power Down Action */}
        <button
          onClick={handleUnboot}
          className={`group relative flex items-center justify-center gap-3 px-8 py-3 text-white font-mono font-semibold text-xs rounded-xl overflow-hidden transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/30' 
              : 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-orange-500/30'
          }`}
        >
          <span className="relative z-10 tracking-wider">REBOOT SYSTEM</span>
          <Power size={16} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
        </button>

      </div>

    </section>
  );
}