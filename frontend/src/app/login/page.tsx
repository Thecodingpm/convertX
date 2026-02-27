"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import styles from "./page.module.css";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await login(email, password);
        if (res.success) {
            router.push("/dashboard");
        } else {
            setError(res.message || "Invalid credentials");
        }
        setLoading(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1>Welcome back</h1>
                <p className={styles.subtitle}>Sign in to your FileForge account</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: "100%" }}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <button className={`btn btn-secondary btn-lg ${styles.googleBtn}`}>
                    <span>🔵</span> Continue with Google
                </button>

                <p className={styles.footer}>
                    Don&apos;t have an account?{" "}
                    <Link href="/register">Create one free</Link>
                </p>
            </div>
        </div>
    );
}
