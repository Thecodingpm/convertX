import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { blogPosts } from "@/lib/blogPosts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://smartconvertx.online";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    const toolPages: MetadataRoute.Sitemap = tools
        .filter((t) => !t.comingSoon)
        .map((t) => ({
            url: `${BASE_URL}/${t.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85,
        }));

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticPages, ...toolPages, ...blogPages];
}
