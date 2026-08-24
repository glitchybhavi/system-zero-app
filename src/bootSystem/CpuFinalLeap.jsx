import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CpuFinalLeap() {
  const { theme } = useTheme();

  return (
    <section className="relative w-full min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden py-20">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className={`w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 transition-colors duration-1000 ${theme === 'dark' ? 'bg-purple-600' : 'bg-orange-500'}`} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-textMain tracking-tight mb-4">
            The Core is <span className="italic">Forged.</span>
          </h2>
          <p className="text-textMuted text-lg">
            Hardware architecture successfully compiled. The system awaits software instructions.
          </p>
        </motion.div>

        {/* The Smashing Chip Image */}
        <motion.div
          initial={{ scale: 3, opacity: 0, y: -100 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
          className="relative w-full max-w-2xl mx-auto mb-16 rounded-xl overflow-hidden shadow-2xl ring-1 ring-borderLine"
        >
          {/* IMPORTANT: Ensure the path to the image is correct based on your project structure */}
          <img 
  src="cpu.png" 
  alt="CPU Silicon Core" 
  className="w-full h-auto object-cover"
/>
          {/* Subtle overlay flash effect on impact */}
          <motion.div 
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute inset-0 bg-white"
          />
        </motion.div>

        {/* The Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className={`group relative flex items-center justify-center gap-3 px-10 py-4 text-white font-bold text-lg rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
            theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30' : 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/30'
          }`}
        >
          <span className="relative z-10 font-mono tracking-widest">UNBOOT SYSTEM</span>
          <Power size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
          
          {/* Shine effect across the button */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
        </motion.button>
        
      </div>
    </section>
  );
}