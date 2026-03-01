import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Disclaimer – smartconvertx",
    description: "Read the smartconvertx Disclaimer. Information about the accuracy of conversion results, affiliate relationships, external links, and professional advice.",
    alternates: { canonical: "https://smartconvertx.online/disclaimer" },
};

export default function DisclaimerPage() {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <nav style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                <Link href="/">Home</Link> &rsaquo; Disclaimer
            </nav>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                Disclaimer
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "2.5rem" }}>
                Last updated: February 28, 2026
            </p>

            <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
                The information and services provided on smartconvertx (smartconvertx.online) are for general informational and utility purposes only.
                By using our services, you accept this disclaimer in full. If you disagree with any part of this disclaimer, please do not use smartconvertx.
            </p>

            <Section title="No Guarantee of Accuracy">
                <p>
                    While we strive to provide high-quality file conversion results, smartconvertx does not guarantee that conversion outputs will be
                    100% accurate, complete, or suitable for your specific purpose. Conversion results may vary depending on the complexity,
                    encoding, or formatting of the input file.
                </p>
                <p>
                    We strongly recommend reviewing all conversion outputs before use, especially for important documents such as legal contracts,
                    medical records, official government forms, or academic submissions. Always keep a backup of your original files.
                </p>
            </Section>

            <Section title="Professional Advice">
                <p>
                    smartconvertx is a file utility tool and does not provide legal, medical, financial, or any other form of professional advice.
                    The blog articles and informational content on this website are for general educational purposes only and should not be relied upon
                    as professional or expert advice. For important matters, please consult a qualified professional.
                </p>
            </Section>

            <Section title="External Links">
                <p>
                    Our website and blog may contain links to external websites. These links are provided for reference and convenience only.
                    smartconvertx does not endorse, control, or verify the content of external sites and is not responsible for:
                </p>
                <ul>
                    <li>The accuracy or reliability of information on external websites</li>
                    <li>Any products, services, or content offered by external sites</li>
                    <li>Any damages or losses arising from visiting external links</li>
                </ul>
            </Section>

            <Section title="Advertising Disclaimer">
                <p>
                    smartconvertx displays third-party advertisements through Google AdSense to help support the free service.
                    These advertisements are selected by Google based on your browsing behaviour and our website content.
                    smartconvertx does not endorse any products or services advertised through these third-party networks.
                </p>
                <p>
                    We are not responsible for the accuracy, legality, or appropriateness of any advertisement displayed on our website.
                    If you have concerns about a specific advertisement, you may report it using Google&apos;s feedback tools.
                </p>
            </Section>

            <Section title="Affiliate Disclaimer">
                <p>
                    smartconvertx does not currently participate in affiliate marketing programmes. If this changes in the future,
                    we will clearly disclose any affiliate relationships on the relevant pages in compliance with applicable regulations.
                </p>
            </Section>

            <Section title="File Processing Disclaimer">
                <p>
                    Files uploaded to smartconvertx are processed automatically without any human review.
                    We process files solely to perform the requested conversion. While we implement technical safeguards,
                    you upload files at your own risk. Do not upload files containing highly sensitive or confidential information
                    beyond what is strictly necessary.
                </p>
            </Section>

            <Section title="Changes to This Disclaimer">
                <p>
                    We may update this Disclaimer from time to time. Changes will be reflected by updating the &quot;Last updated&quot;
                    date at the top of this page. Your continued use of smartconvertx after any changes constitutes your acceptance of the updated Disclaimer.
                </p>
            </Section>

            <Section title="Contact">
                <p>If you have any questions about this Disclaimer, please contact us:</p>
                <ul>
                    <li>Email: <a href="mailto:support@smartconvertx.online" style={{ color: "var(--color-primary)" }}>support@smartconvertx.online</a></li>
                    <li>Contact form: <Link href="/contact" style={{ color: "var(--color-primary)" }}>smartconvertx.online/contact</Link></li>
                </ul>
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>{title}</h2>
            <div style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                {children}
            </div>
        </section>
    );
}
