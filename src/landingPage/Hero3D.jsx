import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function Hero3D() {
  // USE TO STORE <DIV> 
  const mountRef = useRef(null);
  const { theme } = useTheme();
  

  // CREATES AN EMPTY OBJECT TO STORE MATERIALS ( MONITOR , KEYBOARD)
  const materialsRef = useRef({});
  // USE TO HOLD OBJECTS OF THREE.scene()
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (container.childNodes.length > 0) return; 

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // USER PERSPECTIVE
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 10);
    camera.lookAt(0, 0, 0);

    // WebGLRenderer -> tool that takes all the mathematical data and draws pixel
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ========== MATERIALS ==========
    materialsRef.current = {
      body: new THREE.MeshPhysicalMaterial({ roughness: 0.45, metalness: 0.08 }),        // Monitor body
      bodyDark: new THREE.MeshPhysicalMaterial({ roughness: 0.55, metalness: 0.10 }),     // Darker panels
      accent: new THREE.MeshPhysicalMaterial({ roughness: 0.40, metalness: 0.05 }),       // Accent trim
      keys: new THREE.MeshPhysicalMaterial({ color: 0xeaeaf2, roughness: 0.48 }),         // Keycaps
      cable: new THREE.MeshBasicMaterial({ color: 0x333333 }),                            // Cables/wires
      speaker: new THREE.MeshPhysicalMaterial({ roughness: 0.50, metalness: 0.05 }),      // Speaker body (same as body, tinted by theme)
      speakerGrille: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 }), // Speaker grille dots
    };

    const deskGroup = new THREE.Group();
    deskGroup.rotation.set(0.18, -0.45, -0.02);
    deskGroup.position.set(1.0, -0.3, 0);
    scene.add(deskGroup);

    // ========== MONITOR (CRT-style standalone box) ==========
    // GROUP ALL THE MONITER RELATED OBJECTS 
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0.3, 1.1, 0);
    deskGroup.add(monitorGroup);

    // Main CRT body — boxy with slight depth
    // Creats main moniter body
    const monBody = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 1.8), materialsRef.current.body);
    monBody.castShadow = true;
    monitorGroup.add(monBody);

    // Front bezel (dark rectangle infront of moniter) 
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.7, 0.08), materialsRef.current.bodyDark);
    bezel.position.set(0, 0.05, 0.87);
    monitorGroup.add(bezel);

    // Screen (canvas texture for boot animation)
    // CREATES 2D BROWSER CANVAS IN MEMORY
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    const screenTex = new THREE.CanvasTexture(canvas);
    screenTex.magFilter = THREE.NearestFilter;

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.45), new THREE.MeshBasicMaterial({ map: screenTex }));
    screen.position.set(0, 0.05, 0.92);
    monitorGroup.add(screen);

    // Front panel buttons (small colored dots like the reference)
    // MONITOR BUTTONS 
    const btnColors = [0x27C93F, 0xFFBD2E, 0xFF5F56];
    for (let i = 0; i < 3; i++) {
      const btn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12),
        new THREE.MeshBasicMaterial({ color: btnColors[i] })
      );
      btn.rotation.x = Math.PI / 2;
      btn.position.set(-0.9 + i * 0.15, -0.75, 0.92);
      monitorGroup.add(btn);
    }

    // Monitor stand/base (small foot under monitor)
    const monStand = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.2), materialsRef.current.body);
    monStand.position.set(0, -1.16, 0);
    monitorGroup.add(monStand);

    // ========== BOOT SCREEN ANIMATION ==========
    // STRORES THE LINE DISPLAY ON MONITOR SCREEN 
    const bootLines = [
      "SYSTEM_ZERO KERNEL v1.0.0",
      "CPU: DETECTED",
      "RAM: 64MB OK",
      "MOUNTING VIRTUAL MEMORY...",
      "FETCHING INSTRUCTION...",
      "DECODE SUCCESS",
      "> WAITING FOR USER INPUT_"
    ];
    
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let lastTypeTime = 0;

    // IT REDRAWS THE SCREEN
    function drawScreen(time) {
      if (time - lastTypeTime > 0.05) {
        lastTypeTime = time;
        
        ctx.fillStyle = '#0a0a0a'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '24px "Courier New", monospace';
        ctx.fillStyle = '#00ffcc'; 
        
        for (let i = 0; i < currentLineIndex; i++) {
          ctx.fillText(bootLines[i], 20, 40 + (i * 35));
        }
        
        if (currentLineIndex < bootLines.length) {
          // CHECKS PENDING LINES
          const currentText = bootLines[currentLineIndex].substring(0, currentCharIndex);
          const cursor = (Math.floor(time * 2) % 2 === 0) ? "_" : "";
          ctx.fillText(currentText + cursor, 20, 40 + (currentLineIndex * 35));
          
          currentCharIndex++;
          if (currentCharIndex > bootLines[currentLineIndex].length) {
            currentCharIndex = 0;
            currentLineIndex++;
            lastTypeTime = time + 0.5; 
          }
        }
        screenTex.needsUpdate = true;
      }
    }

    // ========== KEYBOARD (separate, in front of monitor) ==========
    // CREATES A GROUP OF KEYBOARD
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, -0.25, 2.2);
    kbGroup.rotation.x = 0.15; // slight tilt
    // ADD IT TO THE COMPELETE DESK GROUP
    deskGroup.add(kbGroup);

    // Keyboard body
    const kbBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.0), materialsRef.current.body);
    kbGroup.add(kbBody);

    // Key well (CREATES DARKER AREA)
    const kbWell = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.85), materialsRef.current.bodyDark);
    kbWell.position.set(0, 0.06, 0);
    kbGroup.add(kbWell);

    // Individual keycaps
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 14; c++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.05, 0.15), materialsRef.current.keys);
        key.position.set((c - 6.5) * 0.16, 0.09, (r - 1.5) * 0.19);
        kbGroup.add(key);
      }
    }

    // ========== CABLE: Monitor → Keyboard ==========
    // CREATES SMOOTH 3D CURVE 
    const kbCableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.1, 0.9),    // back of monitor base
      new THREE.Vector3(0, -0.8, 1.3),     
      new THREE.Vector3(0, -0.4, 1.8),    
      new THREE.Vector3(0, -0.25, 2.2),    // keyboard position
    ]);
    const kbCableGeo = new THREE.TubeGeometry(kbCableCurve, 20, 0.03, 8, false);
    const kbCable = new THREE.Mesh(kbCableGeo, materialsRef.current.cable);
    deskGroup.add(kbCable);

    // ========== SPEAKERS (two boxes on either side) ==========
    // PREVENT WRITING SPEAKER CODE TWICE 
    function createSpeaker(x) {
      const spkGroup = new THREE.Group();
      spkGroup.position.set(x, 0.2, 0.1);
      deskGroup.add(spkGroup);

      // Speaker body
      const spkBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.65), materialsRef.current.speaker);
      spkBody.castShadow = true;
      spkGroup.add(spkBody);

      // Speaker cone (large circle on front)
      const cone = new THREE.Mesh(
        new THREE.CircleGeometry(0.22, 24),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 })
      );
      cone.position.set(0, 0.15, 0.33);
      spkGroup.add(cone);

      // Tweeter (small circle above)
      const tweeter = new THREE.Mesh(
        new THREE.CircleGeometry(0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 })
      );
      tweeter.position.set(0, 0.5, 0.33);
      spkGroup.add(tweeter);

      // Grille dots
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          const dot = new THREE.Mesh(
            new THREE.CircleGeometry(0.015, 8),
            materialsRef.current.speakerGrille
          );
          dot.position.set((col - 1) * 0.08, -0.2 + row * 0.08, 0.33);
          spkGroup.add(dot);
        }
      }

      return spkGroup;
    }

    const leftSpeaker = createSpeaker(-2.1);
    const rightSpeaker = createSpeaker(2.1);

    // ========== CABLES: Monitor → Speakers ==========
    // Left cable
    const leftCableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, 0.0, -0.9),    // back of monitor
      new THREE.Vector3(-1.8, -0.3, -0.6),    
      new THREE.Vector3(-2.1, -0.1, 0.0),     // back of left speaker
    ]);
    const leftCableGeo = new THREE.TubeGeometry(leftCableCurve, 16, 0.025, 8, false);
    deskGroup.add(new THREE.Mesh(leftCableGeo, materialsRef.current.cable));

    // Right cable
    const rightCableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.4, 0.0, -0.9),
      new THREE.Vector3(1.8, -0.3, -0.6),
      new THREE.Vector3(2.1, -0.1, 0.0),
    ]);
    const rightCableGeo = new THREE.TubeGeometry(rightCableCurve, 16, 0.025, 8, false);
    deskGroup.add(new THREE.Mesh(rightCableGeo, materialsRef.current.cable));

    // ========== LIGHTING ==========
    // Adds light that illuminates everything evenly.
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // ========== ANIMATION ==========
    const clock = new THREE.Clock();
    // Creates a timer used to calculate elapsed time.
    let reqId;

    // ANIMATION LOOP
    function animate() {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      drawScreen(time);

      // Gentle floating
      deskGroup.position.y = Math.sin(time * 1.5) * 0.08 - 0.3;
      deskGroup.rotation.y = -0.45 + Math.sin(time * 0.5) * 0.04;

      renderer.render(scene, camera);
    }
    animate();

    // DEFINES A BROWSER RESIZE HANDLER 
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
      
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (object.material.isMaterial) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          }
        }
      });
    };

  }, []);

  // THEME UPDATE 
  useEffect(() => {
    if (!materialsRef.current.body) return;

    if (theme === 'dark') {
      materialsRef.current.body.color.setHex(0x512da8);
      materialsRef.current.bodyDark.color.setHex(0x28145a);
      materialsRef.current.accent.color.setHex(0x8054e8);
      materialsRef.current.speaker.color.setHex(0x3d2380);
    } else {
      materialsRef.current.body.color.setHex(0xff6b00); 
      materialsRef.current.bodyDark.color.setHex(0xcc5500); 
      materialsRef.current.accent.color.setHex(0xffaa00);
      materialsRef.current.speaker.color.setHex(0xe06000);
    }
  }, [theme]);

  return (
    <div className="relative w-full h-[100vh] flex items-center justify-between px-0 max-w-[90rem] mx-auto">
      <div className="z-10 max-w-xl pointer-events-none">
        <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
          BEYOND <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
            ABSTRACTION.
          </span>
        </h1>
        <p className="text-xl text-textMuted max-w-md">
           An interactive 3D simulation engine that transforms invisible machine processes into clear, tangible visuals.
        </p>
      </div>

      <div 
        ref={mountRef} 
        className="absolute top-0 right-0 w-full md:w-[75%] h-full z-0 pointer-events-none"
      />
    </div>
  );
}