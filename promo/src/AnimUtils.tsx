import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";

// Shared helpers
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Glitch characters
const GLITCH_CHARS = "X#@&%$!?<>";

interface GlitchTextProps {
    text: string;
    frame: number;
    startFrame: number;
    fontSize: number;
    color?: string;
    style?: React.CSSProperties;
}
export const GlitchText: React.FC<GlitchTextProps> = ({
    text, frame, startFrame, fontSize, color = "white", style
}) => {
    const elapsed = frame - startFrame;
    const progress = Math.max(0, Math.min(1, elapsed / 20));
    const rendered = text.split("").map((char, i) => {
        const charProgress = Math.max(0, Math.min(1, (elapsed - i * 2) / 10));
        const isGlitching = charProgress < 1 && charProgress > 0;
        const display = isGlitching
            ? GLITCH_CHARS[Math.floor((elapsed + i * 7) % GLITCH_CHARS.length)]
            : charProgress >= 1 ? char : " ";
        return display;
    }).join("");

    return (
        <div style={{ fontFamily: "'Arial Black', sans-serif", fontSize, fontWeight: 900, color, letterSpacing: -2, opacity: progress > 0 ? 1 : 0, ...style }}>
            {rendered}
        </div>
    );
};

// Animated background grid lines
export const GridLines: React.FC<{ frame: number; color?: string; opacity?: number }> = ({
    frame, color = "#6366f1", opacity = 0.07
}) => {
    const offset = (frame * 1.5) % 80;
    return (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }} viewBox="0 0 1080 1920">
            {/* Vertical lines */}
            {Array.from({ length: 14 }, (_, i) => (
                <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="1920" stroke={color} strokeWidth="1" />
            ))}
            {/* Horizontal lines scrolling */}
            {Array.from({ length: 26 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 80 - offset} x2="1080" y2={i * 80 - offset} stroke={color} strokeWidth="1" />
            ))}
        </svg>
    );
};

// Floating orb
export const FloatingOrb: React.FC<{
    x: number; y: number; size: number; color: string; frame: number; speed?: number;
}> = ({ x, y, size, color, frame, speed = 1 }) => {
    const dx = Math.sin(frame * 0.02 * speed) * 30;
    const dy = Math.cos(frame * 0.015 * speed) * 20;
    return (
        <div style={{
            position: "absolute",
            left: x + dx - size / 2,
            top: y + dy - size / 2,
            width: size, height: size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}66 0%, transparent 70%)`,
            filter: `blur(${size * 0.3}px)`,
            pointerEvents: "none",
        }} />
    );
};

// Gradient text
export const GradientText: React.FC<{
    children: React.ReactNode;
    gradient: string;
    fontSize: number;
    style?: React.CSSProperties;
}> = ({ children, gradient, fontSize, style }) => (
    <div style={{
        fontFamily: "'Arial Black', sans-serif",
        fontSize,
        fontWeight: 900,
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1.1,
        ...style,
    }}>
        {children}
    </div>
);

// Light sweep shimmer
export const LightSweep: React.FC<{ frame: number; startFrame: number; color?: string }> = ({
    frame, startFrame, color = "rgba(255,255,255,0.15)"
}) => {
    const progress = interpolate(frame, [startFrame, startFrame + 40], [-200, 1300], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
        }}>
            <div style={{
                position: "absolute",
                top: 0, bottom: 0,
                left: progress,
                width: 200,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                transform: "skewX(-20deg)",
            }} />
        </div>
    );
};
