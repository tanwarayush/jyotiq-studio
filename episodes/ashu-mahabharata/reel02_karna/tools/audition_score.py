"""Score the Ep6 voice auditions: Whisper accuracy (pick_takes.stt/score) + earshot CLAP z for the character + measured loudness.
Run: /Users/ayushrajput/earshot/.venv/bin/python tools/audition_score.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from earshot import api
import pick_takes as pt
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(EP, "audio/audition")
src = open(os.path.join(EP, "gen_vo.py")).read()
ns = {}; exec(src[src.index("AUDITION = {"):src.index("\n}\n", src.index("AUDITION = {")) + 3], ns)
Q = {
    "rama": ("a deep, thunderous, furious older man roaring in anger", ["a young man speaking calmly", "a woman speaking", "a soft gentle narrator"]),
    "narada": ("a clear, bright, urgent male voice calling out a command", ["an old man's gravelly voice", "a woman speaking", "a whisper"]),
    "brahman": ("a calm, deep, mysterious old man speaking softly and slowly", ["a young excited man", "a woman speaking", "an angry shout"]),
}
out = {}
for part, (ids, text) in ns["AUDITION"].items():
    q, alts = Q[part]
    for v in ids:
        fp = os.path.join(D, f"{part}_{v}.mp3")
        h = pt.stt(fp); s = pt.score(text, h)
        r = api.match(fp, q, alts=alts)
        out[f"{part}_{v}"] = {"stt": round(s, 3), "z": round(float(r["z"]), 2), "p_alts": round(float(r.get("p_vs_alts") or 0), 2), "dur": round(pt.dur(fp), 2), "heard": h}
        print(part, v, out[f"{part}_{v}"], flush=True)
json.dump(out, open(os.path.join(D, "scores.json"), "w"), ensure_ascii=False, indent=1)
