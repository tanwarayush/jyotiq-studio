# PART 0 — START FROM OUR STUDIO: LEARN FROM THE WORK CLAUDE AND KIRO ALREADY BUILT
(Read this part first. It tells you where our existing assets, code and lessons are, and which studio rules change for this series. The full production brief follows after it.)

===============================================================
## 0.1 Use our studio repo
- Work in the GitHub repo **tanwarayush/jyotiq-studio** (branch from `main`). It is the cloud copy of the studio where Claude and Kiro have already made more than 20 animated mythology reels, including SEVEN Mahabharata episodes (भारत · BHARATA Ep1–Ep7 + a special) in exactly this kind of painted, animated, Hindi-narrated format.
- First run: `bash setup.sh` (Node, Remotion's Chrome, ffmpeg, fonts, a Python venv with earshot + whisper.cpp). It hasn't been tested on Linux yet: if a step fails, fix the script, note it in PROGRESS.md and keep going.
- Secrets are already in Devin Secrets: `ELEVENLABS_API_KEY`, `HF_TOKEN` (and maybe `GCP_SA_KEY_JSON`). Never write a secret into a file or a commit.
- Create ONE branch `ashuanimates/mahabharata-10` and put this whole series in `episodes/ashu-mahabharata/` (one subfolder per reel: `reel01_barbarik/` … `reel10_vishwaroop/`). Open ONE PR for the series and keep committing to it after every reel. Don't wait for it to be merged.

===============================================================
## 0.2 Study our past work BEFORE you build (about 1–2 hours, it saves days)
Read these, open the code, and render a few still frames of the existing compositions so you can SEE our current level. Then make this series look BETTER.

**Rules and lessons (read in this order)**
1. `AGENTS.md`: the studio rules (some change for this series, see 0.4)
2. `memory/MEMORY.md`, then especially:
   - `memory/bharata-ep1-build.md`: the whole Mahabharata build recipe: voices with their IDs, motion keyframes (`kp`/`kpo`, head lags arms by 4–5 frames), cast and set library, music cues, mix lessons (keep SFX hits in the gaps between lines, never on a word), chunked rendering, the "hand-drawn horse read as a goat — leave animals out unless built properly" lesson
   - `memory/jyotiq-mahabharat-series.md`: series lessons, text-accurate looks (Bhishma all in white, Parashurama with jata/deer-skin/axe), viral hooks that worked, the Arjuna special built in a golden-hour Kurukshetra look, and the viral checklist that was applied
   - `memory/reel-wording-third-person-check.md`: re-read every Hindi line as an outside viewer before voicing
   - `memory/elevenlabs-save-credits.md`, `memory/navagraha-ep1-build.md`, `memory/jyotiq-chhathi-maiya-reel.md` (voice, timing, auto-ducking mix pipeline)
   - `memory/jyotiq-scriptural-character-designs.md` and `memory/jyotiq-painted-deity-style.md` (+ `jyotiq-marketing/PAINTED-DEITY-STYLE.md`): how we design deities with dignity
3. `templates/episode/`: a complete example episode folder (from Bharata Ep6): SCRIPT.md, BOARD.md, REPORT.md, CAPTION.md, `gen_vo.py`, `gen_audio.py`, `stills.sh`, `review.sh`, `board.sh`, `render_final.sh` and `tools/` (`vo_prep.py`, `word_times.py`, `mix.py`, `pick_takes.py`, `voice_match.py`, `audition_score.py`, `lines.py`, `sil_dump.py`). **Copy this folder as the starting point for every reel.** Don't rewrite what already works.

**Code to reuse (in `video/src/Jyotiq/`)**
- `bharata/special/`: **the closest match to the reference reel.** `world.tsx` already has a golden-hour sky, light rays, the Kurukshetra plain, a dense army, arrow volleys and chariots; `arjuna.tsx` has an Arjuna close-up; `cast.tsx` has a Bust system; `props.tsx`; `Episode.tsx` (`BharataSpecialReel`) shows the full reel structure with Tiro Devanagari Hindi captions. Start your world and look from here.
- `bharata/ep1` to `ep7`: the cast and sets you can reuse or improve:
  - ep1: Shantanu, Devavrata (bow + quiver), old Bhishma (white beard); RiverSet (storm/dawn/dusk/mist), CourtSet (elephant throne), WarSet (Kurukshetra), ArrowDam, Vortex, Splash
  - ep2: FisherSet, HeavenLight, FlowerRain, Boat, CrownProp
  - ep3: Amba and sisters, Shalva, Shikhandi; ForestSet with seasons, PalaceGate, ShivaBlaze
  - ep4: Vyasa, Satyavati; Storm, LampRow, NightArch, MantraRing, Sepia
  - ep5: Kunti (detailed face + ornaments), Surya, Durvasa, Adhiratha, Pandu, **baby Karna with kavach + kundal**, Basket, NightRiver, DawnRiver, SunMandala
  - ep6: Bhishma vs Parashurama (text-accurate looks), `Board6.tsx` (how we make a storyboard: frame i = panel i)
  - ep7: the Ekalavya episode (reuse and improve it for reel 3)
- `motion.tsx`, `music.ts`, `reelKit.tsx`, `theme.ts`: shared motion, music and theme helpers
- `navagraha/`, `chhath/`, `manthan/`, `kyahota/`: more deities, gods in the sky, light effects
- `video/src/Root.tsx` is shared by every composition: re-read it right before editing, add only your new imports and `<Composition>` entries, and never change other entries.

**What to do with all this**
- Render 1–2 key frames from each of `BharataSpecialReel`, Bharata Ep5, Ep6 and Ep7 (`npx remotion still …`). Put them next to frames from the reference reel and write in `episodes/ashu-mahabharata/LOOK_GAP.md`: what our kit already does well, and exactly what must improve to beat the reference (for example: richer painted texture, softer light, more depth layers, better faces, smoother motion, fuller armies).
- Then build an UPGRADED shared kit for this series in `video/src/Ashu/mahabharata/kit/` (cast, sets, camera, captions, end card), starting from copies of the Bharata files. Never edit the old episode files: copy them.
- Reuse and upgrade our existing characters (Bhishma, Drona, Arjuna, Karna, Kunti, Surya, Vyasa, Parashurama…) instead of starting from zero, so their looks stay consistent and you save time. Build the new ones (Krishna, Barbarik, Shakuni, Abhimanyu, Draupadi, Yudhishthira, Ashwatthama, the Yaksha) in the same upgraded kit.

===============================================================
## 0.3 Voices we already own (reuse them, no new voice slots needed)
The ElevenLabs account is at its custom-voice limit (30/30), so use voices that already exist. Audition with the reel 1 hook line only, use `audition_score.py` / `voice_match.py` + earshot to compare, and pick by clarity and gravity:
- Narrator candidates: **Kaal `sOZQ1ppVsWN9p0pWlPgY`** (our proven deep narrator, slow ~1.9 words/s), Aarush (narrated Kumbhakarna and Narada), Cosmic Sage. Pick ONE narrator for all 10 reels.
- Character voices for quoted lines (optional, only where they lift the moment):
  - Arjuna = Vikrant `y6Ao4Y93UrnTbmzdVlFc`
  - Drona = Sanjay `PboFIQ6kckfADmG3UQYF`
  - Duryodhana = Natraj Angry `TPHe6aPcCSoCbU7ryZ4j`
  - Bhishma = Jyotiq Devavrata `ydep2pifhkLBx2La9VQl`
  - Surya = Neel `PnaKthDVqB7PvUN6iU48`
  - Kunti (for a mother's voice, e.g. Barbarik's mother) = `Ahnx2u9fkwql36C7fY50`
  - Parashurama/Shiva = Shiv (library)
  - Krishna: choose the calmest, warmest existing male voice in the library
- The pipeline: `gen_vo.py` (per line) → `pick_takes.py` (whisper picks the clearest take) → `vo_prep.py` (trims, joins, phrase cuts) → `word_times.py` (word timings for captions) → `mix.py` (auto-ducking music + SFX). Use it as it is, and improve it only if needed.
- Music: `gen_audio.py` with the ElevenLabs Music API, one cue per scene (text prompts ≤200 characters). Wordless choir only in the most intense cues. SFX via the ElevenLabs sound-effects API.
- Judge all audio with **earshot** (`.agents/skills/earshot`). You cannot hear, so quote its numbers in REPORT.md.

===============================================================
## 0.4 Studio rules that CHANGE for this series (this series is for Ayush's own account @ashuanimates, not the Jyotiq brand)
These overrides apply ONLY to the 10 reels in this brief. Everywhere else, AGENTS.md stays as written.
1. **No approval gates.** The scripts below are already approved and production is approved. Skip "script first" and "storyboard first → wait for changes". Make the storyboard for yourself (stills via `board.sh`), check it against the brief and go straight on to building. Don't wait for Ayush between reels.
2. **No Jyotiq branding at all.** No brand open, no "JYOTIQ PRESENTS", no zodiac-wheel logo, no app-download panel, no app-feature ending, no jyotiq.ai. The end card is the series card from the brief ("महाभारत · भाग N/10", next teaser, "Follow @ashuanimates").
3. **ElevenLabs budget:** credits are fine for this series. Still check the balance once before starting, one take per line normally, and up to 2 extra takes on a line only for a mispronounced name or flat delivery. No need to ask before those retakes. Log the total characters used in PROGRESS.md.
4. **No Vertex / Veo / Gemini spending** for this series (it's a different account's content). Free image tools (`hf-video` with `HF_TOKEN`) are allowed; otherwise draw in code with our kit.
5. **Keep these studio rules**: re-read every Hindi line as an outside viewer before voicing; third-person narration; gods with dignity; no gore, no fear-selling; looks true to the Mahabharata text (not TV-serial copies); Remotion `--concurrency=2` (drop to 1 on memory errors); watch disk with `df -h` and delete intermediate frames when a reel is done; never `rm -rf` an absolute path; render in chunks as in `render_final.sh`.
6. **Delivery:** renders never go in git. For every reel: `gh release create ashu-mahabharata-reelNN-v1 <mp4> <cover.jpg> --notes-file <REPORT.md>`, attach the MP4 + cover in the Devin chat, and commit the source, SCRIPT.md, BOARD.md, CAPTION.md, REPORT.md and PROGRESS.md to the series branch.
7. When the series is done, add a memory note `memory/ashuanimates-mahabharata-10.md` (what you built, voices used, kit location, lessons) plus a line in `memory/MEMORY.md`, and commit it.

===============================================================
## 0.5 How this fits the rest of the brief
- Where the brief below says "build the system once in reel 1", that means: copy and upgrade OUR existing kit and pipeline (0.2–0.3). Don't start from an empty project.
- Where the brief gives exact numbers (fps, loudness, safe zones, caption timing), follow the brief. Where our studio has a proven tool for it (word_times.py, mix.py, earshot, render_final.sh), use the tool to hit those numbers.
- If our existing art for a character is weaker than the reference's quality bar, upgrade it. The goal is to BEAT the reference reel, not to match our old episodes.

(The full production brief follows.)

# MAHABHARATA — 10 REEL SERIES for Instagram @ashuanimates
# FULL PRODUCTION BRIEF FOR DEVIN (AUTONOMOUS RUN)

Read this whole brief once before you start. It is long on purpose: it is everything you need to make 10 premium animated reels without asking me anything.

===============================================================
## PART A — THE MISSION AND THE RULES OF THE RUN
===============================================================

### A1. What you are making
A 10-episode series of vertical, animated Hindi storytelling reels about the most powerful moments of the Mahabharata. Each reel is about 60–80 seconds: a deep cinematic narrator voice tells the story, painted 2D animation shows it, and Hindi captions appear word by word in perfect time with the voice. The goal is reels people watch to the very end, replay, share and save. The quality bar is "the best animated mythology reel on Instagram", not "a slideshow with a voice".

### A2. Run all 10 reels by yourself, one after another
- Finish reel 1 completely, deliver it, then start reel 2 straight away, and so on until reel 10 is delivered.
- DO NOT wait for my approval between reels. DO NOT ask me questions. When something is unclear, choose the option that gives the best viewer experience, write the decision in PROGRESS.md and keep going.
- Stop only if you are completely blocked (for example, no way at all to generate any voice, or the render machine can't run). Then send ONE short message saying exactly what you need, and continue as soon as it's solved.
- If your session restarts or you lose context: open PROGRESS.md, read which reels are done, and continue from the next unfinished reel. Never redo a finished reel.

### A3. The reference reel I attached
- I attached a viral animated reel (the Barbarik story). Use it as a STYLE AND QUALITY reference ONLY: study its colours, painted texture, lighting, pacing, camera motion, caption style and how it uses visual metaphors (dot-armies, a weighing scale).
- DO NOT copy its frames, drawings, characters, audio, music, wording, watermark or account name. Every image, every character and every sound in our reels must be newly made by you. Our scripts are already written in new words (Part F).
- Before building, watch it frame by frame (grab frames with ffmpeg every 0.5 s), and write a 10–15 line "what makes it good" note in /style/REFERENCE_NOTES.md: shot length, how often the camera moves, colour palette (hex codes), caption size and position, how the visuals change on key words. Aim to MATCH OR BEAT that level in every reel.

### A4. Use the free plan efficiently (I have about 10 days)
- Build the whole production system ONCE during reel 1: the Remotion project, scene and camera components, the caption engine, the audio pipeline, the QA scripts and the character library. Reels 2–10 should only need new art, the script and the timings.
- Reuse characters across reels (the same Krishna, Arjuna, Bhishma, Drona, Karna, Bhima, Yudhishthira and Draupadi wherever they appear).
- Check with still frames (ffmpeg frame grabs), not full renders. Render each reel at most 2–3 times in full.
- Don't waste time on tiny perfections no viewer will notice. Spend effort where viewers look: faces, the hook, the key reveal moments, caption sync and the voice.

### A5. Files and progress tracking
```
/mahabharata-series
  PROGRESS.md            ← status of every reel, decisions, output paths
  CREDITS.md             ← every music/SFX/font source + licence
  /style
    STYLE.md             ← the master visual style prompt + palette
    REFERENCE_NOTES.md
    /characters          ← one folder per character: master design + poses + expressions
  /template              ← reusable Remotion components
  /reels/reel01_barbarik ... /reels/reel10_vishwaroop
      script.txt  voice/  art/  timings.json  src/
  /outputs/reel01_barbarik/  reel01.mp4  cover.jpg  caption.txt  pinned_comment.txt
```

===============================================================
## PART B — VISUALS: BEST OF THE BEST
===============================================================

### B1. One style for the whole series
Painted, cinematic 2D illustration, like a high-end animated short or a premium storybook come to life:
- Flat but rich shapes with soft painterly shading, subtle brush texture, and a light paper/film grain over everything (2–4% opacity, animated so it doesn't look frozen)
- Strong lighting design: warm golden rim light on characters, soft volumetric light rays, glowing particles (embers, dust, fireflies), atmospheric haze between depth layers
- Deep, rich shadows, never flat grey. Every frame has a clear light source
- Faces are dignified, expressive and beautiful: large expressive eyes, clear eyebrows that show emotion, Indian features, classical jewellery and tilak, natural skin tones (Krishna blue)
- NOT cartoonish, NOT clip-art, NOT stiff, NOT generic AI-slop. If a frame looks cheap, redo it

### B2. Colour palette (write the exact hex values into STYLE.md and stick to them)
- Dusk sky: amber #E8A85C → rose #C9776A → slate blue #4A5872 → night #1C2333
- Earth and battlefield: ochre #B08A55, dust #8C7457, dark soil #3B2F26
- Gold accents (crowns, armour, glow): #F2C46D with bright highlights #FFE3A3
- Divine light (Krishna, gods, boons): soft white-gold #FFF4D6 with a blue aura #8FB8FF
- Danger and revenge (Shakuni, Ashwatthama, curse moments): deep red #8E2B2B, ember orange #E0602F
- Each reel may lean on one mood colour (for example Karna = sun gold, Ashwatthama = cold night blue, Draupadi = red and gold), but always inside this palette

### B3. Characters: a consistent character bible
Make ONE master design per character before animating, saved in /style/characters/<name>/: a front view, a 3/4 view, side profile, full body, and 6 expressions (calm, angry, sad, shocked, determined, smiling). Use the SAME design in every reel.
- **Krishna**: blue skin, peacock feather in a gold crown, yellow pitambar, Vaijayanti garland, calm, knowing smile, soft divine glow around him
- **Arjuna**: lean warrior, white and gold armour, Gandiva bow, focused eyes
- **Bhima**: huge and muscular, mace, fierce brows
- **Yudhishthira**: calm, kind face, simple crown, white and pale gold
- **Nakula and Sahadeva**: young twins, lighter armour
- **Draupadi**: dark skin, fiery intelligent eyes, long open hair, red and gold saree, ALWAYS fully and modestly clothed
- **Bhishma**: tall, long flowing white beard and hair, white robes, silver armour, noble sorrow in his eyes
- **Drona**: grey beard, saffron and brown, bow, stern teacher's face
- **Karna**: golden armour fused to his chest, golden earrings, sun motif, proud but kind face
- **Duryodhana**: dark armour, gold crown, arrogant smirk
- **Dushasana**: rough, cruel face, dark red armour
- **Shakuni**: thin, sharp face, narrow eyes, dark green and maroon robes, a slight limp, dice in his hand
- **Barbarik**: young warrior, three glowing arrows in a quiver, blue-black bow, serene face
- **Ekalavya**: young tribal archer, simple cloth, feather ornaments, determined eyes
- **Abhimanyu**: 16-year-old warrior, light gold armour, brave, youthful face
- **Ashwatthama**: a gem glowing on his forehead (young); later hooded, with a scar where the gem was
- **Indra, Surya, Yaksha/Dharmaraja**: gods drawn as large, glowing figures in the sky

### B4. How to make the art
- Best option: if you have access to a good image model, generate each background and character pose with the master STYLE prompt + the character description, then cut characters out onto transparent layers. Use the same seed/style references for consistency.
- If not: draw with code (SVG/Canvas inside Remotion) using layered shapes, gradients, texture overlays and glow filters. Even then, aim for a painted, premium look, not flat clip-art.
- Every scene is built in LAYERS (at least 4) for real depth and parallax:
  1. Sky / far background (slowest movement)
  2. Mid background (mountains, palace, camp, army dots)
  3. Characters (with idle motion)
  4. Foreground elements (grass, smoke, banners, embers) moving fastest, slightly blurred
  5. Light and atmosphere on top (light rays, haze, particles, grain, vignette)
- Paint backgrounds at least 1.3x the frame size so the camera can pan and push without showing edges.

### B5. Animation and motion: nothing is ever still
- Camera: every shot has a slow, smooth camera move — push-in, pull-out, pan, tilt or a slight drift — with eased (ease-in-out) motion, never linear and never jerky. Typical push-in: 100% → 108–115% scale over the shot.
- Parallax: layers move at different speeds (sky 0.2x, mid 0.5x, characters 1x, foreground 1.4x).
- Character life: breathing (1–2% chest/shoulder scale), blinks every 3–5 s, hair, cloth and banners swaying, glowing items pulsing, small head turns and eye moves on key words.
- Effects: drifting embers and dust, flickering diya flames, moving clouds, light ray shimmer, water ripples, smoke.
- Reveals and key moments: use a combination of a fast push-in, a light flash, a short shake (2–4 px for 6–10 frames), a slow-motion feel and a deep sound hit. Save these big moments for the 2–4 biggest beats per reel so they keep their power.
- Transitions: mostly hard cuts timed to the voice; occasionally a light-flash cut, a match cut (shape to shape) or a smoke/ink wipe at a time or mood change. No cheesy slideshow transitions (no spins, no star wipes, no page curls).
- Shot length: 2–4 s on average. The hook shot is short and punchy. Emotional final shots may hold 4–6 s with slow motion.

### B6. Colour grade and finishing (every frame)
- A consistent final grade: slightly lifted shadows with a teal-blue tint, warm highlights, rich mid-tone contrast
- A soft vignette (10–20%), animated film grain, gentle bloom on light sources
- Make sure faces are always the brightest, clearest point in the frame when someone is speaking or the line is about them

### B7. Composition for vertical phones
- 1080x1920. Main subject in the centre or upper-centre third
- SAFE ZONES (Instagram covers these): keep faces, captions and important action out of the top 8%, the right 15% (like/comment/share buttons) and the bottom 20% (username and caption)
- Use big, readable shapes: these are watched on a small phone screen. One clear idea per shot

===============================================================
## PART C — VOICE: THE BEST NARRATION POSSIBLE
===============================================================

### C1. Choosing the voice
- First check the ElevenLabs account balance. The whole series is about 9,000 characters of Hindi.
- IF ElevenLabs has enough credits:
  - Model: eleven_v3 if available (best emotion), otherwise eleven_multilingual_v2
  - Voice: test 3 candidate voices on the reel 1 hook line only (cheap) and pick the best deep, warm, cinematic Hindi male storyteller — like a temple katha narrator or a film trailer voice: rich bass, clear Hindi pronunciation, slow and weighty, emotional but not over-acted
  - Settings to start from: stability 0.40–0.50, similarity_boost 0.80, style 0.25–0.35, speaker boost ON. Speed slightly slow (0.9–0.95)
  - Use the SAME voice and settings for all 10 reels, so the series has one recognisable narrator
  - Write the chosen voice name/ID and settings into PROGRESS.md
- IF ElevenLabs does NOT have enough credits for all 10 reels: use the free edge-tts voice hi-IN-MadhurNeural (rate -8%, pitch -4Hz) for ALL 10 reels. Don't mix providers within the series.

### C2. Generating the voice
- Generate the voice LINE BY LINE (one API call per script line). This gives control over pauses and timing, and you only regenerate one line if something is wrong.
- Use the ElevenLabs "with timestamps" endpoint (text-to-speech/{voice_id}/with-timestamps) so you get character-level timing for every line. Save it next to the audio.
- Respect the "..." marks: they mean a dramatic pause. Keep the "..." in the text for natural phrasing, and ALSO add silence when joining (see C3).
- Quoted dialogue ("...") should sound like the character speaking: the narrator can soften or lower his voice for Krishna, firm it up for warriors. Don't add separate voices unless the budget is clearly enough. One great narrator is better than many average voices.
- Pronunciation: listen to (transcribe) every line. If a name is mispronounced (बर्बरीक, घटोत्कच, अश्वत्थामा, शिखंडी, दुःशासन, एकलव्य, विश्वरूप, गांडीव), fix it by adjusting the spelling slightly or adding a comma, and regenerate ONLY that line. At most 1 retake per line.
- Trim silence at the start and end of every line (keep 30–50 ms), add 10 ms fades to avoid clicks.

### C3. Building the voice track
- Join the lines with pauses: 0.35 s between normal lines, 0.6–0.8 s after the hook line and at "..." line ends, 1.0 s before the final line of the reel (the emotional landing).
- Clean the voice: gentle high-pass at 80 Hz, a light de-esser, mild compression (2:1), make it sound warm and close.
- Final voice loudness: about -14 LUFS integrated for the whole mix, true peak below -1 dBTP.
- Save voice.wav (voice only) and the final timeline of where every line starts and ends (timings.json).

===============================================================
## PART D — SYNC: THE MOST IMPORTANT TECHNICAL RULE
===============================================================
The voice is the clock. Every caption, cut, camera move and sound effect is placed from the REAL audio timing, never guessed.

### D1. Getting exact word timings
1. Primary: the ElevenLabs with-timestamps data (character-level). Group characters into words (split on spaces), and for each word take the start of its first character and the end of its last one. Add each line's offset in the joined track.
2. Fallback (edge-tts, or to double-check): run forced alignment / whisper word timestamps (whisper large-v3 or whisperX, language hi) on the final voice.wav. Then MATCH the recognised words back to OUR script text (always show our exact script words on screen, never whisper's spelling).
3. Save everything to timings.json: for every line {text, start, end}, for every word {word, start, end}.
4. Sanity check: no word shorter than 0.08 s, no gaps inside a line longer than 0.5 s unless there's a "...". Fix outliers by spreading time evenly between their neighbours.

### D2. Caption sync
- Each word appears exactly when it begins to be spoken (0–2 frames early is OK, never late). Animate each word in with a quick 4–6 frame pop (opacity 0→1, scale 92%→100%, slight upward slide).
- The current word being spoken is highlighted (gold #F2C46D or brighter white with a glow); earlier words stay white.
- Show captions as short PHRASES of 2–5 words (break at natural pauses and punctuation), never a full long sentence. Clear the phrase when the next one starts. Max 2 lines on screen.
- Keep Devanagari words whole: never split a word, never break a conjunct or matra across lines.
- Captions in the hook (first 2 s) can be extra large.

### D3. Picture sync
- Every shot cut lands on the START of a line, or on a strong word inside it (within ±2 frames).
- Key words get a visual action at the exact moment they're spoken. Examples: "एक पल।" → flash + title card; "सिर" → white flash; "हे गोविंद!" → blue light descends; "विश्वरूप" → the cosmic form explodes outward; numbers ("बीस दिन", "पच्चीस") → the number appears big on screen exactly on the word.
- Camera moves start on a line start and ease out before the next cut.
- Characters' head turns, eye moves and gestures happen on the words that mention them.

### D4. Sound effect sync
- SFX hits land on the exact frame of their visual event (arrow release, flash, dice landing, sword breaking, conch).
- Big booms land on the key words above.
- Check after rendering: extract 10 key moments and confirm with timecodes that sound, caption and picture events happen within 1 frame of each other.

### D5. The end
- The last spoken word should be followed by about 1.5–2 s of music and visuals breathing, then the end card for about 3 s. The video ends on the end card with music fading. Never cut the voice off.

===============================================================
## PART E — MUSIC, SOUND DESIGN AND FINAL MIX
===============================================================
- Music: cinematic Indian score: low drone (tanpura/strings), slow tabla or dhol pulse, damru for tension, bansuri flute + temple bells for emotional and divine moments, a big percussion hit for reveals. Use only royalty-free / CC0 / properly licensed music (or generate it if you have a music model). Write every source and licence into CREDITS.md. Never use the reference reel's music or any copyrighted film song.
- Music structure follows the story: mysterious build in the hook → steady pulse during the setup → rising tension towards the twist → a big hit or silence at the twist (a moment of silence before the biggest line is very powerful) → emotional, soft resolution at the end.
- Music edits land on musical bars where possible. No abrupt music cuts unless it's an intentional dramatic silence.
- Sound design: wind and distant battlefield ambience, armour clinks, bow string stretch and arrow whoosh, fire crackle, thunder for divine anger, water for river and lake scenes, crowd murmur for the court, a heartbeat for tension.
- Mix levels: voice is always king. Music under the voice at about -24 to -28 LUFS short-term (duck it 8–12 dB under speech with smooth 150–300 ms attack/release), and let the music rise in pauses and at the end. SFX should be felt but never cover a word.
- Final master: -14 LUFS integrated, true peak ≤ -1 dBTP, AAC 320 kbps 48 kHz stereo.

===============================================================
## PART F — THE 10 SCRIPTS (use these EXACT Hindi lines for the voice)
===============================================================
"..." = a dramatic pause. Each numbered line below is one voice line, and the SHOTS are mapped to the same numbers. Create more shots inside a line if it's longer than about 4 s.

---------------------------------------------------------------
### REEL 1 — बर्बरीक: एक पल का योद्धा
MOOD COLOUR: dusk amber + divine white
HOOK TEXT (on screen 0–2 s): "महाभारत 1 पल में खत्म?"
1. एक योद्धा था... जो पूरा महाभारत एक पल में खत्म कर सकता था।
2. पर श्री कृष्ण ने उसे युद्ध से पहले ही रोक दिया।
3. नाम था बर्बरीक। घटोत्कच का बेटा... भीम का पोता।
4. महादेव से उन्हें तीन बाण मिले थे। पहला निशान लगाता... तीसरा सब खत्म कर देता।
5. लोक कथा कहती है, कृष्ण ने हर योद्धा से पूछा — "अकेले लड़ो, तो ये युद्ध कितने दिन में खत्म करोगे?"
6. भीष्म बोले — बीस दिन। द्रोण बोले — पच्चीस।
7. बर्बरीक मुस्कुराए — "एक पल।"
8. पर बर्बरीक ने अपनी माँ को एक वचन दिया था — वो हमेशा हारने वाले का साथ देंगे।
9. कृष्ण समझ गए। जो सेना हारेगी, बर्बरीक उधर चले जाएँगे। फिर दूसरी हारेगी... तो उधर।
10. और आख़िर में... मैदान में बस एक बचेगा। बर्बरीक ख़ुद।
11. तब कृष्ण ब्राह्मण बनकर आए... और दान में माँगा — उनका सिर।
12. बर्बरीक ने बिना एक पल सोचे, अपना सिर दे दिया। बस एक इच्छा रखी — "मैं ये युद्ध देखना चाहता हूँ।"
13. कृष्ण ने उनका सिर एक पहाड़ी पर रखा... और वहीं से बर्बरीक ने पूरा महाभारत देखा।
14. आज दुनिया उन्हें खाटू श्याम कहती है... हारे का सहारा।
SHOTS:
1. A lone archer silhouette on a ridge at dusk above two vast armies of glowing dots; slow push-in, embers drifting
2. Krishna's raised palm in the foreground glowing softly; the archer freezes
3. Barbarik's reveal: low angle, his face lit gold; giant silhouettes of Ghatotkacha and Bhima behind him in the sky
4. Shiva's glow in the clouds → close-up of the quiver: three arrows light up one by one, a sound hit on each ("पहला... तीसरा")
5. Krishna in a torch-lit camp tent, warriors gathered; slow pan across faces
6. Bhishma close-up, "20" appears big on "बीस"; cut to Drona, "25" on "पच्चीस"
7. Barbarik's calm smile, push-in → black frame, title card "एक पल।" with a boom
8. A memory in sepia: his mother blessing him, her hand on his head
9. A big golden weighing scale: Barbarik's figure jumps from one pan to the other as each side tips
10. The dot-armies fade away to nothing; one lone figure stands on an empty, windy field
11. Krishna, disguised as a brahmin, hand held out; on "सिर" a slow push-in on Barbarik's eyes
12. Barbarik bows; a pure white flash fills the screen (no blood); his glowing head at peace with eyes open
13. The head on a hilltop in golden light, the battle playing out far below; slow pull-out
14. Today: a Khatu Shyam shrine glowing with hundreds of diyas, devotees with folded hands; slow push-in, flute + bells

---------------------------------------------------------------
### REEL 2 — कर्ण: जिसने अपनी मौत दान कर दी
MOOD COLOUR: sun gold
HOOK TEXT: "जिसे कोई नहीं मार सकता था"
1. सूरज का बेटा... जिसे कोई हथियार छू भी नहीं सकता था।
2. नाम था कर्ण। जन्म से ही उसके शरीर पर सोने का कवच था... और कानों में कुंडल।
3. जब तक कवच था, कर्ण को कोई नहीं मार सकता था। अर्जुन भी नहीं।
4. ये बात इंद्र जानते थे... अर्जुन के पिता।
5. सूर्य देव ने सपने में कर्ण को चेताया — "कल एक ब्राह्मण आएगा। कुछ भी दे देना... पर कवच मत देना।"
6. कर्ण मुस्कुराए — "मेरे दरवाज़े से कोई ख़ाली हाथ नहीं जाता।"
7. अगली सुबह, जब कर्ण सूर्य को जल चढ़ा रहे थे... इंद्र ब्राह्मण बनकर आए। और माँगा — कवच और कुंडल।
8. कर्ण जानते थे... ये उनकी मौत की माँग है।
9. फिर भी उन्होंने अपने ही हाथों से... कवच उतारकर दे दिया।
10. इंद्र का सिर झुक गया। बदले में उन्होंने कर्ण को एक अमोघ शक्ति दी... जो एक बार चलती, तो ख़ाली नहीं जाती।
11. कर्ण ने अपनी जान का कवच दे दिया... पर अपना वचन नहीं तोड़ा।
12. इसीलिए आज भी दुनिया कहती है — दानवीर कर्ण।
SHOTS:
1. Karna standing against a giant blazing sun, arrows bouncing off his glowing armour in slow motion
2. A newborn in a basket floating on a river at sunrise, golden armour shining; cut to grown Karna touching his earring
3. Arjuna's arrow shatters against the armour in a burst of sparks
4. Indra on clouds, thunder, his eyes narrowing
5. Karna asleep; Surya appears as a huge glowing face in the night sky, warning
6. Karna's gentle smile in the moonlight
7. Dawn at the river: Karna waist-deep, pouring water to the sun; a brahmin's shadow falls across the water
8. Karna's eyes close; a heartbeat
9. Golden light pours out as the armour comes away from his chest (no blood, only light); he holds it out with both hands
10. Indra bows his head; a spear of white light (the Shakti) appears in Karna's hand
11. Karna without armour, standing tall in the sun
12. Wide hero shot, sun behind him, title text "दानवीर कर्ण" on the word, warm flute

---------------------------------------------------------------
### REEL 3 — एकलव्य: वो अंगूठा जो इतिहास बन गया
MOOD COLOUR: forest green + earthy gold
HOOK TEXT: "गुरु ने माँगा शिष्य का अंगूठा"
1. एक गुरु... जिसने अपने शिष्य से उसका अंगूठा माँग लिया।
2. जंगल में एक भील लड़का रहता था — एकलव्य।
3. वो गुरु द्रोण से धनुष विद्या सीखना चाहता था। पर द्रोण ने मना कर दिया — "मैं सिर्फ़ राजकुमारों को सिखाता हूँ।"
4. एकलव्य लौट गया... पर हार नहीं मानी।
5. उसने मिट्टी से द्रोण की मूर्ति बनाई। और उसी को गुरु मानकर... रोज़ अभ्यास करने लगा।
6. एक दिन पांडवों का कुत्ता भौंकता हुआ जंगल में आया।
7. पलक झपकते ही... सात बाण। कुत्ते का मुँह बंद। पर एक खरोंच तक नहीं।
8. अर्जुन हैरान रह गए... ये तो मुझसे भी बड़ा धनुर्धर है।
9. द्रोण एकलव्य के पास पहुँचे। एकलव्य ने उनके पैर छुए — "गुरुदेव।"
10. द्रोण बोले — "अगर मैं तुम्हारा गुरु हूँ... तो गुरु दक्षिणा दो। अपने दाहिने हाथ का अंगूठा।"
11. एकलव्य ने एक पल नहीं सोचा... और अंगूठा गुरु के चरणों में रख दिया।
12. धनुष छूट गया... पर नाम अमर हो गया।
13. एकलव्य — गुरु भक्ति की सबसे बड़ी मिसाल।
SHOTS:
1. Drona's stern face in shadow, his hand held out; push-in
2. Dense forest with light rays; a tribal boy with a bow steps out
3. Drona's gurukul gate; Drona turns away, the gate closes on Ekalavya's face
4. The boy walking back into the forest, fists clenched
5. Hands shaping a clay statue of Drona → practice montage: day, rain, night, arrows hitting smaller and smaller targets
6. A dog running and barking through the trees
7. Seven arrows fly in one blur; the dog's mouth is gently held shut by the arrows, unhurt (gentle, almost comic)
8. Arjuna's shocked face, the bow lowering
9. Ekalavya touching Drona's feet; the clay statue behind them
10. Close-up of Drona's lips; a cold wind
11. Close-up of Ekalavya's hands → cut to a white flash → his bow falls to the ground in slow motion (nothing graphic)
12. The bow on the forest floor, light rays on it
13. Wide shot: Ekalavya with folded hands before the clay statue, forest glowing; title "गुरु भक्ति"

---------------------------------------------------------------
### REEL 4 — शकुनि: पासे जो बदला थे
MOOD COLOUR: dark green + revenge red
HOOK TEXT: "शकुनि के पासे किसकी हड्डियों के थे?"
1. महाभारत के वो पासे... जो कभी शकुनि का कहना नहीं टालते थे।
2. लोक कथा कहती है — इन पासों के पीछे एक भयानक बदला छिपा था।
3. शकुनि गांधार का राजकुमार था। उसकी बहन गांधारी का विवाह... अंधे धृतराष्ट्र से हुआ।
4. कहते हैं, फिर गांधार के पूरे राजपरिवार को कारागार में डाल दिया गया।
5. रोज़ बस एक मुट्ठी चावल मिलता... पूरे परिवार के लिए।
6. पिता सुबल ने फ़ैसला किया — सब भूखे रहेंगे... बस एक ज़िंदा रहेगा। सबसे चतुर बेटा। शकुनि।
7. एक-एक करके सब चले गए। शकुनि बस देखता रहा।
8. मरते हुए पिता ने कहा — "मेरी हड्डियों से पासे बनाना। वो हमेशा तुम्हारी मानेंगे।"
9. शकुनि ने वैसा ही किया। फिर कौरवों के बीच रहकर... मीठा बनकर... बदले की चाल चलता रहा।
10. वही पासे... जिन्होंने पांडवों से सब कुछ छीन लिया।
11. और उसी जुए से... कुरु वंश का अंत शुरू हुआ।
12. शकुनि दुश्मन नहीं था... वो एक बदला था।
SHOTS:
1. Extreme close-up of ivory dice rolling in slow motion on a dark board, a glow inside them
2. Shakuni's smirk half in shadow, candlelight flickering
3. A royal wedding: Gandhari tying a blindfold over her eyes; young Shakuni watching, fists clenched
4. Heavy prison doors slam; the family in a dark stone cell
5. One small bowl of rice in a beam of light; many hungry hands
6. Father Subala's tired face; he pushes the bowl towards Shakuni
7. Family silhouettes fading away one by one into darkness (gentle, no bodies); Shakuni's eyes in the dark
8. The father's hand on Shakuni's shoulder; dying whisper with red embers
9. Candlelit hands carving bone-white dice (stylised) → Shakuni smiling sweetly beside Duryodhana in the palace
10. The great dice hall: dice land, a red glow; Pandavas' crowns falling
11. The Kuru palace crumbling into dust and embers
12. Shakuni alone, looking up, a single tear catching red light; title "बदला"

---------------------------------------------------------------
### REEL 5 — अभिमन्यु: चक्रव्यूह का अकेला योद्धा
MOOD COLOUR: battle dusk + gold
HOOK TEXT: "16 साल का लड़का vs 7 महारथी"
1. सोलह साल का लड़का... और सामने कौरवों के सात महारथी।
2. अभिमन्यु — अर्जुन का बेटा।
3. कहते हैं, जब वो माँ सुभद्रा के गर्भ में था, अर्जुन ने चक्रव्यूह में घुसने का रास्ता बताया था।
4. पर बाहर निकलने का रास्ता सुनने से पहले... सुभद्रा सो गईं।
5. युद्ध का तेरहवाँ दिन। द्रोण ने चक्रव्यूह रचा। और अर्जुन दूर थे।
6. अभिमन्यु बोले — "मैं अंदर जाऊँगा।"
7. वो व्यूह तोड़ते गए... एक के बाद एक द्वार।
8. पर पीछे से जयद्रथ ने रास्ता बंद कर दिया। पांडव बाहर ही रह गए।
9. अंदर... अभिमन्यु अकेले थे।
10. द्रोण, कर्ण, कृप, अश्वत्थामा, दुर्योधन... सबने मिलकर घेरा।
11. धनुष टूटा, तो तलवार उठाई। तलवार टूटी... तो रथ का पहिया।
12. आख़िरी साँस तक... वो लड़ते रहे।
13. अभिमन्यु हार गए... पर उस दिन, असली हार कौरवों की थी।
SHOTS:
1. A young warrior from behind, facing seven giant dark silhouettes against a red sky
2. Abhimanyu's brave young face, light gold armour; push-in
3. Night palace: Arjuna speaking to pregnant Subhadra; his words float as glowing golden lines into a spiral
4. Subhadra's eyes close; the glowing spiral stops halfway
5. Top-down shot: a huge spiral formation made of glowing army dots; Drona at the centre
6. Abhimanyu raising his bow, his chariot charging
7. He bursts through ring after ring of light, a sound hit on each break
8. Jayadratha's forces closing the gate behind him; the Pandavas pushed back
9. Abhimanyu alone in the centre; silence; dust falling
10. The named warriors circling as silhouettes; names appear on each word
11. Quick hits on each word: bow snaps → sword breaks → he lifts a chariot wheel against the sunset
12. The wheel falling in slow motion; his last stand silhouette
13. An empty battlefield at dusk, a single peacock feather drifting down; flute

---------------------------------------------------------------
### REEL 6 — द्रौपदी: वो साड़ी जो ख़त्म नहीं हुई
MOOD COLOUR: red + gold + divine blue
HOOK TEXT: "भरी सभा... और सब चुप थे"
1. भरी सभा... और सब चुप थे।
2. जुए में युधिष्ठिर सब कुछ हार गए। राज्य, भाई, ख़ुद को... और फिर द्रौपदी को।
3. दुःशासन द्रौपदी को बालों से खींचकर सभा में ले आया।
4. द्रौपदी ने पूछा — "जो ख़ुद को हार चुका, वो मुझे दाँव पर कैसे लगा सकता है?"
5. भीष्म चुप। द्रोण चुप। धृतराष्ट्र चुप।
6. दुर्योधन ने आदेश दिया — "इसका वस्त्र खींचो।"
7. द्रौपदी ने सबकी ओर देखा... किसी ने नज़र नहीं उठाई।
8. तब उन्होंने हाथ जोड़े... और पुकारा — "हे गोविंद!"
9. दुःशासन साड़ी खींचता गया... और साड़ी बढ़ती गई।
10. खींचते-खींचते वो थककर गिर पड़ा... पर साड़ी ख़त्म नहीं हुई।
11. उसी पल भीम ने प्रतिज्ञा ली — "मैं दुःशासन की छाती चीरूँगा।"
12. और उसी सभा में... महाभारत का बीज बो दिया गया।
STRICT RULE FOR THIS REEL: Draupadi is ALWAYS fully clothed and dignified. The miracle is shown as endless cloth pouring out, never as exposure.
SHOTS:
1. A huge silent court hall, rows of nobles with bowed heads; slow push-in
2. Dice falling; Yudhishthira's crown, his brothers' weapons and finally Draupadi's name written in light vanishing
3. Dushasana dragging her by her hair through the doors (shown from a distance, dramatic shadows)
4. Draupadi standing tall, fiery eyes, asking the question; the hall echoes
5. Quick cuts: Bhishma looks down, Drona looks away, Dhritarashtra's blank face
6. Duryodhana on his throne, smirking, pointing
7. Draupadi's view: a ring of lowered faces
8. Her joined hands; on "हे गोविंद!" a blue-gold light pours down from the ceiling
9. Endless saree in many colours flowing like rivers through the hall, Draupadi untouched at its centre, glowing
10. Dushasana collapsing, exhausted, buried in cloth
11. Bhima rising, his fist clenched, fire behind him; boom on the vow
12. Krishna's calm silhouette in the sky above the hall; a slow fade to red

---------------------------------------------------------------
### REEL 7 — यक्ष प्रश्न: दुनिया का सबसे बड़ा आश्चर्य
MOOD COLOUR: misty dawn blue + soft gold
HOOK TEXT: "4 भाई... 1 झील... और 1 सवाल"
1. चार भाई... एक झील... और चारों बेजान पड़े थे।
2. वनवास में पांडव प्यासे थे। नकुल पानी लेने गया... लौटा नहीं।
3. सहदेव गया। फिर अर्जुन। फिर भीम। कोई नहीं लौटा।
4. आख़िर युधिष्ठिर पहुँचे। चारों भाई झील के किनारे पड़े थे।
5. एक आवाज़ गूँजी — "मैं यक्ष हूँ। पहले मेरे प्रश्नों का उत्तर दो... फिर पानी पीना।"
6. "धरती से भारी क्या है?" — "माँ।"
7. "आकाश से ऊँचा कौन?" — "पिता।"
8. "हवा से तेज़ क्या है?" — "मन।"
9. "सबसे बड़ा आश्चर्य क्या है?"
10. युधिष्ठिर बोले — "रोज़ लोग मरते हैं... फिर भी जो बचे हैं, वो सोचते हैं कि वो कभी नहीं मरेंगे।"
11. यक्ष प्रसन्न हुआ — "मैं एक भाई को जीवित करूँगा। चुनो।"
12. युधिष्ठिर बोले — "नकुल।"
13. "अर्जुन या भीम क्यों नहीं?"
14. "माँ कुंती का एक बेटा, मैं, ज़िंदा हूँ। माँ माद्री का भी एक बेटा ज़िंदा रहे।"
15. यक्ष ने अपना असली रूप दिखाया — वो स्वयं धर्मराज थे। और चारों भाई जी उठे।
SHOTS:
1. A still, misty forest lake at dawn; four figures lying motionless on the shore as if asleep; slow aerial push-in
2. The Pandavas resting under a tree, exhausted; Nakula walks off into the mist
3. One by one, Sahadeva, Arjuna and Bhima walk into the mist and disappear
4. Yudhishthira arriving, falling to his knees at the shore
5. The lake ripples; a giant crane shape of light rises from the water, glowing eyes
6. The word "धरती" floats big in the sky → the image of a mother holding a child
7. "आकाश" → a father lifting a son towards the sky
8. "हवा" → a swirl of wind turning into thoughts and stars around a head
9. The yaksha leans closer; music drops to near silence
10. Slow sunset over countless diyas going out one by one while others stay lit; Yudhishthira's calm face
11. The yaksha glowing brighter
12. Yudhishthira pointing at Nakula
13. The yaksha tilting its head
14. Two mothers as soft sky silhouettes, Kunti and Madri, side by side
15. The crane turns into Dharmaraja in golden light; the four brothers open their eyes and sit up; warm music

---------------------------------------------------------------
### REEL 8 — भीष्म: बाणों की शय्या
MOOD COLOUR: white and silver + sunset gold
HOOK TEXT: "मौत भी जिनसे पूछकर आती"
1. एक योद्धा... जिसे मौत भी बिना पूछे नहीं छू सकती थी।
2. देवव्रत ने अपने पिता के लिए प्रतिज्ञा ली — कभी विवाह नहीं करूँगा... कभी राजा नहीं बनूँगा।
3. आकाश से फूल बरसे। नाम पड़ा — भीष्म।
4. पिता शांतनु ने वरदान दिया — "मृत्यु तुम्हारी इच्छा से आएगी।"
5. युद्ध का दसवाँ दिन। अर्जुन के रथ पर आगे खड़ा था... शिखंडी।
6. भीष्म ने धनुष नीचे रख दिया। वो शिखंडी पर बाण नहीं चलाते थे।
7. और अर्जुन के बाण... एक के बाद एक... भीष्म तक पहुँचते गए।
8. भीष्म गिरे... पर ज़मीन पर नहीं। बाणों की शय्या पर।
9. सूर्य दक्षिणायन थे। भीष्म ने कहा — "मैं अभी नहीं जाऊँगा।"
10. अट्ठावन दिन... वो बाणों पर लेटे रहे। पूरा युद्ध देखा।
11. और जब सूर्य उत्तरायण हुए... तब भीष्म ने ख़ुद... अपनी आँखें बंद कीं।
SHOTS:
1. Old Bhishma's face in silver rim light, eyes calm; a shadow of death (a dark mist) stops before him
2. Young Devavrata in a royal court, raising his hand in a vow; gasps
3. Flowers raining from the sky over him; the name "भीष्म" glows on the word
4. King Shantanu's hand on his head, a golden glow passes into him
5. The battlefield, day 10; Arjuna's chariot with Shikhandi standing in front
6. Bhishma slowly lowering his bow, eyes closed, wind in his white beard
7. Streaks of light-arrows flying towards him (no wounds shown), slow motion
8. He falls backward in slow motion, and comes to rest on a bed of arrows; top-down shot at sunset
9. Close-up: his lips move, the sun low in the south
10. Time-lapse: the sun arcs, stars wheel, the battle rages far away while he lies still
11. The sun moves north; he smiles; his eyes close; a soft white light rises; temple bells

---------------------------------------------------------------
### REEL 9 — अश्वत्थामा: जो आज भी ज़िंदा है
MOOD COLOUR: cold night blue + ember red
HOOK TEXT: "वो आज भी ज़िंदा है?"
1. कहते हैं... वो आज भी ज़िंदा है।
2. अश्वत्थामा — गुरु द्रोण का बेटा। माथे पर जन्म से एक मणि थी।
3. युद्ध में भीम ने एक हाथी को मारा... जिसका नाम था अश्वत्थामा।
4. और द्रोण तक ख़बर पहुँची — "अश्वत्थामा मारा गया।"
5. बेटे का ग़म... द्रोण ने हथियार डाल दिए। और मारे गए।
6. अश्वत्थामा बदले की आग में जल उठा।
7. युद्ध की आख़िरी रात... उसने सोते हुए पांडव पुत्रों को मार डाला।
8. फिर उसने ब्रह्मास्त्र चलाया... उत्तरा के गर्भ में पल रहे बच्चे पर।
9. श्री कृष्ण ने उस बच्चे को बचा लिया।
10. और अश्वत्थामा से कहा — "तुम्हारी मणि छीन ली जाएगी। तुम्हारा घाव कभी नहीं भरेगा।"
11. "तीन हज़ार साल तक... तुम धरती पर भटकोगे। अकेले। बिना मौत के।"
12. मणि निकली... और माथे पर एक घाव रह गया।
13. लोक कथा कहती है... आज भी कुछ जंगलों में, एक घायल आदमी... घाव के लिए तेल माँगता दिखता है।
SHOTS:
1. A misty forest at night; a tall hooded figure walking away, a faint red glow on his forehead; slow push-in
2. Young Ashwatthama with a radiant gem in his forehead, Drona proud behind him
3. A war elephant falls in silhouette (no gore), dust rising
4. The message spreads as a whisper across the battlefield, reaching Drona
5. Drona's bow slipping from his hands, his eyes empty → a flash
6. Ashwatthama's eyes reflecting fire
7. Dark tents of the Pandava camp at night; a shadow moves between them; one red flash (nothing graphic)
8. A blazing streak of brahmastra fire tearing across the sky
9. Krishna raising his hand; a shield of blue light surrounds Uttara
10. Krishna's face, stern and calm; thunder
11. Ashwatthama on his knees in a storm, the years flowing past behind him as moving clouds
12. A flash as the gem is torn out in light; a glowing wound remains on his forehead
13. Modern-looking misty woods; the hooded figure turns slightly towards us… cut to black; text "क्या आपने सुना है?"

---------------------------------------------------------------
### REEL 10 — विश्वरूप: जब कृष्ण ने अपना असली रूप दिखाया
MOOD COLOUR: dawn gold → cosmic blue and fire
HOOK TEXT: "कृष्ण का असली रूप"
1. युद्ध शुरू होने वाला था... और अर्जुन ने धनुष नीचे रख दिया।
2. सामने दादा भीष्म थे। गुरु द्रोण। भाई, चाचा, दोस्त।
3. अर्जुन के हाथ काँपने लगे — "केशव... मैं अपनों को नहीं मार सकता।"
4. श्री कृष्ण मुस्कुराए। और वहीं, दो सेनाओं के बीच... गीता का ज्ञान दिया।
5. "आत्मा न जन्म लेती है, न मरती है। तू कर्म कर... फल की चिंता मत कर।"
6. पर अर्जुन का मन अब भी डगमगा रहा था।
7. तब कृष्ण ने अपना असली रूप दिखाया... विश्वरूप।
8. हज़ारों सिर... हज़ारों भुजाएँ... सूरज, चाँद, तारे... सब उनके अंदर।
9. अर्जुन ने देखा — भीष्म, द्रोण, कर्ण... सब उस रूप में समाते जा रहे थे।
10. कृष्ण बोले — "इनका अंत पहले ही तय हो चुका है। तू बस निमित्त बन।"
11. अर्जुन ने सिर झुकाया... और गांडीव उठा लिया।
12. और फिर शुरू हुआ... महाभारत।
SHOTS:
1. Wide dawn shot: a single chariot between two endless dot-armies; Gandiva slipping from Arjuna's hand
2. Arjuna's view: Bhishma, Drona and familiar faces across the field, one by one
3. Close-up of Arjuna's trembling hands, tears in his eyes
4. Krishna turns from the reins with a calm smile; time seems to stop (dust frozen in the air)
5. Soft glowing light patterns swirl around them; on "कर्म" the light brightens
6. Arjuna still looking down, troubled
7. BIG MOMENT: Krishna begins to glow and grow; the camera pulls back fast; on "विश्वरूप" the cosmic form explodes to fill the whole sky, with a huge hit
8. The cosmic form: countless faces and arms, galaxies, suns and moons inside his body, fire at the edges; tiny Arjuna kneeling below
9. Warriors as streams of light flowing into the form
10. Krishna's giant face, calm and kind, eyes like galaxies
11. Arjuna bowing, then lifting Gandiva; the conch blows
12. Wide shot: the armies charge, dust and light; end card "महाभारत · 10/10 — पूरी series देखें @ashuanimates"

===============================================================
## PART G — HOOK, END CARD AND VIRAL PACKAGING (every reel)
===============================================================
- 0.0–2.0 s: the strongest image + the HOOK TEXT big on screen from frame 1, plus the first voice line. No logo, no intro, no slow fade-in. The first frame must already be interesting (it's also used as a preview).
- Keep a "curiosity gap" visible: the hook asks a question that's only answered at the end.
- End card (about 3 s): series title "महाभारत · भाग N/10", the next reel's title as a teaser ("अगला भाग: ..."), and "Follow @ashuanimates". Make it look as premium as the rest (same style, gentle animation).
- Make the last frame loop well into the first frame where possible (a viewer who replays boosts the reel).
- Cover image (cover.jpg, 1080x1920): the most dramatic character close-up from the reel + the hook text in big bold Hindi (readable as a tiny thumbnail), inside the centre 1080x1350 area so it also looks good on the profile grid.
- caption.txt: line 1 = a strong hook question; line 2 = one-sentence teaser; then a question that invites comments (for example "आप होते तो क्या करते?" / "अगली कहानी किसकी देखना चाहेंगे?"); then 6–8 hashtags (#mahabharat #krishna #hindimythology #sanatandharma #animatedstory #reelsindia + 2 story-specific ones like #karna #barbarik #khatushyam).
- pinned_comment.txt: one line teasing the next reel.

===============================================================
## PART H — TYPOGRAPHY
===============================================================
- Caption font: a bold, highly readable Devanagari font, for example "Noto Sans Devanagari" Bold/Black, "Mukta" ExtraBold or "Hind" Bold (open-licence fonts only, recorded in CREDITS.md). Test that conjuncts (क्ष, त्र, द्ध, र्ब, त्थ) and matras render correctly.
- Caption size: about 64–76 px for normal phrases, up to 110 px for hook and title words. White text, a 3–4 px soft dark outline/shadow, and an optional subtle dark gradient behind the text area for readability.
- Title cards and hook text: a more decorative, strong Devanagari display font (for example "Tiro Devanagari Hindi" or "Rozha One"), gold with a soft glow.
- Never let text touch the safe-zone edges. Never use more than 2 fonts per reel.

===============================================================
## PART I — RENDER AND EXPORT
===============================================================
- 1080x1920, 30 fps, H.264 High profile, yuv420p, CRF 16–18 (or a bitrate of about 12–16 Mbps), +faststart
- Audio AAC 320 kbps, 48 kHz, stereo
- If memory or disk is tight, render in chunks and join them with ffmpeg concat (no re-encode), then mux the final audio
- Put the final MP4 + cover + caption + pinned comment in /outputs/reelNN_name/

===============================================================
## PART J — QUALITY CHECK BEFORE DELIVERING EACH REEL (mandatory)
===============================================================
Run this checklist and write the results into PROGRESS.md. Fix anything that fails, re-render once, then deliver.

VISUAL
- [ ] Grab 12 frames spread across the reel + the first frame + the frame at each key word. Look at every one.
- [ ] Every frame matches STYLE.md (palette, painted texture, lighting, grain). No frame looks cheap, flat or unfinished.
- [ ] Characters look the same as in the character bible and in earlier reels.
- [ ] No static shots: every shot moves. No jerky motion, no visible background edges during camera moves.
- [ ] Nothing important in the safe zones (top 8%, right 15%, bottom 20%).
- [ ] No gore, no nudity, no exposure (Draupadi fully clothed at all times).
- [ ] The hook text is on screen from the very first frame.

SYNC
- [ ] Transcribe the final rendered MP4 with whisper (word timestamps) and compare it with timings.json: every caption word appears within -2/+0 frames of the spoken word. Fix any drift.
- [ ] Every cut lands on a line start or a key word (±2 frames).
- [ ] 10 key moments checked: sound, caption and picture events within 1 frame of each other.
- [ ] Every caption word exactly matches the script text (correct spelling, no missing words).

AUDIO
- [ ] Every name is pronounced correctly.
- [ ] Voice clear over music at all times. No word covered by SFX or music.
- [ ] -14 LUFS integrated (±1), true peak ≤ -1 dBTP, no clipping, no clicks between lines.
- [ ] The voice is never cut off; music ends cleanly with the end card.

DELIVERY
- [ ] reelNN.mp4, cover.jpg, caption.txt, pinned_comment.txt in /outputs
- [ ] PROGRESS.md updated (done, path, voice used, any decisions)

===============================================================
## PART K — AFTER EACH REEL
===============================================================
1. Attach reelNN.mp4 and cover.jpg in this chat with one line: "Reel N/10 done: <title> (<duration>s)".
2. Commit the /outputs folder and PROGRESS.md to the repo (use Git LFS for MP4s if needed).
3. Immediately start the next reel. Don't wait for a reply.
4. After reel 10: post a final message with a list of all 10 reels, their durations and paths, and the recommended posting order (1 → 10, one reel per day, 7–9 pm IST).

===============================================================
## PART L — IF SOMETHING GOES WRONG
===============================================================
- An ElevenLabs error or no credits partway through: switch the WHOLE series to edge-tts hi-IN-MadhurNeural, re-voice any finished reels only if the time and usage allow it (otherwise note it in PROGRESS.md), and keep going.
- The image model isn't available or is too slow: draw with code (SVG/Canvas) in the same style. Never stop the series because of it.
- A render crash: render in smaller chunks, lower concurrency, clear temp files, and try again.
- Running low on usage: keep the quality of the reel you're on, finish it fully, deliver it, and note in PROGRESS.md where you stopped, so I can say "continue from PROGRESS.md".

===============================================================
START NOW WITH REEL 1. KEEP GOING UNTIL REEL 10 IS DELIVERED.
===============================================================
