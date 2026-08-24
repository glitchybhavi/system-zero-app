# System Zero 

> An Interactive CPU & Computer Architecture Simulator
System Zero is a zero-setup, browser-based React application that functions as an interactive visualizer and educational tool for computer architecture and operating systems, letting users watch a machine think in real time.
Built to bridge the intuition gap in computer science education, where inherently dynamic and abstract processes like instruction execution, memory paging, context switching, and process scheduling are traditionally trapped in static textbook diagrams, it replaces memorized abstractions with a working, small-scale computer. It empowers computer science students and self-taught developers to write tiny programs, add multiple processes, and watch the machine juggle them as an interactive companion to university lectures. Users can visually track data moving through memory, trace code execution instruction by instruction, and observe multiple programs competing for the same hardware.
By running directly in the browser, it eliminates complex installations, ensuring instant accessibility for any student on any device. Because nothing is scripted or pre-recorded, users actively drive a real simulated system and see every underlying mechanism animate in real time as a direct consequence of their input, building genuine intuition for how modern computers actually work.
---

## Core Features

- **Interactive 3D Visualizer Core**: Powered by **Three.js** and WebGL, rendering hardware structures, system buses, and CPU cores in real time.
- **ALU Simulation Playground**: Test basic logic gates, arithmetic functions, complements, and shift registers inside a 3D processor core.
- **Dynamic Multitasking Particles**: Watch process threads queue, prioritize, and dispatch inside a smooth WebGL particle cloud.
- **Live Compiler & Assembly IDE**: Write logic in the interactive IDE and watch it compile down to hardware registers instantly.
- **Scroll-Contained Visuals**: Elements lock gracefully to the viewport only while you scroll through their active sections, keeping the rest of the workspace clean.
---

## Directory Structure

```
system-zero-app/
├── public/                  # Static assets (Favicons, pre-built assets, SVGs)
├── src/
│   ├── assets/              # Images, SVGs, and pre-bundled assets
│   ├── bootSystem/          # Interactive CPU architecture & boot simulation components
│   │   ├── CpuAlu.jsx       # 3D ALU with arithmetic/logic execution logic
│   │   ├── CpuFinalLeap.jsx # Final boot phase activation
│   │   ├── CpuRegisters.jsx # 3D register representation & Program Counter tunnel
│   │   ├── MotherboardHook.jsx # Boot sequences and hardware power controller
│   │   └── SimulationPage.jsx # Parent container with scroll-to-top handler
│   ├── context/             # Global application state providers
│   │   └── ThemeContext.jsx # Light/dark mode context provider
│   ├── landingPage/         # Marketing and dashboard components
│   │   ├── LandingPage.jsx  # Homepage layout controller
│   │   ├── Navbar.jsx       # Sticky header with interactive Mega Menus
│   │   ├── Footer.jsx       # Custom footer with repository connection
│   │   ├── Hero3D.jsx       # 3D interactive workspace model
│   │   ├── HardwareScroll.jsx # Phase 01: Computer Architecture pinned breakdown
│   │   ├── OsVisualizer.jsx # Phase 02: Operating Systems multitasking visualizer
│   │   ├── CurriculumCards.jsx # Syllabus expanding accordion deck
│   │   ├── IdeView.jsx      # Code playground compiler simulator
│   │   └── Sandbox.jsx      # Sandbox context presentation
│   ├── App.css              # Global styles
│   ├── App.jsx              # Main routing and Scroll-to-Top initialization
│   ├── index.css            # Tailwind bases, CSS custom variables
│   └── main.jsx             # React entry mount
├── index.html               # Main template document entry
├── package.json             # Package configuration & dependencies
└── vite.config.js           # Build settings configuration
```
---
## Technology Stack & Dependencies
### Core
- **Vite & React 19** - Ultra-fast hot module reloading and component architecture.
- **React Router 7** - Single Page Application declarative client-side routing.
- **Three.js** - Native WebGL rendering engine for the hardware models and particle grids.
### Styling & Motion
- **Tailwind CSS** - Clean utilities for interactive layouts.
- **Framer Motion** - Fluid micro-interactions, spring physics, and slide-in panels.
- **Lucide Icons** - Modern, lightweight SVG iconography.
---
## Running the Project Locally
Follow these commands to get System Zero running on your machine:
### 1. Clone the Repository
```bash
git clone https://github.com/glitchybhavi/system-zero-app.git
cd system-zero-app
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Start Development Server
```bash
npm run dev
```
*Open your browser and navigate to `http://localhost:5173` to see the simulator.*
### 4. Build for Production
```bash
npm run build

```
