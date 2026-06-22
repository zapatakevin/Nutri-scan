import React, { useState } from "react";
import { useAppContext } from "../store";
import { Save, CheckCircle2, Target, Info } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function Profile() {
  const { profile, updateProfile } = useAppContext();
  const [goals, setGoals] = useState(profile.goals);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ goals });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <header>
        <h2 className="text-2xl font-display font-bold text-white drop-shadow-md">Tu Perfil</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Personaliza tu experiencia
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-[2rem]"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl glass-panel-strong text-brand-300 flex items-center justify-center border-brand-400/30">
            <Target size={24} />
          </div>
          <label className="block text-lg font-display font-bold text-white drop-shadow-sm">
            Objetivos de Salud
          </label>
        </div>

        <div className="glass-input p-4 rounded-2xl flex items-start space-x-3 mb-6">
          <Info size={18} className="text-brand-300 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Nuestra IA analizará cada producto basándose en lo que escribas aquí. 
            Puedes incluir condiciones médicas, dietas específicas o metas personales.
          </p>
        </div>
        
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="w-full h-40 p-5 glass-input rounded-2xl focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all resize-none text-sm text-white placeholder:text-slate-400"
          placeholder="Ej: Soy diabético, busco productos bajos en sodio y quiero evitar ultraprocesados..."
        />

        <button
          onClick={handleSave}
          disabled={saved}
          className={cn(
            "mt-8 w-full font-display font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg shadow-brand-500/20",
            saved ? "bg-emerald-500/80 backdrop-blur-md border border-emerald-400/50 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)]" : "glass-button text-white"
          )}
        >
          {saved ? (
            <>
              <CheckCircle2 size={20} />
              <span>Perfil Actualizado</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </motion.div>

      <div className="glass-panel-strong border-brand-400/30 p-6 rounded-[2rem]">
        <h3 className="text-brand-300 font-display font-bold mb-2 drop-shadow-sm">¿Cómo funciona?</h3>
        <p className="text-white/80 text-xs leading-relaxed">
          Cada vez que escaneas un producto, NutriScan compara los valores nutricionales con tus objetivos y te da una calificación personalizada.
        </p>
      </div>
    </div>
  );
}
