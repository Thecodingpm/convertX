import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "smartconvertx – Free Online File Converter | PDF, Image, Audio & Video",
  description:
    "Convert files free online with 40+ tools. PDF to Word, compress PDFs, resize images, extract audio from video, MP3 to WAV, QR code generator and more. No signup, no watermarks.",
  keywords: [
    "free file converter", "pdf to word free", "compress pdf", "resize image online",
    "jpg to png", "png to jpg", "merge pdf", "convert video", "mp3 to wav",
    "extract audio", "qr code generator", "pdf to excel", "video to gif",
    "image compressor", "no signup converter", "convertx",
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://smartconvertx.online",
  },
  openGraph: {
    title: "smartconvertx – Free Online File Converter",
    description: "40+ free tools for PDF, image, audio & video conversion. No signup required.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
