import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Defs, H, PaperGrain, ROZHA, Vignette, W, outCubic, prog } from "../../Ashu/mahabharata/kit/kit";
import { CaptionTrack, HookTitle, SeriesEndCard } from "../../Ashu/mahabharata/kit/captions";
import { PHRASES, WORDS } from "./timing";
import {
  ArrowClose,
  AskHand,
  BrahminApproach,
  CampQuestion,
  EkPal,
  ElderAnswer,
  HillPlace,
  HookArcher,
  HookDots,
  HookWide,
  KrishnaAsk,
  Lineage,
  LoneField,
  MemoryBlessing,
  PeaceHead,
  Reveal,
  SacrificeBow,
  ScaleScene,
  ShivaBoon,
  ShrineToday,
  StopShot,
  WatchBattle,
  WishWatch,
} from "./scenes";
import { Barbarik, ThreeArrows } from "../../Ashu/mahabharata/kit/cast";
import { Battlefield } from "../../Ashu/mahabharata/kit/world";

type Shot = { a: number; b: number; render: (f: number, a: number, b: number) => React.ReactNode };

const SHOTS: Shot[] = [
  { a: 0, b: 58, render: (f, a, b) => <HookWide f={f} a={a} b={b} /> },
  { a: 59, b: 116, render: (f, a, b) => <HookDots f={f} a={a} b={b} /> },
  { a: 117, b: 176, render: (f, a, b) => <HookArcher f={f} a={a} b={b} /> },
  { a: 177, b: 267, render: (f, a, b) => <StopShot f={f} a={a} b={b} /> },
  { a: 268, b: 336, render: (f, a, b) => <Reveal f={f} a={a} b={b} /> },
  { a: 337, b: 416, render: (f, a, b) => <Lineage f={f} a={a} b={b} /> },
  { a: 417, b: 492, render: (f, a, b) => <ShivaBoon f={f} a={a} b={b} /> },
  { a: 493, b: 618, render: (f, a, b) => <ArrowClose f={f} a={a} b={b} lit={f < 530 ? 1 : f < 570 ? 2 : 3} /> },
  { a: 619, b: 723, render: (f, a, b) => <CampQuestion f={f} a={a} b={b} /> },
  { a: 724, b: 836, render: (f, a, b) => <KrishnaAsk f={f} a={a} b={b} /> },
  { a: 837, b: 899, render: (f, a, b) => <ElderAnswer f={f} a={a} b={b} kind="bhishma" days="20 दिन" /> },
  { a: 900, b: 970, render: (f, a, b) => <ElderAnswer f={f} a={a} b={b} kind="drona" days="25 दिन" /> },
  { a: 971, b: 1040, render: (f, a, b) => <EkPal f={f} a={a} b={b} hit={1009} /> },
  { a: 1041, b: 1116, render: (f, a, b) => <MemoryBlessing f={f} a={a} b={b} /> },
  { a: 1117, b: 1198, render: (f, a, b) => <MemoryBlessing f={f} a={a} b={b} close /> },
  { a: 1199, b: 1265, render: (f, a, b) => <ScaleScene f={f} a={a} b={b} phase={0} /> },
  { a: 1266, b: 1332, render: (f, a, b) => <ScaleScene f={f} a={a} b={b} phase={1} /> },
  { a: 1333, b: 1403, render: (f, a, b) => <ScaleScene f={f} a={a} b={b} phase={2} /> },
  { a: 1404, b: 1478, render: (f, a, b) => <ScaleScene f={f} a={a} b={b} phase={2} /> },
  { a: 1479, b: 1572, render: (f, a, b) => <LoneField f={f} a={a} b={b} /> },
  { a: 1573, b: 1645, render: (f, a, b) => <BrahminApproach f={f} a={a} b={b} /> },
  { a: 1646, b: 1718, render: (f, a, b) => <AskHand f={f} a={a} b={b} /> },
  { a: 1719, b: 1815, render: (f, a, b) => <SacrificeBow f={f} a={a} b={b} flashAt={1808} /> },
  { a: 1816, b: 1898, render: (f, a, b) => <PeaceHead f={f} a={a} b={b} /> },
  { a: 1899, b: 1959, render: (f, a, b) => <WishWatch f={f} a={a} b={b} /> },
  { a: 1960, b: 2045, render: (f, a, b) => <HillPlace f={f} a={a} b={b} /> },
  { a: 2046, b: 2175, render: (f, a, b) => <WatchBattle f={f} a={a} b={b} /> },
  { a: 2176, b: 2250, render: (f, a, b) => <ShrineToday f={f} a={a} b={b} /> },
  { a: 2251, b: 2372, render: (f, a, b) => <ShrineToday f={f} a={a} b={b} end /> },
];

const SceneStack: React.FC<{ f: number }> = ({ f }) => (
  <>
    {SHOTS.map((s, i) => {
      if (f < s.a - 4 || f > s.b + 6) return null;
      const fadeIn = prog(f, s.a - 2, s.a + 7, outCubic);
      const fadeOut = 1 - prog(f, s.b - 3, s.b + 6, outCubic);
      const o = Math.min(fadeIn, fadeOut);
      if (o <= 0.002) return null;
      return <g key={i} opacity={o}>{s.render(f, s.a, s.b)}</g>;
    })}
  </>
);

const Speaker: Record<string, string> = {
  krishna: "श्री कृष्ण",
  barbarik: "बर्बरीक",
};

export const BarbarikEpisode: React.FC<{ audio?: boolean }> = ({ audio = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#111018" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <SceneStack f={f} />
        <PaperGrain o={0.16} />
        <Vignette o={0.48} />
      </svg>
      <CaptionTrack f={f} phrases={PHRASES} words={WORDS} speakers={Speaker} />
      <HookTitle f={f} lines={["महाभारत", "1 पल में खत्म?"]} endFrame={82} />
      <SeriesEndCard f={f} startFrame={2314} part={1} title="हारे का सहारा" nextTitle="कर्ण" />
      {audio ? <Audio src={staticFile("ashuanimates/barbarik/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};

export const BarbarikCover: React.FC = () => {
  const f = 72;
  return (
    <AbsoluteFill style={{ backgroundColor: "#111018" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <Battlefield f={f} deep armies={0.55} />
        <circle cx={540} cy={1000} r={500} fill="#FFBF65" opacity={0.14} filter="url(#bbBlur18)" />
        <Barbarik f={f} x={540} y={1515} s={1.75} mode="stand" quiver glow={3} seed={8} />
        <ThreeArrows x={540} y={620} s={1.25} f={f} lit={3} upright={false} />
        <PaperGrain o={0.17} />
        <Vignette o={0.55} />
      </svg>
      <div style={{ position: "absolute", left: 55, right: 55, top: 150, textAlign: "center" }}>
        <div style={{ fontFamily: ROZHA, fontSize: 92, lineHeight: 1.13, color: "#FFF3CF", textShadow: "0 7px 0 rgba(77,28,10,0.78), 0 16px 40px rgba(0,0,0,0.72)" }}>
          महाभारत<br />1 पल में खत्म?
        </div>
      </div>
    </AbsoluteFill>
  );
};
