import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArenaTrackLayer from './ArenaTrackLayer';
import ProcessCard from './ProcessCard';
import CriticalSectionZone from './CriticalSectionZone';
import SimulationControls from './SimulationControls';
import CodeViewer from './CodeViewer';
import SimulationConfigModal from './SimulationConfigModal';
import {
  setMode,
  setSpeed,
  stepProcess,
  readyProcess,
  resetSim,
} from '../store/raceConditionSlice';
import {
  replaceAt,
} from './utils';
import { SyncUIContext } from '../context/SyncUIContext';

const LOAD_LINE = 2;
const ADD_LINE = 3;
const STORE_LINE = 4;
const FINISHED_LINE = 5;

const TRACKS = [
  { id: 0, top: '32%' },
  { id: 1, top: '68%' },
];

const NO_PACKET = { type: null, id: 0, color: '', value: null };

export default function RaceConditionSimulator({ children }) {
  const syncUI = useContext(SyncUIContext);
  const dispatch = useDispatch();

  const balance = useSelector((state) => state.raceCondition.balance);
  const expectedBalance = useSelector((state) => state.raceCondition.expectedBalance);
  const speed = useSelector((state) => state.raceCondition.speed);
  const mode = useSelector((state) => state.raceCondition.mode);
  const processes = useSelector((state) => state.raceCondition.processes);
  const incrementValue = useSelector((state) => state.config?.incrementValue ?? state.raceCondition.incrementValue);

  const [exiting, setExiting] = useState([null, null]);
  const [autoTurn, setAutoTurn] = useState(0);
  const [packet0, setPacket0] = useState(NO_PACKET);
  const [packet1, setPacket1] = useState(NO_PACKET);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isAlarm, setIsAlarm] = useState(false);
  const [isPaused, setIsPaused] = useState(false); 

  function showPacket(slot, type, color, value) {
    const packet = { type: type, id: Date.now(), color: color, value: value };
    if (slot === 0) {
      setPacket0(packet);
      setTimeout(() => setPacket0(NO_PACKET), 1850);
    } else {
      setPacket1(packet);
      setTimeout(() => setPacket1(NO_PACKET), 1850);
    }
  }

  function nextStep(trackIndex) {
    const p = processes[trackIndex];

    if (p.line === STORE_LINE) {
      const finished = { ...p, line: FINISHED_LINE, status: 'terminated' };
      setExiting((old) => replaceAt(old, trackIndex, finished));
      setTimeout(() => {
        setExiting((old) => (old[trackIndex]?.id === finished.id ? replaceAt(old, trackIndex, null) : old));
      }, 1500);

      dispatch(stepProcess(trackIndex));
      setTimeout(() => {
        dispatch(readyProcess(trackIndex));
      }, 900);
    } else {
      const nextLine = p.line + 1;

      if (nextLine === LOAD_LINE) {
        showPacket(trackIndex, 'load', p.color, balance);
        dispatch(stepProcess(trackIndex));
      } else if (nextLine === ADD_LINE) {
        dispatch(stepProcess(trackIndex));
      } else if (nextLine === STORE_LINE) {
        let isLostUpdate = false;
        if (p.loadedBalance !== null && p.loadedBalance !== undefined && balance !== p.loadedBalance) {
          isLostUpdate = true;
        }

        if (isLostUpdate) {
          setIsAlarm(true);
          setTimeout(() => setIsAlarm(false), 3200);
        }

        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 600);
        showPacket(trackIndex, 'store', p.color, p.local);
        dispatch(stepProcess(trackIndex));
      }
    }
  }

  function handleReset() {
    dispatch(resetSim());
    setExiting([null, null]);
    setAutoTurn(0);
    setPacket0(NO_PACKET);
    setPacket1(NO_PACKET);
    setIsPulsing(false);
    setIsAlarm(false);
    setIsPaused(false);
  }

  function handleSetMode(newMode) {
    setIsPaused(false);
    dispatch(setMode(newMode));
  }

  function handleTogglePause() {
    setIsPaused(!isPaused);  
  }

  function handleStop() {
    setIsPaused(false); 
    dispatch(setMode('manual'));
  }

  function handleSetSpeed(newSpeed) {
    dispatch(setSpeed(newSpeed));
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
    if (mode === 'auto' && !isPaused) {
      const timer = setInterval(autoStep, 1100 / speed);
      return () => clearInterval(timer);
    }
  }, [mode, speed, processes, autoTurn, isPaused]);

  const code = [
    { line: 1, text: 'void deposit() {' },
    { line: 2, text: '  int local = balance;' },
    { line: 3, text: `  local = local + ${incrementValue};` },
    { line: 4, text: '  balance = local;' },
    { line: 5, text: '}' },
  ];

  let lost = 0;
  if (expectedBalance > balance) {
    lost = expectedBalance - balance;
  }

  const exitingCards = [];
  for (let i = 0; i < exiting.length; i++) {
    if (exiting[i] !== null) {
      exitingCards.push(
        <ProcessCard key={`proc-exit-${exiting[i].id}`} process={exiting[i]} top={TRACKS[i].top} isExiting={true} />
      );
    }
  }

  function getGuideText() {
    if (lost > 0) {
      return `Race condition detected! Lost ₹${lost} due to an unsynchronized overwrite.`;
    }
    const p0 = processes[0];
    const p1 = processes[1];
    if (p0.line >= 2 && p0.line <= 4 && p1.line >= 2 && p1.line <= 4) {
      return 'Critical section violation! Both processes are inside the critical section without a lock.';
    }
    const active = p0.line >= 2 && p0.line <= 4 ? p0 : (p1.line >= 2 && p1.line <= 4 ? p1 : null);
    if (active) {
      if (active.line === 2) {
        return `P${active.id} is reading the shared vault balance into its local register.`;
      }
      if (active.line === 3) {
        return `P${active.id} is incrementing the value inside its isolated local register.`;
      }
      if (active.line === 4) {
        return `P${active.id} is committing its local register back to the shared vault.`;
      }
    }
    return 'Ready. Step either process to begin the simulation.';
  }


  return (
    <section className="sim-container">
      <div className="sim-arena">
        {syncUI?.showGuide && (
  <div className="sim-guide-panel">
    <span className="sim-guide-text">{getGuideText()}</span>
  </div>
)}
        <ArenaTrackLayer tracks={TRACKS} gate0Locked={false} gate1Locked={false} />

        {exitingCards}

        <ProcessCard key={`proc-${processes[0].id}`} process={processes[0]} top={TRACKS[0].top} isExiting={false} />
        <ProcessCard key={`proc-${processes[1].id}`} process={processes[1]} top={TRACKS[1].top} isExiting={false} />

        <CriticalSectionZone
          proc0={processes[0]}
          proc1={processes[1]}
          busPacket0={packet0}
          busPacket1={packet1}
          sharedBalance={balance}
          expectedBalance={expectedBalance}
          incrementValue={incrementValue}
          drift={lost}
          vaultPulse={isPulsing}
          alarmActive={isAlarm}
        />
      </div>

      <footer className="sim-bottom-panel">
        <SimulationControls
          mode={mode}
          setMode={handleSetMode}
          speed={speed}
          setSpeed={handleSetSpeed}
          processes={processes}
          onStep={nextStep}
          onReset={handleReset}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          onStop={handleStop}
        />

        <CodeViewer title="deposit.c" code={code} processes={processes} maxLine={STORE_LINE} />
      </footer>

      {children}
      <SimulationConfigModal />
    </section>
  );
}
