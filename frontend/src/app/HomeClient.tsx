"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FileText, ImageIcon, Music, Brain,
    Zap, Shield, Clock, ArrowRight,
    FileSpreadsheet, Merge, Package, Scissors,
    Maximize2, Palette, Film, Headphones, Search
} from "lucide-react";
import { tools } from "@/lib/tools";
import styles from "./page.module.css";

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
    { id: "pdf", name: "PDF Tools", icon: FileText, color: "#3b82f6", count: 14 },
    { id: "image", name: "Image Tools", icon: ImageIcon, color: "#22c55e", count: 9 },
    { id: "media", name: "Media Tools", icon: Music, color: "#f59e0b", count: 9 },
    { id: "ai", name: "AI Tools", icon: Brain, color: "#8b5cf6", count: 3, comingSoon: true },
];

const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Files processed in seconds" },
    { icon: Shield, title: "100% Private", desc: "Auto-deleted after 1 hour" },
    { icon: Clock, title: "No Signup", desc: "Use any tool instantly, free" },
];

export default function HomePage() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const searchResults = query.trim().length > 1
        ? tools.filter(t =>
            !t.comingSoon &&
            (t.name.toLowerCase().includes(query.toLowerCase()) ||
                t.description.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 6)
        : [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) router.push(`/tools?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div className={styles.page}>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroBg} aria-hidden />
                <div className="container">
                    <div className={styles.heroInner}>
                        <div className={styles.heroBadge}>
                            <Zap size={12} strokeWidth={2.5} />
                            40+ Free Tools — No Sign Up Ever
                        </div>
                        <h1 className={styles.heroTitle}>
                            Convert any file,<br />
                            <span className={styles.heroAccent}>instantly free</span>
                        </h1>
                        <p className={styles.heroSub}>
                            PDF, image, audio &amp; video tools. Drag, drop, done. No account required.
                        </p>

                        {/* ── Search Bar ── */}
                        <form className={styles.searchWrap} onSubmit={handleSearch}>
                            <div className={styles.searchBar}>
                                <Search size={20} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search tools… e.g. " PDF to Word", "compress image""
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                autoComplete="off"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        className={styles.searchClear}
                                        onClick={() => setQuery("")}
                                    >×</button>
                                )}
                                <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
                                    Search
                                </button>
                            </div>

                            {/* Dropdown results */}
                            {searchResults.length > 0 && (
                                <div className={styles.searchDropdown}>
                                    {searchResults.map(tool => {
                                        const Icon = tool.icon;
                                        return (
                                            <Link
                                                key={tool.slug}
                                                href={`/${tool.slug}`}
                                                className={styles.searchResult}
                                                onClick={() => setQuery("")}
                                            >
                                                <div className={styles.searchResultIcon} style={{ background: `${tool.color}18`, color: tool.color }}>
                                                    <Icon size={16} />
                                                </div>
                                                <div>
                                                    <div className={styles.searchResultName}>{tool.name}</div>
                                                    <div className={styles.searchResultDesc}>{tool.description}</div>
                                                </div>
                                                <ArrowRight size={14} className={styles.searchResultArrow} />
                                            </Link>
                                        );
                                    })}
                                    <Link href={`/tools?search=${encodeURIComponent(query)}`} className={styles.searchSeeAll}>
                                        See all results for "{query}" →
                                    </Link>
                                </div>
                            )}
                            {query.trim().length > 1 && searchResults.length === 0 && (
                                <div className={styles.searchDropdown}>
                                    <div className={styles.searchNoResult}>No tools found for "{query}"</div>
                                </div>
                            )}
                        </form>

                        {/* Feature pills */}
                        <div className={styles.featureRow}>
                            {features.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div key={f.title} className={styles.featurePill}>
                                        <Icon size={13} />
                                        <strong>{f.title}</strong>
                                        <span>— {f.desc}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Popular Tools ── */}
            <section className={styles.toolsSection}>
                <div className="container">
                    <div className={styles.sectionHead}>
                        <h2>Popular Tools</h2>
                        <Link href="/tools" className={styles.viewAll}>
                            View all tools <ArrowRight size={14} />
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

            {/* ── Categories ── */}
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
                                    <div className={styles.catIcon} style={{ background: `${cat.color}14`, color: cat.color }}>
                                        <Icon size={26} />
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

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <div className={styles.ctaGlow} aria-hidden />
                        <h2>All tools, completely free</h2>
                        <p>No account. No watermarks. No limits. Just convert and download.</p>
                        <Link href="/tools" className={`btn btn-lg ${styles.ctaBtn}`}>
                            Browse all tools <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
