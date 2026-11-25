# Barbarik reel report — @ashuanimates

## Output plan

- Format: vertical Instagram Reel, 1080×1920, 30 fps
- Timeline: 2,373 frames = 79.10 s
- Video: H.264, CRF 12, yuv420p
- Audio: AAC 320k, 48 kHz stereo, final mix normalised toward −14 LUFS
- Art: original React/SVG illustration and animation in `video/src/Ashuanimates/barbarik`; the supplied reference video was used only for broad style direction, not for frames, drawings, audio, captions, wording, watermark or account name

## Voice

- Narrator: Kaal (`sOZQ1ppVsWN9p0pWlPgY`)
- Krishna: Pranit (`ovcrTRBELQPup0RNagdO`)
- Barbarik: Neel (`PnaKthDVqB7PvUN6iU48`)
- ElevenLabs model: `eleven_v3`
- One take per line/quote segment; no retakes
- Raw voice duration: about 92.88 s before preparation
- Prepared voice duration: 77.15 s, using pause reduction and tempo 1.130 without removing script words

## Captions

- Hindi word-by-word captions are generated from `src/Ashuanimates/barbarik/timing.ts`
- Captions are white with a soft shadow in the lower third and are positioned away from the right-side Instagram control rail
- The script lines supplied by Ayush were not rewritten

## Music and sound design

Original synthesized audio only; no reference audio or sampled music.

- low tanpura-style drone
- slow synthesized damru/tabla pulse, ducked under speech
- three arrow whoosh/chime beats
- deep impact on Barbarik's `एक पल`
- restrained shimmer for Krishna interventions
- clean white-flash impact for the sacrifice, with no gore
- distant battle-air details under the hilltop shot
- soft flute and temple bells for the Khatu Shyam ending

Measured final premux mix with Earshot/FFmpeg:

- duration: 79.10 s
- integrated loudness: −14.4 LUFS
- loudness range: 3.2 LU
- true peak: −2.6 dBTP
- clipped samples: 0
- noise floor: −41.9 dBFS

## Visual structure

29 shot beats across 79.10 s, including the Kurukshetra dot-armies, Krishna stopping the archer, Barbarik's reveal and lineage, Shiva's boon, three arrows, the camp question, Bhishma/Drona answers, `एक पल`, mother's blessing, tipping golden scale, lone figure, Krishna as brahmin, white-flash sacrifice, peaceful head, hilltop watch and Khatu Shyam shrine.

## Delivery checklist

- [ ] final MP4 rendered and checked
- [x] cover image 1080×1920
- [x] Instagram caption and pinned comment in `deliverables/CAPTION.md`
- [x] audio mix measured
- [ ] final video streams/duration checked
- [ ] final report completed

## Before posting

- Turn on Instagram's AI-generated content label.
- Use the supplied cover image or a frame chosen inside Instagram.
- Do not add the reference account's watermark or name.
- Confirm the captions remain clear of Instagram's right action rail and bottom caption area on the target phone.

## Canonical-series QA update (2026-11-26)

- Duration is inside the brief's approved 60–80 s range: 79.10–79.146 s.
- Draft render stream check: 1080×1920, 30 fps, H.264, AAC 320 kbps, 48 kHz stereo; 62 MB at CRF 12.
- Draft contact-sheet inspection failed the series quality bar: the original front-facing figures read as too childlike/clip-art, especially Barbarik's reveal, the mother blessing and the shrine icon.
- Upgrade in progress before final delivery: shared kit moved to `video/src/Ashu/mahabharata/kit/`; captions now use short 2–5 word chunks; detailed Bharata-style profile busts are used for Barbarik, Krishna, Bhishma and Drona; hook text is exact from frame 0; series end card includes भाग 1/10 and the Karna teaser.
