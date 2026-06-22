import React from "react";
import { useAppContext } from "../store";
import { ResultCard } from "./ResultCard";
import { Trash2, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export function History() {
  const { history, clearHistory } = useAppContext();

  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-24 h-24 glass-panel-strong rounded-[2rem] flex items-center justify-center mb-6 text-slate-400">
          <Inbox size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2 drop-shadow-md">No hay historial</h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-[200px]">
          Escanea tu primer producto para verlo aquí.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white drop-shadow-md">Tus Escaneos</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            {history.length} productos guardados
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("¿Estás seguro de que quieres borrar todo el historial?")) {
              clearHistory();
            }
          }}
          className="w-12 h-12 glass-panel-strong border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          title="Borrar historial"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {history.map((scan, index) => (
            <motion.div 
              key={scan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center space-x-3 mb-4 ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {new Date(scan.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <ResultCard data={scan} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
