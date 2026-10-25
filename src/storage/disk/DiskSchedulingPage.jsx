import { useState, useEffect, useMemo } from 'react';
import Navbar from '../../landingPage/Navbar';
import Footer from '../../landingPage/Footer';
import DiskControlsCard from './DiskControlsCard';
import DiskPlatter3D from './DiskPlatter3D';
import DiskSeekChart from './DiskSeekChart';
import { solveDiskScheduling, MAX_TRACK } from './diskAlgorithms';
import { HardDrive, Disc, Activity, Layers, Zap, CheckCircle2 } from 'lucide-react';

const DEFAULT_QUEUE = [98, 183, 37, 122, 14, 124, 65, 67];
const DEFAULT_HEAD = 53;

export default function DiskSchedulingPage() {
  const [algorithm, setAlgorithm] = useState('SSTF');
  const [queue, setQueue] = useState(DEFAULT_QUEUE);
  const [head, setHead] = useState(DEFAULT_HEAD);
  const [direction, setDirection] = useState('inward');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Compute full schedule solution for current parameters
  const scheduleResult = useMemo(() => {
    return solveDiskScheduling(algorithm, queue, head, direction);
  }, [algorithm, queue, head, direction]);

  const steps = scheduleResult.steps || [];
  const totalSteps = Math.max(0, steps.length - 1);
  const currentStep = steps[currentStepIndex] || steps[0] || { track: head };

  // Step advancement
  const handleStep = () => {
    if (currentStepIndex < totalSteps) {
      setIsSeeking(true);
      setCurrentStepIndex((prev) => prev + 1);
      setTimeout(() => setIsSeeking(false), 500);
    }
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setIsSeeking(false);
    setCurrentStepIndex(0);
  };

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      if (currentStepIndex < totalSteps) {
        timer = setInterval(() => {
          setIsSeeking(true);
          setCurrentStepIndex((prev) => {
            if (prev + 1 >= totalSteps) {
              setIsAutoPlaying(false);
            }
            return prev + 1;
          });
          setTimeout(() => setIsSeeking(false), 500);
        }, 1300);
      } else {
        setIsAutoPlaying(false);
      }
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentStepIndex, totalSteps]);

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
              <span className="text-xs font-mono text-textMuted">
                ACTUATOR ENGINE: OPTIMIZED
              </span>
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

            {/* Interactive Module Roadmap */}
            <div className="pt-2">
              <div className="text-xs font-mono text-textMuted mb-2">CURRICULUM LABS:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center font-mono text-xs">
                <a
                  href="#platter"
                  className="p-3.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] hover:scale-[1.01] transition-all flex items-center justify-between px-5 shadow-sm"
                >
                  <span className="font-bold flex items-center gap-2">
                    <Disc size={14} /> LAB 1: 3D ACTUATOR & PLATTER ASSEMBLY
                  </span>
                  <span className="text-[11px] opacity-80 uppercase tracking-wider">Seek Mechanics &darr;</span>
                </a>

                <a
                  href="#trajectory"
                  className="p-3.5 rounded-xl bg-[#1fd655]/10 border border-[#1fd655]/30 text-[#1fd655] hover:scale-[1.01] transition-all flex items-center justify-between px-5 shadow-sm"
                >
                  <span className="font-bold flex items-center gap-2">
                    <Activity size={14} /> LAB 2: TRAVERSAL TRAJECTORY CHART
                  </span>
                  <span className="text-[11px] opacity-80 uppercase tracking-wider">Cylinder Zigzag &darr;</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-center text-xs font-mono text-textMuted flex items-center justify-center gap-1.5">
              <span>Scroll down to simulate actuator arm seeks in pure React</span>
              <span className="text-primary">&darr;</span>
            </div>

          </div>
        </div>

        {/* SECTION 1: 3D PLATTER & ACTUATOR ARM */}
        <section id="platter" className="w-full min-h-screen py-24 px-6 border-b border-borderLine flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            
            <div className="w-full md:w-1/2 flex justify-center">
              <DiskControlsCard
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                queue={queue}
                setQueue={setQueue}
                head={head}
                setHead={setHead}
                direction={direction}
                setDirection={setDirection}
                onStep={handleStep}
                onReset={handleReset}
                isAutoPlaying={isAutoPlaying}
                setIsAutoPlaying={setIsAutoPlaying}
                currentStepIndex={currentStepIndex}
                totalSteps={totalSteps}
              />
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

          {/* Comparative Benchmark Matrix */}
          <div className="w-full max-w-4xl mt-10">
            <div className="text-xs font-mono text-textMuted mb-3 uppercase tracking-wider">
              Comparative Benchmark for Current Queue:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-mono text-xs">
              {comparisonResults.map((item) => (
                <div
                  key={item.algo}
                  onClick={() => {
                    setAlgorithm(item.algo);
                    handleReset();
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    item.isCurrent
                      ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold shadow-md scale-105'
                      : 'bg-card/40 border-borderLine text-textMuted hover:text-textMain hover:border-textMuted/40'
                  }`}
                >
                  <div className="font-bold text-sm">{item.algo}</div>
                  <div className="text-xs mt-1">{item.totalDistance} THM</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{item.avgDistance} avg</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
