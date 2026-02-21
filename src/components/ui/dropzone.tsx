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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div
                className={`
                    relative border border-dashed rounded-[1.5rem] p-10 sm:p-16 text-center transition-all duration-500
                    ${isDragActive ? 'border-emerald-500 bg-emerald-500/5 scale-[0.99]' : 'border-border hover:border-emerald-500/50 hover:bg-muted/30'}
                    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                `}
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

                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground z-0 pointer-events-none relative">
                    <UploadCloud className="w-6 h-6 stroke-[1.5]" />
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mb-2 z-0 pointer-events-none relative">
                    {isDragActive ? "Drop images here" : "Click to upload or drag and drop"}
                </h2>
                <p className="text-muted-foreground font-bold text-xs tracking-wide z-0 pointer-events-none relative">
                    Support JPG, PNG, WebP up to high resolutions. 100% processed entirely on your device.
                </p>
            </div>
        </motion.div>
    );
}
