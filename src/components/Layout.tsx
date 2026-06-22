import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Camera, History, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Camera, label: "Escanear" },
    { path: "/history", icon: History, label: "Historial" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden">
      <header className="glass-panel-strong px-6 py-4 mx-4 mt-4 rounded-3xl sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-white tracking-tight drop-shadow-sm">
            Nutri<span className="text-brand-400">Scan</span>
          </h1>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 pt-4">
        <div className="max-w-md mx-auto h-full">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm glass-panel-strong flex justify-around items-center h-16 px-2 rounded-3xl z-40">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                isActive ? "text-brand-300" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-white/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 drop-shadow-md" />
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
