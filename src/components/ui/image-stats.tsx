"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileImage, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export interface ImageStat {
    file: File;
    id: string;
    originalSize: number;
    compressedSize?: number;
    status: "pending" | "compressing" | "done" | "error";
    compressedBlob?: Blob;
}

interface ImageStatsListProps {
    stats: ImageStat[];
}

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ImageStatsList({ stats }: ImageStatsListProps) {
    if (stats.length === 0) return null;

    return (
        <div className="w-full space-y-3 mt-8">
            <h3 className="text-lg font-medium px-1">Selected Images ({stats.length})</h3>
            <div className="space-y-3">
                {stats.map((stat, i) => {
                    const savingsRatio = stat.compressedSize
                        ? (1 - stat.compressedSize / stat.originalSize) * 100
                        : 0;

                    return (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            className="flex items-center justify-between p-4 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden relative group"
                        >
                            <div className="flex items-center space-x-4 overflow-hidden">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                                    <FileImage className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate shrink-0 max-w-[200px] sm:max-w-xs">{stat.file.name}</p>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
                                        <span>{formatBytes(stat.originalSize)}</span>
                                        {stat.status === "done" && stat.compressedSize && (
                                            <>
                                                <ArrowRight className="w-3 h-3" />
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {formatBytes(stat.compressedSize)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 shrink-0">
                                {stat.status === "done" && savingsRatio > 0 && (
                                    <div className="hidden sm:block text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                                        -{savingsRatio.toFixed(1)}%
                                    </div>
                                )}

                                {stat.status === "pending" || stat.status === "compressing" ? (
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                ) : stat.status === "done" ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <span className="text-xs text-red-500">Error</span>
                                )}
                            </div>

                            {/* Progress background line for visual flair */}
                            {(stat.status === "done") && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute bottom-0 left-0 h-0.5 bg-emerald-500/50"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
