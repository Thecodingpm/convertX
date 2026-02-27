import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene1Logo } from "./scenes/Scene1Logo";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Tools } from "./scenes/Scene3Tools";
import { Scene4Features } from "./scenes/Scene4Features";
import { Scene5Outro } from "./scenes/Scene5Outro";

// Scene timing (frames at 30fps):
// Scene 1:  0–180   (0–6s)   Logo reveal
// Scene 2: 150–360  (5–12s)  Problem hook  (overlap for smooth transition)
// Scene 3: 330–600  (11–20s) Tools showcase
// Scene 4: 570–780  (19–26s) Features
// Scene 5: 750–900  (25–30s) CTA Outro

export const PromoVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>

            {/* ─── Background Music (full 30s) ─── */}
            <Audio src={staticFile('bg-music.wav')} volume={0.45} />

            {/* Whoosh at scene 2 transition */}
            <Sequence from={145} durationInFrames={30}>
                <Audio src={staticFile('whoosh.wav')} volume={0.7} />
            </Sequence>

            {/* Whoosh at scene 3 transition */}
            <Sequence from={325} durationInFrames={30}>
                <Audio src={staticFile('whoosh.wav')} volume={0.7} />
            </Sequence>

            {/* Whoosh at scene 4 transition */}
            <Sequence from={565} durationInFrames={30}>
                <Audio src={staticFile('whoosh.wav')} volume={0.6} />
            </Sequence>

            {/* Click on tool cards appearing */}
            <Sequence from={360} durationInFrames={15}>
                <Audio src={staticFile('click.wav')} volume={0.5} />
            </Sequence>
            <Sequence from={390} durationInFrames={15}>
                <Audio src={staticFile('click.wav')} volume={0.45} />
            </Sequence>
            <Sequence from={420} durationInFrames={15}>
                <Audio src={staticFile('click.wav')} volume={0.4} />
            </Sequence>

            {/* Success chime when CTA appears */}
            <Sequence from={820} durationInFrames={60}>
                <Audio src={staticFile('success.wav')} volume={0.8} />
            </Sequence>

            {/* ─── Scenes ─── */}
            <Sequence from={0} durationInFrames={180}>
                <Scene1Logo />
            </Sequence>

            <Sequence from={150} durationInFrames={210}>
                <Scene2Problem />
            </Sequence>

            <Sequence from={330} durationInFrames={270}>
                <Scene3Tools />
            </Sequence>

            <Sequence from={570} durationInFrames={210}>
                <Scene4Features />
            </Sequence>

            <Sequence from={750} durationInFrames={150}>
                <Scene5Outro />
            </Sequence>

        </AbsoluteFill>
    );
};
