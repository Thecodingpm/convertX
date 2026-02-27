// High-quality audio generator for ConvertX promo
// Creates cinematic WAV files using advanced synthesis
const fs = require('fs');
const path = require('path');

const sr = 44100;
const outDir = path.join(__dirname, 'public');

function writeWav(filename, samples) {
    const bps = 16, ch = 1;
    const dataSize = samples.length * 2;
    const buf = Buffer.alloc(44 + dataSize);
    buf.write('RIFF', 0); buf.writeUInt32LE(36 + dataSize, 4);
    buf.write('WAVE', 8); buf.write('fmt ', 12);
    buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
    buf.writeUInt16LE(ch, 22); buf.writeUInt32LE(sr, 24);
    buf.writeUInt32LE(sr * ch * bps / 8, 28);
    buf.writeUInt16LE(ch * bps / 8, 32); buf.writeUInt16LE(bps, 34);
    buf.write('data', 36); buf.writeUInt32LE(dataSize, 40);
    for (let i = 0; i < samples.length; i++) {
        buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
    }
    fs.writeFileSync(filename, buf);
    console.log(`✓ ${path.basename(filename)} (${(buf.length / 1024).toFixed(0)} KB)`);
}

// Reverb simulation (simple feedback delay network)
function addReverb(samples, decay = 0.4, delayMs = 80) {
    const d = Math.floor(sr * delayMs / 1000);
    const out = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
        out[i] = samples[i] + (i > d ? out[i - d] * decay : 0);
    }
    return out;
}

// ─── WHOOSH: cinematic swoosh with filtered noise ───
function makeWhoosh() {
    const dur = 0.7, n = Math.floor(sr * dur);
    let s = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const t = i / sr;
        const env = Math.pow(Math.sin(t / dur * Math.PI), 0.5) * Math.exp(-t * 2.5);
        const freq = 2400 * Math.exp(-t * 7) + 200;
        // Layered noise + tone
        const noise = (Math.random() * 2 - 1) * 0.25;
        const sweep = Math.sin(2 * Math.PI * freq * t) * 0.55;
        const bright = Math.sin(2 * Math.PI * freq * 3.2 * t) * 0.1;
        s[i] = (noise + sweep + bright) * env * 0.65;
    }
    s = addReverb(s, 0.25, 40);
    writeWav(path.join(outDir, 'whoosh.wav'), s);
}

// ─── CLICK: polished UI click with resonance ───
function makeClick() {
    const dur = 0.12, n = Math.floor(sr * dur);
    const s = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const t = i / sr;
        const env = Math.exp(-t * 80);
        const env2 = Math.exp(-t * 30);
        s[i] = (
            Math.sin(2 * Math.PI * 1800 * t) * env * 0.5 +
            Math.sin(2 * Math.PI * 900 * t) * env2 * 0.5
        ) * 0.7;
    }
    writeWav(path.join(outDir, 'click.wav'), s);
}

// ─── SUCCESS: rising arpeggio chime with tail ───
function makeSuccess() {
    const dur = 1.5, n = Math.floor(sr * dur);
    // Pentatonic rise: C5 E5 G5 B5 D6
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
    const delays = [0, 0.07, 0.14, 0.22, 0.34];
    let s = new Float32Array(n);
    for (let note = 0; note < notes.length; note++) {
        const f = notes[note], d = delays[note];
        for (let i = 0; i < n; i++) {
            const t = i / sr - d;
            if (t < 0) continue;
            const env = Math.exp(-t * 3.5) * Math.min(1, t * 40);
            const wave = (
                Math.sin(2 * Math.PI * f * t) * 0.6 +
                Math.sin(2 * Math.PI * f * 2 * t) * 0.25 +
                Math.sin(2 * Math.PI * f * 3 * t) * 0.1 +
                Math.sin(2 * Math.PI * f * 0.5 * t) * 0.15 // sub
            );
            s[i] += wave * env * 0.18;
        }
    }
    s = addReverb(s, 0.5, 120);
    writeWav(path.join(outDir, 'success.wav'), s);
}

// ─── BACKGROUND MUSIC: dark cinematic synth-wave (30s) ───
function makeBgMusic() {
    const dur = 30, n = Math.floor(sr * dur);
    const s = new Float32Array(n);

    // Dark minor progression: Am - F - C - G  (in real Hz for A3-based)
    const bassNotes = [110, 87.3, 130.8, 98.0]; // A2 F2 C3 G2
    const padNotes = [
        [220, 261.6, 329.6],  // Am: A3 C4 E4
        [174.6, 220, 261.6],  // F: F3 A3 C4
        [261.6, 329.6, 392],  // C: C4 E4 G4
        [196, 246.9, 293.7]   // G: G3 B3 D4
    ];
    const chordDur = 7.5; // 4 chords * 7.5s = 30s

    for (let i = 0; i < n; i++) {
        const t = i / sr;
        const chord = Math.floor(t / chordDur) % 4;
        const pos = (t % chordDur) / chordDur;

        // Pads — slow attack, rich harmonics
        const padEnv = Math.min(pos * 4, 1) * (0.7 + 0.3 * Math.sin(pos * Math.PI));
        let pad = 0;
        for (const f of padNotes[chord]) {
            pad += Math.sin(2 * Math.PI * f * t) * 0.055;
            pad += Math.sin(2 * Math.PI * f * 1.5 * t) * 0.015; // 5th
            pad += Math.sin(2 * Math.PI * f * 2 * t) * 0.012;   // octave
        }

        // Bass — punchy with slight detune
        const bn = bassNotes[chord];
        const bassEnv = 0.5 + 0.3 * Math.sin(pos * Math.PI * 2);
        const bass = (
            Math.sin(2 * Math.PI * bn * t) * 0.28 +
            Math.sin(2 * Math.PI * bn * 2 * t) * 0.08
        ) * bassEnv;

        // 808 Kick — every beat (120bpm = 0.5s)
        const kickPhase = t % 0.5;
        const kickFreq = 65 * Math.exp(-kickPhase * 14);
        const kick = kickPhase < 0.18 ?
            Math.sin(2 * Math.PI * kickFreq * kickPhase) * Math.exp(-kickPhase * 22) * 0.55 : 0;

        // Trap hi-hats — 16th notes with velocity variation
        const hatPhase = t % 0.125;
        const hatBeat = Math.floor(t / 0.125) % 8;
        const hatVol = [0.06, 0.03, 0.05, 0.035, 0.07, 0.03, 0.05, 0.04][hatBeat];
        const hat = hatPhase < 0.005 ?
            (Math.random() * 2 - 1) * Math.exp(-hatPhase * 1200) * hatVol : 0;

        // Snare — beats 2 & 4 (every 1s offset 0.5s)
        const snarePhase = (t + 0.25) % 1.0;
        const snare = snarePhase < 0.015 ?
            ((Math.random() * 2 - 1) * 0.5 + Math.sin(2 * Math.PI * 200 * snarePhase)) *
            Math.exp(-snarePhase * 80) * 0.22 : 0;

        // Arpeggiated lead (subtle)
        const arpNotes2 = padNotes[chord];
        const arpIdx = Math.floor((t % 0.375) / 0.125) % 3;
        const arpFreq = arpNotes2[arpIdx] * 2;
        const arpPhase = (t % 0.125);
        const arp = arpPhase < 0.06 ?
            Math.sin(2 * Math.PI * arpFreq * t) * Math.exp(-arpPhase * 15) * 0.045 : 0;

        // Master mix
        const master = (pad * padEnv + bass + kick + hat + snare + arp);
        // Fade in/out
        const fade = Math.min(1, t / 1.5) * Math.min(1, (dur - t) / 2);
        s[i] = master * fade * 0.82;
    }
    writeWav(path.join(outDir, 'bg-music.wav'), s);
}

console.log('🎵 Generating high-quality audio...');
makeWhoosh();
makeClick();
makeSuccess();
makeBgMusic();
console.log('✅ All audio generated!');
