import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { Zap, ShieldCheck, Star } from "lucide-react";
import { GridLines, FloatingOrb, GradientText, LightSweep } from "../AnimUtils";

const features = [
    {
        Icon: Zap,
        title: "Lightning Fast",
        desc: "Processed in seconds. No waiting.",
        color: "#f59e0b",
        bg: "linear-gradient(135deg, #2d1800 0%, #0a0a0f 100%)",
        stat: "< 10s",
    },
    {
        Icon: ShieldCheck,
        title: "100% Private",
        desc: "Files auto-deleted after 1 hour.",
        color: "#10b981",
        bg: "linear-gradient(135deg, #052010 0%, #0a0a0f 100%)",
        stat: "0 leaks",
    },
    {
        Icon: Star,
        title: "Always Free",
        desc: "No account. No limits. No BS.",
        color: "#6366f1",
        bg: "linear-gradient(135deg, #0f0a30 0%, #0a0a0f 100%)",
        stat: "30+ tools",
    },
];

const FeatureCard: React.FC<{
    f: typeof features[0]; delay: number; frame: number; fps: number;
}> = ({ f, delay, frame, fps }) => {
    const fr = frame - delay;
    const sp = spring({ frame: fr, fps, config: { damping: 11, stiffness: 85 } });
    const opacity = interpolate(fr, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const shimmer = interpolate(frame, [delay + 10, delay + 55], [-260, 1300], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const { Icon } = f;

    return (
        <div style={{
            background: f.bg,
            border: `1.5px solid ${f.color}44`,
            borderRadius: 28,
            padding: "32px 36px",
            display: "flex", alignItems: "center", gap: 30,
            opacity,
            transform: `translateX(${interpolate(sp, [0, 1], [-520, 0])}px)`,
            boxShadow: `0 16px 48px ${f.color}22, inset 0 1px 0 ${f.color}33`,
            overflow: "hidden", position: "relative",
        }}>
            {/* shimmer sweep */}
            <div style={{
                position: "absolute", top: 0, bottom: 0, left: shimmer, width: 110,
                background: `linear-gradient(90deg, transparent, ${f.color}22, transparent)`,
                transform: "skewX(-20deg)", pointerEvents: "none",
            }} />
            {/* Icon container */}
            <div style={{
                width: 90, height: 90, flexShrink: 0, borderRadius: 22,
                background: `${f.color}18`, border: `1.5px solid ${f.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon size={46} color={f.color} strokeWidth={1.7} />
            </div>
            {/* Text */}
            <div style={{ flex: 1 }}>
                <div style={{
                    fontFamily: "'Arial Black', sans-serif",
                    fontSize: 48, fontWeight: 900, color: "white", letterSpacing: -1, marginBottom: 8,
                }}>
                    {f.title}
                </div>
                <div style={{ fontFamily: "'Arial', sans-serif", fontSize: 30, color: "#94a3b8" }}>
                    {f.desc}
                </div>
            </div>
            {/* Stat badge */}
            <div style={{
                background: `${f.color}22`, border: `1px solid ${f.color}66`,
                borderRadius: 14, padding: "10px 22px",
                fontFamily: "'Arial Black', sans-serif", fontSize: 24, fontWeight: 900,
                color: f.color, flexShrink: 0,
            }}>
                {f.stat}
            </div>
        </div>
    );
};

export const Scene4Features: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(frame, [188, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const headSp = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

    return (
        <AbsoluteFill style={{
            background: "radial-gradient(ellipse at 50% 30%, #0d1117 0%, #0a0a0f 100%)",
            opacity: fadeIn * fadeOut,
            padding: "90px 65px",
            display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
            <GridLines frame={frame} color="#10b981" opacity={0.045} />
            <FloatingOrb x={950} y={400} size={300} color="#10b981" frame={frame} speed={0.7} />
            <FloatingOrb x={-60} y={1600} size={240} color="#6366f1" frame={frame} speed={0.9} />

            <div style={{
                fontFamily: "'Arial', sans-serif", fontSize: 27, letterSpacing: 8,
                textTransform: "uppercase", color: "#10b981", marginBottom: 40,
                opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
            }}>
                Why ConvertX?
            </div>

            <GradientText
                gradient="linear-gradient(90deg, #fff 0%, #6ee7b7 50%, #818cf8 100%)"
                fontSize={72}
                style={{ letterSpacing: -2, marginBottom: 55, transform: `scale(${headSp})` }}
            >
                Built for everyone.
            </GradientText>

            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                {features.map((f, i) => (
                    <FeatureCard key={f.title} f={f} delay={20 + i * 50} frame={frame} fps={fps} />
                ))}
            </div>
            <LightSweep frame={frame} startFrame={30} />
        </AbsoluteFill>
    );
};
