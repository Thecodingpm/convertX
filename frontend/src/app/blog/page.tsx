import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blogPosts";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Blog – File Conversion Tips, Guides & Tutorials | pdfconvertx",
    description: "Free guides on compressing PDFs, resizing images for government portals, converting videos to GIF, and more. Tips for students and professionals in Pakistan and India.",
    alternates: { canonical: "https://convertx.app/blog" },
};

const categoryColors: Record<string, string> = {
    "PDF Tools": "#ef4444",
    "Image Tools": "#8b5cf6",
    "Media Tools": "#3b82f6",
    "Tips & Tricks": "#22c55e",
    "Utility Tools": "#f59e0b",
};

export default function BlogPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <nav style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                    <Link href="/">Home</Link> &rsaquo; Blog
                </nav>

                <div className={styles.header}>
                    <h1>pdfconvertx Blog</h1>
                    <p>Free guides, tutorials, and best practices for file conversion — written for students, job applicants, and professionals.</p>
                </div>

                <div className={styles.grid}>
                    {blogPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.cardMeta}>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: categoryColors[post.category] ?? "var(--color-primary)",
                                        background: `${categoryColors[post.category] ?? "var(--color-primary)"}15`,
                                        padding: "2px 10px",
                                        borderRadius: "99px",
                                    }}
                                >
                                    {post.category}
                                </span>
                                <span className={styles.readTime}>{post.readTime}</span>
                            </div>
                            <h2>{post.title}</h2>
                            <p>{post.excerpt}</p>
                            <span className={styles.date}>{post.date}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
