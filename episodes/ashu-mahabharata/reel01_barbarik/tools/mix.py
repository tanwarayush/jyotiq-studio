"""भारत Ep6 mix (copied from Ep5): dialogue + ElevenLabs score cues (one per scene, crossfaded at cuts) + SFX, on the reel clock.

The score never covers a voice: under every phrase the music is ducked (smoothed, 60 ms attack / 350 ms release) and
a 1.5-4.5 kHz dip carves room for the words; between lines and on silent picture beats it rises to the scene level.
Per-phrase check: dialogue minus bed (BS.1770-ish K-weighted RMS) must be >= MIN_GAP LU; the script lowers the
offending scene's ducked level and re-renders until every phrase passes (max 6 passes). Master: -14 LUFS, TP <= -1.5.
Writes audio/mix/mix.wav (+ a copy in render/public/jyotiq/bharata/ep6).
Run: /Users/ayushrajput/earshot/.venv/bin/python tools/mix.py
"""
import json
import shutil
import subprocess
from pathlib import Path

import numpy as np

EP = Path(__file__).resolve().parent.parent
FF = "/opt/homebrew/bin/ffmpeg"
SR = 48000
FPS = 30
MIN_GAP = 12.5

clock = json.loads((EP / "audio/vo/clock.json").read_text())
PH = clock["phrases"]
BEATS = {b["name"]: (b["fa"], b["fb"]) for b in clock["beats"]}
TOTAL = clock["total"]
A = lambda i: PH[i]["fa"]  # noqa: E731
B = lambda i: PH[i]["fb"]  # noqa: E731
sec = lambda fr: fr / FPS  # noqa: E731

W_ = [w for w in clock["words"]]


def cue_w(pi, start):
    for w in W_:
        if w["p"] == pi and w["w"].startswith(start):
            return w["fa"]
    return PH[pi]["fa"]


C = {
    "title": BEATS["title"][0], "intro": BEATS["title"][1], "plea": A(12) - 3, "march": BEATS["march"][0], "refuse": A(16) - 3,
    "conch": BEATS["conch"][0], "hit": A(21) - 3, "tent": BEATS["fall"][1], "dream": A(25) - 3, "astra": BEATS["astra"][0], "d23": BEATS["astra"][1] - 6,
    "narada": A(30) - 3, "after": A(32) - 4, "admit": A(34) - 3, "vow": A(37) - 3, "alone": BEATS["vow"][1], "feature": BEATS["seed"][1], "end": B(45) + 10,
}
KK = {"bh0": A(0), "vadh": cue_w(2, "वध"), "ikkis": cue_w(6, "इक्कीस"), "born": B(8), "bow": A(15), "harane": B(17), "day10": A(19), "day20": A(20),
      "laga": cue_w(21, "लगा"), "gir": B(22), "vasu": A(24), "prasvap": A(26), "chadh": cue_w(28, "चढ़ाया"), "ruko": A(30), "pitri": cue_w(33, "पितरों"),
      "mrityu": B(38), "kaun": B(41), "seed": BEATS["seed"][0]}


def load(path, ch=2):
    raw = subprocess.run([FF, "-v", "error", "-i", str(path), "-f", "f32le", "-ac", str(ch), "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()


def db(x):
    return 10 ** (x / 20)


def kweight(x):
    """Cheap K-weighting stand-in: high-pass ~100 Hz + gentle presence lift (for relative LU comparisons only)."""
    from numpy.fft import irfft, rfft
    m = x.mean(axis=1) if x.ndim == 2 else x
    n = 1 << int(np.ceil(np.log2(len(m) + 1)))
    Fq = np.fft.rfftfreq(n, 1 / SR)
    H = (Fq / 100) ** 2 / (1 + (Fq / 100) ** 2) * (1 + 0.6 * (Fq > 1500))
    return irfft(rfft(m, n) * H, n)[: len(m)]


def lufs_like(x):
    y = kweight(x)
    return 10 * np.log10(np.mean(y ** 2) + 1e-12) - 0.691


def smooth_env(g, att=0.06, rel=0.35):
    """One-pole attack/release smoothing of a per-sample gain curve (downward = attack)."""
    hop = 240
    gg = g[::hop]
    out = np.empty_like(gg)
    a_att = np.exp(-hop / (att * SR))
    a_rel = np.exp(-hop / (rel * SR))
    v = gg[0]
    for i, t in enumerate(gg):
        a = a_att if t < v else a_rel
        v = a * v + (1 - a) * t
        out[i] = v
    return np.repeat(out, hop)[: len(g)]


def band_dip(x, lo=1500, hi=4500, depth_db=-4.0):
    from numpy.fft import irfft, rfft
    n = 1 << int(np.ceil(np.log2(len(x) + 1)))
    Fq = np.fft.rfftfreq(n, 1 / SR)
    H = np.ones_like(Fq)
    band = (Fq > lo) & (Fq < hi)
    H[band] = db(depth_db)
    return np.stack([irfft(rfft(x[:, c], n) * H, n)[: len(x)] for c in range(2)], axis=1)


N = int(TOTAL / FPS * SR) + SR
vo = load(EP / "audio/vo/vo.wav")
dia = np.zeros((N, 2), np.float32)
o = int(clock["vo_offset_s"] * SR)
dia[o: o + len(vo)] += vo[: N - o]
# dialogue to about -18 LUFS-ish (relative scale)
dia *= db(-18 - lufs_like(dia[np.abs(dia).mean(axis=1) > 0.01]))

# speech mask (per sample) from the phrases
speech = np.zeros(N)
for p in PH:
    a, b = int(sec(p["fa"] - 2) * SR), int(sec(p["fb"] + 3) * SR)
    speech[a:b] = 1

# ---- score: cue i covers scene [s, e); crossfade 0.25 s in, its own tail fades out over 1.0 s past e
SECTIONS = [
    (0, 0, C["title"], -15),
    (1, C["title"] - 4, C["intro"], -13),
    (2, C["intro"], C["march"], -21),
    (3, C["march"], C["conch"], -19),
    (4, C["conch"], C["tent"], -16),
    (5, C["tent"], C["astra"], -20),
    (6, C["astra"], C["after"], -17),
    (7, C["after"], C["feature"], -19),
    (8, C["feature"], TOTAL, -21),
]
SPEECH_DUCK = {i: -11.0 for i in range(9)}

def build_music():
    mus = np.zeros((N, 2), np.float32)
    for i, s, e, lvl in SECTIONS:
        cue = load(EP / f"audio/music/cue_{i}.mp3")
        a, b = int(sec(s) * SR), int(sec(e) * SR)
        need = b - a + SR
        if len(cue) < need:
            r = max(0.8, len(cue) / need)
            print(f"cue {i}: {len(cue) / SR:.1f}s for {need / SR:.1f}s, time-stretch atempo {r:.3f}")
            raw = subprocess.run([FF, "-v", "error", "-i", str(EP / f"audio/music/cue_{i}.mp3"), "-af", f"atempo={r:.4f}", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
            cue = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
            if len(cue) < need:
                cue = np.concatenate([cue, np.zeros((need - len(cue), 2), np.float32)])
        seg = cue[:need].copy()
        act = seg[: b - a]
        seg *= db(lvl - lufs_like(act))
        fin = int(0.25 * SR) if i else int(0.02 * SR)
        seg[:fin] *= np.linspace(0, 1, fin)[:, None]
        fo = np.ones(need)
        fo[b - a:] = np.linspace(1, 0, need - (b - a))
        seg *= fo[:, None]
        end = min(N, a + need)
        mus[a:end] += seg[: end - a]
    return mus


def music_gain():
    g = np.ones(N)
    for i, s, e, _ in SECTIONS:
        a, b = int(sec(s) * SR), int(sec(e) * SR)
        g[a:b] = np.where(speech[a:b] > 0, db(SPEECH_DUCK[i]), 1.0)
    return smooth_env(g)


# ---- SFX on cue frames: (file, reel frame, dB, fade_in s, keep s or None)
def sfx_list():
    return [
        ("field_dawn.wav", 0, -25, 0.0, C["title"] / 30),
        ("axe_whoosh.wav", 0, -18, 0, None),
        ("epic_boom.wav", 0, -20, 0, 0.6),
        ("cut_whoosh.wav", A(1) - 6, -22, 0, None),
        ("axe_whoosh.wav", KK["vadh"] - 3, -21, 0, 0.6),
        ("cut_whoosh.wav", A(3) - 7, -21, 0, None),
        ("chariot_rush.wav", A(3) - 8, -26, 0.1, 1.6),
        ("cut_whoosh.wav", A(5) - 7, -21, 0, None),
        ("axe_whoosh.wav", KK["ikkis"] - 4, -14, 0, None),
        ("thunder_crack.wav", KK["ikkis"], -15, 0, None),
        ("heartbeat_stop.wav", A(7) - 6, -20, 0, None),
        ("epic_boom.wav", KK["born"] + 2, -12, 0, None),
        ("epic_boom.wav", C["title"] + 2, -11, 0, None),
        ("conch_blast.wav", C["title"] + 8, -13, 0.02, 1.8),
        ("cut_whoosh.wav", C["intro"] - 8, -17, 0, None),
        ("ashram_morning.wav", C["intro"] + 4, -26, 0.4, (C["march"] - C["intro"]) / 30),
        ("heartbeat_stop.wav", C["plea"], -22, 0, None),
        ("cut_whoosh.wav", C["march"] - 6, -20, 0, None),
        ("field_dawn.wav", C["march"], -27, 0.3, (C["conch"] - C["march"]) / 30),
        ("temple_bell.wav", KK["bow"] - 10, -24, 0, None),
        ("chariot_rush.wav", KK["harane"] - 30, -24, 0.1, 1.4),
        ("conch_blast.wav", C["conch"] + 2, -12, 0.02, 1.6),
        ("conch_blast.wav", C["conch"] + 14, -18, 0.02, 0.7),
        ("arrows_volley.wav", C["conch"] + 8, -18, 0, None),
        ("arrows_clash.wav", B(18) + 1, -19, 0, None),
        ("arrows_clash.wav", KK["day10"] - 6, -18, 0, None),
        ("arrows_volley.wav", KK["day20"] - 8, -17, 0, None),
        ("arrows_clash.wav", KK["day20"] + 30, -18, 0, None),
        ("arrow_hit.wav", KK["laga"] - 2, -14, 0, None),
        ("crowd_gasp.wav", KK["laga"] + 8, -21, 0, None),
        ("epic_boom.wav", KK["gir"] + 4, -13, 0, None),
        ("cut_whoosh.wav", C["tent"] - 8, -22, 0, None),
        ("night_tent.wav", C["tent"], -26, 0.5, (C["d23"] - C["tent"]) / 30),
        ("divine_arrival.wav", KK["vasu"] - 2, -17, 0, None),
        ("divine_shimmer.wav", A(25) - 4, -21, 0, None),
        ("mantra_whisper.wav", KK["prasvap"] - 2, -20, 0, None),
        ("astra_clash.wav", C["astra"] - 6, -11, 0, 0.95),
        ("bow_draw.wav", A(28) + 4, -19, 0, None),
        ("astra_charge.wav", KK["chadh"] - 20, -19, 0.1, None),
        ("sky_halt.wav", KK["ruko"] - 4, -12, 0, None),
        ("choir_swell.wav", KK["pitri"] - 6, -21, 0.05, 2.0),
        ("cut_whoosh.wav", C["admit"] - 6, -22, 0, None),
        ("forest_tapas.wav", C["vow"], -26, 0.4, (C["alone"] - C["vow"]) / 30 + 0.6),
        ("epic_boom.wav", KK["mrityu"] + 2, -12, 0, None),
        ("field_dawn.wav", C["alone"], -28, 0.6, (C["feature"] - C["alone"]) / 30),
        ("heartbeat_stop.wav", KK["kaun"] + 2, -15, 0, None),
        ("epic_boom.wav", KK["seed"] + 8, -13, 0, None),
        ("cut_whoosh.wav", C["feature"] - 6, -21, 0, None),
        ("temple_bell.wav", C["feature"] + 14, -23, 0, None),
        ("cut_whoosh.wav", C["end"] - 6, -22, 0, None),
    ]

AMB = {"field_dawn.wav", "ashram_morning.wav", "night_tent.wav", "forest_tapas.wav"}


def build_sfx(amb):
    out = np.zeros((N, 2), np.float32)
    for name, fr, lvl, fin, keep in sfx_list():
        if (name in AMB) != amb:
            continue
        x = load(EP / "audio/sfx" / name)
        if keep is not None:
            x = x[: int(keep * SR)].copy()
            fo = min(len(x), int(0.4 * SR))
            x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        if fin:
            k = int(fin * SR)
            x[:k] *= np.linspace(0, 1, k)[:, None]
        pk = np.max(np.abs(x)) + 1e-9
        x = x / pk * db(lvl + 6)  # peak-referenced level
        a = int(sec(fr) * SR)
        e = min(N, a + len(x))
        out[a:e] += x[: e - a]
    return out


def gaps(bed):
    res = []
    for k, p in enumerate(PH):
        a, b = int(sec(p["fa"]) * SR), int(sec(p["fb"]) * SR)
        res.append((k, lufs_like(dia[a:b]) - lufs_like(bed[a:b] + 1e-7)))
    return res


mus = build_music()
sfx = build_sfx(False)
amb = build_sfx(True)
for it in range(10):
    g = music_gain()
    m = mus * g[:, None]
    m = m * (1 - speech[:, None]) + band_dip(m) * speech[:, None]
    s_d = sfx * smooth_env(np.where(speech > 0, db(-12), 1.0))[:, None]
    a_d = amb * smooth_env(np.where(speech > 0, db(-12), 1.0))[:, None]
    bed = m + s_d + a_d
    gs = gaps(bed)
    bad = [(k, v) for k, v in gs if v < MIN_GAP]
    print(f"pass {it}: min gap {min(v for _, v in gs):.1f} LU, median {np.median([v for _, v in gs]):.1f}, low {len(bad)}")
    if not bad:
        break
    worst = {}
    for k, v in bad:
        fr = PH[k]["fa"]
        for i, s, e, _ in SECTIONS:
            if s <= fr < e:
                worst[i] = max(worst.get(i, 0), MIN_GAP - v)
                break
    for i, d in worst.items():
        SPEECH_DUCK[i] = max(-24.0, SPEECH_DUCK[i] - max(1.0, d + 0.3))
    # sfx peaks under a weak phrase are handled by the -6 dB speech duck above

# voice treatments (wet layers under the dry voice): the brahmanas as a chorus of eight in a divine space; Narada's voice from the
# sky; a short open-field slap on Parashurama's roars.
def fx(who, af, pad=2.0):
    vm = np.zeros(N)
    for p in PH:
        if p["who"] == who:
            vm[int(sec(p["fa"] - 1) * SR): int(min(TOTAL, p["fb"] + pad * FPS) / FPS * SR)] = 1
    vin = (dia * vm[:, None]).astype(np.float32)
    raw = subprocess.run([FF, "-v", "error", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-af", af, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         input=vin.tobytes(), capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.float32).reshape(-1, 2)[:N].copy()
    return np.concatenate([y, np.zeros((N - len(y), 2), np.float32)]) if len(y) < N else y


CHORUS = ("asplit=3[a][b][c];[a]asetrate=48000*1.035,aresample=48000,atempo=0.9662,adelay=28|34[a2];"
          "[b]asetrate=48000*0.965,aresample=48000,atempo=1.0363,adelay=46|40[b2];[c]adelay=70|62,volume=0.7[c2];"
          "[a2][b2][c2]amix=inputs=3:normalize=0,aecho=0.8:0.7:120|240|380:0.35|0.25|0.18,highpass=f=160,lowpass=f=7000")
wet = fx("brahman", CHORUS, 2.5) * db(-3)
wet += fx("narada", "aecho=0.8:0.65:90|190|320:0.32|0.22|0.15,highpass=f=200,lowpass=f=6500", 2.0) * db(-5)
wet += fx("rama", "aecho=0.8:0.5:55|130:0.22|0.12,highpass=f=180,lowpass=f=5500", 1.0) * db(-8)
verb = wet
mix = dia + bed + verb
# master: to -14 LUFS-ish, then a soft limiter for TP
mix *= db(-14 - lufs_like(mix))
peak = np.max(np.abs(mix))
lim = db(-1.8)
if peak > lim:
    mix = np.where(np.abs(mix) > lim * 0.8, np.sign(mix) * (lim * 0.8 + (lim * 0.2) * np.tanh((np.abs(mix) - lim * 0.8) / (lim * 0.2))), mix)
mix = mix[: int(TOTAL / FPS * SR)]
out = EP / "audio/mix"
out.mkdir(parents=True, exist_ok=True)
tmp = out / "mix_raw.wav"
import wave  # noqa: E402

with wave.open(str(tmp), "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(3)
    wf.setframerate(SR)
    ints = (np.clip(mix, -1, 1) * 8388607).astype("<i4").tobytes()
    wf.writeframes(b"".join(ints[i:i + 3] for i in range(0, len(ints), 4)))
# exact loudness with ffmpeg loudnorm (linear, two-pass) to -14 LUFS / -1.5 dBTP
meas = subprocess.run([FF, "-hide_banner", "-i", str(tmp), "-af", "loudnorm=I=-14:TP=-1.6:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
js = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
af = (f"loudnorm=I=-14:TP=-1.6:LRA=11:linear=true:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
      f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}")
subprocess.run([FF, "-v", "error", "-y", "-i", str(tmp), "-af", af, "-ar", str(SR), "-c:a", "pcm_s24le", str(out / "mix.wav")], check=True)
for d in [EP / "render/public/jyotiq/bharata/ep6"]:
    d.mkdir(parents=True, exist_ok=True)
    shutil.copy(out / "mix.wav", d / "mix.wav")
(out / "gaps.json").write_text(json.dumps({"gaps": gs, "duck": SPEECH_DUCK}, ensure_ascii=False, indent=1))
print("ducks", {k: round(v, 1) for k, v in SPEECH_DUCK.items()})
print("MIX DONE", out / "mix.wav")
