import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import {
    FileText, Image, Music, Film, FileArchive,
    Scissors, Merge, Wand2, Headphones,
} from "lucide-react";
import { GridLines, FloatingOrb, LightSweep, GradientText } from "../AnimUtils";

const tools = [
    { name: "PDF to Word", Icon: FileText, color: "#3b82f6", bg: "#0f2744" },
    { name: "Merge PDFs", Icon: Merge, color: "#8b5cf6", bg: "#1e0a40" },
    { name: "Compress PDF", Icon: FileArchive, color: "#06b6d4", bg: "#042830" },
    { name: "Split PDF", Icon: Scissors, color: "#ef4444", bg: "#2d0607" },
    { name: "Edit Images", Icon: Wand2, color: "#22c55e", bg: "#052010" },
    { name: "JPG → PNG", Icon: Image, color: "#60a5fa", bg: "#091630" },
    { name: "Extract Audio", Icon: Headphones, color: "#f59e0b", bg: "#2d1800" },
    { name: "Video → GIF", Icon: Film, color: "#f97316", bg: "#2d1000" },
    { name: "Audio Convert", Icon: Music, color: "#ec4899", bg: "#2d0819" },
];

const ToolCard: React.FC<{
    tool: typeof tools[0]; index: number; frame: number; fps: number;
}> = ({ tool, index, frame, fps }) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const delay = 25 + col * 14 + row * 28;
    const f = frame - delay;
    const sp = spring({ frame: f, fps, config: { damping: 10, stiffness: 100 } });
    const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const arrived = Math.max(0, f);
    const pulse = 0.6 + 0.4 * Math.sin(arrived * 0.09 + index * 1.2);
    const { Icon } = tool;

    return (
        <div style={{
            background: `linear-gradient(145deg, ${tool.bg} 0%, #0a0a0f 100%)`,
            border: `1.5px solid ${tool.color}${Math.round(35 + 25 * pulse).toString(16).padStart(2, "0")}`,
            borderRadius: 26,
            padding: "28px 16px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            opacity,
            transform: `scale(${sp}) translateY(${interpolate(sp, [0, 1], [50, 0])}px)`,
            boxShadow: `0 10px 32px ${tool.color}22, inset 0 1px 0 ${tool.color}33`,
        }}>
            <div style={{
                width: 76, height: 76, borderRadius: 20,
                background: `${tool.color}1a`,
                border: `1.5px solid ${tool.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon size={38} color={tool.color} strokeWidth={1.8} />
            </div>
            <div style={{
                fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
                fontSize: 22, fontWeight: 700, color: "white",
                textAlign: "center", lineHeight: 1.2,
            }}>
                {tool.name}
            </div>
        </div>
    );
};

export const Scene3Tools: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(frame, [245, 270], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const titleSp = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

    return (
        <AbsoluteFill style={{
            background: "radial-gradient(ellipse at 70% 80%, #0f172a 0%, #0a0a0f 70%)",
            opacity: fadeIn * fadeOut,
            padding: "80px 55px 60px",
            display: "flex", flexDirection: "column",
        }}>
            <GridLines frame={frame} color="#3b82f6" opacity={0.05} />
            <FloatingOrb x={1000} y={900} size={350} color="#3b82f6" frame={frame} speed={0.6} />
            <FloatingOrb x={-80} y={300} size={200} color="#8b5cf6" frame={frame} speed={1.0} />

            <GradientText
                gradient="linear-gradient(90deg, #fff 0%, #93c5fd 60%, #818cf8 100%)"
                fontSize={70}
                style={{ transform: `scale(${titleSp})`, letterSpacing: -2, marginBottom: 8 }}
            >
                30+ Tools.
            </GradientText>
            <div style={{
                fontFamily: "'Arial', sans-serif", fontSize: 30, color: "#64748b",
                marginBottom: 44, letterSpacing: 1,
                opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
            }}>
                PDF  ·  Image  ·  Video  ·  Audio
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, flex: 1 }}>
                {tools.map((t, i) => <ToolCard key={t.name} tool={t} index={i} frame={frame} fps={fps} />)}
            </div>

            <div style={{
                marginTop: 32, textAlign: "center",
                fontFamily: "'Arial Black', sans-serif", fontSize: 30, fontWeight: 900,
                color: "#6366f1", letterSpacing: 1,
                opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
                🚀  All free — no sign-up ever
            </div>
            <LightSweep frame={frame} startFrame={20} />
        </AbsoluteFill>
    );
};
