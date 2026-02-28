import type { LucideIcon } from "lucide-react";
import {
    FileText, FileSpreadsheet, Image, Merge, Scissors,
    Package, Lock, Unlock, Droplets, BookOpen,
    ImageIcon, Palette, Zap, Maximize2, Minimize2,
    Crop, RotateCw, FileImage, Wand2,
    Music, Music2, Headphones, Film, Video, Mic,
    Clapperboard, Tv, Layers,
    ScanText, Brain, BarChart3,
    QrCode, RefreshCw, FileOutput, Gauge, Monitor,
} from "lucide-react";

export interface Tool {
    slug: string;
    name: string;
    module: "pdf" | "image" | "media" | "ai" | "utility";
    category: string;
    description: string;
    icon: LucideIcon;
    color: string;
    endpoint?: string;
    comingSoon?: boolean;
    clientSide?: boolean; // tools that run in the browser (no backend needed)
    acceptedTypes?: string;
    multiple?: boolean;
    extraFields?: ExtraField[];
}

export interface ExtraField {
    name: string;
    label: string;
    type: "text" | "number" | "select";
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
}

export const tools: Tool[] = [
    // ── PDF Tools ──
    { slug: "pdf-to-word", name: "PDF to Word", module: "pdf", category: "PDF Tools", description: "Convert PDF documents to editable Word files", icon: FileText, color: "#3b82f6", endpoint: "/api/v1/pdf/pdf-to-word", acceptedTypes: ".pdf" },
    { slug: "pdf-to-excel", name: "PDF to Excel", module: "pdf", category: "PDF Tools", description: "Convert PDF tables to Excel spreadsheets", icon: FileSpreadsheet, color: "#22c55e", endpoint: "/api/v1/pdf/pdf-to-excel", acceptedTypes: ".pdf" },
    { slug: "pdf-to-jpg", name: "PDF to JPG", module: "pdf", category: "PDF Tools", description: "Convert PDF pages to JPG images", icon: Image, color: "#f59e0b", endpoint: "/api/v1/pdf/pdf-to-jpg", acceptedTypes: ".pdf" },
    { slug: "merge-pdfs", name: "Merge PDFs", module: "pdf", category: "PDF Tools", description: "Combine multiple PDF files into one", icon: Merge, color: "#8b5cf6", endpoint: "/api/v1/pdf/merge", acceptedTypes: ".pdf", multiple: true },
    {
        slug: "split-pdf", name: "Split PDF", module: "pdf", category: "PDF Tools", description: "Split PDF into separate pages", icon: Scissors, color: "#ef4444", endpoint: "/api/v1/pdf/split", acceptedTypes: ".pdf",
        extraFields: [
            { name: "from_page", label: "From Page", type: "number", required: true, placeholder: "1" },
            { name: "to_page", label: "To Page", type: "number", required: true, placeholder: "5" },
        ],
    },
    { slug: "compress-pdf", name: "Compress PDF", module: "pdf", category: "PDF Tools", description: "Reduce PDF file size without losing quality", icon: Package, color: "#06b6d4", endpoint: "/api/v1/pdf/compress", acceptedTypes: ".pdf" },
    {
        slug: "add-password", name: "Add Password", module: "pdf", category: "PDF Tools", description: "Protect your PDF with a password", icon: Lock, color: "#64748b", endpoint: "/api/v1/pdf/add-password", acceptedTypes: ".pdf",
        extraFields: [{ name: "password", label: "Password", type: "text", required: true, placeholder: "Enter password" }],
    },
    {
        slug: "remove-password", name: "Remove Password", module: "pdf", category: "PDF Tools", description: "Remove password protection from PDF", icon: Unlock, color: "#84cc16", endpoint: "/api/v1/pdf/remove-password", acceptedTypes: ".pdf",
        extraFields: [{ name: "password", label: "Current Password", type: "text", required: true, placeholder: "Enter current password" }],
    },
    {
        slug: "add-watermark", name: "Add Watermark", module: "pdf", category: "PDF Tools", description: "Add customizable watermark text to PDF pages", icon: Droplets, color: "#0ea5e9", endpoint: "/api/v1/pdf/watermark", acceptedTypes: ".pdf",
        extraFields: [
            { name: "watermark_text", label: "Watermark Text", type: "text", required: true, placeholder: "CONFIDENTIAL" },
            {
                name: "position", label: "Position", type: "select", options: [
                    { value: "top-left", label: "↖ Top Left" },
                    { value: "top-center", label: "↑ Top Center" },
                    { value: "top-right", label: "↗ Top Right" },
                    { value: "center-left", label: "← Center Left" },
                    { value: "center", label: "⊙ Center (Default)" },
                    { value: "center-right", label: "→ Center Right" },
                    { value: "bottom-left", label: "↙ Bottom Left" },
                    { value: "bottom-center", label: "↓ Bottom Center" },
                    { value: "bottom-right", label: "↘ Bottom Right" },
                ]
            },
            {
                name: "opacity", label: "Opacity", type: "select", options: [
                    { value: "0.1", label: "10% (Very light)" },
                    { value: "0.2", label: "20% (Light)" },
                    { value: "0.3", label: "30% (Default)" },
                    { value: "0.5", label: "50% (Medium)" },
                    { value: "0.7", label: "70% (Strong)" },
                    { value: "1.0", label: "100% (Opaque)" },
                ]
            },
            {
                name: "font_size", label: "Font Size", type: "select", options: [
                    { value: "24", label: "Small (24pt)" },
                    { value: "40", label: "Medium (40pt)" },
                    { value: "60", label: "Large (60pt) — Default" },
                    { value: "80", label: "X-Large (80pt)" },
                    { value: "120", label: "Huge (120pt)" },
                ]
            },
            {
                name: "rotation", label: "Rotation", type: "select", options: [
                    { value: "0", label: "0° (Horizontal)" },
                    { value: "30", label: "30° (Slight tilt)" },
                    { value: "45", label: "45° (Default)" },
                    { value: "60", label: "60°" },
                    { value: "90", label: "90° (Vertical)" },
                ]
            },
            {
                name: "color", label: "Color", type: "select", options: [
                    { value: "#808080", label: "Gray (Default)" },
                    { value: "#ff0000", label: "Red" },
                    { value: "#0000ff", label: "Blue" },
                    { value: "#000000", label: "Black" },
                    { value: "#008000", label: "Green" },
                    { value: "#ffa500", label: "Orange" },
                    { value: "#800080", label: "Purple" },
                ]
            },
            {
                name: "pages", label: "Apply to Pages", type: "select", options: [
                    { value: "all", label: "All pages (Default)" },
                    { value: "first", label: "First page only" },
                    { value: "last", label: "Last page only" },
                ]
            },
        ],
    },
    {
        slug: "extract-pages", name: "Extract Pages", module: "pdf", category: "PDF Tools", description: "Extract specific pages from a PDF", icon: BookOpen, color: "#f97316", endpoint: "/api/v1/pdf/extract-pages", acceptedTypes: ".pdf",
        extraFields: [{ name: "pages", label: "Pages (comma-separated)", type: "text", required: true, placeholder: "1,3,5" }],
    },

    // ── Presentation / PPTX Tools ──
    { slug: "pptx-to-pdf", name: "PPTX to PDF", module: "pdf", category: "PDF Tools", description: "Convert PowerPoint presentations to PDF", icon: Monitor, color: "#f97316", endpoint: "/api/v1/pdf/pptx-to-pdf", acceptedTypes: ".pptx,.ppt" },
    { slug: "pptx-to-word", name: "PPTX to Word", module: "pdf", category: "PDF Tools", description: "Convert PowerPoint to an editable Word document", icon: Monitor, color: "#3b82f6", endpoint: "/api/v1/pdf/pptx-to-word", acceptedTypes: ".pptx,.ppt" },
    { slug: "pptx-to-jpg", name: "PPTX to JPG", module: "pdf", category: "PDF Tools", description: "Convert PowerPoint slides to JPG images", icon: Monitor, color: "#f59e0b", endpoint: "/api/v1/pdf/pptx-to-jpg", acceptedTypes: ".pptx,.ppt" },
    { slug: "pptx-to-png", name: "PPTX to PNG", module: "pdf", category: "PDF Tools", description: "Convert PowerPoint slides to PNG images", icon: Monitor, color: "#8b5cf6", endpoint: "/api/v1/pdf/pptx-to-png", acceptedTypes: ".pptx,.ppt" },

    // ── Image Tools ──
    { slug: "jpg-to-png", name: "JPG to PNG", module: "image", category: "Image Tools", description: "Convert JPG images to PNG format", icon: ImageIcon, color: "#3b82f6", endpoint: "/api/v1/image/jpg-to-png", acceptedTypes: ".jpg,.jpeg" },
    { slug: "png-to-jpg", name: "PNG to JPG", module: "image", category: "Image Tools", description: "Convert PNG images to JPG format", icon: Palette, color: "#f59e0b", endpoint: "/api/v1/image/png-to-jpg", acceptedTypes: ".png" },
    { slug: "webp-converter", name: "WebP Converter", module: "image", category: "Image Tools", description: "Convert images to modern WebP format", icon: Zap, color: "#8b5cf6", endpoint: "/api/v1/image/to-webp", acceptedTypes: ".jpg,.jpeg,.png,.gif,.bmp" },
    {
        slug: "resize-image", name: "Resize Image", module: "image", category: "Image Tools", description: "Resize image to specific dimensions", icon: Maximize2, color: "#22c55e", endpoint: "/api/v1/image/resize", acceptedTypes: ".jpg,.jpeg,.png,.gif,.bmp,.webp",
        extraFields: [
            { name: "width", label: "Width (px)", type: "number", required: true, placeholder: "800" },
            { name: "height", label: "Height (px)", type: "number", required: true, placeholder: "600" },
        ],
    },
    {
        slug: "compress-image", name: "Compress Image", module: "image", category: "Image Tools", description: "Reduce image file size while keeping quality", icon: Minimize2, color: "#06b6d4", endpoint: "/api/v1/image/compress", acceptedTypes: ".jpg,.jpeg,.png,.webp",
        extraFields: [
            { name: "quality", label: "Quality %", type: "number", placeholder: "75" },
        ],
    },
    {
        slug: "crop-image", name: "Crop Image", module: "image", category: "Image Tools", description: "Crop image to a specific area", icon: Crop, color: "#ef4444", endpoint: "/api/v1/image/crop", acceptedTypes: ".jpg,.jpeg,.png,.gif,.bmp,.webp",
        extraFields: [
            { name: "width", label: "Width (px)", type: "number", required: true, placeholder: "400" },
            { name: "height", label: "Height (px)", type: "number", required: true, placeholder: "400" },
            { name: "x", label: "X Offset", type: "number", placeholder: "0" },
            { name: "y", label: "Y Offset", type: "number", placeholder: "0" },
        ],
    },
    {
        slug: "rotate-image", name: "Rotate Image", module: "image", category: "Image Tools", description: "Rotate image by any angle", icon: RotateCw, color: "#f97316", endpoint: "/api/v1/image/rotate", acceptedTypes: ".jpg,.jpeg,.png,.gif,.bmp,.webp",
        extraFields: [
            { name: "degrees", label: "Degrees", type: "number", required: true, placeholder: "90" },
        ],
    },
    { slug: "image-to-pdf", name: "Image to PDF", module: "image", category: "Image Tools", description: "Convert images to PDF documents", icon: FileImage, color: "#84cc16", endpoint: "/api/v1/image/to-pdf", acceptedTypes: ".jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff" },
    { slug: "remove-background", name: "Remove Background", module: "image", category: "Image Tools", description: "Remove image background automatically", icon: Wand2, color: "#ec4899", endpoint: "/api/v1/image/remove-background", acceptedTypes: ".jpg,.jpeg,.png,.webp" },

    // ── Media Tools ──
    { slug: "mp3-to-wav", name: "MP3 to WAV", module: "media", category: "Media Tools", description: "Convert MP3 audio to WAV format", icon: Music, color: "#8b5cf6", endpoint: "/api/v1/media/mp3-to-wav", acceptedTypes: ".mp3" },
    {
        slug: "wav-to-mp3", name: "WAV to MP3", module: "media", category: "Media Tools", description: "Convert WAV audio to MP3 format", icon: Music2, color: "#3b82f6", endpoint: "/api/v1/media/wav-to-mp3", acceptedTypes: ".wav",
        extraFields: [
            {
                name: "bitrate", label: "Bitrate", type: "select", options: [
                    { value: "128", label: "128 kbps" }, { value: "192", label: "192 kbps" },
                    { value: "256", label: "256 kbps" }, { value: "320", label: "320 kbps" },
                ]
            },
        ],
    },
    {
        slug: "extract-audio", name: "Extract Audio", module: "media", category: "Media Tools", description: "Extract audio track from video files", icon: Headphones, color: "#f59e0b", endpoint: "/api/v1/media/extract-audio", acceptedTypes: ".mp4,.avi,.mkv,.mov,.wmv,.flv,.webm",
        extraFields: [
            {
                name: "format", label: "Output Format", type: "select", options: [
                    { value: "mp3", label: "MP3" }, { value: "wav", label: "WAV" },
                ]
            },
        ],
    },
    { slug: "mp4-to-avi", name: "MP4 to AVI", module: "media", category: "Media Tools", description: "Convert MP4 video to AVI format", icon: Film, color: "#ef4444", endpoint: "/api/v1/media/mp4-to-avi", acceptedTypes: ".mp4" },
    {
        slug: "compress-video", name: "Compress Video", module: "media", category: "Media Tools", description: "Reduce video file size efficiently", icon: Video, color: "#06b6d4", endpoint: "/api/v1/media/compress-video", acceptedTypes: ".mp4,.avi,.mkv,.mov,.wmv,.flv,.webm",
        extraFields: [
            {
                name: "quality", label: "Quality", type: "select", options: [
                    { value: "low", label: "Low (Smallest)" }, { value: "medium", label: "Medium" },
                    { value: "high", label: "High (Best)" },
                ]
            },
        ],
    },
    {
        slug: "trim-audio", name: "Trim Audio", module: "media", category: "Media Tools", description: "Cut audio to a specific duration", icon: Mic, color: "#22c55e", endpoint: "/api/v1/media/trim-audio", acceptedTypes: ".mp3,.wav,.ogg,.flac",
        extraFields: [
            { name: "start", label: "Start Time (HH:MM:SS)", type: "text", required: true, placeholder: "00:00:10" },
            { name: "duration", label: "Duration (HH:MM:SS)", type: "text", required: true, placeholder: "00:01:00" },
        ],
    },
    {
        slug: "trim-video", name: "Trim Video", module: "media", category: "Media Tools", description: "Cut video to a specific duration", icon: Clapperboard, color: "#f97316", endpoint: "/api/v1/media/trim-video", acceptedTypes: ".mp4,.avi,.mkv,.mov,.wmv,.flv,.webm",
        extraFields: [
            { name: "start", label: "Start Time (HH:MM:SS)", type: "text", required: true, placeholder: "00:00:05" },
            { name: "duration", label: "Duration (HH:MM:SS)", type: "text", required: true, placeholder: "00:00:30" },
        ],
    },
    {
        slug: "video-to-gif", name: "Video to GIF", module: "media", category: "Media Tools", description: "Convert video clips to animated GIFs", icon: Tv, color: "#ec4899", endpoint: "/api/v1/media/video-to-gif", acceptedTypes: ".mp4,.avi,.mkv,.mov,.webm",
        extraFields: [
            { name: "fps", label: "FPS", type: "number", placeholder: "10" },
            { name: "width", label: "Width (px)", type: "number", placeholder: "480" },
        ],
    },
    { slug: "audio-to-mp4", name: "Audio to MP4", module: "media", category: "Media Tools", description: "Convert audio files to MP4 video", icon: Layers, color: "#64748b", endpoint: "/api/v1/media/audio-to-mp4", acceptedTypes: ".mp3,.wav,.ogg,.flac" },
    {
        slug: "gif-to-mp4", name: "GIF to MP4", module: "media", category: "Media Tools", description: "Convert animated GIFs to MP4 video", icon: Film, color: "#ec4899", endpoint: "/api/v1/media/gif-to-mp4", acceptedTypes: ".gif",
    },
    {
        slug: "mp4-to-mp3", name: "MP4 to MP3", module: "media", category: "Media Tools", description: "Extract MP3 audio from MP4 video", icon: Music, color: "#8b5cf6", endpoint: "/api/v1/media/mp4-to-mp3", acceptedTypes: ".mp4",
    },
    {
        slug: "change-audio-speed", name: "Change Audio Speed", module: "media", category: "Media Tools", description: "Speed up or slow down audio files", icon: Gauge, color: "#f97316", endpoint: "/api/v1/media/change-audio-speed", acceptedTypes: ".mp3,.wav,.ogg,.flac",
        extraFields: [
            {
                name: "speed", label: "Speed", type: "select", options: [
                    { value: "0.5", label: "0.5x (Half speed)" },
                    { value: "0.75", label: "0.75x (Slow)" },
                    { value: "1.25", label: "1.25x (Fast)" },
                    { value: "1.5", label: "1.5x (Faster)" },
                    { value: "2.0", label: "2x (Double speed)" },
                ]
            },
        ],
    },

    // ── Image Extra ──
    { slug: "bmp-to-png", name: "BMP to PNG", module: "image", category: "Image Tools", description: "Convert BMP images to PNG format", icon: ImageIcon, color: "#06b6d4", endpoint: "/api/v1/image/bmp-to-png", acceptedTypes: ".bmp" },
    { slug: "png-to-webp", name: "PNG to WebP", module: "image", category: "Image Tools", description: "Convert PNG images to WebP format", icon: Zap, color: "#8b5cf6", endpoint: "/api/v1/image/to-webp", acceptedTypes: ".png" },
    { slug: "jpg-to-webp", name: "JPG to WebP", module: "image", category: "Image Tools", description: "Convert JPG images to WebP format", icon: Zap, color: "#3b82f6", endpoint: "/api/v1/image/to-webp", acceptedTypes: ".jpg,.jpeg" },
    {
        slug: "flip-image", name: "Flip Image", module: "image", category: "Image Tools", description: "Flip image horizontally or vertically", icon: RefreshCw, color: "#64748b", endpoint: "/api/v1/image/flip", acceptedTypes: ".jpg,.jpeg,.png,.gif,.bmp,.webp",
        extraFields: [
            {
                name: "direction", label: "Direction", type: "select", options: [
                    { value: "horizontal", label: "Horizontal (Mirror)" },
                    { value: "vertical", label: "Vertical (Upside down)" },
                ]
            },
        ],
    },

    // ── Utility Tools ──
    { slug: "qr-code", name: "QR Code Generator", module: "utility", category: "Utility Tools", description: "Generate QR codes from any URL or text", icon: QrCode, color: "#0ea5e9", clientSide: true },

    // ── AI Tools (Coming Soon) ──
    { slug: "ocr", name: "OCR Text Extract", module: "ai", category: "AI Tools", description: "Extract text from images and scanned PDFs using AI", icon: ScanText, color: "#8b5cf6", comingSoon: true },
    { slug: "ai-summarize", name: "AI Summarizer", module: "ai", category: "AI Tools", description: "AI-powered document summarization in seconds", icon: Brain, color: "#ec4899", comingSoon: true },
    { slug: "ai-analyze", name: "File Analyzer", module: "ai", category: "AI Tools", description: "AI-powered file analysis and smart insights", icon: BarChart3, color: "#f59e0b", comingSoon: true },
];

export const categories = [
    { id: "all", name: "All Tools", count: tools.filter(t => !t.comingSoon).length },
    { id: "pdf", name: "PDF", count: tools.filter(t => t.module === "pdf").length },
    { id: "image", name: "Image", count: tools.filter(t => t.module === "image").length },
    { id: "media", name: "Media", count: tools.filter(t => t.module === "media").length },
    { id: "utility", name: "Utility", count: tools.filter(t => t.module === "utility").length },
    { id: "ai", name: "AI", count: tools.filter(t => t.module === "ai").length },
];

export function getToolBySlug(slug: string): Tool | undefined {
    return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
    if (category === "all") return tools;
    return tools.filter((t) => t.module === category);
}
