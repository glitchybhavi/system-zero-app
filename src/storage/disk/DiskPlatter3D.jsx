import { useMemo } from 'react';
import { MAX_TRACK } from './diskAlgorithms';
import { Disc, HardDrive, Radio } from 'lucide-react';
import { useDiskUI } from './context/DiskUIContext';

export default function DiskPlatter3D({ currentTrack = 53, isSeeking = false, lastServicedTrack = null }) {
  const { platterRpm } = useDiskUI();
  // Normalize track between 0 and 199
  const clampedTrack = Math.max(0, Math.min(MAX_TRACK, currentTrack));

  // Map track [0, 199] to physical platter radius in SVG (inner track r=40, outer track r=120)
  const trackRadius = useMemo(() => {
    const minR = 42;
    const maxR = 125;
    return minR + (clampedTrack / MAX_TRACK) * (maxR - minR);
  }, [clampedTrack]);

  // Actuator arm pivot angle: sweeps from ~14 degrees (at track 0) to ~42 degrees (at track 199)
  const armAngle = useMemo(() => {
    const minAngle = 14;
    const maxAngle = 44;
    return minAngle + (clampedTrack / MAX_TRACK) * (maxAngle - minAngle);
  }, [clampedTrack]);

  return (
    <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl flex flex-col items-center">
      
      {/* Header bar */}
      <div className="w-full flex items-center justify-between border-b border-borderLine pb-3 mb-4">
        <span className="font-mono text-xs text-textMuted tracking-wider uppercase flex items-center gap-1.5">
          <HardDrive size={14} className="text-[#00f2fe]" /> 3D Actuator & Platter Assembly
        </span>
        <span className="font-mono text-[11px] text-textMuted">
          {platterRpm === '10000' ? '10,000 RPM' : '7,200 RPM'}
        </span>
      </div>

      {/* 3D Perspective Stage */}
      <div className="relative w-full h-72 flex items-center justify-center overflow-hidden [perspective:900px] select-none py-2">
        
        {/* Angled 3D Hard Drive Chassis */}
        <div
          className="relative w-72 h-72 transition-transform duration-700 ease-out flex items-center justify-center"
          style={{
            transform: 'rotateX(52deg) rotateZ(-22deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Base Drive Chassis Tray */}
          <div className="absolute inset-0 rounded-3xl bg-background/90 border border-borderLine shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center">
            
            {/* Actuator Voice Coil Motor Base (Top Left) */}
            <div className="absolute top-4 left-4 w-14 h-14 rounded-full border border-borderLine bg-card shadow-inner flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-borderLine bg-background flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#00f2fe]/40 shadow-[0_0_8px_#00f2fe]" />
              </div>
            </div>

            {/* Main Circular Magnetic Platter Disc */}
            <div className="relative w-64 h-64 rounded-full border-2 border-borderLine bg-gradient-to-tr from-card via-background to-card shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden">
              
              {/* Subtle Spinning Surface Sheen */}
              <div
                className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.4) 90deg, transparent 180deg, rgba(255,255,255,0.4) 270deg, transparent 360deg)',
                  animation: `spinSheen ${platterRpm === '10000' ? '2s' : '4s'} linear infinite`,
                }}
              />

              {/* Concentric Cylinder Track Rings SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 260 260">
                {/* Reference Track Rings */}
                <circle cx="130" cy="130" r="42" fill="none" stroke="currentColor" className="text-borderLine opacity-40" strokeDasharray="3 3" />
                <circle cx="130" cy="130" r="62" fill="none" stroke="currentColor" className="text-borderLine opacity-40" strokeDasharray="3 3" />
                <circle cx="130" cy="130" r="82" fill="none" stroke="currentColor" className="text-borderLine opacity-40" strokeDasharray="3 3" />
                <circle cx="130" cy="130" r="105" fill="none" stroke="currentColor" className="text-borderLine opacity-40" strokeDasharray="3 3" />
                <circle cx="130" cy="130" r="125" fill="none" stroke="currentColor" className="text-borderLine opacity-60" strokeWidth="1.5" />

                {/* Dynamically Active Target Track Ring */}
                <circle
                  cx="130"
                  cy="130"
                  r={trackRadius}
                  fill="none"
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                  className="transition-all duration-500 ease-out shadow-[0_0_12px_#00f2fe]"
                  style={{
                    filter: 'drop-shadow(0 0 6px #00f2fe)',
                    opacity: 0.9,
                  }}
                />

                {/* Track Markers */}
                <text x="130" y="85" textAnchor="middle" className="text-[9px] fill-textMuted font-mono select-none">
                  Trk 0
                </text>
                <text x="130" y="24" textAnchor="middle" className="text-[9px] fill-textMuted font-mono select-none">
                  Trk 199
                </text>
              </svg>

              {/* Center Spindle Motor Hub */}
              <div className="relative w-16 h-16 rounded-full border-2 border-borderLine bg-card shadow-md flex items-center justify-center z-10">
                <div className="w-8 h-8 rounded-full border border-borderLine bg-background flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1fd655] shadow-[0_0_8px_#1fd655]" />
                </div>
              </div>

            </div>

            {/* Pivoting Mechanical Actuator Arm (Sweeps across the platter) */}
            <div
              className="absolute top-9 left-9 w-44 h-10 origin-[10px_20px] transition-transform duration-500 ease-out pointer-events-none z-20"
              style={{
                transform: `rotate(${armAngle}deg)`,
              }}
            >
              <svg viewBox="0 0 180 40" className="w-full h-full overflow-visible">
                {/* Arm Body Beam */}
                <path
                  d="M 10 20 L 70 12 L 145 18 L 165 20 L 145 22 L 70 28 Z"
                  fill="currentColor"
                  className="text-textMuted/70 dark:text-slate-400 drop-shadow-md"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />

                {/* Read/Write Head Slider at Tip */}
                <rect x="155" y="16" width="16" height="8" rx="2" fill="#1e293b" stroke="#00f2fe" strokeWidth="1.5" />

                {/* Glowing Laser LED Sensor Tip */}
                <circle
                  cx="163"
                  cy="20"
                  r="3.5"
                  fill={isSeeking ? '#ffcc00' : '#1fd655'}
                  className={isSeeking ? 'animate-ping' : ''}
                  style={{
                    filter: `drop-shadow(0 0 6px ${isSeeking ? '#ffcc00' : '#1fd655'})`,
                  }}
                />
              </svg>
            </div>

          </div>
        </div>

      </div>

      {/* Live Track Readout Footer */}
      <div className="w-full bg-background/80 p-3.5 rounded-xl border border-borderLine font-mono text-xs space-y-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-textMuted text-[10px] uppercase">Active Cylinder:</span>
          <span className="text-primary font-bold text-sm">
            Track #{clampedTrack} / {MAX_TRACK}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-textMuted pt-1 border-t border-borderLine">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSeeking ? 'bg-[#ffcc00] animate-pulse' : 'bg-[#1fd655]'
              }`}
            />
            Status: {isSeeking ? 'Actuator In-Motion' : 'Head Latched'}
          </span>
          <span>Radial Pos: {Math.round((clampedTrack / MAX_TRACK) * 100)}%</span>
        </div>
      </div>

      {/* Global CSS for subtle rotation animation */}
      <style>{`
        @keyframes spinSheen {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
