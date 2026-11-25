# AshuAnimates Mahabharata 10-reel series — progress

Branch: `ashuanimates/mahabharata-10`. Series overrides from the brief apply: no approval gates, no Jyotiq branding, end card `महाभारत · भाग N/10` + next teaser + `Follow @ashuanimates`, no Vertex/Veo/Gemini spend, renders never committed.

## Machine/setup log — 2026-11-26 04:20 IST
- Repo cloned to `/Users/ayushrajput/Documents/Codex/2026-09-11/act-as-a-senior-brand-identity/outputs/jyotiq-studio` from `tanwarayush/jyotiq-studio`.
- `setup.sh` was Ubuntu-only; patched for macOS and run successfully. It now skips system apt on Darwin, uses existing `whisper-cli`/ffmpeg/node 24, reuses an existing Python/earshot venv when present, and does not overwrite existing Mac symlinks/directories.
- `video/node_modules` in this clone is a local ignored symlink to the already installed studio `~/.kiro/crew/workspace/video/node_modules` because the package.json hash is identical and disk is nearly full. Do not commit it.
- Disk at start: about 1.1 GB free. Keep one reel of intermediates at a time; release/upload then delete intermediates.
- `ELEVENLABS_API_KEY` is set. `HF_TOKEN` is missing. `GCP_SA_KEY_JSON` is absent; no paid image/video generation.
- `whisper-cli` exists and the large-v3-turbo-q5_0 model exists at `~/.cache/whisper-models/ggml-large-v3-turbo-q5_0.bin`.
- Important: a prior/concurrent local studio build exists in `~/.kiro/crew/workspace` and was actively rendering `AshuanimatesBarbarik` when this repo was cloned. Do not run a second Remotion/whisper/heavy ffmpeg job while that render is active. Its output can be used as a draft/reference after QA, but canonical source must be committed here.

## Reference/study status
- Attached reference video: 58.943 s, 576x1248 screen recording with Instagram UI, h264+aac. Frames extracted every 0.5 s into ignored `episodes/ashu-mahabharata/frames/reference/`; contact sheets in same ignored folder.
- Reference notes: `style/REFERENCE_NOTES.md` (to keep updated).
- Existing-studio contact sheets made in ignored `frames/study/` from Bharata special, Ep5, Ep6 and Ep7.
- Gap notes: `LOOK_GAP.md` (drafted; update after viewing final reel 1).

## Reel status
| reel | title | status | notes |
|---|---|---|---|
| 01 | बर्बरीक: एक पल का योद्धा | in progress | Draft local render completed: 79.146 s, 1080x1920, 30 fps, H.264 yuv420p + AAC 320k/48k, 62 MB. Draft contact-sheet QA failed the quality bar because the front-facing figures read too childlike/clip-art. Shared kit created at `video/src/Ashu/mahabharata/kit/`; captions now chunk to 2–5 words; detailed Bharata-style profile busts are being integrated for Barbarik, Krishna, Bhishma and Drona before the final render. |
| 02 | कर्ण: जिसने अपनी मौत दान कर दी | not started | exact script in BRIEF.md |
| 03 | एकलव्य: वो अंगूठा जो इतिहास बन गया | not started | exact script in BRIEF.md |
| 04 | शकुनि: पासे जो बदला थे | not started | exact script in BRIEF.md |
| 05 | अभिमन्यु: चक्रव्यूह का अकेला योद्धा | not started | exact script in BRIEF.md |
| 06 | द्रौपदी: वो साड़ी जो ख़त्म नहीं हुई | not started | exact script in BRIEF.md |
| 07 | यक्ष प्रश्न: दुनिया का सबसे बड़ा आश्चर्य | not started | exact script in BRIEF.md |
| 08 | भीष्म: बाणों की शय्या | not started | exact script in BRIEF.md |
| 09 | अश्वत्थामा: जो आज भी ज़िंदा है | not started | exact script in BRIEF.md |
| 10 | विश्वरूप: जब कृष्ण ने अपना असली रूप दिखाया | not started | exact script in BRIEF.md |

## Voice decisions so far
- Prior local reel-1 batch used Kaal narrator `sOZQ1ppVsWN9p0pWlPgY`, Krishna `ovcrTRBELQPup0RNagdO` (Pranit), Barbarik `PnaKthDVqB7PvUN6iU48` (Neel), model `eleven_v3`, settings stability 0.45 / similarity 0.8 / style 0.3 / speaker boost on.
- Need verify names/pronunciation with earshot + transcripts before locking this as series narrator. Likely keep Kaal for all 10 unless QA fails.

## Immediate next steps
1. Wait for the active local reel-1 render to finish; do not start another heavy job.
2. Inspect draft MP4 frames and audio with earshot. Decide whether to use it as v1 or fix visual/audio issues and re-render once.
3. Copy required reel-1 assets into canonical output paths, write SCRIPT.md/BOARD.md/CAPTION.md/REPORT.md, commit source/docs, create GitHub release `ashu-mahabharata-reel01-v1`.
4. Refactor/reuse the Barbarik code into the requested shared kit at `video/src/Ashu/mahabharata/kit/` before reel 2; keep old Bharata files read-only.
5. Build reels 2-10 sequentially using exact scripts in `BRIEF.md`.

## Decisions
- The exact full production brief is copied to `episodes/ashu-mahabharata/BRIEF.md` so it survives session restarts/context compaction.
- Duration decision: Part A allows 60–80 s per reel. Reel 1 at 79.10 s is inside the approved range; do not compress it to 58 s. The exact script is 178 words and the narration should remain weighty.
- Because the original Mac studio already exists at `~/.kiro/crew/workspace`, setup does not replace it. This clone is the canonical git/PR copy; the original studio may be used read-only or as a render accelerator when it already contains dependencies/work.
- In case of conflict, Part 0 studio override wins over Part K: final MP4s/covers are release assets, not git commits.

## Reel 1 implementation checkpoint — 2026-11-26 04:36 IST
- PR opened: https://github.com/tanwarayush/jyotiq-studio/pull/1 (draft, series branch).
- Shared kit exists at `video/src/Ashu/mahabharata/kit/`:
  - `kit.tsx`: palette/gradients/fonts/camera/grain/motes/dot armies.
  - `world.tsx`: battlefield, camp, memory home, scale void, hilltop battle, shrine.
  - `cast.tsx`: original full-body Barbarik/Krishna/elders/mother/shrine-head/scale/props, now with gradient cloth/skin and improved eyes/faces.
  - `bust.tsx`: copied/upgraded Bharata-special profile bust system; series LOOKS added for `barbarik`, `krishna`, `krishnaBrahmin`; `warriorKnot` hair added; Krishna crown gets peacock feather; `RaisedPalm` hand prop added.
  - `captions.tsx`: reusable exact-word caption engine (2–5 word chunks, current word highlight), hook title and series end card.
- `video/src/Ashuanimates/barbarik/` now contains only Episode/scenes/timing; shared art is imported from the kit.
- Key reel-1 closeups now use profile busts: Barbarik reveal, Krishna question, Bhishma/Drona answers, `एक पल`, brahmin Krishna/Barbarik ask. This fixes the draft's biggest quality failure.
- Frame checks already inspected: detailed bust sheet looked substantially better; hook frame is lit with exact text from frame 0; end card exists but may need spacing polish.
- Missing `video/public/jyotiq/testimonial/captions.json` was copied from the existing Mac studio because Root.tsx otherwise cannot bundle. It is a 3.9 KB metadata file, not media.
- Typecheck command used: `cd video && npx tsc --noEmit --pretty false | grep -E 'Ashu/mahabharata|Ashuanimates'`; no series errors so far. Full `npm run lint` still fails on pre-existing unrelated old episodes (Board6 unused Sword, ep7 unused f, manthan ep6 unused imports, missing testimonial JSON before copy etc.). Do not edit those old episodes.
- Draft render was only a baseline. Final canonical render must be made from THIS clone after the bust/caption/end-card upgrades.
- Render lesson: Remotion did not follow a `public/ashuanimates/barbarik/mix.wav` symlink during bundling (404 inside the webpack temp bundle). The ignored media file must be physically copied into `video/public/...` before rendering. This copy is local-only and must not be committed.

## Reel 2 pre-production checkpoint — 2026-11-26 04:48 IST
- `reel02_karna/` created from the reel-1 pipeline. SCRIPT.md contains the exact approved Hindi lines and an outside-viewer wording check (no changes).
- Voices chosen: narrator Kaal `sOZQ1ppVsWN9p0pWlPgY`; Surya Neel `PnaKthDVqB7PvUN6iU48`; Karna Pavan M `HvtjkB4qXezhvD9lP84O`; Indra custom `HKtEa3piD69tFsCIdVpq`.
- ElevenLabs subscription check before Karna batch: used 26,272 / 144,456, remaining 118,184 characters. Karna batch estimate: 763 spoken chars, 1,124 tagged input chars, 15 one-take segments.
- Karna VO generation started locally in background; audio is ignored by git. Next steps after generation: `tools/transcribe.py`, adapt `tools/vo_prep.py` for 12 lines and repo timing path, synthesise/mix with `tools/score_mix.py` adapted to Karna, then build `video/src/Ashuanimates/karna/`.
- Reel 1 final render `barbarik_reel_v2.mp4` is running from the upgraded clone. Draft v1 is not final. After completion: inspect first/cover/12 spread/key frames, measure loudness/true peak/duration, transcribe final MP4 if possible, write REPORT/PROGRESS, release assets with gh release, commit+push.
- Reel 2 visual development started while reel 1 renders: shared kit now has Karna/no-armour Karna/Indra bust looks, `KarnaFigure`, `ShaktiSpear`, `KavachPiece`, `BabyBasket`, plus solar battlefield, Indra cloud and night-river worlds. `video/src/Ashuanimates/karna/scenes.tsx` has the 12-shot scene set. It still needs timing, Episode.tsx, Root registration, still-frame QA and fixes.
- Series scaffolding: all ten reel folders now exist. Reels 3–10 have exact raw script/shot sections copied from the approved brief into SCRIPT.md so future sessions never need the original scratch file. Production status remains: reel 1 rendering/QA, reel 2 audio generated + visual kit started, reels 3–10 not started.
- Added `reel01_barbarik/qa_final.sh`: probe, EBU R128/true peak, black/freeze detection, 12-frame contact sheet and key frames (hook, एक पल, sacrifice, hill, end card). Run it only after the current render finishes because the Mac allows one heavy job at a time.

## If a session restarts here — exact next actions
1. Check `tail /tmp/barbarik_final_render.log` and `ls video/out/ashuanimates-barbarik/barbarik_reel_v2.mp4`. If render is complete, run `bash episodes/ashu-mahabharata/reel01_barbarik/qa_final.sh` from the repo root/video context, inspect `review/final/contact12.png` and key PNGs visually, then finish REPORT/PROGRESS, render `AshuanimatesBarbarikCover`, copy caption/pinned files to the output folder, create GitHub release `ashu-mahabharata-reel01-v1` with MP4+cover, commit/push.
2. Then process reel 2 audio: `cd episodes/ashu-mahabharata/reel02_karna && /usr/local/bin/python3 tools/transcribe.py && /Users/ayushrajput/earshot/.venv/bin/python tools/vo_prep.py && /Users/ayushrajput/earshot/.venv/bin/python tools/score_mix.py`. These write `audio/vo/clock.json`, `audio/vo/vo.wav`, `audio/mix_final.wav`, and `video/src/Ashuanimates/karna/timing.ts` (repo). Copy the final mix physically to `video/public/ashuanimates/karna/mix.wav` before any render; symlinks fail in Remotion bundling.
3. Reel 2 code already present: `video/src/Ashuanimates/karna/scenes.tsx` and `Episode.tsx`. Still needed: register `KarnaEpisode`/`KarnaCover` in Root after reading Root, typecheck, render key stills, fix weak art, then full render/QA/release.
4. Never run Whisper/Remotion/big ffmpeg concurrently on this 8 GB Mac. Check `pgrep -fl "[r]emotion|[c]hrome-headless|[w]hisper-cli"` first.
