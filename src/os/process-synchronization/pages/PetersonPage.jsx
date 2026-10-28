import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SyncUIContext } from '../context/SyncUIContext';
import ArenaTrackLayer from '../base/ArenaTrackLayer';
import ProcessCard from '../base/ProcessCard';
import CriticalSectionZone from '../base/CriticalSectionZone';
import SimulationControls from '../base/SimulationControls';
import CodeViewer from '../base/CodeViewer';
import SimulationConfigModal from '../base/SimulationConfigModal';
import { StateHudPanel, HudRow } from '../base/SyncPanels';
import {
  INITIAL_BALANCE,
  INCREMENT_VALUE,
  THREAD_COLORS,
  HUD_COLORS,
  updateProcessOnTrack,
  replaceAt,
} from '../base/utils';

const SET_FLAG_LINE = 1;
const YIELD_TURN_LINE = 2;
const WAIT_LOOP_LINE = 3;
const CRITICAL_SECTION_LINE = 4;
const CLEAR_FLAG_LINE = 5;

const LANE_TOPS = ['32%', '68%'];

const TRACKS = [
  { id: 0, top: LANE_TOPS[0] },
  { id: 1, top: LANE_TOPS[1] },
];

const NO_PACKET = { type: null, id: 0, color: '', value: null };

function makeProcess(id, track) {
  return {
    id: id,
    track: track,
    laneTop: LANE_TOPS[track],
    line: 1,
    local: null,
    status: 'ready',
    color: THREAD_COLORS[id % THREAD_COLORS.length],
  };
}

const START_PROCESSES = [makeProcess(0, 0), makeProcess(1, 1)];

export default function PetersonPage() {
    useEffect(() => {
    document.title = "System Zero | Peterson's Solution"; 

    return () => {
      document.title = "System Zero | Interactive Computer Architecture and OS Simulator";
    }
  }, []);


  const syncUI = useContext(SyncUIContext);
  const initialBalance = useSelector((state) => state.config?.initialBalance ?? state.raceCondition?.initialBalance ?? INITIAL_BALANCE);
  const incrementValue = useSelector((state) => state.config?.incrementValue ?? state.raceCondition?.incrementValue ?? INCREMENT_VALUE);
  const configVersion = useSelector((state) => state.config?.configVersion ?? 0);

  const [mode, setMode] = useState('manual');
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [balance, setBalance] = useState(initialBalance);
  const [count, setCount] = useState(0);

  const [flag, setFlag] = useState([false, false]);
  const [turn, setTurn] = useState(0);

  const [processes, setProcesses] = useState(START_PROCESSES);
  const [exiting, setExiting] = useState([null, null]);
  const [nextId, setNextId] = useState(2);
  const [autoTurn, setAutoTurn] = useState(0);
  const [packet0, setPacket0] = useState(NO_PACKET);
  const [packet1, setPacket1] = useState(NO_PACKET);
  const [isPulsing, setIsPulsing] = useState(false);

  function resetSim() {
    setFlag([false, false]);
    setTurn(0);
    setBalance(initialBalance);
    setCount(0);
    setProcesses(START_PROCESSES);
    setExiting([null, null]);
    setNextId(2);
    setAutoTurn(0);
    setPacket0(NO_PACKET);
    setPacket1(NO_PACKET);
    setIsPulsing(false);
    setIsPaused(false);
  }

  useEffect(() => {
    resetSim();
  }, [configVersion]);

  function isBlocked(trackIndex) {
    const other = 1 - trackIndex;
    return processes[trackIndex].line === WAIT_LOOP_LINE && flag[other] && turn === other;
  }

  function nextStep(trackIndex) {
    const other = 1 - trackIndex;
    const p = processes[trackIndex];

    if (p.line === SET_FLAG_LINE) {
      setFlag(replaceAt(flag, trackIndex, true));
      setProcesses(updateProcessOnTrack(processes, trackIndex, { line: YIELD_TURN_LINE }));
    } else if (p.line === YIELD_TURN_LINE) {
      setTurn(other);
      setProcesses(updateProcessOnTrack(processes, trackIndex, { line: WAIT_LOOP_LINE }));
    } else if (p.line === WAIT_LOOP_LINE) {
      if (!isBlocked(trackIndex)) {
        setProcesses(updateProcessOnTrack(processes, trackIndex, { line: CRITICAL_SECTION_LINE, status: 'in-bay' }));
      }
    } else if (p.line === CRITICAL_SECTION_LINE) {
      const newBalance = balance + incrementValue;
      setProcesses(updateProcessOnTrack(processes, trackIndex, { line: CLEAR_FLAG_LINE, local: newBalance }));
      setBalance(newBalance);
      setCount(count + 1);
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);

      const packet = { type: 'load', id: Date.now(), color: p.color, value: newBalance };
      if (trackIndex === 0) {
        setPacket0(packet);
        setTimeout(() => setPacket0(NO_PACKET), 1100);
      } else {
        setPacket1(packet);
        setTimeout(() => setPacket1(NO_PACKET), 1100);
      }
    } else if (p.line === CLEAR_FLAG_LINE) {
      setFlag(replaceAt(flag, trackIndex, false));

      const finished = { ...p, status: 'terminated' };
      setExiting((old) => replaceAt(old, trackIndex, finished));
      setTimeout(() => {
        setExiting((old) => (old[trackIndex]?.id === finished.id ? replaceAt(old, trackIndex, null) : old));
      }, 1500);

      const newId = nextId;
      setNextId(nextId + 1);
      const newProcess = makeProcess(newId, trackIndex);
      newProcess.status = 'spawning';
      newProcess.color = THREAD_COLORS[newId % THREAD_COLORS.length];

      setProcesses(updateProcessOnTrack(processes, trackIndex, newProcess));
      setTimeout(() => {
        setProcesses((old) => updateProcessOnTrack(old, trackIndex, { status: 'ready' }));
      }, 900);
    }
  }

  function handleSetMode(newMode) {
    setIsPaused(false);
    setMode(newMode);
  }

  function handleTogglePause() {
    setIsPaused(!isPaused);
  }

  function handleStop() {
    setIsPaused(false);
    setMode('manual');
  }

  function canStep(trackIndex) {
    return processes[trackIndex].status !== 'spawning' && !isBlocked(trackIndex);
  }

  function autoStep() {
    let first = 0;
    if (autoTurn % 2 === 1) {
      first = 1;
    }
    const second = 1 - first;

    if (canStep(first)) {
      nextStep(first);
      setAutoTurn(autoTurn + 1);
    } else if (canStep(second)) {
      nextStep(second);
      setAutoTurn(autoTurn + 1);
    }
  }

  useEffect(() => {
    if (mode === 'auto' && !isPaused) {
      const timer = setInterval(autoStep, 1100 / speed);
      return () => clearInterval(timer);
    }
  }, [mode, speed, processes, flag, turn, autoTurn, balance, count, exiting, nextId, isPaused, incrementValue]);

  const shownProcesses = [];
  for (let i = 0; i < processes.length; i++) {
    let shown = processes[i];
    if (shown.status === 'ready' || shown.status === 'waiting') {
      if (isBlocked(i)) {
        shown = { ...shown, status: 'waiting' };
      } else {
        shown = { ...shown, status: 'ready' };
      }
    }
    shownProcesses.push(shown);
  }

  const expectedBalance = initialBalance + count * incrementValue;

  const p0GateLocked = processes[0].status !== 'in-bay';
  const p1GateLocked = processes[1].status !== 'in-bay';

  let flag0Color = HUD_COLORS.label;
  if (flag[0]) {
    flag0Color = '#4ade80';
  }
  let flag1Color = HUD_COLORS.label;
  if (flag[1]) {
    flag1Color = '#4ade80';
  }

  const exitingCards = [];
  for (let i = 0; i < exiting.length; i++) {
    if (exiting[i] !== null) {
      exitingCards.push(
        <ProcessCard key={`proc-exit-${exiting[i].id}`} process={exiting[i]} top={TRACKS[i].top} isExiting={true} />
      );
    }
  }

  const processCards = [];
  for (let i = 0; i < shownProcesses.length; i++) {
    const p = shownProcesses[i];
    processCards.push(
      <ProcessCard key={`proc-${p.id}`} process={p} top={p.laneTop} isExiting={false} />
    );
  }

  function getGuideText() {
    const inBay = shownProcesses.find((p) => p.status === 'in-bay' && p.line === 4);
    const waiting = shownProcesses.find((p) => p.status === 'waiting');

    if (inBay && waiting) {
      return `Mutual Exclusion active! P${inBay.id} is in the Critical Section while P${waiting.id} busy-waits at the spinlock.`;
    }
    if (inBay) {
      return `P${inBay.id} is in the Critical Section. The gate protects the shared vault.`;
    }

    const exiting = shownProcesses.find((p) => p.line === 5);
    if (exiting) {
      return `P${exiting.id} is in the Exit Section, resetting flag[${exiting.track}] = false to release the lock.`;
    }

    if (waiting) {
      const otherTrack = 1 - waiting.track;
      return `P${waiting.id} is busy-waiting. flag[${otherTrack}] is true and turn is ${turn}.`;
    }

    const yielded = shownProcesses.find((p) => p.line === 3);
    if (yielded) {
      const otherTrack = 1 - yielded.track;
      return `P${yielded.id} yielded turn = ${otherTrack} to break ties and guarantee bounded waiting.`;
    }

    const requesting = shownProcesses.find((p) => p.line === 2);
    if (requesting) {
      return `P${requesting.id} set flag[${requesting.track}] = true to declare intent to enter.`;
    }

    if (count > 0 && shownProcesses.every((p) => p.line === 1)) {
      return 'Execution cycle complete. Processes safely updated the vault with zero race conditions.';
    }

    return 'Both processes are ready. Step either process to request entry.';
  }

  const code = [
    { line: 1, text: 'flag[i] = true;' },
    { line: 2, text: 'turn = 1 - i;' },
    { line: 3, text: 'while (flag[1-i] && turn == 1-i);' },
    { line: 4, text: `balance = balance + ${incrementValue};` },
    { line: 5, text: 'flag[i] = false;' },
  ];

  return (
    <section className="sim-container">
      <div className="sim-arena">
        {syncUI?.showGuide && (
          <div className="sim-guide-panel">
            <span className="sim-guide-text">{getGuideText()}</span>
          </div>
        )}
        <StateHudPanel title="Shared Variables">
          <HudRow label="flag[0]" labelColor={processes[0]?.color || THREAD_COLORS[0]} value={String(flag[0])} valueColor={flag0Color} />
          <HudRow label="flag[1]" labelColor={processes[1]?.color || THREAD_COLORS[1]} value={String(flag[1])} valueColor={flag1Color} />
          <HudRow label="turn" labelColor={HUD_COLORS.label} value={turn} valueColor={HUD_COLORS.info} />
        </StateHudPanel>

        <ArenaTrackLayer tracks={TRACKS} gate0Locked={p0GateLocked} gate1Locked={p1GateLocked} />

        {exitingCards}

        {processCards}

        <CriticalSectionZone
          busPacket0={packet0}
          busPacket1={packet1}
          sharedBalance={balance}
          expectedBalance={expectedBalance}
          incrementValue={incrementValue}
          drift={0}
          vaultPulse={isPulsing}
          alarmActive={false}
        />
      </div>

      <footer className="sim-bottom-panel">
        <SimulationControls
          mode={mode}
          setMode={handleSetMode}
          speed={speed}
          setSpeed={setSpeed}
          processes={shownProcesses}
          onStep={nextStep}
          onReset={resetSim}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          onStop={handleStop}
        />

        <CodeViewer title="peterson.c" code={code} processes={shownProcesses} maxLine={CLEAR_FLAG_LINE} />
      </footer>

      <Link to="/os/sync#mutex-locks" className="continue-reading-btn" title="Continue to Mutex Locks section">
        <span>Continue Reading: Mutex Locks</span>
        <ArrowRight size={15} />
      </Link>

      <SimulationConfigModal />
    </section>
  );
}
