import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
  generateProcessColor,
  updateProcessOnTrack,
  replaceAt,
} from '../base/utils';

const CODE = [
  { line: 1, text: 'flag[i] = true;' },
  { line: 2, text: 'turn = 1 - i;' },
  { line: 3, text: 'while (flag[1-i] && turn == 1-i);' },
  { line: 4, text: 'balance = balance + 10;' },
  { line: 5, text: 'flag[i] = false;' },
];

const SET_FLAG_LINE = 1;
const YIELD_TURN_LINE = 2;
const WAIT_LOOP_LINE = 3;
const CRITICAL_SECTION_LINE = 4;
const CLEAR_FLAG_LINE = 5;

const BAY_TOP = '50%';
const LANE_TOPS = ['24%', '76%'];

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
  const [mode, setMode] = useState('manual');
  const [speed, setSpeed] = useState(1);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [count, setCount] = useState(0);

  const [flag, setFlag] = useState([false, false]);
  const [turn, setTurn] = useState(0);

  const [processes, setProcesses] = useState(START_PROCESSES);
  const [exiting, setExiting] = useState([null, null]);
  const [nextId, setNextId] = useState(2);
  const [autoTurn, setAutoTurn] = useState(0);
  const [packet0, setPacket0] = useState(NO_PACKET);
  const [isPulsing, setIsPulsing] = useState(false);

  function nextStep(trackIndex) {
    const other = 1 - trackIndex;
    const p = processes[trackIndex];

    if (p.line === SET_FLAG_LINE) {
      setFlag(replaceAt(flag, trackIndex, true));
      setProcesses(updateProcessOnTrack(processes, trackIndex, { line: YIELD_TURN_LINE }));
    } else if (p.line === YIELD_TURN_LINE) {
      setTurn(other);
      let newList = updateProcessOnTrack(processes, trackIndex, { line: WAIT_LOOP_LINE });
      if (processes[other].status === 'waiting') {
        newList = updateProcessOnTrack(newList, other, { status: 'ready' });
      }
      setProcesses(newList);
    } else if (p.line === WAIT_LOOP_LINE) {
      if (flag[other] && turn === other) {
        setProcesses(updateProcessOnTrack(processes, trackIndex, { status: 'waiting' }));
      } else {
        setProcesses(updateProcessOnTrack(processes, trackIndex, { line: CRITICAL_SECTION_LINE, status: 'in-bay' }));
      }
    } else if (p.line === CRITICAL_SECTION_LINE) {
      const newBalance = balance + INCREMENT_VALUE;
      setProcesses(updateProcessOnTrack(processes, trackIndex, { line: CLEAR_FLAG_LINE, local: newBalance }));
      setBalance(newBalance);
      setCount(count + 1);
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);

      const packet = { type: 'store', id: Date.now(), color: p.color, value: newBalance };
      setPacket0(packet);
      setTimeout(() => setPacket0(NO_PACKET), 1850);
    } else if (p.line === CLEAR_FLAG_LINE) {
      setFlag(replaceAt(flag, trackIndex, false));

      const finished = { ...p, status: 'terminated' };
      setExiting(replaceAt(exiting, trackIndex, finished));
      setTimeout(() => {
        setExiting((old) => replaceAt(old, trackIndex, null));
      }, 1500);

      const newId = nextId;
      setNextId(nextId + 1);
      const newProcess = makeProcess(newId, trackIndex);
      newProcess.status = 'spawning';
      newProcess.color = THREAD_COLORS[newId % THREAD_COLORS.length];

      let newList = updateProcessOnTrack(processes, trackIndex, newProcess);
      if (processes[other].status === 'waiting') {
        newList = updateProcessOnTrack(newList, other, { status: 'ready' });
      }
      setProcesses(newList);
      setTimeout(() => {
        setProcesses((old) => updateProcessOnTrack(old, trackIndex, { status: 'ready' }));
      }, 1200);
    }
  }

  function resetSim() {
    setFlag([false, false]);
    setTurn(0);
    setBalance(INITIAL_BALANCE);
    setCount(0);
    setProcesses(START_PROCESSES);
    setExiting([null, null]);
    setNextId(2);
    setAutoTurn(0);
    setPacket0(NO_PACKET);
    setIsPulsing(false);
  }

  function autoStep() {
    const p1CanStep = processes[0].status !== 'spawning';
    const p2CanStep = processes[1].status !== 'spawning';
    const isP1Turn = autoTurn % 2 === 0;

    if (p1CanStep && (isP1Turn || !p2CanStep)) {
      nextStep(0);
      setAutoTurn(autoTurn + 1);
    } else if (p2CanStep) {
      nextStep(1);
      setAutoTurn(autoTurn + 1);
    }
  }

  useEffect(() => {
    if (mode === 'auto') {
      const timer = setInterval(autoStep, 1100 / speed);
      return () => clearInterval(timer);
    }
  }, [mode, speed, processes]);

  let inCS = null;
  for (let i = 0; i < processes.length; i++) {
    if (processes[i].status === 'in-bay') {
      inCS = processes[i];
      break;
    }
  }

  const expectedBalance = INITIAL_BALANCE + count * INCREMENT_VALUE;

  let p0GateLocked = false;
  if (processes[0].line === WAIT_LOOP_LINE && flag[1] && turn === 1) {
    p0GateLocked = true;
  } else if (inCS !== null && inCS.track === 1) {
    p0GateLocked = true;
  }
  let p1GateLocked = false;
  if (processes[1].line === WAIT_LOOP_LINE && flag[0] && turn === 0) {
    p1GateLocked = true;
  } else if (inCS !== null && inCS.track === 0) {
    p1GateLocked = true;
  }

  if (processes[0].status === 'in-bay') {
    p0GateLocked = false;
  }
  if (processes[1].status === 'in-bay') {
    p1GateLocked = false;
  }

  let bayLabel = 'Central Bay';
  if (inCS !== null) {
    bayLabel = `Central Bay: P${inCS.id}`;
  }

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
        <ProcessCard key={`proc-exit-${exiting[i].id}`} process={exiting[i]} top={BAY_TOP} isExiting={true} centerInBay={true} />
      );
    }
  }

  const processCards = [];
  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    let top = p.laneTop;
    if (p.status === 'in-bay') {
      top = BAY_TOP;
    }
    processCards.push(
      <ProcessCard key={`proc-${p.id}`} process={p} top={top} isExiting={false} centerInBay={true} />
    );
  }

  return (
    <section className="sim-container">
      <div className="sim-arena">
        <StateHudPanel title="Shared Variables">
          <HudRow label="flag[0]" labelColor={THREAD_COLORS[0]} value={String(flag[0])} valueColor={flag0Color} />
          <HudRow label="flag[1]" labelColor={THREAD_COLORS[1]} value={String(flag[1])} valueColor={flag1Color} />
          <HudRow label="turn" labelColor={HUD_COLORS.label} value={turn} valueColor={HUD_COLORS.info} />
        </StateHudPanel>

        <ArenaTrackLayer tracks={TRACKS} singleBay={true} gate0Locked={p0GateLocked} gate1Locked={p1GateLocked} />

        {exitingCards}

        {processCards}

        <CriticalSectionZone
          singleBay={true}
          activeProc={inCS}
          busPacket0={packet0}
          sharedBalance={balance}
          expectedBalance={expectedBalance}
          drift={0}
          vaultPulse={isPulsing}
          alarmActive={false}
          bay0Label={bayLabel}
        />
      </div>

      <footer className="sim-bottom-panel">
        <SimulationControls
          mode={mode}
          setMode={setMode}
          speed={speed}
          setSpeed={setSpeed}
          processes={processes}
          onStep={nextStep}
          onReset={resetSim}
        />

        <CodeViewer title="peterson.c" code={CODE} processes={processes} maxLine={CLEAR_FLAG_LINE} />
      </footer>

      <Link to="/os/sync#mutex-locks" className="continue-reading-btn" title="Continue to Mutex Locks section">
        <span>Continue Reading: Mutex Locks</span>
        <ArrowRight size={15} />
      </Link>

      <SimulationConfigModal />
    </section>
  );
}
