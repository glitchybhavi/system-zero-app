import { useContext } from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { SyncUIContext } from '../context/SyncUIContext';

const SPEED_OPTIONS = [0.5, 1, 2];

export default function SimulationControls(props) {
  const syncUI = useContext(SyncUIContext);

  let currentSpeedIndex = 1;
  for (let i = 0; i < SPEED_OPTIONS.length; i++) {
    if (props.speed === SPEED_OPTIONS[i]) {
      currentSpeedIndex = i;
    }
  }

  function changeSpeed(event) {
    const index = parseInt(event.target.value, 10);
    props.setSpeed(SPEED_OPTIONS[index]);
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
          className="btn-track"
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
    const ticks = [];
    for (let i = 0; i < SPEED_OPTIONS.length; i++) {
      let tickClass = 'slider-tick';
      if (props.speed === SPEED_OPTIONS[i]) {
        tickClass = 'slider-tick active';
      }

      ticks.push(
        <span key={SPEED_OPTIONS[i]} className={tickClass} onClick={() => props.setSpeed(SPEED_OPTIONS[i])}>
          {SPEED_OPTIONS[i]}x
        </span>
      );
    }

    modeControls = (
      <div className="control-group">
        <label>Simulation Speed ({props.speed}x)</label>
        <input
          type="range"
          className="custom-range-slider"
          min="0"
          max="2"
          step="1"
          value={currentSpeedIndex}
          onChange={changeSpeed}
        />
        <div className="slider-ticks">{ticks}</div>
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
