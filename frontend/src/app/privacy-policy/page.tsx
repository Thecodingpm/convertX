import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy – pdfconvertx",
    description: "Read pdfconvertx's Privacy Policy. Learn how we handle your files, what data we collect, and how we protect your privacy when using our free online tools.",
    alternates: { canonical: "https://convertx.app/privacy-policy" },
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <nav style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                <Link href="/">Home</Link> &rsaquo; Privacy Policy
            </nav>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                Privacy Policy
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "2.5rem" }}>
                Last updated: {lastUpdated}
            </p>

            <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
                pdfconvertx (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at <strong>convertx.app</strong>.
                This Privacy Policy explains how we collect, use, and protect information when you use our free online file conversion services.
                By using pdfconvertx, you agree to the practices described in this policy.
            </p>

            <Section title="1. Information We Collect">
                <p>We collect the minimum information necessary to provide our services:</p>
                <ul>
                    <li><strong>Files you upload:</strong> Files you upload for conversion are stored temporarily on our servers solely to perform the requested conversion. They are permanently and automatically deleted within 1 hour of upload.</li>
                    <li><strong>Usage data:</strong> We may collect anonymised usage data such as pages visited, tools used, browser type, and general geographic region (country level) to improve our services.</li>
                    <li><strong>Contact information:</strong> If you contact us via our contact form, we collect your name and email address to respond to your enquiry.</li>
                </ul>
                <p>We do <strong>not</strong> require account registration, and we do not collect any personally identifiable information during normal tool usage.</p>
            </Section>

            <Section title="2. How We Use Your Information">
                <ul>
                    <li>To perform file conversions you request</li>
                    <li>To improve website performance, features, and user experience</li>
                    <li>To respond to enquiries submitted through our contact form</li>
                    <li>To display relevant advertisements through Google AdSense</li>
                    <li>To measure website traffic and usage through Google Analytics</li>
                </ul>
            </Section>

            <Section title="3. File Storage and Deletion">
                <p>
                    All uploaded files are processed on our servers and are <strong>permanently deleted within 1 hour</strong> of upload.
                    We do not read, sell, share, or retain your files beyond what is strictly necessary to complete your requested conversion.
                    Converted output files are also deleted automatically within the same 1-hour window.
                </p>
            </Section>

            <Section title="4. Cookies">
                <p>pdfconvertx uses cookies for the following purposes:</p>
                <ul>
                    <li><strong>Essential cookies:</strong> Required for the website to function correctly (e.g. theme preference)</li>
                    <li><strong>Analytics cookies:</strong> Google Analytics uses cookies to collect anonymised data about how visitors use our site</li>
                    <li><strong>Advertising cookies:</strong> Google AdSense may use cookies to show you relevant advertisements based on your browsing history</li>
                </ul>
                <p>You can control cookies through your browser settings. Disabling cookies may affect some features of the website.</p>
            </Section>

            <Section title="5. Third-Party Services">
                <p>We use the following third-party services:</p>
                <ul>
                    <li><strong>Google Analytics:</strong> To analyse website traffic. Google may collect your IP address and usage data. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>Google's Privacy Policy</a>.</li>
                    <li><strong>Google AdSense:</strong> To display advertisements. Google uses cookies to personalise ads. You can opt out via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>Google's Ad Settings</a>.</li>
                    <li><strong>Cloud hosting providers:</strong> Our servers are hosted on cloud infrastructure. File processing occurs on these servers and files are deleted automatically.</li>
                </ul>
            </Section>

            <Section title="6. Children's Privacy">
                <p>
                    pdfconvertx does not knowingly collect personal information from children under 13 years of age.
                    If you believe a child has provided us with personal information, please contact us so we can delete it.
                </p>
            </Section>

            <Section title="7. Data Security">
                <p>
                    We implement appropriate technical measures to protect your data and files during transmission and processing.
                    Files are transferred over HTTPS encryption. However, no method of transmission over the internet is 100% secure,
                    and we cannot guarantee absolute security.
                </p>
            </Section>

            <Section title="8. Your Rights">
                <p>Depending on your location, you may have rights including:</p>
                <ul>
                    <li>The right to access personal information we hold about you</li>
                    <li>The right to request deletion of your data</li>
                    <li>The right to opt out of marketing communications</li>
                </ul>
                <p>To exercise these rights, please contact us at <a href="mailto:support@convertx.app" style={{ color: "var(--color-primary)" }}>support@convertx.app</a>.</p>
            </Section>

            <Section title="9. Changes to This Policy">
                <p>
                    We may update this Privacy Policy from time to time. When we make significant changes,
                    we will update the &quot;Last updated&quot; date at the top of this page.
                    We encourage you to review this policy periodically.
                </p>
            </Section>

            <Section title="10. Contact Us">
                <p>
                    If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                    <li>Email: <a href="mailto:support@convertx.app" style={{ color: "var(--color-primary)" }}>support@convertx.app</a></li>
                    <li>Contact form: <Link href="/contact" style={{ color: "var(--color-primary)" }}>convertx.app/contact</Link></li>
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
