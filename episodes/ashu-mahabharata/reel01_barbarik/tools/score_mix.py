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


def stem_percussion():
    y = np.zeros((N, 2), np.float32)
    # slow damru/tabla cycle, slightly denser under the scale paradox and battle-watch sections
    pulse_regions = [(0, DUR, 0.032), (sec(1199), sec(1403), 0.055), (sec(1960), sec(2169), 0.045)]
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
    # memory motif: soft, sparse, almost a half-remembered lullaby
    memory = [(1048, 293.66, 1.3), (1066, 349.23, 1.0), (1084, 392.0, 1.2), (1118, 349.23, 1.0), (1132, 293.66, 1.7)]
    for fr, f, d in memory:
        add(y, flute_note(f, d, fr), sec(fr), -0.18, 0.09)
    # ending: soft devotional flute answering the shrine reveal
    ending = [
        (2178, 440.0, 1.25), (2200, 523.25, 1.2), (2228, 493.88, 0.9), (2244, 440.0, 1.35),
        (2268, 392.0, 1.0), (2288, 440.0, 1.5), (2318, 523.25, 1.8), (2342, 440.0, 2.0),
    ]
    for fr, f, d in ending:
        add(y, flute_note(f, d, fr), sec(fr), 0.12 if fr % 2 else -0.12, 0.18)
    return y


def stem_bells():
    y = np.zeros((N, 2), np.float32)
    # Shiva / boon bells, restrained
    for k, fr in enumerate([424, 486, 548]):
        add(y, bell(660 + k * 110, 2.6, 30 + k), sec(fr), -0.22 + k * 0.2, 0.045)
    # shrine bells and final reveal
    for k, (fr, f, g) in enumerate([(2178, 880, 0.12), (2218, 990, 0.075), (2254, 1320, 0.065), (2316, 880, 0.12), (2348, 660, 0.10)]):
        add(y, bell(f, 3.4, 90 + k), sec(fr), -0.18 + 0.12 * (k % 3), g)
    return y


def stem_sfx():
    y = np.zeros((N, 2), np.float32)
    # arrows lighting one by one
    for k, fr in enumerate([493, 530, 570]):
        add(y, whoosh(0.52, 200 + k, True), sec(fr - 4), -0.2 + k * 0.2, 0.12)
        add(y, bell(980 + k * 160, 1.3, 210 + k), sec(fr), -0.2 + k * 0.2, 0.055)
    # deep hit exactly on Barbarik's "एक पल" and a softer echo after it
    add(y, deep_hit(1.5, 300), sec(1009), 0.0, 0.72)
    add(y, deep_hit(1.0, 301), sec(1030), 0.0, 0.16)
    # golden scale tipping: metallic-air movement, not a literal creak sample
    for k, fr in enumerate([1218, 1286, 1354]):
        add(y, whoosh(0.72, 350 + k), sec(fr), -0.1 + 0.1 * k, 0.10)
        add(y, bell(520 + k * 55, 1.6, 360 + k), sec(fr + 5), 0.05, 0.035)
    # Krishna's divine interventions
    for k, fr in enumerate([184, 728, 1691]):
        add(y, shimmer(1.8, 500 + k), sec(fr), 0.15, 0.075)
    # white flash at the sacrifice: bright air plus a deep, clean hit
    add(y, whoosh(0.9, 600, True), sec(1805), 0.0, 0.16)
    add(y, deep_hit(1.2, 601), sec(1808), 0.0, 0.44)
    # hilltop battle below: distant arrow air and low pulses
    for k, fr in enumerate([1995, 2048, 2102, 2150]):
        add(y, whoosh(0.7, 700 + k), sec(fr), -0.25 + 0.16 * (k % 4), 0.045)
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
