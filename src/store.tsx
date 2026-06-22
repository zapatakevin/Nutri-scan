import React, { createContext, useContext, useState, useEffect } from "react";
import { NutriAnalysis } from "./services/gemini";

export interface ScanRecord extends NutriAnalysis {
  id: string;
  date: string;
  imageUrl: string;
}

export interface UserProfile {
  goals: string;
}

interface AppState {
  history: ScanRecord[];
  profile: UserProfile;
  addScan: (scan: ScanRecord) => void;
  updateProfile: (profile: UserProfile) => void;
  clearHistory: () => void;
}

const defaultProfile: UserProfile = {
  goals: "Quiero comer más saludable, reducir el azúcar y evitar alimentos ultraprocesados.",
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<ScanRecord[]>(() => {
    const saved = localStorage.getItem("nutriscan_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("nutriscan_profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("nutriscan_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("nutriscan_profile", JSON.stringify(profile));
  }, [profile]);

  const addScan = (scan: ScanRecord) => {
    setHistory((prev) => [scan, ...prev]);
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <AppContext.Provider value={{ history, profile, addScan, updateProfile, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
