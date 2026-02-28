import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About pdfconvertx – Free Online File Conversion Tools",
    description: "Learn about pdfconvertx, the free online file conversion platform with 40+ tools for PDF, image, audio and video — no signup, no watermarks.",
    alternates: { canonical: "https://convertx.app/about" },
};

export default function AboutPage() {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                <Link href="/">Home</Link> &rsaquo; About Us
            </nav>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                About pdfconvertx
            </h1>
            <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                pdfconvertx is a free, browser-based file conversion suite built for students, professionals, and everyday users who need fast, reliable file tools —
                without sign-ups, fees, or complicated software.
            </p>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Our Mission</h2>
                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                    We built pdfconvertx because we believe powerful file tools should be accessible to everyone — not just those who can afford expensive desktop software.
                    Whether you are a student submitting an assignment, a job applicant resizing a portrait photo, or a professional preparing a report,
                    pdfconvertx gives you the tools you need instantly, for free.
                </p>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>What We Offer</h2>
                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                    pdfconvertx offers 40+ free online tools across four major categories:
                </p>
                <ul style={{ lineHeight: 2, color: "var(--color-text-secondary)", paddingLeft: "1.5rem" }}>
                    <li><strong>PDF Tools</strong> — Convert, compress, merge, split, watermark, password-protect PDFs and more</li>
                    <li><strong>Image Tools</strong> — Compress, resize, crop, rotate, convert, and remove backgrounds from images</li>
                    <li><strong>Media Tools</strong> — Convert audio and video formats, extract audio, trim clips, create GIFs</li>
                    <li><strong>Utility Tools</strong> — Generate QR codes and more utility tools coming soon</li>
                </ul>
                <p style={{ marginTop: "1rem", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                    All tools run on modern cloud infrastructure and are designed to handle files quickly and securely.
                    No installation is required — everything works directly in your browser.
                </p>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Your Privacy Matters</h2>
                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                    We take file privacy seriously. Every file you upload to pdfconvertx is automatically and permanently deleted from our servers within one hour of upload.
                    We do not read, share, analyse, or retain your files in any way. You can use our tools with complete confidence that your documents are handled safely.
                    No account is required, which means we collect the minimum possible information about you.
                    For full details, please read our{" "}
                    <Link href="/privacy-policy" style={{ color: "var(--color-primary)" }}>Privacy Policy</Link>.
                </p>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Who Uses pdfconvertx?</h2>
                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                    Our users include:
                </p>
                <ul style={{ lineHeight: 2, color: "var(--color-text-secondary)", paddingLeft: "1.5rem" }}>
                    <li><strong>Students</strong> across Pakistan, India, and beyond who need to convert or compress files for university portals and online forms</li>
                    <li><strong>Job applicants</strong> preparing CVs, portrait photos, and documents for online job applications</li>
                    <li><strong>Government employees and citizens</strong> needing to fill and submit PDF forms</li>
                    <li><strong>Freelancers and content creators</strong> working with images, audio, and video</li>
                    <li><strong>Small business owners</strong> converting invoices and documents without expensive software</li>
                </ul>
            </section>

            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Always Free</h2>
                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                    pdfconvertx is, and will always be, free to use for the core conversion tools.
                    No credit card, no subscription, no watermarks on your output files.
                    We are able to offer this service free of charge through responsible, non-intrusive advertising.
                </p>
            </section>

            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Get in Touch</h2>
                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                    Have a question, suggestion, or feedback? We would love to hear from you.
                    Visit our{" "}
                    <Link href="/contact" style={{ color: "var(--color-primary)" }}>Contact page</Link>
                    {" "}to get in touch with our team.
                </p>
            </section>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/tools" className="btn btn-primary">Browse All Tools</Link>
                <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
        </div>
    );
}
