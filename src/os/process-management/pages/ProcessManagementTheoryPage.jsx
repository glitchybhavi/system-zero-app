import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import CustomDropDown from '../../process-synchronization/base/CustomDropDown';
import StateTransitionDiagram from '../components/StateTransitionDiagram';
import SubtopicQuizForm from '../components/SubtopicQuizForm';
import { SUBTOPIC_QUIZZES } from '../data/processManagementQuizData';
import '../../process-synchronization/styles/ProcessSyncHub.css';
import './ProcessManagementTheoryPage.css';

const TOPICS = [
  {
    id: 'process-definition',
    heading: '1. Process Definition (Program vs. Process)',
    keywords: ['program', 'process', 'ram', 'stack', 'heap', 'text', 'binary', 'elf'],
    content: (
      <section key="process-definition" className="theory-section">
        <h2 id="process-definition">1. Process Definition (Program vs. Process)</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            A <strong>program</strong> is a passive collection of binary files resting on your hard drive, whereas a <strong>process</strong> is an active entity executing inside RAM with assigned CPU cycles, stack space, and memory pointers.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            Think of a program as a printed recipe sheet sitting inside a cookbook on a shelf. A process is the kitchen chef actively boiling water, measuring ingredients, and cooking the dish in real time.
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            When you execute a binary file, the OS performs three sequential initialization steps:
          </p>
          <ol className="mechanism-steps">
            <li><strong>Memory Allocation:</strong> The loader reads the ELF binary file header and allocates distinct memory segments in RAM: <em>Text/Code</em> (instructions), <em>Data</em> (global variables), <em>Heap</em> (dynamically allocated memory), and <em>Stack</em> (local variables & function call frames).</li>
            <li><strong>Register Context Setup:</strong> The OS initializes internal CPU registers, setting the <code>Instruction Pointer (IP)</code> or <code>Program Counter (PC)</code> to point to the entry point address of the executable.</li>
            <li><strong>PCB Registration:</strong> The kernel generates a unique Process Identifier (PID) and registers a Process Control Block (PCB) into the kernel process table.</li>
          </ol>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              Consider your web browser executable stored at <code>/usr/bin/google-chrome</code> on disk (a static 180MB program file). When clicked, the Linux kernel creates an active process assigned <code>PID 4092</code>. The OS allocates 850MB of RAM across Heap and Stack, opens 12 network socket file descriptors, and sets the Program Counter to memory address <code>0x7fff5fbff000</code>. Multiple separate windows spawn distinct child processes (e.g. <code>PID 4098</code>, <code>PID 4105</code>) running identical program binary code, but isolated within independent memory address spaces.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            Two separate processes can execute the exact same program binary simultaneously without interfering with each other. The OS uses Virtual Memory addressing so both processes believe they own the entire CPU memory address space, while physical RAM is safely partitioned by hardware.
          </p>
        </div>

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> A program is merely inert binary code stored on non-volatile disk, while a process is an active, living instance in RAM with dedicated CPU execution state and kernel tracking.
        </p>
      </section>
    ),
  },
  {
    id: 'pcb',
    heading: '2. The Process Control Block (PCB)',
    keywords: ['pcb', 'registers', 'task_struct', 'pid', 'program counter', 'state'],
    content: (
      <section key="pcb" className="theory-section">
        <h2 id="pcb">2. The Process Control Block (PCB)</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            The <strong>Process Control Block (PCB)</strong> is a critical kernel data structure that serves as the official passport and state record for a single process inside the operating system.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            Imagine a hospital medical chart pinned to a patient’s bed. It tracks the patient's ID, vital signs, current status (sleeping, in surgery), assigned doctor, and treatment history so any nurse taking over a shift knows the exact current condition.
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            In kernel space (e.g., Linux's <code>struct task_struct</code>), every PCB stores six vital data categories:
          </p>
          <div className="pcb-fields-grid">
            <div className="pcb-field-item">
              <span className="field-name font-mono">1. Identifier (PID)</span>
              <span className="field-desc">Unique integer (e.g., PID 1042) identifying the process to system calls.</span>
            </div>
            <div className="pcb-field-item">
              <span className="field-name font-mono">2. Process State</span>
              <span className="field-desc">Current state flag: READY, RUNNING, WAITING, ZOMBIE, etc.</span>
            </div>
            <div className="pcb-field-item">
              <span className="field-name font-mono">3. Program Counter (PC)</span>
              <span className="field-desc">Memory address of the very next machine instruction to be executed.</span>
            </div>
            <div className="pcb-field-item">
              <span className="field-name font-mono">4. CPU Registers</span>
              <span className="field-desc">Snapshot of accumulators, stack pointers (SP), and general-purpose registers (EAX, EBX).</span>
            </div>
            <div className="pcb-field-item">
              <span className="field-name font-mono">5. Memory Management Info</span>
              <span className="field-desc">Page table pointers, base/limit registers, and virtual address mapping boundaries.</span>
            </div>
            <div className="pcb-field-item">
              <span className="field-name font-mono">6. I/O & Accounting Info</span>
              <span className="field-desc">Open file descriptor array (FD table), CPU time consumed, priority weight.</span>
            </div>
          </div>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              When a backend web server script <code>node server.js</code> (PID 1042) is running, its PCB resides in protected kernel RAM at <code>task_struct</code> memory offset. When the OS temporarily pauses <code>node server.js</code> to run a security update, the CPU saves its register values (<code>RAX=0x05</code>, <code>RSP=0x7ffe4200</code>, <code>PC=0x004011a0</code>) directly into PID 1042's PCB. When PID 1042 is rescheduled onto CPU Core 2, the kernel reads PID 1042's PCB and restores those exact registers onto Core 2, resuming execution seamlessly.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            Because PCBs are stored strictly inside protected kernel space, user programs cannot modify their own PCB fields directly. Any change to process priority or file allocations must go through validated system calls (like <code>nice()</code> or <code>dup2()</code>).
          </p>
        </div>

        {/* Checkpoint 1: In-line Question Form for Process Concept & PCB */}
        <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.concept_pcb} />

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> The PCB is the central nervous system of process bookkeeping &mdash; without it, the operating system could never pause, reschedule, and resume processes without state corruption.
        </p>
      </section>
    ),
  },
  {
    id: 'process-states',
    heading: '3. Process States (5-State Model)',
    keywords: ['states', 'new', 'ready', 'running', 'waiting', 'blocked', 'terminated'],
    content: (
      <section key="process-states" className="theory-section">
        <h2 id="process-states">3. Process States (5-State Model)</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            During its lifecycle, a process transitions through five fundamental states depending on whether it has CPU execution time, is queued waiting for its turn, or is blocked waiting for slow I/O hardware.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            Consider a customer visiting a bank: Entering through the front door (<strong>New</strong>), standing in line behind the velvet rope (<strong>Ready</strong>), speaking directly with the teller (<strong>Running</strong>), stepping aside to fill out a paper loan form (<strong>Waiting/Blocked</strong>), and leaving through the exit door (<strong>Terminated</strong>).
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            The operating system maintains processes in distinct state queues managed by kernel schedulers:
          </p>
          <ul className="states-bullet-list">
            <li><strong style={{ color: '#a855f7' }}>NEW:</strong> The process is currently being created and initialized by system calls, but has not yet been admitted to the main executable Ready queue.</li>
            <li><strong style={{ color: '#38bdf8' }}>READY:</strong> The process has all necessary memory and resources allocated, residing in RAM waiting for the OS scheduler to assign it a CPU core.</li>
            <li><strong style={{ color: '#22c55e' }}>RUNNING:</strong> Machine instructions are actively executing on an actual physical CPU core. (On a 4-core system, at most 4 processes can be Running simultaneously).</li>
            <li><strong style={{ color: '#f59e0b' }}>WAITING (BLOCKED):</strong> The process cannot execute even if CPU cores are completely free, because it is waiting for an external event (e.g. disk read, socket packet arrival, timer).</li>
            <li><strong style={{ color: '#ef4444' }}>TERMINATED:</strong> The process has finished execution or was killed; its allocated RAM is freed, leaving only exit status metadata for parent inspection.</li>
          </ul>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              A Python script <code>python analyze.py</code> (PID 8120) opens a 2GB log file on disk. While executing calculations, PID 8120 is in the <strong>RUNNING</strong> state. When it calls <code>file.read()</code>, the kernel issues a hard disk controller command and transitions PID 8120 to <strong>WAITING</strong>. The CPU immediately switches to run another thread. 40ms later, the disk controller raises a hardware interrupt; the kernel moves PID 8120 to the <strong>READY</strong> queue. When the scheduler picks PID 8120, it returns to <strong>RUNNING</strong> to process the data buffer.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            A common novice mistake is assuming a blocked process consumes CPU while waiting for disk or network. In reality, a process in the <strong>WAITING</strong> state consumes zero CPU cycles — the OS completely removes it from CPU scheduling queues until an explicit hardware interrupt wakes it up.
          </p>
        </div>

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> State queues guarantee that CPU cores are never stalled idling on high-latency I/O operations when other computational work is ready to proceed.
        </p>
      </section>
    ),
  },
  {
    id: 'state-diagram',
    heading: '4. State Transition Diagram',
    keywords: ['transition', 'diagram', 'preemption', 'interrupt', 'dispatch', 'lifecycle'],
    content: (
      <section key="state-diagram" className="theory-section">
        <h2 id="state-diagram">4. State Transition Diagram</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            The State Transition Diagram maps out every valid path a process can take between the five kernel states, driven by explicit triggers such as scheduler dispatches, hardware timer interrupts, and I/O system calls.
          </p>
        </div>

        {/* Embedded Interactive State Diagram */}
        <StateTransitionDiagram />

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            A process can <strong>never</strong> move directly from <em>WAITING</em> to <em>RUNNING</em>. When an I/O event completes, the process must first re-enter the <em>READY</em> queue so the CPU scheduler can evaluate its priority against other active tasks.
          </p>
        </div>

        {/* Checkpoint 2: In-line Question Form for Process States & Lifecycle */}
        <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.states_lifecycle} />

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> State transitions are strictly event-driven &mdash; triggered by scheduler dispatches, clock interrupts, and hardware I/O completions.
        </p>
      </section>
    ),
  },
  {
    id: 'fork-exec',
    heading: '5. Process Creation (fork & exec)',
    keywords: ['fork', 'exec', 'cow', 'copy on write', 'clone', 'createprocess'],
    content: (
      <section key="fork-exec" className="theory-section">
        <h2 id="fork-exec">5. Process Creation (fork & exec)</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            In POSIX operating systems (Linux/macOS), new processes are created through a two-step mechanism: <code>fork()</code> duplicates the current calling process, while <code>exec()</code> overwrites that child process with a brand new program binary.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            <code>fork()</code> is like cloning a worker along with their current notepad and office key. <code>exec()</code> is like handing that cloned worker a completely new set of blueprints and instructions, replacing their old memory entirely.
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            The mechanics of process creation follow an exact system call protocol:
          </p>
          <ol className="mechanism-steps">
            <li>
              <strong><code>fork()</code> System Call:</strong> The kernel allocates a new PCB and duplicate memory page tables for the child. <code>fork()</code> returns twice: returning <code>0</code> inside the new child process, and returning the new child's <code>PID</code> inside the parent process.
            </li>
            <li>
              <strong>Copy-On-Write (COW) Optimization:</strong> To keep <code>fork()</code> blazingly fast, physical memory pages are not immediately copied. Both parent and child share identical read-only physical RAM pages until either process attempts to write data, at which point only that specific 4KB page is copied.
            </li>
            <li>
              <strong><code>execvp()</code> System Call:</strong> The child process invokes <code>execvp("/bin/ls", args)</code>. The kernel wipes the child's old address space (code/stack) and loads the new <code>ls</code> binary into memory, preserving the existing PID and open file descriptors.
            </li>
          </ol>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              When you type <code>ls -l</code> inside a Bash terminal (PID 1200), Bash calls <code>fork()</code>. The kernel creates child PID 1201 (an exact copy of Bash). Child PID 1201 checks the <code>fork()</code> return value (0) and immediately calls <code>execvp("/bin/ls")</code>. The kernel replaces PID 1201's code segment with the <code>ls</code> binary. Parent Bash (PID 1200) calls <code>waitpid(1201)</code> to sleep until the child finishes listing directory files.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            Windows uses a single <code>CreateProcess()</code> system call that combines creation and program loading in one step, whereas Unix deliberately split it into <code>fork()</code> and <code>exec()</code> so parent processes can modify I/O redirection (like <code>&gt; output.txt</code> pipes) between the two calls!
          </p>
        </div>

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> Splitting creation into fork() and exec() gives Unix systems the elegance to configure descriptors, pipes, and environment variables prior to running untrusted binaries.
        </p>
      </section>
    ),
  },
  {
    id: 'termination',
    heading: '6. Process Termination (Zombie & Orphan Processes)',
    keywords: ['zombie', 'orphan', 'exit', 'wait', 'init', 'systemd', 'defunct'],
    content: (
      <section key="termination" className="theory-section">
        <h2 id="termination">6. Process Termination (Zombie & Orphan Processes)</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            When a process completes its final statement or calls <code>exit()</code>, the kernel reclaims its physical memory, but keeps its PCB in an exit state until the parent process reads its exit status code.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            A <strong>Zombie process</strong> is like an employee who left the company, but their name is still on HR's payroll ledger until the manager signs off on the exit paperwork. An <strong>Orphan process</strong> is a child whose parent manager left the company first; the company CEO (init/systemd PID 1) automatically steps in as their guardian manager.
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            The termination sequence creates two distinct system conditions depending on timing:
          </p>
          <div className="term-types-grid">
            <div className="term-type-card">
              <h4 className="term-card-title font-mono" style={{ color: '#f59e0b' }}>🧟 ZOMBIE PROCESSES</h4>
              <p>
                When a child calls <code>exit(0)</code>, all its RAM, open files, and stack are freed immediately. However, its PCB entry remains in the kernel Process Table with state <code>ZOMBIE</code> (or <code>DEFUNCT</code>) holding its return status code. When the parent calls <code>wait()</code>, the status is harvested and the zombie PCB slot is finally removed. If a parent fails to call <code>wait()</code>, zombie entries accumulate in the OS table.
              </p>
            </div>
            <div className="term-type-card">
              <h4 className="term-card-title font-mono" style={{ color: '#38bdf8' }}>👶 ORPHAN PROCESSES</h4>
              <p>
                If a parent process dies or terminates <em>before</em> its child process finishes, the child becomes an Orphan. The operating system kernel automatically re-parents all orphan processes to the root <code>systemd</code> or <code>init</code> process (PID 1). PID 1 periodically executes <code>wait()</code> to reap orphan children when they eventually exit, preventing long-term zombies.
              </p>
            </div>
          </div>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              A custom Python script (PID 3000) spawns worker process (PID 3001) to download a file. Worker PID 3001 finishes and calls <code>exit(0)</code>. If script PID 3000 is stuck in an infinite loop without calling <code>wait()</code>, running <code>ps aux</code> shows PID 3001 as <code>&lt;defunct&gt;</code> (Zombie). If PID 3000 crashes, PID 3001 is immediately adopted by <code>systemd</code> (PID 1), which calls <code>wait()</code> and cleans up its PCB slot.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            Zombie processes consume <strong>zero CPU cycles and zero RAM memory</strong> (code/stack). However, because the OS Process Table has a fixed maximum size (e.g. 32,768 PIDs), thousands of un-reaped zombie processes can prevent new programs from starting!
          </p>
        </div>

        {/* Checkpoint 3: In-line Question Form for fork/exec, Zombies & Orphans */}
        <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.creation_termination} />

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> Failure to harvest return codes with wait() leaks kernel table slots, while init adoption shields modern kernels from stranded orphan tasks.
        </p>
      </section>
    ),
  },
  {
    id: 'context-switching',
    heading: '7. Context Switching Overhead',
    keywords: ['context switch', 'registers', 'tlb', 'overhead', 'thrashing', 'quantum'],
    content: (
      <section key="context-switching" className="theory-section">
        <h2 id="context-switching">7. Context Switching Overhead</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            A <strong>context switch</strong> is the OS mechanism of storing the current execution state of a running process on a CPU core and restoring the saved state of another process, enabling multi-tasking on limited CPU hardware.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            Imagine a chef working on two dishes at once. Before switching from making pasta to baking a cake, the chef writes down the exact oven timer and flour weight on a sticky note, puts away the pasta tools, wipes down the counter, and pulls out the cake recipe and whisk.
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            During a context switch, the kernel executes five low-level steps:
          </p>
          <ol className="mechanism-steps">
            <li><strong>Interrupt Trigger:</strong> A hardware timer interrupt fires (e.g. Round Robin time slice expired) or process calls a blocking system call. The CPU switches from User Mode (Ring 3) to Kernel Mode (Ring 0).</li>
            <li><strong>Save State:</strong> The kernel pushes current CPU hardware registers (Program Counter, Stack Pointer, General Purpose Registers) into Process A’s PCB inside kernel RAM.</li>
            <li><strong>Update PCB State:</strong> Process A's state is changed from RUNNING to READY (or WAITING).</li>
            <li><strong>Select & Load State:</strong> The scheduler algorithm picks Process B from the Ready Queue. The kernel updates CPU page table base registers (CR3 register) to point to Process B’s virtual memory space and loads Process B’s register values from PCB B onto CPU registers.</li>
            <li><strong>Resume Execution:</strong> The CPU switches back to User Mode and resumes executing Process B at its saved Program Counter instruction.</li>
          </ol>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              On a system running Spotify (PID 500) and VS Code (PID 900), the OS scheduler allocates a 20ms time slice. When Spotify's 20ms ends, the hardware timer interrupt triggers a context switch on CPU Core 0. The kernel spends 2.5 microseconds saving Spotify's registers, flushing Translation Lookaside Buffer (TLB) memory caches, loading VS Code's page table pointers, and restoring VS Code's stack pointer. VS Code runs for the next 20ms slice seamlessly.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            Context switching represents <strong>pure administrative overhead</strong> — zero useful user program code runs while the OS switches state. Frequent context switching (caused by tiny time quanta) leads to <em>thrashing</em>, where the CPU spends more time switching state than executing actual programs!
          </p>
        </div>

        <div className="theory-action-box">
          <Link to="/learn/process-management/sandbox" className="theory-visualize-btn">
            <span>Inspect CPU Context Switching in Sandbox</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> Schedulers must tune time quanta to strike a balance between system interactivity and wasted CPU cycles spent on register/TLB cache invalidations.
        </p>
      </section>
    ),
  },
  {
    id: 'ipc-basics',
    heading: '8. Inter-Process Communication (IPC)',
    keywords: ['ipc', 'shared memory', 'message passing', 'pipe', 'mutex', 'socket'],
    content: (
      <section key="ipc-basics" className="theory-section">
        <h2 id="ipc-basics">8. Inter-Process Communication (IPC)</h2>

        <div className="pm-tier-box tier-basics">
          <div className="tier-header">
            <span className="tier-icon">💡</span>
            <span className="tier-label font-mono">THE BASICS</span>
          </div>
          <p className="tier-text">
            Because operating systems strictly isolate the memory address space of every process for security, processes must use <strong>Inter-Process Communication (IPC)</strong> mechanisms provided by the kernel to exchange data.
          </p>
          <div className="analogy-callout">
            <span className="analogy-badge">Analogy:</span>
            <strong>Message Passing</strong> is like sending sealed letters through a post office mailbox (safe, structured, verified by the postmaster). <strong>Shared Memory</strong> is like two coworkers writing on a shared office whiteboard (blazingly fast, direct access, but requires manual coordination so they don't erase each other's words).
          </div>
        </div>

        <div className="pm-tier-box tier-mechanism">
          <div className="tier-header">
            <span className="tier-icon">⚙️</span>
            <span className="tier-label font-mono">HOW IT ACTUALLY WORKS</span>
          </div>
          <p className="tier-text">
            Operating systems offer two fundamental architectural models for IPC:
          </p>

          <div className="ipc-models-grid">
            <div className="ipc-model-card">
              <h4 className="ipc-card-title font-mono">1. MESSAGE PASSING (Pipes, Sockets, Queues)</h4>
              <p>
                Processes communicate via system calls (<code>send()</code> and <code>receive()</code>). Data is copied from Process A's user space into kernel memory buffers, and then copied from kernel memory into Process B's address space.
              </p>
              <ul className="ipc-card-list">
                <li><strong>Pros:</strong> Safe, clean synchronization managed automatically by the kernel.</li>
                <li><strong>Cons:</strong> Slower due to context switching and memory copy overhead on every message.</li>
              </ul>
            </div>

            <div className="ipc-model-card">
              <h4 className="ipc-card-title font-mono">2. SHARED MEMORY (POSIX shm_open)</h4>
              <p>
                Both processes request the kernel map a shared physical RAM region directly into their respective virtual address spaces. Once established, processes read and write data directly to memory without calling the kernel.
              </p>
              <ul className="ipc-card-list">
                <li><strong>Pros:</strong> Maximum performance (speed of memory bus).</li>
                <li><strong>Cons:</strong> Requires application developers to build synchronization locks (Mutexes/Semaphores) to avoid race conditions.</li>
              </ul>
            </div>
          </div>

          <div className="worked-example">
            <div className="worked-example-title font-mono">CONCRETE WORKED EXAMPLE:</div>
            <p>
              When you run <code>cat access.log | grep "404"</code> in your Linux terminal, the shell creates an anonymous IPC <strong>Pipe</strong> (Message Passing). Process 1 (<code>cat</code>, PID 4100) writes stdout bytes into the kernel pipe buffer. Process 2 (<code>grep</code>, PID 4101) reads stdin from that same kernel pipe buffer. The OS handles buffering and blocks <code>grep</code> if the pipe buffer becomes temporarily empty.
            </p>
          </div>
        </div>

        <div className="pm-tier-box tier-goodtoknow">
          <div className="tier-header">
            <span className="tier-icon">📌</span>
            <span className="tier-label font-mono">GOOD TO KNOW</span>
          </div>
          <p className="tier-text">
            Modern microbrowser architectures (like Chrome or Firefox) use IPC Unix domain sockets to separate the main UI process from untrusted web page rendering processes. If a malicious script crashes a renderer process, IPC isolation prevents the main browser application from crashing!
          </p>
        </div>

        {/* Checkpoint 4: In-line Question Form for Context Switching & IPC */}
        <SubtopicQuizForm quizData={SUBTOPIC_QUIZZES.context_ipc} />

        <div className="theory-action-box" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/learn/process-management/quiz"
            className="theory-visualize-btn"
            style={{
              borderColor: 'rgba(52, 211, 153, 0.4)',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
            }}
          >
            <span>Take Final Diagnostic Exam (12 Questions)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <p className="theory-conclusion">
          <strong>Conclusion:</strong> IPC bridges the deliberate isolation between processes &mdash; choosing between message passing safety and shared memory speed is a foundational OS architecture trade-off.
        </p>
      </section>
    ),
  },
];

export default function ProcessManagementTheoryPage() {
  const { theme } = useTheme();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState('all');
  const [page, setPage] = useState(1);

  const PER_PAGE_OPTIONS = [
    { value: 'all', label: 'Show All' },
    { value: '2', label: '2 Topics / Page' },
    { value: '4', label: '4 Topics / Page' },
  ];

  // Updates the search field and resets the page to 1 
  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleClearSearch() {
    setSearch('');
    setPage(1);
  }

  // window.scrollTo() -> Helps to go to page top when we change the per page topic 
  function handlePerPageChange(value) {
    setPerPage(value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPage(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filteredTopics = [];
  const query = search.toLowerCase();
  for (let i = 0; i < TOPICS.length; i++) {
    const headingMatch = TOPICS[i].heading.toLowerCase().includes(query);
    const keywordMatch = TOPICS[i].keywords && TOPICS[i].keywords.some((k) => k.includes(query));
    if (headingMatch || keywordMatch) {
      filteredTopics.push(TOPICS[i]);
    }
  }

  let pageSize = filteredTopics.length;
  if (perPage === '2') {
    pageSize = 2;
  } else if (perPage === '4') {
    pageSize = 4;
  }
  if (pageSize === 0) {
    pageSize = 1;
  }

  // ceil -> returns the smallest integer greater than or equal 
  const totalPages = Math.ceil(filteredTopics.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleSections = [];
  for (let i = startIndex; i < endIndex && i < filteredTopics.length; i++) {
    visibleSections.push(filteredTopics[i].content);
  }

  // helps to jump to a topic when url contains a hash
  useEffect(() => {
    if (location.hash !== '') {
      const sectionId = location.hash.slice(1);

      // Found the topic in the filtered list 
      let foundIndex = -1;
      for (let i = 0; i < filteredTopics.length; i++) {
        if (filteredTopics[i].id === sectionId) {
          foundIndex = i;
          break;
        }
      }

      // floor -> returns the greatest integer ( use when topics split across pages )
      if (foundIndex !== -1 && perPage !== 'all') {
        const targetPage = Math.floor(foundIndex / pageSize) + 1;
        // If topic is not on the page , react then render that page 
        if (targetPage !== page) {
          setPage(targetPage);
          return;
        }
      }

      // makes the searched topic scoll to top 
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash, location.key, page, perPage, pageSize, filteredTopics]);

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    let btnClass = 'theory-page-btn';
    if (i === page) {
      btnClass = 'theory-page-btn active';
    }
    pageButtons.push(
      <button
        key={i}
        type="button"
        className={btnClass}
        onClick={() => goToPage(i)}
      >
        {i}
      </button>
    );
  }

  let sectionsContent = visibleSections;
  if (visibleSections.length === 0) {
    sectionsContent = (
      <div className="theory-empty-state">
        No topics found matching &ldquo;{search}&rdquo;.
      </div>
    );
  }

  let paginationComponent = null;
  if (totalPages > 1) {
    paginationComponent = (
      <div className="theory-pagination">
        <span className="theory-page-info">
          Page {page} of {totalPages} ({filteredTopics.length} topics)
        </span>
        <div className="theory-page-buttons">
          {/*  button to go to previous page  */}
          <button
            type="button"
            className="theory-page-btn"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
            {/* Button to go to the next page */}
          </button>
          {pageButtons}
          <button
            type="button"
            className="theory-page-btn"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`theory-page-container ${theme || 'dark'}`}>
      <article className="theory-article">
        <header className="theory-article-header">
          <h1>Process Management &amp; Concurrency</h1>
          <p className="theory-subtitle">
            An overview of process concepts, memory layout, PCB tracking,
            5-state lifecycle transitions, process creation with fork/exec, and IPC mechanisms.
          </p>
        </header>

        <div className="theory-toolbar">
          <div className="theory-search-wrapper">
            <input
              type="text"
              className="theory-search-input"
              placeholder="Search topic..."
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <div className="clearSearch">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="theory-filter-group">
            <label htmlFor="topics-per-page">Topics per page:</label>
            <CustomDropDown
              value={perPage}
              onChange={handlePerPageChange}
              options={PER_PAGE_OPTIONS}
            />
          </div>
        </div>

        {sectionsContent}

        {paginationComponent}
      </article>
    </div>
  );
}
