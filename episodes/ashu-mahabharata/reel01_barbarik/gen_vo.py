"""One-take ElevenLabs voice generation for the AshuAnimates Barbarik reel.
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
    "narrator": {
        "id": "sOZQ1ppVsWN9p0pWlPgY",
        "name": "Kaal - Hindi Epic Saga Narrator",
    },
    "krishna": {
        "id": "ovcrTRBELQPup0RNagdO",
        "name": "Pranit - Soothing & Devotional Narrator",
    },
    "barbarik": {
        "id": "PnaKthDVqB7PvUN6iU48",
        "name": "Neel - Deep & Dramatic Mythology Voice",
    },
}

# Spoken words exactly preserve the approved script. Bracketed v3 tags are performance directions only.
SEGMENTS = [
    ("01a", "narrator", 1, "[hushed, weighty, mysterious]", "एक योद्धा था... जो पूरा महाभारत एक पल में खत्म कर सकता था।"),
    ("02a", "narrator", 2, "[grave, measured]", "पर श्री कृष्ण ने उसे युद्ध से पहले ही रोक दिया।"),
    ("03a", "narrator", 3, "[warm, revealing]", "नाम था बर्बरीक। घटोत्कच का बेटा... भीम का पोता।"),
    ("04a", "narrator", 4, "[awed, measured]", "महादेव से उन्हें तीन बाण मिले थे। पहला निशान लगाता... तीसरा सब खत्म कर देता।"),
    ("05a", "narrator", 5, "[curious, storyteller]", "लोक कथा कहती है, कृष्ण ने हर योद्धा से पूछा —"),
    ("05b", "krishna", 5, "[calm, soft, divine, testing]", "अकेले लड़ो, तो ये युद्ध कितने दिन में खत्म करोगे?"),
    ("06a", "narrator", 6, "[measured, recounting]", "भीष्म बोले — बीस दिन। द्रोण बोले — पच्चीस।"),
    ("07a", "narrator", 7, "[expectant, hushed]", "बर्बरीक मुस्कुराए —"),
    ("07b", "barbarik", 7, "[young, firm, quiet confidence]", "एक पल।"),
    ("08a", "narrator", 8, "[gentle, solemn]", "पर बर्बरीक ने अपनी माँ को एक वचन दिया था — वो हमेशा हारने वाले का साथ देंगे।"),
    ("09a", "narrator", 9, "[knowing, grave]", "कृष्ण समझ गए। जो सेना हारेगी, बर्बरीक उधर चले जाएँगे। फिर दूसरी हारेगी... तो उधर।"),
    ("10a", "narrator", 10, "[slow, ominous, hushed]", "और आख़िर में... मैदान में बस एक बचेगा। बर्बरीक ख़ुद।"),
    ("11a", "narrator", 11, "[low, mysterious]", "तब कृष्ण ब्राह्मण बनकर आए... और दान में माँगा —"),
    ("11b", "krishna", 11, "[calm, soft, divine, compassionate]", "उनका सिर।"),
    ("12a", "narrator", 12, "[heavy, reverent]", "बर्बरीक ने बिना एक पल सोचे, अपना सिर दे दिया। बस एक इच्छा रखी —"),
    ("12b", "barbarik", 12, "[young, firm, yearning]", "मैं ये युद्ध देखना चाहता हूँ।"),
    ("13a", "narrator", 13, "[awed, tender, slow]", "कृष्ण ने उनका सिर एक पहाड़ी पर रखा... और वहीं से बर्बरीक ने पूरा महाभारत देखा।"),
    ("14a", "narrator", 14, "[warm, devotional, resolved]", "आज दुनिया उन्हें खाटू श्याम कहती है... हारे का सहारा।"),
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
