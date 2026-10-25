import { HardDrive, Play, Pause, RotateCcw, ArrowRight, Disc, Layers } from 'lucide-react';
import { MAX_TRACK } from './diskAlgorithms';

const PRESETS = [
  { name: 'Galvin Classic', queue: [98, 183, 37, 122, 14, 124, 65, 67], head: 53 },
  { name: 'Local Clustered', queue: [45, 52, 60, 68, 75, 120, 130], head: 50 },
  { name: 'Wide Extremes', queue: [10, 190, 25, 175, 40, 160], head: 100 },
];

const ALGORITHMS = [
  { id: 'FCFS', name: 'FCFS', desc: 'First-Come, First-Served (FIFO order)' },
  { id: 'SSTF', name: 'SSTF', desc: 'Shortest Seek Time First (Greedy nearest cylinder)' },
  { id: 'SCAN', name: 'SCAN', desc: 'Elevator Algorithm (Sweeps to platter boundary)' },
  { id: 'C-SCAN', name: 'C-SCAN', desc: 'Circular SCAN (Unserviced jump back to Track 0)' },
  { id: 'LOOK', name: 'LOOK', desc: 'Optimized SCAN (Reverses at furthest request)' },
  { id: 'C-LOOK', name: 'C-LOOK', desc: 'Optimized Circular LOOK (Jumps to lowest request)' },
];

export default function DiskControlsCard({
  algorithm,
  setAlgorithm,
  queue,
  setQueue,
  head,
  setHead,
  direction,
  setDirection,
  onStep,
  onReset,
  isAutoPlaying,
  setIsAutoPlaying,
  currentStepIndex,
  totalSteps,
}) {
  const activeAlgoObj = ALGORITHMS.find((a) => a.id === algorithm) || ALGORITHMS[0];

  const handlePreset = (preset) => {
    setIsAutoPlaying(false);
    setQueue(preset.queue);
    setHead(preset.head);
    onReset();
  };

  return (
    <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#00f2fe]/20 text-[#00f2fe]">
          <Disc size={20} />
        </div>
        <h3 className="font-mono font-bold text-xl text-textMain">Disk Head Scheduling</h3>
      </div>
      
      <p className="text-sm text-textMuted leading-relaxed mb-5">
        Hard drives spin platters at high speeds while an actuator arm seeks concentric tracks. Scheduling algorithms reorder I/O queues to minimize mechanical seek travel and reduce latency.
      </p>

      <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-4 font-mono text-xs">
        
        {/* 1. Algorithm Selector */}
        <div>
          <span className="text-textMuted block mb-1.5">1. Scheduling Algorithm:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setAlgorithm(algo.id);
                  onReset();
                }}
                className={`py-1.5 px-2 rounded border text-xs transition-all ${
                  algorithm === algo.id
                    ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold shadow-sm'
                    : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                }`}
              >
                {algo.id}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-textMuted mt-1 block">
            {activeAlgoObj.desc}
          </span>
        </div>

        {/* 2. Preset Queues */}
        <div>
          <span className="text-textMuted block mb-1.5">2. Cylinder Queue Presets:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handlePreset(p)}
                className="py-1 px-1.5 rounded border border-borderLine bg-background text-[11px] text-textMuted hover:text-textMain transition-all truncate"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Starting Head Position Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-textMuted">3. Initial Head Position:</span>
            <span className="text-primary font-bold">Track #{head}</span>
          </div>
          <input
            type="range"
            min="0"
            max={MAX_TRACK}
            value={head}
            onChange={(e) => {
              setIsAutoPlaying(false);
              setHead(Number(e.target.value));
              onReset();
            }}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* 4. Direction Toggle (for SCAN / LOOK) */}
        {(algorithm.includes('SCAN') || algorithm.includes('LOOK')) && (
          <div>
            <span className="text-textMuted block mb-1.5">Sweep Direction:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection('inward');
                  onReset();
                }}
                className={`py-1 rounded border text-xs transition-all ${
                  direction === 'inward'
                    ? 'bg-[#1fd655]/20 border-[#1fd655] text-[#1fd655] font-bold'
                    : 'bg-background border-borderLine text-textMuted'
                }`}
              >
                Inward (&rarr; 199)
              </button>
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection('outward');
                  onReset();
                }}
                className={`py-1 rounded border text-xs transition-all ${
                  direction === 'outward'
                    ? 'bg-[#1fd655]/20 border-[#1fd655] text-[#1fd655] font-bold'
                    : 'bg-background border-borderLine text-textMuted'
                }`}
              >
                Outward (&rarr; 0)
              </button>
            </div>
          </div>
        )}

        {/* Stepper Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={onStep}
            disabled={currentStepIndex >= totalSteps}
            className={`flex-1 py-2 px-3 border rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all text-xs ${
              currentStepIndex >= totalSteps
                ? 'opacity-40 border-borderLine text-textMuted cursor-not-allowed'
                : 'bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 border-[#00f2fe]/40 text-[#00f2fe]'
            }`}
          >
            <ArrowRight size={14} /> STEP SEEK ({currentStepIndex}/{totalSteps})
          </button>

          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            disabled={currentStepIndex >= totalSteps}
            className={`p-2 border rounded-lg transition-all ${
              isAutoPlaying
                ? 'bg-primary/20 border-primary text-primary'
                : 'border-borderLine bg-background/50 hover:bg-card text-textMuted hover:text-textMain'
            }`}
            title={isAutoPlaying ? 'Pause Auto-Seek' : 'Auto Play Seek Sequence'}
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={onReset}
            className="p-2 border border-borderLine bg-background/50 hover:bg-red-500/20 text-textMuted hover:text-red-400 rounded-lg transition-all"
            title="Reset to Initial Head Position"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Current Active Queue Stream */}
        <div className="pt-2 border-t border-borderLine text-[11px] text-textMuted flex items-center justify-between">
          <span>Target Queue:</span>
          <span className="text-textMain font-medium truncate max-w-[190px]">
            [{queue.join(', ')}]
          </span>
        </div>

      </div>

    </div>
  );
}
