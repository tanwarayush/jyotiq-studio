# Barbarik reel report — @ashuanimates

## Final output

- Release: https://github.com/tanwarayush/jyotiq-studio/releases/tag/ashu-mahabharata-reel01-v1
- Master: `video/out/ashuanimates-barbarik/barbarik_reel_v2.mp4`
- Cover: `video/out/ashuanimates-barbarik/barbarik_cover.png`
- Duration: 79.146667 s (2,373 frames at 30 fps), inside the approved 60–80 s range
- Video: H.264 High, 1080×1920, 30 fps, yuv420p, CRF 12 delivery transcode
- Audio: AAC LC, 320 kbps, 48 kHz stereo
- Size: 63,797,874 bytes (about 61 MiB)
- Art: original React/SVG illustration and animation in `video/src/Ashuanimates/barbarik` plus the shared kit in `video/src/Ashu/mahabharata/kit/`; the supplied reference video was used only for broad direction, not for frames, drawings, audio, captions, wording, watermark or account name

## Final measured QA

Measured on `barbarik_reel_v2.mp4` with `qa_final.sh`:

- dimensions/frame rate: 1080×1920, 30/1 fps exact
- encoded frames: 2,373 video frames
- pixel format: yuv420p
- audio: AAC LC, 48 kHz, stereo, 317–320 kbps
- integrated loudness: −14.4 LUFS
- loudness range: 3.2 LU
- true peak: −2.6 dBTP
- black-frame detection: no hits
- freeze-frame detection: no hits

Review artefacts are in ignored `episodes/ashu-mahabharata/reel01_barbarik/review/final/` (`contact12.png`, `first.png`, `hook.png`, `ekpal.png`, `sacrifice.png`, `hill.png`, `endcard.png`, probe and loudness logs).

Visual inspection notes:

- frame 0 carries the exact hook `महाभारत 1 पल में खत्म?`
- the key `एक पल` close-up uses the detailed profile bust rather than the draft front-facing clip-art figure
- sacrifice is symbolic: white flash, no gore
- captions are short Hindi chunks with current-word highlight in the lower third
- end card contains `हारे का सहारा`, `महाभारत · भाग 1/10`, the Karna teaser and `Follow @ashuanimates`

## Voice

- Narrator: Kaal (`sOZQ1ppVsWN9p0pWlPgY`)
- Krishna: Pranit (`ovcrTRBELQPup0RNagdO`)
- Barbarik: Neel (`PnaKthDVqB7PvUN6iU48`)
- ElevenLabs model: `eleven_v3`
- One take per line/quote segment; no retakes
- Raw voice duration: about 92.88 s before preparation
- Prepared voice duration: 77.15 s, using pause reduction and tempo 1.130 without removing approved script words

## Captions

- Hindi word-by-word captions are generated from `video/src/Ashuanimates/barbarik/timing.ts`
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

Measured final premix with Earshot/FFmpeg:

- duration: 79.10 s
- integrated loudness: −14.4 LUFS
- loudness range: 3.2 LU
- true peak: −2.6 dBTP
- clipped samples: 0
- noise floor: −41.9 dBFS

## Visual structure

29 shot beats across 79.10 s, including the Kurukshetra dot-armies, Krishna stopping the archer, Barbarik's reveal and lineage, Shiva's boon, three arrows, the camp question, Bhishma/Drona answers, `एक पल`, mother's blessing, tipping golden scale, lone figure, Krishna as brahmin, white-flash sacrifice, peaceful head, hilltop watch and Khatu Shyam shrine.

The wide/action shots use the simpler full-body cast for readability at distance. Face-focused shots use detailed profile busts for Barbarik, Krishna, Krishna-as-brahmin, Bhishma and Drona.

## Delivery checklist

- [x] final MP4 rendered and checked
- [x] cover image 1080×1920
- [x] Instagram caption and pinned comment in `CAPTION.md`, `caption.txt` and `pinned_comment.txt`
- [x] audio mix measured
- [x] final video streams/duration checked
- [x] black/freeze scan completed
- [x] final report completed

## Before posting

- Turn on Instagram's AI-generated content label.
- Use the supplied cover image or a frame chosen inside Instagram.
- Do not add the reference account's watermark or name.
- Confirm the captions remain clear of Instagram's right action rail and bottom caption area on the target phone.
