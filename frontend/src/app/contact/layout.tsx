// Separate server component for metadata (contact page uses "use client")
import type { Metadata } from "next";
import ContactPage from "./page";

export const metadata: Metadata = {
    title: "Contact pdfconvertx – Get Help & Support",
    description: "Contact the pdfconvertx team for support, feedback, or questions about our free online PDF, image, audio and video conversion tools.",
    alternates: { canonical: "https://convertx.app/contact" },
};

export default ContactPage;
