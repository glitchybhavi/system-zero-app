import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Terminal, Code, Cpu } from 'lucide-react';

export default function IdeView() {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  const [hoveredLine, setHoveredLine] = useState(null);
  const hoverStateRef = useRef(null);

  useEffect(() => {
    hoverStateRef.current = hoveredLine;
  }, [hoveredLine]);

  useEffect(() => {
    const container = mountRef.current;
    if (container.childNodes.length > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ramBoardMat = new THREE.MeshStandardMaterial({ color: 0x002211, roughness: 0.9, metalness: 0.1 });
    const ramChipMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 });
    const activeChipMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb000, metalness: 1 });

    const ramGroup = new THREE.Group();
    ramGroup.rotation.x = -0.2;
    scene.add(ramGroup);

    const board = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 1.5), ramBoardMat);
    ramGroup.add(board);

    const pinGeo = new THREE.BoxGeometry(0.08, 0.11, 0.3);
    for (let i = 0; i < 30; i++) {
      if (i === 15) continue;
      const pin = new THREE.Mesh(pinGeo, goldMat);
      pin.position.set(-2.8 + (i * 0.19), 0, 0.65);
      ramGroup.add(pin);
    }

    const memoryChips = [];
    for (let i = 0; i < 4; i++) {
      const chip = new THREE.Mesh(new THREE.BoxGeometry(1, 0.15, 0.8), ramChipMat);
      chip.position.set(-2.2 + (i * 1.45), 0.05, -0.1);
      ramGroup.add(chip);
      memoryChips.push(chip);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    const laserMatCyan = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0 });
    const laserMatRed = new THREE.LineBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0 });

    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4, 3, 2),
      new THREE.Vector3(0, 0, 0)
    ]);
    const laser = new THREE.Line(laserGeo, laserMatCyan);
    scene.add(laser);

    const clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      ramGroup.position.y = Math.sin(time) * 0.1;

      let targetChipIndex = -1;
      if (hoverStateRef.current === 'line-malloc-1') targetChipIndex = 0;
      if (hoverStateRef.current === 'line-malloc-2') targetChipIndex = 1;
      if (hoverStateRef.current === 'line-free') targetChipIndex = 0;

      const isFreeing = hoverStateRef.current === 'line-free';

      memoryChips.forEach((chip, index) => {
        if (index === targetChipIndex) {
          chip.material = activeChipMat;

          activeChipMat.color.setHex(isFreeing ? 0xff0044 : 0x00ffcc);
          activeChipMat.emissive.setHex(isFreeing ? 0xff0044 : 0x00ffcc);

          laser.material = isFreeing ? laserMatRed : laserMatCyan;

          const chipPos = new THREE.Vector3();
          chip.getWorldPosition(chipPos);
          laserGeo.attributes.position.setXYZ(1, chipPos.x, chipPos.y, chipPos.z);
          laserGeo.attributes.position.needsUpdate = true;

          laser.material.opacity = Math.min(1, laser.material.opacity + 0.1);
        } else {
          chip.material = ramChipMat;
        }
      });

      if (targetChipIndex === -1) {
        laserMatCyan.opacity = Math.max(0, laserMatCyan.opacity - 0.1);
        laserMatRed.opacity = Math.max(0, laserMatRed.opacity - 0.1);
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

      scene.traverse((object) => {
        if (object.isMesh || object.isLine) {
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

  return (
    <section className="min-h-screen pt-4 pb-24 bg-background relative z-10">

      {/* UPDATED HEADER: Matches CurriculumCards styling perfectly */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="font-mono text-primary font-bold tracking-widest text-sm mb-4 block uppercase">
          [ The Interface ]
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Connect code to <span className="italic text-textMuted">hardware.</span>
        </h2>
        <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
          Hover over the specific lines of code in the IDE to see exactly where and how it interacts with the physical memory in real-time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden border border-borderLine bg-[#0D1117] shadow-2xl">
          <div className="h-10 bg-[#161B22] flex items-center px-4 border-b border-[#30363D]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="flex-1 text-center text-[#8B949E] text-xs font-mono">memory_alloc.c</div>
          </div>

          <div className="p-6 font-mono text-sm sm:text-base leading-relaxed text-[#C9D1D9] overflow-x-auto">
            <div><span className="text-[#FF7B72]">#include</span> <span className="text-[#A5D6FF]">&lt;stdlib.h&gt;</span></div>
            <div className="mt-4"><span className="text-[#FF7B72]">int</span> <span className="text-[#D2A8FF]">main</span>() {"{"}</div>

            <div className="pl-6 mt-2 text-[#8B949E]">// Allocate 2048 bytes (Hover below!)</div>

            <div
              className="pl-6 py-1 cursor-pointer transition-colors duration-200 hover:bg-[#1F6FEB]/20 rounded group"
              onMouseEnter={() => setHoveredLine('line-malloc-1')}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="text-[#FF7B72]">void*</span> buffer_A = <span className="text-[#D2A8FF]">malloc</span>(<span className="text-[#79C0FF]">2048</span>);
              <span className="opacity-0 group-hover:opacity-100 text-[#00ffcc] ml-4 transition-opacity duration-200 text-xs tracking-widest">
                        // SHOOTING LASER ⬎
              </span>
            </div>

            <div
              className="pl-6 py-1 cursor-pointer transition-colors duration-200 hover:bg-[#1F6FEB]/20 rounded group mt-2"
              onMouseEnter={() => setHoveredLine('line-malloc-2')}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="text-[#FF7B72]">void*</span> buffer_B = <span className="text-[#D2A8FF]">malloc</span>(<span className="text-[#79C0FF]">4096</span>);
              <span className="opacity-0 group-hover:opacity-100 text-[#00ffcc] ml-4 transition-opacity duration-200 text-xs tracking-widest">
                        // SHOOTING LASER ⬎
              </span>
            </div>

            <div className="pl-6 mt-4 text-[#8B949E]">// Free up Buffer A to avoid memory leaks</div>

            <div
              className="pl-6 py-1 cursor-pointer transition-colors duration-200 hover:bg-[#FF0044]/20 rounded group"
              onMouseEnter={() => setHoveredLine('line-free')}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="text-[#D2A8FF]">free</span>(buffer_A);
              <span className="opacity-0 group-hover:opacity-100 text-[#ff0044] ml-4 transition-opacity duration-200 text-xs tracking-widest">
                        // CLEARING CHIP ⬎
              </span>
            </div>

            <div className="pl-6 mt-4"><span className="text-[#FF7B72]">return</span> <span className="text-[#79C0FF]">0</span>;</div>
            <div>{"}"}</div>
          </div>

          <div className="h-8 bg-[#161B22] border-t border-[#30363D] flex items-center px-4 text-[#8B949E] text-xs font-mono justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Terminal size={12} /> bash</span>
              <span className="flex items-center gap-1"><Code size={12} /> C</span>
            </div>
            <div className="flex items-center gap-1 text-[#27C93F]">
              <Cpu size={12} /> System Active
            </div>
          </div>
        </div>

        <div className="relative h-[400px] lg:h-[500px] w-full bg-card rounded-2xl border border-borderLine shadow-inner overflow-hidden">
          <div ref={mountRef} className="absolute inset-0 z-0" />
          <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur border border-borderLine px-3 py-1.5 rounded-md font-mono text-xs text-textMuted flex items-center gap-2 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${hoveredLine ? (hoveredLine === 'line-free' ? 'bg-[#ff0044] animate-pulse' : 'bg-[#00ffcc] animate-pulse') : 'bg-textMuted'}`}></div>
            {hoveredLine ? "HARDWARE_MAPPED" : "AWAITING_INPUT"}
          </div>
        </div>
      </div>
    </section>
  );
}