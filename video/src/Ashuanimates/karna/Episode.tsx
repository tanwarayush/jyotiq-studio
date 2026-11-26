import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Defs, H, MUKTA, PaperGrain, ROZHA, Vignette, W, outCubic, prog } from "../../Ashu/mahabharata/kit/kit";
import { CaptionTrack, HookTitle, SeriesEndCard } from "../../Ashu/mahabharata/kit/captions";
import { LINES, PHRASES, TOTAL, WORDS } from "./timing";
import { ArmourGift, ArmourShatter, BabyRiver, DaanveerTitle, DawnOffering, DeathAsk, DreamWarning, HookSun, IndraWatch, NoArmour, ShaktiGrant, SmileMoon } from "./scenes";
import { KavachPiece } from "../../Ashu/mahabharata/kit/cast";
import { Bust, LOOKS } from "../../Ashu/mahabharata/kit/bust";
import { SolarBattlefield } from "../../Ashu/mahabharata/kit/world";

type Shot = { a: number; b: number; render: (f: number, a: number, b: number) => React.ReactNode };
const line = (n: number) => LINES.find((x) => x.l === n) ?? { l: n, a: 0, b: 0 };
const mid = (n: number) => Math.round((line(n).a + line(n).b) / 2);
const danFrame = WORDS.find((w) => w.l === 12 && w.w.startsWith("दानवीर"))?.a ?? line(12).b + 10;

const SHOTS: Shot[] = [
  { a: 0, b: line(2).a - 1, render: (f, a, b) => <HookSun f={f} a={a} b={b} /> },
  { a: line(2).a, b: line(3).a - 1, render: (f, a, b) => <BabyRiver f={f} a={a} b={b} /> },
  { a: line(3).a, b: line(4).a - 1, render: (f, a, b) => <ArmourShatter f={f} a={a} b={b} /> },
  { a: line(4).a, b: line(5).a - 1, render: (f, a, b) => <IndraWatch f={f} a={a} b={b} /> },
  { a: line(5).a, b: line(6).a - 1, render: (f, a, b) => <DreamWarning f={f} a={a} b={b} /> },
  { a: line(6).a, b: line(7).a - 1, render: (f, a, b) => <SmileMoon f={f} a={a} b={b} /> },
  { a: line(7).a, b: line(8).a - 1, render: (f, a, b) => <DawnOffering f={f} a={a} b={b} /> },
  { a: line(8).a, b: line(9).a - 1, render: (f, a, b) => <DeathAsk f={f} a={a} b={b} /> },
  { a: line(9).a, b: line(10).a - 1, render: (f, a, b) => <ArmourGift f={f} a={a} b={b} flashAt={Math.round(line(9).a + (line(9).b - line(9).a) * 0.72)} /> },
  { a: line(10).a, b: mid(10), render: (f, a, b) => <IndraWatch f={f} a={a} b={b} /> },
  { a: mid(10) + 1, b: line(11).a - 1, render: (f, a, b) => <ShaktiGrant f={f} a={a} b={b} /> },
  { a: line(11).a, b: line(12).a - 1, render: (f, a, b) => <NoArmour f={f} a={a} b={b} /> },
  { a: line(12).a, b: TOTAL - 1, render: (f, a, b) => <DaanveerTitle f={f} a={a} b={b} /> },
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
  surya: "सूर्य देव",
  karna: "कर्ण",
  indra: "इंद्र",
};

export const KarnaEpisode: React.FC<{ audio?: boolean }> = ({ audio = true }) => {
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
      <HookTitle f={f} lines={["जिसे कोई", "नहीं मार सकता था"]} endFrame={82} />
      <SeriesEndCard f={f} startFrame={Math.min(TOTAL - 55, danFrame)} part={2} title="दानवीर कर्ण" nextTitle="एकलव्य" top={865} />
      {audio ? <Audio src={staticFile("ashuanimates/karna/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};

export const KarnaCover: React.FC = () => {
  const f = 72;
  return (
    <AbsoluteFill style={{ backgroundColor: "#111018" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <SolarBattlefield f={f} empty={1} />
        <circle cx={560} cy={940} r={500} fill="#FFE7A0" opacity={0.16} filter="url(#bbBlur18)" />
        <KavachPiece x={800} y={610} s={0.58} rot={16} glow={1.2} />
        <Bust look={LOOKS.karna} f={f} x={-34} y={20} s={1.04} e={{ eye: 1, smile: 0.2, brow: 0.18 }} />
        <PaperGrain o={0.17} />
        <Vignette o={0.55} />
      </svg>
      <div style={{ position: "absolute", left: 55, right: 55, top: 126, textAlign: "center" }}>
        <div style={{ fontFamily: ROZHA, fontSize: 78, lineHeight: 1.16, color: "#FFF3CF", textShadow: "0 7px 0 rgba(77,28,10,0.78), 0 16px 40px rgba(0,0,0,0.72)" }}>
          जिसे कोई<br />नहीं मार सकता था
        </div>
        <div style={{ marginTop: 24, fontFamily: MUKTA, fontWeight: 800, fontSize: 34, letterSpacing: 1.5, color: "#F5C76E", textShadow: "0 4px 20px rgba(0,0,0,0.78)" }}>
          भाग 2 · कर्ण
        </div>
      </div>
    </AbsoluteFill>
  );
};
