"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Dropzone } from "@/components/ui/dropzone";
import { ImageStat, ImageStatsList, formatBytes } from "@/components/ui/image-stats";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Trash2, Github } from "lucide-react";
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
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between p-6 z-10">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
          <Sparkles className="w-6 h-6 text-emerald-500" />
          <span>Image Size Reducer</span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/emreyoleridev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Built by emre yoleri</span>
            <Github className="w-5 h-5 text-[#333] dark:text-white" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col items-center justify-start z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
            <span>100% Client-Side. Private & Secure.</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Reduce image size without losing quality.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Compress multiple images directly in your browser. Download them all as a organized ZIP file with original names intact.
          </p>
        </motion.div>

        <div className="w-full space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border rounded-3xl p-2 shadow-2xl shadow-emerald-500/5">
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
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border">
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

      <footer className="w-full py-6 flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground z-10">
        <a
          href="https://github.com/emreyoleridev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:text-foreground transition-colors sm:hidden"
        >
          <span>Built by emre yoleri</span>
          <Github className="w-4 h-4 text-[#333] dark:text-white" />
        </a>
      </footer>
    </div>
  );
}
