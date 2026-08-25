export const CURRICULUM_MODULES = [
  {
    id: "arch",
    phase: "01",
    title: "Computer Organization",
    iconType: "cpu",
    topics: [
      { id: 1, title: "Digital Logic & Basic Computer Structure", link: "/simulation", },
      { id: 2, title: "Instruction Set Architecture & CPU Design" }, //Under Developement
      { id: 3, title: "Computer Arithmetic & Data Path" }, //Under Developement
      { id: 4, title: "Memory Organization & Hierarchy" }, //Under Developement
      { id: 5, title: "Input/Output & Parallel Processing" }, //Under Developement
    ],
  },
  {
    id: "os",
    phase: "02",
    title: "Operating Systems",
    iconType: "layers",
    topics: [
      { id: 6, title: "Overview" }, //Under Developement
      { id: 7, title: "Process Management" }, //Under Developement
      { id: 8, title: "Process Coordination" }, //Under Developement
      { id: 9, title: "Memory Management" }, //Under Developement
      { id: 10, title: "Storage Management" }, //Under Developement
      { id: 11, title: "Case Studies" }, //Under Developement
    ],
  },
];


export const CURRICULUM_CARDS = CURRICULUM_MODULES.flatMap((mod) =>
  mod.topics.map((topic) => ({
    id: topic.id,
    type: mod.id,
    phase: mod.phase,
    title: topic.title,
    link: topic.link || null,
  }))
);
