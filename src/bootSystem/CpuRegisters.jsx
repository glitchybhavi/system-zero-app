import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { Navigation, MapPin, Activity, Database, Code, Shield, Play, RotateCcw, ArrowRight, Layers, Lock, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ==========================================
// 1. DATA TUNNEL INTRO (Warp Speed Entry)
// ==========================================
const IntroAnimation = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const tunnelLinesRef = useRef([]);
  const flyingCylindersRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    const lineColor = theme === 'dark' ? 0x00f2fe : 0x4f46e5; 
    const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.35 });

    for (let i = 0; i < 70; i++) {
      const length = 10 + Math.random() * 20;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -length)
      ]);
      const line = new THREE.Line(geo, lineMat);
      line.position.set(
        (Math.random() - 0.5) * 40, 
        (Math.random() - 0.5) * 30, 
        -10 - Math.random() * 80 
      );
      tunnelGroup.add(line);
      tunnelLinesRef.current.push(line);
    }

    const silverMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.8 });
    const thickGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 });
    const coreColors = [0x00f2fe, 0x1fd655, 0xff007f, 0xffcc00, 0x8b5cf6, 0x06b6d4];

    for (let i = 0; i < 8; i++) {
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
      grp.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, -20 - Math.random() * 60);
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
      tunnelLinesRef.current.forEach(line => {
        line.position.z += 1.4; 
        if (line.position.z > 15) line.position.z = -80 - Math.random() * 20; 
      });

      flyingCylindersRef.current.forEach(cyl => {
        cyl.mesh.position.z += 0.7; 
        cyl.mesh.rotation.x += cyl.rotSpeedX;
        cyl.mesh.rotation.y += cyl.rotSpeedY;
        if (cyl.mesh.position.z > 15) {
          cyl.mesh.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, -60 - Math.random() * 20);
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
// 2. FUNCTIONAL 3D VISUALIZERS FOR EACH REGISTER
// ==========================================

// --- A. PROGRAM COUNTER (PC) 3D VISUALIZER ---
const PcVisualizer = ({ pcVal, inView, onStep }) => {
  const mountRef = useRef(null);
  const pulseRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const grp = new THREE.Group();
    scene.add(grp);

    // PC Cylinder Capsule
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, roughness: 0.1 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.6, 32), glass);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.2, 32), silver);
    capTop.position.y = 1.3;
    const capBot = capTop.clone();
    capBot.position.y = -1.3;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.4, 16), new THREE.MeshBasicMaterial({ color: 0x00f2fe }));
    grp.add(shell, capTop, capBot, core);

    // Pointer Ray to RAM
    const rayGeo = new THREE.CylinderGeometry(0.04, 0.04, 4, 8);
    const rayMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.rotation.z = Math.PI / 2;
    ray.position.set(2.8, 0, 0);
    grp.add(ray);

    // Light
    const light = new THREE.PointLight(0x00f2fe, 3, 8);
    grp.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    pulseRef.current = () => {
      light.intensity = 8;
      core.scale.set(1.4, 1.0, 1.4);
      setTimeout(() => {
        light.intensity = 3;
        core.scale.set(1.0, 1.0, 1.0);
      }, 400);
    };

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      grp.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (pulseRef.current) pulseRef.current();
  }, [pcVal]);

  return <div ref={mountRef} className="w-full h-80" />;
};

// --- B. ADDRESS REGISTER (AR) 3D VISUALIZER ---
const ArVisualizer = ({ arAddress }) => {
  const mountRef = useRef(null);
  const laserRef = useRef(null);
  const memoryCellsRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const grp = new THREE.Group();
    scene.add(grp);

    // AR Cylinder (Left)
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, roughness: 0.1 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.4, 32), glass);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.2, 32), silver);
    capTop.position.y = 1.2;
    const capBot = capTop.clone();
    capBot.position.y = -1.2;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.2, 16), new THREE.MeshBasicMaterial({ color: 0x1fd655 }));
    const arCyl = new THREE.Group();
    arCyl.position.set(-2.2, 0, 0);
    arCyl.add(shell, capTop, capBot, core);
    grp.add(arCyl);

    // Memory Matrix Grid (Right: 4x4 array of cells)
    const cellGeo = new THREE.BoxGeometry(0.55, 0.35, 0.55);
    const cellMatOff = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const cells = [];
    
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = new THREE.Mesh(cellGeo, cellMatOff.clone());
        cell.position.set(1.0 + c * 0.75, 1.1 - r * 0.55, 0);
        grp.add(cell);
        cells.push(cell);
      }
    }
    memoryCellsRef.current = cells;

    // Laser Beam Pointer
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x1fd655 });
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), laserMat);
    laser.rotation.z = Math.PI / 2;
    laser.position.set(-0.6, 0, 0);
    grp.add(laser);
    laserRef.current = laser;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      arCyl.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    // Highlight specific memory cell based on address
    const cells = memoryCellsRef.current;
    if (!cells || cells.length === 0) return;
    const idx = (parseInt(arAddress, 16) || 0) % cells.length;
    cells.forEach((cell, i) => {
      if (i === idx) {
        cell.material.color.setHex(0x1fd655);
        cell.material.emissive.setHex(0x1fd655);
        cell.material.emissiveIntensity = 2.0;
        if (laserRef.current) {
          laserRef.current.position.y = cell.position.y;
        }
      } else {
        cell.material.color.setHex(0x1e293b);
        cell.material.emissive.setHex(0x000000);
      }
    });
  }, [arAddress]);

  return <div ref={mountRef} className="w-full h-80" />;
};

// --- C. ACCUMULATOR (AC) 3D VISUALIZER ---
const AcVisualizer = ({ acValue }) => {
  const mountRef = useRef(null);
  const coreRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const grp = new THREE.Group();
    scene.add(grp);

    // AC Chamber
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, roughness: 0.1 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 32), glass);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.2, 32), silver);
    capTop.position.y = 1.3;
    const capBot = capTop.clone();
    capBot.position.y = -1.3;

    // Glowing Math Core (Octahedron / Sphere)
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff007f,
      emissiveIntensity: 1.5,
      metalness: 0.8
    }));
    coreRef.current = core;

    // Orbiting Data Rings
    const ringGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ringRef.current = ring;

    grp.add(shell, capTop, capBot, core, ring);

    const light = new THREE.PointLight(0xff007f, 4, 10);
    grp.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      grp.rotation.y += 0.015;
      core.rotation.x += 0.02;
      core.rotation.y += 0.03;
      ring.rotation.x += 0.02;
      ring.rotation.y -= 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (coreRef.current) {
      coreRef.current.scale.set(1.5, 1.5, 1.5);
      setTimeout(() => {
        if (coreRef.current) coreRef.current.scale.set(1.0, 1.0, 1.0);
      }, 300);
    }
  }, [acValue]);

  return <div ref={mountRef} className="w-full h-80" />;
};

// --- D. DATA REGISTER (DR) 3D VISUALIZER ---
const DrVisualizer = ({ drValue }) => {
  const mountRef = useRef(null);
  const ledsRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const grp = new THREE.Group();
    scene.add(grp);

    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, roughness: 0.1 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.8, 32), glass);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.2, 32), silver);
    capTop.position.y = 1.4;
    const capBot = capTop.clone();
    capBot.position.y = -1.4;
    grp.add(shell, capTop, capBot);

    // Stack of 8 LED Data Disks inside DR
    const leds = [];
    for (let i = 0; i < 8; i++) {
      const disk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0x332200, emissive: 0x000000 })
      );
      disk.position.y = -0.9 + i * 0.26;
      grp.add(disk);
      leds.push(disk);
    }
    ledsRef.current = leds;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      grp.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    // Update internal LED disks based on 8 bits of DR value
    const leds = ledsRef.current;
    if (!leds || leds.length === 0) return;
    const num = Number(drValue) || 0;
    leds.forEach((disk, i) => {
      const bit = (num >> i) & 1;
      if (bit) {
        disk.material.color.setHex(0xffcc00);
        disk.material.emissive.setHex(0xffcc00);
        disk.material.emissiveIntensity = 2.0;
      } else {
        disk.material.color.setHex(0x332200);
        disk.material.emissive.setHex(0x000000);
      }
    });
  }, [drValue]);

  return <div ref={mountRef} className="w-full h-80" />;
};

// --- E. INSTRUCTION REGISTER (IR) 3D VISUALIZER ---
const IrVisualizer = ({ irInstruction }) => {
  const mountRef = useRef(null);
  const segmentsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const grp = new THREE.Group();
    scene.add(grp);

    // 3 Distinct Functional Segments (Split Instruction)
    // 1. Indirect Bit I (Top Segment - Purple)
    const segI = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 1.2, metalness: 0.8 })
    );
    segI.position.y = 1.1;

    // 2. Opcode (Middle Segment - Pink)
    const segOp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.7, 32),
      new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 1.2, metalness: 0.8 })
    );
    segOp.position.y = 0.35;

    // 3. Address Field (Bottom Segment - Cyan)
    const segAddr = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1.1, 32),
      new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 1.2, metalness: 0.8 })
    );
    segAddr.position.y = -0.7;

    grp.add(segI, segOp, segAddr);
    segmentsRef.current = { segI, segOp, segAddr };

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      grp.rotation.y += 0.012;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    // Mechanical split animation on instruction change
    const segs = segmentsRef.current;
    if (!segs.segI) return;
    segs.segI.position.y = 1.5;
    segs.segAddr.position.y = -1.1;
    setTimeout(() => {
      if (segs.segI) {
        segs.segI.position.y = 1.1;
        segs.segAddr.position.y = -0.7;
      }
    }, 400);
  }, [irInstruction]);

  return <div ref={mountRef} className="w-full h-80" />;
};

// --- F. TEMPORARY REGISTER (TR) 3D VISUALIZER ---
const TrVisualizer = ({ isStashed }) => {
  const mountRef = useRef(null);
  const shieldRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || container.childNodes.length > 0) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const grp = new THREE.Group();
    scene.add(grp);

    // TR Core Cylinder
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, roughness: 0.1 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.4, 32), glass);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.2, 32), silver);
    capTop.position.y = 1.2;
    const capBot = capTop.clone();
    capBot.position.y = -1.2;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.2, 16), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    grp.add(shell, capTop, capBot, core);

    // Protective Energy Shield Barrier (Wireframe / transparent dome)
    const shieldGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.5
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.scale.set(0.01, 0.01, 0.01);
    grp.add(shield);
    shieldRef.current = shield;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      grp.rotation.y += 0.01;
      shield.rotation.y -= 0.02;
      shield.rotation.x += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (shieldRef.current) {
      if (isStashed) {
        shieldRef.current.scale.set(1.0, 1.0, 1.0);
      } else {
        shieldRef.current.scale.set(0.01, 0.01, 0.01);
      }
    }
  }, [isStashed]);

  return <div ref={mountRef} className="w-full h-80" />;
};

// ==========================================
// 3. MAIN CPU REGISTERS PAGE
// ==========================================
export default function CpuRegisters() {
  // Interactive Lab States for each register
  const [pcVal, setPcVal] = useState(0);
  const [arAddress, setArAddress] = useState("0x020");
  const [acValue, setAcValue] = useState(5);
  const [drValue, setDrValue] = useState(42);
  const [irInstruction, setIrInstruction] = useState("ADD 0x120");
  const [isStashed, setIsStashed] = useState(false);

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

      {/* INTRODUCTORY CARD: The Register Architecture & Forging Sequence */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6 relative z-10 border-b border-borderLine">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl bg-card/80 backdrop-blur-2xl border border-borderLine p-8 md:p-12 rounded-3xl shadow-2xl space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine pb-4">
            <span className="font-mono text-primary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              [ PHASE 01 : INTERNAL MICROARCHITECTURE ]
            </span>
            <span className="text-xs font-mono text-textMuted">
              SYSTEM STATUS: FORGING DATAPATH
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-textMain">
              The Register File: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">Fast Storage at the Core.</span>
            </h2>
            <p className="text-base md:text-lg text-textMuted leading-relaxed">
              To forge a functioning processor, we must first establish its <strong>internal register file</strong>.
            </p>
          </div>

          {/* Educational Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-background/60 border border-borderLine space-y-2">
              <div className="text-xs font-mono font-bold text-primary flex items-center gap-2">
                <Layers size={14} /> THE SPEED GAP & VON NEUMANN BOTTLENECK
              </div>
              <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                Accessing main memory (RAM) takes dozens of clock cycles. To operate at high frequencies, the processor relies on local flip-flop registers embedded directly beside the arithmetic unit with zero-wait-state access.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-background/60 border border-borderLine space-y-2">
              <div className="text-xs font-mono font-bold text-secondary flex items-center gap-2">
                <Zap size={14} /> THE 6-STAGE DATAPATH SEQUENCE
              </div>
              <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                Data flows through a coordinated pipeline: <span className="text-[#00f2fe] font-mono">PC</span> (Fetch) &rarr; <span className="text-[#1fd655] font-mono">AR</span> (Latch) &rarr; <span className="text-[#ffcc00] font-mono">DR</span> (Buffer) &rarr; <span className="text-[#ff007f] font-mono">AC</span> (Calculate) &rarr; <span className="text-[#8b5cf6] font-mono">IR</span> (Decode) &rarr; <span className="text-[#06b6d4] font-mono">TR</span> (Hold).
              </p>
            </div>
          </div>

          {/* Interactive Pipeline Roadmap */}
          <div className="pt-2">
            <div className="text-xs font-mono text-textMuted mb-2">DATAPATH PIPELINE REGISTERS:</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
                <div className="font-bold">PC</div>
                <div className="text-[10px] opacity-80">Pointer</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1fd655]/10 border border-[#1fd655]/30 text-[#1fd655]">
                <div className="font-bold">AR</div>
                <div className="text-[10px] opacity-80">Address</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#ffcc00]/10 border border-[#ffcc00]/30 text-[#ffcc00]">
                <div className="font-bold">DR</div>
                <div className="text-[10px] opacity-80">Operand</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#ff007f]/10 border border-[#ff007f]/30 text-[#ff007f]">
                <div className="font-bold">AC</div>
                <div className="text-[10px] opacity-80">Math Core</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6]">
                <div className="font-bold">IR</div>
                <div className="text-[10px] opacity-80">Decoder</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4]">
                <div className="font-bold">TR</div>
                <div className="text-[10px] opacity-80">Scratchpad</div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-xs font-mono text-textMuted flex items-center justify-center gap-1.5">
            <span>Scroll down to interact with and simulate each register</span>
            <span className="text-primary">&darr;</span>
          </div>
        </motion.div>
      </div>

      {/* 1. PROGRAM COUNTER (PC) */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00f2fe]/20 text-[#00f2fe]">
                  <Navigation size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Program Counter (PC)</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed mb-5">
                Holds the memory address of the next instruction to be fetched. It automatically advances sequentially after each instruction fetch cycle.
              </p>
              
              <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textMuted">Current Address:</span>
                  <span className="text-[#00f2fe] font-bold text-base">0x{pcVal.toString(16).toUpperCase().padStart(3, '0')}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-borderLine pt-2">
                  <span className="text-textMuted">Instruction Ptr:</span>
                  <span className="text-textMain font-medium">Memory Slot #{pcVal}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setPcVal(prev => (prev + 1) & 0xFFF)}
                    className="flex-1 py-2 px-3 bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 border border-[#00f2fe]/40 text-[#00f2fe] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play size={14} /> FETCH NEXT (PC++)
                  </button>
                  <button 
                    onClick={() => setPcVal(0)}
                    className="p-2 border border-borderLine bg-background/50 hover:bg-red-500/20 text-textMuted hover:text-red-400 rounded-lg transition-all"
                    title="Reset PC"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <PcVisualizer pcVal={pcVal} />
          </div>
        </div>
      </div>

      {/* 2. ADDRESS REGISTER (AR) */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#1fd655]/20 text-[#1fd655]">
                  <MapPin size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Address Register (AR)</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed mb-5">
                Locks onto the direct 12-bit physical address in memory for read/write operations. The green pointer laser shows AR latching onto a target memory cell.
              </p>
              
              <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textMuted">Latched Address:</span>
                  <span className="text-[#1fd655] font-bold text-base">{arAddress}</span>
                </div>
                <div className="text-xs text-textMuted">Select Target Memory Address:</div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {['0x020', '0x08A', '0x1F4', '0x3A0'].map(addr => (
                    <button
                      key={addr}
                      onClick={() => setArAddress(addr)}
                      className={`py-1.5 text-xs rounded border transition-all ${
                        arAddress === addr 
                          ? 'bg-[#1fd655]/20 border-[#1fd655] text-[#1fd655] font-bold' 
                          : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                      }`}
                    >
                      {addr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <ArVisualizer arAddress={arAddress} />
          </div>
        </div>
      </div>

      {/* 3. ACCUMULATOR (AC) */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#ff007f]/20 text-[#ff007f]">
                  <Activity size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Accumulator (AC)</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed mb-5">
                The primary processor calculation register. The ALU constantly pulls operands from it and dumps arithmetic & logic results back into the accumulator.
              </p>
              
              <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textMuted">AC Decimal:</span>
                  <span className="text-[#ff007f] font-bold text-lg">{acValue}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-borderLine pt-2">
                  <span className="text-textMuted">Binary Output:</span>
                  <span className="text-textMain font-bold">{acValue.toString(2).padStart(8, '0')}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-2">
                  <button onClick={() => setAcValue(v => (v + 1) & 0xFF)} className="p-2 bg-background border border-borderLine hover:border-[#ff007f] hover:text-[#ff007f] text-xs font-bold rounded transition-all">+1</button>
                  <button onClick={() => setAcValue(v => (v + 5) & 0xFF)} className="p-2 bg-background border border-borderLine hover:border-[#ff007f] hover:text-[#ff007f] text-xs font-bold rounded transition-all">+5</button>
                  <button onClick={() => setAcValue(v => (v * 2) & 0xFF)} className="p-2 bg-background border border-borderLine hover:border-[#ff007f] hover:text-[#ff007f] text-xs font-bold rounded transition-all">x2</button>
                  <button onClick={() => setAcValue(0)} className="p-2 bg-background border border-borderLine hover:border-red-500 hover:text-red-400 text-xs font-bold rounded transition-all">CLR</button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <AcVisualizer acValue={acValue} />
          </div>
        </div>
      </div>

      {/* 4. DATA REGISTER (DR) */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#ffcc00]/20 text-[#ffcc00]">
                  <Database size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Data Register (DR)</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed mb-5">
                Acts as a high-speed buffer for memory operands. When data is pulled out of RAM, it rests inside the DR chamber before the ALU executes computations.
              </p>
              
              <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textMuted">Buffered Byte:</span>
                  <span className="text-[#ffcc00] font-bold text-base">0x{drValue.toString(16).toUpperCase().padStart(2, '0')} ({drValue})</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-borderLine pt-2">
                  <span className="text-textMuted">8-Bit Bitstream:</span>
                  <span className="text-textMain font-bold">{drValue.toString(2).padStart(8, '0')}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setDrValue(Math.floor(Math.random() * 256))}
                    className="flex-1 py-2 px-3 bg-[#ffcc00]/20 hover:bg-[#ffcc00]/30 border border-[#ffcc00]/40 text-[#ffcc00] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Zap size={14} /> FETCH RANDOM OPERAND
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <DrVisualizer drValue={drValue} />
          </div>
        </div>
      </div>

      {/* 5. INSTRUCTION REGISTER (IR) */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6]">
                  <Code size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Instruction Register (IR)</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed mb-5">
                Holds the fetched 16-bit instruction word. The 3D cylinder splits mechanically into Addressing Mode [I], Operation Code [Opcode], and Memory Address.
              </p>
              
              <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textMuted">Instruction Word:</span>
                  <span className="text-[#8b5cf6] font-bold text-base">{irInstruction}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px]">
                  <div className="p-1.5 rounded bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                    <div className="font-bold">I (Bit 15)</div>
                    <div>Direct (0)</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f]">
                    <div className="font-bold">OP (14-12)</div>
                    <div>{irInstruction.split(' ')[0]}</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#00f2fe]/20 border border-[#00f2fe]/40 text-[#00f2fe]">
                    <div className="font-bold">ADDR (11-0)</div>
                    <div>{irInstruction.split(' ')[1]}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  {['ADD 0x120', 'LDA 0x200', 'BUN 0x050'].map(inst => (
                    <button
                      key={inst}
                      onClick={() => setIrInstruction(inst)}
                      className={`py-1.5 text-xs rounded border transition-all ${
                        irInstruction === inst 
                          ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6] font-bold' 
                          : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                      }`}
                    >
                      {inst.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <IrVisualizer irInstruction={irInstruction} />
          </div>
        </div>
      </div>

      {/* 6. TEMPORARY REGISTER (TR) */}
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#06b6d4]/20 text-[#06b6d4]">
                  <Shield size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Temporary Register (TR)</h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed mb-5">
                Provides a protected scratchpad chamber for in-flight intermediate values during multi-step micro-operations without corrupting primary registers.
              </p>
              
              <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textMuted">Chamber Status:</span>
                  <span className={isStashed ? "text-[#06b6d4] font-bold" : "text-textMuted"}>
                    {isStashed ? "[DATA SHIELDED & STASHED]" : "[EMPTY / READY]"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-borderLine pt-2">
                  <span className="text-textMuted">Stored Word:</span>
                  <span className="text-textMain font-bold">{isStashed ? "0x9B1C (Active)" : "--"}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setIsStashed(prev => !prev)}
                    className={`w-full py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      isStashed 
                        ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30' 
                        : 'bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-[#06b6d4] hover:bg-[#06b6d4]/30'
                    }`}
                  >
                    <Shield size={14} /> {isStashed ? "RESTORE DATA TO BUS" : "STASH IN-FLIGHT VALUE"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <TrVisualizer isStashed={isStashed} />
          </div>
        </div>
      </div>

    </section>
  );
}