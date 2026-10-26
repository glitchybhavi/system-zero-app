# Masterclass: Storage & Disk Scheduling Architecture vs. The 4 React Rubrics
**Project:** *System Zero* (`src/storage/disk/`)  
**Target Reading Time:** 45 – 60 Minutes  
**Target Evaluation:** Course Component 2 Evaluation (Excellent Tier: 19–25 / 25)

---

## Table of Contents
1. [Module Architecture Overview: The 5 Disk Storage Files](#1-module-architecture-overview-the-5-disk-storage-files)
2. [Rubric 1: React-Navigation Layout & Page Structure](#2-rubric-1-react-navigation-layout--page-structure)
   - *2.1 Route Declaration & Ecosystem Connectivity*
   - *2.2 Page Hierarchy, Section Anatomy & Anchor Navigation*
   - *2.3 Scroll Restoration & Viewport State Synchronization*
   - *2.4 Code Walkthrough: Navigation Mechanics*
3. [Rubric 2: Context API & State Architecture in React Apps](#3-rubric-2-context-api--state-architecture-in-react-apps)
   - *3.1 Container vs. Presentational Component Pattern*
   - *3.2 Single Source of Truth & Unidirectional Data Flow*
   - *3.3 High-Performance Derived State via `useMemo`*
   - *3.4 Asynchronous Animation Timers & Cleanup with `useEffect`*
   - *3.5 Global Context Integration (Theme & Auth)*
4. [Rubric 3: Intro to Redux Toolkit (Pedagogical Bridge & Implementation)](#4-rubric-3-intro-to-redux-toolkit-pedagogical-bridge--implementation)
   - *4.1 How System Zero Implements Redux Toolkit*
   - *4.2 Architectural Comparison: Local Container State vs. Redux Toolkit*
   - *4.3 Step-by-Step Refactor: Modeling Disk Scheduling as an RTK Slice*
   - *4.4 Cross-Slice ExtraReducers & Action Stream Analysis*
   - *4.5 Evaluator Defense: When to Use Redux vs. React State*
5. [Rubric 4: Form Handling in React](#5-rubric-4-form-handling-in-react)
   - *5.1 Controlled vs. Uncontrolled Form Elements*
   - *5.2 Range Sliders, Dynamic Clamping & Number Coercion*
   - *5.3 Discrete Option Toggles as Custom Accessible Radio Groups*
   - *5.4 Defensive Input Sanitization & Queue Parsing*
   - *5.5 Building an Interactive Custom Queue Form with Live Validation*
6. [The 6 Disk Scheduling Algorithms: Mathematical & OS Theory](#6-the-6-disk-scheduling-algorithms-mathematical--os-theory)
   - *6.1 FCFS & SSTF (Greedy Starvation)*
   - *6.2 SCAN & C-SCAN (Elevator & Unserviced Return)*
   - *6.3 LOOK & C-LOOK (Optimized Boundary Reversal)*
   - *6.4 Total Head Movement (THM) & Seek Latency Equations*
7. [Viva & Evaluation Defense: 10 Tough Questions & Exemplary Answers](#7-viva--evaluation-defense-10-tough-questions--exemplary-answers)

---

## 1. Module Architecture Overview: The 5 Disk Storage Files

The `src/storage/disk/` module simulates an Operating System's Secondary Storage Controller and Magnetic Disk Actuator. In computer architecture, physical disk I/O is thousands of times slower than main memory (RAM). The operating system must intelligently reorder pending cylinder read/write requests to minimize the physical traversal of the mechanical read/write head across the disk platters.

The module is decomposed into **5 specialized files**, strictly adhering to the **Separation of Concerns (SoC)** principle:

```
src/storage/disk/
├── diskAlgorithms.js     # Pure algorithmic engine (OS scheduling mathematics, no React dependencies)
├── DiskSchedulingPage.jsx # Root Container/Controller (State orchestrator, route target, layout shell)
├── DiskControlsCard.jsx   # Form & control panel (Controlled inputs, presets, stepper buttons)
├── DiskPlatter3D.jsx      # Visual 3D Actuator simulator (SVG + CSS 3D perspective transforms)
└── DiskSeekChart.jsx      # Traversal trajectory canvas (Dynamic SVG polyline graph & metrics)
```

### Responsibility Breakdown
1. **`diskAlgorithms.js` (Pure JS Model):**
   - Contains pure, deterministic functions implementing 6 classical OS disk scheduling algorithms: **FCFS**, **SSTF**, **SCAN**, **C-SCAN**, **LOOK**, and **C-LOOK**.
   - Accepts raw parameters: `(algorithm, requestQueue, startHead, direction)`.
   - Returns calculated metrics: ordered sequence, discrete execution steps, `totalDistance` (Total Head Movement / THM), and `avgDistance`.
2. **`DiskSchedulingPage.jsx` (Smart Container Component):**
   - Holds the **Single Source of Truth** for the entire module (`algorithm`, `queue`, `head`, `direction`, `currentStepIndex`, `isAutoPlaying`, `isSeeking`).
   - Derives algorithmic solutions reactively using `useMemo`.
   - Manages playback intervals via `useEffect` with strict cleanup.
   - Renders the global `<Navbar />`, `<Footer />`, Hero section, and mounts child visualizers.
3. **`DiskControlsCard.jsx` (Interactive Presentational Form):**
   - Receives state and updater callbacks as props.
   - Provides controlled form inputs: range slider, algorithm grid selector, preset buttons, and sweep direction toggles.
   - Provides playback trigger controls: manual step, auto-play, and reset.
4. **`DiskPlatter3D.jsx` (Hardware Actuator Presenter):**
   - Renders a 3D isometric hard drive platter assembly using CSS 3D transforms (`rotateX(52deg) rotateZ(-22deg)`).
   - Maps cylinder track numbers $[0, 199]$ to concentric radial SVG circles and computes the physical pivot angle ($14^\circ \text{ to } 44^\circ$) of the mechanical actuator arm.
5. **`DiskSeekChart.jsx` (Analytical Trajectory Visualizer):**
   - Generates an SVG polyline showing the head's zigzag seek trajectory across cylinders over time.
   - Highlights serviced checkpoints and computes real-time cumulative seek costs.

---

## 2. Rubric 1: React-Navigation Layout & Page Structure
*Rubric Standard: "Demonstrate a deep understanding of React Navigation layout and page structure."*

### 2.1 Route Declaration & Ecosystem Connectivity
In React Single Page Applications (SPAs), navigation is declarative. The storage module is integrated directly into the root routing tree of `System Zero` in `src/App.jsx`:

```jsx
// src/App.jsx
import DiskSchedulingPage from './storage/disk/DiskSchedulingPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/arch/isa" element={<IsaDesignPage />} />
            {/* Phase 04 Storage Route */}
            <Route path="/os/disk" element={<DiskSchedulingPage />} />
            <Route path="/os/sync/*" element={<ProcessSync />} />
            <Route path="/learn/process-management/*" element={<ProcessManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
```

#### Ecosystem Linkages:
- **Navbar Curriculum Mega-Menu:** In `src/landingPage/curriculumData.js`, Topic 6 declares:
  ```javascript
  { id: 6, title: "Storage & Disk Scheduling", link: "/os/disk" }
  ```
  Hovering over `Curriculum` in `src/landingPage/Navbar.jsx` renders an accessible `<Link to="/os/disk">`.
- **Landing Page Accordion Deck:** In `src/landingPage/CurriculumCards.jsx`, clicking the "Storage & Disk Scheduling" card invokes programmatic navigation via `useNavigate`:
  ```javascript
  onClick={() => { if (card.link) navigate(card.link); }}
  ```

### 2.2 Page Hierarchy, Section Anatomy & Anchor Navigation
`DiskSchedulingPage.jsx` establishes a structured 3-tier architectural layout:

```
┌──────────────────────────────────────────────────────────────┐
│ Navbar (Sticky Header: Logo, Mega Menu, Theme Toggle, Auth)  │
├──────────────────────────────────────────────────────────────┤
│ 1. HERO PHASE CARD ([ PHASE 04 : STORAGE SYSTEMS ])          │
│    - Title, Subtitle, Educational Bottleneck Theory Cards     │
│    - In-page Quick Anchors: [LAB 1 (#platter)] [LAB 2 (#trajectory)]
├──────────────────────────────────────────────────────────────┤
│ 2. SECTION 1: LAB 1 WORKBENCH (#platter)                     │
│    ┌───────────────────────────┬───────────────────────────┐  │
│    │ DiskControlsCard (Form)   │ DiskPlatter3D (Actuator)  │  │
│    └───────────────────────────┴───────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ 3. SECTION 2: LAB 2 TRAJECTORY & BENCHMARK (#trajectory)     │
│    - Traversal Trajectory SVG Polyline Chart                 │
│    - Comparative Benchmark Grid (FCFS vs SSTF vs SCAN etc.) │
├──────────────────────────────────────────────────────────────┤
│ Footer (Repository Links, Team Credits)                      │
└──────────────────────────────────────────────────────────────┘
```

#### In-Page Anchor Smooth Scrolling:
The Hero section includes quick anchor navigation chips:
```jsx
<a href="#platter" className="...">LAB 1: 3D ACTUATOR & PLATTER ASSEMBLY</a>
<a href="#trajectory" className="...">LAB 2: TRAVERSAL TRAJECTORY CHART</a>
```
The browser smoothly scrolls the user directly to the target lab section without unmounting components or disrupting ongoing playback state.

### 2.3 Scroll Restoration & Viewport State Synchronization
When users navigate to `/os/disk` from the landing page, the browser's default behavior might retain the scroll position of the previous page. In `DiskSchedulingPage.jsx`:
```jsx
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}, []);
```
Combined with the global `ScrollToTop` listener in `src/App.jsx`, this ensures that every page transition starts from the top of the viewport.

---

## 3. Rubric 2: Context API & State Architecture in React Apps
*Rubric Standard: "Demonstrate an excellent command of Context API and State architecture in React apps."*

### 3.1 Container vs. Presentational Component Pattern
The storage module implements the industry-standard **Container/Presentational (Smart/Dumb)** architectural pattern:

```
               ┌───────────────────────────────┐
               │    DiskSchedulingPage.jsx     │  <-- SMART CONTAINER
               │  - Holds Single Source of     │
               │    Truth (State)              │
               │  - Computes Math (useMemo)    │
               │  - Runs Timers (useEffect)    │
               └──────────────┬────────────────┘
                              │ Props (Data & Callbacks)
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│DiskControlsCard  │ │ DiskPlatter3D    │ │ DiskSeekChart    │
│(Dumb Presenter)  │ │ (Dumb Presenter) │ │ (Dumb Presenter) │
│- Controlled form │ │- Renders 3D disc │ │- Draws SVG line  │
│- Dispatches props│ │- Shows head angle│ │- Shows THM cost  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

- **Why this matters for evaluation:** If state were scattered inside `DiskPlatter3D` or `DiskControlsCard`, keeping the platter position, the stepper count, and the chart polyline in sync would lead to state desynchronization bugs. By lifting state to `DiskSchedulingPage.jsx`, synchronization is guaranteed.

### 3.2 Single Source of Truth & State Declarations
In `DiskSchedulingPage.jsx (Lines 14–20)`:
```jsx
// 1. Core Operating Parameters
const [algorithm, setAlgorithm] = useState('SSTF');
const [queue, setQueue] = useState(DEFAULT_QUEUE);
const [head, setHead] = useState(DEFAULT_HEAD);
const [direction, setDirection] = useState('inward');

// 2. Playback & Animation State
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [isAutoPlaying, setIsAutoPlaying] = useState(false);
const [isSeeking, setIsSeeking] = useState(false);
```

### 3.3 High-Performance Derived State via `useMemo`
A common beginner mistake in React is to store calculated values in `useState` and update them with `useEffect`, triggering redundant re-renders. 

`DiskSchedulingPage.jsx` avoids this by using **`useMemo`** to compute derived algorithmic solutions synchronously:

```jsx
// Lines 27–29: Solves current algorithm only when inputs change
const scheduleResult = useMemo(() => {
  return solveDiskScheduling(algorithm, queue, head, direction);
}, [algorithm, queue, head, direction]);

// Lines 73–83: Computes all 6 algorithms simultaneously for the benchmark matrix
const comparisonResults = useMemo(() => {
  return ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].map((algo) => {
    const res = solveDiskScheduling(algo, queue, head, direction);
    return {
      algo,
      totalDistance: res.totalDistance,
      avgDistance: res.avgDistance,
      isCurrent: algo === algorithm,
    };
  });
}, [queue, head, direction, algorithm]);
```

- **Performance Gain:** When the user steps through the animation (`currentStepIndex` increments from 0 to 1), `scheduleResult` and `comparisonResults` **do not re-run**. React reuses the cached memoized calculation, ensuring 60 FPS animations.

### 3.4 Asynchronous Animation Timers & Cleanup with `useEffect`
Automatic playback requires an interval timer. In `DiskSchedulingPage.jsx (Lines 51–70)`:
```jsx
useEffect(() => {
  let timer;
  if (isAutoPlaying) {
    if (currentStepIndex < totalSteps) {
      timer = setInterval(() => {
        setIsSeeking(true);
        setCurrentStepIndex((prev) => {
          if (prev + 1 >= totalSteps) {
            setIsAutoPlaying(false); // Auto-halt at journey end
          }
          return prev + 1;
        });
        setTimeout(() => setIsSeeking(false), 500);
      }, 1300);
    } else {
      setIsAutoPlaying(false);
    }
  }
  // CRITICAL CLEANUP: Prevents interval memory leaks upon unmount or pause
  return () => clearInterval(timer);
}, [isAutoPlaying, currentStepIndex, totalSteps]);
```
- **Cleanup Guarantee:** If the user pauses playback, resets, or navigates away to `/simulation`, `clearInterval(timer)` immediately executes, preventing ghost timer updates in background tabs.

### 3.5 Global Context Integration (Theme & Auth)
The storage page consumes global context through its parent shell:
1. **`ThemeContext`:** `Navbar` consumes `useTheme()`. The 3D disk platter uses CSS variables (`var(--bg-base)`, `var(--bg-card)`, `text-borderLine`) so the metallic platter surface dynamically switches between light mode chrome and dark mode obsidian without reloading.
2. **`AuthContext`:** The user's active session is visible in the top header. An authenticated user can explore the disk simulation while their credentials remain synchronized in `localStorage`.

---

## 4. Rubric 3: Intro to Redux Toolkit
*Rubric Standard: "Effective implementation of Redux Toolkit."*

### 4.1 How System Zero Implements Redux Toolkit
`System Zero` configures Redux Toolkit at the application root:
- **Central Store:** `src/store/store.js` using `configureStore()`.
- **Root Provider:** `src/main.jsx` wrapping `<App />` with `<Provider store={store}>`.
- **Production Slices:** `src/os/process-synchronization/store/raceConditionSlice.js` and `configSlice.js`.

### 4.2 Architectural Comparison: Local State vs. Redux Toolkit
In frontend engineering, choosing between **Local Component State** and **Redux Global State** is an essential architectural decision:

| Criterion | Local State (`useState` in `DiskSchedulingPage`) | Redux Toolkit (`createSlice` in `store.js`) |
| :--- | :--- | :--- |
| **Scope** | Confined to the `/os/disk` module. | Shared across multiple detached pages and components. |
| **Lifecycle** | Resets when navigating away from `/os/disk`. | Persists across route transitions in global memory. |
| **Boilerplate** | Low (direct prop passing to 3 child components). | Medium (requires slice, actions, reducers, selectors). |
| **Ideal For** | Self-contained visualizers, isolated sandbox tools. | Cross-module synchronization, user auth, shared telemetry. |

### 4.3 Step-by-Step Refactor: Modeling Disk Scheduling as an RTK Slice
To demonstrate to your evaluator that you can seamlessly implement Redux Toolkit for this module, here is how the disk state is translated into a Redux slice:

#### Step 1: Create the Slice (`src/storage/disk/store/diskSlice.js`)
```javascript
import { createSlice } from '@reduxjs/toolkit';
import { solveDiskScheduling } from '../diskAlgorithms';

const initialState = {
  algorithm: 'SSTF',
  queue: [98, 183, 37, 122, 14, 124, 65, 67],
  head: 53,
  direction: 'inward',
  currentStepIndex: 0,
  isAutoPlaying: false,
  isSeeking: false,
};

export const diskSlice = createSlice({
  name: 'diskScheduling',
  initialState,
  reducers: {
    setAlgorithm: (state, action) => {
      state.algorithm = action.payload;
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
    },
    setHead: (state, action) => {
      state.head = action.payload;
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
      state.currentStepIndex = 0;
    },
    stepForward: (state) => {
      state.currentStepIndex += 1;
    },
    resetSeek: (state) => {
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
    toggleAutoPlay: (state) => {
      state.isAutoPlaying = !state.isAutoPlaying;
    },
    setIsSeeking: (state, action) => {
      state.isSeeking = action.payload;
    },
  },
});

export const {
  setAlgorithm,
  setHead,
  setQueue,
  setDirection,
  stepForward,
  resetSeek,
  toggleAutoPlay,
  setIsSeeking,
} = diskSlice.actions;

// Selectors
export const selectDiskParams = (state) => state.disk;
export const selectCurrentStep = (state) => {
  const { algorithm, queue, head, direction, currentStepIndex } = state.disk;
  const result = solveDiskScheduling(algorithm, queue, head, direction);
  return result.steps[currentStepIndex] || result.steps[0];
};

export default diskSlice.reducer;
```

#### Step 2: Register in Store (`src/store/store.js`)
```javascript
import { configureStore } from '@reduxjs/toolkit';
import raceConditionReducer from '../os/process-synchronization/store/raceConditionSlice';
import configReducer from '../os/process-synchronization/store/configSlice';
import diskReducer from '../storage/disk/store/diskSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    raceCondition: raceConditionReducer,
    disk: diskReducer, // Connected RTK slice
  },
});
```

#### Step 3: Consume in Component via `useDispatch` and `useSelector`
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { setAlgorithm, stepForward, resetSeek } from './store/diskSlice';

export default function DiskControlsCardRTK() {
  const dispatch = useDispatch();
  const { algorithm, head, currentStepIndex } = useSelector((state) => state.disk);

  return (
    <button onClick={() => dispatch(stepForward())}>
      STEP SEEK #{currentStepIndex}
    </button>
  );
}
```

### 4.4 Cross-Slice ExtraReducers & Action Stream Analysis
Notice how in `raceConditionSlice.js (Line 91)`, Redux Toolkit uses `extraReducers`:
```javascript
extraReducers: (builder) => {
  builder.addCase(applyConfig, (state, action) => {
    state.initialBalance = action.payload.initialBalance;
    state.balance = action.payload.initialBalance;
  });
}
```
If we want the Disk Scheduler to reset whenever global simulation settings are reset, our `diskSlice` can listen to `resetConfig` using the exact same `extraReducers` builder pattern.

---

## 5. Rubric 4: Form Handling in React
*Rubric Standard: "Excellent usage of Form handling in React."*

### 5.1 Controlled vs. Uncontrolled Form Elements
In React:
- **Uncontrolled Element:** The DOM maintains its own internal state (e.g. `<input ref={myRef} />`). React must poll the DOM via refs to read values.
- **Controlled Element:** React state is the single source of truth (`value={state}` and `onChange={(e) => setState(e.target.value)}`). Every keystroke, slider drag, or click flows through a React handler.

The storage module uses **100% controlled components** in `DiskControlsCard.jsx`.

### 5.2 Range Sliders, Dynamic Clamping & Number Coercion
In `DiskControlsCard.jsx (Lines 110–121)`:

```jsx
<input
  type="range"
  min="0"
  max={MAX_TRACK}
  value={head}
  onChange={(e) => {
    setIsAutoPlaying(false);
    setHead(Number(e.target.value)); // Explicit number coercion
    onReset();
  }}
  className="w-full accent-primary cursor-pointer"
/>
```
- **Why `Number(e.target.value)` is vital:** Native HTML input event targets return values as strings (e.g., `"53"`). If passed directly into numerical calculations like `Math.abs(currentTrack - prevTrack)`, JavaScript could perform string concatenation instead of addition. Explicitly wrapping with `Number(...)` eliminates type bugs.

### 5.3 Discrete Option Toggles as Custom Accessible Radio Groups
Instead of default HTML `<select>` dropdowns, `DiskControlsCard.jsx` builds a responsive interactive selector:
```jsx
<div className="grid grid-cols-3 gap-1.5">
  {ALGORITHMS.map((algo) => (
    <button
      key={algo.id}
      onClick={() => {
        setIsAutoPlaying(false);
        setAlgorithm(algo.id);
        onReset();
      }}
      className={`py-1.5 px-2 rounded border text-xs transition-all ${
        algorithm === algo.id
          ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold shadow-sm'
          : 'bg-background border-borderLine text-textMuted hover:text-textMain'
      }`}
    >
      {algo.id}
    </button>
  ))}
</div>
```
- Clicking any option updates `algorithm` in state, updates the active outline, displays the corresponding algorithm description below, and automatically calls `onReset()` to reset step pointers.

### 5.4 Defensive Input Sanitization & Queue Parsing
In `diskAlgorithms.js (Line 7)`:
```javascript
const queue = [...requestQueue].filter(
  (t) => typeof t === 'number' && !isNaN(t) && t >= 0 && t <= MAX_TRACK
);
const head = Math.max(0, Math.min(MAX_TRACK, startHead));
```
- **Defensive Programming:** Even if an input field passes an invalid string, negative track, or out-of-range cylinder ($> 199$), the algorithm engine filters it out and clamps the head position between $0$ and $199$.

### 5.5 Building an Interactive Custom Queue Form with Live Validation
If an evaluator asks: *"Can a student type their own custom request queue like `55, 12, 180` with form validation?"*, you can demonstrate this form handling extension:

```jsx
import { useState } from 'react';

export function CustomQueueInputForm({ onApplyQueue }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const validate = (val) => {
    if (!val.trim()) return 'Queue cannot be empty.';
    // Regex matches comma-separated numbers: e.g. "98, 183, 37"
    if (!/^(\s*\d+\s*,?)+$/.test(val)) {
      return 'Format must be comma-separated integers (e.g. 98, 183, 37).';
    }
    const numbers = val.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n));
    const outOfBounds = numbers.some((n) => n < 0 || n > 199);
    if (outOfBounds) {
      return 'All cylinders must be between 0 and 199.';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validate(inputValue);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    const parsedQueue = inputValue.split(',').map((s) => Number(s.trim()));
    onApplyQueue(parsedQueue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <label className="text-xs font-mono text-textMuted">Custom Cylinders (0–199):</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          placeholder="e.g. 23, 89, 132, 42"
          onChange={(e) => {
            setInputValue(e.target.value);
            if (touched) setError(validate(e.target.value));
          }}
          onBlur={() => {
            setTouched(true);
            setError(validate(inputValue));
          }}
          className={`flex-1 px-3 py-1.5 rounded-lg bg-background border text-xs font-mono outline-none ${
            error ? 'border-red-500' : 'border-borderLine focus:border-primary'
          }`}
        />
        <button type="submit" className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg">
          Load
        </button>
      </div>
      {error && <span className="text-[11px] text-red-500 font-mono block">{error}</span>}
    </form>
  );
}
```

---

## 6. The 6 Disk Scheduling Algorithms: Mathematical & OS Theory

Understanding the underlying Computer Science theory lets you explain the simulator with authority during evaluations.

### The Physics of Disk Latency
Total Disk Access Time consists of three components:
$$\text{Access Time} = \text{Seek Time} + \text{Rotational Latency} + \text{Transfer Time}$$
1. **Seek Time ($T_{\text{seek}}$):** The mechanical time required for the actuator arm to move the read/write head to the desired cylinder track. *(Bottleneck: $\approx 3 - 9\text{ ms}$)*.
2. **Rotational Latency ($T_{\text{rot}}$):** Time for the target sector on the platter to rotate beneath the head. *(At $7,200\text{ RPM}$, average delay is $\approx 4.16\text{ ms}$)*.
3. **Transfer Time ($T_{\text{trans}}$):** Time to stream the data bits off the magnetic surface into the disk controller buffer. *(Fast: microseconds)*.

**Goal:** Operating systems optimize **Seek Time** by minimizing **Total Head Movement (THM)**:
$$\text{THM} = \sum_{i=1}^{n} | \text{track}_i - \text{track}_{i-1} |$$

```
Track 0 (Inner Boundary)                                   Track 199 (Outer Boundary)
│                                                                                    │
├─────────────────────┼───────────────────────────────┼──────────────────────────────┤
0                    53 (Initial Head)               98                             199
```

---

### Algorithm Walkthroughs with Galvin Benchmark
*Benchmark Scenario (Silberschatz & Galvin OS Textbook):*
- **Queue:** `[98, 183, 37, 122, 14, 124, 65, 67]`
- **Initial Head:** `53`
- **Direction:** `inward` ($\rightarrow 199$)

#### 1. FCFS (First-Come, First-Served)
- **Concept:** Strict FIFO queue. Requests are serviced in arrival order without optimization.
- **Traversal Path:** $53 \rightarrow 98 \rightarrow 183 \rightarrow 37 \rightarrow 122 \rightarrow 14 \rightarrow 124 \rightarrow 65 \rightarrow 67$
- **Total Head Movement:**
  $$|98-53| + |183-98| + |37-183| + |122-37| + |14-122| + |124-14| + |65-124| + |67-65| = 640\text{ Cylinders}$$
- **Evaluation:** High wild swings. Actuator arm thrashes across the disk surface.

#### 2. SSTF (Shortest Seek Time First)
- **Concept:** Greedy algorithm. Selects the pending request closest to the current head position.
- **Calculation Step-by-Step:**
  - From $53$, nearest is $65$ ($|65-53| = 12$).
  - From $65$, nearest is $67$ ($|67-65| = 2$).
  - From $67$, nearest is $37$ ($|37-67| = 30$).
  - From $37$, nearest is $14$ ($|14-37| = 23$).
  - From $14$, nearest is $98$ ($|98-14| = 84$).
  - From $98 \rightarrow 122 \rightarrow 124 \rightarrow 183$.
- **Traversal Path:** $53 \rightarrow 65 \rightarrow 67 \rightarrow 37 \rightarrow 14 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow 183$
- **Total Head Movement:** $236\text{ Cylinders}$.
- **Flaw (Starvation):** If new requests continually arrive near the head, distant cylinders (like track 14 or 183) can starve indefinitely.

#### 3. SCAN (The Elevator Algorithm)
- **Concept:** The arm sweeps in one direction toward the disk boundary (e.g. track $199$), servicing all requests along the way. Upon reaching the end, it reverses direction and sweeps toward track $0$.
- **Traversal Path:** $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow 183 \rightarrow \mathbf{199} \rightarrow 37 \rightarrow 14$
- **Total Head Movement:**
  $$(199 - 53) + (199 - 14) = 146 + 185 = 331\text{ Cylinders}$$
- **Benefit:** Prevents starvation; bounded maximum wait time.

#### 4. C-SCAN (Circular SCAN)
- **Concept:** Designed to provide uniform wait times. Sweeps in one direction (e.g. toward $199$), services requests, and upon reaching the boundary, immediately returns to track $0$ **without servicing any requests on the return trip**, then resumes forward sweeping.
- **Traversal Path:** $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow 183 \rightarrow \mathbf{199} \rightarrow \mathbf{0} \rightarrow 14 \rightarrow 37$
- **Total Head Movement:**
  $$(199 - 53) + (199 - 0) + (37 - 0) = 146 + 199 + 37 = 382\text{ Cylinders}$$

#### 5. LOOK (Optimized SCAN)
- **Concept:** Like SCAN, but the arm looks ahead and only travels as far as the **furthest request** in the current direction, reversing immediately without traveling to the unrequested physical boundary ($199$).
- **Traversal Path:** $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow \mathbf{183} \rightarrow 37 \rightarrow 14$
- **Total Head Movement:**
  $$(183 - 53) + (183 - 14) = 130 + 169 = 299\text{ Cylinders}$$
- **Advantage:** Saves $(199 - 183) \times 2 = 32$ wasted cylinders compared to standard SCAN!

#### 6. C-LOOK (Optimized Circular LOOK)
- **Concept:** Like C-SCAN, but only travels as far as the highest request ($183$), then jumps directly to the lowest request ($14$) without touching track $199$ or track $0$.
- **Traversal Path:** $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow \mathbf{183} \rightarrow \mathbf{14} \rightarrow 37$
- **Total Head Movement:**
  $$(183 - 53) + (183 - 14) + (37 - 14) = 130 + 169 + 23 = 322\text{ Cylinders}$$

---

## 7. Viva & Evaluation Defense: 10 Tough Questions & Exemplary Answers

### Q1: Why did you use local state in `DiskSchedulingPage` instead of Redux Toolkit?
> **Answer:** "We applied the architectural principle of **Scattered vs. Centralized State Scope**. Redux Toolkit in our project (`src/store/`) is utilized for cross-cutting simulation state—like Process Synchronization, where thread queues, mutual exclusion locks, and shared bank vault balances must communicate across multiple independent pages and navigation hubs. In contrast, the Disk Scheduling module is self-contained: its 3 child components (`DiskControlsCard`, `DiskPlatter3D`, and `DiskSeekChart`) share a direct parent-child relationship. Lifting state to `DiskSchedulingPage` provides high cohesion, zero unnecessary Redux serialization overhead, and encapsulates the module. However, because our architecture is modular, migrating it to a Redux slice takes only a few lines of code via `createSlice`."

### Q2: How does your implementation prevent memory leaks during auto-seek playback?
> **Answer:** "In `DiskSchedulingPage.jsx`, our playback interval is managed inside a `useEffect` hook. We return a cleanup function `() => clearInterval(timer)`. Whenever the user pauses playback, resets the simulation, or the component unmounts due to client-side routing, React immediately clears the browser interval, preventing background memory leaks or updates to unmounted component state."

### Q3: What is the purpose of `useMemo` in `DiskSchedulingPage.jsx`?
> **Answer:** "We use `useMemo` for two intensive calculations: `scheduleResult` (which runs the selected disk algorithm) and `comparisonResults` (which runs all 6 algorithms simultaneously to generate the benchmark comparison matrix). Because `useMemo` caches results based on `[algorithm, queue, head, direction]`, when the user simply clicks 'Step' to increment `currentStepIndex`, the heavy mathematical sorting algorithms do NOT re-execute. This guarantees 60 FPS performance."

### Q4: How is the physical 3D hard drive platter rendered without external 3D libraries?
> **Answer:** "In `DiskPlatter3D.jsx`, we utilize pure CSS 3D matrix transforms: `transform: 'rotateX(52deg) rotateZ(-22deg)'` inside a container with `perspective: 900px` and `preserve-3d`. We calculate the SVG radial track ring dynamically:
> `trackRadius = minR + (clampedTrack / MAX_TRACK) * (maxR - minR)`
> and rotate the actuator arm SVG along its pivot point:
> `armAngle = minAngle + (clampedTrack / MAX_TRACK) * (maxAngle - minAngle)`.
> This gives an interactive 3D perspective with zero bundle overhead."

### Q5: How do your form inputs handle edge cases, like string values or out-of-range tracks?
> **Answer:** "In `DiskControlsCard.jsx`, the range input explicitly coerces events to numbers via `Number(e.target.value)`. Furthermore, in `diskAlgorithms.js`, we practice defensive programming: the queue is filtered using `typeof t === 'number' && !isNaN(t) && t >= 0 && t <= MAX_TRACK`, and the head is clamped using `Math.max(0, Math.min(MAX_TRACK, startHead))`. Out-of-bounds inputs cannot crash the algorithm engine."

### Q6: What is the difference between SCAN and LOOK algorithms?
> **Answer:** "Standard SCAN travels all the way to the physical boundaries of the platter disc (Track 199 or Track 0), even if there are no pending requests there. LOOK optimizes this by scanning ahead and reversing direction as soon as the furthest pending request in that direction is serviced, saving wasted actuator travel time."

### Q7: Why is SSTF generally not used in real-time operating systems despite having low THM?
> **Answer:** "SSTF is a greedy algorithm. While it minimizes immediate seek distance, it suffers from **starvation**. If a stream of requests continues to arrive near the active cylinder, requests located on outer or inner tracks will wait indefinitely. Real-time operating systems prefer elevator algorithms like SCAN or C-LOOK because they provide bounded, predictable waiting times."

### Q8: How does your code connect to the rest of the application's React Navigation layout?
> **Answer:** "It is registered as a declarative route in `App.jsx` at path `/os/disk`. It is seamlessly connected to the global `Navbar` curriculum dropdown under Module 2 (Topic 6) and to the interactive syllabus accordion deck on the homepage (`CurriculumCards.jsx`). In-page navigation also uses anchor targets (`#platter` and `#trajectory`) for smooth section jumping."

### Q9: What happens if the queue has no requests?
> **Answer:** "In `diskAlgorithms.js`, if the queue is empty, the function returns an initial step with distance 0 and an average distance of 0. The trajectory SVG renders a single starting node at the head position without errors, and the stepper button automatically disables via `disabled={currentStepIndex >= totalSteps}`."

### Q10: How does this module demonstrate compliance with Evaluation Component 2's four rubrics?
> **Answer:** 
> 1. **React-Navigation:** Declarative routing in `App.jsx`, curriculum links, anchor scroll, and instant scroll restoration.
> 2. **Context & State Architecture:** Clean Container/Presentational separation, single source of truth, reactive `useMemo` derived state, and `useEffect` timer cleanup.
> 3. **Redux Toolkit:** Coexists with the application's root Redux store (`src/store/store.js`), and can be mapped into a standalone `createSlice` reducer structure.
> 4. **Form Handling:** 100% controlled components, type-coerced range sliders, responsive algorithm selectors, and defensive queue input sanitization.

---
*End of Masterclass Guide. Prepared for System Zero Evaluation Defense.*
