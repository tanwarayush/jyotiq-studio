"""Local whisper.cpp word timestamps for every one-take VO segment.
Writes audio/stt/<code>.txt and audio/stt/words_raw.json. Audio never leaves the Mac.
Run: /usr/local/bin/python3 tools/transcribe.py
"""
import json
import os
import re
import subprocess
import tempfile
from pathlib import Path

EP = Path(__file__).resolve().parent.parent
MODEL = "/Users/ayushrajput/.cache/whisper-models/ggml-large-v3-turbo-q5_0.bin"
OUT = EP / "audio" / "stt"
OUT.mkdir(parents=True, exist_ok=True)
pat = re.compile(r"\[(\d+):(\d+):([\d.]+) --> (\d+):(\d+):([\d.]+)\]\s*(.*)")

all_words = {}
for mp3 in sorted((EP / "audio" / "vo").glob("*.mp3")):
    code = mp3.name.split("_")[0]
    txt = OUT / f"{code}.txt"
    if txt.exists() and txt.stat().st_size > 20:
        print("skip", code)
    else:
        with tempfile.TemporaryDirectory() as d:
            wav = os.path.join(d, "a.wav")
            subprocess.run(["/opt/homebrew/bin/ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", "16000", "-ac", "1", wav], check=True)
            r = subprocess.run(["/opt/homebrew/bin/whisper-cli", "-m", MODEL, "-l", "hi", "-ml", "1", "-sow", "-np", "-t", "4", "-f", wav], capture_output=True, text=True)
        txt.write_text(r.stdout + "\n--- STDERR ---\n" + r.stderr, encoding="utf-8")
        print("did", code)
    ws = []
    for line in txt.read_text(encoding="utf-8", errors="replace").splitlines():
        m = pat.match(line)
        if not m:
            continue
        a = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
        b = int(m[4]) * 3600 + int(m[5]) * 60 + float(m[6])
        w = m[7].strip()
        if w:
            ws.append([round(a, 3), round(b, 3), w])
    all_words[code] = ws
    print(code, " ".join(f"{w[2]}@{w[0]:.2f}" for w in ws), flush=True)

(OUT / "words_raw.json").write_text(json.dumps(all_words, ensure_ascii=False, indent=1), encoding="utf-8")
print("TRANSCRIBE DONE")
