import "./index.css";
import { Pitch as AstroRaagaPitch } from "./AstroRaaga/pitch/Pitch";
import { TOTAL as AR_PITCH_TOTAL } from "./AstroRaaga/pitch/theme";
import { PitchV4 as AstroRaagaPitchV4 } from "./AstroRaaga/pitch4/Pitch";
import { totalFrames as arV4Frames } from "./AstroRaaga/pitch4/theme";
import { PitchV6 as AstroRaagaPitchV6 } from "./AstroRaaga/pitch6/Pitch";
import { totalFrames as arV6Frames } from "./AstroRaaga/pitch6/theme";
import { PitchV7 as AstroRaagaPitchV7 } from "./AstroRaaga/pitch7/Pitch";
import { totalFrames as arV7Frames } from "./AstroRaaga/pitch7/theme";
import { PitchV8 as AstroRaagaPitchV8 } from "./AstroRaaga/pitch8/Pitch";
import { totalFrames as arV8Frames } from "./AstroRaaga/pitch8/theme";
import { DeckArt as AstroRaagaDeckArt } from "./AstroRaaga/pitch8/DeckArt";
import { Composition, Still } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { JobCopilotPromo, jobCopilotSchema } from "./JobCopilotPromo";
import { EKPANNA_TOTAL, EkPannaEp1 } from "./Karmeq/ekpanna/ep1/EkPannaEp1";
import { BarbarikCover, BarbarikEpisode } from "./Ashuanimates/barbarik/Episode";
import { TOTAL as BARBARIK_TOTAL } from "./Ashuanimates/barbarik/timing";
import { KarnaCover, KarnaEpisode } from "./Ashuanimates/karna/Episode";
import { TOTAL as KARNA_TOTAL } from "./Ashuanimates/karna/timing";
import { JyotiqEndSting } from "./Jyotiq/endSting";
import { JyotiqReelOpen, OPEN_TOTAL } from "./Jyotiq/brandopen/ReelOpen";
import { JyotiqTestimonial } from "./Jyotiq/testimonial";
import {
  JyotiqTestimonialV2,
  JyotiqTestimonialV2Sheet,
  V2_FRAMES,
} from "./Jyotiq/testimonialV2";
import {
  JyotiqKeyframes,
  JyotiqLaunch,
  JyotiqPalettes,
  JyotiqReel,
  JyotiqReelKeyframes,
  jyotiqSchema,
  keyframesSchema,
} from "./Jyotiq";
import { z } from "zod";
import {
  FIGHT_DEFAULTS,
  FightHook,
  FightHookKeyframes,
  FightHookSheet,
  fightHookSchema,
  fightKeyframesSchema,
} from "./Jyotiq/fight/FightHook";
import { HOOK_FRAMES } from "./Jyotiq/fight/cast";
import { bbReviewSchema, JyotiqBBReel, JyotiqBBReelKeyframes, JyotiqBBReelSheet } from "./Jyotiq/bbreel/BBReel";
import { BB_DEFAULTS, bbReelSchema, TOTAL as BB_TOTAL } from "./Jyotiq/bbreel/timeline";
import { KATHA_FRAMES, KathaTest, KathaTestSheet } from "./Jyotiq/katha/KathaTest";
import { JyotiqKathaReel, JyotiqKathaReelSheet, kathaSheetSchema } from "./Jyotiq/katha/KathaReel";
import { KATHA_REEL_DEFAULTS, kathaReelSchema, TOTAL as KATHA_TOTAL } from "./Jyotiq/katha/reelTimeline";
import { JyotiqShooterReel, JyotiqShooterReel2, JyotiqShooterSheet, SHOOTER2_TOTAL } from "./Jyotiq/shooter/ShooterReel";
import { STICKER_BAKE_H, STICKER_BAKE_W, StickerBake } from "./Jyotiq/shooter/lockup";
import { TOTAL as SHOOTER_TOTAL } from "./Jyotiq/shooter/timing";

import { EP1_TOTAL, ManthanEp1 } from "./Jyotiq/manthan/Episode1";
import { EP3_GFX_TOTAL, ManthanEp3FxTest, ManthanEp3GfxTest, ManthanEp3StageTest, ManthanEp3Test } from "./Jyotiq/manthan/ep3/Test3";
import { EP3_TOTAL, ManthanEp3 } from "./Jyotiq/manthan/ep3/Episode3";
import { ManthanEp4GfxTest, ManthanEp4Test } from "./Jyotiq/manthan/ep4/Test4";
import { EP4_TOTAL, ManthanEp4 } from "./Jyotiq/manthan/ep4/Episode4";
import { GFX_AT as EP5_GFX_AT, ManthanEp5GfxTest, ManthanEp5Test } from "./Jyotiq/manthan/ep5/Test5";
import { ManthanEp6Test } from "./Jyotiq/manthan/ep6/Test6";
import { GFX6_AT, ManthanEp6GfxTest } from "./Jyotiq/manthan/ep6/GfxTest6";
import { EP6_TOTAL, ManthanEp6 } from "./Jyotiq/manthan/ep6/Episode6";
import { ManthanEp7Test } from "./Jyotiq/manthan/ep7/Test7";
import { EP7_TOTAL, ManthanEp7 } from "./Jyotiq/manthan/ep7/Episode7";
import { EP8_TOTAL, ManthanEp8 } from "./Jyotiq/manthan/ep8/Episode8";
import { DiwaliD1Test } from "./Jyotiq/diwali/d1/TestD1";
import { D1_TOTAL, DiwaliD1 } from "./Jyotiq/diwali/d1/DiwaliD1";
import { DiwaliSharedTest } from "./Jyotiq/diwali/shared/TestShared";
import { DiwaliD2Test } from "./Jyotiq/diwali/d2/TestD2";
import { D2_TOTAL, DiwaliD2 } from "./Jyotiq/diwali/d2/DiwaliD2";
import { DiwaliD3Test } from "./Jyotiq/diwali/d3/TestD3";
import { D3_TOTAL, DiwaliD3 } from "./Jyotiq/diwali/d3/DiwaliD3";
import { Story3, STORY3_TOTAL } from "./Jyotiq/diwali/story3/Story3";
import { BoardsD4, D4_PANELS } from "./Jyotiq/diwali/story4/Boards";
import { Story4, STORY4_TOTAL } from "./Jyotiq/diwali/story4/Story4";
import { Story5, STORY5_TOTAL } from "./Jyotiq/diwali/story5/Story5";
import { FatherTrail, FATHER_TOTAL } from "./Jyotiq/fathertrail/FatherTrail";
import { GovCarousel, SLIDES as GOV_SLIDES, SW as GOV_SW, SH as GOV_SH } from "./Jyotiq/govcarousel/GovCarousel";
import { GovCarouselV2 } from "./Jyotiq/govcarousel/GovCarouselV2";
import { MoonPostFeed, MoonPostStory } from "./Jyotiq/diwali/moonpost/MoonPost";
import { Greeting, GREETING_TOTAL } from "./Jyotiq/diwali/greeting/Greeting";
import { DiwaliD4Test } from "./Jyotiq/diwali/d4/TestD4";
import { D4_TOTAL, DiwaliD4 } from "./Jyotiq/diwali/d4/DiwaliD4";
import { D5_TOTAL, DiwaliD5 } from "./Jyotiq/diwali/d5/DiwaliD5";
import { EP5_TOTAL, ManthanEp5 } from "./Jyotiq/manthan/ep5/Episode5";
import { ManthanEp2CastTest, ManthanEp2FaceTest } from "./Jyotiq/manthan/ep2/CastTest";
import { ManthanEp2BeingsTest } from "./Jyotiq/manthan/ep2/BeingsTest";
import { ManthanEp2BeingsTest3 } from "./Jyotiq/manthan/ep2/BeingsTest3";
import { ManthanEp2SetsTest } from "./Jyotiq/manthan/ep2/SetsTest";
import { ManthanEp2GfxTest } from "./Jyotiq/manthan/ep2/GfxTest";
import { EP2_TOTAL, ManthanEp2 } from "./Jyotiq/manthan/ep2/Episode2";
import { EP1C_TOTAL, ManthanEp1Close } from "./Jyotiq/manthan/ep1close/Episode1Close";
import { ManthanBeingsTest, ManthanFaceTest, ManthanRigTest, ManthanSetsTest, ManthanGfxTest } from "./Jyotiq/manthan/RigTest";
import { SadeSaatiReel, SS_FPS, SS_TOTAL } from "./Jyotiq/sadesaati/SadeSaati";
import { SadeSaatiCharanReel, CH_FPS, CH_TOTAL } from "./Jyotiq/sadesaati/SadeSaatiCharan";
import { SadeSaatiChandraReel, CHA_FPS, CHA_TOTAL } from "./Jyotiq/sadesaati/SadeSaatiChandra";
import { TulsiVivahReel, TV_FPS, TV_TOTAL } from "./Jyotiq/tulsivivah/TulsiVivah";
import { NarasimhaReel, NS_FPS, NS_TOTAL } from "./Jyotiq/narasimha/Narasimha";
import { SadeSaatiHarishReel, HAR_FPS, HAR_TOTAL } from "./Jyotiq/sadesaati/SadeSaatiHarish";
import { NavagrahaEp1Board, PANELS as NV1_PANELS } from "./Jyotiq/navagraha/ep1/Board";
import { NavagrahaEp1, NV1_TOTAL } from "./Jyotiq/navagraha/ep1/Episode1";
import { NavagrahaEp2, NV2_TOTAL } from "./Jyotiq/navagraha/ep2/Episode2";
import { ChhathReel, CHHATH_TOTAL } from "./Jyotiq/chhath/Episode";
import { Bharata1Reel, BHARATA1_TOTAL } from "./Jyotiq/bharata/ep1/Episode";
import { Bharata2Reel, BHARATA2_TOTAL } from "./Jyotiq/bharata/ep2/Episode";
import { Bharata3Reel, BHARATA3_TOTAL } from "./Jyotiq/bharata/ep3/Episode";
import { Bharata4Reel, BHARATA4_TOTAL } from "./Jyotiq/bharata/ep4/Episode";
import { Bharata5Reel, BHARATA5_TOTAL } from "./Jyotiq/bharata/ep5/Episode";
import { Bharata6Board, BOARD6_FRAMES } from "./Jyotiq/bharata/ep6/Board6";
import { Bharata6Reel, BHARATA6_TOTAL } from "./Jyotiq/bharata/ep6/Episode6";
import { Bharata7Board, BOARD7_FRAMES } from "./Jyotiq/bharata/ep7/Board7";
import { BharataSpecialHook, SPECIAL_HOOK_FRAMES } from "./Jyotiq/bharata/special/Hook";
import { BharataSpecialReel, BHARATA_SPECIAL_TOTAL } from "./Jyotiq/bharata/special/Episode";
import { Bharata7Reel, BHARATA7_TOTAL } from "./Jyotiq/bharata/ep7/Episode7";
import { GTCastSheet, GTFaceSheet } from "./Jyotiq/gurpurab/Sheet";
import { GuruTeghReel, GT_TOTAL } from "./Jyotiq/gurpurab/Episode";
import { KyaHotaEp2, KQ2_TOTAL } from "./Jyotiq/kyahota/ep2/Episode";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="AstroRaagaPitchV4INR" component={AstroRaagaPitchV4} durationInFrames={arV4Frames("inr")} fps={30} width={1920} height={1080} defaultProps={{ cur: "inr" as const }} />
      <Composition id="AstroRaagaPitchV4USD" component={AstroRaagaPitchV4} durationInFrames={arV4Frames("usd")} fps={30} width={1920} height={1080} defaultProps={{ cur: "usd" as const }} />
      <Composition id="AstroRaagaPitchV5USD" component={AstroRaagaPitchV4} durationInFrames={arV4Frames("v5usd")} fps={30} width={1920} height={1080} defaultProps={{ cur: "v5usd" as const }} />
      <Composition id="AstroRaagaPitchV6USD" component={AstroRaagaPitchV6} durationInFrames={arV6Frames("v6usd")} fps={30} width={1920} height={1080} defaultProps={{ cur: "v6usd" as const }} />
      <Composition id="AstroRaagaPitchV7USD" component={AstroRaagaPitchV7} durationInFrames={arV7Frames("v7usd")} fps={30} width={1920} height={1080} defaultProps={{ cur: "v7usd" as const }} />
      <Composition id="AstroRaagaPitchV7USDGrid" component={AstroRaagaPitchV7} durationInFrames={arV7Frames("v7usd")} fps={30} width={1920} height={1080} defaultProps={{ cur: "v7usd" as const, seg: "grid" as const }} />
      <Composition id="AstroRaagaPitchV8USD" component={AstroRaagaPitchV8} durationInFrames={arV8Frames("v8usd")} fps={30} width={1920} height={1080} defaultProps={{ cur: "v8usd" as const }} />
      <Composition id="AstroRaagaDeckSolar" component={AstroRaagaDeckArt} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ variant: "solar" as const }} />
      <Composition id="AstroRaagaDeckSystem" component={AstroRaagaDeckArt} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ variant: "system" as const }} />
      <Composition id="AstroRaagaPitch" component={AstroRaagaPitch} durationInFrames={AR_PITCH_TOTAL} fps={30} width={1920} height={1080} />
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />

      {/* 60-second LinkedIn promo, 4:5 portrait, silent. Empty/null props are omitted, never invented. */}
      <Composition
        id="JobCopilotPromo"
        component={JobCopilotPromo}
        schema={jobCopilotSchema}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          productName: "",
          manualMinutes: null,
          toolSeconds: null,
        }}
      />

      {/* Jyotiq (AstroRaaga) launch film: Luffy reference motion + same audio, 16:9. */}
      <Composition
        id="JyotiqLaunch"
        component={JyotiqLaunch}
        schema={jyotiqSchema}
        durationInFrames={991}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ palette: "midnight" as const, withAudio: true }}
      />
      {/* Review stills: frame i = KEYFRAMES[i] of JyotiqLaunch. Duration matches the
          film because <Freeze> clamps to the host composition's length; render with
          --frames=0-15. */}
      <Composition
        id="JyotiqKeyframes"
        component={JyotiqKeyframes}
        schema={keyframesSchema}
        durationInFrames={991}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ palette: "midnight" as const }}
      />
      {/* Palette comparison sheet (2x2). Render frame 0 only. */}
      <Composition
        id="JyotiqPalettes"
        component={JyotiqPalettes}
        schema={z.object({ frame: z.number() })}
        durationInFrames={991}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ frame: 600 }}
      />
      {/* Jyotiq 9:16 Reel: same beats + audio, phone-screen layouts, beat-reactive layer. */}
      <Composition
        id="JyotiqReel"
        component={JyotiqReel}
        schema={jyotiqSchema}
        durationInFrames={991}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ palette: "midnight" as const, withAudio: true }}
      />
      {/* Reel review stills: frame i = REEL_KEYFRAMES[i] (or `list`). Render --sequence --frames=0-N. */}
      <Composition
        id="JyotiqReelKeyframes"
        component={JyotiqReelKeyframes}
        schema={keyframesSchema}
        durationInFrames={991}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ palette: "midnight" as const }}
      />
      {/* 9:16 Reel hook: reality-show house fight rebuilt with silhouettes (no footage). 3.6 s. */}
      <Composition
        id="JyotiqFightHook"
        component={FightHook}
        schema={fightHookSchema}
        durationInFrames={HOOK_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={FIGHT_DEFAULTS}
      />
      {/* Hook review stills: frame i = list[i]. Render --sequence --frames=0-N. */}
      <Composition
        id="JyotiqFightHookKeyframes"
        component={FightHookKeyframes}
        schema={fightKeyframesSchema}
        durationInFrames={HOOK_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* Hook contact sheet (12 thumbnails). Render frame 0 with `remotion still`. */}
      <Composition
        id="JyotiqFightHookSheet"
        component={FightHookSheet}
        schema={fightKeyframesSchema}
        durationInFrames={HOOK_FRAMES}
        fps={30}
        width={1652}
        height={1044}
        defaultProps={{}}
      />
      {/* Bigg Boss x Jyotiq promo Reel: fight hook (real clip audio) + 7 brand scenes, 36.6 s. */}
      <Composition
        id="JyotiqBBReel"
        component={JyotiqBBReel}
        schema={bbReelSchema}
        durationInFrames={BB_TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={BB_DEFAULTS}
      />
      {/* Reel review stills: frame i = list[i]. Render --sequence --frames=0-N --scale=0.5. */}
      <Composition
        id="JyotiqBBReelKeyframes"
        component={JyotiqBBReelKeyframes}
        schema={bbReviewSchema}
        durationInFrames={BB_TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* Reel contact sheet (12 thumbnails of `list`). Render frame 0 with `remotion still`. */}
      <Composition
        id="JyotiqBBReelSheet"
        component={JyotiqBBReelSheet}
        schema={bbReviewSchema}
        durationInFrames={BB_TOTAL}
        fps={30}
        width={1652}
        height={1044}
        defaultProps={{}}
      />
      {/* Style test: flat Indian-miniature "katha" look with cut-out puppets, 9:16, 6 s, silent. */}
      <Composition
        id="JyotiqKathaTest"
        component={KathaTest}
        durationInFrames={KATHA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* 4 frames of the style test side by side. Render frame 0 with `remotion still`. */}
      <Composition
        id="JyotiqKathaTestSheet"
        component={KathaTestSheet}
        durationInFrames={KATHA_FRAMES}
        fps={30}
        width={2240}
        height={992}
      />
      {/* Full katha promo Reel: "The war that never happened", 35.5 s, SFX only (no music). */}
      <Composition
        id="JyotiqKathaReel"
        component={JyotiqKathaReel}
        schema={kathaReelSchema}
        durationInFrames={KATHA_TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={KATHA_REEL_DEFAULTS}
      />
      {/* 12 frames of the katha Reel at quarter size (frames = `list`). Render frame 0 with `remotion still`. */}
      <Composition
        id="JyotiqKathaReelSheet"
        component={JyotiqKathaReelSheet}
        schema={kathaSheetSchema}
        durationInFrames={KATHA_TOTAL}
        fps={30}
        width={1716}
        height={1000}
        defaultProps={{}}
      />
      {/* "Shooter Gaadi" Reel: kid asks Jyotiq -> Shani Dev on his Bullet -> graha convoy (17.2 s, song + SFX). */}
      <Composition
        id="JyotiqShooterReel"
        component={JyotiqShooterReel}
        durationInFrames={SHOOTER_TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withAudio: true }}
      />
      {/* v2: extended song, slower opening, crying meme, "kah se aate hain" dance -> phone reveal -> Cantina-style lockup (26.8 s). */}
      <Composition
        id="JyotiqShooterReelV2"
        component={JyotiqShooterReel2}
        durationInFrames={SHOOTER2_TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ withAudio: true }}
      />
      {/* One-frame bake of the v2 lockup's sticker wordmark (transparent PNG at 2x). */}
      <Composition id="JyotiqStickerBake" component={StickerBake} durationInFrames={1} fps={30} width={STICKER_BAKE_W} height={STICKER_BAKE_H} defaultProps={{}} />
      {/* 18 review frames at quarter size; render frame 0 with `remotion still`. */}
      <Composition
        id="JyotiqShooterSheet"
        component={JyotiqShooterSheet}
        durationInFrames={1}
        fps={30}
        width={1648}
        height={1568}
        defaultProps={{}}
      />
      {/* Brand end-sting, 9:16 at the testimonial's native 480x864. ~2.7s. */}
      <Composition
        id="JyotiqEndSting"
        component={JyotiqEndSting}
        durationInFrames={80}
        fps={30}
        width={480}
        height={864}
        defaultProps={{}}
      />
      {/* Testimonial overlay: planet-stage video + modern captions + corner watermark. 480x864. */}
      <Composition
        id="JyotiqTestimonial"
        component={JyotiqTestimonial}
        durationInFrames={3446}
        fps={30}
        width={480}
        height={864}
        defaultProps={{}}
      />
      {/* Testimonial v2: speaker cut out in front of synced b-roll + app motion graphics. */}
      <Composition
        id="JyotiqTestimonialV2"
        component={JyotiqTestimonialV2}
        durationInFrames={V2_FRAMES}
        fps={30}
        width={480}
        height={864}
        defaultProps={{}}
      />
      {/* v2 review sheet: 20 beat frames at half size. Full-length timeline (Remotion clamps
          frames to the composition length), render frame 0 with `remotion still`. */}
      <Composition
        id="JyotiqTestimonialV2Sheet"
        component={JyotiqTestimonialV2Sheet}
        durationInFrames={V2_FRAMES}
        fps={30}
        width={1200}
        height={1728}
        defaultProps={{}}
      />
      {/* Manthan Ep1: rig line-up for review */}
      <Composition id="ManthanRigTest" component={ManthanRigTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanFaceTest" component={ManthanFaceTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanBeingsTest" component={ManthanBeingsTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanSetsTest" component={ManthanSetsTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanGfxTest" component={ManthanGfxTest} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq "Manthan" Episode 1 - Shraap (9:16, 30 fps) */}
      <Composition id="ManthanEp1" component={ManthanEp1} durationInFrames={EP1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Manthan Ep3 (Kurma): review stills */}
      <Composition id="ManthanEp3Test" component={ManthanEp3Test} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp3FxTest" component={ManthanEp3FxTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp3GfxTest" component={ManthanEp3GfxTest} durationInFrames={EP3_GFX_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp3StageTest" component={ManthanEp3StageTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq "Manthan" Episode 3 - Kurma (9:16, 30 fps; final 4K render uses --scale=2) */}
      <Composition id="ManthanEp3" component={ManthanEp3} durationInFrames={EP3_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp4Test" component={ManthanEp4Test} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp4GfxTest" component={ManthanEp4GfxTest} durationInFrames={5} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp4" component={ManthanEp4} durationInFrames={EP4_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Manthan Ep5 (Lakshmi): art review stills */}
      <Composition id="ManthanEp5Test" component={ManthanEp5Test} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp5GfxTest" component={ManthanEp5GfxTest} durationInFrames={EP5_GFX_AT.length} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp6Test" component={ManthanEp6Test} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp6GfxTest" component={ManthanEp6GfxTest} durationInFrames={GFX6_AT.length} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp6" component={ManthanEp6} durationInFrames={EP6_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Manthan Ep7 (Rahu): art review stills */}
      <Composition id="ManthanEp7Test" component={ManthanEp7Test} durationInFrames={60} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp7" component={ManthanEp7} durationInFrames={EP7_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq "Manthan" Episode 8 - Ketu (9:16, 30 fps; rendered natively at 1080x1920, scale 1) */}
      <Composition id="ManthanEp8" component={ManthanEp8} durationInFrames={EP8_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 1 - Dhanteras: art test (stills only) */}
      <Composition id="DiwaliD1Test" component={DiwaliD1Test} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 1 - Dhanteras (9:16, 30 fps; rendered natively at 1080x1920, scale 1) */}
      <Composition id="DiwaliD1" component={DiwaliD1} durationInFrames={D1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Days 2-5: shared art test (stills only) */}
      <Composition id="DiwaliSharedTest" component={DiwaliSharedTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 2 - Choti Diwali: art test (stills only) */}
      <Composition id="DiwaliD2Test" component={DiwaliD2Test} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 2 - Choti Diwali (9:16, 30 fps; rendered natively at 1080x1920, scale 1) */}
      <Composition id="DiwaliD2" component={DiwaliD2} durationInFrames={D2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 3 - Diwali: art test (stills only) */}
      <Composition id="DiwaliD3Test" component={DiwaliD3Test} durationInFrames={60} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 3 - Diwali (9:16, 30 fps; rendered natively at 1080x1920, scale 1) */}
      <Composition id="DiwaliD3" component={DiwaliD3} durationInFrames={D3_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 4 - Govardhan: art test (stills only) */}
      <Composition id="DiwaliD4Test" component={DiwaliD4Test} durationInFrames={60} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq Diwali "पाँच दीये" Day 4 - Govardhan (9:16, 30 fps; rendered natively at 1080x1920, scale 1) */}
      <Composition id="DiwaliD4" component={DiwaliD4} durationInFrames={D4_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="DiwaliD5" component={DiwaliD5} durationInFrames={D5_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq "Manthan" Episode 5 - Lakshmi (9:16, 30 fps; rendered natively at 1080x1920, scale 1) */}
      <Composition id="ManthanEp5" component={ManthanEp5} durationInFrames={EP5_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Manthan Ep2: cast review stills */}
      <Composition id="ManthanEp2CastTest" component={ManthanEp2CastTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp2FaceTest" component={ManthanEp2FaceTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp2BeingsTest" component={ManthanEp2BeingsTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp2BeingsTest3" component={ManthanEp2BeingsTest3} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp2SetsTest" component={ManthanEp2SetsTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp2GfxTest" component={ManthanEp2GfxTest} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp2" component={ManthanEp2} durationInFrames={EP2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ManthanEp1Close" component={ManthanEp1Close} durationInFrames={EP1C_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* "शनि की साढ़े साती" BPHS-narrator Reel: 7 Flow clips + ElevenLabs VO, 24 fps native, 31.5 s */}
      <Composition id="SadeSaatiReel" component={SadeSaatiReel} durationInFrames={SS_TOTAL} fps={SS_FPS} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      <Composition id="SadeSaatiCharanReel" component={SadeSaatiCharanReel} durationInFrames={CH_TOTAL} fps={CH_FPS} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      <Composition id="SadeSaatiChandraReel" component={SadeSaatiChandraReel} durationInFrames={CHA_TOTAL} fps={CHA_FPS} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      <Composition id="NarasimhaReel" component={NarasimhaReel} durationInFrames={NS_TOTAL} fps={NS_FPS} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      <Composition id="TulsiVivahReel" component={TulsiVivahReel} durationInFrames={TV_TOTAL} fps={TV_FPS} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      <Composition id="SadeSaatiHarishReel" component={SadeSaatiHarishReel} durationInFrames={HAR_TOTAL} fps={HAR_FPS} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      {/* Diwali story series, Day 3: the Bharat story, Kaal narrating */}
      <Composition id="DiwaliStory3" component={Story3} durationInFrames={STORY3_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="DiwaliGreeting" component={Greeting} durationInFrames={GREETING_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ withAudio: true }} />
      <Composition id="DiwaliStory4" component={Story4} durationInFrames={STORY4_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Diwali story series, Day 5: Bhai Dooj, Yama and Yamuna (render with --public-dir=../diwali-story-d5/public) */}
      <Composition id="DiwaliStory5" component={Story5} durationInFrames={STORY5_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Jyotiq global English story: The Father Who Marked the Trail (render with --public-dir=../father-trail/public) */}
      <Composition id="FatherTrail" component={FatherTrail} durationInFrames={FATHER_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Govardhan carousel: one 9-slide panorama, cut into 1080x1350 slides (render with --public-dir=../govardhan-carousel/public) */}
      <Still id="GovardhanCarousel" component={GovCarousel} width={GOV_SLIDES * GOV_SW} height={GOV_SH} />
      <Still id="GovardhanCarouselV2" component={GovCarouselV2} width={GOV_SLIDES * GOV_SW} height={GOV_SH} />
      {/* Diwali 2026 post, "The Moon took the night off" (render with --public-dir=../diwali-moon-post/public) */}
      <Still id="DiwaliMoonPost" component={MoonPostFeed} width={1080} height={1350} />
      <Still id="DiwaliMoonStory" component={MoonPostStory} width={1080} height={1920} />
      <Composition id="DiwaliBoards4" component={BoardsD4} durationInFrames={D4_PANELS} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* Karmeq "एक पन्ना" Ep 1: 18 नाम, documentary reel */}
      <Composition id="EkPannaEp1" component={EkPannaEp1} durationInFrames={EKPANNA_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ withAudio: false }} />
      {/* Jyotiq reel opening: "Jyotiq light" brand open, 5 s */}
      <Composition id="JyotiqReelOpen" component={JyotiqReelOpen} durationInFrames={OPEN_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* नवग्रह जन्म Ep1 · सूर्य: storyboard, one frame per panel (render with --sequence) */}
      <Composition id="NavagrahaEp1Board" component={NavagrahaEp1Board} durationInFrames={NV1_PANELS.length} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* नवग्रह जन्म Ep1 · सूर्य: the full reel */}
      <Composition id="NavagrahaEp1" component={NavagrahaEp1} durationInFrames={NV1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="NavagrahaEp2" component={NavagrahaEp2} durationInFrames={NV2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="ChhathReel" component={ChhathReel} durationInFrames={CHHATH_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="Bharata1Reel" component={Bharata1Reel} durationInFrames={BHARATA1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="Bharata2Reel" component={Bharata2Reel} durationInFrames={BHARATA2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="Bharata3Reel" component={Bharata3Reel} durationInFrames={BHARATA3_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="Bharata4Reel" component={Bharata4Reel} durationInFrames={BHARATA4_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* भारत Ep5 · कुंती का मंत्र */}
      <Composition id="Bharata5Reel" component={Bharata5Reel} durationInFrames={BHARATA5_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="Bharata6Board" component={Bharata6Board} durationInFrames={BOARD6_FRAMES} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="Bharata6Reel" component={Bharata6Reel} durationInFrames={BHARATA6_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ audio: false }} />
      {/* भारत Ep7 · एकलव्य का अंगूठा: storyboard (frame i = panel i) */}
      <Composition id="Bharata7Board" component={Bharata7Board} durationInFrames={BOARD7_FRAMES} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BharataSpecialHook" component={BharataSpecialHook} durationInFrames={SPECIAL_HOOK_FRAMES} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BharataSpecialReel" component={BharataSpecialReel} durationInFrames={BHARATA_SPECIAL_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ audio: false }} />
      <Composition id="Bharata7Reel" component={Bharata7Reel} durationInFrames={BHARATA7_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ audio: false }} />
      <Composition id="GTCastSheet" component={GTCastSheet} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GTFaceSheet" component={GTFaceSheet} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GuruTeghReel" component={GuruTeghReel} durationInFrames={GT_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* क्या होता अगर… Ep2 · शनि की टेढ़ी नज़र: the full reel */}
      <Composition id="KyaHotaEp2" component={KyaHotaEp2} durationInFrames={KQ2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{}} />
      {/* @ashuanimates Barbarik: original painted Hindi mythology reel, style-reference only */}
      <Composition id="AshuanimatesBarbarik" component={BarbarikEpisode} durationInFrames={BARBARIK_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ audio: true }} />
      <Composition id="AshuanimatesBarbarikCover" component={BarbarikCover} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{}} />
      <Composition id="AshuanimatesKarna" component={KarnaEpisode} durationInFrames={KARNA_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ audio: true }} />
      <Composition id="AshuanimatesKarnaCover" component={KarnaCover} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{}} />
    </>
  );
};
