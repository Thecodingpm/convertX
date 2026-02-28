import Link from "next/link";
import { Zap } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <div className={styles.logoMark}>
                                <Zap size={14} strokeWidth={2.5} />
                            </div>
                            <span className={styles.logoText}>ConvertX</span>
                        </div>
                        <p className={styles.tagline}>
                            40+ free file tools — PDF, image, audio &amp; video.
                            No signup, no watermarks, files auto-deleted after 1 hour.
                        </p>
                        <p className={styles.copyright}>
                            © {new Date().getFullYear()} ConvertX. All rights reserved.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>PDF Tools</h4>
                        <Link href="/pdf-to-word">PDF to Word</Link>
                        <Link href="/merge-pdfs">Merge PDFs</Link>
                        <Link href="/compress-pdf">Compress PDF</Link>
                        <Link href="/split-pdf">Split PDF</Link>
                        <Link href="/pdf-to-jpg">PDF to JPG</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Image Tools</h4>
                        <Link href="/jpg-to-png">JPG to PNG</Link>
                        <Link href="/resize-image">Resize Image</Link>
                        <Link href="/compress-image">Compress Image</Link>
                        <Link href="/remove-background">Remove Background</Link>
                        <Link href="/image-to-pdf">Image to PDF</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Media Tools</h4>
                        <Link href="/extract-audio">Extract Audio</Link>
                        <Link href="/compress-video">Compress Video</Link>
                        <Link href="/video-to-gif">Video to GIF</Link>
                        <Link href="/mp4-to-mp3">MP4 to MP3</Link>
                        <Link href="/mp3-to-wav">MP3 to WAV</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="/tools">All Tools</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms">Terms &amp; Conditions</Link>
                        <Link href="/disclaimer">Disclaimer</Link>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>
                        Made with ❤️ for students, professionals, and everyone who needs free file tools.
                    </p>
                    <p className={styles.bottomLinks}>
                        <Link href="/privacy-policy">Privacy</Link>
                        <span>·</span>
                        <Link href="/terms">Terms</Link>
                        <span>·</span>
                        <Link href="/disclaimer">Disclaimer</Link>
                        <span>·</span>
                        <Link href="/contact">Contact</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
