import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, ImageIcon, Music, Brain,
  Zap, Shield, Clock, ArrowRight,
  FileSpreadsheet, Merge, Package, Scissors,
  Maximize2, Palette, Film, Headphones
} from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ConvertX – Free Online File Converter | PDF, Image, Audio & Video",
  description:
    "Convert files free online with 40+ tools. PDF to Word, compress PDFs, resize images, extract audio from video, MP3 to WAV, QR code generator and more. No signup, no watermarks.",
  keywords: [
    "free file converter", "pdf to word free", "compress pdf", "resize image online",
    "jpg to png", "png to jpg", "merge pdf", "convert video", "mp3 to wav",
    "extract audio", "qr code generator", "pdf to excel", "video to gif",
    "image compressor", "no signup converter", "convertx",
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://convertx.app",
  },
  openGraph: {
    title: "ConvertX – Free Online File Converter",
    description: "40+ free tools for PDF, image, audio & video conversion. No signup required.",
    type: "website",
  },
};



const popularTools = [
  { name: "PDF to Word", slug: "pdf-to-word", icon: FileText, color: "#3b82f6", desc: "Convert PDF to editable Word" },
  { name: "Merge PDFs", slug: "merge-pdfs", icon: Merge, color: "#8b5cf6", desc: "Combine multiple PDFs into one" },
  { name: "Compress PDF", slug: "compress-pdf", icon: Package, color: "#06b6d4", desc: "Reduce PDF file size" },
  { name: "Split PDF", slug: "split-pdf", icon: Scissors, color: "#ef4444", desc: "Split PDF into pages" },
  { name: "PDF to Excel", slug: "pdf-to-excel", icon: FileSpreadsheet, color: "#22c55e", desc: "Extract tables from PDF" },
  { name: "Resize Image", slug: "resize-image", icon: Maximize2, color: "#84cc16", desc: "Resize to any dimension" },
  { name: "Compress Image", slug: "compress-image", icon: Package, color: "#ec4899", desc: "Shrink image file size" },
  { name: "WebP Converter", slug: "webp-converter", icon: Palette, color: "#f97316", desc: "Convert to WebP format" },
  { name: "JPG to PNG", slug: "jpg-to-png", icon: ImageIcon, color: "#3b82f6", desc: "Convert JPG images to PNG" },
  { name: "Extract Audio", slug: "extract-audio", icon: Headphones, color: "#f59e0b", desc: "Pull audio from videos" },
  { name: "Compress Video", slug: "compress-video", icon: Film, color: "#64748b", desc: "Reduce video file size" },
  { name: "Video to GIF", slug: "video-to-gif", icon: Film, color: "#8b5cf6", desc: "Create GIFs from videos" },
];

const categories = [
  { id: "pdf", name: "PDF Tools", icon: FileText, color: "#3b82f6", count: 10 },
  { id: "image", name: "Image Tools", icon: ImageIcon, color: "#22c55e", count: 9 },
  { id: "media", name: "Media Tools", icon: Music, color: "#f59e0b", count: 9 },
  { id: "ai", name: "AI Tools", icon: Brain, color: "#8b5cf6", count: 3, comingSoon: true },
];

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Files processed in seconds" },
  { icon: Shield, title: "100% Private", desc: "Auto-deleted after 1 hour" },
  { icon: Clock, title: "No Signup Needed", desc: "Use any tool instantly, free" },
];

export default function HomePage() {
  return (
    <div className={styles.page}>

      {/* Compact Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>
              <Zap size={13} /> 30+ Free Tools — No Sign Up Ever
            </div>
            <h1 className={styles.heroTitle}>
              Convert any file,<br />
              <span className={styles.heroAccent}>instantly free</span>
            </h1>
            <p className={styles.heroSub}>
              PDF, image, audio &amp; video tools. Drag, drop, download. No account required.
            </p>
            <div className={styles.featureRow}>
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className={styles.featurePill}>
                    <Icon size={14} />
                    <strong>{f.title}</strong>
                    <span>— {f.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools — visible above the fold */}
      <section className={styles.toolsSection}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2>Popular Tools</h2>
            <Link href="/tools" className={styles.viewAll}>
              View all 30 tools <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.toolsGrid}>
            {popularTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.slug} href={`/${tool.slug}`} className={styles.toolCard}>
                  <div className={styles.toolIcon} style={{ background: `${tool.color}18`, color: tool.color }}>
                    <Icon size={22} />
                  </div>
                  <div className={styles.toolBody}>
                    <span className={styles.toolName}>{tool.name}</span>
                    <span className={styles.toolDesc}>{tool.desc}</span>
                  </div>
                  <ArrowRight size={14} className={styles.toolArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className={styles.categorySection}>
        <div className="container">
          <h2 className={styles.catTitle}>Browse by type</h2>
          <div className={styles.categoryRow}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={cat.comingSoon ? "#" : `/tools?category=${cat.id}`}
                  className={`${styles.catCard} ${cat.comingSoon ? styles.catDisabled : ""}`}
                >
                  <div className={styles.catIcon} style={{ background: `${cat.color}18`, color: cat.color }}>
                    <Icon size={24} />
                  </div>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catCount}>{cat.count} tools</span>
                  {cat.comingSoon && <span className={styles.catSoon}>Soon</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple CTA — no account push */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>All tools, completely free</h2>
            <p>No account. No watermarks. No limits. Just convert and download.</p>
            <div className={styles.ctaBtns}>
              <Link href="/tools" className={`btn btn-primary btn-lg ${styles.ctaBtn}`}>
                Browse all tools <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
