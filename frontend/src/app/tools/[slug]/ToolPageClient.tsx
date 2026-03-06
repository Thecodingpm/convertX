"use client";
import { useState, useCallback, useRef, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Upload, X, CheckCircle, AlertCircle, Download,
    ArrowLeft, FileText, Loader2, CloudUpload, Sparkles
} from "lucide-react";
import { getToolBySlug } from "@/lib/tools";
import { api } from "@/lib/api";
import styles from "./page.module.css";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
}

/** Animated download arrow icon */
function DownloadIcon() {
    return (
        <span className={styles.dlIconWrap}>
            <Download size={20} />
        </span>
    );
}

/** Confetti dot */
function ConfettiDots({ color }: { color: string }) {
    const dots = [
        { x: -40, y: -20, size: 8, delay: 0 },
        { x: 35, y: -30, size: 6, delay: 0.06 },
        { x: -25, y: 30, size: 10, delay: 0.1 },
        { x: 45, y: 20, size: 7, delay: 0.04 },
        { x: 10, y: -42, size: 5, delay: 0.15 },
        { x: -50, y: 10, size: 6, delay: 0.08 },
    ];
    return (
        <div className={styles.confettiWrap} aria-hidden>
            {dots.map((d, i) => (
                <span
                    key={i}
                    className={styles.confettiDot}
                    style={{
                        width: d.size,
                        height: d.size,
                        background: i % 2 === 0 ? color : "#10b981",
                        transform: `translate(${d.x}px, ${d.y}px)`,
                        animationDelay: `${d.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default function ToolPageClient({ slug: propSlug }: { slug?: string }) {
    const params = useParams();
    const router = useRouter();
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
        setFiles(prev => tool.multiple ? [...prev, ...arr] : arr);
        setStatus("idle");
        setErrorMsg("");
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
        if (raw.includes("too large") || raw.includes("413") || raw.includes("max:") || raw.includes("payload")) return "File is too large. Please upload a file smaller than 100MB.";
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
            Object.entries(extraFields).forEach(([k, v]) => {
                if (v) formData.append(k, v);
            });

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
                    if (sd.status === "completed") {
                        setStatus("done");
                        setProgress(100);
                        return;
                    } else if (sd.status === "failed") {
                        setStatus("error");
                        setErrorMsg("Conversion failed on the server. Please try again.");
                        return;
                    }
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
        setFiles([]);
        setStatus("idle");
        setProgress(0);
        setConversionId(null);
        setErrorMsg("");
        setExtraFields({});
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Back */}
                <Link href="/tools" className={styles.back}>
                    <ArrowLeft size={16} /> All Tools
                </Link>

                {/* Tool Header */}
                <div className={styles.toolHeader}>
                    <div className={styles.toolIconWrap} style={{ background: `${tool.color}18`, color: tool.color }}>
                        <Icon size={32} />
                    </div>
                    <div>
                        <h1>{tool.name}</h1>
                        <p>{tool.description}</p>
                    </div>
                </div>

                {/* Main Card */}
                <div className={styles.card}>

                    {/* State: Done */}
                    {status === "done" && conversionId && (
                        <div className={styles.doneState}>
                            <div className={styles.successIconWrap}>
                                <ConfettiDots color={tool.color} />
                                <div className={styles.successRing}>
                                    <CheckCircle size={52} color="#10b981" strokeWidth={1.8} />
                                </div>
                            </div>
                            <h2>Conversion Complete!</h2>
                            <p>Your file is ready. Click below to download.</p>
                            <div className={styles.doneActions}>
                                <a
                                    href={api.getDownloadUrl(conversionId)}
                                    download
                                    className={`btn btn-primary btn-lg ${styles.downloadBtn}`}
                                >
                                    <DownloadIcon /> Download File
                                </a>
                                <button onClick={reset} className="btn btn-secondary btn-lg">
                                    Convert Another
                                </button>
                            </div>
                        </div>
                    )}

                    {/* State: Error */}
                    {status === "error" && (
                        <div className={styles.errorState}>
                            <AlertCircle size={52} color="#ef4444" strokeWidth={1.5} />
                            <h2>Conversion Failed</h2>
                            <p>{errorMsg}</p>
                            <button onClick={reset} className="btn btn-primary">Try Again</button>
                        </div>
                    )}

                    {/* State: Processing / Uploading */}
                    {(status === "uploading" || status === "processing") && (
                        <div className={styles.processingState}>
                            <div className={styles.processingIconWrap} style={{ color: tool.color }}>
                                <Loader2 size={44} className={styles.spinner} />
                            </div>
                            <h2>{status === "uploading" ? "Uploading…" : "Converting…"}</h2>
                            <p>Please wait, this may take a few seconds.</p>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${tool.color}, #7c3aed)` }}
                                />
                            </div>
                            <span className={styles.progressLabel}>{progress}%</span>
                        </div>
                    )}

                    {/* State: Idle */}
                    {status === "idle" && (
                        <form onSubmit={handleConvert}>
                            {/* Dropzone */}
                            <div
                                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""} ${files.length > 0 ? styles.dropzoneHasFiles : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={tool.acceptedTypes}
                                    multiple={tool.multiple}
                                    onChange={(e) => addFiles(e.target.files)}
                                    style={{ display: "none" }}
                                />

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
                                                <button
                                                    type="button"
                                                    className={styles.fileRemove}
                                                    onClick={() => removeFile(i)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {tool.multiple && (
                                            <button
                                                type="button"
                                                className={styles.addMore}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload size={16} /> Add more files
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Extra Fields */}
                            {tool.extraFields && tool.extraFields.length > 0 && (
                                <div className={styles.extraFields}>
                                    {tool.extraFields.map((field) => (
                                        <div key={field.name} className={styles.field}>
                                            <label htmlFor={field.name}>{field.label}</label>
                                            {field.type === "select" ? (
                                                <select
                                                    id={field.name}
                                                    className={styles.select}
                                                    value={extraFields[field.name] || ""}
                                                    onChange={(e) => setExtraFields(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    required={field.required}
                                                >
                                                    <option value="">Select…</option>
                                                    {field.options?.map(o => (
                                                        <option key={o.value} value={o.value}>{o.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    id={field.name}
                                                    type={field.type}
                                                    className={styles.input}
                                                    placeholder={field.placeholder}
                                                    value={extraFields[field.name] || ""}
                                                    onChange={(e) => setExtraFields(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    required={field.required}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className={styles.convertBtn}
                                disabled={files.length === 0}
                                style={files.length > 0 ? { background: `linear-gradient(135deg, ${tool.color}, #7c3aed)` } : {}}
                            >
                                <Sparkles size={18} />
                                Convert {files.length > 1 ? `${files.length} Files` : "File"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Info Footer */}
                <div className={styles.infoRow}>
                    <div className={styles.infoItem}><CheckCircle size={14} color="#10b981" /><span>Files deleted after 1 hour</span></div>
                    <div className={styles.infoItem}><CheckCircle size={14} color="#10b981" /><span>No registration required</span></div>
                    <div className={styles.infoItem}><CheckCircle size={14} color="#10b981" /><span>100% free to use</span></div>
                </div>
            </div>
        </div>
    );
}
