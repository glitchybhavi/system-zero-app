import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MotherboardHook() {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const [bootState, setBootState] = useState('idle');

  const errorLightRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (container.childNodes.length > 0) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 14, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    // ========== MATERIALS ==========
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1A9A49, roughness: 0.9, metalness: 0.1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.15, metalness: 0.9 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 });
    const heatSinkMat = new THREE.MeshStandardMaterial({ color: 0xa0aec0, roughness: 0.3, metalness: 0.85 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4, metalness: 0.5 });
    const portMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.7 });

    // ========== 2. MOTHERBOARD GEOMETRY ==========
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8), pcbMat);
    pcb.receiveShadow = true;
    boardGroup.add(pcb);

    const socket = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.25, 2.5), plasticMat);
    socket.position.set(0, 0.05, 0);
    boardGroup.add(socket);

    for (let x = -1; x <= 1; x += 0.2) {
      for (let z = -1; z <= 1; z += 0.2) {
        if (Math.abs(x) < 0.3 && Math.abs(z) < 0.3) continue; 
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.06), goldMat);
        pin.position.set(x, 0.20, z); 
        boardGroup.add(pin);
      }
    }

    const createTrace = (w, h, d, x, z) => {
      const trace = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), silverMat);
      trace.position.set(x, 0.11, z);
      boardGroup.add(trace);
    };

    for (let i = 0; i < 12; i++) {
      const zOffset = -3.5 + i * 0.6;
      createTrace(2.5, 0.02, 0.04, -4.5, zOffset);
      if (i > 2 && i < 9) createTrace(0.8, 0.02, 0.04, -2.5, zOffset);
      
      createTrace(1.5, 0.02, 0.04, 4.5, zOffset);
      createTrace(0.04, 0.02, 0.6, 3.75, zOffset + 0.3);
    }

    // ========== 3. ADDITIONAL COMPONENTS ==========
    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 2.5), heatSinkMat);
    vrmLeft.position.set(-1.8, 0.35, 0);
    boardGroup.add(vrmLeft);
    
    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 0.8), heatSinkMat);
    vrmTop.position.set(0, 0.35, -1.8);
    boardGroup.add(vrmTop);

    for(let i=0; i < 5; i++) {
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

    const nbBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.5), plasticMat);
    nbBase.position.set(2.5, 0.15, -2.5);
    boardGroup.add(nbBase);
    const nbSink = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 1.4), heatSinkMat);
    nbSink.position.set(2.5, 0.35, -2.5);
    boardGroup.add(nbSink);

    const sbChip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), heatSinkMat);
    sbChip.position.set(3.5, 0.15, 2.5);
    boardGroup.add(sbChip);

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

    const ioBlock3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 2.0), portMat);
    ioBlock3.position.set(-5.6, 0.35, 1.0);
    boardGroup.add(ioBlock3);

    // ========== 4. LIGHTING ==========
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 1.0);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const errorLight = new THREE.PointLight(0xff0044, 0, 15);
    errorLight.position.set(0, 2, 0);
    errorLightRef.current = errorLight;
    scene.add(errorLight);

    // ========== 5. ANIMATION LOOP ==========
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      boardGroup.position.y = Math.sin(time * 1.5) * 0.1;
      boardGroup.rotation.y = Math.sin(time * 0.5) * 0.02;
      boardGroup.rotation.z = Math.cos(time * 0.8) * 0.01;

      if (errorLightRef.current && errorLightRef.current.intensity > 0) {
        errorLightRef.current.intensity = 5 + Math.sin(time * 15) * 4;
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // FIXED CLEANUP: Removed the undefined socketMat!
      pcbMat.dispose(); 
      goldMat.dispose(); 
      silverMat.dispose(); 
      heatSinkMat.dispose(); 
      plasticMat.dispose();
      capMat.dispose(); 
      portMat.dispose();
    };
  }, [theme]);

  const handlePowerClick = () => {
    if (bootState !== 'idle') return;
    setBootState('booting');
    
    setTimeout(() => {
      setBootState('error');
      if (errorLightRef.current) {
        errorLightRef.current.intensity = 5; 
      }
    }, 1200);
  };

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden border-b border-borderLine">
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {bootState === 'idle' && (
            <motion.div 
              key="power-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6 pointer-events-auto"
            >
              <button 
                onClick={handlePowerClick}
                className="w-24 h-24 rounded-full bg-card border-2 border-borderLine flex items-center justify-center text-textMuted hover:text-primary hover:border-primary hover:shadow-[0_0_30px_var(--accent-primary)] transition-all duration-300 group"
              >
                <Power size={40} className="group-hover:scale-110 transition-transform" />
              </button>
              <span className="font-mono text-sm tracking-widest text-textMuted uppercase bg-background/50 px-3 py-1 rounded-full backdrop-blur-md">
                Initialize System
              </span>
            </motion.div>
          )}

          {bootState === 'booting' && (
            <motion.div 
              key="booting-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-primary tracking-widest animate-pulse bg-background/50 px-4 py-2 rounded-full backdrop-blur-md"
            >
              System powering on...
            </motion.div>
          )}

          {bootState === 'error' && (
            <motion.div 
              key="error-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto bg-card/85 backdrop-blur-xl border border-[#ff0044]/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,68,0.2)] max-w-lg text-center mt-32"
            >
              <div className="w-16 h-16 rounded-full bg-[#ff0044]/10 flex items-center justify-center mx-auto mb-6 text-[#ff0044]">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-3xl font-bold text-textMain mb-4 tracking-tight">
                Hardware Failure
              </h2>
              <p className="text-textMuted leading-relaxed mb-6 font-mono text-sm bg-background/80 p-4 rounded-xl border border-borderLine text-left">
                <span className="text-[#ff0044] font-bold">ERR_CODE: 0x00000000</span><br/>
                Cannot establish bus connection.<br/>
                <span className="text-textMain font-bold">CRITICAL: No Central Processing Unit detected.</span>
              </p>
              <button 
  onClick={() => document.getElementById('cpu-forge')?.scrollIntoView({ behavior: 'smooth' })}
  className="px-6 py-3 bg-[#ff0044] text-white rounded-lg font-bold shadow-lg hover:bg-[#cc0036] transition-colors w-full tracking-wide"
>
  Forging Sequence Initiated ↓
</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}