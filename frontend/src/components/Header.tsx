"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoTextWrapper}>
                        <span className={styles.logoSmart}>Smart</span><span className={styles.logoConvert}>convertx</span>
                    </span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/tools" className={styles.navLink}>Tools</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                </nav>

                <div className={styles.actions}>
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className={styles.mobileNav}>
                    <Link href="/tools" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Tools</Link>
                    <Link href="/blog" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Blog</Link>
                </div>
            )}
        </header>
    );
}
