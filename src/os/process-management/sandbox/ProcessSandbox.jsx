import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ProcessSandboxProvider } from './state/ProcessSandboxContext';
import ProcessSandboxHeader from './components/ProcessSandboxHeader';
import ProcessSpawner from './components/ProcessSpawner';
import CpuCoreVisualizer from './components/CpuCoreVisualizer';
import PcbGrid from './components/PcbGrid';
import ReadyQueueView from './components/ReadyQueueView';
import WaitQueueView from './components/WaitQueueView';
import './ProcessSandbox.css';

function ProcessSandboxContent() {
  const { theme } = useTheme();

  return (
    <div className={`process-sandbox-root ${theme || 'dark'}`}>
      {/* Global Simulation Header & Hardware Controls */}
      <ProcessSandboxHeader />

      {/* Main CPU & Process Scheduler View */}
      <main className="sandbox-main-view">
        <div className="sandbox-scheduler-layout">
          {/* Left Column: Spawning and Queues */}
          <section className="sandbox-col-left" aria-label="Process Spawner and Queue Views">
            <ProcessSpawner />
            <ReadyQueueView />
            <WaitQueueView />
          </section>

          {/* Right Column: Active CPU Core & Process Table */}
          <section className="sandbox-col-right" aria-label="Hardware CPU Core and PCB Table">
            <CpuCoreVisualizer />
            <PcbGrid />
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ProcessSandbox() {
  return (
    <ProcessSandboxProvider>
      <ProcessSandboxContent />
    </ProcessSandboxProvider>
  );
}
