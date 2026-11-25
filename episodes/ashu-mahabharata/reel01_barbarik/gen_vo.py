"""भारत Ep6 voice takes (ElevenLabs eleven_v3), 25 Nov 2026. Ayush: use as many credits as needed. Every line gets TAKES takes
(different seeds); tools/pick_takes.py keeps the best by Whisper accuracy. All 30 custom slots are full, so new parts use library
voices already in the account (picked by audition: gen_vo.py audition -> audio/audition/*.mp3).
Kaal narrates; Bhishma = Jyotiq Devavrata (Ep2-3); Amba = Jyotiq Amba (Ep3). Files: audio/vo/<who>_<line>_<take>.mp3.
Run with /usr/bin/python3. Usage: gen_vo.py check | gen_vo.py audition | gen_vo.py [line ...]"""
import json, os, subprocess, sys, urllib.error, urllib.request

EP = os.path.dirname(os.path.abspath(__file__))
API = "https://api.elevenlabs.io/v1"
TAKES = 3
CAST = json.load(open(os.path.join(EP, "audio/cast.json"))) if os.path.exists(os.path.join(EP, "audio/cast.json")) else {}
VOICE = {
    "kaal": "sOZQ1ppVsWN9p0pWlPgY",
    "bhishma": "ydep2pifhkLBx2La9VQl",
    "amba": "msMgfwOsxpW7ovv5tg1F",
    "rama": CAST.get("rama"),
    "narada": CAST.get("narada"),
    "brahman": CAST.get("brahman"),
}
AUDITION = {
    "rama": (["LrnwgcdTLxc99sutUxGU", "qDuRKMlYmrm8trt5QyBn", "HvtjkB4qXezhvD9lP84O", "NU1Fa3MOP5Doh4ymoYLl", "d0grukerEzs069eKIauC"],
             "[furious, thunderous, roaring] मुझे ललकारोगे? [proud, booming] मैंने इक्कीस बार धरती को क्षत्रियों से खाली किया है!"),
    "narada": (["B0YnTm3yPeqwfHHYNcT2", "JT6473YSWOH0NkTbpbef", "ovcrTRBELQPup0RNagdO", "PnaKthDVqB7PvUN6iU48"],
               "[urgent, commanding, from the sky] रुको, भीष्म! [firm, divine] अपने गुरु का अपमान मत करो!"),
    "brahman": (["QNaf8WDrxfE8SoFz37UC", "PboFIQ6kckfADmG3UQYF", "HqRQSXEwwdjbY3dgUSzb"],
                "[calm, ethereal, slow, whispering divine voice] उठो, भीष्म। [mysterious] प्रस्वाप अस्त्र याद करो…"),
}

# (who, script line): text with eleven_v3 audio tags (the tags are not spoken)
JOBS = {
    ("rama", 1): "[furious, thunderous, commanding] भीष्म! [stern, pointing] अंबा को अपनाओ… [menacing, slow, final] वरना आज तुम्हारा वध होगा।",
    ("bhishma", 2): "[calm, respectful but unshakable] गुरुदेव… [firm, steady, quiet strength] डर से मैं अपना वचन नहीं तोड़ूँगा।",
    ("rama", 3): "[outraged, roaring] मुझे ललकारोगे? [proud, booming, fierce] मैंने इक्कीस बार धरती को क्षत्रियों से खाली किया है!",
    ("bhishma", 4): "[slow, cool, a confident half-smile] तब… [quiet, powerful, deliberate] भीष्म पैदा नहीं हुआ था।",
    ("kaal", 5): "[curious, mysterious] पर ये हुआ क्यों? [sad, storyteller] जब अंबा को किसी ने नहीं अपनाया… [grave] वो परशुराम के पास गई।",
    ("amba", 6): "[tearful, desperate, kneeling] भगवन्… [anguished, voice breaking] भीष्म ने मेरा जीवन उजाड़ दिया। [pleading, firm] न्याय कीजिए।",
    ("bhishma", 7): "[humble, reverent, softly, bowing] आशीर्वाद दीजिए, गुरुदेव।",
    ("rama", 8): "[stern, slow, a grim smile] विजयी भव नहीं कहूँगा… [fierce, intense] आज मैं तुम्हें हराने आया हूँ।",
    ("kaal", 9): "[tense, building, over battle] एक दिन… [more intense] दस दिन… [gripping, powerful] बीस दिन…",
    ("kaal", 10): "[urgent, dramatic] फिर परशुराम का बाण भीष्म की छाती में लगा… [shocked, low] और वो गिर पड़े।",
    ("kaal", 11): "[hushed, mysterious, slow] उस रात… [awed, whispering] सपने में आठ ब्राह्मण आए।",
    ("brahman", 12): "[calm, ethereal, divine, slow] उठो, भीष्म। [mysterious, revealing] प्रस्वाप अस्त्र याद करो… [gentle, knowing] पिछले जन्म में ये तुम्हारा था।",
    ("kaal", 13): "[intense, building, epic] तेईसवें दिन भीष्म ने वो अस्त्र चढ़ाया… [ominous, low] जो गुरु को रणभूमि में सुला देता।",
    ("narada", 14): "[urgent, commanding, from the sky] रुको, भीष्म! [firm, divine warning] अपने गुरु का अपमान मत करो!",
    ("kaal", 15): "[relieved, slow] भीष्म रुक गए। [solemn, reverent] और परशुराम के पितरों ने युद्ध रुकवा दिया।",
    ("rama", 16): "[breathing hard, exhausted, honest] अंबा… [heavy, proud but defeated] मैंने पूरी शक्ति लगा दी। [quiet, grave] पर भीष्म को नहीं हरा सका।",
    ("amba", 17): "[cold fury, slow, determined, through tears] तो अब मैं खुद… [vow, intense, quiet] भीष्म की मृत्यु बनूँगी।",
    ("kaal", 18): "[weighty, slow] भीष्म को कोई योद्धा नहीं हरा सकता था। [mysterious, low] तो फिर… [intriguing, emphatic] उन्हें गिराएगा कौन?",
    ("kaal", 19): "[warm, thoughtful] एक तरफ़ गुरु… एक तरफ़ वचन। [gentle, inviting] जब मन दो राहों पर अटके… [friendly] ज्योतिक़ से पूछिए।",
}
key = subprocess.run(["env", "-u", "ELEVENLABS_API_KEY", "zsh", "-ic", 'printf %s "$ELEVENLABS_API_KEY"'], capture_output=True, text=True).stdout
H = {"xi-api-key": key, "Content-Type": "application/json", "User-Agent": "claude-check"}


def call(path, body=None):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body is not None else None, headers=H)
    return urllib.request.urlopen(req, timeout=300)


def tts(voice, text, dest, seed):
    try:
        r = call(f"/text-to-speech/{voice}?output_format=mp3_44100_192", {"text": text, "model_id": "eleven_v3", "seed": seed})
        open(dest, "wb").write(r.read())
        print(os.path.basename(dest), "ok, cost", r.headers.get("character-cost"), flush=True)
    except urllib.error.HTTPError as e:
        print(os.path.basename(dest), "HTTP", e.code, e.read().decode(errors="replace")[:300], flush=True)


if __name__ == "__main__":
    if sys.argv[1:] == ["check"]:
        d = json.load(call("/user/subscription"))
        print("used", d["character_count"], "of", d["character_limit"], "| needed", TAKES * sum(len(t) for t in JOBS.values()))
        raise SystemExit
    if sys.argv[1:] == ["audition"]:
        os.makedirs(os.path.join(EP, "audio/audition"), exist_ok=True)
        for part, (ids, text) in AUDITION.items():
            for v in ids:
                dest = os.path.join(EP, "audio/audition", f"{part}_{v}.mp3")
                if not os.path.exists(dest):
                    tts(v, text, dest, 7)
        raise SystemExit
    only = {int(x) for x in sys.argv[1:]}
    os.makedirs(os.path.join(EP, "audio/vo"), exist_ok=True)
    for (who, line), text in JOBS.items():
        if only and line not in only:
            continue
        if not VOICE[who]:
            raise SystemExit(f"no voice cast for {who} (audio/cast.json)")
        for k in range(TAKES):
            dest = os.path.join(EP, "audio/vo", f"{who}_{line}_{k}.mp3")
            if not os.path.exists(dest):
                tts(VOICE[who], text, dest, 7 + 101 * k)
