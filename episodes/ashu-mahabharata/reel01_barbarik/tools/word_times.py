"""Word timestamps (whisper.cpp, one word per segment) for the picked take of every multi-phrase line, plus the speech runs,
so phrase cuts can be checked/set by hand. Writes audio/vo/words.json. Run: /usr/local/bin/python3 tools/word_times.py"""
import json, os, re, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lines import SEQ

EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
picked = json.load(open(os.path.join(EP, "audio/vo/picked.json")))
need = {}
for e in SEQ:
    if e[0] != "beat":
        need.setdefault(f"{e[0]}_{e[1]}", set()).add(e[2])
out = {}
for key, texts in need.items():
    if len(texts) < 2:
        continue
    mp3 = os.path.join(EP, "audio/vo", picked[key]["file"])
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "a.wav")
        subprocess.run(["/opt/homebrew/bin/ffmpeg", "-v", "error", "-y", "-i", mp3, "-ar", "16000", "-ac", "1", wav], check=True)
        r = subprocess.run(["/opt/homebrew/bin/whisper-cli", "-m", "/Users/ayushrajput/.cache/whisper-models/ggml-large-v3-turbo-q5_0.bin", "-l", "hi", "-ml", "1", "-sow", "-np", "-t", "4", "-f", wav], capture_output=True, text=True)
    ws = []
    for m in re.finditer(r"\[(\d+):(\d+):([\d.]+) --> (\d+):(\d+):([\d.]+)\]\s*(.*)", r.stdout):
        a = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
        b = int(m[4]) * 3600 + int(m[5]) * 60 + float(m[6])
        if m[7].strip():
            ws.append([round(a, 2), round(b, 2), m[7].strip()])
    out[key] = ws
    print(key, picked[key]["file"], " ".join(f"{w[2]}@{w[0]:.2f}-{w[1]:.2f}" for w in ws), flush=True)
json.dump(out, open(os.path.join(EP, "audio/vo/words.json"), "w"), ensure_ascii=False, indent=1)
