"use client";
import type { FormEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import { Mail, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // Simulate a brief loading state then show success
        // In production, replace with your backend API call or a service like Formspree
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        setSent(true);
    };

    return (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                <Link href="/">Home</Link> &rsaquo; Contact Us
            </nav>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                Contact Us
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--color-text-secondary)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                Have a question, feedback, or found a bug? We would love to hear from you.
                Fill in the form below and we will get back to you as soon as possible.
            </p>

            {sent ? (
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "1rem", padding: "3rem 2rem", background: "var(--color-surface)",
                    borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", textAlign: "center"
                }}>
                    <CheckCircle size={56} color="#22c55e" strokeWidth={1.5} />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Message Sent!</h2>
                    <p style={{ color: "var(--color-text-secondary)", maxWidth: 400, lineHeight: 1.7 }}>
                        Thank you for reaching out. We typically respond within 24–48 hours on weekdays.
                    </p>
                    <button className="btn btn-primary" onClick={() => setSent(false)}>Send Another Message</button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    action={`mailto:support@smartconvertx.online`}
                    method="post"
                    encType="text/plain"
                    style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                    <div>
                        <label htmlFor="name" style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9375rem" }}>
                            Your Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Ahmad Khan"
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
                                border: "1.5px solid var(--color-border)", background: "var(--color-bg)",
                                color: "var(--color-text)", fontSize: "0.9375rem", boxSizing: "border-box", outline: "none"
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9375rem" }}>
                            Email Address <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
                                border: "1.5px solid var(--color-border)", background: "var(--color-bg)",
                                color: "var(--color-text)", fontSize: "0.9375rem", boxSizing: "border-box", outline: "none"
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9375rem" }}>
                            Subject
                        </label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="Question about PDF tool"
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
                                border: "1.5px solid var(--color-border)", background: "var(--color-bg)",
                                color: "var(--color-text)", fontSize: "0.9375rem", boxSizing: "border-box", outline: "none"
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="message" style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9375rem" }}>
                            Message <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={6}
                            placeholder="Describe your question or issue in detail..."
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
                                border: "1.5px solid var(--color-border)", background: "var(--color-bg)",
                                color: "var(--color-text)", fontSize: "0.9375rem", boxSizing: "border-box",
                                outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ padding: "12px 24px", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
                    >
                        <MessageSquare size={18} />
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            )}

            <div style={{
                marginTop: "3rem", padding: "1.5rem", background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)",
                display: "flex", alignItems: "flex-start", gap: "1rem"
            }}>
                <Mail size={22} style={{ color: "var(--color-primary)", marginTop: 2, flexShrink: 0 }} />
                <div>
                    <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Email Us Directly</p>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem" }}>
                        You can also reach us at{" "}
                        <a href="mailto:support@smartconvertx.online" style={{ color: "var(--color-primary)" }}>
                            support@smartconvertx.online
                        </a>
                        . We respond within 24–48 hours on weekdays.
                    </p>
                </div>
            </div>
        </div>
    );
}
