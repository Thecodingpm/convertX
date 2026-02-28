import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions – ConvertX",
    description: "Read the Terms and Conditions for using ConvertX's free online file conversion tools. Includes acceptable use, limitations, and user responsibilities.",
    alternates: { canonical: "https://convertx.app/terms" },
};

export default function TermsPage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <nav style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                <Link href="/">Home</Link> &rsaquo; Terms &amp; Conditions
            </nav>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                Terms &amp; Conditions
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "2.5rem" }}>
                Last updated: {lastUpdated}
            </p>

            <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
                Please read these Terms and Conditions carefully before using the ConvertX website located at <strong>convertx.app</strong>.
                By accessing or using our services, you agree to be bound by these terms.
                If you do not agree with any part of these terms, you may not use our services.
            </p>

            <Section title="1. Acceptance of Terms">
                <p>
                    By using ConvertX, you confirm that you are at least 13 years of age and that you accept these Terms and Conditions.
                    We reserve the right to update these terms at any time without notice. Continued use of the service
                    after changes are posted constitutes your acceptance of the revised terms.
                </p>
            </Section>

            <Section title="2. Description of Service">
                <p>
                    ConvertX provides free online file conversion tools including but not limited to PDF conversion, image conversion,
                    audio conversion, video conversion, and utility tools. These services are provided &quot;as is&quot; and are subject to change at any time.
                </p>
            </Section>

            <Section title="3. Acceptable Use">
                <p>You agree to use ConvertX only for lawful purposes. You must not:</p>
                <ul>
                    <li>Upload files containing viruses, malware, or malicious code</li>
                    <li>Upload copyrighted material without authorisation from the copyright holder</li>
                    <li>Upload illegal, pornographic, hateful, violent, or otherwise harmful content</li>
                    <li>Use the service to infringe on any third party&apos;s intellectual property rights</li>
                    <li>Attempt to reverse-engineer, hack, scrape, or overload our servers</li>
                    <li>Use automated scripts or bots to use the service in bulk without prior written permission</li>
                    <li>Use the service for any commercial purpose that violates these terms</li>
                </ul>
            </Section>

            <Section title="4. File Ownership and Privacy">
                <p>
                    You retain full ownership of all files you upload to ConvertX. By uploading a file, you grant ConvertX a temporary,
                    limited licence to process that file solely for the purpose of performing the conversion you requested.
                    This licence terminates upon deletion of the file (within 1 hour of upload).
                    We do not claim any ownership over your files.
                </p>
            </Section>

            <Section title="5. No Warranties">
                <p>
                    ConvertX is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, express or implied.
                    We do not warrant that:
                </p>
                <ul>
                    <li>The service will be error-free or uninterrupted</li>
                    <li>Conversion results will be perfect or suitable for your specific requirements</li>
                    <li>The service will be available at all times</li>
                </ul>
                <p>
                    We strongly recommend that you keep a backup of any important files before using our conversion tools.
                </p>
            </Section>

            <Section title="6. Limitation of Liability">
                <p>
                    To the maximum extent permitted by applicable law, ConvertX and its operators shall not be liable for any
                    indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul>
                    <li>Loss of files or data</li>
                    <li>Loss of business or revenue</li>
                    <li>Damages resulting from use or inability to use our services</li>
                </ul>
                <p>
                    Our total liability to you for any claim related to the use of ConvertX shall not exceed USD $0,
                    as the service is provided free of charge.
                </p>
            </Section>

            <Section title="7. Intellectual Property">
                <p>
                    The ConvertX website, logo, name, design, and all original content are the intellectual property of ConvertX.
                    You may not reproduce, distribute, or create derivative works without our express written permission.
                    Our open-source components are subject to their respective licences.
                </p>
            </Section>

            <Section title="8. Third-Party Links">
                <p>
                    Our website may contain links to third-party websites. These links are provided for your convenience.
                    ConvertX has no control over the content of those sites and accepts no responsibility for them or for any loss or damage
                    that may arise from your use of them.
                </p>
            </Section>

            <Section title="9. Advertising">
                <p>
                    ConvertX displays advertisements provided by Google AdSense. These advertisements help us maintain the free service.
                    All advertisements comply with Google&apos;s advertising policies. We are not responsible for the content of advertisements
                    displayed by third-party ad networks.
                </p>
            </Section>

            <Section title="10. Governing Law">
                <p>
                    These Terms and Conditions are governed by and construed in accordance with applicable law.
                    Any disputes arising from the use of our services shall be resolved through good-faith negotiation.
                </p>
            </Section>

            <Section title="11. Contact">
                <p>
                    If you have any questions about these Terms and Conditions, please contact us:
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
