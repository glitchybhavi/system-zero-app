import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../landingPage/Navbar';
import Footer from '../../landingPage/Footer';
import DiskControlsCard from './DiskControlsCard';
import DiskPlatter3D from './DiskPlatter3D';
import DiskSeekChart from './DiskSeekChart';
import { solveDiskScheduling } from './diskAlgorithms';
import {
  setAlgorithm,
  stepSeek,
  resetSeek,
  setAutoPlaying,
  setIsSeeking,
} from './store/diskSlice';
import { DiskUIProvider, useDiskUI } from './context/DiskUIContext';
import { HardDrive, Disc, Activity, Layers, Zap, Gauge, Timer } from 'lucide-react';

function DiskSchedulingContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    algorithm,
    queue,
    head,
    direction,
    currentStepIndex,
    isAutoPlaying,
    isSeeking,
  } = useSelector((state) => state.disk);

  const {
    activeLab,
    setActiveLab,
    seekSpeed,
    toggleSeekSpeed,
    platterRpm,
    togglePlatterRpm,
  } = useDiskUI();

  // Compute full schedule solution for current parameters
  const scheduleResult = useMemo(() => {
    return solveDiskScheduling(algorithm, queue, head, direction);
  }, [algorithm, queue, head, direction]);

  const steps = scheduleResult.steps || [];
  const totalSteps = Math.max(0, steps.length - 1);
  const currentStep = steps[currentStepIndex] || steps[0] || { track: head };

  // Sub-route handling (e.g. /os/disk/platter, /os/disk/trajectory, /os/disk/benchmark)
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const subRoute = pathParts[pathParts.length - 1];
    const validSections = ['platter', 'trajectory', 'benchmark'];

    if (validSections.includes(subRoute)) {
      setActiveLab(subRoute);
      const element = document.getElementById(subRoute);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, setActiveLab]);

  // Scroll spy: Update active lab as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLab(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    ['platter', 'trajectory', 'benchmark'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveLab]);

  const handleNavClick = (sectionId) => {
    setActiveLab(sectionId);
    navigate(`/os/disk/${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-play timer using pacing from Context
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      if (currentStepIndex < totalSteps) {
        timer = setInterval(() => {
          dispatch(setIsSeeking(true));
          dispatch(stepSeek(totalSteps));
          setTimeout(() => dispatch(setIsSeeking(false)), 500);
        }, seekSpeed);
      } else {
        dispatch(setAutoPlaying(false));
      }
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentStepIndex, totalSteps, seekSpeed, dispatch]);

  // Compute all algorithms for comparative benchmark summary
  const comparisonResults = useMemo(() => {
    return ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].map((algo) => {
      const res = solveDiskScheduling(algo, queue, head, direction);
      return {
        algo,
        totalDistance: res.totalDistance,
        avgDistance: res.avgDistance,
        isCurrent: algo === algorithm,
      };
    });
  }, [queue, head, direction, algorithm]);

  return (
    <div className="min-h-screen bg-background text-textMain">
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* HERO PHASE CARD: Matches Digital Logic, ISA & OS modules */}
        <div className="w-full min-h-[85vh] flex items-center justify-center py-24 px-6 border-b border-borderLine">
          <div className="w-full max-w-5xl bg-card/80 backdrop-blur-2xl border border-borderLine p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine pb-4">
              <span className="font-mono text-primary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                [ PHASE 04 : STORAGE SYSTEMS & DISK SCHEDULING ]
              </span>
              
              {/* Context API Display Controls */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={toggleSeekSpeed}
                  className="px-2.5 py-1 rounded-lg border border-borderLine bg-background/60 hover:bg-card text-textMuted hover:text-textMain transition-all flex items-center gap-1.5"
                  title="Toggle Seek Step Speed"
                >
                  <Timer size={12} className="text-primary" />
                  <span>SPEED: <strong className="text-primary">{seekSpeed / 1000}s</strong></span>
                </button>

                <button
                  type="button"
                  onClick={togglePlatterRpm}
                  className="px-2.5 py-1 rounded-lg border border-borderLine bg-background/60 hover:bg-card text-textMuted hover:text-textMain transition-all flex items-center gap-1.5"
                  title="Toggle Platter RPM (Visual Spin Speed)"
                >
                  <Gauge size={12} className="text-secondary" />
                  <span>RPM: <strong className="text-secondary">{platterRpm === '10000' ? '10K' : '7.2K'}</strong></span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-textMain">
                Storage & Disk Scheduling: <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
                  The Mechanical Seek Optimizer.
                </span>
              </h1>
              <p className="text-base md:text-lg text-textMuted leading-relaxed">
                Physical hard drive access time is bottlenecked by mechanical head seek delay. Explore how operating systems reorder disk queues using elevator and greedy algorithms to minimize actuator arm traversal.
              </p>
            </div>

            {/* Educational Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-background/60 border border-borderLine space-y-2">
                <div className="text-xs font-mono font-bold text-[#00f2fe] flex items-center gap-2">
                  <HardDrive size={15} /> 1. THE SEEK TIME BOTTLENECK
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Moving the physical actuator arm across concentric platter cylinders takes milliseconds—thousands of times slower than RAM. Scheduling algorithms aim to reduce Total Head Movement (THM).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background/60 border border-borderLine space-y-2">
                <div className="text-xs font-mono font-bold text-[#1fd655] flex items-center gap-2">
                  <Activity size={15} /> 2. ELEVATOR & FAIRNESS TRADEOFFS
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  While <strong>SSTF</strong> minimizes local hops greedily, it can starve distant requests. <strong>SCAN</strong> and <strong>C-SCAN</strong> sweep like an elevator to guarantee bounded waiting times.
                </p>
              </div>
            </div>

            {/* Interactive Module Navigation Roadmap (Criterion 1: React Router Navigation) */}
            <div className="pt-2">
              <div className="text-xs font-mono text-textMuted mb-2">CURRICULUM LABS:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center font-mono text-xs">
                
                <button
                  type="button"
                  onClick={() => handleNavClick('platter')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeLab === 'platter'
                      ? 'bg-[#00f2fe]/25 border-[#00f2fe] text-[#00f2fe] font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] scale-[1.02]'
                      : 'bg-[#00f2fe]/10 border-[#00f2fe]/30 text-[#00f2fe] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <Disc size={13} /> 1. PLATTER & ARM
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">3D Actuator Assembly</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('trajectory')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeLab === 'trajectory'
                      ? 'bg-[#1fd655]/25 border-[#1fd655] text-[#1fd655] font-bold shadow-[0_0_15px_rgba(31,214,85,0.3)] scale-[1.02]'
                      : 'bg-[#1fd655]/10 border-[#1fd655]/30 text-[#1fd655] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <Activity size={13} /> 2. TRAJECTORY
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">Zigzag Seek Chart</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('benchmark')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeLab === 'benchmark'
                      ? 'bg-[#ffcc00]/25 border-[#ffcc00] text-[#ffcc00] font-bold shadow-[0_0_15px_rgba(255,204,0,0.3)] scale-[1.02]'
                      : 'bg-[#ffcc00]/10 border-[#ffcc00]/30 text-[#ffcc00] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <Layers size={13} /> 3. BENCHMARK
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">Algorithm Comparison</div>
                </button>

              </div>
            </div>

            <div className="pt-2 text-center text-xs font-mono text-textMuted flex items-center justify-center gap-1.5">
              <span>Click a lab or scroll to simulate actuator arm seeks in pure React</span>
              <span className="text-primary">&darr;</span>
            </div>

          </div>
        </div>

        {/* SECTION 1: 3D PLATTER & ACTUATOR ARM */}
        <section id="platter" className="w-full min-h-screen py-24 px-6 border-b border-borderLine flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            
            <div className="w-full md:w-1/2 flex justify-center">
              <DiskControlsCard totalSteps={totalSteps} />
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              <DiskPlatter3D
                currentTrack={currentStep.track}
                isSeeking={isSeeking}
              />
            </div>

          </div>
        </section>

        {/* SECTION 2: TRAVERSAL TRAJECTORY CHART & ALGORITHM COMPARISON */}
        <section id="trajectory" className="w-full min-h-screen py-24 px-6 border-b border-borderLine flex flex-col items-center">
          <div className="w-full max-w-4xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-[#1fd655]/20 text-[#1fd655]">
                  <Activity size={18} />
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1fd655]">
                  Trajectory Analysis
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-textMain font-mono">
                Cylinder Traversal Trajectory
              </h2>
              <p className="text-sm text-textMuted mt-1 max-w-2xl leading-relaxed">
                Compare the zigzag seek path across tracks 0 to 199. Watch how {algorithm} orders requests to minimize total head movement.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-card/60 backdrop-blur-xl border border-borderLine py-2.5 px-4 rounded-xl font-mono text-xs shrink-0">
              <span className="text-textMuted">Algorithm:</span>
              <span className="text-primary font-bold">{algorithm}</span>
            </div>
          </div>

          <DiskSeekChart scheduleResult={scheduleResult} currentStepIndex={currentStepIndex} />

          {/* Comparative Benchmark Matrix Section */}
          <div id="benchmark" className="w-full max-w-4xl mt-14 pt-8 border-t border-borderLine">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-textMuted uppercase tracking-wider">
                Comparative Benchmark for Current Queue:
              </div>
              <span className="text-[10px] font-mono text-primary">
                Click any card to switch algorithm
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-mono text-xs">
              {comparisonResults.map((item) => (
                <button
                  key={item.algo}
                  type="button"
                  onClick={() => dispatch(setAlgorithm(item.algo))}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    item.isCurrent
                      ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold shadow-md scale-105'
                      : 'bg-card/40 border-borderLine text-textMuted hover:text-textMain hover:border-textMuted/40'
                  }`}
                >
                  <div className="font-bold text-sm">{item.algo}</div>
                  <div className="text-xs mt-1">{item.totalDistance} THM</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{item.avgDistance} avg</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FLOATING QUICK CHAPTER NAVIGATOR & CONTEXT CONTROLS */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/90 backdrop-blur-xl border border-borderLine px-4 py-2 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.35)] flex items-center gap-1.5 md:gap-2.5 text-xs font-mono max-w-[95vw] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleNavClick('platter')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeLab === 'platter'
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] font-bold border border-[#00f2fe]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            1. Platter 3D
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('trajectory')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeLab === 'trajectory'
                ? 'bg-[#1fd655]/20 text-[#1fd655] font-bold border border-[#1fd655]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            2. Trajectory
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('benchmark')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeLab === 'benchmark'
                ? 'bg-[#ffcc00]/20 text-[#ffcc00] font-bold border border-[#ffcc00]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            3. Benchmark
          </button>

          <span className="w-px h-4 bg-borderLine mx-0.5" />

          {/* Context controls in floating pill */}
          <button
            type="button"
            onClick={toggleSeekSpeed}
            className="px-2 py-0.5 rounded border border-borderLine bg-background/50 hover:bg-card text-textMuted hover:text-primary transition-all text-[11px] whitespace-nowrap"
            title="Toggle Stepping Speed (Context API)"
          >
            {seekSpeed / 1000}s
          </button>
          <button
            type="button"
            onClick={togglePlatterRpm}
            className="px-2 py-0.5 rounded border border-borderLine bg-background/50 hover:bg-card text-textMuted hover:text-secondary transition-all text-[11px] whitespace-nowrap"
            title="Toggle Platter RPM (Context API)"
          >
            {platterRpm === '10000' ? '10K RPM' : '7.2K RPM'}
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function DiskSchedulingPage() {
  return (
    <DiskUIProvider>
      <DiskSchedulingContent />
    </DiskUIProvider>
  );
}
