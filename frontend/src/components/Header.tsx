"use client";
import Link from "next/link";
import { Zap } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
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
                </nav>

                <div className={styles.actions}>
                    <Link href="/tools" className="btn btn-primary btn-sm">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
