import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { Navigation, MapPin, Activity, Database, Code, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ==========================================
// 1. DATA TUNNEL INTRO (ONLY Lines & Cylinders flying AT the user!)
// NO HEXAGONAL CROSS. NO CENTER DOT.
// ==========================================
const IntroAnimation = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  
  const tunnelLinesRef = useRef([]);
  const flyingCylindersRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    // 1. WARP SPEED DATA LINES (Z-AXIS ONLY)
    const lineColor = theme === 'dark' ? 0xffffff : 0x00f2fe; 
    const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.4 });

    for (let i = 0; i < 80; i++) {
      const length = 10 + Math.random() * 20;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -length) // Pointing deep into Z
      ]);
      const line = new THREE.Line(geo, lineMat);
      
      // Scatter lines randomly, pushed far into the background
      line.position.set(
        (Math.random() - 0.5) * 40, 
        (Math.random() - 0.5) * 30, 
        -10 - Math.random() * 80 
      );
      tunnelGroup.add(line);
      tunnelLinesRef.current.push(line);
    }

    // 2. FLYING CYLINDERS (Flying at the user)
    const silverMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.8 });
    const thickGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 });
    const coreColors = [0x00f2fe, 0x1fd655, 0xff007f, 0xffcc00, 0x8b5cf6, 0xff3333];

    for (let i = 0; i < 10; i++) {
      const grp = new THREE.Group();
      grp.scale.setScalar(0.3 + Math.random() * 0.3); 
      
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 16), thickGlass);
      const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.2, 16), silverMetal);
      capTop.position.set(0, 1, 0);
      const capBot = capTop.clone();
      capBot.position.set(0, -1, 0);
      
      const coreMat = new THREE.MeshBasicMaterial({ color: coreColors[i % coreColors.length] });
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.8, 16), coreMat);
      
      grp.add(shell, capTop, capBot, core);
      
      // Start deep in the background
      grp.position.set(
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 20, 
        -20 - Math.random() * 60
      );
      
      grp.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      
      scene.add(grp);
      flyingCylindersRef.current.push({ mesh: grp, rotSpeedX: Math.random() * 0.05, rotSpeedY: Math.random() * 0.05 });
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      
      // Lines zoom towards the camera
      tunnelLinesRef.current.forEach(line => {
        line.position.z += 1.5; 
        if (line.position.z > 15) { 
          line.position.z = -80 - Math.random() * 20; 
        }
      });

      // Cylinders tumble towards the camera
      flyingCylindersRef.current.forEach(cyl => {
        cyl.mesh.position.z += 0.8; 
        cyl.mesh.rotation.x += cyl.rotSpeedX;
        cyl.mesh.rotation.y += cyl.rotSpeedY;
        
        if (cyl.mesh.position.z > 15) {
          cyl.mesh.position.set(
            (Math.random() - 0.5) * 30, 
            (Math.random() - 0.5) * 20, 
            -60 - Math.random() * 20
          );
        }
      });

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

  return <div ref={mountRef} className="w-full h-full" />;
};

// ==========================================
// 2. ISOLATED 3D CYLINDER COMPONENT (Unchanged)
// ==========================================
const IsolatedCylinder = ({ colorHex, inView }) => {
  const mountRef = useRef(null);
  const objectsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    const silverMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 1.0 });
    const thickGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 });

    const grp = new THREE.Group();
    scene.add(grp);

    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 32), thickGlass);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.2, 32), silverMetal);
    capTop.position.set(0, 1.5, 0); 
    const capBot = capTop.clone();
    capBot.position.set(0, -1.5, 0); 
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.8, 16), new THREE.MeshBasicMaterial({ color: colorHex }));
    const light = new THREE.PointLight(colorHex, 0, 10); 
    
    grp.add(shell, capTop, capBot, core, light);
    grp.rotation.x = 0.4;
    grp.rotation.z = 0.2;

    objectsRef.current = { grp, capTop, core, light };

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const objs = objectsRef.current;

      objs.grp.rotation.y += 0.01; // Constant gentle spin

      const targetCapY = objs.inView ? 2.5 : 1.5;
      const targetCoreScale = objs.inView ? 1.8 : 1.0;
      const targetLight = objs.inView ? 5 : 0;

      objs.capTop.position.y += (targetCapY - objs.capTop.position.y) * 0.1;
      objs.core.scale.x += (targetCoreScale - objs.core.scale.x) * 0.1;
      objs.core.scale.z += (targetCoreScale - objs.core.scale.z) * 0.1;
      objs.light.intensity += (targetLight - objs.light.intensity) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [colorHex]);

  useEffect(() => {
    if (objectsRef.current) {
      objectsRef.current.inView = inView;
    }
  }, [inView]);

  return <div ref={mountRef} className="w-full h-96" />;
};

// ==========================================
// 3. REUSABLE ROW COMPONENT (Unchanged)
// ==========================================
const RegisterRow = ({ title, desc, icon: Icon, colorHex, layout }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  const TextBlock = () => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: false, margin: "-20%" }}
      className="w-full max-w-sm bg-card/40 backdrop-blur-md border border-borderLine p-6 rounded-2xl shadow-xl flex flex-col justify-center"
      style={{ borderColor: `${colorHex}40` }} 
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${colorHex}20` }}>
          <Icon size={20} color={colorHex} />
        </div>
       <h3 className="font-mono font-bold text-textMain drop-shadow-md" style={{ textShadow: `0 0 15px ${colorHex}80` }}>{title}</h3>
       </div>
      <p className="text-sm text-textMuted leading-relaxed">{desc}</p>
    </motion.div>
  );

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center py-20">
      <div className={`w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6 ${layout === 'right' ? 'md:flex-row-reverse' : ''}`}>
        <div className="w-full md:w-1/2 flex justify-center">
          <TextBlock />
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <IsolatedCylinder colorHex={colorHex} inView={isInView} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN PAGE EXPORT
// ==========================================
export default function CpuRegisters() {
  return (
    <section id="cpu-forge" className="w-full bg-background overflow-x-hidden">
      
      {/* Intro Space (Warp Speed Tunnel Animation) */}
      <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <IntroAnimation />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="z-10 text-center pointer-events-none"
        >
          <span className="font-mono text-xl md:text-2xl font-bold tracking-[0.5em] text-[#00f2fe] drop-shadow-[0_0_20px_#00f2fe]">
            ENTERING CORE
          </span>
        </motion.div>
      </div>

      {/* The Registers */}
      <RegisterRow 
        title="Program Counter (PC)" 
        desc="Holds the address of the next instruction to be fetched from memory. Automatically increments after reading."
        icon={Navigation} colorHex={0x00f2fe} layout="left" 
      />
      
      <RegisterRow 
        title="Address Register (AR)" 
        desc="Holds the specific address for memory. If an instruction references memory, the AR points directly to that location."
        icon={MapPin} colorHex={0x1fd655} layout="right" 
      />
      
      <RegisterRow 
        title="Accumulator (AC)" 
        desc="The primary processor register. The ALU uses it constantly to grab data, perform math, and dump results back into it."
        icon={Activity} colorHex={0xff007f} layout="left" 
      />
      
      <RegisterRow 
        title="Data Register (DR)" 
        desc="Holds the memory operand. When data is pulled out of RAM, it waits here before the CPU decides what to do with it."
        icon={Database} colorHex={0xffcc00} layout="right" 
      />
      
      <RegisterRow 
        title="Instruction Register (IR)" 
        desc="Holds the instruction code. Once an instruction is fetched, it is locked into the IR so the Control Unit can decode it."
        icon={Code} colorHex={0x8b5cf6} layout="left" 
      />
      
      <RegisterRow 
        title="Temporary Register (TR)" 
        desc="Holds temporary data generated during complex instruction executions."
        icon={Shield} colorHex={0xff3333} layout="right" 
      />

    </section>
  );
}