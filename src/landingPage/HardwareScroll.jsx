import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function HardwareScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  // A React state variable that tracks which of the three
  // text descriptions to show.
  const [activeStep, setActiveStep] = useState(0);
  const materialsRef = useRef({});

  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  useEffect(() => {
    const container = canvasRef.current;
    if (container.childNodes.length > 0) return;

    const scene = new THREE.Scene();

    // FIX: Tie camera to container
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(5, 4, 8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // FIX: Tie canvas size to container
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    materialsRef.current = {
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5,
        clearcoat: 1.0, clearcoatRoughness: 0.1
      }),
      siliconBase: new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.2, metalness: 0.9 }),
      siliconDark: new THREE.MeshStandardMaterial({ color: 0x0d0d14, roughness: 0.3, metalness: 0.8 }),
      pcb: new THREE.MeshStandardMaterial({ color: 0x0a192f, roughness: 0.7, metalness: 0.3 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.1, metalness: 1.0 }),
      silver: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 })
    };

    const chipGroup = new THREE.Group();
    scene.add(chipGroup);

    // Top Cover 
    const layer1 = new THREE.Group();
    const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, 3), materialsRef.current.glass);
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 3.1), materialsRef.current.siliconBase);
    glassMesh.position.y = 0.05;
    frameMesh.castShadow = true;
    layer1.add(glassMesh); layer1.add(frameMesh);

    // The Core Engine 
    const layer2 = new THREE.Group();
    const coreBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 2.6), materialsRef.current.siliconDark);
    coreBase.receiveShadow = true;
    layer2.add(coreBase);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        const cell = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.15), materialsRef.current.gold);
        cell.position.set(-0.8 + (c * 0.2), 0.04, -0.8 + (r * 0.2));
        cell.castShadow = true;
        layer2.add(cell);
      }
    }

    const alu1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 1.0), materialsRef.current.silver);
    alu1.position.set(0.6, 0.04, -0.5);
    alu1.castShadow = true;
    layer2.add(alu1);

    const alu2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 1.0), materialsRef.current.silver);
    alu2.position.set(0.6, 0.04, 0.6);
    alu2.castShadow = true;
    layer2.add(alu2);

    const controlUnit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.4), materialsRef.current.siliconBase);
    controlUnit.position.set(-0.3, 0.04, 0.4);
    layer2.add(controlUnit);

    const registerBank = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.3), materialsRef.current.gold);
    registerBank.position.set(-0.3, 0.04, 0.9);
    layer2.add(registerBank);

    const brandCanvas = document.createElement('canvas');
    brandCanvas.width = 512; brandCanvas.height = 128;
    const bCtx = brandCanvas.getContext('2d');
    bCtx.clearRect(0, 0, 512, 128);
    bCtx.font = 'bold 72px "Courier New"';
    bCtx.fillStyle = '#00f2fe';
    bCtx.textAlign = 'center'; bCtx.textBaseline = 'middle';
    bCtx.fillText("S-0 CORE", 256, 64);

    const brandTex = new THREE.CanvasTexture(brandCanvas);
    brandTex.needsUpdate = true;

    const branding = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.4),
      new THREE.MeshBasicMaterial({ map: brandTex, transparent: true })
    );
    branding.rotation.x = -Math.PI / 2;
    branding.position.set(-0.5, 0.042, -0.2);
    layer2.add(branding);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d');
    const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(0, 242, 254, 1)');
    gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 64, 64);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f2fe,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(4, 4, 1);
    glowSprite.position.set(-0.5, 0.5, -0.2);
    layer2.add(glowSprite);

    // Bottom Layer 
    const layer3 = new THREE.Group();
    const pcbMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 3.2), materialsRef.current.pcb);
    pcbMesh.receiveShadow = true;
    layer3.add(pcbMesh);

    for (let x = -1.4; x <= 1.4; x += 0.2) {
      for (let z = -1.4; z <= 1.4; z += 0.2) {
        if (Math.abs(x) < 0.6 && Math.abs(z) < 0.6) continue;
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.08), materialsRef.current.gold);
        pin.position.set(x, -0.05, z);
        layer3.add(pin);
      }
    }

    chipGroup.add(layer1);
    chipGroup.add(layer2);
    chipGroup.add(layer3);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 1.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x00f2fe, 15, 12);
    rimLight.position.set(-3, 1.5, -3);
    scene.add(rimLight);

    let reqId;
    // Scroll Animation
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Measures how far the current animation is from the target.
      const diff = scrollTarget.current - scrollCurrent.current;
      scrollCurrent.current += diff * 0.25;
      if (Math.abs(scrollCurrent.current) < 0.001) scrollCurrent.current = 0;
      // Strores the progress b/w 0-1
      const progress = scrollCurrent.current;

      layer1.position.y = progress * 2.0;
      layer2.position.y = 0;
      layer3.position.y = -progress * 2.0;

      // Rotates the chip as it o

      chipGroup.rotation.y = progress * Math.PI * 0.25 + 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // Controls the Animation
    const handleScroll = () => {
      if (!containerRef.current) return;
      // Calculated how far down user moved 
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section scrollable distance = total height minus one viewport
      const scrollableDistance = rect.height - windowHeight;
      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      // Complete animation in first 60% of scroll, hold fully-open for remaining 40%
      let rawProgress = scrolled / (scrollableDistance * 0.6);
      rawProgress = Math.max(0, Math.min(1, rawProgress));

      scrollTarget.current = rawProgress;

      if (rawProgress < 0.33) setActiveStep(0);
      else if (rawProgress < 0.66) setActiveStep(1);
      else setActiveStep(2);
    };

    const handleResize = () => {
      if (!container) return;
      // FIX: Ensure it always respects its parent container size
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll(); // Set initial state

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();

      scene.traverse((object) => {
        if (object.isMesh || object.isSprite) {
          if (object.geometry) object.geometry.dispose();
          if (object.material.isMaterial) {
            object.material.dispose();
            if (object.material.map) object.material.map.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(mat => {
              mat.dispose();
              if (mat.map) mat.map.dispose();
            });
          }
        }
      });
    };

  }, []);

  useEffect(() => {
    if (!materialsRef.current.pcb) return;
    if (theme === 'dark') {
      materialsRef.current.pcb.color.setHex(0x0a192f);
    } else {
      materialsRef.current.pcb.color.setHex(0xe0e0e0);
    }
  }, [theme]);

  const stepContent = [
    {
      tag: "PHASE 01 : COMPUTER ARCHITECTURE",
      titleMain: "Inside the",
      titleGradient: "Physical Core.",
      desc: "Explore what happens inside the physical machine. Watch signals move across pathways, observe data processing in real time, and see how basic building blocks work together."
    },
    {
      tag: "PHASE 01 : COMPUTER ARCHITECTURE",
      titleMain: "Memory &",
      titleGradient: "Data Routing.",
      desc: "Follow the flow of information between storage areas, routing pathways, and processing units as operations are carried out smoothly."
    },
    {
      tag: "PHASE 01 : COMPUTER ARCHITECTURE",
      titleMain: "The Core",
      titleGradient: "Execution Cycle.",
      desc: "Understand the continuous rhythm where instructions are fetched, decoded, and carried out step by step to bring programs to life."
    }
  ];

  return (
    <section ref={containerRef} className="relative h-[105vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <div className="w-full md:w-1/2 px-10 md:px-20 z-10">
          <div className="max-w-md">
            <span className="inline-block px-3 py-1 mb-6 border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-bold rounded-full tracking-wider">
              {stepContent[activeStep].tag}
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight transition-all duration-300">
              {stepContent[activeStep].titleMain} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
                {stepContent[activeStep].titleGradient}
              </span>
            </h2>
            <p className="text-base text-textMuted transition-all duration-300 leading-relaxed">
              {stepContent[activeStep].desc}
            </p>
          </div>
        </div>
        <div ref={canvasRef} className="absolute top-0 right-0 w-full md:w-[60%] h-full z-0 pointer-events-none" />
      </div>
    </section>
  );
}