import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Sparkles, Activity } from 'lucide-react';

const loadingSteps = [
  "Extrayendo información nutricional...",
  "Analizando ingredientes clave...",
  "Evaluando perfil de salud...",
  "Generando recomendaciones..."
];

export function AILoading() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-10 w-full">
      {/* Glowing AI Brain */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer pulsing rings */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-brand-400 blur-2xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-4 rounded-full border border-brand-300/30"
        />
        
        {/* Inner glass sphere */}
        <div className="relative z-10 w-20 h-20 glass-panel-strong rounded-full flex items-center justify-center border-brand-300/40 shadow-[0_0_40px_rgba(74,222,128,0.5)]">
          <BrainCircuit className="text-brand-300 w-10 h-10 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          
          {/* Orbiting sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-brand-200 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
              <Sparkles size={16} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Text */}
      <div className="h-16 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            className="font-display font-bold text-white text-center tracking-wide text-lg drop-shadow-md"
          >
            {loadingSteps[step]}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center space-x-2 mt-4 glass-panel-strong px-4 py-1.5 rounded-full border-brand-400/20">
          <Activity size={12} className="text-brand-400 animate-pulse" />
          <p className="text-[9px] uppercase tracking-[0.2em] text-brand-300 font-bold">
            Motor de IA Activo
          </p>
        </div>
      </div>
    </div>
  );
}
