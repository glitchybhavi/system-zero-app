import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HardDrive, Play, Pause, RotateCcw, ArrowRight, Disc, CheckCircle2, AlertCircle } from 'lucide-react';
import { MAX_TRACK } from './diskAlgorithms';
import {
  setAlgorithm,
  setCustomQueue,
  setHead,
  setDirection,
  stepSeek,
  setAutoPlaying,
  resetSeek,
} from './store/diskSlice';

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

export default function DiskControlsCard({ totalSteps }) {
  const dispatch = useDispatch();
  const {
    algorithm,
    queue,
    head,
    direction,
    currentStepIndex,
    isAutoPlaying,
  } = useSelector((state) => state.disk);

  // Controlled form state for custom queue input
  const [inputQueueText, setInputQueueText] = useState(queue.join(', '));
  const [queueError, setQueueError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync with redux queue changes
  useEffect(() => {
    setInputQueueText(queue.join(', '));
  }, [queue]);

  const activeAlgoObj = ALGORITHMS.find((a) => a.id === algorithm) || ALGORITHMS[0];

  // Validation function for cylinder queue
  const validateQueue = (text) => {
    const rawTokens = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (rawTokens.length === 0) {
      return 'Queue cannot be empty. Enter cylinder numbers between 0 and 199';
    }

    const numbers = [];
    for (const token of rawTokens) {
      const num = Number(token);
      if (isNaN(num) || !Number.isInteger(num)) {
        return `"${token}" is not a valid cylinder integer`;
      }
      if (num < 0 || num > MAX_TRACK) {
        return `Cylinder #${num} is out of bounds (allowed: 0 to ${MAX_TRACK})`;
      }
      numbers.push(num);
    }

    return { validNumbers: numbers };
  };

  const handleQueueInputChange = (e) => {
    const val = e.target.value;
    setInputQueueText(val);
    if (queueError) {
      const res = validateQueue(val);
      if (typeof res === 'string') {
        setQueueError(res);
      } else {
        setQueueError('');
      }
    }
  };

  const handleQueueSubmit = (e) => {
    e.preventDefault();
    const res = validateQueue(inputQueueText);
    if (typeof res === 'string') {
      setQueueError(res);
      return;
    }

    setQueueError('');
    dispatch(setCustomQueue({ queue: res.validNumbers, head }));
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  };

  const handlePreset = (preset) => {
    setInputQueueText(preset.queue.join(', '));
    setQueueError('');
    dispatch(setCustomQueue({ queue: preset.queue, head: preset.head }));
  };

  return (
    <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00f2fe]/20 text-[#00f2fe]">
            <Disc size={20} />
          </div>
          <h3 className="font-mono font-bold text-xl text-textMain">Disk Head Scheduling</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20">
          Redux & Form Driven
        </span>
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
                type="button"
                onClick={() => dispatch(setAlgorithm(algo.id))}
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

        {/* 2. Controlled Request Queue Form with Real-Time Validation */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="queue-input" className="text-textMuted block">
              2. Cylinder Request Queue (0-199):
            </label>
            {queueError && (
              <span className="text-red-400 text-[10px] flex items-center gap-1">
                <AlertCircle size={10} /> {queueError}
              </span>
            )}
          </div>

          <form onSubmit={handleQueueSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                id="queue-input"
                type="text"
                value={inputQueueText}
                onChange={handleQueueInputChange}
                placeholder="e.g. 98, 183, 37, 122, 14, 124"
                className={`w-full py-1.5 px-3 rounded border font-mono text-xs bg-background transition-all outline-none ${
                  queueError
                    ? 'border-red-500/80 focus:border-red-500 text-red-400'
                    : 'border-borderLine focus:border-primary text-textMain'
                }`}
              />
              <button
                type="submit"
                className="py-1.5 px-3 rounded bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 border border-[#00f2fe]/40 text-[#00f2fe] font-bold text-xs whitespace-nowrap transition-all shadow-sm"
              >
                Load
              </button>
            </div>

            {submitSuccess && (
              <div className="text-[11px] text-[#1fd655] bg-[#1fd655]/10 border border-[#1fd655]/30 p-1.5 rounded flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                <span>Queue loaded and seek sequence calculated!</span>
              </div>
            )}

            {/* Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-textMuted">Presets:</span>
              <div className="flex gap-1.5 flex-wrap">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePreset(p)}
                    className="py-0.5 px-1.5 rounded border border-borderLine bg-background text-[10px] text-textMuted hover:text-textMain transition-all truncate"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </form>
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
            onChange={(e) => dispatch(setHead(Number(e.target.value)))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* 4. Direction Toggle (for SCAN / LOOK) */}
        {(algorithm.includes('SCAN') || algorithm.includes('LOOK')) && (
          <div>
            <span className="text-textMuted block mb-1.5">Sweep Direction:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => dispatch(setDirection('inward'))}
                className={`py-1 rounded border text-xs transition-all ${
                  direction === 'inward'
                    ? 'bg-[#1fd655]/20 border-[#1fd655] text-[#1fd655] font-bold'
                    : 'bg-background border-borderLine text-textMuted'
                }`}
              >
                Inward (&rarr; 199)
              </button>
              <button
                type="button"
                onClick={() => dispatch(setDirection('outward'))}
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
            type="button"
            onClick={() => dispatch(stepSeek(totalSteps))}
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
            type="button"
            onClick={() => dispatch(setAutoPlaying(!isAutoPlaying))}
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
            type="button"
            onClick={() => dispatch(resetSeek())}
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
