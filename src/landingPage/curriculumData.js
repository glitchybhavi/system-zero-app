export const CURRICULUM_MODULES = [
  {
    id: "arch",
    phase: "01",
    title: "Computer Organization",
    iconType: "cpu",
    topics: [
      { id: 1, title: "Digital Logic & Basic Computer Structure", link: "/simulation" },
      { id: 2, title: "Instruction Set Architecture & CPU Design", link: "/arch/isa" },
      { id: 3, title: "Memory Organization & Hierarchy" },
    ],
  },
  {
    id: "os",
    phase: "02",
    title: "Operating Systems",
    iconType: "layers",
    topics: [
      { id: 4, title: "Process Management", link: "/learn/process-management" },
      { id: 5, title: "Process Synchronization", link: "/os/sync" },
      { id: 6, title: "Storage & Disk Scheduling", link: "/os/disk" },
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
