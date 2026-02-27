import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span>⚒</span>
                            <span>FileForge</span>
                        </div>
                        <p className={styles.tagline}>
                            The all-in-one smart file toolkit. Convert, compress, and
                            transform files effortlessly.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>PDF Tools</h4>
                        <Link href="/tools/pdf-to-word">PDF to Word</Link>
                        <Link href="/tools/merge-pdfs">Merge PDFs</Link>
                        <Link href="/tools/compress-pdf">Compress PDF</Link>
                        <Link href="/tools/split-pdf">Split PDF</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Image Tools</h4>
                        <Link href="/tools/jpg-to-png">JPG to PNG</Link>
                        <Link href="/tools/resize-image">Resize Image</Link>
                        <Link href="/tools/compress-image">Compress Image</Link>
                        <Link href="/tools/image-to-pdf">Image to PDF</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Company</h4>
                        <Link href="/pricing">Pricing</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/login">Sign In</Link>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {new Date().getFullYear()} FileForge. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
