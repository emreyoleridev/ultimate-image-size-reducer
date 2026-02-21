"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Dropzone } from "@/components/ui/dropzone";
import { ImageStat, ImageStatsList, formatBytes } from "@/components/ui/image-stats";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Trash2, Github, ShieldCheck, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [stats, setStats] = useState<ImageStat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImages = useCallback(async (files: File[]) => {
    setIsProcessing(true);

    const newStats: ImageStat[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      originalSize: file.size,
      status: "pending",
    }));

    setStats((prev) => [...prev, ...newStats]);

    for (let i = 0; i < newStats.length; i++) {
      const currentStat = newStats[i];

      setStats((prev) =>
        prev.map((s) => s.id === currentStat.id ? { ...s, status: "compressing" } : s)
      );

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedBlob = await imageCompression(currentStat.file, options);

        setStats((prev) =>
          prev.map((s) => s.id === currentStat.id
            ? { ...s, status: "done", compressedSize: compressedBlob.size, compressedBlob }
            : s
          )
        );
      } catch (error) {
        console.error("Compression error:", error);
        setStats((prev) =>
          prev.map((s) => s.id === currentStat.id ? { ...s, status: "error" } : s)
        );
      }
    }

    setIsProcessing(false);
  }, []);

  const handleDownloadAll = async () => {
    const doneStats = stats.filter(s => s.status === "done" && s.compressedBlob);
    if (doneStats.length === 0) return;

    const zip = new JSZip();

    doneStats.forEach(stat => {
      // Create a new File from the Blob to preserve the original filename
      zip.file(stat.file.name, stat.compressedBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "compressed_images.zip");
  };

  const clearAll = () => {
    setStats([]);
  };

  const totalOriginalSize = stats.reduce((acc, s) => acc + s.originalSize, 0);
  const totalCompressedSize = stats.reduce((acc, s) => acc + (s.compressedSize || s.originalSize), 0);
  const isAllDone = stats.length > 0 && stats.every(s => s.status === "done" || s.status === "error");
  const showSummary = stats.length > 0;

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-background">
      {/* Background decoration elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 xl:px-8 py-4 z-10 border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0">
        <div className="flex items-center space-x-2 font-black text-xl tracking-tighter">
          <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-foreground">
            Image<span className="text-emerald-500">Reducer</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/emreyoleridev"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground rounded-lg transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 flex flex-col items-center justify-start z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4 flex flex-col items-center w-full"
        >
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-widest mb-4 border border-emerald-200 dark:border-emerald-500/20 shadow-sm uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% SECURE & CLIENT-SIDE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-balance leading-[1.1] mb-2">
            The Ultimate
            <br />
            <span className="text-emerald-500 dark:text-emerald-400">
              Free Image Reducer
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto text-balance mt-4">
            Compress, optimize, and manage your images directly from your browser. Zero uploads, zero subscriptions, maximum privacy.
          </p>
        </motion.div>

        <div className="w-full max-w-3xl space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border rounded-[2rem] p-2 shadow-2xl shadow-emerald-500/5">
            <Dropzone onFilesSelected={processImages} disabled={isProcessing} />
          </div>

          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border mt-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Batch Summary</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.length} files • {formatBytes(totalOriginalSize)}
                      {isAllDone && totalCompressedSize < totalOriginalSize && (
                        <span> → <strong className="text-emerald-600 dark:text-emerald-400">{formatBytes(totalCompressedSize)}</strong></span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={clearAll}
                      disabled={isProcessing}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleDownloadAll}
                      disabled={!isAllDone || stats.length === 0}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download ZIP
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ImageStatsList stats={stats} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 flex flex-col items-center justify-center space-y-6 text-sm text-muted-foreground z-10 border-t border-border/50 mt-auto bg-background/50">
        <p className="font-medium text-foreground text-sm sm:text-base">
          Built with <span className="text-red-500 mx-1">❤️</span> by <strong>Emre Yoleri</strong>
        </p>

        <div className="flex items-center justify-center space-x-4 flex-wrap gap-y-3">
          <a
            href="https://github.com/emreyoleridev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-border bg-background hover:bg-muted font-medium transition-colors text-foreground shadow-sm"
          >
            <Github className="w-4 h-4 mr-2 text-foreground" />
            GitHub
          </a>
          <a
            href="https://buymeacoffee.com/emreyoleridev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-900/50 font-medium transition-colors shadow-sm"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Buy Me a Coffee
          </a>
        </div>
      </footer>

      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-background border border-border/50 shadow-lg rounded-full overflow-hidden [&>button]:rounded-full [&>button]:p-3">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
