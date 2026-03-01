import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blogPosts";
import styles from "../page.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://convertx.app";

export function generateStaticParams() {
    return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) return { title: "Post Not Found | smartconvertx Blog" };
    const canonical = `${BASE_URL}/blog/${slug}`;
    return {
        title: `${post.title} | smartconvertx Blog`,
        description: post.excerpt,
        alternates: { canonical },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: canonical,
            type: "article",
            publishedTime: post.date,
            siteName: "smartconvertx",
        },
        twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) notFound();

    const related = getRelatedPosts(slug, post.relatedSlugs);

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        publisher: { "@type": "Organization", name: "smartconvertx", url: BASE_URL },
        url: `${BASE_URL}/blog/${slug}`,
    };

    return (
        <div className={styles.page}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

            <div className="container" style={{ maxWidth: 760 }}>
                <nav style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                    <Link href="/">Home</Link> &rsaquo; <Link href="/blog">Blog</Link> &rsaquo; {post.category}
                </nav>

                <article>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary)" }}>
                            {post.category}
                        </span>
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem", marginLeft: "1rem" }}>
                            {post.date} · {post.readTime}
                        </span>
                    </div>

                    <h1 style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.3 }}>
                        {post.title}
                    </h1>

                    <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", marginBottom: "2rem", lineHeight: 1.7 }}>
                        {post.excerpt}
                    </p>

                    <hr style={{ border: "none", borderTop: "1px solid var(--color-border-light)", marginBottom: "2rem" }} />

                    <div
                        className="blog-content"
                        style={{ color: "var(--color-text-secondary)", fontSize: "1.0625rem", lineHeight: 1.85 }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Related posts */}
                {related.length > 0 && (
                    <section style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border-light)" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>Related Articles</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                            {related.map((p) => (
                                <Link
                                    key={p.slug}
                                    href={`/blog/${p.slug}`}
                                    style={{
                                        display: "block",
                                        padding: "1rem",
                                        borderRadius: "var(--radius-lg)",
                                        border: "1.5px solid var(--color-border-light)",
                                        background: "var(--color-surface)",
                                        textDecoration: "none",
                                        color: "var(--color-text)",
                                    }}
                                >
                                    <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600, marginBottom: "0.35rem" }}>
                                        {p.category}
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem", lineHeight: 1.4 }}>{p.title}</div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.35rem" }}>{p.readTime}</div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tool CTA */}
                {post.toolSlug && (
                    <div style={{
                        marginTop: "3rem",
                        padding: "1.5rem",
                        borderRadius: "var(--radius-xl)",
                        background: "linear-gradient(135deg, var(--color-primary-light) 0%, transparent 100%)",
                        border: "1.5px solid var(--color-primary-light)",
                        textAlign: "center",
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Ready to try it yourself?</p>
                        <Link href={`/${post.toolSlug}`} style={{
                            display: "inline-block",
                            padding: "0.6rem 1.5rem",
                            background: "var(--color-primary)",
                            color: "#fff",
                            borderRadius: "var(--radius-full)",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            textDecoration: "none",
                        }}>
                            Use the Free Tool →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
