import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Activity,
  Zap,
  FileCode,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Search,
  BookOpen,
  Terminal,
  HelpCircle,
  HardDrive,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import CustomDropDown from '../../process-synchronization/base/CustomDropDown';
import StateTransitionDiagram from '../components/StateTransitionDiagram';
import SubtopicQuizForm from '../components/SubtopicQuizForm';
import { SUBTOPIC_QUIZZES } from '../data/processManagementQuizData';
import './ProcessManagementTheoryPage.css';

const TOPICS = [
  {
    id: 'process-definition',
    number: '01',
    heading: '1. Process Definition (Program vs. Process)',
    shortTitle: 'Program vs. Process',
    phase: 'FOUNDATIONS',
    readTime: '3 min read',
    tags: ['#ELF', '#VirtualMemory', '#StackHeap', '#BinaryCode'],
    accentColor: '#00f2fe',
    icon: <Cpu size={22} className="text-[#00f2fe]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Core Concept */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#00f2fe]">
              <Cpu size={14} /> 1. STATIC CODE VS. LIVING INSTANCE
            </div>
            <p className="pm-insight-card-text">
              A <strong>program</strong> is passive machine code resting on disk. A <strong>process</strong> is an active instance in RAM with allocated CPU cycles, registers, stack, and heap pointers.
            </p>
          </div>

          {/* Card 2: Analogy */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#1fd655]">
              <BookOpen size={14} /> 2. THE KITCHEN RECIPE ANALOGY
            </div>
            <p className="pm-insight-card-text">
              A program is a printed recipe sheet sitting in a cookbook. A process is the kitchen chef actively boiling water, measuring ingredients, and cooking the meal in real time.
            </p>
          </div>

          {/* Card 3: Kernel Loader */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <Layers size={14} /> 3. THREE-STEP LOADER PROTOCOL
            </div>
            <p className="pm-insight-card-text">
              On launch, the OS: (1) Allocates virtual memory (Text, Data, Heap, Stack), (2) Sets Program Counter (PC) to the entry point, and (3) Registers a unique PID in the process table.
            </p>
          </div>

          {/* Card 4: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Terminal size={14} /> 4. WORKED TRACE: GOOGLE CHROME
            </div>
            <p className="pm-insight-card-text">
              Static <code>/usr/bin/google-chrome</code> (180MB binary) spawns active <code>PID 4092</code> with 850MB RAM and PC at <code>0x7fff5fbff000</code>. Browser tabs spawn isolated children (PID 4098, 4105).
            </p>
          </div>

          {/* Card 5: Memory Isolation Gotcha */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f59e0b]">
              <AlertCircle size={14} /> 5. VIRTUAL MEMORY ISOLATION
            </div>
            <p className="pm-insight-card-text">
              Multiple processes execute the identical binary simultaneously without collision. The hardware MMU ensures each process safely believes it owns the entire CPU address space.
            </p>
          </div>

          {/* Card 6: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 6. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              Programs are dead bytes on persistent storage; processes are living execution environments in RAM with active hardware registers and kernel oversight.
            </p>
          </div>
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> Programs exist on storage; processes execute in RAM with allocated address spaces, registers, and kernel tracking.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'pcb',
    number: '02',
    heading: '2. The Process Control Block (PCB)',
    shortTitle: 'PCB Passport',
    phase: 'DATA STRUCTURES',
    readTime: '4 min read',
    tags: ['#task_struct', '#Registers', '#ProgramCounter', '#PID'],
    accentColor: '#1fd655',
    icon: <Layers size={22} className="text-[#1fd655]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Core Concept */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#1fd655]">
              <Layers size={14} /> 1. THE PROCESS PASSPORT
            </div>
            <p className="pm-insight-card-text">
              The <strong>Process Control Block (PCB)</strong> (Linux <code>struct task_struct</code>) is the kernel data structure serving as the official passport and state record for every active process.
            </p>
          </div>

          {/* Card 2: Analogy */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#00f2fe]">
              <BookOpen size={14} /> 2. HOSPITAL MEDICAL CHART ANALOGY
            </div>
            <p className="pm-insight-card-text">
              Like a patient's chart pinned to a hospital bed tracking vitals, doctor, and history so any nurse taking over a shift immediately knows the exact current condition.
            </p>
          </div>

          {/* Card 3: Six Vital Records */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <Cpu size={14} /> 3. SIX VITAL KERNEL RECORDS
            </div>
            <p className="pm-insight-card-text">
              Every PCB tracks: (1) PID, (2) State flag, (3) Program Counter, (4) CPU Registers (RAX, RSP), (5) Memory Page Tables (CR3), and (6) Open I/O File Descriptors.
            </p>
          </div>

          {/* Card 4: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Terminal size={14} /> 4. WORKED TRACE: NODE SERVER PAUSE
            </div>
            <p className="pm-insight-card-text">
              When <code>node server.js</code> (PID 1042) is paused for updates, registers (<code>RAX=0x05</code>, <code>PC=0x004011a0</code>) save to its PCB. Later restored on CPU Core 2 seamlessly.
            </p>
          </div>

          {/* Card 5: Ring 0 Security */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f59e0b]">
              <AlertCircle size={14} /> 5. RING 0 PROTECTED MEMORY
            </div>
            <p className="pm-insight-card-text">
              PCBs reside strictly in kernel space. User code cannot modify its own PCB fields directly; all priority or descriptor changes require validated system calls (<code>nice()</code>, <code>dup2()</code>).
            </p>
          </div>

          {/* Card 6: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 6. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              The PCB is the central nervous system of OS bookkeeping. Without it, the kernel could never pause, reschedule, and resume tasks without corrupting state.
            </p>
          </div>
        </div>

        {/* Checkpoint 1: In-line Question Form */}
        <div className="pm-interactive-frame">
          <div className="pm-interactive-frame-header">
            <span className="pm-frame-title text-[#1fd655]">
              <Sparkles size={16} /> CHECKPOINT 01 : PROCESS CONCEPT &amp; PCB EVALUATION
            </span>
            <span className="text-xs font-mono text-textMuted">Form Validation Active</span>
          </div>
          <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.concept_pcb} />
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> The PCB preserves the complete hardware context (PC, registers, page tables) so processes can be transparently suspended and resumed.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'process-states',
    number: '03',
    heading: '3. Process States (5-State Model)',
    shortTitle: '5-State Model',
    phase: 'LIFECYCLE QUEUES',
    readTime: '3 min read',
    tags: ['#ReadyQueue', '#BlockedIO', '#CPUDispatch', '#Terminated'],
    accentColor: '#ffcc00',
    icon: <Activity size={22} className="text-[#ffcc00]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Core Concept */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#ffcc00]">
              <Activity size={14} /> 1. THE 5-STATE LIFECYCLE
            </div>
            <p className="pm-insight-card-text">
              Processes cycle through five fundamental states depending on whether they possess a CPU core, are waiting in RAM for a turn, or are blocked on slow I/O hardware.
            </p>
          </div>

          {/* Card 2: Analogy */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <BookOpen size={14} /> 2. BANK CUSTOMER ANALOGY
            </div>
            <p className="pm-insight-card-text">
              Entering the door (<strong>New</strong>), waiting in the velvet line (<strong>Ready</strong>), speaking with the teller (<strong>Running</strong>), filling out forms (<strong>Waiting</strong>), and exiting (<strong>Terminated</strong>).
            </p>
          </div>

          {/* Card 3: Five Queues */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#1fd655]">
              <Layers size={14} /> 3. THE FIVE STATE QUEUES
            </div>
            <p className="pm-insight-card-text">
              <strong>NEW:</strong> initializing &bull; <strong>READY:</strong> in RAM awaiting CPU &bull; <strong>RUNNING:</strong> on CPU core &bull; <strong>WAITING:</strong> blocked on I/O &bull; <strong>TERMINATED:</strong> exited, memory freed.
            </p>
          </div>

          {/* Card 4: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Terminal size={14} /> 4. WORKED TRACE: DISK READ BLOCK
            </div>
            <p className="pm-insight-card-text">
              Python <code>PID 8120</code> executes calculations (RUNNING), then calls <code>file.read()</code>. OS moves it to WAITING. 40ms later, disk interrupt fires; OS moves it to READY, then RUNNING.
            </p>
          </div>

          {/* Card 5: Zero CPU Gotcha */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f43f5e]">
              <AlertCircle size={14} /> 5. ZERO CPU IN WAITING STATE
            </div>
            <p className="pm-insight-card-text">
              Common novice misconception: blocked tasks do NOT consume CPU. The kernel completely removes WAITING tasks from CPU dispatch until an explicit hardware interrupt arrives.
            </p>
          </div>

          {/* Card 6: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 6. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              State queues ensure that expensive physical CPU cores never stall idling on millisecond-latency disk and network operations when other computational work is ready.
            </p>
          </div>
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> By segregating ready computation from blocked I/O tasks, the OS achieves maximum CPU utilization and responsiveness.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'state-diagram',
    number: '04',
    heading: '4. State Transition Diagram',
    shortTitle: 'State Machine',
    phase: 'INTERACTIVE LAB',
    readTime: '3 min read',
    tags: ['#StateTransitions', '#Interrupts', '#TimeQuantum', '#Preemption'],
    accentColor: '#a855f7',
    icon: <Sparkles size={22} className="text-[#a855f7]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Event-Driven Nature */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#a855f7]">
              <Sparkles size={14} /> 1. EVENT-DRIVEN TRANSITIONS
            </div>
            <p className="pm-insight-card-text">
              Processes never change state spontaneously. Transitions are strictly event-driven: scheduler dispatch, clock interrupt, blocking system call, or hardware I/O completion.
            </p>
          </div>

          {/* Card 2: Preemption & Dispatches */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#00f2fe]">
              <Clock size={14} /> 2. TIMER PREEMPTION &amp; DISPATCH
            </div>
            <p className="pm-insight-card-text">
              The scheduler <em>dispatches</em> a Ready process to Running. When its Round-Robin time slice expires, a hardware timer interrupt <em>preempts</em> it back to the Ready queue.
            </p>
          </div>

          {/* Card 3: Transition Invariant */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f59e0b]">
              <AlertCircle size={14} /> 3. NO DIRECT WAITING &rarr; RUNNING
            </div>
            <p className="pm-insight-card-text">
              A process can <strong>never</strong> jump directly from WAITING to RUNNING. On I/O completion, it must re-enter READY so the CPU scheduler can evaluate its priority fairly.
            </p>
          </div>

          {/* Card 4: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 4. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              Strict state transitions enforce fairness, prevent race conditions, and decouple slow external peripherals from high-speed CPU instruction cycles.
            </p>
          </div>
        </div>

        {/* Embedded Interactive State Diagram */}
        <div className="pm-interactive-frame">
          <div className="pm-interactive-frame-header">
            <span className="pm-frame-title text-[#a855f7]">
              <Sparkles size={16} /> INTERACTIVE 5-STATE TRANSITION SIMULATOR
            </span>
            <span className="text-xs font-mono text-textMuted">Click state pills or events below</span>
          </div>
          <StateTransitionDiagram />
        </div>

        {/* Checkpoint 2: In-line Question Form */}
        <div className="pm-interactive-frame">
          <div className="pm-interactive-frame-header">
            <span className="pm-frame-title text-[#a855f7]">
              <Sparkles size={16} /> CHECKPOINT 02 : STATE LIFECYCLE EVALUATION
            </span>
            <span className="text-xs font-mono text-textMuted">Form Validation Active</span>
          </div>
          <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.states_lifecycle} />
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> Transitions are deterministic and triggered by interrupts, system calls, and scheduler arbitration.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'fork-exec',
    number: '05',
    heading: '5. Process Creation (fork & exec)',
    shortTitle: 'fork & exec',
    phase: 'SYSTEM CALL PROTOCOL',
    readTime: '3 min read',
    tags: ['#fork', '#exec', '#CopyOnWrite', '#POSIX', '#MemoryClone'],
    accentColor: '#38bdf8',
    icon: <FileCode size={22} className="text-[#38bdf8]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Two-Step Creation */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <FileCode size={14} /> 1. TWO-STEP PROTOCOL: FORK &amp; EXEC
            </div>
            <p className="pm-insight-card-text">
              POSIX splits process creation: <code>fork()</code> clones the calling process, while <code>exec()</code> overwrites that child process with a brand new program binary.
            </p>
          </div>

          {/* Card 2: Worker Analogy */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#1fd655]">
              <BookOpen size={14} /> 2. WORKER CLONING ANALOGY
            </div>
            <p className="pm-insight-card-text">
              <code>fork()</code> clones a worker with their exact notepad and office keys. <code>exec()</code> replaces their notepad with new blueprints, wiping old memory completely.
            </p>
          </div>

          {/* Card 3: Copy-On-Write */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#ffcc00]">
              <Zap size={14} /> 3. COPY-ON-WRITE (COW) OPTIMIZATION
            </div>
            <p className="pm-insight-card-text">
              To keep <code>fork()</code> instant, RAM pages are shared read-only between parent and child. Only when either process modifies data does the OS copy that specific 4KB page.
            </p>
          </div>

          {/* Card 4: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Terminal size={14} /> 4. WORKED TRACE: BASH SHELL SPAWN
            </div>
            <p className="pm-insight-card-text">
              Typing <code>ls</code> in Bash (PID 1200) calls <code>fork()</code> &rarr; child PID 1201 created. Child calls <code>execvp("/bin/ls")</code>. Bash calls <code>waitpid(1201)</code> to wait.
            </p>
          </div>

          {/* Card 5: Unix vs Windows */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#00f2fe]">
              <Layers size={14} /> 5. UNIX VS. WINDOWS ARCHITECTURE
            </div>
            <p className="pm-insight-card-text">
              Windows uses single <code>CreateProcess()</code>. Unix split <code>fork()</code> and <code>exec()</code> so parent shells can configure pipes (<code>&gt; out.txt</code>) between the two calls.
            </p>
          </div>

          {/* Card 6: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 6. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              Splitting creation into cloning (fork) and loading (exec) gives Unix unmatched composability for terminal pipelines and descriptor manipulation.
            </p>
          </div>
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> fork() clones process state with zero-copy COW speed; exec() loads the new binary without changing PID.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'termination',
    number: '06',
    heading: '6. Process Termination (Zombie & Orphan Processes)',
    shortTitle: 'Zombies & Orphans',
    phase: 'RESOURCE RECLAMATION',
    readTime: '3 min read',
    tags: ['#ZombieProcess', '#OrphanProcess', '#systemd', '#waitpid', '#Defunct'],
    accentColor: '#f59e0b',
    icon: <AlertCircle size={22} className="text-[#f59e0b]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Exit & Reclamation */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f59e0b]">
              <AlertCircle size={14} /> 1. EXIT &amp; RESOURCE HARVESTING
            </div>
            <p className="pm-insight-card-text">
              When a process calls <code>exit()</code>, the kernel frees its RAM and file descriptors immediately, but keeps its PCB entry until the parent harvests its exit code via <code>wait()</code>.
            </p>
          </div>

          {/* Card 2: Zombie Processes */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f43f5e]">
              <Terminal size={14} /> 2. ZOMBIE PROCESSES (&lt;defunct&gt;)
            </div>
            <p className="pm-insight-card-text">
              A terminated child whose parent failed to call <code>wait()</code>. It consumes zero RAM and zero CPU, but wastes a slot in the fixed-size OS kernel Process Table.
            </p>
          </div>

          {/* Card 3: Orphan Processes */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <Layers size={14} /> 3. ORPHAN PROCESSES &amp; PID 1
            </div>
            <p className="pm-insight-card-text">
              A child whose parent dies before it finishes. The kernel automatically re-parents orphans to <code>systemd</code> (PID 1), which periodically calls <code>wait()</code> to reap them cleanly.
            </p>
          </div>

          {/* Card 4: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Activity size={14} /> 4. WORKED TRACE: PYTHON PID 3001
            </div>
            <p className="pm-insight-card-text">
              Script PID 3000 spawns worker PID 3001. Worker exits; if PID 3000 loops without <code>wait()</code>, PID 3001 shows as <code>&lt;defunct&gt;</code>. If PID 3000 dies, PID 1 adopts and reaps it.
            </p>
          </div>

          {/* Card 5: PID Table Leak Gotcha */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#ffcc00]">
              <Cpu size={14} /> 5. PROCESS TABLE EXHAUSTION
            </div>
            <p className="pm-insight-card-text">
              While zombies consume no memory, the OS process table has a hard limit (e.g. 32,768 PIDs). Leaking thousands of zombies prevents any new programs from starting!
            </p>
          </div>

          {/* Card 6: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 6. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              Always reap child processes with <code>wait()</code>. PID 1 adoption guarantees no process remains an unmanaged orphan in modern Linux kernels.
            </p>
          </div>
        </div>

        {/* Checkpoint 3: In-line Question Form */}
        <div className="pm-interactive-frame">
          <div className="pm-interactive-frame-header">
            <span className="pm-frame-title text-amber-400">
              <Sparkles size={16} /> CHECKPOINT 03 : FORK, EXEC &amp; TERMINATION EVALUATION
            </span>
            <span className="text-xs font-mono text-textMuted">Form Validation Active</span>
          </div>
          <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.creation_termination} />
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> Zombie processes hold process table slots until reaped; orphan processes are adopted by systemd/init (PID 1).
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'context-switching',
    number: '07',
    heading: '7. Context Switching Overhead',
    shortTitle: 'Context Switch',
    phase: 'CPU ARCHITECTURE',
    readTime: '3 min read',
    tags: ['#ContextSwitch', '#TLBCache', '#Ring0', '#Thrashing', '#CR3'],
    accentColor: '#ec4899',
    icon: <Clock size={22} className="text-[#ec4899]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Core Mechanism */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#ec4899]">
              <Clock size={14} /> 1. MULTITASKING MECHANISM
            </div>
            <p className="pm-insight-card-text">
              A <strong>context switch</strong> saves the CPU register state of a running task into its PCB and restores another task's PCB state, enabling multitasking on limited CPU hardware.
            </p>
          </div>

          {/* Card 2: Chef Analogy */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#00f2fe]">
              <BookOpen size={14} /> 2. CHEF SWITCHING ANALOGY
            </div>
            <p className="pm-insight-card-text">
              A chef switching from cooking pasta to baking cake: notes timer, wipes counter, puts away pots, and pulls out cake pans. Zero cooking happens while switching tools.
            </p>
          </div>

          {/* Card 3: 5 Hardware Steps */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <Cpu size={14} /> 3. FIVE LOW-LEVEL HARDWARE STEPS
            </div>
            <p className="pm-insight-card-text">
              (1) Timer interrupt triggers Ring 0, (2) Save registers to PCB A, (3) Update state to Ready, (4) Switch CR3 page table pointer to PCB B, (5) Restore registers and resume.
            </p>
          </div>

          {/* Card 4: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Terminal size={14} /> 4. WORKED TRACE: 2.5µs DISPATCH COST
            </div>
            <p className="pm-insight-card-text">
              Spotify (PID 500) and VS Code (PID 900) share Core 0 on 20ms slices. Each switch burns 2.5 microseconds flushing TLB caches and reloading memory registers.
            </p>
          </div>

          {/* Card 5: CPU Thrashing Gotcha */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f43f5e]">
              <AlertCircle size={14} /> 5. CPU THRASHING PENALTY
            </div>
            <p className="pm-insight-card-text">
              Context switching is 100% administrative overhead. If the time quantum is too small, the CPU spends more time swapping registers and invalidating TLBs than executing real code.
            </p>
          </div>

          {/* Card 6: Key Takeaway */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <CheckCircle2 size={14} /> 6. ARCHITECTURAL TAKEAWAY
            </div>
            <p className="pm-insight-card-text">
              Time slice quanta must be balanced: large enough to amortize context switch overhead, yet small enough to maintain smooth interactive responsiveness.
            </p>
          </div>
        </div>

        {/* Action Button Card */}
        <div className="pm-action-btn-row">
          <Link to="/learn/process-management/sandbox" className="pm-action-btn pm-action-btn-primary">
            <span>Inspect CPU Context Switching in Sandbox</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> Context switches multiplex single CPU cores across hundreds of tasks at the cost of register dumps and TLB cache invalidation.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'ipc-basics',
    number: '08',
    heading: '8. Inter-Process Communication (IPC)',
    shortTitle: 'IPC Mechanisms',
    phase: 'CONCURRENCY & CHANNELS',
    readTime: '4 min read',
    tags: ['#IPC', '#SharedMemory', '#Pipes', '#Sockets', '#MutexLock'],
    accentColor: '#10b981',
    icon: <Zap size={22} className="text-[#10b981]" />,
    renderContent: () => (
      <>
        <div className="pm-topic-cards-grid">
          {/* Card 1: Isolation Barrier */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#10b981]">
              <Zap size={14} /> 1. CROSSING MEMORY BARRIERS
            </div>
            <p className="pm-insight-card-text">
              Because the OS strictly isolates the memory address space of every process, processes must use <strong>Inter-Process Communication (IPC)</strong> to exchange data safely.
            </p>
          </div>

          {/* Card 2: Analogy */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#00f2fe]">
              <BookOpen size={14} /> 2. MAILBOX VS. WHITEBOARD ANALOGY
            </div>
            <p className="pm-insight-card-text">
              <strong>Message Passing:</strong> sending sealed letters via the postal service (safe, verified). <strong>Shared Memory:</strong> writing on a shared whiteboard (instant speed, but needs mutual exclusion locks).
            </p>
          </div>

          {/* Card 3: Message Passing */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#38bdf8]">
              <Layers size={14} /> 3. MESSAGE PASSING (PIPES &amp; QUEUES)
            </div>
            <p className="pm-insight-card-text">
              Data is copied from User Space &rarr; Kernel Buffer &rarr; Target Process. Managed safely by the OS without race conditions, but pays syscall copy overhead.
            </p>
          </div>

          {/* Card 4: Shared Memory */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#ffcc00]">
              <Cpu size={14} /> 4. SHARED MEMORY (POSIX shm_open)
            </div>
            <p className="pm-insight-card-text">
              Kernel maps identical physical RAM into both virtual spaces. Reads/writes run at memory bus speed, but developers must synchronize with Mutexes to avoid race conditions.
            </p>
          </div>

          {/* Card 5: Worked Trace */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#c084fc]">
              <Terminal size={14} /> 5. WORKED TRACE: UNIX TERMINAL PIPE
            </div>
            <p className="pm-insight-card-text">
              Running <code>cat file | grep "404"</code> creates a kernel pipe. <code>cat</code> (PID 4100) writes stdout bytes; <code>grep</code> (PID 4101) reads stdin. OS blocks <code>grep</code> when buffer is empty.
            </p>
          </div>

          {/* Card 6: Chrome Isolation Gotcha */}
          <div className="pm-insight-card">
            <div className="pm-insight-card-header text-[#f43f5e]">
              <AlertCircle size={14} /> 6. BROWSER TAB CRASH ISOLATION
            </div>
            <p className="pm-insight-card-text">
              Modern browsers use IPC domain sockets to separate UI processes from untrusted web renderers. If a malicious script crashes a renderer tab, IPC keeps the browser alive!
            </p>
          </div>
        </div>

        {/* Checkpoint 4: In-line Question Form */}
        <div className="pm-interactive-frame">
          <div className="pm-interactive-frame-header">
            <span className="pm-frame-title text-[#10b981]">
              <Sparkles size={16} /> CHECKPOINT 04 : CONTEXT SWITCHING &amp; IPC EVALUATION
            </span>
            <span className="text-xs font-mono text-textMuted">Form Validation Active</span>
          </div>
          <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.context_ipc} />
        </div>

        {/* Action Button Card */}
        <div className="pm-action-btn-row">
          <Link to="/learn/process-management/quiz" className="pm-action-btn pm-action-btn-success">
            <span>Take Final Diagnostic Exam (12 Questions)</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Bottom Takeaway Bar */}
        <div className="pm-card-takeaway-bar">
          <CheckCircle2 size={16} className="text-[#1fd655] shrink-0" />
          <span>
            <strong>Summary:</strong> IPC bridges process isolation &mdash; choosing between message passing safety and shared memory speed is a foundational OS trade-off.
          </span>
        </div>
      </>
    ),
  },
];

const QUICK_TAG_FILTERS = [
  'All',
  'ELF',
  'PCB',
  '5-State',
  'fork',
  'Zombies',
  'Context',
  'IPC',
];

export default function ProcessManagementTheoryPage() {
  const { theme } = useTheme();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [perPage, setPerPage] = useState('all');
  const [page, setPage] = useState(1);
  const [activeTopicId, setActiveTopicId] = useState(TOPICS[0].id);

  const PER_PAGE_OPTIONS = [
    { value: 'all', label: 'Show All Topics' },
    { value: '2', label: '2 Topics / Page' },
    { value: '4', label: '4 Topics / Page' },
  ];

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleClearSearch() {
    setSearch('');
    setActiveTag('All');
    setPage(1);
  }

  function handleTagClick(tag) {
    setActiveTag(tag);
    if (tag === 'All') {
      setSearch('');
    } else {
      setSearch(tag.toLowerCase());
    }
    setPage(1);
  }

  function handlePerPageChange(value) {
    setPerPage(value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPage(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToTopic(topicId) {
    setActiveTopicId(topicId);
    const element = document.getElementById(topicId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Filter topics
  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return TOPICS;

    return TOPICS.filter((topic) => {
      const headingMatch = topic.heading.toLowerCase().includes(query);
      const tagMatch = topic.tags.some((t) => t.toLowerCase().includes(query));
      const phaseMatch = topic.phase.toLowerCase().includes(query);
      return headingMatch || tagMatch || phaseMatch;
    });
  }, [search]);

  // Pagination calculation
  let pageSize = filteredTopics.length;
  if (perPage === '2') {
    pageSize = 2;
  } else if (perPage === '4') {
    pageSize = 4;
  }
  if (pageSize === 0) pageSize = 1;

  const totalPages = Math.ceil(filteredTopics.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const visibleTopics = filteredTopics.slice(startIndex, startIndex + pageSize);

  // Scroll spy to highlight current topic in floating navigator
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTopicId(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    TOPICS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Hash jump support
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const targetIndex = filteredTopics.findIndex((t) => t.id === id);
      if (targetIndex !== -1 && perPage !== 'all') {
        const targetPage = Math.floor(targetIndex / pageSize) + 1;
        if (targetPage !== page) {
          setPage(targetPage);
          return;
        }
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash, location.key, filteredTopics, page, pageSize, perPage]);

  return (
    <div className={`pm-theory-page-wrapper ${theme || 'dark'}`}>
      {/* ==================================================================
          1. COMPACT PAGE HEADER (Starts directly into topics)
          ================================================================== */}
      <header className="pm-page-header">
        <div className="pm-header-top-row">
          <div className="pm-header-badge">
            <span className="pm-badge-dot" />
            <span>OS Kernel &bull; Process Management</span>
          </div>

          <div className="pm-header-links">
            <Link
              to="/learn/process-management/sandbox"
              className="pm-header-link-btn"
              title="Launch PCB & Process Simulator Sandbox"
            >
              <Cpu size={14} className="text-[#38bdf8]" />
              <span>Interactive Sandbox</span>
            </Link>

            <Link
              to="/learn/process-management/quiz"
              className="pm-header-link-btn"
              title="Take Evaluated Final Exam"
            >
              <Sparkles size={14} className="text-[#10b981]" />
              <span>Exam (12 Questions)</span>
            </Link>
          </div>
        </div>

        <div className="pm-header-title-wrap">
          <h1 className="pm-page-title">Process Management &amp; Concurrency</h1>
          <p className="pm-page-description">
            How the operating system kernel transforms static disk binaries into living memory processes, arbitrates CPU queues, and manages execution context.
          </p>
        </div>
      </header>

      {/* ==================================================================
          2. SEARCH & FILTER TOOLBAR (STICKY)
          ================================================================== */}
      <div className="pm-toolbar-sticky-container">
        <div className="pm-toolbar-card">
          <div className="pm-toolbar-row">
            <div className="pm-search-input-box">
              <Search size={15} className="pm-search-icon-left" />
              <input
                type="text"
                placeholder="Search topic by name, keyword, or tag (e.g. PCB, fork, zombie, IPC)..."
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="pm-search-clear-btn"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="pm-filter-controls">
              <span className="pm-filter-count">
                {filteredTopics.length} of {TOPICS.length} Topics
              </span>
              <CustomDropDown
                value={perPage}
                onChange={handlePerPageChange}
                options={PER_PAGE_OPTIONS}
              />
            </div>
          </div>

          {/* Quick Tag Filter Chips */}
          <div className="pm-tag-chips-row">
            <span className="text-[11px] font-mono text-textMuted mr-1">Quick Filter:</span>
            {QUICK_TAG_FILTERS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`pm-tag-chip ${activeTag === tag ? 'active' : ''}`}
              >
                {tag === 'All' ? 'All Topics' : `#${tag}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================================
          3. TOPIC MODULE CARDS (THE MAIN CONTENT)
          ================================================================== */}
      {visibleTopics.length === 0 ? (
        <div className="pm-empty-search-state">
          <AlertCircle size={32} className="text-[#f59e0b]" />
          <h3>No topics found matching &ldquo;{search}&rdquo;</h3>
          <p className="text-sm">Try clearing your search query or selecting a different filter chip.</p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="pm-action-btn pm-action-btn-primary mt-2"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        visibleTopics.map((topic) => (
          <article
            key={topic.id}
            id={topic.id}
            className="pm-topic-card"
          >
            {/* Topic Header Bar */}
            <header className="pm-topic-header">
              <div className="pm-topic-meta-row">
                <span
                  className="pm-topic-index-badge font-mono"
                  style={{
                    backgroundColor: `${topic.accentColor}15`,
                    color: topic.accentColor,
                    border: `1px solid ${topic.accentColor}35`,
                  }}
                >
                  Topic {topic.number} &bull; {topic.phase}
                </span>

                <div className="pm-topic-tags-group">
                  <span className="text-[11px] font-mono text-textMuted flex items-center gap-1 mr-1">
                    <Clock size={11} /> {topic.readTime}
                  </span>
                  {topic.tags.map((tag) => (
                    <span key={tag} className="pm-topic-tag-pill font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pm-topic-title-row">
                <div
                  className="pm-topic-icon-wrap"
                  style={{
                    borderColor: `${topic.accentColor}40`,
                  }}
                >
                  {topic.icon}
                </div>
                <div>
                  <h2 className="pm-topic-title">{topic.heading}</h2>
                  <p className="pm-topic-subtitle">
                    Core principles, operating system mechanics, and high-yield takeaways in cards.
                  </p>
                </div>
              </div>
            </header>

            {/* Structured Card Grid Content */}
            {topic.renderContent()}
          </article>
        ))
      )}

      {/* ==================================================================
          4. PAGINATION CONTROLS
          ================================================================== */}
      {totalPages > 1 && (
        <div className="pm-pagination-bar">
          <span className="pm-pagination-info">
            Showing Page {page} of {totalPages} ({filteredTopics.length} topics total)
          </span>

          <div className="pm-pagination-btn-group">
            <button
              type="button"
              className="pm-page-btn"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              &larr; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`pm-page-btn ${p === page ? 'active' : ''}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className="pm-page-btn"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================
          5. FLOATING QUICK CHAPTER NAVIGATOR PILL
          ================================================================== */}
      <div className="pm-floating-nav-pill">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => scrollToTopic(t.id)}
            className={`pm-pill-btn ${activeTopicId === t.id ? 'active' : ''}`}
            title={t.heading}
          >
            {t.number}. {t.shortTitle}
          </button>
        ))}

        <span className="pm-pill-divider" />

        <Link
          to="/learn/process-management/sandbox"
          className="pm-pill-btn"
          title="Open Process Simulator Sandbox"
        >
          Sandbox &rarr;
        </Link>
        <Link
          to="/learn/process-management/quiz"
          className="pm-pill-btn"
          title="Open Diagnostic Final Exam"
        >
          Exam &rarr;
        </Link>
      </div>
    </div>
  );
}
