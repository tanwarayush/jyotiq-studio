"""Prepare the Barbarik reel voice clock.
Trims takes, compresses long silence gaps while keeping dramatic pauses, lays segments end to end,
applies the minimum tempo needed for the 70-80 s reel target, and writes vo.wav + timing.ts.
Run: /Users/ayushrajput/earshot/.venv/bin/python tools/vo_prep.py
"""
import json
import os
import subprocess
import unicodedata
import wave
from pathlib import Path

import numpy as np

EP = Path(__file__).resolve().parent.parent
TS = Path("/Users/ayushrajput/Documents/Codex/2026-09-11/act-as-a-senior-brand-identity/outputs/jyotiq-studio/video/src/Ashuanimates/karna/timing.ts")
FFMPEG = "/opt/homebrew/bin/ffmpeg"
SR = 48000
FPS = 30
VO_START_FR = 4
END_HOLD_FR = 60
GAP_INNER = 0.14
GAP_LINE = 0.24
GAP_DRAMATIC = 0.42
PAUSE_CAP = 0.45
TARGET_VOICE_END = 66.0

with open(EP / "audio/voice_manifest.json", encoding="utf-8") as f:
    MANIFEST = json.load(f)
SEGMENTS = MANIFEST["segments"]
RAW_WORDS = json.loads((EP / "audio/stt/words_raw.json").read_text(encoding="utf-8"))


def norm(s):
    s = unicodedata.normalize("NFC", s)
    return "".join(ch for ch in s if "\u0900" <= ch <= "\u097F")


def lev(a, b):
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        nd = [i] + [0] * len(b)
        for j, cb in enumerate(b, 1):
            nd[j] = min(nd[j - 1] + 1, d[j] + 1, d[j - 1] + (ca != cb))
        d = nd
    return d[-1] / max(1, len(a), len(b))


def caption_words(text):
    return [w for w in text.replace('"', '').split() if norm(w)]


def align(script, ws):
    sw = caption_words(script)
    nw = [norm(x[2]) for x in ws]
    ns = [norm(x) for x in sw]
    n, m = len(sw), len(ws)
    inf = 999.0
    dp = [[inf] * (m + 1) for _ in range(n + 1)]
    par = [[None] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 0.0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            for k in range(1, min(4, j) + 1):
                if dp[i - 1][j - k] >= inf:
                    continue
                cat = "".join(nw[j - k:j])
                cost = lev(ns[i - 1], cat) + 0.04 * (k - 1)
                val = dp[i - 1][j - k] + cost
                if val < dp[i][j]:
                    dp[i][j] = val
                    par[i][j] = (j - k, k)
    if not n or dp[n][m] >= inf:
        return []
    out = []
    i, j = n, m
    while i:
        p = par[i][j]
        if not p:
            return []
        jj, k = p
        out.append({"w": sw[i - 1], "a": ws[jj][0], "b": ws[j - 1][1]})
        i -= 1
        j = jj
    out.reverse()
    for i, w in enumerate(out):
        chars = max(2, len(norm(w["w"])))
        est = 0.12 + 0.052 * chars
        width = w["b"] - w["a"]
        if width > est * 1.45:
            w["a"] = max((out[i - 1]["b"] if i else 0.0), w["b"] - est * 1.25)
        if w["b"] - w["a"] < 0.1:
            w["b"] = w["a"] + 0.1
    return out


def load(mp3):
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", str(mp3), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def env_db(x, hop=0.01):
    m = x.mean(axis=1)
    h = int(hop * SR)
    n = len(m) // h
    r = np.sqrt(np.mean(m[: n * h].reshape(n, h) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(r / (np.max(r) + 1e-12)), h


def speech_runs(x, thr=-34.0, min_sil=0.06):
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
    return [r for r in merged if r[1] - r[0] > 0.04]


def write_wav(path, y):
    y16 = (np.clip(y, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(y16.tobytes())


def main():
    pieces = []
    phrase_rows = []
    word_rows = []
    t = 0.0
    fade_n = int(0.006 * SR)
    total_cuts = 0.0
    for si, seg in enumerate(SEGMENTS):
        code = seg["code"]
        who = seg["who"]
        line = seg["line"]
        text = seg["spoken"]
        x = load(EP / seg["file"])
        rs = speech_runs(x)
        if not rs:
            raise SystemExit(f"no speech in {code}")
        trim_a = max(0.0, rs[0][0] - 0.04)
        trim_b = min(len(x) / SR, rs[-1][1] + 0.08)
        removals = []
        for r0, r1 in zip(rs, rs[1:]):
            gap = r1[0] - r0[1]
            if gap > PAUSE_CAP:
                keep_head = min(0.27, gap * 0.58)
                keep_tail = PAUSE_CAP - keep_head
                cut_a = r0[1] + keep_head
                cut_b = r1[0] - keep_tail
                if cut_b > cut_a:
                    removals.append((cut_a, cut_b))
        def mapped(tm):
            cut = 0.0
            for a, b in removals:
                if tm >= b:
                    cut += b - a
                elif tm > a:
                    cut += tm - a
            return tm - cut - trim_a
        keep = []
        pos = trim_a
        for a, b in removals:
            if a > pos:
                keep.append((pos, a))
            pos = max(pos, b)
        if trim_b > pos:
            keep.append((pos, trim_b))
        clip_parts = []
        for a, b in keep:
            part = x[int(a * SR):int(b * SR)].copy()
            if len(part) > fade_n * 2:
                part[:fade_n] *= np.linspace(0, 1, fade_n)[:, None]
                part[-fade_n:] *= np.linspace(1, 0, fade_n)[:, None]
            clip_parts.append(part)
        clip = np.concatenate(clip_parts) if clip_parts else np.zeros((1, 2), np.float32)
        start = t + max(0.0, mapped(rs[0][0]))
        pieces.append(clip)
        dur = len(clip) / SR
        t += dur
        phrase_rows.append({"a": start, "b": start + mapped(rs[-1][1]), "l": line, "who": who, "text": text, "code": code})
        for w in align(text, RAW_WORDS.get(code, [])):
            aa, bb = mapped(w["a"]), mapped(w["b"])
            if bb > aa:
                word_rows.append({"w": w["w"], "a": start + aa - mapped(rs[0][0]), "b": start + bb - mapped(rs[0][0]), "l": line, "p": len(phrase_rows) - 1, "who": who})
        total_cuts += sum(b - a for a, b in removals)
        prev_same_line = si + 1 < len(SEGMENTS) and SEGMENTS[si + 1]["line"] == line
        if code in ("07b", "08a"):
            gap = GAP_DRAMATIC
        elif prev_same_line:
            gap = GAP_INNER
        else:
            gap = GAP_LINE
        pieces.append(np.zeros((int(gap * SR), 2), np.float32))
        t += gap
    y = np.concatenate(pieces)
    base = len(y) / SR
    tempo = 1.0
    if base > TARGET_VOICE_END:
        tempo = min(1.13, base / TARGET_VOICE_END)
    if abs(tempo - 1) > 0.005:
        out = subprocess.run(
            [FFMPEG, "-v", "error", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-af", f"atempo={tempo:.5f}", "-f", "f32le", "-"],
            input=y.astype(np.float32).tobytes(), capture_output=True, check=True,
        ).stdout
        y = np.frombuffer(out, np.float32).reshape(-1, 2).copy()
        for row in phrase_rows + word_rows:
            row["a"] /= tempo
            row["b"] /= tempo
    peak = float(np.max(np.abs(y))) or 1.0
    y = y / peak * 0.72
    write_wav(EP / "audio/vo/vo.wav", y)
    voice_end = len(y) / SR
    off = VO_START_FR / FPS - min(p["a"] for p in phrase_rows)
    fr = lambda s: int(round((s + off) * FPS))  # noqa: E731
    total = fr(max(p["b"] for p in phrase_rows)) + END_HOLD_FR
    lines = []
    for line in sorted({p["l"] for p in phrase_rows}):
        rows = [p for p in phrase_rows if p["l"] == line]
        lines.append({"l": line, "a": fr(min(p["a"] for p in rows)), "b": fr(max(p["b"] for p in rows))})
    mono = np.abs(y).mean(axis=1)
    hop = SR // FPS
    nfr = len(mono) // hop
    env = np.sqrt(np.mean(mono[: nfr * hop].reshape(nfr, hop) ** 2, axis=1))
    env = np.clip(env / (np.percentile(env[env > 0.01], 95) + 1e-9), 0, 1)
    lead = int(round(off * FPS))
    reel_env = np.zeros(total)
    for i, v in enumerate(env):
        j = i + lead
        if 0 <= j < total:
            reel_env[j] = float(v)
    for row in word_rows:
        row["fa"] = fr(row["a"])
        row["fb"] = fr(row["b"])
    clock = {
        "tempo": tempo,
        "base_voice_seconds_before_tempo": base,
        "voice_seconds": voice_end,
        "total_frames": total,
        "removed_pause_seconds": total_cuts,
        "phrases": phrase_rows,
        "words": word_rows,
    }
    (EP / "audio/vo/clock.json").write_text(json.dumps(clock, ensure_ascii=False, indent=1), encoding="utf-8")
    TS.parent.mkdir(parents=True, exist_ok=True)
    ts = [
        "// Generated by ashuanimates reel02_karna/tools/vo_prep.py. Do not edit by hand.",
        f"export const FPS = {FPS};",
        f"export const TOTAL = {total};",
        "export type Word = { w: string; a: number; b: number; l: number; p: number; who: string };",
        "export const WORDS: Word[] = [",
    ]
    ts += [f"  {{ w: {json.dumps(w['w'], ensure_ascii=False)}, a: {w['fa']}, b: {w['fb']}, l: {w['l']}, p: {w['p']}, who: {json.dumps(w['who'])} }}," for w in word_rows]
    ts += ["];", "export const PHRASES: { a: number; b: number; l: number; who: string; text: string; code: string }[] = ["]
    ts += [f"  {{ a: {fr(p['a'])}, b: {fr(p['b'])}, l: {p['l']}, who: {json.dumps(p['who'])}, text: {json.dumps(p['text'], ensure_ascii=False)}, code: {json.dumps(p['code'])} }}," for p in phrase_rows]
    ts += ["];", "export const LINES: { l: number; a: number; b: number }[] = ["]
    ts += [f"  {{ l: {r['l']}, a: {r['a']}, b: {r['b']} }}," for r in lines]
    ts += ["];", "export const ENV: number[] = [" + ",".join(f"{v:.2f}".rstrip("0").rstrip(".") if v else "0" for v in reel_env) + "];"]
    TS.write_text("\n".join(ts) + "\n", encoding="utf-8")
    print(f"base {base:.2f}s voice {voice_end:.2f}s tempo {tempo:.3f} removed_pauses {total_cuts:.2f}s total {total}fr/{total/FPS:.2f}s")
    for p in phrase_rows:
        print(f"{p['code']} L{p['l']:02d} {fr(p['a']):4d}-{fr(p['b']):4d} {p['who']} {p['text']}")


if __name__ == "__main__":
    main()
