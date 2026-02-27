"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import styles from "./page.module.css";

interface Conversion {
    id: number;
    tool_slug: string;
    original_filename: string;
    status: string;
    created_at: string;
    download_count: number;
}

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [conversions, setConversions] = useState<Conversion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await api.getHistory();
                if (res.success) {
                    const data = res.data as { data: Conversion[] };
                    setConversions(data.data || []);
                }
            } catch {
                // No history yet
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isAuthenticated, authLoading]);

    if (authLoading || loading) {
        return (
            <div className={styles.page}>
                <div className="container text-center" style={{ padding: "var(--space-3xl)" }}>
                    <div className="spinner" style={{ margin: "0 auto" }} />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.page}>
                <div className="container text-center" style={{ padding: "var(--space-3xl)" }}>
                    <h2>Please sign in</h2>
                    <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
                        You need to be logged in to view your dashboard.
                    </p>
                    <Link href="/login" className="btn btn-primary btn-lg">
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <h1>Welcome back, {user?.name}</h1>
                        <p>Manage your conversions and account</p>
                    </div>
                    <span className={`badge ${user?.plan === "pro" ? "badge-primary" : "badge-success"}`}>
                        {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                    </span>
                </div>

                {/* Stats Cards */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📊</span>
                        <div>
                            <strong>{conversions.length}</strong>
                            <span>Total Conversions</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📅</span>
                        <div>
                            <strong>{user?.daily_conversions || 0}/5</strong>
                            <span>Today&apos;s Usage</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>⬇️</span>
                        <div>
                            <strong>{conversions.reduce((s, c) => s + c.download_count, 0)}</strong>
                            <span>Downloads</span>
                        </div>
                    </div>
                </div>

                {/* Recent Conversions */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Conversions</h2>
                        <Link href="/tools" className="btn btn-secondary btn-sm">
                            New Conversion
                        </Link>
                    </div>

                    {conversions.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No conversions yet. Start by choosing a tool!</p>
                            <Link href="/tools" className="btn btn-primary">
                                Browse tools →
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <span>File</span>
                                <span>Tool</span>
                                <span>Status</span>
                                <span>Date</span>
                                <span>Action</span>
                            </div>
                            {conversions.slice(0, 10).map((conv) => (
                                <div key={conv.id} className={styles.tableRow}>
                                    <span className={styles.fileName}>{conv.original_filename}</span>
                                    <span className={styles.toolSlug}>{conv.tool_slug.replace(/-/g, " ")}</span>
                                    <span>
                                        <span className={`badge badge-${conv.status === "completed" ? "success" : conv.status === "failed" ? "danger" : "warning"}`}>
                                            {conv.status}
                                        </span>
                                    </span>
                                    <span className={styles.date}>{new Date(conv.created_at).toLocaleDateString()}</span>
                                    <span>
                                        {conv.status === "completed" && (
                                            <a href={api.getDownloadUrl(conv.id)} className="btn btn-sm btn-primary" download>
                                                ⬇
                                            </a>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
