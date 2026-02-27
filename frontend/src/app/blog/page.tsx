import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
    title: "Blog – FileForge",
    description: "Tips, tutorials, and updates about file conversion, productivity, and digital tools.",
};

const posts = [
    {
        slug: "how-to-compress-pdf-without-losing-quality",
        title: "How to Compress PDF Without Losing Quality",
        excerpt: "Learn the best techniques to reduce PDF file size while maintaining document quality for sharing and storage.",
        date: "Feb 20, 2026",
        category: "PDF Tools",
        readTime: "5 min read",
    },
    {
        slug: "webp-vs-jpg-vs-png-which-image-format-to-use",
        title: "WebP vs JPG vs PNG: Which Image Format Should You Use?",
        excerpt: "Understand the differences between popular image formats and when to use each one for optimal performance.",
        date: "Feb 18, 2026",
        category: "Image Tools",
        readTime: "7 min read",
    },
    {
        slug: "convert-video-to-gif-ultimate-guide",
        title: "The Ultimate Guide to Converting Video to GIF",
        excerpt: "Everything you need to know about creating high-quality GIFs from video files for social media and presentations.",
        date: "Feb 15, 2026",
        category: "Media Tools",
        readTime: "6 min read",
    },
    {
        slug: "batch-file-conversion-tips",
        title: "5 Tips for Efficient Batch File Conversion",
        excerpt: "Save time with these proven strategies for converting multiple files at once using FileForge's batch tools.",
        date: "Feb 12, 2026",
        category: "Tips & Tricks",
        readTime: "4 min read",
    },
];

export default function BlogPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Blog</h1>
                    <p>Tips, tutorials, and updates from the FileForge team</p>
                </div>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.cardMeta}>
                                <span className="badge badge-primary">{post.category}</span>
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
