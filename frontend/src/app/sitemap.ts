import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://convertx.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const toolPages = tools
        .filter((t) => !t.comingSoon)
        .map((t) => ({
            url: `${BASE_URL}/${t.slug}`,       // ← root-level URLs: /pdf-to-word etc.
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.9,
        }));

    return [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
        { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        ...toolPages,
    ];
}
