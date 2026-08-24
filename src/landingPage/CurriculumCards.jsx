import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// The 11 total topics mapped to their respective architectural phases
const CARDS = [
  // Computer Architecture (Phase 1)
  { id: 1, type: 'arch', title: 'Digital Logic & Basic Computer Structure', link: '/simulation' },
  { id: 2, type: 'arch', title: 'Instruction Set Architecture & CPU Design' },
  { id: 3, type: 'arch', title: 'Computer Arithmetic & Data Path' },
  { id: 4, type: 'arch', title: 'Memory Organization & Hierarchy' },
  { id: 5, type: 'arch', title: 'Input/Output & Parallel Processing' },
  
  // Operating Systems (Phase 2)
  { id: 6, type: 'os', title: 'Overview' },
  { id: 7, type: 'os', title: 'Process Management' },
  { id: 8, type: 'os', title: 'Process Coordination' },
  { id: 9, type: 'os', title: 'Memory Management' },
  { id: 10, type: 'os', title: 'Storage Management' },
  { id: 11, type: 'os', title: 'Case Studies' }
];

export default function CurriculumCards() {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-background relative z-10 px-6 overflow-hidden">
      {/* Reduced from max-w-7xl to max-w-5xl so the expanded card is naturally thinner */}
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 md:w-1/2">
          <span className="font-mono text-primary font-bold tracking-widest text-sm mb-4 block">
            [ THE SYLLABUS ]
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            A curriculum built for <span className="italic text-textMuted">intuition.</span>
          </h2>
          <p className="text-xl text-textMuted leading-relaxed">
            Explore foundational concepts through interactive visual environments designed to make complex ideas immediately clear.
          </p>
        </div>

        {/* Expanding Accordion Container */}
        <div className="flex w-full h-[450px] md:h-[500px] gap-2 md:gap-3" onMouseLeave={() => setHoveredIndex(0)}>
          {CARDS.map((card, idx) => {
            const isHovered = hoveredIndex === idx;

            // Accurate Visa and Sequoia Gradients based on your references
            const gradientClass = card.type === 'arch'
              ? 'bg-gradient-to-br from-[#fca5f1] via-[#b558ea] to-[#f37335]' // Visa (Pink/Purple/Orange)
              : 'bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff]'; // Sequoia (Deep Blue/Teal)

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => {
                  if (card.link) navigate(card.link);
                }}
                layout
                // Flex ratio changed from 12 to 5 to force a thinner, vertical card shape
                initial={{ flex: idx === 0 ? 5 : 1 }}
                animate={isHovered ? {
                  flex: 5,
                  y: [-8, 8, -8], // The continuous levitation floating effect!
                } : {
                  flex: 1,
                  y: 0
                }}
                transition={{
                  flex: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
                  // Infinite smooth bobbing for the levitation
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
                }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 min-w-[40px] md:min-w-[50px] group ${gradientClass} ${isHovered ? 'shadow-2xl z-10' : 'shadow-md z-0'}`}
              >
                {/* The Skewed White Bottom - NOW HIDDEN WHEN COLLAPSED to keep the pillars looking clean */}
                <motion.div 
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-16 -left-10 -right-10 h-48 bg-white rotate-[-8deg] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] pointer-events-none" 
                />

                {/* The Topic Title (Replacing the Visa Logo) */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                  transition={{ duration: 0.3, delay: isHovered ? 0.15 : 0 }}
                  className="absolute bottom-6 right-6 z-10 max-w-[85%] flex justify-end pointer-events-none"
                >
                  <span className="font-sans font-black italic text-[#1a1f71] text-xl md:text-2xl uppercase tracking-widest text-right leading-tight drop-shadow-sm">
                    {card.title}
                  </span>
                </motion.div>

                {/* Phase Tag at the top left */}
                <motion.div 
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-6 left-6 z-10"
                >
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full font-mono font-bold text-xs text-white uppercase tracking-widest shadow-sm">
                    Phase {card.type === 'arch' ? '01' : '02'}
                  </span>
                </motion.div>

                {/* Vertical text for collapsed state */}
                <motion.div
                  animate={{ opacity: !isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-end justify-center pb-12 pointer-events-none"
                >
                  <span className="font-mono text-white/70 font-bold text-xs tracking-[0.3em] whitespace-nowrap origin-bottom -rotate-90">
                    PHASE {card.type === 'arch' ? '1' : '2'}
                  </span>
                </motion.div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}