// Question banks for individual Process Management subtopics and collective final exam

export const SUBTOPIC_QUIZZES = {
  // Topic 1: Process Concept & PCB
  concept_pcb: {
    id: 'concept_pcb',
    title: 'Checkpoint 1: Process Concept & PCB Check',
    description: 'Verify your understanding of memory layout, program vs process, and PCB structures.',
    questions: [
      {
        id: 'cp_1',
        question: 'What is the fundamental difference between a program and a process?',
        options: [
          { id: 'a', text: 'A program is passive code on disk, while a process is an active instance running in RAM with allocated resources.', isCorrect: true, explanation: 'Correct! A program is binary code on secondary storage. When loaded and executing in RAM with CPU registers, it becomes a process.' },
          { id: 'b', text: 'A program runs in kernel mode, while a process runs in BIOS mode.', isCorrect: false, explanation: 'Incorrect. Both user programs and processes operate under OS kernel privilege boundaries.' },
          { id: 'c', text: 'A program can have multiple PIDs, but a process has no PID.', isCorrect: false, explanation: 'Incorrect. Static programs have no PID; running processes are assigned unique PIDs by the kernel.' }
        ]
      },
      {
        id: 'cp_2',
        question: 'Which process memory segment stores local variables and nested function return addresses?',
        options: [
          { id: 'a', text: 'Text/Code Segment', isCorrect: false, explanation: 'The Text segment stores read-only compiled machine code instructions.' },
          { id: 'b', text: 'Heap Segment', isCorrect: false, explanation: 'The Heap is reserved for dynamic memory allocated via malloc() or new.' },
          { id: 'c', text: 'Stack Segment', isCorrect: true, explanation: 'Correct! The Stack grows and shrinks dynamically to store stack frames, local variables, and return pointers.' }
        ]
      },
      {
        id: 'cp_3',
        question: 'Why can user-space applications NOT directly overwrite their own PCB (Process Control Block)?',
        options: [
          { id: 'a', text: 'PCBs are stored in read-only optical disks.', isCorrect: false, explanation: 'PCBs reside in high-speed RAM, not optical storage.' },
          { id: 'b', text: 'PCBs reside in protected kernel memory space and can only be modified through authorized system calls.', isCorrect: true, explanation: 'Correct! Direct user modification of PCBs would allow processes to forge administrative privileges or steal other processes’ memory.' },
          { id: 'c', text: 'PCBs are deleted as soon as a process enters the Ready state.', isCorrect: false, explanation: 'PCBs exist throughout the entire lifecycle of a process until it is fully reaped.' }
        ]
      }
    ]
  },

  // Topic 2: Process States & Lifecycle
  states_lifecycle: {
    id: 'states_lifecycle',
    title: 'Checkpoint 2: 5-State Model & Transition Check',
    description: 'Test your grasp of Ready, Running, and Waiting queues and state transition rules.',
    questions: [
      {
        id: 'st_1',
        question: 'Can a process move directly from the WAITING (Blocked) state to the RUNNING state?',
        options: [
          { id: 'a', text: 'Yes, if the CPU core is idle, it jumps straight to Running.', isCorrect: false, explanation: 'No. The kernel scheduler must always evaluate the process against other queued ready processes first.' },
          { id: 'b', text: 'No, it must first enter the READY queue so the CPU scheduler can allocate it a CPU core.', isCorrect: true, explanation: 'Correct! When an I/O event finishes, the process transitions to READY, awaiting scheduler dispatch.' },
          { id: 'c', text: 'Only on Windows systems, never on Linux.', isCorrect: false, explanation: 'Both POSIX and Windows kernels enforce the Ready queue staging requirement.' }
        ]
      },
      {
        id: 'st_2',
        question: 'How much CPU computing power does a process consume while in the WAITING state for disk I/O?',
        options: [
          { id: 'a', text: '50% of the active CPU core capacity.', isCorrect: false, explanation: 'Waiting processes do not busy-wait on modern operating systems.' },
          { id: 'b', text: 'Zero CPU cycles — the OS completely removes it from the CPU dispatcher until a hardware interrupt occurs.', isCorrect: true, explanation: 'Correct! The kernel deschedules the process, allowing other tasks to use 100% of the CPU while disk I/O proceeds.' },
          { id: 'c', text: 'Full CPU cycles via continuous polling.', isCorrect: false, explanation: 'Interrupt-driven OS architectures avoid busy polling.' }
        ]
      },
      {
        id: 'st_3',
        question: 'What triggers a transition from the RUNNING state back to the READY state?',
        options: [
          { id: 'a', text: 'A hardware timer interrupt indicating the process’s CPU time quantum has expired.', isCorrect: true, explanation: 'Correct! In preemptive scheduling (like Round Robin), an expired time slice returns the process to Ready.' },
          { id: 'b', text: 'A call to exit().', isCorrect: false, explanation: 'Calling exit() transitions the process to Terminated.' },
          { id: 'c', text: 'A request to read a file from secondary storage.', isCorrect: false, explanation: 'An I/O request transitions the process to the Waiting (Blocked) state.' }
        ]
      }
    ]
  },

  // Topic 3: Process Creation, Zombies & Orphans
  creation_termination: {
    id: 'creation_termination',
    title: 'Checkpoint 3: Process Operations (fork, exec, Zombies & Orphans)',
    description: 'Verify your knowledge of fork(), Copy-on-Write, zombie reaping, and orphan adoption.',
    questions: [
      {
        id: 'ct_1',
        question: 'What return value does fork() produce inside the newly created child process?',
        options: [
          { id: 'a', text: 'The PID of the parent process.', isCorrect: false, explanation: 'The parent PID is retrieved using getppid(), not from the fork() return value.' },
          { id: 'b', text: '0 (Zero)', isCorrect: true, explanation: 'Correct! fork() returns 0 inside the child process, and returns the child’s new PID inside the parent process.' },
          { id: 'c', text: '-1 (Negative one)', isCorrect: false, explanation: '-1 indicates that fork() failed to create a process.' }
        ]
      },
      {
        id: 'ct_2',
        question: 'What is the Copy-on-Write (COW) optimization used during fork()?',
        options: [
          { id: 'a', text: 'Parent and child share the same physical RAM pages as read-only until either writes to a page.', isCorrect: true, explanation: 'Correct! COW avoids duplicating entire gigabytes of memory during fork() until an actual write operation occurs.' },
          { id: 'b', text: 'The OS writes the entire RAM contents to disk before allowing the child to run.', isCorrect: false, explanation: 'That would be swap paging, which is slow and unrelated to COW.' },
          { id: 'c', text: 'The child process is prohibited from writing to any memory address.', isCorrect: false, explanation: 'The child can write freely; writing simply triggers a page-fault copy of that specific page.' }
        ]
      },
      {
        id: 'ct_3',
        question: 'What is a "Zombie" process in POSIX operating systems?',
        options: [
          { id: 'a', text: 'A process that runs in an infinite loop consuming 100% CPU.', isCorrect: false, explanation: 'That is an infinite loop or runaway process, not a zombie.' },
          { id: 'b', text: 'A terminated child whose parent has not yet called wait() to harvest its exit code.', isCorrect: true, explanation: 'Correct! Its memory is freed, but its PCB slot is retained until the parent reads its exit status.' },
          { id: 'c', text: 'A process whose parent terminated before it did.', isCorrect: false, explanation: 'That is an Orphan process, which is adopted by PID 1 (init/systemd).' }
        ]
      }
    ]
  },

  // Topic 4: Context Switching & IPC
  context_ipc: {
    id: 'context_ipc',
    title: 'Checkpoint 4: Context Switching & IPC Check',
    description: 'Test your understanding of hardware context switches and Inter-Process Communication.',
    questions: [
      {
        id: 'ci_1',
        question: 'Why is context switching described as "pure computational overhead"?',
        options: [
          { id: 'a', text: 'Because during register saving and state restoration, zero user program code is executing.', isCorrect: true, explanation: 'Correct! The CPU spends microseconds swapping registers and flushing caches rather than advancing application tasks.' },
          { id: 'b', text: 'Because it permanently damages CPU registers.', isCorrect: false, explanation: 'Registers are designed to be updated continuously at clock speed without hardware degradation.' },
          { id: 'c', text: 'Because it only occurs when an error crashes the operating system.', isCorrect: false, explanation: 'Context switches happen hundreds of times per second as normal multitasking.' }
        ]
      },
      {
        id: 'ci_2',
        question: 'What is the primary trade-off when using Shared Memory IPC compared to Message Passing?',
        options: [
          { id: 'a', text: 'Shared Memory is slower, but requires no synchronization.', isCorrect: false, explanation: 'Shared memory is much faster than message passing.' },
          { id: 'b', text: 'Shared Memory provides maximum bus-speed performance, but requires programmers to handle locks/mutexes.', isCorrect: true, explanation: 'Correct! There is no kernel copy overhead, but concurrent writes without mutexes lead to race conditions.' },
          { id: 'c', text: 'Shared Memory only works over Ethernet networks.', isCorrect: false, explanation: 'Shared memory requires processes to reside on the same physical motherboard RAM.' }
        ]
      },
      {
        id: 'ci_3',
        question: 'What occurs when the CPU scheduling quantum is set excessively small (e.g., 0.1ms)?',
        options: [
          { id: 'a', text: 'Programs run at hardware light speed.', isCorrect: false, explanation: 'Programs actually slow down significantly.' },
          { id: 'b', text: 'Thrashing occurs: the CPU spends more time switching register contexts than executing instructions.', isCorrect: true, explanation: 'Correct! Excessive switching wastes significant CPU percentages on context switch overhead.' },
          { id: 'c', text: 'The OS runs out of PIDs.', isCorrect: false, explanation: 'Time quanta affect scheduling duration, not PID allocation.' }
        ]
      }
    ]
  }
};

// Comprehensive Collective Final Exam Questions (~12 questions)
export const COLLECTIVE_FINAL_EXAM = [
  {
    id: 'fe_1',
    topic: 'Process Concept',
    question: 'Why does the OS kernel assign isolated virtual memory ranges to each spawned PCB?',
    options: [
      { id: 'a', text: 'To accelerate CPU clock frequency on multi-core processors.', isCorrect: false, explanation: 'CPU clock speed is a hardware property and unrelated to virtual memory isolation.' },
      { id: 'b', text: 'To prevent one buggy or malicious process from corrupting another process’s code, stack, and heap.', isCorrect: true, explanation: 'Correct! Hardware MMU page tables guarantee process isolation so one faulting program cannot overwrite another.' },
      { id: 'c', text: 'To avoid generating unique Process Identifiers (PIDs).', isCorrect: false, explanation: 'PIDs are kernel integer identifiers allocated independently of memory ranges.' },
      { id: 'd', text: 'To force all programs to run single-threaded.', isCorrect: false, explanation: 'Virtual memory supports both single-threaded and multi-threaded processes.' }
    ]
  },
  {
    id: 'fe_2',
    topic: 'Memory Segments',
    question: 'Where is memory allocated when a program executes `malloc(1024)` in C or `new Object()` in JavaScript?',
    options: [
      { id: 'a', text: 'Text Segment', isCorrect: false, explanation: 'The text segment holds machine instructions and is read-only.' },
      { id: 'b', text: 'Heap Segment', isCorrect: true, explanation: 'Correct! Dynamic runtime memory allocations are served from the process Heap.' },
      { id: 'c', text: 'Stack Segment', isCorrect: false, explanation: 'The stack stores local variables with automatic storage duration.' },
      { id: 'd', text: 'ROM BIOS', isCorrect: false, explanation: 'ROM BIOS is hardware motherboard firmware.' }
    ]
  },
  {
    id: 'fe_3',
    topic: 'Process Control Block',
    question: 'Which of the following data elements is NOT stored inside a Process Control Block (PCB)?',
    options: [
      { id: 'a', text: 'Program Counter (PC)', isCorrect: false, explanation: 'The PC is stored in the PCB so the CPU knows which instruction to resume.' },
      { id: 'b', text: 'CPU Register States (Accumulators, Stack Pointer)', isCorrect: false, explanation: 'Registers are saved in the PCB during context switches.' },
      { id: 'c', text: 'The physical serial number of the computer’s power supply unit.', isCorrect: true, explanation: 'Correct! The PCB only tracks process execution state, memory tables, accounting, and file descriptors.' },
      { id: 'd', text: 'List of open file descriptors', isCorrect: false, explanation: 'The file descriptor table is tracked directly in the PCB.' }
    ]
  },
  {
    id: 'fe_4',
    topic: 'Lifecycle States',
    question: 'A process that is ready to execute but waiting for CPU allocation is in which state?',
    options: [
      { id: 'a', text: 'WAITING', isCorrect: false, explanation: 'Waiting processes are blocked waiting on external I/O or events.' },
      { id: 'b', text: 'READY', isCorrect: true, explanation: 'Correct! Ready processes are waiting in the Ready queue for the scheduler to dispatch them.' },
      { id: 'c', text: 'NEW', isCorrect: false, explanation: 'New processes are currently undergoing initialization and have not entered the Ready queue.' },
      { id: 'd', text: 'TERMINATED', isCorrect: false, explanation: 'Terminated processes have concluded execution.' }
    ]
  },
  {
    id: 'fe_5',
    topic: 'State Transitions',
    question: 'What transition occurs when a process calls `scanf()` or `fetch()` and pauses waiting for user input?',
    options: [
      { id: 'a', text: 'Running ➔ Waiting', isCorrect: true, explanation: 'Correct! The process cannot continue until input arrives, transitioning from Running to Waiting.' },
      { id: 'b', text: 'Running ➔ Ready', isCorrect: false, explanation: 'Running to Ready occurs due to timer preemption or voluntary yield, not blocking I/O.' },
      { id: 'c', text: 'Ready ➔ Terminated', isCorrect: false, explanation: 'A process cannot terminate directly from the Ready queue.' },
      { id: 'd', text: 'Waiting ➔ Running', isCorrect: false, explanation: 'A process must go through Ready before Running.' }
    ]
  },
  {
    id: 'fe_6',
    topic: 'Process Operations',
    question: 'How do Unix-based operating systems create a new program execution workflow?',
    options: [
      { id: 'a', text: 'By calling fork() to duplicate the parent, followed by exec() to replace code with the new binary.', isCorrect: true, explanation: 'Correct! The fork-exec pattern is the foundational creation paradigm in Unix/Linux systems.' },
      { id: 'b', text: 'By rebooting the CPU core.', isCorrect: false, explanation: 'Rebooting is an emergency recovery action, not process creation.' },
      { id: 'c', text: 'By directly altering BIOS CMOS memory.', isCorrect: false, explanation: 'CMOS memory stores motherboard hardware configurations.' },
      { id: 'd', text: 'By calling wait() before allocating memory.', isCorrect: false, explanation: 'wait() is called by parents to reap exited children.' }
    ]
  },
  {
    id: 'fe_7',
    topic: 'Zombie Processes',
    question: 'What keeps a Zombie process present in the kernel process table?',
    options: [
      { id: 'a', text: 'The parent process has not called wait() to collect the child’s exit status.', isCorrect: true, explanation: 'Correct! The OS preserves the minimal PCB entry so the parent can inspect whether the child succeeded or crashed.' },
      { id: 'b', text: 'The child process refused to release its RAM memory.', isCorrect: false, explanation: 'All child RAM is freed immediately upon exit(); only the PCB metadata remains.' },
      { id: 'c', text: 'A network socket is still streaming data.', isCorrect: false, explanation: 'Open sockets are automatically closed by the kernel when a process terminates.' },
      { id: 'd', text: 'The CPU scheduler crashed.', isCorrect: false, explanation: 'The scheduler is unaffected by zombie status.' }
    ]
  },
  {
    id: 'fe_8',
    topic: 'Orphan Processes',
    question: 'What happens to an Orphan process when its parent terminates before it does?',
    options: [
      { id: 'a', text: 'The kernel sends SIGKILL to immediately terminate it.', isCorrect: false, explanation: 'Orphan processes continue executing normally.' },
      { id: 'b', text: 'It is adopted by PID 1 (init / systemd), which serves as its new parent and reaps it upon exit.', isCorrect: true, explanation: 'Correct! PID 1 adopts orphaned processes to guarantee they are reaped properly when they finish.' },
      { id: 'c', text: 'It takes over the parent’s PID.', isCorrect: false, explanation: 'PIDs are strictly immutable and never inherited.' },
      { id: 'd', text: 'Its memory is transferred to the BIOS.', isCorrect: false, explanation: 'Memory remains safely in system RAM.' }
    ]
  },
  {
    id: 'fe_9',
    topic: 'Context Switching',
    question: 'What constitutes the direct computational cost (overhead) during a Context Switch?',
    options: [
      { id: 'a', text: 'Saving active registers/PC to the old PCB, loading new registers, and suffering cache/TLB misses.', isCorrect: true, explanation: 'Correct! The CPU spends non-productive administrative cycles saving and swapping state.' },
      { id: 'b', text: 'Recompiling the source code of the incoming binary.', isCorrect: false, explanation: 'Executables in memory are already compiled machine code.' },
      { id: 'c', text: 'Zero time cost — modern CPUs perform instantaneous context switches with no overhead.', isCorrect: false, explanation: 'Context switching always incurs microsecond overhead and cache penalty.' },
      { id: 'd', text: 'Writing the whole operating system to secondary disk storage.', isCorrect: false, explanation: 'The OS remains resident in RAM.' }
    ]
  },
  {
    id: 'fe_10',
    topic: 'CPU Scheduling',
    question: 'In Round Robin (RR) scheduling, what happens when a process’s assigned time quantum expires?',
    options: [
      { id: 'a', text: 'The process is killed by the kernel.', isCorrect: false, explanation: 'The process is simply preempted and placed at the tail of the Ready queue.' },
      { id: 'b', text: 'A timer interrupt triggers a context switch, moving the process from RUNNING to READY.', isCorrect: true, explanation: 'Correct! The kernel preempts the process, giving the next task in the Ready queue its turn.' },
      { id: 'c', text: 'The process enters the WAITING state.', isCorrect: false, explanation: 'A process only enters Waiting when blocked on I/O or an event.' },
      { id: 'd', text: 'The priority of the process increases to maximum.', isCorrect: false, explanation: 'Time quantum expiration does not increase priority.' }
    ]
  },
  {
    id: 'fe_11',
    topic: 'IPC Mechanisms',
    question: 'Why does Shared Memory provide higher throughput than Message Passing pipes?',
    options: [
      { id: 'a', text: 'Shared Memory avoids copying data back and forth through kernel memory buffers.', isCorrect: true, explanation: 'Correct! Both processes read/write directly to common RAM at bus speed without system call copies.' },
      { id: 'b', text: 'Shared Memory uses fiber-optic CPU cables.', isCorrect: false, explanation: 'Both mechanisms operate on standard silicon hardware.' },
      { id: 'c', text: 'Message passing does not support integers.', isCorrect: false, explanation: 'Message passing supports all arbitrary binary and textual data.' },
      { id: 'd', text: 'Shared memory automatically guarantees zero race conditions.', isCorrect: false, explanation: 'Shared memory requires manual mutex locking to prevent race conditions.' }
    ]
  },
  {
    id: 'fe_12',
    topic: 'Concurrency & Locks',
    question: 'What occurs if two processes write to a shared memory segment simultaneously without Mutex synchronization?',
    options: [
      { id: 'a', text: 'A Race Condition, resulting in corrupted or inconsistent data.', isCorrect: true, explanation: 'Correct! Without mutual exclusion, interleaved writes produce unpredictable data corruption.' },
      { id: 'b', text: 'The hardware motherboard catches fire.', isCorrect: false, explanation: 'Hardware is not damaged by concurrent memory writes.' },
      { id: 'c', text: 'The OS automatically translates the writes into JSON.', isCorrect: false, explanation: 'The OS does not format unmanaged memory writes.' },
      { id: 'd', text: 'Both processes are promoted to kernel administrator privileges.', isCorrect: false, explanation: 'Privilege escalation does not occur from unsynchronized writes.' }
    ]
  }
];
