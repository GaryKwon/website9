/* Standalone local preview — generated from src/engine modules. */

// ----- engine/geometry.ts -----
/** Geometry measured against a normalized 832 × 1540 screenshot artboard.
 * Source screenshot rendered at 832px, artwork starts near original y=55.
 * Third-party device chrome and social-player overlays are intentionally excluded.
 */
const ART = { width: 832, height: 1540 };
const GEO = {
    signal: { x: 7, y: 0, w: 171, h: 390 },
    dots: { x: 221, y: 0, w: 178, h: 390 },
    portrait: { x: 429, y: 0, w: 396, h: 390 },
    roll: { x: 7, y: 436, w: 818, h: 317 },
    waveform: { x: 7, y: 799, w: 171, h: 123 },
    score: { x: 7, y: 944, w: 171, h: 161 },
    spectrum: { x: 7, y: 1130, w: 171, h: 162 },
    vector: { x: 7, y: 1315, w: 171, h: 161 },
    orbit: { x: 221, y: 799, w: 173, h: 321 },
    channels: { x: 222, y: 1161, w: 171, h: 315 },
    beat: { x: 465, y: 800, w: 322, h: 330 },
    highway: { x: 461, y: 1171, w: 342, h: 203 },
    keybed: { x: 461, y: 1388, w: 341, h: 81 },
    footer: { x: 0, y: 1512, w: 832, h: 27 }
};
const within = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
/** Desktop-first artboard: no narrow portrait column or unused side gutters.
 * Coordinates are authored directly for a 1920 x 1080 canvas.
 */
const ART_DESKTOP = { width: 1920, height: 1080 };
const DESK = {
    signal: { x: 28, y: 28, w: 246, h: 389 },
    dots: { x: 296, y: 28, w: 252, h: 389 },
    orbit: { x: 570, y: 28, w: 330, h: 389 },
    beat: { x: 922, y: 28, w: 444, h: 389 },
    portrait: { x: 1388, y: 28, w: 504, h: 389 },
    roll: { x: 28, y: 445, w: 1322, h: 326 },
    highway: { x: 1372, y: 445, w: 520, h: 224 },
    keybed: { x: 1372, y: 686, w: 520, h: 85 },
    waveform: { x: 28, y: 798, w: 279, h: 223 },
    score: { x: 328, y: 798, w: 279, h: 223 },
    spectrum: { x: 628, y: 798, w: 279, h: 223 },
    vector: { x: 928, y: 798, w: 279, h: 223 },
    channels: { x: 1228, y: 798, w: 664, h: 223 },
    footer: { x: 28, y: 1049, w: 1864, h: 20 }
};


// ----- engine/theme.ts -----
const defaultTheme = {
    backgroundColor: '#e3e8e7', primaryAccent: '#ed3787',
    secondaryAccent: '#ff9dc5', tertiaryAccent: '#c90177',
    foregroundColor: '#33393b', gridColor: '#aab4b4',
    brightness: .77, visualEnergy: .46, motionSpeed: 1,
    waveformAmplitude: .68, particleCount: 48, orbitSpeed: .82,
    noteDensity: .52, glitchIntensity: .06, animationSmoothness: .85
};
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = (x) => x * x * (3 - 2 * x);
function hex2rgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgb2hsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (d) {
        s = d / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case r:
                h = ((g - b) / d) % 6;
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            default: h = (r - g) / d + 4;
        }
        h = ((h * 60) % 360 + 360) % 360;
    }
    return [h, s, l];
}
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
}
/** The visual shell deliberately remains gray/off-white; only accents adapt. */
function themeFromMetrics(m) {
    let candidate;
    let quality = -1;
    for (let i = 0; i < m.palette.length; i++) {
        const [h, s, l] = rgb2hsl(...hex2rgb(m.palette[i]));
        // A tiny high-chroma detail should not repeatedly flip the entire interface.
        // Palette entries are ordered by area, so favor prominent usable tones.
        const score = s * .8 + (l > .19 && l < .83 ? .3 : 0) - i * .045;
        if (score > quality && s > .12) {
            candidate = [h, s, l];
            quality = score;
        }
    }
    const hue = candidate?.[0] ?? 333;
    const energy = clamp(.16 + .33 * m.saturation + .28 * m.visualComplexity + .43 * m.motion);
    const accent = `hsl(${hue.toFixed(0)} ${Math.round(64 + 20 * m.saturation)}% 55%)`;
    return {
        backgroundColor: `hsl(${hue.toFixed(0)} 7% 90%)`,
        primaryAccent: accent,
        secondaryAccent: `hsl(${hue.toFixed(0)} 83% 75%)`,
        tertiaryAccent: `hsl(${hue.toFixed(0)} 90% 43%)`,
        foregroundColor: '#33393b', gridColor: '#aab4b4',
        brightness: m.brightness, visualEnergy: energy,
        motionSpeed: .58 + energy * 1.35, waveformAmplitude: .3 + energy * .92,
        particleCount: Math.round(24 + energy * 70), orbitSpeed: .4 + energy * 1.5,
        noteDensity: .25 + energy * .66, glitchIntensity: clamp((m.motion - .55) * .22),
        animationSmoothness: clamp(.98 - energy * .36, .48, .98)
    };
}
function analyzePixels(data, w, h) {
    if (w < 1 || h < 1)
        throw Error('Image has no pixels');
    const buckets = new Map();
    let sum = 0, sum2 = 0, sat = 0, warm = 0, edge = 0, edges = 0, sample = 0;
    const stride = Math.max(1, Math.floor(Math.sqrt(w * h / 20000)));
    const luminance = (i) => .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
    for (let y = 0; y < h; y += stride) {
        for (let x = 0; x < w; x += stride) {
            const i = (y * w + x) * 4;
            if (data[i + 3] < 80)
                continue;
            const r = data[i], g = data[i + 1], b = data[i + 2], l = luminance(i);
            const v = (Math.max(r, g, b) - Math.min(r, g, b)) / (Math.max(r, g, b) || 1);
            sum += l;
            sum2 += l * l;
            sat += v;
            warm += (r - b) / 255;
            sample++;
            const key = [r >> 5, g >> 5, b >> 5].join(',');
            const item = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
            item.n++;
            item.r += r;
            item.g += g;
            item.b += b;
            buckets.set(key, item);
            if (x + stride < w && y + stride < h) {
                const dx = Math.abs(l - luminance((y * w + x + stride) * 4));
                const dy = Math.abs(l - luminance(((y + stride) * w + x) * 4));
                edge += (dx + dy) / 510;
                edges++;
            }
        }
    }
    const n = Math.max(1, sample), avg = sum / n;
    const palette = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 12)
        .map(v => rgbToHex(v.r / v.n, v.g / v.n, v.b / v.n));
    const complexity = clamp((buckets.size / 120) * .55 + edge / Math.max(1, edges) * 1.15);
    return { palette, brightness: avg / 255, saturation: sat / n,
        contrast: clamp(Math.sqrt(Math.max(0, sum2 / n - avg * avg)) / 92),
        warmth: clamp((warm / n + 1) / 2), edgeDensity: edge / Math.max(1, edges),
        visualComplexity: complexity, motion: 0, dominantDirection: 0 };
}
function analyzeCanvas(canvas) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx)
        throw Error('Canvas 2D unavailable');
    return analyzePixels(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
}
function blendThemes(a, b, f) {
    const out = { ...b };
    const t = clamp(f);
    for (const key of Object.keys(b)) {
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
            out[key] = lerp(a[key], b[key], t);
        }
    }
    // Color interpolation uses CSS color-mix at the rendering layer; palette snaps only at the end.
    if (t < .99) {
        out.primaryAccent = a.primaryAccent;
        out.secondaryAccent = a.secondaryAccent;
        out.tertiaryAccent = a.tertiaryAccent;
        out.backgroundColor = a.backgroundColor;
    }
    return out;
}


// ----- engine/pixel-seed.ts -----
const bound = (n) => Math.max(0, Math.min(1, n));
const fnv = (hash, byte) => Math.imul(hash ^ (byte & 255), 16777619) >>> 0;
const GRID_W = 16, GRID_H = 12;
function seedFromPixels(data, width, height) {
    if (width <= 0 || height <= 0 || data.length < width * height * 4)
        throw new Error('Pixel seed requires a valid RGBA image.');
    const light = [], chroma = [], edges = [];
    let hash = 2166136261, detail = 0, xBias = 0, yBias = 0, total = 0;
    // Sampling locations are independent of input resolution. This yields a
    // bounded-cost, reproducible fingerprint rather than byte-for-byte hashing.
    const sample = (x, y) => {
        const sx = Math.min(width - 1, Math.max(0, Math.floor(x * width)));
        const sy = Math.min(height - 1, Math.max(0, Math.floor(y * height)));
        const p = (sy * width + sx) * 4, a = data[p + 3] / 255;
        const r = data[p] * a + 232 * (1 - a), g = data[p + 1] * a + 235 * (1 - a), b = data[p + 2] * a + 232 * (1 - a);
        const l = (.2126 * r + .7152 * g + .0722 * b) / 255;
        const s = (Math.max(r, g, b) - Math.min(r, g, b)) / (Math.max(r, g, b) || 1);
        return [l, s, r, g, b];
    };
    for (let y = 0; y < GRID_H; y++)
        for (let x = 0; x < GRID_W; x++) {
            let l = 0, s = 0, r = 0, g = 0, b = 0;
            for (let dy = 0; dy < 2; dy++)
                for (let dx = 0; dx < 2; dx++) {
                    const v = sample((x + (dx + .5) / 2) / GRID_W, (y + (dy + .5) / 2) / GRID_H);
                    l += v[0] / 4;
                    s += v[1] / 4;
                    r += v[2] / 4;
                    g += v[3] / 4;
                    b += v[4] / 4;
                }
            const index = y * GRID_W + x;
            const left = x ? light[index - 1] : l;
            const above = y ? light[index - GRID_W] : l;
            const e = bound((Math.abs(l - left) + Math.abs(l - above)) * 2.5);
            light.push(l);
            chroma.push(s);
            edges.push(e);
            detail += e;
            xBias += (x / (GRID_W - 1) - .5) * l;
            yBias += (y / (GRID_H - 1) - .5) * l;
            total += l;
            // Quantize to diminish image-compression noise and avoid raw pixel storage.
            hash = fnv(hash, Math.round(r / 8));
            hash = fnv(hash, Math.round(g / 8));
            hash = fnv(hash, Math.round(b / 8));
            hash = fnv(hash, Math.round(e * 31));
        }
    hash = fnv(hash, GRID_W);
    hash = fnv(hash, GRID_H);
    return { hash, width: GRID_W, height: GRID_H, light, chroma, edges,
        texture: bound(detail / (GRID_W * GRID_H) * 3),
        horizontalBias: bound(.5 + xBias / Math.max(.001, total) * 2.1),
        verticalBias: bound(.5 + yBias / Math.max(.001, total) * 2.1) };
}
function seededNoise(hash, channel) {
    let n = (hash ^ Math.imul(channel + 1, 0x9e3779b1)) >>> 0;
    n ^= n >>> 16;
    n = Math.imul(n, 0x7feb352d);
    n ^= n >>> 15;
    n = Math.imul(n, 0x846ca68b);
    n ^= n >>> 16;
    return (n >>> 0) / 4294967295;
}
/** Smoothly traverse different lines/regions of the same image over time. */
function seedField(profile, channel, time) {
    const phase = seededNoise(profile.hash, channel) * 2 * Math.PI;
    const speed = .12 + seededNoise(profile.hash, channel + 71) * .32;
    const xx = bound(.5 + .47 * Math.sin(time * speed + phase));
    const yy = bound(.5 + .47 * Math.cos(time * (speed * .67) + phase * .81));
    const fx = xx * (profile.width - 1), fy = yy * (profile.height - 1);
    const x = Math.floor(fx), y = Math.floor(fy), dx = fx - x, dy = fy - y;
    const grid = channel % 3 === 0 ? profile.light : channel % 3 === 1 ? profile.chroma : profile.edges;
    const at = (col, row) => grid[Math.min(profile.height - 1, row) * profile.width + Math.min(profile.width - 1, col)] ?? .5;
    const top = at(x, y) * (1 - dx) + at(x + 1, y) * dx;
    const bottom = at(x, y + 1) * (1 - dx) + at(x + 1, y + 1) * dx;
    const value = top * (1 - dy) + bottom * dy;
    return bound(value * .68 + .32 * (.5 + .5 * Math.sin(time * (speed * 2.1) + phase)));
}
/** Shipped reference-friendly fallback, overwritten by local image pixel data. */
const defaultPixels = new Uint8ClampedArray(GRID_W * GRID_H * 4);
for (let y = 0; y < GRID_H; y++)
    for (let x = 0; x < GRID_W; x++) {
        const i = (y * GRID_W + x) * 4;
        defaultPixels[i] = 230 - ((x * 17 + y * 5) % 40);
        defaultPixels[i + 1] = 185 + ((x * 7 + y * 11) % 45);
        defaultPixels[i + 2] = 190 + ((x * 11 + y * 3) % 42);
        defaultPixels[i + 3] = 255;
    }
const defaultPixelSeed = seedFromPixels(defaultPixels, GRID_W, GRID_H);


// ----- engine/score.ts -----
const rng = (seed) => { let s = seed >>> 0; return () => ((s = (Math.imul(1664525, s) + 1013904223) >>> 0) / 4294967296); };
const PATTERN_STEPS = 128;
function makeScore(seed = 191) {
    const r = rng(seed), scale = [0, 2, 3, 5, 7, 8, 10, 12];
    const notes = [];
    for (let step = 0; step < PATTERN_STEPS; step++) {
        if (step % 2 === 0 && r() < .86) {
            const degree = Math.floor(r() * scale.length);
            notes.push({ step, pitch: 72 + scale[degree] + (r() > .87 ? 12 : 0), length: 1 + r() * 2.1, velocity: .35 + r() * .52, lane: 'lead' });
        }
        if (step % 4 === 0) {
            const root = [0, 8, 5, 7][Math.floor(step / 16) % 4];
            notes.push({ step, pitch: 48 + root + (r() > .78 ? 12 : 0), length: 2 + r() * 2.2, velocity: .3 + r() * .28, lane: 'bass' });
        }
    }
    return notes;
}
let NOTES = makeScore();
/** The image seed chooses a stable original music pattern used by the piano roll AND synth. */
function setScoreSeed(seed) { NOTES = makeScore(seed >>> 0); }
const bpmFromEnergy = (energy) => Math.round(116 + energy * 81);
const secondsPerStep = (bpm) => 60 / bpm / 4;
const noteNumberToName = (midi) => ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][midi % 12] + (Math.floor(midi / 12) - 1);


// ----- engine/reactivity.ts -----



const quietSignals = {
    level: .24, bass: .3, mid: .25, treble: .18, beat: 0, transient: 0,
    motion: 0, direction: .5, imageLuma: .5, imageChange: 0,
    channels: [.3, .4, .4, .3, .4, .3, .3, .4]
};
class SignalBus {
    smooth = { ...quietSignals, channels: [...quietSignals.channels] };
    priorLevel = 0;
    profile = defaultPixelSeed;
    setProfile(profile) { this.profile = profile; this.reset(); }
    get seed() { return this.profile.hash; }
    reset() { this.smooth = { ...quietSignals, channels: [...quietSignals.channels] }; this.priorLevel = 0; }
    update(time, dt, mode, theme, frequency, wave, frame) {
        const bpm = bpmFromEnergy(theme.visualEnergy);
        const phase = (time / (60 / bpm)) % 1;
        const pulse = Math.pow(Math.max(0, 1 - phase), 7.5);
        const step = Math.floor(time / secondsPerStep(bpm));
        let bass = 0, mid = 0, treble = 0, level = 0;
        if (mode === 'demo') {
            // All simulated instruments share the same transport and rhythmic accents.
            bass = clamp(.25 + .36 * pulse + .15 * Math.sin(time * 1.55));
            mid = clamp(.2 + .25 * Math.sin(time * 2.1 + .5) ** 2 + .2 * pulse);
            treble = clamp(.14 + .19 * Math.sin(time * 3.1 + 1.2) ** 2 + .13 * (step % 4 === 0 ? 1 : 0));
            level = (bass * .46 + mid * .36 + treble * .18);
        }
        else {
            // Real Web Audio FFT and time-domain values; no fabricated frequency claims.
            const avg = (from, to) => { let total = 0, n = 0; for (let i = from; i < to && i < frequency.length; i++) {
                total += frequency[i] / 255;
                n++;
            } return n ? total / n : 0; };
            bass = avg(0, 13);
            mid = avg(13, 55);
            treble = avg(55, frequency.length);
            let rms = 0;
            for (let i = 0; i < wave.length; i += 2) {
                const x = (wave[i] - 128) / 128;
                rms += x * x;
            }
            rms = Math.sqrt(rms / Math.max(1, Math.ceil(wave.length / 2)));
            level = clamp(rms * 2.9 * .72 + (bass * .45 + mid * .35 + treble * .2) * .28);
        }
        const momentary = clamp(Math.max(0, level - this.priorLevel) * 5.5);
        this.priorLevel = level;
        const visualMotion = clamp(frame?.motion ?? 0);
        const target = {
            level: clamp(level), bass: clamp(bass), mid: clamp(mid), treble: clamp(treble),
            beat: mode === 'file' ? clamp(.28 * pulse + momentary * .72) : pulse,
            transient: mode === 'file' ? momentary : clamp(pulse * .7 + momentary * .3),
            motion: visualMotion, direction: frame?.direction ?? .5,
            imageLuma: frame?.brightness ?? theme.brightness,
            imageChange: frame?.change ?? 0, channels: this.smooth.channels
        };
        // Relative-time smoothing stays consistent at both 30 and 144 Hz.
        const seconds = clamp(dt, 0, .08);
        for (let i = 0; i < 8; i++) {
            const pixel = seedField(this.profile, i, time);
            const gifZone = frame?.zones?.[i] ?? 0;
            // Spatial pixel signature remains present in every mode. Actual sound
            // adds modulation, while GIF frame changes add localized energy.
            const sound = i % 3 === 0 ? bass : i % 3 === 1 ? mid : treble;
            const candidate = clamp(pixel * .68 + sound * .17 + gifZone * .38 + target.beat * .10);
            const alpha = 1 - Math.exp(-(gifZone > .15 ? 14 : 5) * seconds);
            this.smooth.channels[i] += (candidate - this.smooth.channels[i]) * alpha;
        }
        for (const k of Object.keys(target)) {
            if (k === 'channels')
                continue;
            const speed = (k === 'beat' || k === 'transient' || k === 'imageChange') ? 16 : 8;
            const alpha = 1 - Math.exp(-speed * seconds);
            // Only scalar signals use the generic smoothing path.
            this.smooth[k] += (target[k] - this.smooth[k]) * alpha;
        }
        return { ...this.smooth, channels: [...this.smooth.channels] };
    }
}


// ----- engine/audio.ts -----

/** One shared WebAudio graph: synth + optional local-file source → analyser → master gain. */
class AudioEngine {
    ctx = null;
    analyser = null;
    master = null;
    audio = null;
    source = null;
    objectUrl = null;
    lastStep = -1;
    voices = new Set();
    muted = false;
    mode = 'demo';
    spectrum = new Uint8Array(128);
    waveform = new Uint8Array(256);
    get mediaDuration() { return this.audio?.duration || 0; }
    get mediaTime() { return this.audio?.currentTime || 0; }
    get frequency() {
        if (this.analyser && this.mode !== 'demo')
            this.analyser.getByteFrequencyData(this.spectrum);
        return this.spectrum;
    }
    get wave() {
        if (this.analyser && this.mode !== 'demo')
            this.analyser.getByteTimeDomainData(this.waveform);
        return this.waveform;
    }
    ensure() {
        if (this.ctx)
            return;
        this.ctx = new AudioContext();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyser.smoothingTimeConstant = .78;
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : .47;
        this.analyser.connect(this.master);
        this.master.connect(this.ctx.destination);
    }
    async enable() { this.ensure(); await this.ctx.resume(); }
    setMuted(muted) { this.muted = muted; if (this.master && this.ctx)
        this.master.gain.setTargetAtTime(muted ? 0 : .47, this.ctx.currentTime, .03); }
    async useMusic() { this.stopMedia(); await this.enable(); this.mode = 'music'; this.lastStep = -1; }
    useDemo() { this.stopMedia(); this.mode = 'demo'; this.lastStep = -1; this.silenceVoices(); }
    async useFile(file) {
        if (!file.type.startsWith('audio/'))
            throw Error('Choose an audio file.');
        if (file.size > 80 * 1024 * 1024)
            throw Error('Audio exceeds 80 MB.');
        this.stopMedia();
        await this.enable();
        this.objectUrl = URL.createObjectURL(file);
        this.audio = new Audio(this.objectUrl);
        this.audio.loop = true;
        this.audio.preload = 'auto';
        this.source = this.ctx.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.mode = 'file';
        this.lastStep = -1;
        await this.audio.play();
    }
    stopMedia() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio.load();
            this.audio = null;
        }
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
        }
    }
    async pause() { this.audio?.pause(); if (this.ctx?.state === 'running')
        await this.ctx.suspend(); }
    async resume() { if (this.mode !== 'demo')
        await this.enable(); if (this.audio && this.audio.paused)
        await this.audio.play(); }
    reset() { if (this.audio)
        this.audio.currentTime = 0; this.lastStep = -1; this.silenceVoices(); }
    update(t, bpm, density) {
        if (this.mode !== 'music' || !this.ctx || this.ctx.state !== 'running')
            return;
        const step = Math.floor(t / secondsPerStep(bpm));
        if (step < this.lastStep)
            this.lastStep = step - 1;
        if (step - this.lastStep > 64)
            this.lastStep = step - 1;
        for (let n = this.lastStep + 1; n <= step; n++) {
            const selected = NOTES.filter(note => note.step === ((n % PATTERN_STEPS) + PATTERN_STEPS) % PATTERN_STEPS);
            for (const note of selected)
                if (note.lane === 'bass' || (note.step * 11 % 19) / 19 < density)
                    this.playNote(note, bpm);
        }
        this.lastStep = step;
    }
    playNote(note, bpm) {
        if (!this.ctx || !this.analyser)
            return;
        const when = this.ctx.currentTime + .005;
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
        osc.type = note.lane === 'bass' ? 'sine' : 'triangle';
        osc.frequency.value = 440 * Math.pow(2, (note.pitch - 69) / 12);
        const dur = Math.min(1.0, note.length * secondsPerStep(bpm));
        const level = note.velocity * (note.lane === 'bass' ? .21 : .085);
        gain.gain.setValueAtTime(.0001, when);
        gain.gain.exponentialRampToValueAtTime(Math.max(.001, level), when + .011);
        gain.gain.exponentialRampToValueAtTime(.0001, when + dur);
        osc.connect(gain);
        gain.connect(this.analyser);
        this.voices.add(osc);
        osc.onended = () => { this.voices.delete(osc); gain.disconnect(); osc.disconnect(); };
        osc.start(when);
        osc.stop(when + dur + .025);
    }
    tap(midi) {
        if (this.mode === 'demo')
            return;
        this.ensure();
        void this.ctx.resume();
        this.playNote({ step: 0, pitch: midi, length: 1.2, velocity: .65, lane: 'lead' }, 150);
    }
    silenceVoices() { for (const osc of this.voices) {
        try {
            osc.stop();
        }
        catch { /* already stopped */ }
    } this.voices.clear(); }
    dispose() { this.stopMedia(); this.silenceVoices(); void this.ctx?.close(); this.ctx = null; this.analyser = null; this.master = null; }
}


// ----- engine/render.ts -----




const PI = Math.PI;
const re = (s) => s.reactivity ?? quietSignals;
const rgba = (hex, a) => {
    const alpha = Math.max(0, Math.min(1, a));
    if (hex.startsWith('#'))
        return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
    if (hex.startsWith('rgb')) {
        const n = hex.match(/[\d.]+/g)?.map(Number) || [220, 50, 100];
        return `rgba(${n[0]},${n[1]},${n[2]},${alpha})`;
    }
    if (hex.startsWith('hsl')) {
        const n = hex.match(/[\d.]+/g)?.map(Number) || [330, 80, 50];
        return `hsla(${n[0]},${n[1]}%,${n[2]}%,${alpha})`;
    }
    return hex;
};
const L = (c, x, y, xx, yy, color, width = 1) => { c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(x, y); c.lineTo(xx, yy); c.stroke(); };
const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
const S = (c, x, y, w, h, col, width = 1) => { c.strokeStyle = col; c.lineWidth = width; c.strokeRect(x, y, w, h); };
const txt = (c, s, x, y, color, size = 13, weight = 400) => { c.font = `${weight} ${size}px "Courier New",monospace`; c.fillStyle = color; c.fillText(s, x, y); };
const dot = (c, x, y, r, col) => { c.beginPath(); c.arc(x, y, r, 0, PI * 2); c.fillStyle = col; c.fill(); };
const sig = (t, s = 0) => Math.sin(t * 1.7 + s) * .47 + Math.sin(t * 3.42 + s * 1.5) * .21 + Math.cos(t * 5.1 - s) * .08;
const rnd = (v) => { const x = Math.sin(v * 127.1 + 78.233) * 43758.5453; return x - Math.floor(x); };
const label = (c, name, x, y, accent) => { c.save(); c.textBaseline = 'top'; txt(c, name, x, y, accent || '#6c7778', 16, 400); c.restore(); };
const frame = (c, r, color = '#a5afaf') => S(c, r.x, r.y, r.w, r.h, color, 1.15);
function drawSignal(c, s) {
    const { signal: r } = GEO, t = s.time, p = s.theme.primaryAccent, drive = re(s);
    frame(c, r);
    L(c, r.x, r.y + 38, r.x + r.w, r.y + 38, '#8b9596');
    for (let i = 0; i < 3; i++)
        dot(c, 31 + i * 21, 19, 5.4, i === 2 ? s.theme.secondaryAccent : p);
    L(c, 92, 58, 92, 371, s.theme.tertiaryAccent, 2.3);
    for (let j = 0; j < 9; j++) {
        const base = 96 + j * 29, opacity = j < 4 ? .19 : .08;
        for (let x = 67; x < 165; x += 3) {
            const span = (.2 + Math.sin((x - 67) / 95 * PI)) * 12 * sig(x * .13 + t * 3, j);
            L(c, x, base - span * .7, x, base + span * .7, rgba(s.theme.secondaryAccent, opacity), 1);
        }
    }
    for (let x = 72; x < 165; x += 3.4) {
        const env = Math.sin((x - 72) / 93 * PI) ** 2;
        const a = 23 * env * (.25 + .4 * Math.sin(t * .5) + drive.level * .95 + drive.motion * .3 + drive.channels[0] * .32);
        L(c, x, 149 - a * (.55 + .45 * Math.abs(sig(x * .13 + t * 2))), x, 149 + a * (.55 + .45 * Math.abs(sig(x * .13 + t * 2))), rgba(p, .12 + .17 * env), 1);
    }
    for (let i = 0; i < 22; i++) {
        const x = 82 + i * 3.2;
        if (rnd(i * 3.9) > .5)
            L(c, x, 275 + rnd(i + 2) * 25, x, 286 + rnd(i + 10) * 55, rgba(p, .10 + .25 * rnd(i + 33)), 2.3);
    }
}
function drawDots(c, s) {
    const t = s.time * s.theme.motionSpeed, p = s.theme.primaryAccent, pa = s.theme.secondaryAccent, drive = re(s);
    for (let col = 0; col < 7; col++)
        for (let row = 0; row < 19; row++) {
            const x = 242 + col * 21.5, y = 12 + row * 21.5;
            let active = 0;
            if (col === 6)
                active = .85;
            if (col === 5 && [4, 5, 6, 7, 10, 11, 14, 16].includes(row))
                active = .65;
            if (col === 4 && [5, 6, 10, 11, 14, 16].includes(row))
                active = .35;
            const ring = col > 4 && [7, 8, 9, 11, 12].includes(row);
            if (row % 5 === 2 && col === 4)
                active = .25;
            const pulse = .28 * Math.sin(t * 2.3 - row * .47 + col * .61 + drive.channels[1] * 2) + (drive.transient * .45 + drive.imageChange * .35 + drive.channels[(row + col) % 8] * .2);
            const color = active > .6 ? (row % 4 === 0 ? s.theme.tertiaryAccent : p) : active > .2 ? pa : '#f4f7f5';
            dot(c, x, y, 9.6 + (active ? pulse : 0), color);
            if (ring) {
                dot(c, x, y, 5.9, '#e8f0ee');
                dot(c, x, y, 2.85, p);
            }
        }
    for (let j = 0; j < 4; j++)
        dot(c, 351 + (j % 2) * 21, 122 + j * 50 + Math.sin(t * 1.7 + j) * 5, 2.3, p);
}
function drawRoll(c, s) {
    const r = GEO.roll, p = s.theme.primaryAccent, pp = s.theme.secondaryAccent, drive = re(s);
    frame(c, r, '#9aa5a4');
    c.save();
    c.beginPath();
    c.rect(r.x, r.y, r.w, r.h);
    c.clip();
    R(c, r.x, r.y, r.w, r.h, '#edf1ee');
    for (let i = 0; i < 50; i++) {
        const y = r.y + i * 6.35;
        L(c, r.x, y, r.x + r.w, y, i % 12 === 0 ? '#96a4a1' : i % 2 === 0 ? '#bbc7c4' : '#d5ddda', i % 12 === 0 ? 1.3 : .8);
    }
    for (let x = 73, bar = 1; x < 900; x += 182, bar++) {
        L(c, x, r.y, x, r.y + r.h, '#a4b3b1', 1.35);
        txt(c, String(bar), x + 8, r.y + 20, '#707d7c', 14);
        for (let k = 1; k < 4; k++)
            L(c, x + k * 45.5, r.y, x + k * 45.5, r.y + r.h, '#d6dedc', .7);
    }
    for (let i = 2; i <= 6; i++) {
        const y = 731 - (i - 2) * 67;
        txt(c, `C${i}`, 19, y, '#627273', 15);
    }
    const bpm = bpmFromEnergy(s.theme.visualEnergy);
    const stepTime = secondsPerStep(bpm);
    const trackStep = (s.time / stepTime) % 128;
    const pxPerStep = 11.375;
    // Loop additional copies to maintain continuity as the transport progresses.
    for (let lap = -1; lap <= 1; lap++)
        for (const n of NOTES) {
            const x = 306 + (n.step + lap * 128 - trackStep) * pxPerStep;
            if (x < r.x - 70 || x > r.x + r.w + 50)
                continue;
            const y = 733 - (n.pitch - 36) * 5.55;
            const w = n.length * pxPerStep;
            R(c, x, y, Math.max(4, w), n.lane === 'bass' ? 4.2 : 4, rgba(n.lane === 'bass' ? p : pp, (n.lane === 'bass' ? .43 : .53) + drive.beat * .16 + drive.motion * .12 + drive.channels[2] * .16));
        }
    // Long tones toward the left edge provide the screenshot's characteristic low register.
    for (let j = 0; j < 3; j++)
        R(c, 7, 600 + j * 20, 65, 3.6, rgba(p, .55));
    L(c, 306, r.y - 10, 306, r.y + r.h + 11, '#333e3d', 2.3);
    c.restore();
}
function plotPanel(c, r, t, p, phase = 0, amp = 16, dy = 0) {
    c.beginPath();
    for (let i = 0; i <= r.w; i += 2) {
        const x = r.x + i, env = .5 + .5 * Math.sin(i / r.w * PI), y = r.y + r.h * .5 + dy + env * amp * (sig(i * .08 + t * 1.4, phase) * .6 + sig(i * .29 - t, phase) * .4);
        if (i === 0)
            c.moveTo(x, y);
        else
            c.lineTo(x, y);
    }
    c.strokeStyle = p;
    c.lineWidth = 1.8;
    c.stroke();
}
function drawWaveform(c, s) {
    const r = GEO.waveform, t = s.time, p = s.theme.primaryAccent, drive = re(s);
    frame(c, r);
    label(c, 'WAVEFORM', 23, r.y + 15);
    label(c, 'LOU', 151, r.y + 15, p);
    for (let x = r.x + 4; x < r.x + r.w - 3; x += 4) {
        const env = .55 + .7 * Math.abs(sig(x * .14 - t * 1.5));
        const mid = r.y + 74;
        L(c, x, mid - env * 17, x, mid + env * 17, rgba('#596666', .3), 2);
    }
    if (s.mode === 'demo')
        plotPanel(c, { x: r.x + 2, y: r.y + 44, w: r.w - 4, h: 61 }, t, p, 1, 16 * (.65 + drive.level + drive.motion * .38 + drive.channels[0] * .45), -1);
    else {
        c.beginPath();
        for (let x = 0; x < r.w - 4; x++) {
            const sample = s.audioWave[Math.floor(x / (r.w - 4) * s.audioWave.length)] || 128;
            const y = r.y + 75 + (sample - 128) / 128 * 28;
            if (!x)
                c.moveTo(r.x + 2 + x, y);
            else
                c.lineTo(r.x + 2 + x, y);
        }
        c.strokeStyle = p;
        c.lineWidth = 1.8;
        c.stroke();
    }
}
function drawScore(c, s) {
    const r = GEO.score, t = s.time, p = s.theme.primaryAccent, drive = re(s);
    frame(c, r);
    label(c, 'SCORE', 23, r.y + 15);
    for (let x = r.x + 42; x < r.x + r.w; x += 43)
        L(c, x, r.y, x, r.y + r.h, rgba('#9daaaa', .38), 1);
    for (let y = r.y + 44; y < r.y + r.h; y += 39)
        L(c, r.x, y, r.x + r.w, y, rgba('#9daaaa', .38), 1);
    plotPanel(c, { x: r.x + 1, y: r.y + 60, w: r.w - 2, h: 51 }, t, p, 2, 10 + drive.level * 17 + drive.imageChange * 10 + drive.channels[3] * 7);
    plotPanel(c, { x: r.x + 1, y: r.y + 60, w: r.w - 2, h: 51 }, t + 1.6, '#91a5a4', 4, 9);
}
function drawSpectrum(c, s) {
    const r = GEO.spectrum, p = s.theme.primaryAccent, t = s.time, drive = re(s);
    frame(c, r);
    label(c, 'SPECTRUM', 23, r.y + 13);
    for (let x = r.x + 43; x < r.x + r.w; x += 43)
        L(c, x, r.y, x, r.y + r.h, '#c3cecb', .8);
    for (let y = r.y + 42; y < r.y + r.h; y += 40)
        L(c, r.x, y, r.x + r.w, y, '#c3cecb', .8);
    const num = 23;
    for (let j = 0; j < num; j++) {
        const x = 28 + j * 5.4;
        const target = s.mode === 'demo' ? .35 + .28 * Math.sin(j * .25 + drive.channels[4]) + .15 * Math.sin(t * 3 + j * 1.7) + drive.channels[(j % 8)] * .25 : s.audioBins[Math.min(127, Math.floor(j * 2.8))] / 255;
        const envelope = Math.max(.06, Math.abs(target)) * 85;
        R(c, x, r.y + r.h - 4 - envelope, 3.65, envelope, '#323939');
        R(c, x, r.y + r.h - 9 - envelope, 3.65, 2.4, rgba(p, .8));
    }
}
function drawVector(c, s) {
    const r = GEO.vector, p = s.theme.primaryAccent, t = s.time, drive = re(s);
    frame(c, r);
    label(c, 'VECTOR', 23, r.y + 13);
    const cx = 92, cy = r.y + 93, rad = 49;
    for (let a = 0; a < 8; a++) {
        const angle = a * PI / 4;
        L(c, cx, cy, cx + rad * Math.cos(angle), cy + rad * Math.sin(angle), '#bdc9c7', .8);
    }
    c.beginPath();
    c.arc(cx, cy, rad, 0, PI * 2);
    c.strokeStyle = '#c2cccb';
    c.lineWidth = .8;
    c.stroke();
    c.beginPath();
    c.arc(cx, cy, rad * .55, 0, PI * 2);
    c.stroke();
    dot(c, cx + Math.sin(t * (.75 + drive.channels[5] * .4)) * (4.6 + drive.bass * 10) + drive.direction * 3 - 1.5, cy + Math.cos(t * .68) * (3.7 + drive.treble * 9), 3.2 + drive.motion * 1.5, p);
}
function drawOrbit(c, s) {
    const r = GEO.orbit, t = s.time * s.theme.orbitSpeed, p = s.theme.primaryAccent, pp = s.theme.secondaryAccent, drive = re(s);
    R(c, r.x, r.y, r.w, r.h, '#dce3e2');
    const cx = r.x + 85, cy = r.y + 169;
    for (let ring = 0; ring < 17; ring++) {
        const radius = (33 + ring * 2.7) * (1 + drive.level * .045 + drive.motion * .08 + drive.channels[6] * .052);
        const angle = (ring * .27 + drive.channels[ring % 8] * .2 + t * (.09 + (ring % 4) * .02));
        const squish = .61 + Math.sin(ring * 1.4 + t * .16) * .18;
        c.save();
        c.translate(cx, cy);
        c.rotate(angle);
        c.beginPath();
        c.ellipse(0, 0, radius, radius * squish, 0, ring * .25, ring * .25 + PI * (1.3 + .55 * rnd(ring)));
        c.strokeStyle = rgba(ring % 4 === 0 ? '#272f2e' : ring % 3 === 0 ? pp : p, .3 + .37 * rnd(ring));
        c.lineWidth = .8 + 1.0 * rnd(ring + 2);
        c.stroke();
        c.restore();
    }
    dot(c, cx + Math.sin(t * .21) * 4, cy + Math.cos(t * .4) * 5, 14.4 + drive.bass * 2, '#24292a');
    for (let i = 0; i < 31; i++) {
        const angle = i * 2.399 + t * .12, rad = 30 + rnd(i + 6) * 43;
        dot(c, cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad * .86, 1.1, rgba(p, .18 + rnd(i) * .6));
    }
}
function drawChannels(c, s) {
    const r = GEO.channels, t = s.time, p = s.theme.primaryAccent, drive = re(s);
    frame(c, r);
    for (let x = r.x + 43; x < r.x + r.w; x += 43)
        L(c, x, r.y, x, r.y + r.h, rgba('#9ca9a9', .36), 1);
    for (let y = r.y + 39; y < r.y + r.h; y += 40)
        L(c, r.x, y, r.x + r.w, y, rgba('#9ca9a9', .36), 1);
    label(c, 'CH1', 241, r.y + 18, p);
    label(c, 'BASS', 289, r.y + 18, p);
    label(c, 'CH2', 367, r.y + 18);
    plotPanel(c, { x: r.x + 1, y: r.y + 116, w: r.w - 2, h: 91 }, t, p, 3, 18 + drive.level * 27 + drive.motion * 8 + drive.channels[3] * 9);
    plotPanel(c, { x: r.x + 1, y: r.y + 116, w: r.w - 2, h: 91 }, t * .7, '#b5bebe', 1, 29, 1);
}
function drawBeat(c, s) {
    const t = s.time, p = s.theme.primaryAccent, pp = s.theme.secondaryAccent, drive = re(s);
    const cx = 632, cy = 968;
    for (let i = 0; i < 4; i++) {
        c.beginPath();
        c.arc(cx, cy, 46 + i * 32, 0, 2 * PI);
        c.strokeStyle = rgba('#afc0bd', .20 + i * .04);
        c.lineWidth = 1.15;
        c.stroke();
    }
    for (let j = 0; j < 12; j++) {
        const a = -PI / 2 + j * 2 * PI / 12;
        L(c, cx + Math.cos(a) * 146, cy + Math.sin(a) * 146, cx + Math.cos(a) * (j % 3 === 0 ? 162 : 154), cy + Math.sin(a) * (j % 3 === 0 ? 162 : 154), j % 3 === 0 ? '#4a5654' : '#aab5b2', j % 3 === 0 ? 2 : 1);
    }
    const segs = [[-PI / 2, -PI / 2 + .72, 122, 8], [-.1, .25, 109, 8], [.3, 1.09, 108, 12], [1.96, 2.66, 105, 6], [2.7, 3.47, 104, 5], [-2.9, -2.38, 76, 6], [-1.98, -1.47, 66, 5], [.95, 1.4, 70, 5], [2.25, 2.8, 66, 5]];
    for (let i = 0; i < segs.length; i++) {
        const [start, end, rad, lw] = segs[i];
        c.beginPath();
        c.arc(cx, cy, rad, start + t * .014 * (i % 2 ? 1 : -1), end + t * .014 * (i % 2 ? 1 : -1));
        c.lineCap = 'round';
        c.strokeStyle = i < 3 ? p : rgba(pp, .65 + drive.beat * .26);
        c.lineWidth = lw + drive.beat * 2 + drive.channels[7] * .8;
        c.stroke();
    }
    c.lineCap = 'butt';
    const bpm = bpmFromEnergy(s.theme.visualEnergy), bar = Math.floor(s.time / (60 / bpm * 4)) % 4 + 1;
    txt(c, 'BAR', 613, cy - 24, '#788583', 16);
    txt(c, String(bar), 620, cy + 13, '#242b2d', 35, 700);
    txt(c, '1', 626, 796, '#65716d', 18, 700);
    txt(c, '2', 790, 968, p, 18, 700);
    txt(c, '3', 627, 1128, '#687371', 18, 700);
    txt(c, '4', 462, 969, '#687371', 18, 700);
    const a = (s.time * secondsPerStep(bpm) * .14) + .27;
    L(c, cx + Math.cos(a) * 35, cy + Math.sin(a) * 35, cx + Math.cos(a) * 147, cy + Math.sin(a) * 147, '#1f2727', 2.1);
}
function drawHighway(c, s) {
    const r = GEO.highway, t = s.time, p = s.theme.primaryAccent, pp = s.theme.secondaryAccent, drive = re(s);
    R(c, r.x, r.y, r.w, r.h, '#e8ecea');
    frame(c, r);
    const cx = r.x + r.w / 2, top = r.y + 20, bottom = r.y + 176;
    for (let i = -5; i <= 5; i++)
        L(c, cx + i * 4.8, top, cx + i * 25.8, bottom, rgba(i % 2 === 0 ? p : '#9ea9a7', i % 2 === 0 ? .22 : .14), .9);
    for (let i = 0; i < 11; i++) {
        const v = (i / 10) ** 1.8, y = top + v * (bottom - top);
        L(c, cx - v * 144, y, cx + v * 144, y, rgba(p, .10 + .10 * v), .8);
    }
    L(c, cx, top, cx - 142, bottom, rgba(p, .4), 1.4);
    L(c, cx, top, cx + 142, bottom, rgba(p, .4), 1.4);
    const bpm = bpmFromEnergy(s.theme.visualEnergy), sps = secondsPerStep(bpm), currentStep = t / sps;
    const lookAhead = 16;
    for (let j = 0; j < 3; j++) {
        const local = Math.floor(currentStep / 128) + j - 1;
        for (const n of NOTES) {
            const distance = n.step + 128 * local - currentStep;
            if (distance < -.4 || distance > lookAhead)
                continue;
            const progress = 1 - distance / lookAhead;
            const v = progress ** 1.65;
            const y = top + v * (bottom - top), width = 6 + v * 26;
            const lane = (n.pitch % 8) - 3.5;
            const x = cx + lane * 4.1 * (1 + v * 4.4);
            R(c, x - width * .55, y - 2, width, 2.5 + v * 4 + drive.beat * 1.5 + drive.channels[n.pitch % 8] * 1.3, rgba(n.lane === 'bass' ? pp : p, .55 + .3 * v + drive.imageChange * .14));
        }
    }
    for (let i = 0; i < 14; i++) {
        const x = r.x + 37 + i * 21.1;
        c.beginPath();
        c.arc(x, bottom + 2, 4.9, 0, 2 * PI);
        c.strokeStyle = '#83908e';
        c.lineWidth = 1;
        c.stroke();
        if ((i + Math.floor(currentStep)) % 7 === 0)
            dot(c, x, bottom + 2, 5.3, rgba(p, .8));
    }
    txt(c, `SCORE ${String(s.score).padStart(7, '0')}`, r.x + 17, r.y + 24, '#333b3c', 15, 700);
    txt(c, `${s.combo} COMBO  ×2`, r.x + 221, r.y + 24, p, 13, 700);
    txt(c, 'C4', r.x + 53, bottom - 14, '#68716e', 10);
    txt(c, 'D4', r.x + 115, bottom - 10, '#68716e', 10);
    txt(c, 'TRACK', r.x + 17, r.y + r.h - 13, '#677170', 11, 700);
    txt(c, `${bpm} BPM`, r.x + r.w - 69, r.y + r.h - 13, '#788584', 10);
    R(c, r.x + r.w - 10, r.y + 41, 5, 120, '#c7d0cd');
    R(c, r.x + r.w - 10, r.y + 41 + (Math.sin(t * .2) * .5 + .5) * 60, 5, 52, '#666e6e');
}
const KEYS = [['C3', 48], ['E3', 52], ['G4', 67], ['D5', 74], ['G5', 79], ['A5', 81], ['B2', 47], ['C3', 48], ['E3', 52], ['G3', 55], ['D4', 62], ['G4', 67], ['A4', 69], ['E2', 40]];
function keyRect(index) {
    const col = index < 6 ? index : index - 6, row = index < 6 ? 0 : 1;
    const gap = 4.5, w = 38.7, x = 461 + col * (w + gap) + (row === 1 && col >= 6 ? 0 : 0), y = 1388 + row * 43;
    return { x, y, w, h: 38 };
}
function drawKeybed(c, s) {
    const t = s.time, drive = re(s), step = Math.floor(t / secondsPerStep(bpmFromEnergy(s.theme.visualEnergy)));
    KEYS.forEach(([name, midi], i) => {
        const r = keyRect(i), active = s.pressed.includes(midi) || (s.mode !== 'file' && ((step + i * 3) % 11 === 0 && i !== 0)) || (s.mode === 'file' && drive.transient > .35 && i === step % KEYS.length);
        R(c, r.x, r.y, r.w, r.h, active ? s.theme.primaryAccent : '#edf0ed');
        S(c, r.x, r.y, r.w, r.h, '#85918f', 1.4);
        c.textAlign = 'center';
        txt(c, name, r.x + r.w / 2, r.y + 24, active ? '#fff' : '#343c3c', 12, 700);
        c.textAlign = 'start';
    });
}
function drawFooter(c, s) {
    const y = 1531, duration = Math.max(1, s.duration);
    R(c, 0, y, 326, 1.2, '#9ca6a4');
    R(c, 0, y, Math.max(2, 326 * ((s.time % duration) / duration)), 1.4, '#292f30');
    const format = (n) => `${Math.floor(n / 60)}:${Math.floor(n % 60).toString().padStart(2, '0')}`;
    txt(c, `${format(s.time)} / ${format(duration)}`, 345, y + 8, '#6b7776', 16);
    txt(c, s.mode === 'demo' ? 'SIM' : s.mode === 'music' ? 'SYN' : 'AUD', 731, y + 8, '#8c9795', 10);
}
function drawInstrument(c, s) {
    const t = Number.isFinite(s.time) ? s.time : 0;
    const state = { ...s, time: s.isReducedMotion ? 0 : t, theme: s.theme || defaultTheme };
    c.clearRect(0, 0, ART.width, ART.height);
    R(c, 0, 0, ART.width, ART.height, s.theme.backgroundColor);
    drawSignal(c, state);
    drawDots(c, state);
    // Image itself is a transparent DOM overlay so native animated GIF timing is preserved.
    S(c, GEO.portrait.x, GEO.portrait.y, GEO.portrait.w, GEO.portrait.h, '#a0a9a6', .7);
    drawRoll(c, state);
    drawWaveform(c, state);
    drawScore(c, state);
    drawSpectrum(c, state);
    drawVector(c, state);
    drawOrbit(c, state);
    drawChannels(c, state);
    drawBeat(c, state);
    drawHighway(c, state);
    drawKeybed(c, state);
    drawFooter(c, { ...state, time: t });
    drawMicroDetails(c, state, Object.values(GEO));
}
function titleForNote(midi) { return noteNumberToName(midi); }
/** Animates border highlights, internal grid tracers and tiny label cursors without
 * changing any panel coordinates. Every instrument receives a visual heartbeat. */
function drawMicroDetails(c, s, regions) {
    if (s.isReducedMotion)
        return;
    const d = re(s), p = s.theme.primaryAccent, t = s.time;
    c.save();
    for (let i = 0; i < regions.length; i++) {
        const r = regions[i];
        if (r.w < 40 || r.h < 20)
            continue;
        const phase = (t * (.17 + d.level * .12 + d.motion * .1 + d.channels[i % 8] * .09) + i * .173) % 1;
        const x = r.x + phase * r.w, y = r.y + ((t * .09 + i * .271) % 1) * r.h;
        // Moving 1-pixel edge highlights, not new decorative dashboard ornaments.
        L(c, x, r.y, x + Math.min(18, r.w * .075), r.y, rgba(p, .12 + d.beat * .24 + d.channels[i % 8] * .09), 1);
        L(c, r.x + r.w, y, r.x + r.w, y + Math.min(15, r.h * .09), rgba(p, .14 + d.imageChange * .29), 1);
        const scanY = r.y + ((t * (.045 + d.mid * .02) + i * .131) % 1) * r.h;
        L(c, r.x + 3, scanY, r.x + r.w - 3, scanY, rgba(p, .012 + d.transient * .026 + d.motion * .021), .75);
        dot(c, r.x + r.w - 8, r.y + 9, 1.0 + d.beat * .7, rgba(p, .15 + d.beat * .20));
    }
    c.restore();
}


// ----- engine/desktop-render.ts -----



const TWOPI = Math.PI * 2;
const pinkOpacity = (hex, a) => {
    const t = Math.max(0, Math.min(1, a));
    if (hex.startsWith('#'))
        return hex + Math.round(t * 255).toString(16).padStart(2, '0');
    const n = hex.match(/[\d.]+/g)?.map(Number) || [225, 35, 114];
    if (hex.startsWith('rgb'))
        return `rgba(${n[0]},${n[1]},${n[2]},${t})`;
    if (hex.startsWith('hsl'))
        return `hsla(${n[0]},${n[1]}%,${n[2]}%,${t})`;
    return hex;
};
const line = (c, x, y, X, Y, color, width = 1) => { c.beginPath(); c.moveTo(x, y); c.lineTo(X, Y); c.lineWidth = width; c.strokeStyle = color; c.stroke(); };
const rect = (c, r, color = '#9faeac') => { c.strokeStyle = color; c.lineWidth = 1; c.strokeRect(r.x + .5, r.y + .5, r.w - 1, r.h - 1); };
const dlabel = (c, s, x, y, color = '#657170', size = 16, weight = 400) => { c.font = `${weight} ${size}px 'Courier New',monospace`; c.fillStyle = color; c.textBaseline = 'top'; c.fillText(s, x, y); };
const circle = (c, x, y, r, color) => { c.beginPath(); c.arc(x, y, r, 0, TWOPI); c.fillStyle = color; c.fill(); };
const prng = (seed) => { let n = Math.sin(seed * 137.4 + 82.9) * 43758.5453; return n - Math.floor(n); };
const wave = (x, t) => Math.sin(x * .079 + t * 1.6) * .48 + Math.sin(x * .245 - t * 2.2) * .21 + Math.cos(x * .45 + t * .83) * .18;
const graphGrid = (c, r, cols = 7, rows = 5) => {
    rect(c, r);
    for (let i = 1; i < cols; i++)
        line(c, r.x + r.w * i / cols, r.y, r.x + r.w * i / cols, r.y + r.h, '#bdc9c7', .75);
    for (let j = 1; j < rows; j++)
        line(c, r.x, r.y + r.h * j / rows, r.x + r.w, r.y + r.h * j / rows, '#bdc9c7', .75);
};
function paintAnalog(c, r, phase, t, color, amplitude, opacity = 1) {
    c.beginPath();
    for (let i = 0; i <= r.w - 8; i += 2) {
        const x = r.x + 4 + i;
        const env = .3 + .7 * Math.sin(Math.PI * i / r.w) ** 2;
        const y = r.y + r.h * .54 + wave(i + phase, t + phase * .3) * amplitude * env;
        if (!i)
            c.moveTo(x, y);
        else
            c.lineTo(x, y);
    }
    c.strokeStyle = pinkOpacity(color, opacity);
    c.lineWidth = 1.9;
    c.stroke();
}
/** Shared original renderer, only used for modules whose geometry scales cleanly. */
function scaleRegion(c, oldR, newR, fn, s) {
    c.save();
    c.beginPath();
    c.rect(newR.x, newR.y, newR.w, newR.h);
    c.clip();
    c.translate(newR.x, newR.y);
    c.scale(newR.w / oldR.w, newR.h / oldR.h);
    c.translate(-oldR.x, -oldR.y);
    fn(c, s);
    c.restore();
}
function dotsDesktop(c, s) {
    const r = DESK.dots, t = s.time * s.theme.motionSpeed, p = s.theme.primaryAccent, q = s.theme.secondaryAccent, react = s.reactivity;
    const spacing = 20.2, top = r.y + 10, left = r.x + 34;
    for (let row = 0; row < 19; row++)
        for (let col = 0; col < 10; col++) {
            const x = left + col * spacing, y = top + row * spacing;
            const ring = col >= 7 && [7, 8, 9, 11, 12].includes(row);
            let strength = 0;
            if (col === 9)
                strength = .92;
            if (col === 8 && ([3, 4, 5, 6, 7, 8, 10, 11, 14, 16, 18].includes(row)))
                strength = .7;
            if (col === 7 && ([4, 5, 6, 8, 10, 11, 14, 16].includes(row)))
                strength = .4;
            if (col === 6 && ([5, 6, 10, 11, 14].includes(row)))
                strength = .15;
            const intensity = strength ? strength + Math.sin(t * 2.0 - row * .6 + col * .8 + (react?.channels?.[1] ?? 0) * 2) * .08 + (react?.motion ?? 0) * .16 + (react?.beat ?? 0) * .14 + (react?.channels?.[(row + col) % 8] ?? 0) * .13 : 0;
            const color = intensity > .74 ? p : intensity > .42 ? q : intensity > .15 ? pinkOpacity(q, .45) : '#f5f7f5';
            circle(c, x, y, 8.4, color);
            if (ring) {
                circle(c, x, y, 5.0, '#e6edea');
                circle(c, x, y, 2.35, p);
            }
        }
}
function orbitDesktop(c, s) {
    const r = DESK.orbit, p = s.theme.primaryAccent, q = s.theme.secondaryAccent, t = s.time * s.theme.orbitSpeed, react = s.reactivity;
    c.fillStyle = '#dce3e2';
    c.fillRect(r.x, r.y, r.w, r.h);
    const cx = r.x + r.w * .5, cy = r.y + r.h * .525;
    for (let j = 0; j < 25; j++) {
        const radius = (39 + j * 3.1) * (1 + (react?.bass ?? 0) * .04 + (react?.motion ?? 0) * .07 + (react?.channels?.[6] ?? 0) * .055);
        const angle = j * .27 + (react?.channels?.[j % 8] ?? 0) * .15 + t * (.065 + (j % 4) * .021);
        c.save();
        c.translate(cx, cy);
        c.rotate(angle);
        c.beginPath();
        c.ellipse(0, 0, radius, radius * (.62 + .2 * Math.sin(j * .82 + t * .15)), 0, .22 * j, .22 * j + Math.PI * (1.18 + .72 * prng(j)));
        c.strokeStyle = pinkOpacity(j % 6 === 0 ? '#263034' : j % 3 === 0 ? q : p, .19 + prng(j + 1) * .41);
        c.lineWidth = .8 + prng(j + 11) * 1.2;
        c.stroke();
        c.restore();
    }
    for (let i = 0; i < 32; i++) {
        const a = i * 2.39 + t * .1, radius = 22 + prng(i + 19) * 113;
        circle(c, cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * .85, 1.1, pinkOpacity(p, .2 + prng(i + 7) * .6));
    }
    circle(c, cx + Math.cos(t * .4) * 5, cy + Math.sin(t * .3) * 4, 16 + (react?.beat ?? 0) * 3, '#222a2c');
}
function beatDesktop(c, s) {
    const r = DESK.beat, t = s.time, p = s.theme.primaryAccent, q = s.theme.secondaryAccent, react = s.reactivity;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2, outer = 171;
    for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.arc(cx, cy, 57 + i * 27, 0, TWOPI);
        c.lineWidth = 1;
        c.strokeStyle = pinkOpacity('#a6b7b2', .18 + i * .07);
        c.stroke();
    }
    for (let i = 0; i < 24; i++) {
        const a = -Math.PI / 2 + i * TWOPI / 24;
        line(c, cx + Math.cos(a) * (outer - 3), cy + Math.sin(a) * (outer - 3), cx + Math.cos(a) * (outer + (i % 6 === 0 ? 15 : 7)), cy + Math.sin(a) * (outer + (i % 6 === 0 ? 15 : 7)), i % 6 === 0 ? '#65716f' : '#b6c0bd', i % 6 === 0 ? 1.7 : 1);
    }
    const arcs = [[-1.57, -.85, 147, 9], [-.14, .31, 139, 9], [.42, 1.16, 134, 14], [1.87, 2.52, 125, 7], [2.7, 3.5, 127, 7], [-2.9, -2.35, 105, 8], [-2.15, -1.57, 83, 5], [.8, 1.45, 98, 6], [1.98, 2.62, 94, 7], [-.15, .34, 75, 4]];
    for (let i = 0; i < arcs.length; i++) {
        const [start, end, rad, w] = arcs[i];
        c.beginPath();
        c.arc(cx, cy, rad, start + t * .015 * (i % 2 ? 1 : -1), end + t * .015 * (i % 2 ? 1 : -1));
        c.lineCap = 'round';
        c.strokeStyle = i < 3 ? p : pinkOpacity(q, .65 + (react?.beat ?? 0) * .2);
        c.lineWidth = w + (react?.bass ?? 0) * 2 + (react?.channels?.[7] ?? 0) * 1.1;
        c.stroke();
    }
    c.lineCap = 'butt';
    const bpm = bpmFromEnergy(s.theme.visualEnergy), bar = Math.floor(t / (60 / bpm * 4)) % 4 + 1;
    dlabel(c, 'BAR', cx - 18, cy - 27, '#8b9592', 16);
    dlabel(c, String(bar), cx - 13, cy - 2, '#222b2b', 42, 700);
    dlabel(c, '1', cx - 5, cy - outer - 38, '#697672', 18, 700);
    dlabel(c, '2', cx + outer + 13, cy - 7, p, 17, 700);
    dlabel(c, '3', cx - 5, cy + outer + 18, '#697672', 18, 700);
    dlabel(c, '4', cx - outer - 25, cy - 7, '#697672', 18, 700);
    const a = .28 + t * secondsPerStep(bpm) * .16;
    line(c, cx + Math.cos(a) * 42, cy + Math.sin(a) * 42, cx + Math.cos(a) * outer, cy + Math.sin(a) * outer, '#202727', 2.2);
}
function waveformDesktop(c, s) {
    const r = DESK.waveform, p = s.theme.primaryAccent, t = s.time, react = s.reactivity;
    rect(c, r);
    dlabel(c, 'WAVEFORM', r.x + 20, r.y + 15, '#677573', 18);
    dlabel(c, 'LOU', r.x + r.w - 55, r.y + 15, p, 17);
    for (let i = 8; i < r.w - 8; i += 4) {
        const env = .46 + .54 * Math.abs(wave(i, t));
        line(c, r.x + i, r.y + r.h * .54 - env * 36, r.x + i, r.y + r.h * .54 + env * 36, '#9daba8', 1.7);
    }
    if (s.mode === 'demo')
        paintAnalog(c, { x: r.x, y: r.y + 43, w: r.w, h: r.h - 65 }, 1, t, p, 20 + (react?.level ?? 0) * 23 + (react?.motion ?? 0) * 9);
    else {
        c.beginPath();
        for (let i = 0; i < r.w - 8; i += 2) {
            const v = s.audioWave[Math.floor(i / (r.w - 8) * s.audioWave.length)] ?? 128;
            const y = r.y + r.h * .54 + (v - 128) / 128 * 90;
            if (i === 0)
                c.moveTo(r.x + 4, y);
            else
                c.lineTo(r.x + 4 + i, y);
        }
        c.lineWidth = 2;
        c.strokeStyle = p;
        c.stroke();
    }
}
function scoreDesktop(c, s) {
    const r = DESK.score, p = s.theme.primaryAccent, t = s.time, react = s.reactivity;
    graphGrid(c, r, 7, 5);
    dlabel(c, 'SCORE', r.x + 20, r.y + 15, '#6f7b79', 18);
    paintAnalog(c, { x: r.x, y: r.y + 40, w: r.w, h: r.h - 65 }, 5, t, p, 11 + (react?.mid ?? 0) * 16 + (react?.imageChange ?? 0) * 16 + (react?.channels?.[3] ?? 0) * 10);
    paintAnalog(c, { x: r.x, y: r.y + 40, w: r.w, h: r.h - 65 }, 1, t * .84, '#8d9a97', 13 + (react?.treble ?? 0) * 17, .85);
}
function spectrumDesktop(c, s) {
    const r = DESK.spectrum, p = s.theme.primaryAccent, t = s.time, react = s.reactivity;
    graphGrid(c, r, 7, 5);
    dlabel(c, 'SPECTRUM', r.x + 20, r.y + 15, '#6f7b79', 18);
    const count = 38, bw = 4.5, gap = 2.2, start = r.x + 15;
    for (let i = 0; i < count; i++) {
        const env = Math.pow(Math.sin(Math.PI * (i + .2) / count), .72);
        const actual = s.audioBins[Math.min(127, Math.floor(i * 3.1))] / 255;
        const signal = s.mode === 'demo' ? (.25 + .37 * Math.sin(t * 2.3 + i * .66) ** 2 + (react?.beat ?? 0) * .15 + (react?.motion ?? 0) * .2 + (react?.channels?.[2] ?? 0) * .175 + (react?.channels?.[i % 8] ?? 0) * .22) * env : actual;
        const h = Math.max(6, (.24 + Math.max(0, signal)) * env * 128);
        c.fillStyle = '#273133';
        c.fillRect(start + i * (bw + gap), r.y + r.h - 10 - h, bw, h);
        c.fillStyle = pinkOpacity(p, .55 + .35 * env);
        c.fillRect(start + i * (bw + gap), r.y + r.h - 17 - h, bw, 3);
    }
}
function vectorDesktop(c, s) {
    const r = DESK.vector, p = s.theme.primaryAccent, t = s.time, react = s.reactivity;
    rect(c, r);
    dlabel(c, 'VECTOR', r.x + 20, r.y + 15, '#6f7b79', 18);
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2 + 18, rad = 78;
    c.strokeStyle = '#bbc9c5';
    c.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        line(c, cx, cy, cx + rad * Math.cos(a), cy + rad * Math.sin(a), '#b9c6c3', 1);
    }
    for (let i = 1; i < 4; i++) {
        c.beginPath();
        c.arc(cx, cy, rad * i / 3, 0, TWOPI);
        c.stroke();
    }
    circle(c, cx + Math.sin(t * (.85 + (react?.channels?.[5] ?? 0) * .24)) * (16 + (react?.bass ?? 0) * 27) + (react?.direction ?? .5) * 4 - 2, cy + Math.cos(t * .71) * (12 + (react?.treble ?? 0) * 25), 3.6 + (react?.motion ?? 0) * 1.6, p);
}
function channelsDesktop(c, s) {
    const r = DESK.channels, p = s.theme.primaryAccent, t = s.time, react = s.reactivity;
    graphGrid(c, r, 15, 5);
    dlabel(c, 'CH1', r.x + 21, r.y + 14, p, 18, 700);
    dlabel(c, 'BASS', r.x + 95, r.y + 14, p, 18, 700);
    dlabel(c, 'CH2', r.x + r.w - 72, r.y + 14, '#6e7977', 18);
    const center = r.y + 139;
    for (let kind = 0; kind < 2; kind++) {
        c.beginPath();
        for (let i = 0; i <= r.w - 12; i += 2) {
            const env = .6 + .4 * Math.sin(i / r.w * Math.PI) ** 2;
            let y = center + env * ((kind ? 17 : 11) * Math.sin(i * .06 + (kind ? t * .9 : t * 1.6)) + (kind ? 8 : 13) * Math.sin(i * .18 + t * (kind ? .6 : 2.1)) + (kind ? 3 : 7) * Math.sin(i * .43 - t * .8)) * (.65 + (react?.level ?? 0) * .8 + (react?.motion ?? 0) * .2 + (react?.channels?.[2] ?? 0) * .17);
            if (s.mode !== 'demo') {
                const sample = s.audioWave[Math.floor(i / (r.w - 12) * s.audioWave.length)] ?? 128;
                y += ((sample - 128) / 128) * (kind ? 26 : 49);
            }
            if (i === 0)
                c.moveTo(r.x + 6 + i, y);
            else
                c.lineTo(r.x + 6 + i, y);
        }
        c.lineWidth = kind ? 1.3 : 2.4;
        c.strokeStyle = kind ? '#a7b5b2' : p;
        c.stroke();
    }
}
function footerDesktop(c, s) {
    const r = DESK.footer, duration = Math.max(1, s.duration), fraction = ((s.time % duration) + duration) % duration / duration;
    line(c, r.x, r.y, r.x + r.w * .75, r.y, '#9daaa7', 1);
    line(c, r.x, r.y, r.x + r.w * .75 * fraction, r.y, '#303c3b', 1.6);
    const fmt = (n) => `${Math.floor(n / 60)}:${Math.floor(n % 60).toString().padStart(2, '0')}`;
    dlabel(c, `${fmt(s.time)} / ${fmt(duration)}`, r.x + r.w * .77, r.y - 9, '#717c79', 17);
    dlabel(c, s.mode === 'music' ? 'SYN' : s.mode === 'file' ? 'AUD' : 'SIM', r.x + r.w - 32, r.y - 6, '#7d8a87', 12);
}
function desktopKeyRect(index) {
    const old = keyRect(index), src = GEO.keybed, dst = DESK.keybed;
    return { x: dst.x + (old.x - src.x) * dst.w / src.w,
        y: dst.y + (old.y - src.y) * dst.h / src.h,
        w: old.w * dst.w / src.w, h: old.h * dst.h / src.h };
}
function drawInstrumentDesktop(c, s) {
    const t = Number.isFinite(s.time) ? s.time : 0;
    const state = { ...s, time: s.isReducedMotion ? 0 : t };
    c.clearRect(0, 0, ART_DESKTOP.width, ART_DESKTOP.height);
    c.fillStyle = s.theme.backgroundColor;
    c.fillRect(0, 0, ART_DESKTOP.width, ART_DESKTOP.height);
    scaleRegion(c, GEO.signal, DESK.signal, drawSignal, state);
    dotsDesktop(c, state);
    orbitDesktop(c, state);
    beatDesktop(c, state);
    rect(c, DESK.portrait, '#b1bcb9');
    scaleRegion(c, GEO.roll, DESK.roll, drawRoll, state);
    scaleRegion(c, GEO.highway, DESK.highway, drawHighway, state);
    scaleRegion(c, GEO.keybed, DESK.keybed, drawKeybed, state);
    waveformDesktop(c, state);
    scoreDesktop(c, state);
    spectrumDesktop(c, state);
    vectorDesktop(c, state);
    channelsDesktop(c, state);
    footerDesktop(c, { ...state, time: t });
    drawMicroDetails(c, state, Object.values(DESK));
}


// ----- media/gif-player.ts -----
/** Cross-browser GIF89a decoder and transport-synchronized player.
 * Decodes LZW indexed patches locally; preserves transparency, interlace and
 * GIF disposal 2/3. Retains compact indexed patches, not full RGBA frames.
 */

function decompressLzw(minimum, bytes, expected) {
    if (minimum < 2 || minimum > 8)
        throw Error('Invalid GIF LZW code size');
    const clear = 1 << minimum, end = clear + 1;
    const prefix = new Uint16Array(4096), suffix = new Uint8Array(4096), stack = new Uint8Array(4097);
    const output = new Uint8Array(expected);
    let position = 0, bit = 0, codeSize = minimum + 1, next = end + 1, previous = -1, first = 0;
    const readCode = () => {
        if (bit + codeSize > bytes.length * 8)
            return -1;
        let code = 0;
        for (let i = 0; i < codeSize; i++)
            code |= ((bytes[(bit + i) >> 3] >> ((bit + i) & 7)) & 1) << i;
        bit += codeSize;
        return code;
    };
    let guard = 0;
    while (position < expected && guard++ < expected * 5 + 10240) {
        let code = readCode();
        if (code < 0 || code === end)
            break;
        if (code === clear) {
            codeSize = minimum + 1;
            next = end + 1;
            previous = -1;
            continue;
        }
        if (code > next)
            throw Error('Malformed GIF LZW stream');
        if (previous === -1) {
            if (code >= clear)
                throw Error('Invalid GIF first code');
            output[position++] = code;
            first = code;
            previous = code;
            continue;
        }
        const incoming = code;
        let top = 0;
        if (code === next) {
            stack[top++] = first;
            code = previous;
        }
        while (code >= end + 1) {
            if (code >= next || top >= 4096)
                throw Error('Invalid GIF dictionary reference');
            stack[top++] = suffix[code];
            code = prefix[code];
        }
        first = code;
        stack[top++] = first;
        while (top && position < expected)
            output[position++] = stack[--top];
        if (next < 4096) {
            prefix[next] = previous;
            suffix[next] = first;
            next++;
            if (next === (1 << codeSize) && codeSize < 12)
                codeSize++;
        }
        previous = incoming;
    }
    if (position !== expected)
        throw Error(`Truncated GIF image: ${position}/${expected}`);
    return output;
}
/** No external GIF library needed, including on GitHub Pages. */
function decodeGif(buffer) {
    const bytes = new Uint8Array(buffer);
    let p = 0;
    const read = () => { if (p >= bytes.length)
        throw Error('Truncated GIF'); return bytes[p++]; };
    const word = () => read() | (read() << 8);
    const table = (size) => { const out = bytes.slice(p, p + size * 3); if (out.length !== size * 3)
        throw Error('Truncated GIF palette'); p += size * 3; return out; };
    const blocks = () => {
        const list = [];
        let total = 0;
        for (;;) {
            const n = read();
            if (!n)
                break;
            if (p + n > bytes.length)
                throw Error('Truncated GIF data block');
            const data = bytes.subarray(p, p + n);
            list.push(data);
            total += n;
            p += n;
            if (total > 32 * 1024 * 1024)
                throw Error('GIF data blocks exceed limit');
        }
        const out = new Uint8Array(total);
        let offset = 0;
        for (const a of list) {
            out.set(a, offset);
            offset += a.length;
        }
        return out;
    };
    const magic = String.fromCharCode(...bytes.subarray(0, 6));
    p = 6;
    if (magic !== 'GIF89a' && magic !== 'GIF87a')
        throw Error('File is not a GIF');
    const width = word(), height = word();
    if (!width || !height || width * height > 7_000_000)
        throw Error('GIF dimensions are too large');
    const packed = read();
    read();
    read();
    const global = (packed & 128) ? table(1 << ((packed & 7) + 1)) : new Uint8Array(0);
    const frames = [];
    let delay = 100, transparent = -1, disposal = 0, totalPixels = 0;
    while (p < bytes.length) {
        const sep = read();
        if (sep === 0x3b)
            break;
        if (sep === 0x21) {
            const extension = read();
            if (extension === 0xf9) {
                if (read() !== 4)
                    throw Error('Invalid GIF graphic control extension');
                const flags = read();
                const centis = word();
                const trans = read();
                read();
                delay = Math.max(20, (centis || 10) * 10);
                transparent = (flags & 1) ? trans : -1;
                disposal = (flags >> 2) & 7;
            }
            else {
                void blocks();
            }
            continue;
        }
        if (sep !== 0x2c)
            throw Error('Invalid GIF frame separator');
        const x = word(), y = word(), w = word(), h = word(), flags = read();
        if (!w || !h || w * h > 7_000_000 || x + w > width || y + h > height)
            throw Error('Invalid GIF frame rectangle');
        const colors = (flags & 128) ? table(1 << ((flags & 7) + 1)) : global;
        if (!colors.length)
            throw Error('GIF frame has no palette');
        const codeSize = read();
        const indices = decompressLzw(codeSize, blocks(), w * h);
        if (flags & 64) {
            const reordered = new Uint8Array(indices.length);
            let source = 0;
            for (const [start, inc] of [[0, 8], [4, 8], [2, 4], [1, 2]]) {
                for (let row = start; row < h; row += inc) {
                    reordered.set(indices.subarray(source, source + w), row * w);
                    source += w;
                }
            }
            indices.set(reordered);
        }
        frames.push({ x, y, w, h, indices, colors, transparent, disposal, delay });
        totalPixels += w * h;
        if (frames.length > 320 || totalPixels > 92_000_000)
            throw Error('GIF animation exceeds safe processing limits');
        delay = 100;
        transparent = -1;
        disposal = 0;
    }
    if (!frames.length)
        throw Error('GIF has no picture frames');
    return { width, height, frames };
}
class ReactiveGifPlayer {
    target;
    decoded = null;
    entries = [];
    duration = 0;
    lastIndex = -1;
    canvas;
    ctx;
    patch;
    prior = null;
    restore = null;
    ready = false;
    generation = 0;
    constructor(target) {
        this.target = target;
        this.canvas = document.createElement('canvas');
        this.patch = document.createElement('canvas');
        const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx)
            throw Error('Canvas unavailable');
        this.ctx = ctx;
    }
    get active() { return this.ready; }
    get frameCount() { return this.entries.length; }
    resize(width, height) {
        const w = Math.max(1, Math.round(width)), h = Math.max(1, Math.round(height));
        if (this.target.width !== w || this.target.height !== h) {
            this.target.width = w;
            this.target.height = h;
            this.lastIndex = -1;
        }
    }
    close() {
        this.generation++;
        this.ready = false;
        this.decoded = null;
        this.entries = [];
        this.duration = 0;
        this.lastIndex = -1;
        this.prior = null;
        this.restore = null;
        this.canvas.width = 1;
        this.canvas.height = 1;
        this.patch.width = 1;
        this.patch.height = 1;
        this.target.hidden = true;
    }
    resetCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.prior = null;
        this.restore = null;
        this.lastIndex = -1;
    }
    paint(frame) {
        if (this.prior) {
            if (this.prior.disposal === 2)
                this.ctx.clearRect(this.prior.x, this.prior.y, this.prior.w, this.prior.h);
            else if (this.prior.disposal === 3 && this.restore)
                this.ctx.putImageData(this.restore, 0, 0);
        }
        const restore = frame.disposal === 3 ? this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height) : null;
        this.patch.width = frame.w;
        this.patch.height = frame.h;
        const patchCtx = this.patch.getContext('2d');
        const image = patchCtx.createImageData(frame.w, frame.h);
        const data = image.data;
        for (let i = 0; i < frame.indices.length; i++) {
            const color = frame.indices[i], colorIndex = color * 3, j = i * 4;
            if (color === frame.transparent || colorIndex + 2 >= frame.colors.length)
                continue;
            data[j] = frame.colors[colorIndex];
            data[j + 1] = frame.colors[colorIndex + 1];
            data[j + 2] = frame.colors[colorIndex + 2];
            data[j + 3] = 255;
        }
        patchCtx.putImageData(image, 0, 0);
        this.ctx.drawImage(this.patch, frame.x, frame.y);
        this.prior = frame;
        this.restore = restore;
    }
    async load(file) {
        this.close();
        const generation = this.generation;
        if (file.type !== 'image/gif')
            return null;
        try {
            const decoded = decodeGif(await file.arrayBuffer());
            if (generation !== this.generation)
                return null;
            this.decoded = decoded;
            this.canvas.width = decoded.width;
            this.canvas.height = decoded.height;
            const mini = document.createElement('canvas');
            mini.width = 48;
            mini.height = 48;
            const sc = mini.getContext('2d', { willReadFrequently: true });
            let previous = null, elapsed = 0, sum = 0;
            const entries = [];
            this.resetCanvas();
            for (let i = 0; i < decoded.frames.length; i++) {
                if (generation !== this.generation)
                    return null;
                const frame = decoded.frames[i];
                this.paint(frame);
                sc.clearRect(0, 0, 48, 48);
                sc.drawImage(this.canvas, 0, 0, 48, 48);
                const px = sc.getImageData(0, 0, 48, 48).data;
                let brightness = 0, delta = 0, left = 0, right = 0;
                const zones = Array(8).fill(0);
                for (let j = 0; j < px.length; j += 4) {
                    const x = (j / 4) % 48, y = Math.floor(j / (4 * 48));
                    brightness += (.2126 * px[j] + .7152 * px[j + 1] + .0722 * px[j + 2]) / 255;
                    if (previous) {
                        const d = (Math.abs(px[j] - previous[j]) + Math.abs(px[j + 1] - previous[j + 1]) + Math.abs(px[j + 2] - previous[j + 2])) / 765;
                        delta += d;
                        zones[Math.min(1, Math.floor(y / 24)) * 4 + Math.min(3, Math.floor(x / 12))] += d;
                        if (x < 24)
                            left += d;
                        else
                            right += d;
                    }
                }
                const motion = clamp(delta / (48 * 48) * 5);
                const frameMetrics = analyzePixels(px, 48, 48);
                frameMetrics.motion = motion;
                const frameTheme = themeFromMetrics(frameMetrics);
                elapsed += frame.delay;
                sum += motion;
                entries.push({ end: elapsed, motion, change: clamp(delta / (48 * 48) * 4),
                    brightness: brightness / (48 * 48), direction: clamp(.5 + (right - left) / (48 * 48) * 2),
                    zones: zones.map(n => clamp(n / (48 * 48 / 8) * 5)), theme: frameTheme });
                previous = px.slice();
                if (i % 32 === 0)
                    await new Promise(resolve => setTimeout(resolve, 0));
            }
            if (generation !== this.generation)
                return null;
            this.entries = entries;
            this.duration = elapsed;
            this.resetCanvas();
            this.ready = true;
            this.target.hidden = false;
            this.seek(0);
            return { frames: entries.length, durationMs: elapsed, meanMotion: sum / entries.length };
        }
        catch {
            if (generation === this.generation)
                this.close();
            return null;
        }
    }
    indexAt(elapsedMs) {
        const t = ((elapsedMs % this.duration) + this.duration) % this.duration;
        let lo = 0, hi = this.entries.length - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (t < this.entries[mid].end)
                hi = mid;
            else
                lo = mid + 1;
        }
        return lo;
    }
    motionAt(elapsedMs) {
        if (!this.ready)
            return null;
        const { motion, brightness, direction, change, zones, theme } = this.entries[this.indexAt(elapsedMs)];
        return { motion, brightness, direction, change, zones, theme };
    }
    seek(elapsedMs) {
        if (!this.ready || !this.decoded)
            return;
        const targetIndex = this.indexAt(elapsedMs);
        if (this.lastIndex === targetIndex)
            return;
        if (this.lastIndex > targetIndex || this.lastIndex < 0)
            this.resetCanvas();
        for (let i = this.lastIndex + 1; i <= targetIndex; i++)
            this.paint(this.decoded.frames[i]);
        this.lastIndex = targetIndex;
        const c = this.target.getContext('2d');
        if (!c)
            return;
        const w = this.target.width, h = this.target.height, iw = this.canvas.width, ih = this.canvas.height;
        const scale = Math.max(w / iw, h / ih), sw = w / scale, sh = h / scale;
        c.clearRect(0, 0, w, h);
        c.drawImage(this.canvas, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, w, h);
    }
}


// ----- media/native-gif.ts -----

/** Cross-browser fallback when ImageDecoder is absent.
 * Samples the actual native <img> GIF frames at ~12 fps. A paused-frame
 * snapshot is drawn over the still-running native element on transport pause.
 * Frame phase after resuming is browser-owned, not sample-accurate.
 */
class NativeGifSampler {
    overlay;
    image = null;
    mini;
    ctx;
    previous = null;
    last = null;
    lastSample = -Infinity;
    frozen = false;
    width = 48;
    height = 48;
    constructor(overlay) {
        this.overlay = overlay;
        this.mini = document.createElement('canvas');
        this.mini.width = this.width;
        this.mini.height = this.height;
        const ctx = this.mini.getContext('2d', { willReadFrequently: true });
        if (!ctx)
            throw new Error('Canvas not available for GIF analysis');
        this.ctx = ctx;
    }
    attach(image) {
        this.image = image;
        this.previous = null;
        this.last = null;
        this.lastSample = -Infinity;
        this.frozen = false;
        this.overlay.hidden = true;
    }
    close(preserveOverlay = false) {
        this.image = null;
        this.previous = null;
        this.last = null;
        this.frozen = false;
        if (!preserveOverlay)
            this.overlay.hidden = true;
    }
    sample(nowMs, playing) {
        const image = this.image;
        if (!image || !image.complete || !image.naturalWidth)
            return this.last;
        if (!playing) {
            if (!this.frozen) {
                const c = this.overlay.getContext('2d');
                if (c) {
                    const w = this.overlay.width, h = this.overlay.height;
                    const iw = image.naturalWidth, ih = image.naturalHeight, scale = Math.max(w / iw, h / ih);
                    const cropW = w / scale, cropH = h / scale;
                    c.clearRect(0, 0, w, h);
                    c.drawImage(image, (iw - cropW) / 2, (ih - cropH) / 2, cropW, cropH, 0, 0, w, h);
                    this.frozen = true;
                    this.overlay.hidden = false;
                }
            }
            return this.last;
        }
        if (this.frozen) {
            this.frozen = false;
            this.overlay.hidden = true;
            this.previous = null;
        }
        if (nowMs - this.lastSample < 80)
            return this.last;
        this.lastSample = nowMs;
        try {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(image, 0, 0, this.width, this.height);
            const px = this.ctx.getImageData(0, 0, this.width, this.height).data;
            let motion = 0, change = 0, left = 0, right = 0, brightness = 0;
            const zones = Array(8).fill(0);
            for (let j = 0; j < px.length; j += 4) {
                const x = (j / 4) % this.width, y = Math.floor(j / (4 * this.width));
                brightness += (.2126 * px[j] + .7152 * px[j + 1] + .0722 * px[j + 2]) / 255;
                if (this.previous) {
                    const d = (Math.abs(px[j] - this.previous[j]) + Math.abs(px[j + 1] - this.previous[j + 1]) + Math.abs(px[j + 2] - this.previous[j + 2])) / 765;
                    change += d;
                    zones[Math.min(1, Math.floor(y / 24)) * 4 + Math.min(3, Math.floor(x / 12))] += d;
                    if (x < 24)
                        left += d;
                    else
                        right += d;
                }
            }
            const delta = change / (this.width * this.height);
            motion = clamp(delta * 5);
            const metrics = analyzePixels(px, this.width, this.height);
            metrics.motion = motion;
            this.last = { motion, change: clamp(delta * 4), brightness: brightness / (this.width * this.height),
                direction: clamp(.5 + (right - left) / (this.width * this.height) * 2),
                zones: zones.map(n => clamp(n / (this.width * this.height / 8) * 5)), theme: themeFromMetrics(metrics) };
            this.previous = px.slice();
        }
        catch { /* Keep native GIF visible even if pixel readback is blocked. */ }
        return this.last;
    }
}


// Standalone, dependency-free build uses the exact same renderer/audio/theme logic as React source.
const $=(id)=>document.getElementById(id);
const canvas=$('render');const c=canvas.getContext('2d',{alpha:false});
const instrument=$('instrument'),portrait=$('portrait'),engine=new AudioEngine();
const gifPlayer=new ReactiveGifPlayer($('gif-render')),nativeGif=new NativeGifSampler($('gif-render')),signals=new SignalBus();let gifClock=0;
const state={time:1.1,playing:true,theme:{...defaultTheme},baseTheme:{...defaultTheme},mode:'demo',audioBins:new Uint8Array(128),audioWave:new Uint8Array(256),score:11875,combo:14,pressed:[],duration:21,isReducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,reactivity:{...quietSignals}};
let desktop=false;
function resizeCanvas(){desktop=innerWidth>800;const board=desktop?ART_DESKTOP:ART;
const dpr=Math.min(desktop?1.5:2.2,devicePixelRatio||1);
canvas.width=Math.round(board.width*dpr);canvas.height=Math.round(board.height*dpr);c.setTransform(dpr,0,0,dpr,0,0);}
resizeCanvas();addEventListener('resize',resizeCanvas);
function resizeGif(){gifPlayer.resize(desktop?DESK.portrait.w:GEO.portrait.w,desktop?DESK.portrait.h:GEO.portrait.h);}
resizeGif();addEventListener('resize',resizeGif);
let last=0,lastCssPaint=0,transition=null,objectURL=null,loadingID=0;
const noteHold=new Map();
const status=(s)=>{$('status').textContent=s;};
const updateButtons=()=>{
  $('music-button').textContent=state.mode==='music'?'SILENT':'GENERATE';
  $('music-mobile').textContent=state.mode==='music'?'SILENT':'SOUND';
  $('play-button').textContent=$('play-mobile').textContent=state.playing?'PAUSE':'PLAY';
  $('mute-button').textContent=engine.muted?'UNMUTE':'MUTE';
};
const pause=async()=>{state.playing=!state.playing;if(state.playing)await engine.resume().catch(()=>status('Audio could not resume.'));else await engine.pause();updateButtons();};
const music=async()=>{if(state.mode==='music'){engine.useDemo();state.mode='demo';status('Silent procedural simulation.');}
 else {try{await engine.useMusic();state.mode='music';state.playing=true;status('Playing original generative music.');}catch(e){status(String(e));}}updateButtons();};
const mute=()=>{engine.setMuted(!engine.muted);updateButtons();};
const reset=()=>{engine.reset();state.time=0;gifClock=0;signals.reset();state.score=0;state.combo=0;status('Transport reset.');};
const hit=(pitch)=>{engine.tap(pitch);noteHold.set(pitch,performance.now()+145);if(state.mode!=='demo'){state.score+=125;state.combo++;}};
$('dot-play').onclick=pause;$('dot-music').onclick=music;$('dot-mute').onclick=mute;
$('play-button').onclick=pause;$('music-button').onclick=music;$('mute-button').onclick=mute;$('reset-button').onclick=reset;
$('image-hit').onclick=()=> $('image-input').click();
$('image-button').onclick=$('image-mobile').onclick=()=> $('image-input').click();
$('audio-button').onclick=$('audio-mobile').onclick=()=> $('audio-input').click();
$('music-mobile').onclick=music;$('play-mobile').onclick=pause;
instrument.addEventListener('mouseenter',()=>$('toolstrip').classList.add('toolstrip-open'));
instrument.addEventListener('mouseleave',()=>$('toolstrip').classList.remove('toolstrip-open'));
instrument.addEventListener('focusin',()=>$('toolstrip').classList.add('toolstrip-open'));
canvas.addEventListener('pointerdown',(e)=>{const r=canvas.getBoundingClientRect(),board=desktop?ART_DESKTOP:ART,
  x=(e.clientX-r.left)*board.width/r.width,y=(e.clientY-r.top)*board.height/r.height;
  for(let i=0;i<KEYS.length;i++){if(within(x,y,desktop?desktopKeyRect(i):keyRect(i))){hit(KEYS[i][1]);return;}}
  if(desktop?within(x,y,{x:DESK.footer.x,y:DESK.footer.y-15,w:DESK.footer.w*.75,h:40}):(y>=1513&&x<328))void pause();
});

async function getMetrics(file){
  const img=await createImageBitmap(file);
  try{if(img.width*img.height>40_000_000)throw Error('Image dimensions exceed safe decoding limits.');
    const w=Math.max(1,Math.round(Math.min(256,img.width))),h=Math.max(1,Math.min(256,Math.round(w*img.height/img.width)));const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    cv.getContext('2d',{willReadFrequently:true}).drawImage(img,0,0,w,h);
    const pixels=cv.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data;
    return {metrics:analyzePixels(pixels,w,h),seed:seedFromPixels(pixels,w,h)};
  }finally{img.close();}
}
async function getGifMotion(file,metrics){
  // ImageDecoder is natively implemented by Chromium; unsupported browsers retain color-only response.
  if(typeof ImageDecoder==='undefined')return metrics;
  try{
    const decoder=new ImageDecoder({data:await file.arrayBuffer(),type:'image/gif'});
    await decoder.tracks.ready;
    const count=decoder.tracks.selectedTrack?.frameCount||1;
    const cv=document.createElement('canvas');cv.width=48;cv.height=48;const ctx=cv.getContext('2d',{willReadFrequently:true});
    let lastPixels=null,sum=0,n=0;
    for(let i=0;i<Math.min(16,count);i++){
      const index=Math.floor(i*Math.max(1,count-1)/Math.max(1,Math.min(16,count)-1));
      const {image}=await decoder.decode({frameIndex:index});ctx.clearRect(0,0,48,48);ctx.drawImage(image,0,0,48,48);image.close();
      const px=ctx.getImageData(0,0,48,48).data;
      if(lastPixels){let d=0;for(let k=0;k<px.length;k+=4)d+=Math.abs(px[k]-lastPixels[k])+Math.abs(px[k+1]-lastPixels[k+1])+Math.abs(px[k+2]-lastPixels[k+2]);sum+=d/(48*48*3*255);n++;}
      lastPixels=px.slice();
    }
    decoder.close();metrics.motion=clamp(sum/Math.max(1,n)*4);
  }catch{ /* Color analysis still works when animated decoding is unsupported. */ }
  return metrics;
}
async function loadImage(file){
  if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)){status('Use PNG, JPEG, WebP or GIF.');return;}
  if(file.size>24*1024*1024){status('Image maximum: 24 MB.');return;}
  const sequence=++loadingID, newURL=URL.createObjectURL(file);status(`Analyzing ${file.name} locally…`);
  try{
    const sample=await getMetrics(file);let metrics=sample.metrics;const seed=sample.seed;
    let info=null;
    if(file.type==='image/gif'){
      info=await gifPlayer.load(file);
      if(info)metrics.motion=clamp(info.meanMotion);
      else metrics=await getGifMotion(file,metrics);
      gifClock=0;
    }else gifPlayer.close();
    if(sequence!==loadingID){URL.revokeObjectURL(newURL);return;}
    if(objectURL)URL.revokeObjectURL(objectURL);objectURL=newURL;portrait.src=newURL;portrait.style.visibility=info?'hidden':'';
    if(file.type==='image/gif'&&!info)nativeGif.attach(portrait);else nativeGif.close(!!info);
    signals.setProfile(seed);setScoreSeed(seed.hash);
    transition={from:state.baseTheme,to:themeFromMetrics(metrics),start:performance.now()};
    status(`${file.name}: pixel seed ${seed.hash.toString(16).toUpperCase().padStart(8,'0')}; ${info?`${info.frames} GIF frames synchronized`:'image signature ready'}.`);
  }catch(e){URL.revokeObjectURL(newURL);status(`Cannot analyze image: ${e instanceof Error?e.message:String(e)}`);}
}
async function loadAudio(file){try{await engine.useFile(file);state.mode='file';state.playing=true;state.time=0;status(`${file.name} is driving waveform and spectrum analysis.`);updateButtons();}
catch(e){status(`Audio unavailable: ${e instanceof Error?e.message:String(e)}`);}}
$('image-input').onchange=(e)=>{const file=e.target.files[0];if(file)void loadImage(file);e.target.value='';};
$('audio-input').onchange=(e)=>{const file=e.target.files[0];if(file)void loadAudio(file);e.target.value='';};
instrument.addEventListener('dragover',(e)=>{e.preventDefault();$('drop-overlay').hidden=false;});
instrument.addEventListener('dragleave',(e)=>{if(!e.relatedTarget||!instrument.contains(e.relatedTarget))$('drop-overlay').hidden=true;});
instrument.addEventListener('drop',(e)=>{e.preventDefault();$('drop-overlay').hidden=true;const file=e.dataTransfer.files[0];if(!file)return;if(file.type.startsWith('image/'))void loadImage(file);else if(file.type.startsWith('audio/'))void loadAudio(file);else status('Drop an image, GIF, or audio file.');});
document.addEventListener('keydown',(e)=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();if(k===' '){e.preventDefault();void pause();}else if(k==='i')$('image-input').click();
  else if(k==='a')$('audio-input').click();else if(k==='g')void music();else if(k==='d'){engine.useDemo();state.mode='demo';updateButtons();}
  else if(k==='m')mute();else if(k==='r')reset();else if('asdfghjk'.includes(k)&&!e.repeat)hit(KEYS[6+'asdfghjk'.indexOf(k)]?.[1]||60);
});
document.addEventListener('visibilitychange',()=>{last=0;});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',(e)=>{state.isReducedMotion=e.matches;});
function animateFrame(now){
  if(document.hidden){last=now;requestAnimationFrame(animateFrame);return;}
  const dt=last?Math.min(.07,(now-last)/1000):0;last=now;
  if(state.playing){gifClock+=dt;if(state.mode==='file'){state.time=engine.mediaTime;state.duration=engine.mediaDuration||21;}
  else {state.time+=dt;state.duration=21;}
  if(state.mode==='demo'){state.score=11875+Math.floor(state.time*105)*25;state.combo=14+Math.floor(state.time*1.6)%30;}
  engine.update(state.time,bpmFromEnergy(state.theme.visualEnergy),state.theme.noteDensity);
  }
  if(transition){const p=Math.min(1,(now-transition.start)/1100),ease=p*p*(3-2*p);state.baseTheme=interpolateTheme(transition.from,transition.to,ease);if(p>=1)transition=null;}
  for(const [key,until] of noteHold)if(now>until)noteHold.delete(key);
  state.pressed=[...noteHold.keys()];state.audioBins=engine.frequency;state.audioWave=engine.wave;
  const gifMs=gifClock*1000;
  const motion=gifPlayer.active?gifPlayer.motionAt(gifMs):nativeGif.sample(now,state.playing);
  if(gifPlayer.active)gifPlayer.seek(gifMs);
  const targetTheme=(motion&&motion.theme)?interpolateTheme(state.baseTheme,motion.theme,clamp(0.45+(motion.change||0)*0.75,0.32,0.9)):state.baseTheme;
  const themeEase=1-Math.exp(-Math.max(0.001,dt)*9);
  state.theme=interpolateTheme(state.theme,targetTheme,themeEase);
  if(now-lastCssPaint>125){instrument.style.setProperty('--accent',state.theme.primaryAccent);lastCssPaint=now;}
  state.reactivity=signals.update(state.time,dt,state.mode,state.theme,state.audioBins,state.audioWave,motion);
  if(desktop)drawInstrumentDesktop(c,state);else drawInstrument(c,state);requestAnimationFrame(animateFrame);
}
// Canvas supports normalized CSS colors; use it once for interpolation instead of new canvases each frame.
const colorCtx=document.createElement('canvas').getContext('2d');const cache=new Map();
function parseColor(color){if(cache.has(color))return cache.get(color);colorCtx.fillStyle=color;const converted=colorCtx.fillStyle;
  let nums;if(converted[0]==='#'){const h=converted.slice(1);nums=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
  else nums=converted.match(/[\d.]+/g).slice(0,3).map(Number);
  if(!color.startsWith('rgb(')){if(cache.size>512)cache.clear();cache.set(color,nums);}
  return nums;}
function interpolateTheme(a,b,p){const output={...b};for(const key in output){if(typeof b[key]==='number')output[key]=a[key]*(1-p)+b[key]*p;
  else {const x=parseColor(a[key]),y=parseColor(b[key]);output[key]=`rgb(${Math.round(x[0]+(y[0]-x[0])*p)},${Math.round(x[1]+(y[1]-x[1])*p)},${Math.round(x[2]+(y[2]-x[2])*p)})`;}}
  return output;}
requestAnimationFrame(animateFrame);
window.addEventListener('pagehide',()=>{nativeGif.close();gifPlayer.close();if(objectURL)URL.revokeObjectURL(objectURL);engine.dispose();});
