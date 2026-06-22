import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useZxing } from "react-zxing";
import { Camera, AlertCircle, RefreshCw, Upload, ScanLine } from "lucide-react";
import { motion } from "motion/react";
import { analyzeNutritionLabel, evaluateNutrients, NutriAnalysis } from "../services/gemini";
import { useAppContext } from "../store";
import { ResultCard } from "./ResultCard";
import { AILoading } from "./AILoading";
import { cn } from "../lib/utils";

export function Scanner() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, addScan } = useAppContext();
  
  const [scanMode, setScanMode] = useState<"label" | "barcode">("label");
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NutriAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const { ref: barcodeRef } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      if (!isAnalyzing && !image && !error && text !== lastScannedRef.current) {
        lastScannedRef.current = text;
        handleBarcode(text);
      }
    },
    onError(err: any) {
      console.error("Zxing error:", err);
      if (err?.name === "NotAllowedError" || err?.message?.includes("Permission denied")) {
        setError("Permiso de cámara denegado. Puedes subir una foto desde tu galería usando el botón de abajo.");
      }
    },
    paused: scanMode !== "barcode" || isAnalyzing || !!image || !!error,
  });

  const [cameraKey, setCameraKey] = useState(0);

  React.useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Tu navegador no soporta el acceso a la cámara. Puedes subir una foto usando el botón de abajo.");
    }
  }, []);

  const onUserMedia = useCallback((stream: MediaStream) => {
    console.log("Camera stream started:", stream);
    setError(null);
  }, []);

  const onUserMediaError = useCallback((err: string | DOMException) => {
    console.error("Camera error:", err);
    let errorMessage = "No se pudo acceder a la cámara.";
    
    const isIframe = window.self !== window.top;
    
    if (err.toString().includes("NotAllowedError") || err.toString().includes("Permission denied")) {
      if (isIframe) {
        errorMessage = "El navegador bloquea la cámara en esta vista previa. Por favor, abre la app en una NUEVA PESTAÑA (icono arriba a la derecha) o usa el botón de subir foto.";
      } else {
        errorMessage = "Permiso de cámara denegado. Por favor, permite el acceso en tu navegador o usa el botón de subir foto.";
      }
    } else if (err.toString().includes("NotFoundError")) {
      errorMessage = "No se encontró ninguna cámara en este dispositivo.";
    } else {
      errorMessage = `Error de cámara: ${err.toString()}. Puedes subir una foto manualmente.`;
    }
    
    setError(errorMessage);
  }, []);

  const retryCamera = () => {
    setCameraKey(prev => prev + 1);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      analyzeImage(imageSrc);
    }
  }, [webcamRef]);

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeNutritionLabel(base64Image, profile.goals);
      setResult(analysis);
      
      addScan({
        ...analysis,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        imageUrl: base64Image,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Hubo un error al analizar la imagen. Asegúrate de que la tabla nutricional sea visible.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBarcode = async (barcode: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await res.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        const analysis = await evaluateNutrients(
          product.product_name || "Producto Desconocido",
          product.nutriments || {},
          profile.goals
        );
        
        setResult(analysis);
        const productImageUrl = product.image_front_url || product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop";
        setImage(productImageUrl);
        
        addScan({
          ...analysis,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          imageUrl: productImageUrl,
        });
      } else {
        setError("Producto no encontrado en la base de datos. Intenta escanear la tabla nutricional.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al buscar el código de barras o al analizar los nutrientes.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    lastScannedRef.current = null;
  };

  return (
    <div className="h-full flex flex-col">
      {!image ? (
        <div className="relative flex-1 flex flex-col overflow-hidden rounded-[2rem] mx-4 mb-4 border border-white/10 shadow-2xl bg-black/40">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="flex-1 relative">
            {scanMode === "label" ? (
              /* @ts-ignore */
              <Webcam
                key={`webcam-${cameraKey}`}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                onUserMedia={onUserMedia}
                onUserMediaError={onUserMediaError}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <video 
                key={`barcode-${cameraKey}`}
                ref={barcodeRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                playsInline 
                muted 
              />
            )}

            {/* Overlay Frames */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 pb-40">
              {scanMode === "label" ? (
                <>
                  <div className="w-full max-w-xs aspect-[3/4] border-2 border-white/30 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute inset-0 scanner-overlay opacity-40" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-3xl" />
                  </div>
                  <p className="mt-6 text-white/90 text-xs font-bold uppercase tracking-[0.2em] glass-panel-strong px-6 py-3 rounded-full text-center">
                    Escanea la tabla nutricional
                  </p>
                </>
              ) : (
                <>
                  <div className="w-full max-w-xs aspect-video border-2 border-emerald-400/40 rounded-3xl relative overflow-hidden bg-emerald-400/5">
                    <div className="absolute inset-0 scanner-overlay opacity-30" />
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
                  </div>
                  <p className="mt-6 text-white/90 text-xs font-bold uppercase tracking-[0.2em] glass-panel-strong border-emerald-400/30 px-6 py-3 rounded-full text-center">
                    Apunta al código de barras
                  </p>
                </>
              )}
            </div>

            {/* Unified Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 pt-24 pb-8 px-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center justify-end z-20">
              
              {/* Mode Toggle */}
              <div className="glass-panel-strong p-1.5 rounded-2xl flex space-x-1 mb-8">
                <button
                  onClick={() => setScanMode("label")}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300", 
                    scanMode === "label" ? "bg-white/20 text-white shadow-lg border border-white/20" : "text-white/60 hover:text-white"
                  )}
                >
                  Etiqueta
                </button>
                <button
                  onClick={() => setScanMode("barcode")}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300", 
                    scanMode === "barcode" ? "bg-white/20 text-white shadow-lg border border-white/20" : "text-white/60 hover:text-white"
                  )}
                >
                  Código
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-8 w-full max-w-xs">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center space-y-2 text-white/80 hover:text-white transition-colors active:scale-90"
                >
                  <div className="w-12 h-12 glass-panel-strong rounded-2xl flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Galería</span>
                </button>
                
                {scanMode === "label" ? (
                  <button
                    onClick={capture}
                    className="group relative w-20 h-20 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping group-hover:animate-none" />
                    <div className="relative w-16 h-16 glass-panel-strong rounded-full flex items-center justify-center border-[3px] border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center bg-white/20">
                        <Camera size={24} className="text-white drop-shadow-md" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full glass-panel-strong flex items-center justify-center border-[3px] border-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                      <ScanLine size={24} className="text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                )}

                <div className="w-12 h-12" /> {/* Spacer for centering */}
              </div>
            </div>
          </div>
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-50 rounded-[2rem]">
              <AILoading />
            </div>
          )}
          
          {error && !image && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-32 left-6 right-6 glass-panel-strong border-rose-500/50 bg-rose-950/80 text-white p-6 rounded-3xl flex flex-col items-center space-y-4 z-40"
            >
              <div className="flex items-start space-x-4 w-full">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <AlertCircle size={24} />
                </div>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <div className="flex space-x-3 w-full">
                <button 
                  onClick={() => {
                    setError(null);
                    lastScannedRef.current = null;
                    if (error.includes("cámara")) {
                      retryCamera();
                    }
                  }}
                  className="flex-1 glass-panel-strong text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform hover:bg-white/10"
                >
                  {error.includes("cámara") ? "Reintentar" : "Entendido"}
                </button>
                {error.includes("cámara") && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-rose-500/80 backdrop-blur-md text-white border border-rose-400/50 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  >
                    <Upload size={16} />
                    <span>Subir Foto</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-video glass-panel rounded-[2rem] overflow-hidden mb-8 shrink-0 p-2"
          >
            <img src={image} alt="Captured" className="w-full h-full object-cover rounded-[1.5rem] opacity-90" />
            <div className="absolute inset-2 bg-gradient-to-t from-black/60 to-transparent rounded-[1.5rem] pointer-events-none" />
            <button 
              onClick={reset}
              className="absolute top-6 right-6 glass-panel-strong p-3 rounded-2xl text-white hover:bg-white/30 transition-all active:scale-90"
            >
              <RefreshCw size={22} />
            </button>
          </motion.div>

          {isAnalyzing && !result && (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <AILoading />
            </div>
          )}

          {error && (
            <div className="glass-panel-strong border-rose-500/30 bg-rose-900/30 text-rose-200 p-6 rounded-3xl flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {result && (
            <div className="pb-12">
              <ResultCard data={result} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
