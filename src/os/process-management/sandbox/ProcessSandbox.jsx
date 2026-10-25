import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProcessSandboxProvider } from './state/ProcessSandboxContext';
import ProcessSandboxHeader from './components/ProcessSandboxHeader';
import ProcessSpawner from './components/ProcessSpawner';
import CpuCoreVisualizer from './components/CpuCoreVisualizer';
import PcbGrid from './components/PcbGrid';
import StateDiagramOverlay from './components/StateDiagramOverlay';
import ReadyQueueView from './components/ReadyQueueView';
import WaitQueueView from './components/WaitQueueView';
import ZombieOrphanLab from './components/ZombieOrphanLab';
import IpcPlayground from './components/IpcPlayground';
import EventLogConsole from './components/EventLogConsole';
import './ProcessSandbox.css';

/**
 * ============================================================================
 * WHAT IS THIS FILE?
 * This is the main Process Sandbox page component for Process Management.
 * 
 * WHY IS IT STRUCTURED WITH TABS?
 * Simulator components are cleanly separated into tabs so each OS concept
 * has dedicated space and is easy to find and navigate!
 * ============================================================================
 */

// List of tabs available in the simulator
const SANDBOX_TABS = [
  {
    id: 'scheduler',
    label: 'CPU & Scheduler',
    icon: '⚡',
    badge: 'Main Sim',
    desc: 'Spawn processes, tune scheduling algorithms, and watch real-time CPU dispatching.',
  },
  {
    id: 'lifecycle',
    label: 'State Lifecycle',
    icon: '🔄',
    badge: '5 States',
    desc: 'Full-width visual map tracking process movement between New, Ready, Running, Waiting, and Terminated.',
  },
  {
    id: 'zombie_orphan',
    label: 'Zombie & Orphan Lab',
    icon: '🧟',
    badge: 'Process Ops',
    desc: 'Simulate parent-child termination, PID 1 init adoption, and zombie reaping via wait().',
  },
  {
    id: 'ipc',
    label: 'IPC Playground',
    icon: '💬',
    badge: 'Inter-Process',
    desc: 'Experiment with Shared Memory (race conditions & mutex locks) vs Message Passing pipes.',
  },
  {
    id: 'logs',
    label: 'Kernel Event Log',
    icon: '📜',
    badge: 'Kernel Stream',
    desc: 'Inspect low-level kernel dispatch logs and hardware interrupt triggers in real-time.',
  },
];

function ProcessSandboxContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || 'scheduler');

  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const currentTabInfo = SANDBOX_TABS.find((t) => t.id === activeTab) || SANDBOX_TABS[0];

  return (
    <div className="process-sandbox-root">
      {/* 1. Global Simulation Header & Hardware Controls */}
      <ProcessSandboxHeader onOpenQuiz={() => handleSelectTab('quiz')} />

      {/* 2. Navigation Tab Bar */}
      <nav className="sandbox-tab-bar" aria-label="Sandbox feature tabs">
        <div className="tab-buttons-row">
          {SANDBOX_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`sandbox-tab-btn ${isActive ? 'is-active-tab' : ''}`}
                onClick={() => handleSelectTab(tab.id)}
                aria-selected={isActive}
                role="tab"
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-badge">{tab.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Explainer Banner */}
        <div className="tab-explainer-banner">
          <span className="tab-explainer-icon">{currentTabInfo.icon}</span>
          <div className="tab-explainer-text">
            <strong>{currentTabInfo.label}:</strong> {currentTabInfo.desc}
          </div>
        </div>
      </nav>

      {/* 3. Tab Content Panels */}
      <main className="sandbox-main-view">
        {/* TAB 1: CPU & PROCESS SCHEDULER */}
        {activeTab === 'scheduler' && (
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
        )}

        {/* TAB 2: STATE LIFECYCLE DIAGRAM */}
        {activeTab === 'lifecycle' && (
          <div className="sandbox-fullwidth-tab" aria-label="State Lifecycle Diagram">
            <StateDiagramOverlay />

            {/* Beginner-friendly OS Theory Cards for Viva */}
            <div className="lifecycle-theory-cards">
              <div className="lifecycle-card card-new">
                <span className="lc-badge">1. NEW</span>
                <p>The process is being created in RAM. Memory is allocated and the PCB is generated.</p>
              </div>
              <div className="lifecycle-card card-ready">
                <span className="lc-badge">2. READY</span>
                <p>The process has all resources ready and is queued waiting for CPU time from the scheduler.</p>
              </div>
              <div className="lifecycle-card card-running">
                <span className="lc-badge">3. RUNNING</span>
                <p>Instructions are actively being executed on hardware CPU Core #0.</p>
              </div>
              <div className="lifecycle-card card-waiting">
                <span className="lc-badge">4. WAITING (BLOCKED)</span>
                <p>The process cannot continue until an external event or I/O request finishes.</p>
              </div>
              <div className="lifecycle-card card-terminated">
                <span className="lc-badge">5. TERMINATED</span>
                <p>Execution finished or process killed. Kernel deallocates memory and reclaims PID.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ZOMBIE & ORPHAN PROCESS LAB */}
        {activeTab === 'zombie_orphan' && (
          <div className="sandbox-fullwidth-tab" aria-label="Zombie and Orphan Process Lab">
            <ZombieOrphanLab />
          </div>
        )}

        {/* TAB 5: INTERPROCESS COMMUNICATION (IPC) */}
        {activeTab === 'ipc' && (
          <div className="sandbox-fullwidth-tab" aria-label="IPC Playground">
            <IpcPlayground />
          </div>
        )}

        {/* TAB 6: KERNEL EVENT LOG */}
        {activeTab === 'logs' && (
          <div className="sandbox-fullwidth-tab" aria-label="Kernel Event Log">
            <EventLogConsole />
          </div>
        )}
      </main>
    </div>
  );
}

// WHAT: Outer wrapper component that wraps the content inside ProcessSandboxProvider.
// WHY: ProcessSandboxProvider uses React Context API to give all child components
// access to the global simulator state (active processes, CPU clock, logs) without prop-drilling!
export default function ProcessSandbox() {
  return (
    <ProcessSandboxProvider>
      <ProcessSandboxContent />
    </ProcessSandboxProvider>
  );
}
