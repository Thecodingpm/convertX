import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { FloatingOrb, GradientText, LightSweep } from "../AnimUtils";

// Convert arrows icon (same as logo)
const IconConvert = () => (
    <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
        <path d="M20 48 L50 20 L50 36 L95 36 L95 60 L50 60 L50 76 Z" fill="white" fillOpacity="0.95" />
        <path d="M100 72 L70 100 L70 84 L25 84 L25 60 L70 60 L70 44 Z" fill="white" fillOpacity="0.6" />
    </svg>
);

// Expanding ring
const PulseRing: React.FC<{ frame: number; delay: number; fps: number }> = ({ frame, delay, fps }) => {
    const f = frame - delay;
    if (f < 0) return null;
    const r = interpolate(f, [0, 100], [20, 600], { extrapolateRight: "clamp" });
    const opacity = interpolate(f, [0, 10, 60, 100], [0, 0.5, 0.25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{
            position: "absolute",
            left: 540 - r, top: 680 - r,
            width: r * 2, height: r * 2, borderRadius: "50%",
            border: "2px solid #8b5cf6",
            opacity,
            boxShadow: "0 0 24px #8b5cf666",
        }} />
    );
};

export const Scene5Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });

    // Logo pop
    const logoSp = spring({ frame: frame - 8, fps, config: { damping: 8, stiffness: 65, mass: 0.8 } });

    // Brand name
    const nameSp = spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 90 } });
    const nameOpacity = interpolate(frame, [18, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // URL
    const urlOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const urlSp = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 90 } });

    // CTA button
    const ctaSp = spring({ frame: frame - 65, fps, config: { damping: 9, stiffness: 75 } });
    const ctaOpacity = interpolate(frame, [63, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Badges
    const badgeOpacity = interpolate(frame, [88, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Bottom tagline
    const taglineOpacity = interpolate(frame, [108, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    const badges = [
        { label: "Free Forever", color: "#10b981" },
        { label: "No Account", color: "#6366f1" },
        { label: "Instant", color: "#f59e0b" },
    ];

    // Glow magnitude
    const glow = 0.5 + 0.5 * Math.sin(frame * 0.1);

    return (
        <AbsoluteFill style={{
            background: "radial-gradient(ellipse at 50% 45%, #1a0a30 0%, #0a0a0f 65%)",
            opacity: fadeIn,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 60px",
        }}>
            {/* Ambient orbs */}
            <FloatingOrb x={100} y={400} size={340} color="#6366f1" frame={frame} speed={0.5} />
            <FloatingOrb x={880} y={1400} size={300} color="#8b5cf6" frame={frame} speed={0.7} />
            <FloatingOrb x={50} y={1700} size={200} color="#ec4899" frame={frame} speed={1.1} />

            {/* Expanding rings behind logo */}
            <PulseRing frame={frame} delay={0} fps={fps} />
            <PulseRing frame={frame} delay={25} fps={fps} />
            <PulseRing frame={frame} delay={50} fps={fps} />

            {/* Logo icon */}
            <div style={{
                width: 180, height: 180, borderRadius: 46,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: `scale(${logoSp})`,
                boxShadow: `0 0 ${60 + 50 * glow}px #8b5cf6, 0 0 ${140 + 60 * glow}px #6366f144, 0 40px 80px rgba(0,0,0,0.7)`,
                marginBottom: 36,
            }}>
                <IconConvert />
            </div>

            {/* Brand name */}
            <GradientText
                gradient="linear-gradient(135deg, #fff 20%, #c4b5fd 55%, #f472b6 90%)"
                fontSize={110}
                style={{
                    letterSpacing: -3,
                    transform: `scale(${nameSp})`,
                    opacity: nameOpacity,
                    marginBottom: 16,
                }}
            >
                ConvertX
            </GradientText>

            {/* URL */}
            <div style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: 42,
                color: "#8b5cf6",
                letterSpacing: 2,
                fontWeight: 600,
                opacity: urlOpacity,
                transform: `scale(${urlSp})`,
                marginBottom: 56,
            }}>
                convertx.io
            </div>

            {/* CTA button */}
            <div style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                borderRadius: 70,
                padding: "30px 90px",
                opacity: ctaOpacity,
                transform: `scale(${ctaSp})`,
                boxShadow: `0 0 80px #6366f155, 0 20px 60px rgba(0,0,0,0.4)`,
                marginBottom: 52,
                border: "1px solid #818cf844",
            }}>
                <div style={{
                    fontFamily: "'Arial Black', sans-serif",
                    fontSize: 48, fontWeight: 900, color: "white", letterSpacing: 1,
                }}>
                    Try for Free  →
                </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 20, opacity: badgeOpacity, marginBottom: 44 }}>
                {badges.map((b) => (
                    <div key={b.label} style={{
                        background: `${b.color}18`,
                        border: `1.5px solid ${b.color}66`,
                        borderRadius: 50,
                        padding: "14px 30px",
                        fontFamily: "'Arial', sans-serif",
                        fontSize: 26, color: "white", fontWeight: 700,
                    }}>
                        <span style={{ color: b.color }}>✓</span>{"  "}{b.label}
                    </div>
                ))}
            </div>

            {/* Footer tagline */}
            <div style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: 28, color: "#4b5563",
                textAlign: "center", lineHeight: 1.6,
                opacity: taglineOpacity,
            }}>
                PDF · Image · Audio · Video
                <br />
                All formats. Zero cost. Always.
            </div>

            <LightSweep frame={frame} startFrame={90} color="rgba(255,255,255,0.1)" />
        </AbsoluteFill>
    );
};
