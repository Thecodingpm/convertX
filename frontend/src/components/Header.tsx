"use client";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Zap } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}><Zap size={18} /></span>
                    <span className={styles.logoText}>FileForge</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/tools" className={styles.navLink}>Tools</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                </nav>

                <div className={styles.actions}>
                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
