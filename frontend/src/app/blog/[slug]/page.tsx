import styles from "../page.module.css";

function toTitle(slug: string) {
    return slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const title = toTitle(slug);
    return {
        title: `${title} – FileForge Blog`,
        description: `Read about ${title.toLowerCase()} on the FileForge blog.`,
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const title = toTitle(slug);

    return (
        <div className={styles.page}>
            <div className="container" style={{ maxWidth: 720 }}>
                <article>
                    <h1
                        style={{
                            fontSize: "2rem",
                            fontWeight: 700,
                            marginBottom: "var(--space-md)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {title}
                    </h1>
                    <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-2xl)" }}>
                        Published Feb 2026 · 5 min read
                    </p>
                    <div
                        style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "1.0625rem",
                            lineHeight: 1.8,
                        }}
                    >
                        <p>
                            This is a placeholder post for &quot;{title}&quot;. Real content
                            will be added from a CMS or markdown files.
                        </p>
                        <br />
                        <p>
                            FileForge provides free PDF, image, audio and video conversion tools —
                            no signup, no limits.
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
