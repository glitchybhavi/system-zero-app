import "../styles/ProcessSyncHub.css";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  X,
  Layers,
  Cpu,
  AlertTriangle,
  ShieldCheck,
  Zap,
  RefreshCw,
  Lock,
  Activity,
  Workflow,
  Timer,
} from "lucide-react";
import CustomDropDown from "../base/CustomDropDown";

const TOPICS = [
  {
    id: "concurrency",
    index: "01",
    title: "Concurrency",
    heading: "1. Concurrency",
    content: (
      <section key="concurrency" id="concurrency" className="theory-section">
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 01</span>
            <h2 className="theory-card-title">Concurrency</h2>
          </div>
          <p className="theory-card-lead">
            Multiple instruction sequences executing within the same time window,
            interleaving execution on CPU cores to keep operating systems responsive while introducing shared-memory hazards.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Layers size={14} /></span>
              <span className="theory-subcard-label">Structure vs Hardware</span>
            </div>
            <p className="theory-subcard-body">
              <strong>Concurrency is an architectural structure</strong>—allowing multiple tasks to make progress on a single core via rapid context switching. <span className="gradient-text-highlight">Parallelism is physical execution</span> across multiple hardware execution cores simultaneously.
            </p>
          </div>

          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Cpu size={14} /></span>
              <span className="theory-subcard-label">Interleaved Execution</span>
            </div>
            <p className="theory-subcard-body">
              The CPU scheduler alternates between threads at sub-millisecond intervals. This makes systems feel instant—downloading files, rendering pages, and responding to inputs concurrently.
            </p>
          </div>

          <div className="theory-subcard accent-amber">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><AlertTriangle size={14} /></span>
              <span className="theory-subcard-label">Shared State Hazard</span>
            </div>
            <p className="theory-subcard-body">
              When concurrent threads read and write identical memory locations without coordination, overlapping read-modify-write sequences lead to non-deterministic race conditions.
            </p>
          </div>

          <div className="theory-subcard accent-emerald">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><ShieldCheck size={14} /></span>
              <span className="theory-subcard-label">Synchronization Mandate</span>
            </div>
            <p className="theory-subcard-body">
              Process synchronization provides mathematical invariants and locking protocols that guarantee data consistency and determinism under arbitrary scheduling orders.
            </p>
          </div>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> Concurrency lets an OS make progress on many things at once, but the moment those tasks share data, correctness stops being automatic &mdash; it must be engineered.
        </div>
      </section>
    ),
  },
  {
    id: "threads-and-thread-scheduling",
    index: "02",
    title: "Threads & Thread Scheduling",
    heading: "2. Threads & Thread Scheduling",
    content: (
      <section
        key="threads-and-thread-scheduling"
        id="threads-and-thread-scheduling"
        className="theory-section"
      >
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 02</span>
            <h2 className="theory-card-title">Threads &amp; Thread Scheduling</h2>
          </div>
          <p className="theory-card-lead">
            Lightweight execution streams that share the parent process address space, dramatically slashing creation and context-switch costs compared to heavy processes.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-lime">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Zap size={14} /></span>
              <span className="theory-subcard-label">Light-Weight Processes</span>
            </div>
            <p className="theory-subcard-body">
              Threads share address space, open file descriptors, and global heap. Each thread maintains only its private Program Counter (PC), CPU registers, and stack memory.
            </p>
          </div>

          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><RefreshCw size={14} /></span>
              <span className="theory-subcard-label">Fast Context Switching</span>
            </div>
            <p className="theory-subcard-body">
              Unlike a full process switch, thread switching avoids invalidating virtual memory address translation tables (TLB). Cache lines remain warm, making switching exceptionally fast.
            </p>
          </div>

          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Layers size={14} /></span>
              <span className="theory-subcard-label">Thread Control Block</span>
            </div>
            <p className="theory-subcard-body">
              The OS kernel tracks each thread through a <strong>Thread Control Block (TCB)</strong>, storing state snapshots when context-switching across time-slice quanta or I/O blocks.
            </p>
          </div>

          <div className="theory-subcard accent-pink">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Cpu size={14} /></span>
              <span className="theory-subcard-label">Single vs Multi-CPU</span>
            </div>
            <p className="theory-subcard-body">
              On a single CPU, multi-threading cannot increase raw computation speed since threads still time-share one core. Its true advantages are responsive UI and asynchronous I/O overlap.
            </p>
          </div>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> Threads provide a cheap, fast way to perform concurrent tasks, but that speed originates from shared memory &mdash; the exact vector for critical section conflicts.
        </div>
      </section>
    ),
  },
  {
    id: "the-critical-section-problem-and-race-conditions",
    index: "03",
    title: "The Critical Section Problem & Race Conditions",
    heading: "3. The Critical Section Problem & Race Conditions",
    content: (
      <section
        key="the-critical-section-problem-and-race-conditions"
        id="the-critical-section-problem-and-race-conditions"
        className="theory-section"
      >
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 03</span>
            <h2 className="theory-card-title">
              The Critical Section Problem &amp; Race Conditions
            </h2>
          </div>
          <p className="theory-card-lead">
            Uncontrolled concurrent execution inside shared code blocks leads to timing anomalies, corrupted memory structures, and non-deterministic application crashes.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-pink">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Lock size={14} /></span>
              <span className="theory-subcard-label">Critical Section (C.S.)</span>
            </div>
            <p className="theory-subcard-body">
              The code segment where threads manipulate shared resources (tables, variables, files). Preemption inside this window leaves shared state partially mutated and corrupted.
            </p>
          </div>

          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Activity size={14} /></span>
              <span className="theory-subcard-label">Race Condition Anomaly</span>
            </div>
            <p className="theory-subcard-body">
              Occurs when two threads race to modify shared data simultaneously. The final value depends unpredictably on scheduler timing slices, creating elusive, transient software bugs.
            </p>
          </div>

          <div className="theory-subcard accent-amber">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><AlertTriangle size={14} /></span>
              <span className="theory-subcard-label">Naive Flag Failure</span>
            </div>
            <p className="theory-subcard-body">
              Simple software flags cannot prevent races. Testing a flag and setting it are two separate instructions; an interruption between them triggers the exact race condition being guarded.
            </p>
          </div>

          <div className="theory-subcard accent-emerald">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><ShieldCheck size={14} /></span>
              <span className="theory-subcard-label">Formal Solution Invariants</span>
            </div>
            <p className="theory-subcard-body">
              A correct solution must satisfy: <strong>Mutual Exclusion</strong> (only one in C.S.), <strong>Progress</strong> (no deadlock among contending threads), and <strong>Bounded Waiting</strong> (no starvation).
            </p>
          </div>
        </div>

        <div className="theory-action-box">
          <Link to="/os/sync/race-condition" className="theory-visualize-btn">
            <span>Visualize Race Condition Concept</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> Any code that reads-then-writes shared data is a critical section in disguise, and any interleaving of two such sections is an impending race condition.
        </div>
      </section>
    ),
  },
  {
    id: "petersons-solution",
    index: "04",
    title: "Peterson's Solution",
    heading: "4. Peterson's Solution",
    content: (
      <section
        key="petersons-solution"
        id="petersons-solution"
        className="theory-section"
      >
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 04</span>
            <h2 className="theory-card-title">Peterson&apos;s Solution</h2>
          </div>
          <p className="theory-card-lead">
            An algorithmic milestone proving that mutual exclusion between two processes can be achieved purely in software using standard memory variables without hardware instructions.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Workflow size={14} /></span>
              <span className="theory-subcard-label">Dual Control Variables</span>
            </div>
            <p className="theory-subcard-body">
              Combines boolean array <code>flag[2]</code> (indicating interest in entering the critical section) with an integer <code>turn</code> (indicating whose turn it is when both contend).
            </p>
          </div>

          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><RefreshCw size={14} /></span>
              <span className="theory-subcard-label">Polite Yielding Protocol</span>
            </div>
            <p className="theory-subcard-body">
              Before entering, process <em>i</em> sets <code>flag[i] = true</code> and politely assigns <code>turn = j</code>. It waits only while process <em>j</em> is interested and holds the turn.
            </p>
          </div>

          <div className="theory-subcard accent-emerald">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><ShieldCheck size={14} /></span>
              <span className="theory-subcard-label">Invariants Satisfied</span>
            </div>
            <p className="theory-subcard-body">
              Guarantees mutual exclusion (both processes cannot simultaneously enter), progress (an idle process cannot block an active one), and bounded waiting (turn strictly alternates).
            </p>
          </div>

          <div className="theory-subcard accent-amber">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><AlertTriangle size={14} /></span>
              <span className="theory-subcard-label">Two-Process Limitation</span>
            </div>
            <p className="theory-subcard-body">
              The algorithm holds strictly for 2 processes. Scaling to N processes (e.g., Lamport&apos;s Bakery) is complex and inefficient, driving modern systems to hardware atomic primitives.
            </p>
          </div>
        </div>

        <div className="theory-action-box">
          <Link to="/os/sync/peterson" className="theory-visualize-btn">
            <span>Visualize Peterson&apos;s Solution Concept</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> Peterson&apos;s solution proves mutual exclusion is possible with plain variables, but its 2-process limit is why production systems standardize on mutexes and semaphores.
        </div>
      </section>
    ),
  },
  {
    id: "mutex-locks",
    index: "05",
    title: "Mutex Locks",
    heading: "5. Mutex Locks",
    content: (
      <section key="mutex-locks" id="mutex-locks" className="theory-section">
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 05</span>
            <h2 className="theory-card-title">Mutex Locks</h2>
          </div>
          <p className="theory-card-lead">
            Hardware-supported binary locking primitives that enforce mutual exclusion across any number of concurrent threads via strict acquire and release semantics.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Lock size={14} /></span>
              <span className="theory-subcard-label">Acquire & Release</span>
            </div>
            <p className="theory-subcard-body">
              A thread must acquire the lock before entering the critical section and release it upon exit. Exactly one thread holds ownership at any given moment.
            </p>
          </div>

          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Cpu size={14} /></span>
              <span className="theory-subcard-label">Hardware Atomicity</span>
            </div>
            <p className="theory-subcard-body">
              Built on CPU instructions like Test-and-Set or Compare-and-Swap, executing uninterruptibly within a single clock cycle to eliminate software race conditions.
            </p>
          </div>

          <div className="theory-subcard accent-amber">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Timer size={14} /></span>
              <span className="theory-subcard-label">Spinning Contention</span>
            </div>
            <p className="theory-subcard-body">
              Spinlocks leave waiting threads busy-waiting in a loop, burning CPU cycles. If a thread dies while holding a lock, waiting threads enter indefinite hangs.
            </p>
          </div>

          <div className="theory-subcard accent-pink">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><AlertTriangle size={14} /></span>
              <span className="theory-subcard-label">Deadlocks & Starvation</span>
            </div>
            <p className="theory-subcard-body">
              Acquiring multiple locks in inconsistent orders leads to circular wait deadlocks. Unfair scheduling can also starve lower-priority threads indefinitely.
            </p>
          </div>
        </div>

        <div className="theory-action-box">
          <Link to="/os/sync/mutex" className="theory-visualize-btn">
            <span>Visualize Mutex Locks Concept</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> A mutex is the cleanest tool for &ldquo;one-at-a-time&rdquo; access, but its busy-waiting overhead motivated the creation of blocking semaphores.
        </div>
      </section>
    ),
  },
  {
    id: "semaphores",
    index: "06",
    title: "Semaphores (Counting & Binary)",
    heading: "6. Semaphores (Counting & Binary)",
    content: (
      <section key="semaphores" id="semaphores" className="theory-section">
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 06</span>
            <h2 className="theory-card-title">Semaphores (Counting &amp; Binary)</h2>
          </div>
          <p className="theory-card-lead">
            Integer-based signaling mechanisms that control access to finite resource pools and eliminate CPU spin-waste by transitioning blocked threads into kernel sleep queues.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Lock size={14} /></span>
              <span className="theory-subcard-label">Binary Semaphore</span>
            </div>
            <p className="theory-subcard-body">
              Restricted to values 0 and 1, functioning identically to a mutual exclusion lock to guarantee single-thread access to a critical section.
            </p>
          </div>

          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Layers size={14} /></span>
              <span className="theory-subcard-label">Counting Semaphore</span>
            </div>
            <p className="theory-subcard-body">
              Spans an unrestricted integer domain, coordinating access across a pool of N interchangeable resource instances (e.g., database connections or memory buffers).
            </p>
          </div>

          <div className="theory-subcard accent-amber">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Timer size={14} /></span>
              <span className="theory-subcard-label">Kernel Block Protocol</span>
            </div>
            <p className="theory-subcard-body">
              When <code>wait()</code> finds count &le; 0, the thread does not spin: it calls <code>block()</code>, suspending itself into a sleep queue so the CPU runs other ready work.
            </p>
          </div>

          <div className="theory-subcard accent-lime">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Zap size={14} /></span>
              <span className="theory-subcard-label">Wakeup Signaling</span>
            </div>
            <p className="theory-subcard-body">
              When a thread releases resources via <code>signal()</code>, the kernel increments the counter and triggers <code>wakeup()</code>, moving a sleeping thread back to the CPU Ready queue.
            </p>
          </div>
        </div>

        <div className="theory-action-box">
          <Link to="/os/sync/semaphore" className="theory-visualize-btn">
            <span>Visualize Semaphores Concept</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> Semaphores generalize mutexes to N-resource pools and eliminate wasted CPU cycles through kernel-level block and wakeup coordination.
        </div>
      </section>
    ),
  },
  {
    id: "conditional-variables",
    index: "07",
    title: "Conditional Variables",
    heading: "7. Conditional Variables",
    content: (
      <section
        key="conditional-variables"
        id="conditional-variables"
        className="theory-section"
      >
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 07</span>
            <h2 className="theory-card-title">Conditional Variables</h2>
          </div>
          <p className="theory-card-lead">
            Synchronization constructs enabling threads to sleep safely until application state predicates become true, eliminating polling loops and lock contention.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Lock size={14} /></span>
              <span className="theory-subcard-label">Lock Pairing</span>
            </div>
            <p className="theory-subcard-body">
              Condition variables never act alone; they are always coupled with an associated mutex lock protecting the shared boolean state condition.
            </p>
          </div>

          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Workflow size={14} /></span>
              <span className="theory-subcard-label">Atomic Release & Wait</span>
            </div>
            <p className="theory-subcard-body">
              Calling <code>wait()</code> atomically releases the mutex and places the thread into sleep, preventing deadlocks that would occur if the thread held the lock while sleeping.
            </p>
          </div>

          <div className="theory-subcard accent-emerald">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><RefreshCw size={14} /></span>
              <span className="theory-subcard-label">Wakeup Re-Acquisition</span>
            </div>
            <p className="theory-subcard-body">
              Upon notification via <code>signal()</code>, the sleeping thread wakes up and automatically re-acquires the mutex lock before continuing execution in its critical section.
            </p>
          </div>

          <div className="theory-subcard accent-pink">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><ShieldCheck size={14} /></span>
              <span className="theory-subcard-label">Zero-Contention Sleep</span>
            </div>
            <p className="theory-subcard-body">
              Because sleeping threads release their lock, producer threads can acquire the mutex, update state, and emit notifications without fighting for lock ownership.
            </p>
          </div>
        </div>

        <div className="theory-conclusion">
          <strong>Conclusion:</strong> Condition variables complete the toolkit: mutexes grant exclusive ownership, semaphores meter resource pools, and condition variables permit efficient predicate waits.
        </div>
      </section>
    ),
  },
  {
    id: "conclusion",
    index: "08",
    title: "Putting It All Together",
    heading: "8. Putting It All Together",
    content: (
      <section key="conclusion" id="conclusion" className="theory-section">
        <div className="theory-card-header-bar">
          <div className="theory-card-title-row">
            <span className="theory-card-pill">MODULE 08</span>
            <h2 className="theory-card-title">Putting It All Together</h2>
          </div>
          <p className="theory-card-lead">
            An architectural taxonomy for selecting synchronization primitives based on resource pool size, contention profile, and notification semantics.
          </p>
        </div>

        <div className="theory-subcard-grid">
          <div className="theory-subcard accent-cyan">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Workflow size={14} /></span>
              <span className="theory-subcard-label">Peterson&apos;s Solution</span>
            </div>
            <p className="theory-subcard-body">
              Pure software mutual exclusion benchmark for exactly 2 processes. Demonstrates turn-taking and intent-signaling theory without hardware instructions.
            </p>
          </div>

          <div className="theory-subcard accent-indigo">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Lock size={14} /></span>
              <span className="theory-subcard-label">Mutex Locks</span>
            </div>
            <p className="theory-subcard-body">
              Fast, hardware-backed exclusive single-thread access. Optimal for protecting brief, non-blocking critical sections where contention is low.
            </p>
          </div>

          <div className="theory-subcard accent-amber">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Layers size={14} /></span>
              <span className="theory-subcard-label">Semaphores</span>
            </div>
            <p className="theory-subcard-body">
              Multi-instance resource pool coordinator with kernel block/wakeup queues. Optimal for database connection pools and bounded-buffer producer-consumers.
            </p>
          </div>

          <div className="theory-subcard accent-lime">
            <div className="theory-subcard-header">
              <span className="theory-subcard-icon"><Timer size={14} /></span>
              <span className="theory-subcard-label">Condition Variables</span>
            </div>
            <p className="theory-subcard-body">
              Event-driven notification construct paired with a lock. Optimal when threads must wait for arbitrary boolean predicates rather than simple counters.
            </p>
          </div>
        </div>

        <div className="theory-conclusion">
          <strong>Key takeaway:</strong> Every synchronization primitive exists to answer the same question &mdash; how do we let threads share resources without letting scheduling unpredictability corrupt data?
        </div>
      </section>
    ),
  },
];

export default function ProcessSyncHub() {

    useEffect(() => {
    document.title = "System Zero | Process Synchronization Hub"; 

    return () => {
      document.title = "System Zero | Interactive Computer Architecture and OS Simulator";
    }
  }, []);

  const location = useLocation();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState("all");
  const [page, setPage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          const maxScroll = 120;
          const progress = Math.min(1, Math.max(0, y / maxScroll));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const PER_PAGE_OPTIONS = [
    { value: "all", label: "Show All" },
    { value: "2", label: "2 Topics / Page" },
    { value: "4", label: "4 Topics / Page" },
  ];

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleClearSearch() {
    setSearch("");
    setPage(1);
  }

  function handlePerPageChange(event) {
    setPerPage(event.target.value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPage(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredTopics = [];
  const query = search.toLowerCase();
  for (let i = 0; i < TOPICS.length; i++) {
    const matchesHeading = TOPICS[i].heading.toLowerCase().includes(query);
    const matchesTitle = TOPICS[i].title.toLowerCase().includes(query);
    const matchesIndex = TOPICS[i].index.toLowerCase().includes(query);
    if (matchesHeading || matchesTitle || matchesIndex) {
      filteredTopics.push(TOPICS[i]);
    }
  }

  let pageSize = filteredTopics.length;
  if (perPage === "2") {
    pageSize = 2;
  } else if (perPage === "4") {
    pageSize = 4;
  }
  if (pageSize === 0) {
    pageSize = 1;
  }

  const totalPages = Math.ceil(filteredTopics.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleSections = [];
  for (let i = startIndex; i < endIndex && i < filteredTopics.length; i++) {
    visibleSections.push(filteredTopics[i].content);
  }

  useEffect(() => {
    if (location.hash !== "") {
      const sectionId = location.hash.slice(1);

      let foundIndex = -1;
      for (let i = 0; i < filteredTopics.length; i++) {
        if (filteredTopics[i].id === sectionId) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1 && perPage !== "all") {
        const targetPage = Math.floor(foundIndex / pageSize) + 1;
        if (targetPage !== page) {
          setPage(targetPage);
          return;
        }
      }

      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash, location.key, page, perPage, pageSize, filteredTopics]);

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    let btnClass = "theory-page-btn";
    if (i === page) {
      btnClass = "theory-page-btn active";
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
          <button
            type="button"
            className="theory-page-btn"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
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

  const titleScale = 1 - scrollProgress * 0.18;
  const titleTranslateY = -scrollProgress * 2;
  const subtitleOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  const subtitleMaxHeight = `${Math.round((1 - scrollProgress) * 56)}px`;
  const subtitleTranslateY = -scrollProgress * 6;
  const headerPaddingBottom = `${Math.round(14 - scrollProgress * 14)}px`;
  const headerMarginBottom = `${Math.round(14 - scrollProgress * 14)}px`;
  const stickyGap = `${Math.round(16 - scrollProgress * 8)}px`;
  const stickyPaddingTop = `${Math.round(18 - scrollProgress * 8)}px`;
  const stickyPaddingBottom = `${Math.round(22 - scrollProgress * 6)}px`;

  return (
    <div className="theory-page-container psync-hub">
      <article className="theory-article">
        <div
          className={`theory-sticky-header ${scrollProgress > 0.05 ? "is-stuck" : ""}`}
          style={{
            paddingTop: stickyPaddingTop,
            paddingBottom: stickyPaddingBottom,
            gap: stickyGap,
          }}
        >
          <header
            className="theory-article-header"
            style={{
              paddingBottom: headerPaddingBottom,
              marginBottom: headerMarginBottom,
            }}
          >
            <h1
              style={{
                transform: `scale(${titleScale}) translateY(${titleTranslateY}px)`,
              }}
            >
              Process Synchronization &amp; Concurrency
            </h1>
            <p
              className="theory-subtitle"
              style={{
                opacity: subtitleOpacity,
                maxHeight: subtitleMaxHeight,
                transform: `translateY(${subtitleTranslateY}px)`,
                pointerEvents: scrollProgress > 0.8 ? "none" : "auto",
              }}
            >
              An overview of concurrent execution, race conditions,
              synchronization primitives, and mutual exclusion mechanisms.
            </p>
          </header>

          <div className="theory-toolbar">
            <div className="theory-search-wrapper">
              <Search size={16} className="theory-search-icon" />
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
                onChange={(val) => {
                  setPerPage(val);
                  setPage(1);
                }}
                options={PER_PAGE_OPTIONS}
              />
            </div>
          </div>
        </div>

        {sectionsContent}

        {paginationComponent}
      </article>
    </div>
  );
}
