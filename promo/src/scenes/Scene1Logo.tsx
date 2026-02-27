import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { GridLines, FloatingOrb, LightSweep } from "../AnimUtils";

// Particle that explodes outward from center
const Spark: React.FC<{
    angle: number; frame: number; fps: number; color: string; delay: number;
}> = ({ angle, frame, fps, color, delay }) => {
    const f = frame - delay;
    if (f < 0) return null;
    const dist = spring({ frame: f, fps, config: { damping: 30, stiffness: 200, mass: 0.4 } });
    const travel = interpolate(dist, [0, 1], [0, 380 + Math.abs(Math.sin(angle * 13)) * 200]);
    const opacity = interpolate(f, [0, 5, 40, 70], [0, 1, 0.8, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const size = interpolate(f, [0, 10, 55], [8, 14, 4], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    return (
        <div style={{
            position: "absolute",
            left: 540 + Math.cos(angle) * travel - size / 2,
            top: 960 + Math.sin(angle) * travel - size / 2,
            width: size, height: size, borderRadius: "50%",
            background: color,
            opacity,
            boxShadow: `0 0 ${size * 3}px ${color}`,
        }} />
    );
};

// Expanding ring from center
const Ring: React.FC<{
    frame: number; fps: number; delay: number; color: string; maxR: number;
}> = ({ frame, fps, delay, color, maxR }) => {
    const f = frame - delay;
    if (f < 0) return null;
    const p = spring({ frame: f, fps, config: { damping: 60, stiffness: 100 } });
    const r = interpolate(p, [0, 1], [0, maxR]);
    const opacity = interpolate(f, [0, 5, 30, 55], [0, 0.8, 0.4, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    return (
        <div style={{
            position: "absolute",
            left: 540 - r, top: 960 - r,
            width: r * 2, height: r * 2, borderRadius: "50%",
            border: `2px solid ${color}`,
            opacity,
            boxShadow: `0 0 20px ${color}55`,
        }} />
    );
};

const sparkColors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444",
    "#a78bfa", "#f472b6", "#34d399", "#60a5fa", "#fbbf24", "#f87171", "#818cf8", "#c084fc"
];

export const Scene1Logo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo entrance
    const logoSp = spring({ frame: frame - 10, fps, config: { damping: 9, stiffness: 70, mass: 1.2 } });
    const logoOpacity = interpolate(frame, [8, 25], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Exit
    const exit = interpolate(frame, [155, 180], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Glow pulse
    const glow = 0.5 + 0.5 * Math.sin(frame * 0.12);

    // Tagline
    const taglineOpacity = interpolate(frame, [50, 72], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const taglineSp = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 100 } });
    const taglineY = interpolate(taglineSp, [0, 1], [40, 0]);

    // Underline
    const lineW = interpolate(frame, [60, 115], [0, 920], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Glitch text frames
    const glitchChars = "X#@&%$!?<>";
    const brandText = "ConvertX";
    const elapsed = Math.max(0, frame - 12);
    const glitchedBrand = brandText.split("").map((char, i) => {
        const cp = Math.max(0, Math.min(1, (elapsed - i * 2) / 10));
        if (cp >= 1) return char;
        if (cp > 0) return glitchChars[Math.floor((elapsed + i * 7) % glitchChars.length)];
        return "\u00a0";
    }).join("");

    const sparks = Array.from({ length: 32 }, (_, i) => ({
        angle: (i / 32) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.1),
        color: sparkColors[i % sparkColors.length],
        delay: 18 + Math.floor(i / 4) * 3,
    }));

    return (
        <AbsoluteFill style={{
            background: "radial-gradient(ellipse at 50% 55%, #1e0a40 0%, #0a0a0f 65%)",
            opacity: exit,
        }}>
            <GridLines frame={frame} color="#6366f1" opacity={0.07} />

            {/* Ambient orbs */}
            <FloatingOrb x={160} y={420} size={320} color="#6366f1" frame={frame} speed={0.6} />
            <FloatingOrb x={880} y={1520} size={280} color="#8b5cf6" frame={frame} speed={0.8} />
            <FloatingOrb x={60} y={1720} size={200} color="#ec4899" frame={frame} speed={1.1} />

            {/* Pulse rings */}
            <Ring frame={frame} fps={fps} delay={15} color="#8b5cf6" maxR={200} />
            <Ring frame={frame} fps={fps} delay={23} color="#6366f1" maxR={360} />
            <Ring frame={frame} fps={fps} delay={32} color="#ec4899" maxR={540} />

            {/* Sparks */}
            {sparks.map((s, i) => <Spark key={i} {...s} frame={frame} fps={fps} />)}

            {/* Center content */}
            <AbsoluteFill style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
            }}>
                {/* Logo badge */}
                <div style={{
                    width: 220, height: 220, borderRadius: 56,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: `scale(${logoSp})`,
                    opacity: logoOpacity,
                    boxShadow: [
                        `0 0 ${55 + 45 * glow}px #8b5cf6`,
                        `0 0 ${120 + 60 * glow}px #6366f144`,
                        `0 40px 90px rgba(0,0,0,0.65)`,
                    ].join(", "),
                    marginBottom: 44,
                }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <path d="M20 48 L50 20 L50 36 L95 36 L95 60 L50 60 L50 76 Z" fill="white" fillOpacity="0.95" />
                        <path d="M100 72 L70 100 L70 84 L25 84 L25 60 L70 60 L70 44 Z" fill="white" fillOpacity="0.6" />
                    </svg>
                </div>

                {/* Brand — glitch reveal */}
                <div style={{
                    fontFamily: "'Arial Black', 'Impact', sans-serif",
                    fontSize: 108, fontWeight: 900,
                    letterSpacing: -3,
                    background: "linear-gradient(135deg, #fff 20%, #c4b5fd 55%, #f472b6 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: 20,
                    opacity: logoOpacity,
                    transform: `scale(${logoSp})`,
                    minWidth: 700,
                    textAlign: "center",
                }}>
                    {glitchedBrand}
                </div>

                {/* Tagline */}
                <div style={{
                    opacity: taglineOpacity,
                    transform: `translateY(${taglineY}px)`,
                    textAlign: "center",
                }}>
                    <div style={{
                        fontFamily: "'Arial', sans-serif",
                        fontSize: 33, color: "#94a3b8",
                        letterSpacing: 7, textTransform: "uppercase",
                    }}>
                        Convert  ·  Compress  ·  Create
                    </div>
                </div>

                {/* Animated underline */}
                <div style={{
                    width: lineW, height: 3, marginTop: 30,
                    borderRadius: 4,
                    background: "linear-gradient(90deg, transparent 0%, #6366f1 25%, #8b5cf6 50%, #ec4899 75%, transparent 100%)",
                    opacity: taglineOpacity,
                }} />

                <LightSweep frame={frame} startFrame={62} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
