"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DropzoneProps {
    onFilesSelected: (files: File[]) => void;
    disabled?: boolean;
}

export function Dropzone({ onFilesSelected, disabled }: DropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragActive(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragActive(false);
    }, [disabled]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragActive(true);
    }, [disabled]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);

            if (disabled) return;

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files).filter((file) =>
                    file.type.startsWith("image/")
                );
                onFilesSelected(files);
            }
        },
        [onFilesSelected, disabled]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;
            if (e.target.files && e.target.files.length > 0) {
                const files = Array.from(e.target.files).filter((file) =>
                    file.type.startsWith("image/")
                );
                onFilesSelected(files);
            }
            e.target.value = ""; // Reset input
        },
        [onFilesSelected, disabled]
    );

    return (
        <div>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden",
                    isDragActive
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-border bg-background hover:bg-muted/50 hover:border-muted-foreground/50",
                    disabled && "opacity-50 cursor-not-allowed hover:bg-background hover:border-border"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    title="Select images"
                    aria-label="Select images"
                    onChange={handleFileInput}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />

                <div className="flex flex-col items-center justify-center p-6 text-center z-0 pointer-events-none">
                    <motion.div
                        animate={{ scale: isDragActive ? 1.1 : 1, y: isDragActive ? -5 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn(
                            "p-4 rounded-full mb-4",
                            isDragActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                        )}
                    >
                        <UploadCloud className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">
                        {isDragActive ? "Drop images here" : "Drag & drop your images"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Support JPG, PNG, WebP up to high resolutions. We compress them instantly directly on your device.
                    </p>
                </div>
            </div>
        </div>
    );
}
