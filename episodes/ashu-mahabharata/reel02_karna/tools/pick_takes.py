"""Pick the best take per script line: transcribe every take with whisper.cpp (Hindi), score it against the script text
(character similarity on Devanagari letters only), then prefer the take whose length is nearest the line's median among
takes scoring within 0.04 of the best (drops rushed or dragged reads). Writes audio/vo/picked.json and prints the table.
Also used for the voice-design previews: pick_takes.py design (scores audio/design/<Name>_<i>.mp3 against the design text).
Run: /usr/local/bin/python3 tools/pick_takes.py [design]"""
import difflib, json, os, re, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FF = "/opt/homebrew/bin/ffmpeg"
WH = "/opt/homebrew/bin/whisper-cli"
MODEL = "/Users/ayushrajput/.cache/whisper-models/ggml-large-v3-turbo-q5_0.bin"


def clean(s):
    s = re.sub(r"\[[^\]]*\]", " ", s)
    return "".join(ch for ch in s if "ऀ" <= ch <= "ॿ" and ch not in "।॥")


def stt(mp3):
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "a.wav")
        subprocess.run([FF, "-v", "error", "-y", "-i", mp3, "-ar", "16000", "-ac", "1", wav], check=True)
        r = subprocess.run([WH, "-m", MODEL, "-l", "hi", "-nt", "-np", "-t", "4", "-f", wav], capture_output=True, text=True)
        return r.stdout.strip()


def dur(mp3):
    r = subprocess.run(["/opt/homebrew/bin/ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def score(text, heard):
    return difflib.SequenceMatcher(None, clean(text), clean(heard)).ratio()


def pick(groups):
    out = {}
    for key, (text, files) in groups.items():
        rows = []
        for fp in files:
            h = stt(fp)
            rows.append((score(text, h), dur(fp), os.path.basename(fp), h))
        best = max(r[0] for r in rows)
        ok = [r for r in rows if r[0] >= best - 0.04]
        med = sorted(r[1] for r in ok)[len(ok) // 2]
        win = min(ok, key=lambda r: abs(r[1] - med))
        out[key] = {"file": win[2], "score": round(win[0], 3), "dur": round(win[1], 2), "heard": win[3], "all": [[r[2], round(r[0], 3), round(r[1], 2)] for r in rows]}
        print(f"{key:14s} -> {win[2]:22s} score {win[0]:.3f} dur {win[1]:.2f}s | " + " ".join(f"{r[2]}:{r[0]:.2f}" for r in rows), flush=True)
    return out


if __name__ == "__main__":
    if sys.argv[1:] == ["design"]:
        import importlib.util
        spec = importlib.util.spec_from_file_location("dv", os.path.join(EP, "design_voices.py"))
        src = open(os.path.join(EP, "design_voices.py")).read()
        voices = {}
        exec(src[src.index("VOICES = {"):src.index("\n}\n", src.index("VOICES = {")) + 3], voices)
        dd = os.path.join(EP, "audio/design")
        groups = {n: (v[1], sorted(os.path.join(dd, f) for f in os.listdir(dd) if f.startswith(n + "_") and f.endswith(".mp3"))) for n, v in voices["VOICES"].items()}
        json.dump(pick({k: g for k, g in groups.items() if g[1]}), open(os.path.join(dd, "picked.json"), "w"), ensure_ascii=False, indent=1)
    else:
        src = open(os.path.join(EP, "gen_vo.py")).read()
        ns = {}
        exec(src[src.index("JOBS = {"):src.index("\n}\n", src.index("JOBS = {")) + 3], ns)
        vd = os.path.join(EP, "audio/vo")
        groups = {}
        for (who, line), text in ns["JOBS"].items():
            fs = sorted(os.path.join(vd, f) for f in os.listdir(vd) if re.fullmatch(rf"{who}_{line}_\d+\.mp3", f))
            if fs:
                groups[f"{who}_{line}"] = (text, fs)
        only = set(sys.argv[1:])
        if only:
            groups = {k: g for k, g in groups.items() if k in only}
        pp = os.path.join(vd, "picked.json")
        res = json.load(open(pp)) if (only and os.path.exists(pp)) else {}
        res.update(pick(groups))
        json.dump(res, open(pp, "w"), ensure_ascii=False, indent=1)
