# Look gap — existing Bharata kit vs reference / target

## What the existing studio kit already does well
- Bharata special/Ep5–Ep7 already have consistent code-drawn characters, readable silhouettes, Hindi captions, pure-frame animation and a proven voice/music/render pipeline.
- Bharata special has the closest battlefield language: golden-hour plain, dense dot armies, arrows and chariots.
- Ep7 proves a full autonomous pipeline: VO batch → whisper pick/clock → music cues/SFX → ducking mix → chunked render → report.
- The draft Ashu Barbarik code already has a strong atmospheric dusk battlefield, dot armies, scale metaphor, white-flash sacrifice and diya shrine ending.

## Gaps to close for @ashuanimates
- Faces in the current draft are readable but too simple/childlike; needs sharper brows, nose/lip detail, better eye shape, jewellery/tilak, and more dignified proportions.
- Clothing/armour is too flat; add layered gradients, shadow shapes, trim, ornaments and small painted highlights.
- Some backgrounds are broad flat fills; add more cloud texture, haze bands, depth silhouettes, foreground grass/smoke and light rays while keeping phone readability.
- Character hands/poses need improvement wherever they are large; avoid animal close-ups unless properly drawn.
- Need consistent series character bible (Krishna, Arjuna, Bhishma, Drona, Karna, Bhima, Yudhishthira, Draupadi, Shakuni, Ekalavya, Abhimanyu, Ashwatthama, gods) rather than one-off bodies.
- Need a true shared kit at `video/src/Ashu/mahabharata/kit/`; draft currently lives in `video/src/Ashuanimates/barbarik/`.
- Need no Jyotiq branding and the Ashu series end card.
- Need captions as short 2–5 word phrases, not whole long sentences. Draft shows full lines and must be improved if retained.
- Loudness is already close (-14.56 LUFS, TP -2.58), but final mux must be 48 kHz AAC 320k and SFX must not cover words.
