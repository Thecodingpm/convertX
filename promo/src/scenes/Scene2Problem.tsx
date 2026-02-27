import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { FileText, Image, Video, Music2 } from "lucide-react";
import { GridLines, FloatingOrb, GradientText } from "../AnimUtils";

const problems = [
    { Icon: FileText, text: "Wrong file format?", color: "#ef4444" },
    { Icon: Image, text: "Images too heavy?", color: "#22c55e" },
    { Icon: Video, text: "Can't share video?", color: "#8b5cf6" },
    { Icon: Music2, text: "Audio won't play?", color: "#f59e0b" },
];

const ProbLine: React.FC<{
    Icon: React.FC<{ size: number; color: string; strokeWidth: number }>;
    text: string; color: string; delay: number; frame: number; fps: number;
}> = ({ Icon, text, color, delay, frame, fps }) => {
    const f = frame - delay;
    const sp = spring({ frame: f, fps, config: { damping: 12, stiffness: 100 } });
    const opacity = interpolate(f, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 28, opacity,
            transform: `translateX(${interpolate(sp, [0, 1], [-300, 0])}px)`,
            marginBottom: 30, padding: "22px 28px",
            background: `${color}10`,
            borderLeft: `5px solid ${color}`,
            borderRadius: "0 22px 22px 0",
        }}>
            <div style={{
                width: 68, height: 68, borderRadius: 16,
                background: `${color}1a`, border: `1px solid ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                <Icon size={34} color={color} strokeWidth={1.8} />
            </div>
            <div style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: 50, fontWeight: 800, color: "white", letterSpacing: -1,
            }}>
                {text}
            </div>
        </div>
    );
};

export const Scene2Problem: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(frame, [175, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const solveF = frame - 110;
    const solveSp = spring({ frame: solveF, fps, config: { damping: 10, stiffness: 80 } });
    const solveOpacity = interpolate(solveF, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const divW = interpolate(frame, [100, 140], [0, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{
            background: "radial-gradient(ellipse at 30% 30%, #1e1040 0%, #0a0a0f 65%)",
            opacity: fadeIn * fadeOut,
            padding: "90px 70px 60px",
            display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
            <GridLines frame={frame} color="#8b5cf6" opacity={0.05} />
            <FloatingOrb x={900} y={200} size={300} color="#8b5cf6" frame={frame} speed={0.7} />
            <FloatingOrb x={-50} y={1800} size={250} color="#6366f1" frame={frame} speed={0.9} />

            <div style={{
                fontFamily: "'Arial', sans-serif", fontSize: 26, color: "#7c3aed",
                letterSpacing: 8, textTransform: "uppercase", marginBottom: 52, opacity: fadeIn,
            }}>
                ⚡ Sound familiar?
            </div>

            {problems.map((p, i) => (
                <ProbLine key={p.text} {...p} delay={15 + i * 28} frame={frame} fps={fps} />
            ))}

            <div style={{
                width: divW, height: 3, marginTop: 36,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                borderRadius: 4,
            }} />

            <div style={{
                marginTop: 40, opacity: solveOpacity,
                transform: `translateY(${interpolate(solveSp, [0, 1], [60, 0])}px)`,
            }}>
                <GradientText
                    gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 80%, #f59e0b 100%)"
                    fontSize={80}
                    style={{ letterSpacing: -2, lineHeight: 1.0 }}
                >
                    One app solves
                    <br />everything.
                </GradientText>
            </div>
        </AbsoluteFill>
    );
};
