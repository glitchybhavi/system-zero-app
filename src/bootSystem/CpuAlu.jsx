import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Calculator, Code, Cpu, Play, RotateCcw, Info, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CpuAlu() {
  const mountRef = useRef(null);
  const aluController = useRef(null);
  const { theme } = useTheme();

  // === LAB STATE ===
  const [inpA, setInpA] = useState(6);
  const [inpB, setInpB] = useState(3);
  const [selectedOp, setSelectedOp] = useState("ADD");
  const [status, setStatus] = useState("IDLE");
  const [statusColor, setStatusColor] = useState("#00ffff");
  const [result, setResult] = useState({ dec: "--", bin: "----", carry: "-" });
  const [isComputing, setIsComputing] = useState(false);

  // === 3D SCENE SETUP ===
  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2, 16, 20);
    camera.lookAt(2, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Root Group (shifted right to balance with left-hand text overlay)
    const rootGroup = new THREE.Group();
    rootGroup.position.set(2.2, 0, 0);
    scene.add(rootGroup);

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const coreLight = new THREE.PointLight(0x00ffff, 0, 12);
    coreLight.position.set(0, 1.5, 0);
    rootGroup.add(coreLight);

    // --- GEOMETRY & MATERIALS ---
    const isDark = theme === 'dark';
    const pcbColor = isDark ? 0x0a141a : 0xe2e8f0;
    const gridColor1 = isDark ? 0x00f2fe : 0x4f46e5;
    const gridColor2 = isDark ? 0x132333 : 0xcbd5e1;

    const pcbMaterial = new THREE.MeshStandardMaterial({ 
      color: pcbColor, 
      roughness: 0.8, 
      metalness: 0.2 
    });
    const pinMaterialOff = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0x334155 : 0x94a3b8, 
      metalness: 0.8, 
      roughness: 0.3 
    });
    const traceMaterial = new THREE.LineBasicMaterial({ 
      color: isDark ? 0x1e3a5f : 0x94a3b8, 
      transparent: true, 
      opacity: 0.6 
    });

    // The Circuit Board
    const board = new THREE.Mesh(new THREE.BoxGeometry(18, 0.4, 16), pcbMaterial);
    board.position.y = -0.2;
    rootGroup.add(board);

    // Grid lines on PCB
    const grid = new THREE.GridHelper(16, 16, gridColor1, gridColor2);
    grid.position.y = 0.01;
    rootGroup.add(grid);

    // The ALU Core (Classic V-shape schematic symbol)
    const aluShape = new THREE.Shape();
    aluShape.moveTo(-3, 3);
    aluShape.lineTo(-1, 3);
    aluShape.lineTo(0, 1.5);
    aluShape.lineTo(1, 3);
    aluShape.lineTo(3, 3);
    aluShape.lineTo(1.5, -3);
    aluShape.lineTo(-1.5, -3);
    aluShape.lineTo(-3, 3);

    const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const aluGeo = new THREE.ExtrudeGeometry(aluShape, extrudeSettings);
    
    const aluMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x00f2fe, 
      transparent: true, 
      opacity: 0.45, 
      roughness: 0.1, 
      transmission: 0.9, 
      thickness: 1.2,
      ior: 1.5
    });
    const aluMesh = new THREE.Mesh(aluGeo, aluMaterial);
    aluMesh.rotation.x = Math.PI / 2; // Lay flat on PCB
    aluMesh.position.set(0, 0.2, 0);
    rootGroup.add(aluMesh);

    // Internal Logic Gates (Small glowing cubes inside the ALU)
    const logicGates = [];
    const gateGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    for(let i = 0; i < 14; i++) {
      const mat = new THREE.MeshStandardMaterial({ 
        color: 0x1e293b, 
        emissive: 0x000000, 
        roughness: 0.2, 
        metalness: 0.8 
      });
      const gate = new THREE.Mesh(gateGeo, mat);
      gate.position.set(
        (Math.random() - 0.5) * 3.6,
        0.4,
        (Math.random() - 0.5) * 3.6
      );
      if (gate.position.z < 0 && Math.abs(gate.position.x) < 1.0) {
        gate.position.x += (gate.position.x < 0 ? -1 : 1);
      }
      rootGroup.add(gate);
      logicGates.push(gate);
    }

    // Setup Pins and Traces
    const inputPinsA = [], inputPinsB = [], outputPins = [];
    const pathsA = [], pathsB = [], pathsOut = [];
    
    function createPin(x, z) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 1.2), pinMaterialOff.clone());
      pin.position.set(x, 0.15, z);
      rootGroup.add(pin);
      return pin;
    }

    function createTrace(points) {
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, traceMaterial);
      rootGroup.add(line);
      return points;
    }

    // Input A (Top Left: 4 bits)
    for(let i = 0; i < 4; i++) {
      const x = -5.8 + i * 1.1;
      const z = -6.2;
      inputPinsA.push(createPin(x, z));
      pathsA.push(createTrace([
        new THREE.Vector3(x, 0.05, z + 0.6),
        new THREE.Vector3(x, 0.05, z + 2.8),
        new THREE.Vector3(-2.2 + i * 0.35, 0.05, -1.8)
      ]));
    }

    // Input B (Top Right: 4 bits)
    for(let i = 0; i < 4; i++) {
      const x = 2.5 + i * 1.1;
      const z = -6.2;
      inputPinsB.push(createPin(x, z));
      pathsB.push(createTrace([
        new THREE.Vector3(x, 0.05, z + 0.6),
        new THREE.Vector3(x, 0.05, z + 2.8),
        new THREE.Vector3(1.1 + i * 0.35, 0.05, -1.8)
      ]));
    }

    // Output (Bottom: Carry + 4 bits)
    for(let i = 0; i < 5; i++) {
      const x = -2.8 + i * 1.4;
      const z = 6.2;
      outputPins.push(createPin(x, z));
      pathsOut.push(createTrace([
        new THREE.Vector3(-1.0 + i * 0.5, 0.05, 1.8),
        new THREE.Vector3(x, 0.05, 3.8),
        new THREE.Vector3(x, 0.05, z - 0.6)
      ]));
    }

    // --- ANIMATION SYSTEM ---
    const activePulses = [];
    const pulseGeo = new THREE.SphereGeometry(0.2, 12, 12);
    
    function spawnPulse(path, colorHex) {
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      const mesh = new THREE.Mesh(pulseGeo, mat);
      rootGroup.add(mesh);
      activePulses.push({ mesh, path, progress: 0, speed: 2.0 + Math.random() * 0.4 });
    }

    function getPointOnPath(path, t) {
      const segments = path.length - 1;
      const p = t * segments;
      const idx = Math.floor(p);
      if (idx >= segments) return path[segments].clone();
      const localT = p - idx;
      return new THREE.Vector3().lerpVectors(path[idx], path[idx + 1], localT);
    }

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let computingAnim = false;

    // Connect to Controller
    aluController.current = {
      runSimulation: async (valA, valB, op, calcResult) => {
        computingAnim = true;
        
        // 1. Clear old outputs
        outputPins.forEach(p => p.material.emissive.setHex(0x000000));

        // 2. Highlight Input Pins & spawn bit pulses
        const isUnary = (op === 'CMA' || op === 'CIR' || op === 'INC');
        for(let i = 0; i < 4; i++) {
          const bitA = (valA >> (3 - i)) & 1;
          const bitB = isUnary ? 0 : ((valB >> (3 - i)) & 1);
          
          inputPinsA[i].material.emissive.setHex(bitA ? 0x00f2fe : 0x000000);
          inputPinsB[i].material.emissive.setHex(bitB ? 0x1fd655 : 0x000000);
          
          if (bitA) spawnPulse(pathsA[i], 0x00f2fe);
          if (bitB) spawnPulse(pathsB[i], 0x1fd655);
        }

        await sleep(750);

        // 3. Compute Phase (Flashing Internal Logic Gates)
        coreLight.intensity = 4;
        coreLight.color.setHex(op === 'SUB' ? 0xff007f : (op === 'ADD' ? 0x00f2fe : 0xffcc00));
        
        await sleep(1000);

        coreLight.intensity = 0;
        logicGates.forEach(g => g.material.emissive.setHex(0x000000));

        // 4. Dispatch Output Pulses
        const { finalVal, carry } = calcResult;
        const outBits = [carry, (finalVal >> 3) & 1, (finalVal >> 2) & 1, (finalVal >> 1) & 1, finalVal & 1];
        for(let i = 0; i < 5; i++) {
          if(outBits[i]) spawnPulse(pathsOut[i], 0xff007f);
        }

        await sleep(750);

        // 5. Update Output Pins Emissive
        for(let i = 0; i < 5; i++) {
          outputPins[i].material.emissive.setHex(outBits[i] ? 0xff007f : 0x000000);
        }

        computingAnim = false;
      },
      clearPins: () => {
        [...inputPinsA, ...inputPinsB, ...outputPins].forEach(p => {
          p.material.emissive.setHex(0x000000);
        });
        activePulses.forEach(p => rootGroup.remove(p.mesh));
        activePulses.length = 0;
        coreLight.intensity = 0;
      }
    };

    // --- RENDER LOOP ---
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle floating of the entire board
      rootGroup.position.y = Math.sin(time * 1.2) * 0.15;
      rootGroup.rotation.y = Math.sin(time * 0.4) * 0.04;

      // Animate Pulses along traces
      for(let i = activePulses.length - 1; i >= 0; i--) {
        const p = activePulses[i];
        p.progress += delta * p.speed;
        if(p.progress >= 1.0) {
          rootGroup.remove(p.mesh);
          activePulses.splice(i, 1);
        } else {
          const pos = getPointOnPath(p.path, p.progress);
          p.mesh.position.copy(pos);
        }
      }

      // Animate Logic Gates while computing
      if(computingAnim) {
        logicGates.forEach(gate => {
          if(Math.random() > 0.6) {
            const colors = [0x00f2fe, 0xff007f, 0x1fd655, 0xffcc00, 0xffffff];
            gate.material.emissive.setHex(colors[Math.floor(Math.random() * colors.length)]);
          } else {
            gate.material.emissive.setHex(0x000000);
          }
        });
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

  // === ALU MATHEMATICAL LOGIC ===
  const executeOperation = async (op) => {
    if (isComputing || !aluController.current) return;
    
    setIsComputing(true);
    setSelectedOp(op);
    setStatus(`FETCHING INPUTS...`);
    setStatusColor("#ffcc00");
    setResult({ dec: "--", bin: "----", carry: "-" });

    const valA = Number(inpA) & 15;
    const valB = Number(inpB) & 15;

    let res = 0, carry = 0;
    switch(op) {
      case 'ADD': 
        res = valA + valB; 
        carry = res > 15 ? 1 : 0; 
        break;
      case 'SUB': 
        res = valA - valB; 
        carry = res < 0 ? 1 : 0; // Indicates borrow
        break;
      case 'INC': 
        res = valA + 1; 
        carry = res > 15 ? 1 : 0; 
        break;
      case 'AND': 
        res = valA & valB; 
        carry = 0; 
        break;
      case 'OR': 
        res = valA | valB; 
        carry = 0; 
        break;
      case 'XOR': 
        res = valA ^ valB; 
        carry = 0; 
        break;
      case 'CMA': 
        res = (~valA) & 15; 
        carry = 0; 
        break;
      case 'CIR': 
        carry = valA & 1; 
        res = ((valA >> 1) | (carry << 3)) & 15; 
        break;
    }

    const finalVal = res < 0 ? (16 + res) & 15 : res & 15; 
    const bin = finalVal.toString(2).padStart(4, '0');

    setTimeout(() => {
      setStatus(`COMPUTING: ${op}`);
      setStatusColor("#ff007f");
    }, 750);

    setTimeout(() => {
      setStatus(`OUTPUTTING...`);
      setStatusColor("#00f2fe");
    }, 1750);

    await aluController.current.runSimulation(valA, valB, op, { finalVal, carry });

    setResult({ dec: finalVal.toString(), bin: bin, carry: carry.toString() });
    setStatus("IDLE");
    setStatusColor("#1fd655");
    setIsComputing(false);
  };

  const handleClear = () => {
    if (isComputing) return;
    setInpA(0);
    setInpB(0);
    setResult({ dec: "--", bin: "----", carry: "-" });
    setStatus("IDLE");
    setStatusColor("#00ffff");
    if (aluController.current) aluController.current.clearPins();
  };

  const glassPanelClass = "bg-white/40 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 pointer-events-auto";

  return (
    <section className="relative w-full bg-background">
      
      {/* 1. STICKY BACKGROUND: Stays locked to the screen ONLY while scrolling through this section */}
      <div className="sticky top-0 w-full h-screen z-0 pointer-events-none overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" />

        {/* I/O CONTROL PANEL (Top Right) */}
        <div className="absolute top-20 right-6 md:right-12 w-80 z-20 hidden md:block pointer-events-auto">
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className={glassPanelClass}>
            <div className="flex items-center justify-between border-b border-borderLine pb-3 mb-4">
              <h3 className="font-mono text-primary font-bold flex items-center gap-2 text-sm tracking-wide">
                <Cpu size={16} /> 4-BIT ALU CORE
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                SCHEMATIC V-CORE
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-textMuted mb-1 flex justify-between">
                  <span>INPUT A (0-15)</span>
                  <span className="text-primary font-bold">{Number(inpA & 15).toString(2).padStart(4, '0')}</span>
                </label>
                <input 
                  type="number" min="0" max="15" 
                  value={inpA} 
                  onChange={(e) => setInpA(Math.max(0, Math.min(15, Number(e.target.value))))} 
                  disabled={isComputing} 
                  className="w-full bg-background border border-borderLine rounded p-2 text-textMain font-mono text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="text-xs font-mono text-textMuted mb-1 flex justify-between">
                  <span>INPUT B (0-15)</span>
                  <span className="text-[#1fd655] font-bold">{Number(inpB & 15).toString(2).padStart(4, '0')}</span>
                </label>
                <input 
                  type="number" min="0" max="15" 
                  value={inpB} 
                  onChange={(e) => setInpB(Math.max(0, Math.min(15, Number(e.target.value))))} 
                  disabled={isComputing} 
                  className="w-full bg-background border border-borderLine rounded p-2 text-textMain font-mono text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              {/* Operation Selector & Run Button */}
              <div className="pt-2 flex gap-2">
                <select 
                  value={selectedOp} 
                  onChange={(e) => setSelectedOp(e.target.value)}
                  disabled={isComputing}
                  className="flex-1 bg-background border border-borderLine rounded p-2 text-textMain font-mono text-xs focus:border-primary outline-none"
                >
                  <optgroup label="Arithmetic">
                    <option value="ADD">ADD (A + B)</option>
                    <option value="SUB">SUB (A - B)</option>
                    <option value="INC">INC (A + 1)</option>
                  </optgroup>
                  <optgroup label="Logic">
                    <option value="AND">AND (A & B)</option>
                    <option value="OR">OR (A | B)</option>
                    <option value="XOR">XOR (A ^ B)</option>
                    <option value="CMA">CMA (~A)</option>
                    <option value="CIR">CIR (Rotate A)</option>
                  </optgroup>
                </select>

                <button 
                  onClick={() => executeOperation(selectedOp)}
                  disabled={isComputing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-mono font-bold text-xs rounded transition-all flex items-center gap-1 shadow-md hover:shadow-primary/30 disabled:opacity-50"
                >
                  <Zap size={14} /> RUN
                </button>

                <button 
                  onClick={handleClear}
                  disabled={isComputing}
                  className="p-2 border border-borderLine bg-background/50 hover:bg-red-500/20 hover:border-red-500 text-textMuted hover:text-red-400 rounded transition-all"
                  title="Clear ALU"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              
              {/* Output Monitor Display */}
              <div className="bg-background/80 p-3.5 rounded-xl border border-borderLine mt-3 space-y-1.5 font-mono">
                <div className="flex justify-between text-xs pb-1.5 border-b border-borderLine">
                  <span className="text-textMuted">Status:</span>
                  <span className="font-bold tracking-wider" style={{ color: statusColor }}>{status}</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-textMuted text-xs">Decimal Out:</span>
                  <span className="text-[#ff007f] font-bold">{result.dec}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted text-xs">4-Bit Binary:</span>
                  <span className="text-[#00f2fe] font-bold tracking-widest">{result.bin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted text-xs">Carry / Borrow:</span>
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
              <div className="p-2 bg-primary/20 rounded-lg">
                <Info size={20} className="text-primary" />
              </div>
              <h3 className="font-mono font-bold text-xl text-textMain drop-shadow-md dark:drop-shadow-none">4-Bit ALU Core</h3>
            </div>
            <p className="text-sm text-textMuted leading-relaxed mb-4">
              The Arithmetic Logic Unit is the mathematical engine of the processor. Watch signals travel across PCB traces into the V-shaped core and illuminate internal logic gates during computation.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 p-2.5 rounded-lg border border-primary/20">
              <Zap size={14} /> Scroll down to test Arithmetic and Bitwise operations.
            </div>
          </motion.div>
        </div>

        {/* Screen 2: Arithmetic Table */}
        <div className="h-screen w-full flex items-center justify-start px-6 md:px-20 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-20% 0px -20% 0px" }} className={`${glassPanelClass} w-full max-w-md`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#00f2fe]/20 rounded-lg">
                <Calculator size={20} className="text-[#00f2fe]" />
              </div>
              <h3 className="font-mono font-bold text-xl text-textMain drop-shadow-md dark:drop-shadow-none">Arithmetic Operations</h3>
            </div>
            <p className="text-sm text-textMuted mb-4">Click any row below to trigger circuit trace pulses and calculate results:</p>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => executeOperation('ADD')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/40 hover:bg-[#00f2fe]/10 hover:border-[#00f2fe] transition-all text-left group"
              >
                <div>
                  <span className="text-[#00f2fe] font-bold font-mono mr-3">ADD</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">A + B (Addition with Carry)</span>
                </div>
                <Play size={16} className="text-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                onClick={() => executeOperation('SUB')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/40 hover:bg-[#ff007f]/10 hover:border-[#ff007f] transition-all text-left group"
              >
                <div>
                  <span className="text-[#ff007f] font-bold font-mono mr-3">SUB</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">A - B (Subtraction with Borrow)</span>
                </div>
                <Play size={16} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => executeOperation('INC')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-3 rounded-lg border border-borderLine bg-background/40 hover:bg-[#1fd655]/10 hover:border-[#1fd655] transition-all text-left group"
              >
                <div>
                  <span className="text-[#1fd655] font-bold font-mono mr-3">INC</span>
                  <span className="text-sm text-textMuted group-hover:text-textMain transition-colors">A + 1 (Increment Register A)</span>
                </div>
                <Play size={16} className="text-[#1fd655] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Screen 3: Logic Table */}
        <div className="h-screen w-full flex items-center justify-start px-6 md:px-20 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-20% 0px -20% 0px" }} className={`${glassPanelClass} w-full max-w-md`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#ff007f]/20 rounded-lg">
                <Code size={20} className="text-[#ff007f]" />
              </div>
              <h3 className="font-mono font-bold text-xl text-textMain drop-shadow-md dark:drop-shadow-none">Bitwise Logic Operations</h3>
            </div>
            <p className="text-sm text-textMuted mb-4">Click any row to execute bitwise circuit gate transformations:</p>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => executeOperation('AND')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-borderLine bg-background/40 hover:bg-[#ff007f]/10 hover:border-[#ff007f] transition-all text-left group"
              >
                <div>
                  <span className="text-[#ff007f] font-bold font-mono mr-3">AND</span>
                  <span className="text-xs text-textMuted group-hover:text-textMain transition-colors">A & B (Bitwise Conjunction)</span>
                </div>
                <Play size={14} className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => executeOperation('OR')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-borderLine bg-background/40 hover:bg-[#00f2fe]/10 hover:border-[#00f2fe] transition-all text-left group"
              >
                <div>
                  <span className="text-[#00f2fe] font-bold font-mono mr-3">OR</span>
                  <span className="text-xs text-textMuted group-hover:text-textMain transition-colors">A | B (Bitwise Disjunction)</span>
                </div>
                <Play size={14} className="text-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => executeOperation('XOR')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-borderLine bg-background/40 hover:bg-[#ffcc00]/10 hover:border-[#ffcc00] transition-all text-left group"
              >
                <div>
                  <span className="text-[#ffcc00] font-bold font-mono mr-3">XOR</span>
                  <span className="text-xs text-textMuted group-hover:text-textMain transition-colors">A ^ B (Exclusive OR)</span>
                </div>
                <Play size={14} className="text-[#ffcc00] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                onClick={() => executeOperation('CMA')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-borderLine bg-background/40 hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6] transition-all text-left group"
              >
                <div>
                  <span className="text-[#8b5cf6] font-bold font-mono mr-3">CMA</span>
                  <span className="text-xs text-textMuted group-hover:text-textMain transition-colors">~A (Bitwise Invert / NOT)</span>
                </div>
                <Play size={14} className="text-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => executeOperation('CIR')} 
                disabled={isComputing} 
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-borderLine bg-background/40 hover:bg-[#00f2fe]/10 hover:border-[#00f2fe] transition-all text-left group"
              >
                <div>
                  <span className="text-[#00f2fe] font-bold font-mono mr-3">CIR</span>
                  <span className="text-xs text-textMuted group-hover:text-textMain transition-colors">Rotate Right A with Carry E</span>
                </div>
                <Play size={14} className="text-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}