// Root-level tool pages: /pdf-to-word, /resize-image, /qr-code etc.
// Server component — handles SEO, then delegates to shared ToolPageClient
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, tools } from "@/lib/tools";
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
    if (!tool) return { title: "Tool Not Found | FileForge" };

    const title = `${tool.name} – Free Online, No Signup Required`;
    const description = toolDesc(tool.name, tool.description, tool.category);
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
            "fileforge",
            "convertx",
        ],
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "website",
            siteName: "ConvertX",
        },
        twitter: {
            card: "summary",
            title,
            description,
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

    const jsonLd = {
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ToolPageClient slug={slug} />
        </>
    );
}
