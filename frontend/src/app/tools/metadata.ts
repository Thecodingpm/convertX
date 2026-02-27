// metadata.ts is picked up by the tools/page.tsx layout automatically
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Free Online File Converter Tools – PDF, Image, Video",
    description:
        "Browse 40+ free file conversion tools. Convert PDF to Word, compress images, resize photos, extract audio, generate QR codes and more. No signup, instant results.",
    keywords: [
        "free online tools", "file converter", "pdf tools", "image tools",
        "video converter", "audio converter", "qr code generator",
        "compress pdf", "resize image", "merge pdf", "no signup"
    ],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fileforge.app"}/tools`,
    },
    openGraph: {
        title: "All Free File Converter Tools | FileForge",
        description: "40+ free tools for PDF, image, audio & video. No account needed.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fileforge.app"}/tools`,
        type: "website",
    },
};
