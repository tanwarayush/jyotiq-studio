"""Original synthesized score + mix for the ashuanimates Barbarik reel.
No sampled or reference audio. Uses only numpy/scipy DSP and the one-take ElevenLabs voice clock.
Run: /Users/ayushrajput/earshot/.venv/bin/python tools/score_mix.py
"""
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

EP = Path(__file__).resolve().parent.parent
SR = 48000
FPS = 30
TAU = 2 * np.pi
clock = json.loads((EP / "audio/vo/clock.json").read_text())
TOTAL = int(clock["total_frames"])
DUR = TOTAL / FPS
N = int(round(DUR * SR))
OUT = EP / "audio/mix"
OUT.mkdir(parents=True, exist_ok=True)


def sec(fr):
    return fr / FPS


def pan_gains(pan):
    return np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)


def add(buf, x, at, pan=0.0, gain=1.0):
    i = int(round(at * SR))
    if i >= N:
        return
    j = min(N, i + len(x))
    if j <= i:
        return
    gl, gr = pan_gains(pan)
    xx = x[: j - i].astype(np.float32) * gain
    buf[i:j, 0] += xx * gl
    buf[i:j, 1] += xx * gr


def norm(x):
    return x / max(1e-8, float(np.max(np.abs(x))))


def fade(x, fi=0.01, fo=0.03):
    y = x.copy()
    a = min(len(y), int(fi * SR))
    b = min(len(y), int(fo * SR))
    if a:
        y[:a] *= np.linspace(0, 1, a)
    if b:
        y[-b:] *= np.linspace(1, 0, b)
    return y


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n).astype(np.float32)


def lowpass(x, cutoff):
    b, a = signal.butter(3, cutoff / (SR / 2), "lowpass")
    return signal.lfilter(b, a, x).astype(np.float32)


def bandpass(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], "bandpass")
    return signal.lfilter(b, a, x).astype(np.float32)


def pluck(freq, dur=2.8, seed=0, bright=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(seed)
    y = np.zeros(n, np.float32)
    for h in range(1, 8):
        amp = (1 / h ** 1.5) * (1 + bright * (h == 2))
        decay = 1.4 + h * 0.34
        y += amp * np.exp(-t / decay) * np.sin(TAU * freq * h * t + rng.uniform(0, TAU))
    y += bandpass(noise(n, seed + 8), 900, 5200) * np.exp(-t / 0.012) * 0.18
    return fade(norm(y), 0.002, min(0.5, dur / 3))


def membrane(freq=95, dur=0.55, seed=0, bright=False):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1.0 - 0.28 * np.minimum(t / 0.12, 1.0))
    phase = TAU * np.cumsum(f) / SR
    y = np.sin(phase) * np.exp(-t / (0.10 if bright else 0.16))
    y += 0.35 * np.sin(phase * 2.03) * np.exp(-t / 0.055)
    y += bandpass(noise(n, seed), 1200 if bright else 500, 4500 if bright else 1800) * np.exp(-t / 0.012) * 0.22
    return norm(y)


def bell(freq=880, dur=2.8, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(seed)
    y = np.zeros(n, np.float32)
    for ratio, amp, dec in [(1.0, 1.0, 1.5), (2.01, 0.42, 0.65), (2.74, 0.23, 0.45), (4.1, 0.12, 0.28)]:
        y += amp * np.exp(-t / dec) * np.sin(TAU * freq * ratio * t + rng.uniform(0, TAU))
    return fade(norm(y), 0.003, 0.45)


def flute_note(freq, dur, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(TAU * 5.2 * t + seed)
    phase = TAU * freq * np.cumsum(vib) / SR
    y = np.sin(phase) + 0.22 * np.sin(2 * phase) + 0.055 * np.sin(3 * phase)
    y += bandpass(noise(n, seed + 1), 1800, 6500) * 0.018
    a = int(0.10 * SR)
    r = int(0.22 * SR)
    env = np.ones(n, np.float32)
    env[:a] = np.linspace(0, 1, a) ** 1.5
    env[-r:] = np.linspace(1, 0, r) ** 1.4
    return norm(y) * env


def deep_hit(dur=1.4, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = 58 * np.exp(-t / 0.17) + 31
    phase = TAU * np.cumsum(f0) / SR
    y = np.sin(phase) * np.exp(-t / 0.52)
    y += 0.28 * np.sin(phase * 0.5) * np.exp(-t / 0.7)
    y += lowpass(noise(n, seed), 180) * np.exp(-t / 0.055) * 0.55
    return fade(norm(y), 0.004, 0.55)


def whoosh(dur=0.65, seed=0, bright=False):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = noise(n, seed)
    x = bandpass(x, 500 if bright else 180, 6200 if bright else 2400)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** (1.1 if bright else 1.7)
    return norm(x) * env


def shimmer(dur=1.7, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n, np.float32)
    for k, f in enumerate([1320, 1760, 2217, 2637]):
        y += (0.5 / (k + 1)) * np.exp(-t / (0.7 + k * 0.12)) * np.sin(TAU * f * t + k)
    y += bandpass(noise(n, seed), 4000, 10500) * np.exp(-t / 0.18) * 0.08
    return fade(norm(y), 0.015, 0.8)


def stem_drone():
    t = np.arange(N) / SR
    y = np.zeros((N, 2), np.float32)
    for idx, (f, g, pan) in enumerate([(55.0, 0.50, -0.18), (110.0, 0.27, 0.16), (164.81, 0.12, -0.08), (220.0, 0.055, 0.10)]):
        slow = 1 + 0.08 * np.sin(TAU * (0.043 + idx * 0.011) * t + idx)
        mono = g * slow * np.sin(TAU * f * t + idx * 0.7)
        gl, gr = pan_gains(pan)
        y[:, 0] += mono * gl
        y[:, 1] += mono * gr
    air = lowpass(noise(N, 12), 220) * 0.035
    y[:, 0] += air
    y[:, 1] += air * 0.86
    # sparse tanpura-like plucks, very low in the bed
    for k, at in enumerate(np.arange(0.4, DUR, 3.8)):
        for j, f in enumerate([110.0, 164.81, 220.0, 110.0]):
            add(y, pluck(f, 2.2, 100 + k * 7 + j), at + j * 0.42, -0.25 + j * 0.16, 0.018)
    fade_time = int(2.5 * SR)
    y[:fade_time] *= np.linspace(0, 1, fade_time)[:, None]
    y[-fade_time:] *= np.linspace(1, 0, fade_time)[:, None]
    return y * 0.12


WORDS = clock.get("words", [])

def line_a(line):
    xs = [w.get("fa", 0) for w in WORDS if w.get("l") == line]
    return min(xs) if xs else 0

def line_b(line):
    xs = [w.get("fb", 0) for w in WORDS if w.get("l") == line]
    return max(xs) if xs else TOTAL

def line_m(line):
    return int((line_a(line) + line_b(line)) / 2)

def word_f(line, prefix, default=None):
    for w in WORDS:
        if w.get("l") == line and str(w.get("w", "")).startswith(prefix):
            return w.get("fa", line_a(line))
    return line_a(line) if default is None else default


def stem_percussion():
    y = np.zeros((N, 2), np.float32)
    # restrained solar pulse, denser through the demand and donation sections
    pulse_regions = [(0, DUR, 0.028), (sec(line_a(7)), sec(line_b(10)), 0.052), (sec(line_a(3)), sec(line_b(3)), 0.042)]
    for start, end, gain in pulse_regions:
        t = start + 0.22
        k = 0
        while t < end:
            add(y, membrane(92, 0.58, 400 + k), t, -0.12, gain)
            add(y, membrane(150, 0.34, 700 + k, True), t + 0.72, 0.16, gain * 0.42)
            if k % 2:
                add(y, membrane(118, 0.42, 900 + k), t + 1.18, 0.05, gain * 0.28)
            t += 1.92
            k += 1
    return y

def stem_flute():
    y = np.zeros((N, 2), np.float32)
    # Surya's warning motif: warm, sparse and restrained
    a5 = line_a(5)
    for k, (off, f, d) in enumerate([(4, 293.66, 1.2), (28, 349.23, 1.0), (52, 392.0, 1.3), (88, 349.23, 1.0), (112, 293.66, 1.5)]):
        add(y, flute_note(f, d, 100 + k), sec(a5 + off), -0.16, 0.075)
    # final danveer reveal: a noble, quiet flute answer
    a12 = line_a(12)
    for k, (off, f, d) in enumerate([(2, 440.0, 1.2), (28, 523.25, 1.1), (54, 493.88, 0.9), (74, 440.0, 1.4), (104, 392.0, 1.0), (128, 440.0, 1.8)]):
        add(y, flute_note(f, d, 150 + k), sec(a12 + off), 0.12 if k % 2 else -0.12, 0.16)
    return y

def stem_bells():
    y = np.zeros((N, 2), np.float32)
    # sun/dawn bells, sparse and devotional
    for k, (fr, fq, g) in enumerate([
        (line_a(1), 660, 0.035), (line_a(5), 760, 0.045), (line_a(7), 880, 0.055),
        (word_f(9, "कवच", line_m(9)), 990, 0.07), (line_a(10), 1120, 0.06), (line_a(12), 880, 0.10),
    ]):
        add(y, bell(fq, 3.0, 90 + k), sec(fr), -0.18 + 0.12 * (k % 3), g)
    return y

def stem_sfx():
    y = np.zeros((N, 2), np.float32)
    # arrow shatters on the divine kavach
    hit3 = word_f(3, "अर्जुन", line_m(3))
    add(y, whoosh(0.55, 200, True), sec(hit3 - 8), -0.15, 0.11)
    add(y, deep_hit(0.9, 201), sec(hit3), 0.0, 0.23)
    add(y, bell(1240, 1.2, 202), sec(hit3 + 2), 0.18, 0.045)
    # Indra thunder and watchful presence
    indra = line_a(4)
    add(y, deep_hit(1.6, 300), sec(indra + 8), 0.0, 0.34)
    add(y, whoosh(1.0, 301), sec(indra + 10), -0.1, 0.11)
    # Surya's warning shimmer
    for k, fr in enumerate([line_a(5), line_a(5) + 38]):
        add(y, shimmer(1.8, 400 + k), sec(fr), 0.1, 0.065)
    # dawn water offering: bright airy movement, kept subtle under speech
    dawn = line_a(7)
    add(y, shimmer(1.5, 500), sec(dawn), -0.1, 0.045)
    add(y, whoosh(0.8, 501), sec(dawn + 40), 0.1, 0.055)
    # kavach leaving the body: golden air then a clean deep hit
    gift = word_f(9, "कवच", line_m(9))
    add(y, whoosh(1.0, 600, True), sec(gift - 5), 0.0, 0.15)
    add(y, deep_hit(1.3, 601), sec(gift + 4), 0.0, 0.38)
    # amogh shakti reveal
    shakti = word_f(10, "शक्ति", line_m(10))
    add(y, shimmer(2.2, 700), sec(shakti), 0.15, 0.09)
    add(y, bell(1320, 2.4, 701), sec(shakti + 5), 0.0, 0.07)
    # final title warm hit
    final = word_f(12, "दानवीर", line_m(12))
    add(y, deep_hit(1.4, 800), sec(final), 0.0, 0.26)
    return y


def smoothstep(x):
    return x * x * (3 - 2 * x)


def duck_curve():
    # music is present in gaps but recessed 11-13 dB beneath speech
    g = np.ones(N, dtype=np.float32) * 0.78
    for p in clock["phrases"]:
        a = max(0, int((p["a"] - 0.12) * SR))
        b = min(N, int((p["b"] + 0.20) * SR))
        g[a:b] = np.minimum(g[a:b], 0.22)
    hop = 240
    gg = g[::hop]
    out = np.empty_like(gg)
    aa = np.exp(-hop / (0.055 * SR))
    rr = np.exp(-hop / (0.42 * SR))
    v = gg[0]
    for i, target in enumerate(gg):
        coef = aa if target < v else rr
        v = coef * v + (1 - coef) * target
        out[i] = v
    return np.repeat(out, hop)[:N]


def main():
    vo, sr = sf.read(EP / "audio/vo/vo.wav", dtype="float32", always_2d=True)
    if sr != SR:
        raise RuntimeError(f"voice sample rate {sr}, expected {SR}")
    dia = np.zeros((N, 2), np.float32)
    n = min(N, len(vo))
    dia[:n] = vo[:n]

    stems = {
        "drone": stem_drone(),
        "percussion": stem_percussion(),
        "flute": stem_flute(),
        "bells": stem_bells(),
        "sfx": stem_sfx(),
    }
    for name, stem in stems.items():
        sf.write(OUT / f"{name}.wav", stem, SR, subtype="FLOAT")

    score = sum(stems.values())
    duck = duck_curve()
    bed = score * duck[:, None]
    mix = dia + bed

    # gentle glue limiting: soft-knee tanh only where the sum gets hot
    peak = float(np.max(np.abs(mix)))
    if peak > 0.86:
        over = np.abs(mix) > 0.72
        mix[over] = np.sign(mix[over]) * (0.72 + 0.28 * np.tanh((np.abs(mix[over]) - 0.72) / 0.28))
    sf.write(OUT / "premaster.wav", mix, SR, subtype="FLOAT")
    sf.write(EP / "audio/mix.wav", mix, SR, subtype="FLOAT")

    # final master: EBU R128 -14 LUFS, true peak ceiling -1.5 dBFS
    final = OUT / "mix_master.wav"
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(OUT / "premaster.wav"),
        "-af", "loudnorm=I=-14:TP=-1.5:LRA=9",
        "-ar", "48000", "-c:a", "pcm_f32le", str(final),
    ], check=True)
    subprocess.run(["cp", str(final), str(EP / "audio/mix_final.wav")], check=True)
    print(f"wrote {final} ({DUR:.2f}s)")


if __name__ == "__main__":
    main()
