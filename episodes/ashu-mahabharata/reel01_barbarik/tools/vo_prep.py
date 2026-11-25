"""भारत Ep6 VO prep (copied from Ep5): take the picked take of every script line (audio/vo/picked.json), find its speech runs, split each line into
the phrases listed in tools/lines.py (cutting at the N-1 longest inner silences), level every take to Kaal's speech RMS, lay the
phrases end to end with the listed gaps and silent beats, apply TEMPO, and write
    audio/vo/vo.wav, audio/vo/clock.json, video/src/Jyotiq/bharata/ep6/timing.ts
Replayed phrases (lines 1–2 after line 7) reuse the cold-open audio.
Run: /Users/ayushrajput/earshot/.venv/bin/python tools/vo_prep.py"""
import json
import os
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lines import SEQ  # noqa: E402

EP = Path(__file__).resolve().parent.parent
TS = Path("/Users/ayushrajput/.kiro/crew/workspace/video/src/Jyotiq/bharata/ep6/timing.ts")
FFMPEG = "/opt/homebrew/bin/ffmpeg"
SR = 48000
FPS = 30
VO_START = 4
END_HOLD = 110
PAD_A, PAD_B = 0.03, 0.08
TEMPO = float(os.environ.get("TEMPO", "1.0"))


def load(name):
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", str(EP / "audio/vo" / name), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def env_db(x, hop=0.01):
    m = x.mean(axis=1)
    h = int(hop * SR)
    n = len(m) // h
    r = np.sqrt(np.mean(m[: n * h].reshape(n, h) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(r / (np.max(r) + 1e-12)), h


def runs(x, thr=-36.0, min_sil=0.09):
    """Speech runs [(a, b)] in seconds: regions above thr, joined across silences shorter than min_sil."""
    db, h = env_db(x)
    loud = db > thr
    out, i, n = [], 0, len(loud)
    while i < n:
        if loud[i]:
            j = i
            while j < n and loud[j]:
                j += 1
            out.append([i * h / SR, j * h / SR])
            i = j
        else:
            i += 1
    merged = []
    for a, b in out:
        if merged and a - merged[-1][1] < min_sil:
            merged[-1][1] = b
        else:
            merged.append([a, b])
    return [r for r in merged if r[1] - r[0] > 0.06]


def split(x, n):
    """Split a take into n phrases at its n-1 longest inner silences; returns [(a, b)] in seconds."""
    rs = runs(x)
    if not rs:
        raise SystemExit("no speech found")
    if n == 1:
        return [(rs[0][0], rs[-1][1])]
    gaps = sorted(range(len(rs) - 1), key=lambda i: rs[i + 1][0] - rs[i][1], reverse=True)[: n - 1]
    if len(gaps) < n - 1:
        raise SystemExit(f"take has only {len(rs)} speech runs, need {n}")
    cuts = sorted(gaps)
    out, s = [], 0
    for c in cuts:
        out.append((rs[s][0], rs[c][1]))
        s = c + 1
    out.append((rs[s][0], rs[-1][1]))
    return out


def _clean(s):
    return "".join(ch for ch in s if "\u0900" <= ch <= "\u097F" and ch not in "।॥")


def split_words(x, ws, texts):
    """Cut a take into its phrases at Whisper word boundaries: the boundary is where the heard letters reach the same share of
    the line as the script's letters before that phrase; the cut snaps to the quietest 20 ms point within -0.30..+0.15 s.
    Each piece is then trimmed to its own speech."""
    db, h = env_db(x)
    lens = [len(_clean(tx)) for tx in texts]
    heard = [len(_clean(w[2])) or 1 for w in ws]
    tot_h = sum(heard)
    cuts = []
    for k in range(1, len(texts)):
        share = sum(lens[:k]) / sum(lens)
        acc, j = 0, 0
        while j < len(ws) and (acc + heard[j] / 2) / tot_h <= share:
            acc += heard[j]
            j += 1
        t0 = ws[min(j, len(ws) - 1)][0]
        rs = runs(x)
        gaps = [((rs[i][1] + rs[i + 1][0]) / 2, rs[i + 1][0] - rs[i][1]) for i in range(len(rs) - 1)]
        gaps = [g for g in gaps if g[1] >= 0.07 and all(abs(g[0] - c) > 0.2 for c in cuts)]
        near = min(gaps, key=lambda g: abs(g[0] - t0), default=None)
        if near and abs(near[0] - t0) < 1.1:
            cuts.append(near[0])
            continue
        i0, i1 = max(0, int((t0 - 0.30) * SR / h)), min(len(db) - 2, int((t0 + 0.15) * SR / h))
        sm = [(db[i] + db[i + 1]) / 2 for i in range(i0, i1)]
        cuts.append((i0 + int(np.argmin(sm)) + 1) * h / SR)
    edges = [0.0] + cuts + [len(x) / SR]
    out = []
    for a, b in zip(edges[:-1], edges[1:]):
        rs = [r for r in runs(x[int(a * SR): int(b * SR)])]
        out.append((a + rs[0][0], a + rs[-1][1]) if rs else (a, b))
    return out


def act_rms(z):
    m = np.abs(z).mean(axis=1)
    return float(np.sqrt(np.mean(m[m > 0.02] ** 2)))


def main():
    picked = json.loads((EP / "audio/vo/picked.json").read_text())
    # phrases per line (first occurrence only; replays reuse)
    per_line, order = {}, []
    for e in SEQ:
        if e[0] == "beat":
            continue
        who, l, text, _ = e
        key = f"{who}_{l}"
        per_line.setdefault(key, [])
        if text not in per_line[key]:
            per_line[key].append(text)
    src, segs = {}, {}
    for key, texts in per_line.items():
        x = load(picked[key]["file"])
        src[key] = x
        wj = json.loads((EP / "audio/vo/words.json").read_text()) if (EP / "audio/vo/words.json").exists() else {}
        sp = split_words(x, wj[key], texts) if (len(texts) > 1 and key in wj) else split(x, len(texts))
        segs[key] = dict(zip(texts, sp))
        print(key, " | ".join(f"{tx[:14]} {a:.2f}-{b:.2f}" for tx, (a, b) in zip(texts, sp)))
    ref = act_rms(src["kaal_5"])
    for key in src:
        if not key.startswith("kaal"):
            src[key] = src[key] * (ref / act_rms(src[key]))
    fade = int(0.008 * SR)
    pieces, phrases, beats, t = [], [], [], 0.0
    for e in SEQ:
        if e[0] == "beat":
            beats.append({"name": e[2], "a": t, "b": t + e[1]})
            pieces.append(np.zeros((int(e[1] * SR), 2), np.float32))
            t += e[1]
            continue
        who, li, text, gap = e
        key = f"{who}_{li}"
        a, b = segs[key][text]
        x = src[key]
        ca = max(0.0, a - PAD_A)
        cb = min(len(x) / SR, b + PAD_B)
        clip = x[int(ca * SR): int(cb * SR)].copy()
        clip[:fade] *= np.linspace(0, 1, fade)[:, None]
        clip[-fade:] *= np.linspace(1, 0, fade)[:, None]
        start = t + (a - ca)
        pieces.append(clip)
        t += len(clip) / SR
        phrases.append({"a": start, "b": start + (b - a), "l": li, "who": who, "text": text})
        sil = max(0.0, gap - PAD_A - PAD_B)
        if sil:
            pieces.append(np.zeros((int(sil * SR), 2), np.float32))
            t += sil
    y = np.concatenate(pieces)
    if abs(TEMPO - 1) > 1e-3:
        y = subprocess.run([FFMPEG, "-v", "error", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-af", f"atempo={TEMPO}", "-f", "f32le", "-"],
                           input=y.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
        y = np.frombuffer(y, np.float32).reshape(-1, 2).copy()
        for r in phrases + beats:
            r["a"] /= TEMPO
            r["b"] /= TEMPO
    y = y / max(1e-6, float(np.max(np.abs(y)))) * 0.708

    words = []
    for pi, ph in enumerate(phrases):
        ws = ph["text"].split()
        ln = [max(1, len(w.strip("…,।?!"))) for w in ws]
        u = ph["a"]
        for w, n in zip(ws, ln):
            d = (ph["b"] - ph["a"]) * n / sum(ln)
            words.append({"w": w, "a": u, "b": u + d, "l": ph["l"], "p": pi})
            u += d

    out_dir = EP / "audio/vo"
    with wave.open(str(out_dir / "vo.wav"), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(3)
        wf.setframerate(SR)
        ints = (np.clip(y, -1, 1) * 8388607).astype("<i4").tobytes()
        wf.writeframes(b"".join(ints[i:i + 3] for i in range(0, len(ints), 4)))

    off = VO_START / FPS - phrases[0]["a"]
    fr = lambda s: int(round((s + off) * FPS))  # noqa: E731
    total = fr(phrases[-1]["b"]) + END_HOLD
    m = np.abs(y).mean(axis=1)
    hop = SR // FPS
    nfr = len(m) // hop
    env = np.sqrt(np.mean(m[: nfr * hop].reshape(nfr, hop) ** 2, axis=1))
    env = np.clip(env / (np.percentile(env[env > 0.01], 95) + 1e-9), 0, 1)
    lead = int(round(off * FPS))
    reel_env = np.zeros(total)
    for i in range(nfr):
        j = i + lead
        if 0 <= j < total:
            reel_env[j] = env[i]
    clock = {"vo_offset_s": round(off, 3), "total": total, "tempo": TEMPO,
             "phrases": [{**p, "fa": fr(p["a"]), "fb": fr(p["b"])} for p in phrases],
             "beats": [{**b, "fa": fr(b["a"]), "fb": fr(b["b"])} for b in beats],
             "words": [{**w, "fa": fr(w["a"]), "fb": fr(w["b"])} for w in words]}
    (out_dir / "clock.json").write_text(json.dumps(clock, ensure_ascii=False, indent=1))
    ts = ["// Generated by mahabharat-ep6/tools/vo_prep.py. Do not edit by hand.", f"export const FPS = {FPS};", f"export const VO_OFFSET = {round(off * FPS, 3)};", f"export const TOTAL = {total};",
          "export type Word = { w: string; a: number; b: number; l: number; p: number };", "export const WORDS: Word[] = ["]
    ts += [f'  {{ w: {json.dumps(w["w"], ensure_ascii=False)}, a: {fr(w["a"])}, b: {fr(w["b"])}, l: {w["l"]}, p: {w["p"]} }},' for w in words]
    ts += ["];", "export const PHRASES: { a: number; b: number; l: number; who: string }[] = ["]
    ts += [f"  {{ a: {fr(p['a'])}, b: {fr(p['b'])}, l: {p['l']}, who: \"{p['who']}\" }}, // {p['text']}" for p in phrases]
    ts += ["];", "export const BEATS: Record<string, [number, number]> = {"] + [f"  {b['name']}: [{fr(b['a'])}, {fr(b['b'])}]," for b in beats] + ["};"]
    ts += ["/** Mouth envelope per reel frame (0..1), from vo.wav. */", "export const ENV: number[] = [" + ",".join(f"{v:.2f}".rstrip("0").rstrip(".") if v else "0" for v in reel_env) + "];"]
    TS.write_text("\n".join(ts) + "\n")
    print(f"vo {len(y) / SR:.2f}s offset {off:.3f}s tempo {TEMPO}")
    for i, p in enumerate(phrases):
        print(f"P{i:2d} L{p['l']:2d} {fr(p['a']):5d}-{fr(p['b']):5d} {p['who']:9s} {p['text']}")
    for b in beats:
        print("beat", b["name"], fr(b["a"]), fr(b["b"]))
    print("TOTAL", total, f"({total / FPS:.2f} s)")


if __name__ == "__main__":
    main()
