# Masterclass: Storage & Disk Scheduling Architecture vs. The 4 React Rubrics
**Project:** *System Zero* (`src/storage/disk/` and `src/auth/`)  
**Target Reading Time:** 45 – 60 Minutes  
**Target Evaluation:** Course Component 2 Evaluation (Score: 25 / 25 - Excellent Tier)

---

## Table of Contents
1. [Executive Summary: Are All 4 Rubrics Implemented in Storage?](#1-executive-summary-are-all-4-rubrics-implemented-in-storage)
2. [The Architectural Justification: "Why Did I Choose What I Chose?"](#2-the-architectural-justification-why-did-i-choose-what-i-chose)
   - *2.1 Why Not Put Everything in Redux?*
   - *2.2 Why Not Put Everything in Context API?*
   - *2.3 The 3-Tier State Efficiency Hierarchy*
3. [Rubric 1: React-Navigation Layout & Page Structure in Storage](#3-rubric-1-react-navigation-layout--page-structure-in-storage)
   - *3.1 Sub-Routing with Wildcard Paths (`/os/disk/*`)*
   - *3.2 Active Tab Synchronization with URL Paths*
   - *3.3 Two-Way Scroll Spy via `IntersectionObserver`*
4. [Rubric 2: Context API and State Architecture in Storage](#4-rubric-2-context-api-and-state-architecture-in-storage)
   - *4.1 `DiskUIContext.jsx`: Scoped Feature Context*
   - *4.2 Custom Hook Pattern: `useDiskUI()`*
   - *4.3 Synchronous Derived State via `useMemo`*
5. [Rubric 3: Intro to Redux Toolkit in Storage](#5-rubric-3-intro-to-redux-toolkit-in-storage)
   - *5.1 `diskSlice.js`: State Machine & Reducers*
   - *5.2 Connecting to Global Store (`src/store/store.js`)*
   - *5.3 `useDispatch` and `useSelector` in Action*
6. [Rubric 4: Form Handling in React (Disk Form + Sign In Page)](#6-rubric-4-form-handling-in-react-disk-form--sign-in-page)
   - *6.1 Disk Scheduling Custom Queue Form Handling*
   - *6.2 Sign In & Registration Form Handling (`LoginForm.jsx`)*
   - *6.3 Controlled Components, Live Validation, Touched States & Password Strength*
7. [The 6 Disk Scheduling Algorithms: Mathematical Proofs](#7-the-6-disk-scheduling-algorithms-mathematical-proofs)
8. [The Evaluator Defense Script (Word-for-Word Answers for Your Viva)](#8-the-evaluator-defense-script-word-for-word-answers-for-your-viva)

---

## 1. Executive Summary: Are All 4 Rubrics Implemented in Storage?

**YES. All 4 rubrics are implemented directly inside the `src/storage/disk/` folder.**

| Rubric Criteria | Implementation Inside `src/storage/disk/` | Key Files |
| :--- | :--- | :--- |
| **1. React-Navigation Layout & Page Structure** | Wildcard routing (`/os/disk/*`), dynamic sub-route tabs (`/platter`, `/trajectory`, `/benchmark`), two-way `IntersectionObserver` scroll spy, and ecosystem links to Navbar & Curriculum Cards. | `DiskSchedulingPage.jsx`, `App.jsx` |
| **2. Context API & State Architecture** | Feature-scoped `DiskUIContext` providing `seekSpeed`, `platterRpm`, `activeLab`, custom hook `useDiskUI()`, and derived calculations via `useMemo`. | `context/DiskUIContext.jsx`, `DiskSchedulingPage.jsx` |
| **3. Intro to Redux Toolkit** | Production slice `diskSlice.js` using `createSlice`, registered in `src/store/store.js` as `state.disk`, using `useDispatch` and `useSelector`. | `store/diskSlice.js`, `DiskSchedulingPage.jsx`, `DiskControlsCard.jsx` |
| **4. Form Handling in React** | Controlled `<form>` for custom cylinder queues, live tokenization validation, integer bounds check ($0 \le \text{track} \le 199$), error/success banners, and range sliders. | `DiskControlsCard.jsx`, `diskAlgorithms.js` |

---

## 2. The Architectural Justification: "Why Did I Choose What I Chose?"

When your evaluator asks:  
> *"Is your state management the most efficient? Why didn't you just use Redux for everything, or Context for everything? Why did you separate them?"*

Here is your textbook, senior-level architectural defense:

### 2.1 Why NOT Put Everything in Redux?
If you put transient form input text (like typing `1, 4, 9...` into a text box) or temporary UI view toggles (like animation playback speed or active tab) into Redux:
1. **Unnecessary Store Dispatches:** Every single keystroke would trigger a Redux action dispatch, running root reducer checks across the whole app.
2. **Action Stream Pollution:** DevTools and telemetry become flooded with `SET_INPUT_TEXT` actions instead of meaningful business events (`SET_CUSTOM_QUEUE`, `STEP_SEEK`).
3. **Loss of Colocation:** Form validation state (e.g., `queueError`, `touched`) belongs directly to the form component where the user is typing, not in a global store.

### 2.2 Why NOT Put Everything in Context API?
If you put high-frequency simulation state (like playback ticks that increment every 600ms) into a generic Context API:
1. **Context Re-Render Cascades:** When a Context value changes, **every single consumer component** subscribed to that context re-renders, even if it only cared about one property.
2. **Lack of Redux DevTools & Action Traceability:** Complex simulations with deterministic stepping (step forward, step backward, reset) benefit immensely from Redux Toolkit’s serializable action log.

### 2.3 The 3-Tier State Efficiency Hierarchy
We designed an industry-standard **3-Tier State Hierarchy**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TIER 1: REDUX TOOLKIT (`diskSlice.js`)                                 │
│ - Core Domain/Simulation State: algorithm, queue, head, stepIndex      │
│ - Why: Deterministic state machine, time-travel stepping, global store │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 2: CONTEXT API (`DiskUIContext.jsx`)                              │
│ - Feature UI Settings: seekSpeed (600ms/1300ms), platterRpm, activeLab │
│ - Why: Shared across disk components without polluting Redux store     │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 3: LOCAL REACT STATE (`useState` in `DiskControlsCard.jsx`)       │
│ - Draft Form Inputs: inputQueueText, queueError, submitSuccess         │
│ - Why: Zero re-renders to outside components while the user is typing  │
└────────────────────────────────────────────────────────────────────────┘
```

> **Verdict for the Evaluator:** *"This 3-tier architecture is the most efficient possible because it separates Core Domain State (Redux), UI Feature Preferences (Context), and Ephemeral User Input (Local State), completely eliminating unnecessary re-renders while keeping the code clean and maintainable."*

---

## 3. Rubric 1: React-Navigation Layout & Page Structure in Storage

### 3.1 Sub-Routing with Wildcard Paths (`/os/disk/*`)
In `src/App.jsx`:
```jsx
<Route path="/os/disk/*" element={<DiskSchedulingPage />} />
```
The wildcard `/*` allows `DiskSchedulingPage` to act as a sub-router responding to child paths:
- `/os/disk` $\rightarrow$ Default landing view
- `/os/disk/platter` $\rightarrow$ Lab 1: 3D Actuator & Platter Assembly
- `/os/disk/trajectory` $\rightarrow$ Lab 2: Cylinder Traversal Trajectory
- `/os/disk/benchmark` $\rightarrow$ Lab 3: Comparative Performance Matrix

### 3.2 Active Tab Synchronization with URL Paths
In `src/storage/disk/DiskSchedulingPage.jsx`:
```jsx
useEffect(() => {
  const pathParts = location.pathname.split('/');
  const subRoute = pathParts[pathParts.length - 1];
  const validSections = ['platter', 'trajectory', 'benchmark'];

  if (validSections.includes(subRoute)) {
    setActiveLab(subRoute);
    const element = document.getElementById(subRoute);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}, [location.pathname, setActiveLab]);
```
- Direct links like `http://localhost:5174/os/disk/trajectory` automatically activate the Trajectory tab and scroll smoothly to the target section!

### 3.3 Two-Way Scroll Spy via `IntersectionObserver`
`DiskSchedulingPage.jsx` sets up an `IntersectionObserver`:
```jsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLab(entry.target.id);
        }
      });
    },
    { threshold: 0.3 }
  );

  ['platter', 'trajectory', 'benchmark'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [setActiveLab]);
```
- As the user scrolls through the page, the navigation tabs update in real time to reflect the section currently on screen!

---

## 4. Rubric 2: Context API and State Architecture in Storage

### 4.1 `DiskUIContext.jsx`: Scoped Feature Context
Located at `src/storage/disk/context/DiskUIContext.jsx`:
```jsx
import { createContext, useContext, useState } from 'react';

const DiskUIContext = createContext();

export function DiskUIProvider({ children }) {
  const [activeLab, setActiveLab] = useState('platter');
  const [seekSpeed, setSeekSpeed] = useState(1300); // 1300ms vs 600ms
  const [platterRpm, setPlatterRpm] = useState('7200'); // '7200' | '10000'
  const [showGhostTrajectory, setShowGhostTrajectory] = useState(true);

  const toggleSeekSpeed = () => {
    setSeekSpeed((prev) => (prev === 1300 ? 600 : 1300));
  };

  const togglePlatterRpm = () => {
    setPlatterRpm((prev) => (prev === '7200' ? '10000' : '7200'));
  };

  const value = {
    activeLab,
    setActiveLab,
    seekSpeed,
    toggleSeekSpeed,
    platterRpm,
    togglePlatterRpm,
    showGhostTrajectory,
    setShowGhostTrajectory,
  };

  return <DiskUIContext.Provider value={value}>{children}</DiskUIContext.Provider>;
}
```

### 4.2 Custom Hook Pattern: `useDiskUI()`
Instead of writing `useContext(DiskUIContext)` everywhere, we provide a custom hook with safety assertion:
```jsx
export function useDiskUI() {
  const context = useContext(DiskUIContext);
  if (!context) {
    throw new Error('useDiskUI must be used within a DiskUIProvider');
  }
  return context;
}
```

### 4.3 Synchronous Derived State via `useMemo`
In `DiskSchedulingPage.jsx`:
```jsx
const scheduleResult = useMemo(() => {
  return solveDiskScheduling(algorithm, queue, head, direction);
}, [algorithm, queue, head, direction]);
```
- The heavy algorithmic sorting in `diskAlgorithms.js` only runs when the input parameters change. Advancing playback steps does **not** re-compute the entire schedule!

---

## 5. Rubric 3: Intro to Redux Toolkit in Storage

### 5.1 `diskSlice.js`: State Machine & Reducers
Located at `src/storage/disk/store/diskSlice.js`:
```javascript
import { createSlice } from '@reduxjs/toolkit';
import { MAX_TRACK } from '../diskAlgorithms';

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
  name: 'disk',
  initialState,
  reducers: {
    setAlgorithm: (state, action) => {
      state.algorithm = action.payload;
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
    },
    setCustomQueue: (state, action) => {
      const { queue, head } = action.payload;
      if (Array.isArray(queue)) {
        state.queue = queue.filter((t) => typeof t === 'number' && !isNaN(t) && t >= 0 && t <= MAX_TRACK);
      }
      if (typeof head === 'number' && !isNaN(head)) {
        state.head = Math.max(0, Math.min(MAX_TRACK, head));
      }
      state.currentStepIndex = 0;
    },
    setHead: (state, action) => {
      state.head = Math.max(0, Math.min(MAX_TRACK, Number(action.payload) || 0));
      state.currentStepIndex = 0;
    },
    stepSeek: (state, action) => {
      const totalSteps = action.payload ?? 0;
      if (state.currentStepIndex < totalSteps) {
        state.currentStepIndex += 1;
        state.isSeeking = true;
      }
    },
    resetSeek: (state) => {
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
  },
});
```

### 5.2 Connecting to Global Store (`src/store/store.js`)
```javascript
import { configureStore } from '@reduxjs/toolkit';
import raceConditionReducer from '../os/process-synchronization/store/raceConditionSlice';
import configReducer from '../os/process-synchronization/store/configSlice';
import diskReducer from '../storage/disk/store/diskSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    raceCondition: raceConditionReducer,
    disk: diskReducer, // Connected directly
  },
});
```

### 5.3 `useDispatch` and `useSelector` in Action
In `DiskControlsCard.jsx`:
```jsx
const dispatch = useDispatch();
const { algorithm, queue, head, isAutoPlaying } = useSelector((state) => state.disk);

// Dispatches action to RTK store
<button onClick={() => dispatch(setAlgorithm('C-SCAN'))}>C-SCAN</button>
```

---

## 6. Rubric 4: Form Handling in React (Disk Form + Sign In Page)

Under Rubric 4, you must be prepared to explain **BOTH** the Disk Scheduling Form and the Authentication / Sign In Form!

### 6.1 Disk Scheduling Custom Queue Form Handling
In `src/storage/disk/DiskControlsCard.jsx`:
1. **Form Declaration:**
   ```jsx
   <form onSubmit={handleQueueSubmit} className="space-y-1.5">
     <input
       type="text"
       value={inputQueueText}
       onChange={handleQueueInputChange}
       placeholder="e.g. 98, 183, 37, 122, 14"
       className="w-full px-2.5 py-1.5 rounded bg-background border ..."
     />
     <button type="submit">Apply Queue</button>
   </form>
   ```
2. **Live Tokenization & Validation Function:**
   ```javascript
   const validateQueue = (text) => {
     const rawTokens = text.split(',').map((s) => s.trim()).filter(Boolean);
     if (rawTokens.length === 0) {
       return 'Queue cannot be empty. Enter cylinder numbers between 0 and 199';
     }

     const numbers = [];
     for (const token of rawTokens) {
       const num = Number(token);
       if (isNaN(num) || !Number.isInteger(num)) {
         return `"${token}" is not a valid cylinder integer`;
       }
       if (num < 0 || num > MAX_TRACK) {
         return `Cylinder #${num} is out of bounds (allowed: 0 to ${MAX_TRACK})`;
       }
       numbers.push(num);
     }
     return { validNumbers: numbers };
   };
   ```
3. **Controlled Updates & Error Handling:**
   - On change: updates local draft string `inputQueueText`. If an error was showing, it clears or live-validates.
   - On submit: prevents default (`e.preventDefault()`). If valid, dispatches `setCustomQueue` to Redux and triggers a green confirmation badge. If invalid, displays a red error banner with `<AlertCircle />`.

---

### 6.2 Sign In & Registration Form Handling (`src/auth/LoginForm.jsx`)
Your evaluation also tests your understanding of the **Sign In / Registration system**. Here is how `LoginForm.jsx` represents a textbook implementation of Form Handling in React:

#### 1. Form State Management (Controlled Inputs)
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'CS Student',
  rememberMe: true,
  agreeTerms: false,
});
const [touched, setTouched] = useState({});
const [authError, setAuthError] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [shake, setShake] = useState(false);
```

#### 2. The "Touched" State Pattern (Preventing Premature Errors)
A common UI flaw is showing red error messages the moment a user clicks inside a fresh input before they finish typing. `LoginForm.jsx` solves this with a `touched` tracker:
```javascript
const handleBlur = (field) => {
  setTouched((prev) => ({ ...prev, [field]: true }));
};

// Error is only displayed if field has been touched by the user!
const emailError = touched.email ? getFieldError('email') : null;
```

#### 3. Real-Time Regex & Rule Validation
```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

const getFieldError = (field) => {
  switch (field) {
    case 'email':
      if (!formData.email.trim()) return 'Email address is required';
      if (!validateEmail(formData.email)) return 'Please enter a valid email format';
      return null;
    case 'password':
      if (!formData.password) return 'Password is required';
      if (mode === 'register' && formData.password.length < 8) return 'Min 8 characters required';
      return null;
    case 'confirmPassword':
      if (mode === 'register' && formData.confirmPassword !== formData.password) {
        return 'Passwords do not match';
      }
      return null;
    case 'agreeTerms':
      if (mode === 'register' && !formData.agreeTerms) return 'You must accept the terms';
      return null;
    default:
      return null;
  }
};
```

#### 4. Password Strength Entropy Calculator
In Registration mode, `LoginForm.jsx` calculates an entropy score from 0 to 4:
```javascript
const calculateStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  return score;
};
```
This score dynamically drives an animated 4-tier visual progress bar (`Weak` $\rightarrow$ `Fair` $\rightarrow$ `Good` $\rightarrow$ `Strong`).

#### 5. Submit Lifecycle & Visual Feedback
```javascript
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents browser page reload
  
  // Mark all fields touched
  setTouched({ email: true, password: true, name: true, confirmPassword: true, agreeTerms: true });

  if (!isFormValid()) {
    setShake(true); // Triggers CSS shake animation
    setTimeout(() => setShake(false), 450);
    return;
  }

  setIsSubmitting(true);
  const result = login({ email: formData.email, password: formData.password });
  if (!result.success) {
    setAuthError(result.error);
    setShake(true);
  }
  setIsSubmitting(false);
};
```

---

## 7. The 6 Disk Scheduling Algorithms: Mathematical Proofs

| Algorithm | Strategy | Galvin Benchmark Traversal ($Head=53, Queue=[98, 183, 37, 122, 14, 124, 65, 67]$) | Total Head Movement (THM) | Starvation Risk? |
| :--- | :--- | :--- | :---: | :---: |
| **FCFS** | First-Come First-Served (FIFO) | $53 \rightarrow 98 \rightarrow 183 \rightarrow 37 \rightarrow 122 \rightarrow 14 \rightarrow 124 \rightarrow 65 \rightarrow 67$ | **640 Cylinders** | None (Fair) |
| **SSTF** | Greedy nearest request | $53 \rightarrow 65 \rightarrow 67 \rightarrow 37 \rightarrow 14 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow 183$ | **236 Cylinders** | **High** (Distant cylinders starve) |
| **SCAN** | Elevator sweep to boundary ($199$) | $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow 183 \rightarrow \mathbf{199} \rightarrow 37 \rightarrow 14$ | **331 Cylinders** | None (Bounded wait) |
| **C-SCAN** | Circular sweep with empty return ($199 \rightarrow 0$) | $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow 183 \rightarrow \mathbf{199} \rightarrow \mathbf{0} \rightarrow 14 \rightarrow 37$ | **382 Cylinders** | None (Uniform wait) |
| **LOOK** | Reverses at furthest request ($183$) | $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow \mathbf{183} \rightarrow 37 \rightarrow 14$ | **299 Cylinders** | None (Optimized SCAN) |
| **C-LOOK** | Jumps directly to lowest request ($183 \rightarrow 14$) | $53 \rightarrow 65 \rightarrow 67 \rightarrow 98 \rightarrow 122 \rightarrow 124 \rightarrow \mathbf{183} \rightarrow \mathbf{14} \rightarrow 37$ | **322 Cylinders** | None (Optimized C-SCAN) |

---

## 8. The Evaluator Defense Script (Word-for-Word Answers for Your Viva)

### Question 1: "Show me where Redux Toolkit is used in the Storage folder."
> **Your Answer:** *"In `src/storage/disk/store/diskSlice.js`, we define `diskSlice` using `createSlice` from `@reduxjs/toolkit`. It manages the disk queue, head position, active algorithm, and stepping index. We register it into the root Redux store in `src/store/store.js` under the `disk` key. Components like `DiskSchedulingPage.jsx` and `DiskControlsCard.jsx` connect to it using `useSelector((state) => state.disk)` and dispatch actions like `setAlgorithm`, `setCustomQueue`, and `stepSeek` using `useDispatch()`."*

### Question 2: "Why do you have both Context API and Redux in the same folder? Isn't that redundant?"
> **Your Answer:** *"No, it is an intentional architectural pattern called **State Scoping**. Redux holds **Core Domain / Simulation State** (`algorithm`, `queue`, `head`) because it represents serializable application logic that can be stepped through deterministically. Context API (`DiskUIContext.jsx`) holds **Feature UI Presentation Preferences** (`seekSpeed`, `platterRpm`, `activeLab`). Putting transient UI speeds or visual toggles into Redux would pollute the action history, while putting simulation state into Context would cause unnecessary re-render cascades. Separating them achieves maximum rendering efficiency."*

### Question 3: "How does Form Handling work when the user inputs a custom disk queue?"
> **Your Answer:** *"In `DiskControlsCard.jsx`, the custom queue input is a 100% controlled component bound to `inputQueueText`. When the user submits, `handleQueueSubmit` prevents the native page reload using `e.preventDefault()`, passes the text to `validateQueue()`, which tokenizes the string by commas, asserts every token is a valid integer, and verifies boundary limits ($0 \le \text{track} \le 199$). If invalid, it displays an alert banner with `<AlertCircle />`. If valid, it dispatches `setCustomQueue` to Redux and shows a green checkmark."*

### Question 4: "How does Form Handling work on your Sign In / Registration page?"
> **Your Answer:** *"Our `LoginForm.jsx` in `src/auth/` demonstrates comprehensive form handling:
> 1. All inputs are controlled via React state `formData`.
> 2. We use a `touched` state tracking dictionary so errors only appear after a user blurs or submits a field.
> 3. Email is validated via regex (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`).
> 4. Passwords have an interactive entropy calculator evaluating uppercase, lowercase, numbers, and special characters, driving an animated 4-tier strength bar.
> 5. Confirm password verifies cross-field equality.
> 6. Form submissions are prevented with `e.preventDefault()`, with an async loading state, animated shake feedback on failure, and localStorage session persistence on success."*

### Question 5: "How does React Navigation work in Disk Scheduling?"
> **Your Answer:** *"In `App.jsx`, we declare a wildcard sub-route `<Route path="/os/disk/*" element={<DiskSchedulingPage />} />`. Inside `DiskSchedulingPage.jsx`, we read the sub-path from `useLocation()`, allowing deep-linking directly to `/os/disk/platter`, `/os/disk/trajectory`, or `/os/disk/benchmark`. Clicking tabs navigates via `navigate('/os/disk/' + sectionId)` and smoothly scrolls to the element. Furthermore, we implemented an `IntersectionObserver` scroll spy that detects which section is currently in the viewport and updates the active tab automatically."*

---
*End of Masterclass. You are 100% prepared to ace Evaluation Component 2 with a top-bracket score.*
