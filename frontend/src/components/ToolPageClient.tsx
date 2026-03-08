"use client";
import { useState, useCallback, useRef, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Upload, X, CheckCircle, AlertCircle, Download,
    ArrowLeft, FileText, Loader2, CloudUpload, ChevronDown
} from "lucide-react";
import { getToolBySlug, tools } from "@/lib/tools";
import { api } from "@/lib/api";
import type { ToolContent } from "@/lib/toolContent";
import styles from "@/app/tools/[slug]/page.module.css";

// ── QR Code UI (client-side, no backend) ────────────────────────────────────
function QrCodeUI({ toolColor }: { toolColor: string }) {
    const [text, setText] = useState("");
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(256);
    const [color, setColor] = useState("#000000");
    const [bg, setBg] = useState("#ffffff");

    const generate = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const QRCode = (await import("qrcode")).default;
            const url = await QRCode.toDataURL(text, {
                width: size,
                margin: 2,
                color: { dark: color, light: bg },
            });
            setQrUrl(url);
        } catch { alert("Failed to generate QR code."); }
        finally { setLoading(false); }
    };

    const download = () => {
        if (!qrUrl) return;
        const a = document.createElement("a");
        a.href = qrUrl;
        a.download = "qrcode.png";
        a.click();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div>
                <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: 6 }}>
                    URL or Text
                </label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generate()}
                    placeholder="https://example.com or any text..."
                    style={{
                        width: "100%", padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--color-border)",
                        background: "var(--color-bg)",
                        color: "var(--color-text)",
                        fontSize: "0.9375rem", outline: "none", boxSizing: "border-box",
                    }}
                />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-sm)" }}>
                <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Size</label>
                    <select value={size} onChange={(e) => setSize(Number(e.target.value))}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}>
                        <option value={128}>128px</option>
                        <option value={256}>256px</option>
                        <option value={512}>512px</option>
                        <option value={1024}>1024px</option>
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 4 }}>QR Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                        style={{ width: "100%", height: 38, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", cursor: "pointer", padding: 2 }} />
                </div>
                <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Background</label>
                    <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                        style={{ width: "100%", height: 38, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", cursor: "pointer", padding: 2 }} />
                </div>
            </div>
            <button onClick={generate} disabled={!text.trim() || loading} className="btn btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: "1rem", fontWeight: 600, background: toolColor }}>
                {loading ? "Generating..." : "Generate QR Code"}
            </button>
            {qrUrl && (
                <div style={{ textAlign: "center", paddingTop: "var(--space-md)" }}>
                    <img src={qrUrl} alt="Generated QR Code"
                        style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-light)", maxWidth: "100%" }} />
                    <button onClick={download} className="btn btn-primary"
                        style={{ marginTop: "var(--space-md)", width: "100%", padding: "12px", background: toolColor }}>
                        ⬇ Download QR Code (PNG)
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Types ────────────────────────────────────────────────────────────────────
type Status = "idle" | "uploading" | "processing" | "done" | "error";

function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ToolPageClient({ slug: propSlug, content }: { slug?: string; content?: ToolContent }) {
    const params = useParams();
    const slug = propSlug ?? (params?.slug as string);
    const tool = getToolBySlug(slug);

    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const [progress, setProgress] = useState(0);
    const [conversionId, setConversionId] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [extraFields, setExtraFields] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!tool) {
        return (
            <div className={styles.notFound}>
                <h1>Tool not found</h1>
                <Link href="/tools" className="btn btn-primary">Browse all tools</Link>
            </div>
        );
    }

    if (tool.comingSoon) {
        return (
            <div className={styles.notFound}>
                <div className={styles.comingSoonWrap}>
                    <tool.icon size={64} color={tool.color} strokeWidth={1.5} />
                    <h1>{tool.name}</h1>
                    <p>This tool is coming soon. Stay tuned!</p>
                    <Link href="/tools" className="btn btn-primary">← Back to tools</Link>
                </div>
            </div>
        );
    }

    const Icon = tool.icon;

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const arr = Array.from(incoming);

        // Client-side size check: 500MB for media tools, 100MB for all others
        const maxBytes = tool.module === "media" ? 500 * 1024 * 1024 : 100 * 1024 * 1024;
        const maxLabel = tool.module === "media" ? "500MB" : "100MB";
        const oversized = arr.find(f => f.size > maxBytes);
        if (oversized) {
            setErrorMsg(`"${oversized.name}" is too large. Please upload a file smaller than ${maxLabel}.`);
            setStatus("error");
            return;
        }

        setFiles(prev => tool.multiple ? [...prev, ...arr] : arr);
        setStatus("idle");
        setErrorMsg("");
        // CRITICAL: reset the input value so onChange fires even if the
        // user picks the same file again (browser skips onChange otherwise)
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (files.length <= 1) setStatus("idle");
    };

    const pollStatus = async (id: number) => {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            const res = await api.getStatus(id);
            if (res.success) {
                const data = res.data as { status: string };
                if (data.status === "completed") {
                    clearInterval(interval);
                    setStatus("done");
                    setProgress(100);
                } else if (data.status === "failed") {
                    clearInterval(interval);
                    setStatus("error");
                    setErrorMsg("Conversion failed. Please try again.");
                } else {
                    setProgress(Math.min(90, attempts * 8));
                }
            }
            if (attempts >= 30) {
                clearInterval(interval);
                setStatus("error");
                setErrorMsg("Conversion timed out. Please try again.");
            }
        }, 2000);
    };

    const formatError = (raw: string) => {
        // If the backend has sent a specific PHP ini limit message, show it directly
        if (raw.includes("upload_max_filesize") || raw.includes("post_max_size")) return raw;
        // Check for specific generic file size phrases
        if (raw.includes("413") || raw.includes("payload")) return `File is too large. Please upload a file smaller than ${tool.module === "media" ? "500MB" : "100MB"}.`;
        if (raw.includes("mimes") || raw.includes("mimetypes") || raw.includes("file type")) return "Invalid file type. Please check accepted formats above.";
        if (raw.includes("required") || raw.includes("Please select")) return "No file received. If your file is very large, try a smaller one.";
        return raw || "Upload failed. Please try again.";
    };

    const handleConvert = async (e: FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return;
        setStatus("uploading");
        setProgress(10);
        setErrorMsg("");
        try {
            const formData = new FormData();
            if (tool.multiple) {
                files.forEach(f => formData.append("files[]", f));
            } else {
                formData.append("file", files[0]);
            }
            Object.entries(extraFields).forEach(([k, v]) => { if (v) formData.append(k, v); });
            setProgress(40);
            setStatus("processing");
            const res = await api.uploadFile(tool.endpoint!, formData);
            if (res.success) {
                const data = res.data as { conversion_id: number; id?: number };
                const convId = data.conversion_id ?? data.id;
                setConversionId(convId);
                setProgress(75);
                const statusRes = await api.getStatus(convId);
                if (statusRes.success) {
                    const sd = statusRes.data as { status: string };
                    if (sd.status === "completed") { setStatus("done"); setProgress(100); return; }
                    if (sd.status === "failed") { setStatus("error"); setErrorMsg("Conversion failed on the server. Please try again."); return; }
                }
                pollStatus(convId);
            } else {
                setStatus("error");
                setErrorMsg(formatError(res.message || "Upload failed. Please try again."));
            }
        } catch {
            setStatus("error");
            setErrorMsg("Network error. Please check your connection.");
        }
    };

    const reset = () => {
        setFiles([]); setStatus("idle"); setProgress(0);
        setConversionId(null); setErrorMsg(""); setExtraFields({});
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <div className={styles.toolHeader}>
                    <div className={styles.toolIconWrap} style={{ background: `${tool.color}18`, color: tool.color }}>
                        <Icon size={32} />
                    </div>
                    <div>
                        <h1>{tool.name}</h1>
                        <p>{tool.description}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    {/* Client-side tools (e.g. QR Code) — no backend needed */}
                    {tool.clientSide && slug === "qr-code" && (
                        <QrCodeUI toolColor={tool.color} />
                    )}

                    {/* Done */}
                    {!tool.clientSide && status === "done" && conversionId && (
                        <div className={styles.doneState}>
                            <CheckCircle size={56} color="#22c55e" strokeWidth={1.5} />
                            <h2>Conversion Complete!</h2>
                            <p>Your file is ready to download.</p>
                            <div className={styles.doneActions}>
                                <a href={api.getDownloadUrl(conversionId)} download className="btn btn-primary btn-lg">
                                    <Download size={18} /> Download File
                                </a>
                                <button onClick={reset} className="btn btn-secondary btn-lg">Convert Another</button>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {!tool.clientSide && status === "error" && (
                        <div className={styles.errorState}>
                            <AlertCircle size={56} color="#ef4444" strokeWidth={1.5} />
                            <h2>Conversion Failed</h2>
                            <p>{errorMsg}</p>
                            <button onClick={reset} className="btn btn-primary">Try Again</button>
                        </div>
                    )}

                    {/* Processing */}
                    {!tool.clientSide && (status === "uploading" || status === "processing") && (
                        <div className={styles.processingState}>
                            <Loader2 size={48} className={styles.spinner} color={tool.color} />
                            <h2>{status === "uploading" ? "Uploading..." : "Processing..."}</h2>
                            <p>Please wait, this may take a few seconds.</p>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${progress}%`, background: tool.color }} />
                            </div>
                            <span className={styles.progressLabel}>{progress}%</span>
                        </div>
                    )}

                    {/* Idle — Upload form */}
                    {!tool.clientSide && status === "idle" && (
                        <form onSubmit={handleConvert}>
                            <div
                                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""} ${files.length > 0 ? styles.dropzoneHasFiles : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                onClick={() => {
                                    // For multi-file tools, always allow clicking to add more
                                    if (files.length === 0 || tool.multiple) {
                                        fileInputRef.current?.click();
                                    }
                                }}
                            >
                                <input ref={fileInputRef} type="file" accept={tool.acceptedTypes}
                                    multiple={tool.multiple} onChange={(e) => addFiles(e.target.files)}
                                    style={{ display: "none" }} />
                                {files.length === 0 ? (
                                    <div className={styles.dropzoneContent}>
                                        <div className={styles.uploadIcon} style={{ color: tool.color }}>
                                            <CloudUpload size={48} strokeWidth={1.5} />
                                        </div>
                                        <p className={styles.dropzoneTitle}>
                                            {isDragging ? "Drop files here" : "Drag & drop files here"}
                                        </p>
                                        <p className={styles.dropzoneSubtitle}>
                                            or <span style={{ color: tool.color }}>click to browse</span>
                                        </p>
                                        <p className={styles.dropzoneHint}>
                                            Accepted: {tool.acceptedTypes?.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.fileList} onClick={e => e.stopPropagation()}>
                                        {files.map((f, i) => (
                                            <div key={i} className={styles.fileItem}>
                                                <FileText size={20} color={tool.color} />
                                                <div className={styles.fileInfo}>
                                                    <span className={styles.fileName}>{f.name}</span>
                                                    <span className={styles.fileSize}>{formatBytes(f.size)}</span>
                                                </div>
                                                <button type="button" className={styles.fileRemove} onClick={() => removeFile(i)}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {tool.multiple && (
                                            <button type="button" className={styles.addMore}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}>
                                                <Upload size={16} /> Add more files
                                            </button>
                                        )}
                                        {tool.multiple && files.length < 2 && (
                                            <p style={{ fontSize: "0.78rem", color: "#f59e0b", margin: "4px 0 0", textAlign: "center" }}>
                                                ⚠ Add at least 2 files to merge
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {tool.extraFields && tool.extraFields.length > 0 && (
                                <div className={styles.extraFields}>
                                    {tool.extraFields.map((field) => (
                                        <div key={field.name} className={styles.field}>
                                            <label htmlFor={field.name}>{field.label}</label>
                                            {field.type === "select" ? (
                                                <select id={field.name} className={styles.select}
                                                    value={extraFields[field.name] || ""}
                                                    onChange={(e) => setExtraFields(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    required={field.required}>
                                                    <option value="">Select...</option>
                                                    {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </select>
                                            ) : (
                                                <input id={field.name} type={field.type} className={styles.input}
                                                    placeholder={field.placeholder}
                                                    value={extraFields[field.name] || ""}
                                                    onChange={(e) => setExtraFields(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    required={field.required} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button type="submit" className={styles.convertBtn}
                                disabled={files.length === 0 || (tool.multiple && files.length < 2)}
                                style={{ background: (files.length > 0 && !(tool.multiple && files.length < 2)) ? tool.color : undefined }}>
                                <Icon size={20} />
                                {tool.multiple
                                    ? `Merge ${files.length} File${files.length !== 1 ? "s" : ""}`
                                    : `Convert File`}
                            </button>
                        </form>
                    )}
                </div>

                <div className={styles.infoRow}>
                    {["Files deleted after 1 hour", "No registration required", "Free to use"].map(t => (
                        <div key={t} className={styles.infoItem}>
                            <CheckCircle size={16} color="#22c55e" />
                            <span>{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SEO Content Sections ─────────────────────────────────── */}
            {content && (
                <div style={{ maxWidth: "var(--max-width)", margin: "6rem auto 0 auto", padding: "0 var(--space-lg) var(--space-3xl)" }}>

                    {/* H1 + Intro */}
                    <div style={{ marginBottom: "3rem" }}>
                        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                            {content.h1}
                        </h1>
                        <p style={{ fontSize: "1.0625rem", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                            {content.intro}
                        </p>
                    </div>

                    {/* Content sections */}
                    <div style={{ display: "grid", gap: "2rem", marginBottom: "3rem" }}>
                        {content.sections.map((section) => (
                            <section key={section.heading}>
                                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.625rem" }}>
                                    {section.heading}
                                </h2>
                                <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                    {section.body}
                                </p>
                            </section>
                        ))}
                    </div>

                    {/* FAQ section */}
                    <section style={{ marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                            Frequently Asked Questions
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {content.faqs.map((faq) => (
                                <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </section>

                    {/* Related tools */}
                    {content.relatedSlugs.length > 0 && (
                        <section>
                            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                                Related Tools
                            </h2>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "0.75rem",
                            }}>
                                {content.relatedSlugs.map((rSlug) => {
                                    const relTool = tools.find(t => t.slug === rSlug);
                                    if (!relTool) return null;
                                    const RelIcon = relTool.icon;
                                    return (
                                        <Link
                                            key={rSlug}
                                            href={`/${rSlug}`}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                padding: "0.75rem 1rem",
                                                borderRadius: "var(--radius-lg)",
                                                border: "1.5px solid var(--color-border-light)",
                                                background: "var(--color-surface)",
                                                textDecoration: "none",
                                                color: "var(--color-text)",
                                                transition: "border-color 0.15s, box-shadow 0.15s",
                                            }}
                                        >
                                            <div style={{
                                                width: 36, height: 36, borderRadius: "var(--radius-md)",
                                                background: `${relTool.color}18`, color: relTool.color,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                            }}>
                                                <RelIcon size={18} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{relTool.name}</div>
                                                <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", lineClamp: 1 }}>{relTool.description}</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            style={{
                border: "1.5px solid var(--color-border-light)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface)",
                overflow: "hidden",
            }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "var(--color-text)",
                    textAlign: "left",
                    gap: "1rem",
                }}
                aria-expanded={open}
            >
                <span>{question}</span>
                <ChevronDown
                    size={18}
                    style={{
                        flexShrink: 0,
                        transition: "transform 0.2s",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        color: "var(--color-text-muted)",
                    }}
                />
            </button>
            {open && (
                <div
                    style={{
                        padding: "0 1.25rem 1rem",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                        fontSize: "0.9375rem",
                        borderTop: "1px solid var(--color-border-light)",
                        paddingTop: "0.875rem",
                    }}
                >
                    {answer}
                </div>
            )}
        </div>
    );
}
