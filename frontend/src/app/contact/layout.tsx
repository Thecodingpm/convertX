// Separate server component for metadata (contact page uses "use client")
import type { Metadata } from "next";
import ContactPage from "./page";

export const metadata: Metadata = {
    title: "Contact smartconvertx – Get Help & Support",
    description: "Contact the smartconvertx team for support, feedback, or questions about our free online PDF, image, audio and video conversion tools.",
    alternates: { canonical: "https://smartconvertx.online/contact" },
};

export default ContactPage;
