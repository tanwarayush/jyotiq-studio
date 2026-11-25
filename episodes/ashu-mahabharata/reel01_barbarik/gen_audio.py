"""भारत Ep6 score cues (ElevenLabs Music v2.5, one per section, lengths from audio/vo/clock.json + 1.5 s tail) and new SFX.
cue_1 (series title hit) and cue_8 (outro) are copied from Ep5 for continuity; the Ep5 SFX bank is copied too.
Wordless choir only in the intense or divine cues; the mix ducks every cue under speech.
Run with /usr/bin/python3: gen_audio.py music [i] | gen_audio.py sfx | gen_audio.py plan"""
import json, os, re, shutil, subprocess, sys, urllib.error, urllib.request

EP = os.path.dirname(os.path.abspath(__file__))
EP5 = os.path.join(os.path.dirname(EP), "mahabharat-ep5")
key = subprocess.run(["env", "-u", "ELEVENLABS_API_KEY", "zsh", "-ic", 'printf %s "$ELEVENLABS_API_KEY"'], capture_output=True, text=True).stdout
H = {"xi-api-key": key, "Content-Type": "application/json", "User-Agent": "claude-check"}
NO = ["lyrics", "singing words", "rap", "spoken word", "speech", "edm", "dubstep", "electric guitar", "pop"]
VOX = ["choir", "chant", "chanting", "humming", "vocal", "aalap", "singer"]

clock = json.load(open(os.path.join(EP, "audio/vo/clock.json")))
PH = clock["phrases"]
BE = {b["name"]: (b["fa"], b["fb"]) for b in clock["beats"]}
A = lambda i: PH[i]["fa"]  # noqa: E731
C = {"title": BE["title"][0], "intro": BE["title"][1], "march": BE["march"][0], "conch": BE["conch"][0], "dream": BE["fall"][1],
     "astra": BE["astra"][0], "after": A(32) - 4, "feature": BE["seed"][1], "total": clock["total"]}
SECT = {0: (0, C["title"]), 2: (C["intro"], C["march"]), 3: (C["march"], C["conch"]), 4: (C["conch"], C["dream"]),
        5: (C["dream"], C["astra"]), 6: (C["astra"], C["after"]), 7: (C["after"], C["feature"])}


def secs(i):
    a, b = SECT[i]
    return (b - a) / 30


def Cue(i, text, pos, neg=(), choir=False):
    text = "\n".join(p.strip() for p in re.split(r"(?<=[:.,])\s+(?=[a-z A-Z])", text) if p.strip())
    return {"text": text, "duration_ms": int(secs(i) * 1000) + 1500, "positive_styles": list(pos) + ["strictly instrumental" if not choir else "wordless choir only, no words"],
            "negative_styles": NO + list(neg) + ([] if choir else VOX)}


CUES = {
    0: lambda: Cue(0, "Cold open of an Indian mythological epic: on a dusty battlefield at dawn a furious ancient warrior-sage with a battle-axe threatens his own disciple, who calmly refuses and answers back. "
                  "Gripping from the first second: low war drums, taiko and pakhawaj pulses, deep brass stabs, a tense string ostinato, a huge male wordless choir, building to a massive hit at the end",
                  ["epic Indian mythological TV drama score", "intense", "war drums", "taiko and pakhawaj", "deep brass", "string ostinato", "male wordless choir", "cinematic"], ["calm", "playful", "happy"], choir=True),
    2: lambda: Cue(2, "Flashback in a forest hermitage at morning: a rejected princess kneels in tears before the great warrior-sage and begs for justice. "
                  "Sad and tender: solo sarangi, slow bansuri, tanpura drone, soft frame drum, a lone female wordless lament, emotional and slow, darkening at the end",
                  ["Indian classical", "sad", "tender", "sarangi", "bansuri", "tanpura", "female wordless lament", "slow", "cinematic"], ["drums", "upbeat", "edm"], choir=True),
    3: lambda: Cue(3, "Dawn on the field of Kurukshetra: the disciple steps down from his silver chariot and bows to touch his guru's feet; the guru refuses to bless him with victory. "
                  "Solemn and noble, then ominous: deep shehnai-like brass, slow pakhawaj, warm low strings, temple bells, tension rising into a war conch",
                  ["Indian cinematic", "solemn", "noble", "then ominous", "shehnai-like brass", "pakhawaj", "low strings", "temple bells"], ["happy", "edm", "pop"]),
    4: lambda: Cue(4, "A colossal duel between guru and disciple on war chariots that lasts many days: showers of arrows clash in mid-air, the sky fills with arrows, days pass; then the disciple is struck and falls. "
                  "Relentless epic battle music: driving taiko, dhol and pakhawaj, brass fanfares, fast string runs, a massive wordless male choir, rising in waves, ending on a sudden heavy hit and silence",
                  ["epic battle", "Indian mythological war", "driving percussion", "taiko", "dhol", "brass", "fast strings", "massive wordless choir", "cinematic"], ["calm", "playful", "pop"], choir=True),
    5: lambda: Cue(5, "Night in a war tent: the wounded hero sleeps and eight glowing divine beings appear in his dream and reveal a secret celestial weapon from his past life. "
                  "Ethereal and mystical: soft shimmering pads, a slow bansuri, tanpura, distant temple bells, a soft ethereal wordless choir, a feeling of revelation and wonder",
                  ["ethereal", "mystical", "divine", "shimmering", "bansuri", "tanpura", "temple bells", "soft wordless choir", "cinematic"], ["drums", "edm", "aggressive"], choir=True),
    6: lambda: Cue(6, "The twenty-third day: two divine fire weapons clash in the sky and the whole world trembles; the hero draws a glowing blue sleep weapon on his bow; then a divine sage in the sky commands him to stop. "
                  "Huge epic climax: thunderous drums, roaring brass, a massive wordless choir at full power, rising tension, then a sudden pull-back into a held, awed, suspended string chord",
                  ["epic climax", "Indian mythological", "thunderous drums", "roaring brass", "massive wordless choir", "then suspended", "cinematic"], ["playful", "pop"], choir=True),
    7: lambda: Cue(7, "Dusk after the battle: the great sage lowers his axe and admits defeat; the princess walks away into the forest vowing to cause the hero's death; the hero stands alone on the empty field: who can ever bring him down? "
                  "Solemn and haunting: a low cello drone, a slow pakhawaj heartbeat, a sad sarangi phrase, rising dark strings and one deep gong at the end",
                  ["ominous", "solemn", "haunting", "cello drone", "pakhawaj heartbeat", "sarangi", "rising dark strings", "gong", "cinematic"], ["happy", "calm"]),
}

SFX = {
    "field_dawn": ("A vast open battlefield at dawn: low wind across dry ground, banners flapping, a distant crowd murmuring, a far-off conch echo, no music", 12),
    "ashram_morning": ("A forest hermitage in the early morning: birds singing, a small sacred fire crackling, a gentle breeze in big trees, distant cowbell, no voices, no music", 10),
    "axe_whoosh": ("A heavy battle-axe swung hard through the air: a deep powerful whoosh with a metallic ring, cinematic", 1.5),
    "arrows_clash": ("Many arrows flying fast and colliding in mid-air: rapid whooshes, wooden cracks and metallic sparks, chaotic and intense, cinematic", 4),
    "arrow_hit": ("An arrow striking metal armour with a hard metallic thud and a heavy body falling onto dusty ground, no voice", 2.0),
    "crowd_gasp": ("A large crowd of onlookers gasping in shock at once, outdoors", 2.0),
    "night_tent": ("Night inside a canvas war tent: crickets outside, a small oil lamp flame flickering, soft wind on the canvas, very quiet, no voices", 10),
    "divine_arrival": ("Eight glowing divine beings appearing one by one: soft magical chimes and shimmering bells rising into a warm glowing hum, mystical, no voices", 4),
    "astra_charge": ("A celestial weapon charging with cool blue energy: a deep humming rising in pitch with crackling sparkles, building tension, sci-fi free, mystical", 4),
    "astra_clash": ("Two gigantic divine fire weapons colliding in the sky: an enormous explosion of fire and a long rolling thunder, the ground trembling", 5),
    "sky_halt": ("A sudden divine command from the sky: a deep reverberating gong hit with a whoosh that cuts everything to silence, cinematic", 3),
    "bow_draw": ("A heavy war bow being drawn slowly, the string creaking under tension, then held", 2.0),
}

if __name__ == "__main__":
    mode = sys.argv[1]
    os.makedirs(os.path.join(EP, "audio/music"), exist_ok=True)
    os.makedirs(os.path.join(EP, "audio/sfx"), exist_ok=True)
    if mode == "plan":
        for i in SECT:
            print(i, SECT[i], f"{secs(i):.1f}s")
        raise SystemExit
    if mode == "music":
        for src, dst in [("cue_1.mp3", "cue_1.mp3"), ("cue_8.mp3", "cue_8.mp3")]:
            d = os.path.join(EP, "audio/music", dst)
            if not os.path.exists(d):
                shutil.copy(os.path.join(EP5, "audio/music", src), d)
        only = int(sys.argv[2]) if len(sys.argv) > 2 else None
        for i, mk in CUES.items():
            if only is not None and i != only:
                continue
            dest = os.path.join(EP, f"audio/music/cue_{i}.mp3")
            if os.path.exists(dest):
                print(i, "exists"); continue
            body = {"composition_plan": {"chunks": [{**mk(), "context_adherence": "high"}]}, "model_id": "music_v2_5"}
            req = urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192", data=json.dumps(body).encode(), headers=H)
            try:
                r = urllib.request.urlopen(req, timeout=600)
                open(dest, "wb").write(r.read()); print(i, "ok", r.headers.get("character-cost"), flush=True)
            except urllib.error.HTTPError as e:
                print(i, "HTTP", e.code, e.read().decode(errors="replace")[:400], flush=True)
    else:
        for f in os.listdir(os.path.join(EP5, "audio/sfx")):
            d = os.path.join(EP, "audio/sfx", f)
            if not os.path.exists(d):
                shutil.copy(os.path.join(EP5, "audio/sfx", f), d)
        for n, (t, d) in SFX.items():
            dest = os.path.join(EP, f"audio/sfx/{n}.wav")
            if os.path.exists(dest):
                continue
            req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=wav_48000",
                data=json.dumps({"text": t, "duration_seconds": d, "prompt_influence": 0.55}).encode(), headers=H)
            try:
                r = urllib.request.urlopen(req, timeout=300)
                open(dest, "wb").write(r.read()); print(n, "ok", r.headers.get("character-cost"), flush=True)
            except urllib.error.HTTPError as e:
                print(n, "HTTP", e.code, e.read().decode(errors="replace")[:300], flush=True)
