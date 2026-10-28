import { useContext, useState } from 'react';
import { RotateCcw, SlidersHorizontal, Play, Pause, Square, Plus, Minus } from 'lucide-react';
import { SyncUIContext } from '../context/SyncUIContext';


export default function SimulationControls(props) {
  const syncUI = useContext(SyncUIContext);

  function changeSpeed(event) {
    const newSpeed = parseFloat(event.target.value);
    props.setSpeed(newSpeed);
  }

  function decreaseSpeed() {
    const nextSpeed = Math.max(0.5, Math.round((props.speed - 0.25) * 100) / 100);
    props.setSpeed(nextSpeed);
  }

  function increaseSpeed() {
    const nextSpeed = Math.min(2, Math.round((props.speed + 0.25) * 100) / 100);
    props.setSpeed(nextSpeed)
  }



  function openConfig() {
    if (syncUI) {
      syncUI.setIsConfigOpen(true);
    }
  }

  let manualClass = 'segmented-btn';
  let autoClass = 'segmented-btn';
  if (props.mode === 'manual') {
    manualClass = 'segmented-btn active';
  } else {
    autoClass = 'segmented-btn active';
  }

  let modeControls;
  if (props.mode === 'manual') {
    const stepButtons = [];
    for (let i = 0; i < props.processes.length; i++) {
      const p = props.processes[i];

      let cannotStep = false;
      if (p.status === 'spawning' || p.status === 'terminated' || p.status === 'waiting') {
        cannotStep = true;
      }

      stepButtons.push(
        <button
          key={p.id}
          type="button"
          className={`btn-track thread-slot-${p.id % 4}`}
          disabled={cannotStep}
          onClick={() => props.onStep(i)}
          style={{ '--btn-border': p.color }}
        >
          Step P{p.id}
        </button>
      );
    }

    modeControls = (
      <div className="control-group">
        <label>Manual Process Step</label>
        <div className="thread-step-grid">{stepButtons}</div>
      </div>
    );
  } else {
    const presetSpeeds = [0.5, 1, 2];

    const ticks = presetSpeeds.map((preset) => {
      let tickClass = 'slider-tick';
      if (props.speed === preset) {
        tickClass = 'slider-tick active';
      }

      const percent = ((preset - 0.5) / (2 - 0.5)) * 100;

      return (
        <span
          key={preset}
          className={tickClass}
          style={{ left: `${percent}%` }}
          onClick={() => props.setSpeed(preset)}
        >
          {`${preset}x`}
        </span>
      );
    });

    const SpeedControlBtnStrokeWidth = 3.5;
    const SpeedControlBtnSize = 15;

    modeControls = (
      <div className="control-group">
        <label>Simulation Speed ({props.speed}x)</label>

        <div className="auto-controls-row">
          <div className="speed-slider-group">
            <div className="slider-with-buttons">
              <button
                type="button"
                className="btn-speed-step"
                onClick={decreaseSpeed}
                disabled={props.speed <= 0.5}
                title="Decrease speed"
              >
                <Minus size={SpeedControlBtnSize} strokeWidth={SpeedControlBtnStrokeWidth} />
              </button>

              <div className="slider-input-wrap">
                <input
                  type="range"
                  className="custom-range-slider"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={props.speed}
                  onChange={changeSpeed}
                />
              </div>

              <button
                type="button"
                className="btn-speed-step"
                onClick={increaseSpeed}
                disabled={props.speed >= 2}
                title="Increase speed"
              >
                <Plus size={SpeedControlBtnSize} strokeWidth={SpeedControlBtnStrokeWidth} />
              </button>
            </div>

            <div className="slider-ticks-row">
              <div className="slider-ticks">{ticks}</div>
            </div>
          </div>

          <div className="playback-actions">
            <button
              type="button"
              className="btn-playback btn-playback-toggle"
              onClick={props.onTogglePause}
              title={props.isPaused ? 'Resume' : 'Pause'}
            >
              {props.isPaused ? (
                <Play size={13} fill="currentColor" />
              ) : (
                <Pause size={13} fill="currentColor" />
              )}
              <span>{props.isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              type="button"
              className="btn-playback btn-playback-stop"
              onClick={props.onStop}
              title="Stop"
            >
              <Square size={12} fill="currentColor" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      </div>
    );

  }

  return (
    <div className="controls-panel">
      <header className="control-section-header">Simulation Controls</header>

      <div className="control-group">
        <label>Execution Mode</label>
        <div className="segmented-control">
          <button type="button" className={manualClass} onClick={() => props.setMode('manual')}>
            Manual
          </button>
          <button type="button" className={autoClass} onClick={() => props.setMode('auto')}>
            Auto
          </button>
        </div>
      </div>

      <div className="controls-mode-slot">{modeControls}</div>

      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button type="button" className="btn-reset" onClick={props.onReset} style={{ flex: 1, marginTop: 0 }}>
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
        <button type="button" className="btn-reset" onClick={openConfig} style={{ flex: 1, marginTop: 0 }}>
          <SlidersHorizontal size={14} />
          <span>Config</span>
        </button>
      </div>
    </div>
  );
}
