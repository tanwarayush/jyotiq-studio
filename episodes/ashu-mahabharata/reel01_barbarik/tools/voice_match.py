"""Character fit of the voice-design previews with earshot (CLAP z of a character description vs realistic confusions).
Run: /Users/ayushrajput/earshot/.venv/bin/python tools/voice_match.py"""
import json, os
from earshot import api

EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(EP, "audio/design")
Q = {
    "Kunti": ("a young woman's clear, emotional, frightened pleading voice", ["an old woman speaking", "a deep male voice", "a child speaking"]),
    "Surya": ("a deep, powerful, majestic male voice speaking slowly", ["a young boy speaking", "a woman speaking", "an old man's thin voice"]),
    "Durvasa": ("an old man's stern, gravelly, rough voice", ["a young man speaking", "a woman speaking", "a child speaking"]),
    "Dai": ("an older woman's low, worried, husky whispering voice", ["a young girl speaking", "a man speaking", "a child speaking"]),
    "Adhiratha": ("a warm middle-aged man shouting joyfully, laughing", ["a woman speaking", "an old man whispering", "a child speaking"]),
}
out = {}
for n, (q, alts) in Q.items():
    rows = []
    for i in range(3):
        fp = os.path.join(D, f"{n}_{i}.mp3")
        r = api.match(fp, q, alts=alts)
        z = r["z"]; pv = r.get("p_vs_alts")
        rows.append((i, round(float(z), 2), round(float(pv or 0), 2)))
    out[n] = rows
    print(n, rows, flush=True)
json.dump(out, open(os.path.join(D, "earshot.json"), "w"), indent=1)
