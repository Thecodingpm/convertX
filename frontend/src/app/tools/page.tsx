"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { tools, categories, getToolsByCategory } from "@/lib/tools";
import styles from "./page.module.css";

function ToolsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read initial category from URL (?category=pdf)
    const urlCategory = searchParams.get("category") || "all";
    const [activeCategory, setActiveCategory] = useState(urlCategory);
    const [searchQuery, setSearchQuery] = useState("");

    // Sync URL when tab changes
    const switchCategory = (id: string) => {
        setActiveCategory(id);
        const url = id === "all" ? "/tools" : `/tools?category=${id}`;
        router.replace(url, { scroll: false });
    };

    // If URL changes externally, sync state
    useEffect(() => {
        setActiveCategory(searchParams.get("category") || "all");
    }, [searchParams]);

    const filteredTools = useMemo(() => {
        let result = getToolsByCategory(activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCategory, searchQuery]);

    return (
        <div className={styles.page}>
            <div className="container">

                {/* Header */}
                <div className={styles.header}>
                    <h1>All Tools</h1>
                    <p>Powerful file conversion tools — free, fast, and easy to use</p>
                </div>

                {/* Search */}
                <div className={styles.searchWrap}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search tools (e.g. compress pdf, resize image...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Tabs */}
                <div className={styles.tabs}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ""}`}
                            onClick={() => switchCategory(cat.id)}
                        >
                            {cat.name}
                            <span className={styles.tabCount}>{cat.count}</span>
                        </button>
                    ))}
                </div>

                {/* Tools Grid */}
                {filteredTools.length > 0 ? (
                    <div className={styles.grid}>
                        {filteredTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.slug}
                                    href={tool.comingSoon ? "#" : `/tools/${tool.slug}`}
                                    className={`${styles.card} ${tool.comingSoon ? styles.cardDisabled : ""}`}
                                >
                                    <div className={styles.cardIcon} style={{ background: `${tool.color}18`, color: tool.color }}>
                                        <Icon size={24} />
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTitle}>
                                            <span>{tool.name}</span>
                                            {tool.comingSoon && (
                                                <span className={styles.comingSoon}>Soon</span>
                                            )}
                                        </div>
                                        <p className={styles.cardDesc}>{tool.description}</p>
                                    </div>
                                    {!tool.comingSoon && (
                                        <ChevronRight size={16} className={styles.cardArrow} />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <Search size={48} strokeWidth={1} />
                        <p>No tools found for &quot;{searchQuery}&quot;</p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => { setSearchQuery(""); switchCategory("all"); }}
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ToolsPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Loading tools...</div>}>
            <ToolsContent />
        </Suspense>
    );
}
