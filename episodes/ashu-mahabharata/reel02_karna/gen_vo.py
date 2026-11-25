"""One-take ElevenLabs voice generation for the AshuAnimates Karna reel.
Run: /usr/local/bin/python3 gen_vo.py check | 07b | all
Never re-run an existing file here; retakes are a separate, approved decision.
"""
import json
import os
import subprocess
import sys
import time

EP = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(EP, "audio", "vo")
API = "https://api.elevenlabs.io/v1"

VOICES = {
    "narrator": {"id": "sOZQ1ppVsWN9p0pWlPgY", "name": "Kaal - Hindi Epic Saga Narrator"},
    "surya": {"id": "PnaKthDVqB7PvUN6iU48", "name": "Neel - Deep & Dramatic Mythology Voice"},
    "karna": {"id": "HvtjkB4qXezhvD9lP84O", "name": "Pavan M - Grand Hindu Mythology Narrator"},
    "indra": {"id": "HKtEa3piD69tFsCIdVpq", "name": "Indra dev"},
}

SEGMENTS = [
    ("01a", "narrator", 1, "[hushed, awed, solar]", "सूरज का बेटा... जिसे कोई हथियार छू भी नहीं सकता था।"),
    ("02a", "narrator", 2, "[warm, revealing]", "नाम था कर्ण। जन्म से ही उसके शरीर पर सोने का कवच था... और कानों में कुंडल।"),
    ("03a", "narrator", 3, "[firm, weighty]", "जब तक कवच था, कर्ण को कोई नहीं मार सकता था। अर्जुन भी नहीं।"),
    ("04a", "narrator", 4, "[low, ominous]", "ये बात इंद्र जानते थे... अर्जुन के पिता।"),
    ("05a", "narrator", 5, "[mysterious, night-time]", "सूर्य देव ने सपने में कर्ण को चेताया —"),
    ("05b", "surya", 5, "[divine, grave, loving warning]", "कल एक ब्राह्मण आएगा। कुछ भी दे देना... पर कवच मत देना।"),
    ("06a", "narrator", 6, "[expectant, soft]", "कर्ण मुस्कुराए —"),
    ("06b", "karna", 6, "[proud, gentle, unshakable]", "मेरे दरवाज़े से कोई ख़ाली हाथ नहीं जाता।"),
    ("07a", "narrator", 7, "[bright dawn, turning tense]", "अगली सुबह, जब कर्ण सूर्य को जल चढ़ा रहे थे... इंद्र ब्राह्मण बनकर आए। और माँगा —"),
    ("07b", "indra", 7, "[controlled, testing, majestic]", "कवच और कुंडल।"),
    ("08a", "narrator", 8, "[slow, heavy heartbeat]", "कर्ण जानते थे... ये उनकी मौत की माँग है।"),
    ("09a", "narrator", 9, "[reverent, stunned, slow]", "फिर भी उन्होंने अपने ही हाथों से... कवच उतारकर दे दिया।"),
    ("10a", "narrator", 10, "[humbled, awed]", "इंद्र का सिर झुक गया। बदले में उन्होंने कर्ण को एक अमोघ शक्ति दी... जो एक बार चलती, तो ख़ाली नहीं जाती।"),
    ("11a", "narrator", 11, "[noble, emotional, resolved]", "कर्ण ने अपनी जान का कवच दे दिया... पर अपना वचन नहीं तोड़ा।"),
    ("12a", "narrator", 12, "[warm, triumphant, devotional]", "इसीलिए आज भी दुनिया कहती है — दानवीर कर्ण।"),
]

VOICE_SETTINGS = {
    "stability": 0.45,
    "similarity_boost": 0.8,
    "style": 0.3,
    "use_speaker_boost": True,
}


def api_key():
    key = os.environ.get("ELEVENLABS_API_KEY", "")
    if key:
        return key
    p = subprocess.run(
        ["env", "-u", "ELEVENLABS_API_KEY", "zsh", "-ic", 'printf %s "$ELEVENLABS_API_KEY"'],
        capture_output=True,
        text=True,
    )
    return p.stdout.strip()


def curl_json(path, key):
    p = subprocess.run(
        ["curl", "-sS", "--fail", "--max-time", "60", "-H", f"xi-api-key: {key}", API + path],
        capture_output=True,
        text=True,
    )
    if p.returncode:
        raise RuntimeError(p.stderr.strip() or p.stdout.strip())
    return json.loads(p.stdout)


def generate(seg, key):
    code, who, line, tag, spoken = seg
    dest = os.path.join(OUT, f"{code}_{who}_line{line:02d}.mp3")
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"skip {os.path.basename(dest)} (exists)")
        return True
    body = {
        "text": f"{tag} {spoken}",
        "model_id": "eleven_v3",
        "seed": 26000 + int(code[:2]) * 10 + (0 if code.endswith("a") else 1),
        "voice_settings": VOICE_SETTINGS,
    }
    voice_id = VOICES[who]["id"]
    url = f"{API}/text-to-speech/{voice_id}?output_format=mp3_44100_192"
    tmp = dest + ".tmp"
    p = subprocess.run(
        [
            "curl", "-sS", "--fail", "--max-time", "300", "-X", "POST",
            "-H", f"xi-api-key: {key}",
            "-H", "Content-Type: application/json",
            "-H", "Accept: audio/mpeg",
            "-d", json.dumps(body, ensure_ascii=False),
            "-o", tmp,
            url,
        ],
        capture_output=True,
        text=True,
    )
    if p.returncode:
        try:
            detail = open(tmp, "rb").read().decode(errors="replace")[:400]
        except Exception:
            detail = ""
        print(f"FAIL {code}: {p.stderr.strip()} {detail}")
        return False
    os.replace(tmp, dest)
    print(f"ok {os.path.basename(dest)} {os.path.getsize(dest)//1024} KB")
    return True


def main():
    os.makedirs(OUT, exist_ok=True)
    key = api_key()
    if not key:
        raise SystemExit("ELEVENLABS_API_KEY is not visible")
    plain_chars = sum(len(x[4]) for x in SEGMENTS)
    tagged_chars = sum(len(x[3] + " " + x[4]) for x in SEGMENTS)
    if len(sys.argv) > 1 and sys.argv[1] == "check":
        sub = curl_json("/user/subscription", key)
        print(json.dumps({
            "segments": len(SEGMENTS),
            "spoken_chars": plain_chars,
            "tagged_input_chars": tagged_chars,
            "used": sub.get("character_count"),
            "limit": sub.get("character_limit"),
            "remaining": sub.get("character_limit", 0) - sub.get("character_count", 0),
        }, ensure_ascii=False, indent=2))
        return
    if len(sys.argv) > 1 and sys.argv[1] != "all":
        wanted = {x.lower() for x in sys.argv[1:]}
        todo = [s for s in SEGMENTS if s[0].lower() in wanted]
    else:
        todo = SEGMENTS
    if not todo:
        raise SystemExit("no matching segments")
    print(f"generating {len(todo)} one-take segments; tagged input chars in batch {sum(len(s[3] + ' ' + s[4]) for s in todo)}")
    ok = True
    for seg in todo:
        ok = generate(seg, key) and ok
        time.sleep(0.4)
    meta = {
        "model_id": "eleven_v3",
        "voice_settings": VOICE_SETTINGS,
        "voices": VOICES,
        "segments": [
            {"code": s[0], "who": s[1], "line": s[2], "tag": s[3], "spoken": s[4], "file": f"audio/vo/{s[0]}_{s[1]}_line{s[2]:02d}.mp3"}
            for s in SEGMENTS
        ],
    }
    with open(os.path.join(EP, "audio", "voice_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
