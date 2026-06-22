import React from "react";
import { NutriAnalysis } from "../services/gemini";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface ResultCardProps {
  data: NutriAnalysis;
}

export function ResultCard({ data }: ResultCardProps) {
  const getEvaluationConfig = (evalType: string) => {
    switch (evalType.toLowerCase()) {
      case "saludable":
        return {
          color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          icon: <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" size={24} />,
          label: "Saludable",
          accent: "bg-emerald-400",
        };
      case "moderado":
        return {
          color: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icon: <AlertTriangle className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={24} />,
          label: "Moderado",
          accent: "bg-amber-400",
        };
      case "no saludable":
        return {
          color: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          icon: <XCircle className="text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" size={24} />,
          label: "No Saludable",
          accent: "bg-rose-400",
        };
      default:
        return {
          color: "bg-slate-500/10 text-slate-300 border-slate-500/30",
          icon: <AlertTriangle className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]" size={24} />,
          label: "Desconocido",
          accent: "bg-slate-400",
        };
    }
  };

  const config = getEvaluationConfig(data.evaluation);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[2rem] overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 pb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white leading-tight pr-4 drop-shadow-md">
            {data.productName}
          </h2>
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border", config.color)}>
            {config.icon}
          </div>
        </div>
        
        <div className={cn("relative p-5 rounded-2xl border backdrop-blur-md overflow-hidden", config.color)}>
          <div className={cn("absolute top-0 left-0 w-1 h-full shadow-[0_0_10px_currentColor]", config.accent)} />
          <p className="font-display font-bold text-lg leading-tight mb-1">{config.label}</p>
          <p className="text-sm opacity-90 leading-relaxed text-white/80">{data.reason}</p>
        </div>
      </div>

      {/* Nutrients Grid */}
      <div className="px-8 py-6 bg-black/20 border-y border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Valores Nutricionales</h3>
          <div className="h-px flex-1 bg-white/10 ml-4" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NutrientItem label="Calorías" value={data.nutrients.calories} />
          <NutrientItem label="Grasas" value={data.nutrients.fat} />
          <NutrientItem label="Grasas Sat." value={data.nutrients.saturatedFat} />
          <NutrientItem label="Azúcares" value={data.nutrients.sugar} />
          <NutrientItem label="Sodio" value={data.nutrients.sodium} className="col-span-2" />
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-8 pt-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Recomendación</h3>
        </div>
        <p className="text-white/90 text-sm leading-relaxed font-medium">
          {data.recommendation}
        </p>
      </div>
    </motion.div>
  );
}

function NutrientItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("glass-input p-4 rounded-2xl transition-transform hover:scale-[1.02]", className)}>
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">{label}</p>
      <p className="font-display font-semibold text-white text-lg drop-shadow-sm">{value}</p>
    </div>
  );
}
