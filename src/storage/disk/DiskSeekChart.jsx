import { useMemo } from 'react';
import { MAX_TRACK } from './diskAlgorithms';
import { Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DiskSeekChart({ scheduleResult, currentStepIndex = 0 }) {
  const steps = scheduleResult.steps || [];
  const currentStep = steps[currentStepIndex] || steps[0] || { track: 0, distance: 0, totalDistance: 0 };

  // Calculate SVG coordinate points for the seek line
  const chartHeight = Math.max(220, steps.length * 32);
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 25;

  const points = useMemo(() => {
    return steps.map((step, idx) => {
      const x = paddingX + (step.track / MAX_TRACK) * (chartWidth - paddingX * 2);
      const y = paddingY + (idx / Math.max(1, steps.length - 1)) * (chartHeight - paddingY * 2);
      return { ...step, x, y, idx };
    });
  }, [steps, chartWidth, chartHeight]);

  // Sliced points up to the current active step
  const activePoints = points.slice(0, currentStepIndex + 1);
  const polylineString = activePoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full max-w-4xl bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-borderLine pb-3 mb-5">
        <span className="font-mono text-xs text-textMuted tracking-wider uppercase flex items-center gap-1.5">
          <Activity size={14} className="text-secondary" /> Cylinder Traversal Trajectory
        </span>
        <span className="font-mono text-[11px] text-textMuted">
          ALGORITHM: {scheduleResult.algorithm}
        </span>
      </div>

      {/* Traversal SVG Canvas */}
      <div className="w-full overflow-x-auto py-2 flex justify-center">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-[500px] h-auto font-mono text-[10px] select-none"
        >
          {/* Background Grid Lines for Key Cylinders (0, 50, 100, 150, 199) */}
          {[0, 50, 100, 150, 199].map((t) => {
            const x = paddingX + (t / MAX_TRACK) * (chartWidth - paddingX * 2);
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={paddingY - 10}
                  x2={x}
                  y2={chartHeight - paddingY + 10}
                  stroke="currentColor"
                  className="text-borderLine opacity-40"
                  strokeDasharray="2 4"
                />
                <text x={x} y={paddingY - 12} textAnchor="middle" className="fill-textMuted text-[9px]">
                  {t}
                </text>
              </g>
            );
          })}

          {/* Planned Ghost Path (Dim dashed line showing entire journey) */}
          {points.length > 1 && (
            <polyline
              points={points.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="currentColor"
              className="text-borderLine opacity-30"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Active Animated Traversed Seek Line */}
          {activePoints.length > 1 && (
            <polyline
              points={polylineString}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_rgba(0,242,254,0.4)] transition-all duration-300"
            />
          )}

          {/* All Scheduled Request Checkpoints */}
          {points.map((p, i) => {
            const isVisited = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <g key={i} className="transition-all duration-300">
                {/* Checkpoint Node Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isCurrent ? 7 : isVisited ? 5 : 3.5}
                  fill={isCurrent ? '#1fd655' : isVisited ? '#00f2fe' : 'currentColor'}
                  className={isCurrent ? 'animate-pulse' : !isVisited ? 'text-borderLine' : ''}
                  style={
                    isCurrent
                      ? { filter: 'drop-shadow(0 0 6px #1fd655)' }
                      : isVisited
                      ? { filter: 'drop-shadow(0 0 4px #00f2fe)' }
                      : {}
                  }
                />

                {/* Step / Track Number Badge */}
                <text
                  x={p.x > chartWidth - 70 ? p.x - 10 : p.x + 10}
                  y={p.y + 3}
                  textAnchor={p.x > chartWidth - 70 ? 'end' : 'start'}
                  className={`text-[9px] ${
                    isCurrent
                      ? 'fill-[#1fd655] font-bold'
                      : isVisited
                      ? 'fill-textMain font-medium'
                      : 'fill-textMuted opacity-40'
                  }`}
                >
                  {p.isInitial ? `Start (${p.track})` : `#${p.stepIndex}: Trk ${p.track}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metrics Summary Strip */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mt-4 pt-4 border-t border-borderLine">
        <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-0.5">
          <span className="text-[10px] text-textMuted uppercase">Current Step:</span>
          <div className="text-base font-bold text-textMain">
            {currentStepIndex} / {steps.length - 1}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-0.5">
          <span className="text-[10px] text-textMuted uppercase">Last Hop Distance:</span>
          <div className="text-base font-bold text-[#00f2fe]">
            {currentStep.distance} Cylinders
          </div>
        </div>

        <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-0.5">
          <span className="text-[10px] text-textMuted uppercase">Cumulative Traversal:</span>
          <div className="text-base font-bold text-[#1fd655]">
            {currentStep.totalDistance} Cylinders
          </div>
        </div>

        <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-0.5">
          <span className="text-[10px] text-textMuted uppercase">Full Journey Cost:</span>
          <div className="text-base font-bold text-[#ff007f]">
            {scheduleResult.totalDistance} Total THM
          </div>
        </div>
      </div>

    </div>
  );
}
