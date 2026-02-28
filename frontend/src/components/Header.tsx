"use client";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoMark}>
                        <Zap size={16} strokeWidth={2.5} />
                    </div>
                    <span className={styles.logoText}>ConvertX</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/tools" className={styles.navLink}>Tools</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                    <Link href="/about" className={styles.navLink}>About</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </nav>

                <div className={styles.actions}>
                    <Link href="/tools" className="btn btn-primary btn-sm">
                        Get Started
                    </Link>
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className={styles.mobileNav}>
                    <Link href="/tools" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Tools</Link>
                    <Link href="/blog" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Blog</Link>
                    <Link href="/about" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>About</Link>
                    <Link href="/contact" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Contact</Link>
                </div>
            )}
        </header>
    );
}
