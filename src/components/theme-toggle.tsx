"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="relative cursor-pointer inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-black/5 hover:text-black dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background"
            >
                <span className="sr-only">Toggle theme</span>
                <div className="relative w-5 h-5 flex items-center justify-center"></div>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="relative cursor-pointer inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-black/5 hover:text-black dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background"
        >
            <span className="sr-only">Toggle theme</span>
            <div className="relative w-5 h-5 flex items-center justify-center">
                <motion.div
                    initial={false}
                    animate={{ scale: resolvedTheme === "dark" ? 0 : 1, opacity: resolvedTheme === "dark" ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                >
                    <Sun className="h-5 w-5" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{ scale: resolvedTheme === "dark" ? 1 : 0, opacity: resolvedTheme === "dark" ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                >
                    <Moon className="h-5 w-5" />
                </motion.div>
            </div>
        </button>
    );
}
