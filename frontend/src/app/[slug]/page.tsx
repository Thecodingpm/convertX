// Root-level tool pages: /pdf-to-word, /resize-image, /qr-code etc.
// Server component — handles SEO, schemas, then delegates to shared ToolPageClient
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, tools } from "@/lib/tools";
import { getToolContent } from "@/lib/toolContent";
import ToolPageClient from "@/components/ToolPageClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://convertx.app";

// Static params for all non-comingSoon tools (pre-renders at build time)
export function generateStaticParams() {
    return tools
        .filter((t) => !t.comingSoon)
        .map((t) => ({ slug: t.slug }));
}

function toolDesc(name: string, desc: string, category: string) {
    return `${desc}. Use ${name} free online — no signup, no watermarks, files deleted automatically. Part of ConvertX's free ${category}.`;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const tool = getToolBySlug(slug);
    if (!tool) return { title: "Tool Not Found | ConvertX" };

    const content = getToolContent(slug);
    const title = content
        ? content.h1.slice(0, 60)
        : `${tool.name} – Free Online, No Signup Required`;
    const description = content
        ? `${content.intro} Part of ConvertX's free ${tool.category}.`.slice(0, 160)
        : toolDesc(tool.name, tool.description, tool.category);
    const canonical = `${BASE_URL}/${slug}`;

    return {
        title,
        description,
        keywords: [
            tool.name.toLowerCase(),
            `${tool.name.toLowerCase()} free`,
            `${tool.name.toLowerCase()} online`,
            `${tool.name.toLowerCase()} no signup`,
            `free ${tool.name.toLowerCase()}`,
            tool.category.toLowerCase(),
            "convertx",
            "file converter",
        ],
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "website",
            siteName: "ConvertX",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${tool.name} – ConvertX` }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.png"],
        },
    };
}

export default async function RootToolPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tool = getToolBySlug(slug);

    // Only 404 if the slug truly doesn't match any tool
    if (!tool) notFound();

    const content = getToolContent(slug);

    // ── JSON-LD: WebApplication ───────────────────────────────────────────────
    const webAppJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: tool.name,
        url: `${BASE_URL}/${slug}`,
        description: toolDesc(tool.name, tool.description, tool.category),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "No registration required",
            "Files automatically deleted after 1 hour",
            "Free to use",
            "Works on any device",
        ],
    };

    // ── JSON-LD: BreadcrumbList ───────────────────────────────────────────────
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
            {
                "@type": "ListItem",
                position: 3,
                name: content?.breadcrumbCategory ?? tool.category,
                item: `${BASE_URL}/${content?.breadcrumbCategorySlug ?? "tools"}`,
            },
            { "@type": "ListItem", position: 4, name: tool.name, item: `${BASE_URL}/${slug}` },
        ],
    };

    // ── JSON-LD: FAQPage ──────────────────────────────────────────────────────
    const faqJsonLd = content?.faqs
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
        }
        : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            {/* Breadcrumb nav (visible) */}
            <nav
                aria-label="Breadcrumb"
                style={{
                    maxWidth: "var(--max-width)",
                    margin: "0 auto",
                    padding: "0.75rem var(--space-lg) 0",
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                    display: "flex",
                    gap: "0.35rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <Link href="/" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Home</Link>
                <span>›</span>
                <Link href="/tools" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Tools</Link>
                <span>›</span>
                <Link
                    href={`/${content?.breadcrumbCategorySlug ?? "tools"}`}
                    style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
                >
                    {content?.breadcrumbCategory ?? tool.category}
                </Link>
                <span>›</span>
                <span style={{ color: "var(--color-text-secondary)" }}>{tool.name}</span>
            </nav>

            <ToolPageClient slug={slug} content={content} />
        </>
    );
}
