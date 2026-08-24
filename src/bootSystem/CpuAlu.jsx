import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Calculator, Code, Cpu, Play, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CpuAlu() {
  const mountRef = useRef(null);
  const aluController = useRef(null);
  const { theme } = useTheme();

  // === LAB STATE ===
  const [inpA, setInpA] = useState(6);
  const [inpB, setInpB] = useState(3);
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState({ dec: "--", bin: "----", carry: "-" });
  const [isComputing, setIsComputing] = useState(false);

  // === 3D SCENE SETUP ===
  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    const scene = new THREE.Scene();
    scene.background = null; 

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 16); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const thickGlass = new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 
    });
    // FIXED: Added THREE prefix here so it doesn't crash the screen
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3, metalness: 0.9 });

    const aluGroup = new THREE.Group();
    aluGroup.position.set(2.5, 0, 0); // Shifted right so it doesn't overlap text
    scene.add(aluGroup);

    const aluShell = new THREE.Mesh(new THREE.OctahedronGeometry(3.5, 0), thickGlass);
    const aluCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 0), darkMetal);
    aluGroup.add(aluShell, aluCore);
    
    const coreLight = new THREE.PointLight(0xffcc00, 0, 15);
    aluGroup.add(coreLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    // === ANIMATION & BEAM SYSTEM ===
    const activePulses = [];
    const pulseGeo = new THREE.SphereGeometry(0.3, 16, 16);
    
    const spawnPulse = (start, end) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffcc00 }); 
      const mesh = new THREE.Mesh(pulseGeo, mat);
      mesh.position.copy(start);
      scene.add(mesh);
      activePulses.push({ mesh, start, end, progress: 0, speed: 2.0 });
    };

    let reqId;
    const clock = new THREE.Clock();
    let computeFlashTimer = 0;
    let isFlashing = false;

    aluController.current = {
      runCycle: (op, a, b, onComplete) => {
        // Spawn input pulse from Input A
        spawnPulse(new THREE.Vector3(-1.5, 8, 0), new THREE.Vector3(2.5, 1, 0));
        
        // Spawn input pulse from Input B only for 2-input operations
        if (op === 'ADD' || op === 'AND') {
          spawnPulse(new THREE.Vector3(6.5, 8, 0), new THREE.Vector3(2.5, 1, 0));
        }
        
        setTimeout(() => {
          isFlashing = true;
          computeFlashTimer = 1.0; 
        }, 500);

        setTimeout(() => {
          isFlashing = false;
          coreLight.intensity = 0;
          aluCore.material.emissive.setHex(0x000000);
          spawnPulse(new THREE.Vector3(2.5, -1, 0), new THREE.Vector3(2.5, -8, 0)); 
          onComplete();
        }, 1500);
      }
    };

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      aluGroup.position.y = Math.sin(time) * 0.5;
      aluGroup.rotation.y = time * 0.3;
      aluCore.rotation.x = time * 0.6;
      aluCore.rotation.y = -time * 0.8;

      for (let i = activePulses.length - 1; i >= 0; i--) {
        const p = activePulses[i];
        p.progress += delta * p.speed;
        if (p.progress >= 1.0) {
          scene.remove(p.mesh);
          activePulses.splice(i, 1);
        } else {
          p.mesh.position.lerpVectors(p.start, p.end, p.progress);
        }
      }

      if (isFlashing) {
        computeFlashTimer -= delta;
        if (computeFlashTimer > 0) {
          const flash = Math.random() > 0.5 ? 0xffcc00 : 0xffffff;
          aluCore.material.emissive.setHex(flash);
          coreLight.intensity = 5 + Math.random() * 5;
        }
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
  }, []);

  // === LOGIC ===
  const executeOperation = (op) => {
    if (isComputing || !aluController.current) return;
    
    setIsComputing(true);
    setStatus(`COMPUTING ${op}...`);
    setResult({ dec: "--", bin: "----", carry: "-" });

    let res = 0, carry = 0;
    switch(op) {
      case 'ADD': 
        res = (inpA + inpB) & 15; 
        carry = (inpA + inpB) > 15 ? 1 : 0; 
        break;
      case 'INC': 
        res = (inpA + 1) & 15; 
        carry = (inpA + 1) > 15 ? 1 : 0; 
        break; 
      case 'AND': 
        res = (inpA & inpB) & 15; 
        carry = 0; 
        break;
      case 'CMA': 
        res = (~inpA) & 15; 
        carry = 0; 
        break;
      case 'CIR': 
        carry = inpA & 1; 
        res = ((inpA >> 1) | (carry << 3)) & 15; 
        break;
    }

    const finalVal = res < 0 ? (16 + res) & 15 : res & 15; 
    const bin = finalVal.toString(2).padStart(4, '0');

    aluController.current.runCycle(op, inpA, inpB, () => {
      setResult({ dec: finalVal.toString(), bin: bin, carry: carry.toString() });
      setStatus("IDLE");
      setIsComputing(false);
    });
  };

  const glassPanelClass = "bg-white/30 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 pointer-events-auto";

  return (
    <section className="relative w-full bg-background">
      
      {/* 1. STICKY BACKGROUND: Stays locked to the screen ONLY while scrolling through this section */}
      <div className="sticky top-0 w-full h-screen z-0 pointer-events-none overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" />

        {/* I/O CONTROL PANEL */}
        <div className="absolute top-1/4 right-6 md:right-10 w-72 z-20 hidden md:block pointer-events-auto">
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className={glassPanelClass}>
            <h3 className="font-mono text-[#ffcc00] font-bold mb-4 flex items-center gap-2 border-b border-borderLine pb-2 drop-shadow-md dark:drop-shadow-none">
              <Cpu size={18} /> I/O Data Bus
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-textMuted mb-1 block">INPUT A (0-15)</label>
                <input type="number" min="0" max="15" value={inpA} onChange={(e) => setInpA(Number(e.target.value))} disabled={isComputing} className="w-full bg-background border border-borderLine rounded p-2 text-textMain font-mono focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-xs font-mono text-textMuted mb-1 block">INPUT B (0-15)</label>
                <input type="number" min="0" max="15" value={inpB} onChange={(e) => setInpB(Number(e.target.value))} disabled={isComputing} className="w-full bg-background border border-borderLine rounded p-2 text-textMain font-mono focus:border-primary outline-none" />
              </div>
              
              <div className="bg-background/50 p-3 rounded border border-borderLine mt-4">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-textMuted">Status:</span>
                  <span className={isComputing ? "text-[#ffcc00] animate-pulse" : "text-[#1fd655]"}>{status}</span>
                </div>
                <div className="flex justify-between text-sm font-mono mb-1">
                  <span className="text-textMuted">Result (Dec):</span>
                  <span className="text-[#ff007f] font-bold">{result.dec}</span>
                </div>
                <div className="flex justify-between text-sm font-mono mb-1">
                  <span className="text-textMuted">Result (Bin):</span>
                  <span className="text-[#00f2fe] font-bold">{result.bin}</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-textMuted">Carry/Borrow:</span>
                  <span className="text-textMain font-bold">{result.carry}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. SCROLLING CONTENT LAYER: Stacks normal screens on top of the sticky background */}
      <div className="relative z-10 w-full flex flex-col pointer-events-none -mt-[100vh]">
        
        {/* Screen 1: ALU Intro */}
        <div className="h-screen w-full flex items-center justify-start px-6 md:px-20 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-20% 0px -20% 0px" }} className={`${glassPanelClass} w-full max-w-md`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#ffcc00]/20 rounded-lg">
                <Info size={20} className="text-[#ffcc00]" />
              </div>
              <h3 className="font-mono font-bold text-xl text-textMain drop-shadow-md dark:drop-shadow-none">The ALU Core</h3>
            </div>
            <p className="text-sm text-textMuted leading-relaxed">
              The Arithmetic Logic Unit is the mathematical brain of the CPU. Scroll down to test the interactive <strong>Arithmetic</strong> and <strong>Logic</strong> operation tables.
            </p>
          </motion.div>
        </div>

        {/* Screen 2: Arithmetic Table */}
        <div className="h-screen w-full flex items-center justify-start px-6 md:px-20 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-20% 0px -20% 0px" }} className={`${glassPanelClass} w-full max-w-md`}>
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="text-[#00f2fe]" />
              <h3 className="font-mono font-bold text-xl text-textMain drop-shadow-md dark:drop-shadow-none">Arithmetic Ops</h3>
            </div>
            <p className="text-sm text-textMuted mb-4">Click a row to execute the operation. Adjust inputs in the panel on the right.</p>
            
            <div className="flex flex-col gap-2">
              <button onClick={() => executeOperation('ADD')} disabled={isComputing} className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/30 hover:bg-primary/20 hover:border-primary transition-all text-left group">
                <div>
                  <span className="text-[#00f2fe] font-bold font-mono mr-3">ADD</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">A + B</span>
                </div>
                <Play size={16} className="text-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button onClick={() => executeOperation('INC')} disabled={isComputing} className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/30 hover:bg-primary/20 hover:border-primary transition-all text-left group">
                <div>
                  <span className="text-[#00f2fe] font-bold font-mono mr-3">INC</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">A + 1 (Increment)</span>
                </div>
                <Play size={16} className="text-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Screen 3: Logic Table */}
        <div className="h-screen w-full flex items-center justify-start px-6 md:px-20 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-20% 0px -20% 0px" }} className={`${glassPanelClass} w-full max-w-md`}>
            <div className="flex items-center gap-3 mb-6">
              <Code className="text-[#ff007f]" />
              <h3 className="font-mono font-bold text-xl text-textMain drop-shadow-md dark:drop-shadow-none">Logic Ops</h3>
            </div>
            <p className="text-sm text-textMuted mb-4">Click a row to perform bitwise operations.</p>
            
            <div className="flex flex-col gap-2">
              <button onClick={() => executeOperation('AND')} disabled={isComputing} className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/30 hover:bg-[#ff007f]/20 hover:border-[#ff007f] transition-all text-left group">
                <div>
                  <span className="text-[#ff007f] font-bold font-mono mr-3">AND</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">A & B (Bitwise)</span>
                </div>
                <Play size={16} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button onClick={() => executeOperation('CMA')} disabled={isComputing} className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/30 hover:bg-[#ff007f]/20 hover:border-[#ff007f] transition-all text-left group">
                <div>
                  <span className="text-[#ff007f] font-bold font-mono mr-3">CMA</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">~A (Complement)</span>
                </div>
                <Play size={16} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button onClick={() => executeOperation('CIR')} disabled={isComputing} className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/30 hover:bg-[#ff007f]/20 hover:border-[#ff007f] transition-all text-left group">
                <div>
                  <span className="text-[#ff007f] font-bold font-mono mr-3">CIR</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">Rotate Right A</span>
                </div>
                <Play size={16} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}