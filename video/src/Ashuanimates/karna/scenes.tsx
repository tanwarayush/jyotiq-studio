import React from "react";
import { Cam, H, Motes, W, lerp, prog, rnd } from "../../Ashu/mahabharata/kit/kit";
import { BabyBasket, KarnaFigure, KavachPiece, ShaktiSpear } from "../../Ashu/mahabharata/kit/cast";
import { IndraClouds, NightRiver, SolarBattlefield } from "../../Ashu/mahabharata/kit/world";
import { Bust, LOOKS } from "../../Ashu/mahabharata/kit/bust";

type SP = { f: number; a: number; b: number };
const blinkF = (f: number, seed: number) => ((f + seed) % 137 < 6 ? 0.12 : 1);

const SunGod: React.FC<{ f: number; x: number; y: number; s?: number; dream?: boolean }> = ({ f, x, y, s = 1, dream = false }) => {
  const pulse = 0.78 + 0.22 * Math.sin(f / 15);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={245} fill="#FFE7A0" opacity={dream ? 0.12 : 0.18} filter="url(#bbBlur18)" />
      {Array.from({ length: 18 }, (_, i) => {
        const ang = (i / 18) * Math.PI * 2 + f / 260;
        const r0 = 145, r1 = 205 + (i % 2) * 35;
        return <path key={i} d={`M${Math.cos(ang) * r0} ${Math.sin(ang) * r0}L${Math.cos(ang) * r1} ${Math.sin(ang) * r1}`} stroke="#FFD36F" strokeWidth={9} strokeLinecap="round" opacity={0.34 * pulse} />;
      })}
      <circle cx={0} cy={0} r={138} fill="url(#bbSun)" opacity={0.98} />
      <circle cx={0} cy={0} r={112} fill="#F2B75D" opacity={0.36} />
      <path d="M-58 -12Q-34 -30 -10 -12M22 -12Q46 -30 70 -12" stroke="#6E3515" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M-48 24Q-22 38 4 24M18 24Q42 38 66 24" stroke="#6E3515" strokeWidth={5} fill="none" opacity={0.65} />
      <path d="M-30 68Q6 88 44 66" stroke="#6E3515" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M4 -84L8 -48" stroke="#B23A2C" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

const ArrowBurst: React.FC<{ f: number; x: number; y: number; seed?: number }> = ({ f, x, y, seed = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 12 }, (_, i) => {
      const ang = -Math.PI * 0.9 + i * 0.16;
      const d = 20 + ((f * 3 + i * 17) % 70);
      return <path key={i} d={`M0 0L${Math.cos(ang) * d} ${Math.sin(ang) * d}`} stroke={i % 2 ? "#FFF1A8" : "#E0602F"} strokeWidth={3.5} opacity={Math.max(0, 1 - d / 95)} strokeLinecap="round" />;
    })}
    <circle cx={0} cy={0} r={36} fill="#FFE7A0" opacity={0.22} filter="url(#bbBlur8)" />
  </g>
);

export const HookSun: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1070} s0={1.02} s1={1.14} dy={-24}>
    <SolarBattlefield f={f} />
    <circle cx={610} cy={820} r={430} fill="#FFE7A0" opacity={0.12} filter="url(#bbBlur18)" />
    <KarnaFigure f={f} x={540} y={1510} s={1.45} silhouette glow={1.2} seed={5} />
    {[-120, 60, 220].map((xx, i) => (
      <g key={i} transform={`translate(${760 + xx * 0.2} ${900 + i * 120}) rotate(${-14 + i * 9})`} opacity={0.55}>
        <path d="M0 0H-190" stroke="#D9B66A" strokeWidth={4} />
        <path d="M0 0L-22 -8L-18 0L-22 8Z" fill="#FFF1A8" />
      </g>
    ))}
    <ArrowBurst f={f} x={618} y={1160} />
  </Cam>
);

export const BabyRiver: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1110} s0={1.03} s1={1.15} dx={-20}>
    <SolarBattlefield f={f} river={1} />
    <path d="M0 1330C250 1290 480 1340 730 1305C890 1282 1000 1302 1080 1288V1920H0Z" fill="#6B4A2D" opacity={0.55} />
    <BabyBasket f={f} x={540} y={1265} s={1.35} />
    <g transform="translate(790 1500) scale(0.75)" opacity={0.75}>
      <KarnaFigure f={f} x={0} y={0} s={1} facing={-1} silhouette glow={0.8} seed={8} />
    </g>
  </Cam>
);

export const ArmourShatter: React.FC<SP> = ({ f, a, b }) => {
  const hit = Math.round(lerp(a, b, 0.56));
  const k = prog(f, hit - 3, hit + 5);
  return (
    <Cam f={f} a={a} b={b} cx={520} cy={1030} s0={1.04} s1={1.18} hits={[hit]} amp={7}>
      <SolarBattlefield f={f} empty={0.3} />
      <circle cx={520} cy={1040} r={390} fill="#FFE7A0" opacity={0.11 + k * 0.1} filter="url(#bbBlur18)" />
      <Bust look={LOOKS.karna} f={f} x={-20} y={-80} s={0.98} e={{ eye: blinkF(f, 11), smile: 0.18, brow: 0.24 }} />
      {f < hit + 10 ? <path d={`M1040 1160L${650 + k * 20} 1135`} stroke="#D9B66A" strokeWidth={6} strokeLinecap="round" /> : null}
      {f >= hit - 2 ? <ArrowBurst f={f - hit} x={655} y={1135} /> : null}
    </Cam>
  );
};

export const IndraWatch: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1000} s0={1.0} s1={1.14} dy={-20}>
    <IndraClouds f={f} />
    <circle cx={540} cy={920} r={360} fill="#8FB8FF" opacity={0.1} filter="url(#bbBlur18)" />
    <Bust look={LOOKS.indra} f={f} x={-20} y={-65} s={0.98} e={{ eye: blinkF(f, 13), smile: 0.08, brow: 0.5 }} light={0.8} />
  </Cam>
);

export const DreamWarning: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1010} s0={1.02} s1={1.13} dy={-18}>
    <NightRiver f={f} moon={false} />
    <SunGod f={f} x={540} y={600} s={1.12} dream />
    <g transform="translate(520 1530) rotate(-8) scale(1.15)" opacity={0.9}>
      <ellipse cx={0} cy={20} rx={190} ry={36} fill="#080A0F" opacity={0.45} />
      <path d="M-130 -20C-80 -80 40 -90 120 -35C80 15 -60 25 -130 -20Z" fill="#B98255" />
      <circle cx={118} cy={-60} r={38} fill="url(#bbSkinWarm)" />
      <path d="M82 -70C100 -98 138 -98 154 -70C130 -82 106 -82 82 -70Z" fill="#17100B" />
      <path d="M-110 -8C-30 30 55 20 135 -28" stroke="#F0DFB8" strokeWidth={32} strokeLinecap="round" opacity={0.8} />
    </g>
    <path d={`M540 735C520 900 520 1080 540 1300`} stroke="#FFE7A0" strokeWidth={5} strokeDasharray="10 18" opacity={0.18 + 0.1 * Math.sin(f / 8)} />
  </Cam>
);

export const SmileMoon: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={520} cy={1020} s0={1.03} s1={1.17} dy={-18}>
    <NightRiver f={f} />
    <circle cx={530} cy={960} r={310} fill="#8FB8FF" opacity={0.08} filter="url(#bbBlur18)" />
    <Bust look={LOOKS.karna} f={f} x={-25} y={-80} s={0.98} e={{ eye: blinkF(f, 17), smile: 0.76, brow: -0.08 }} light={0.75} />
  </Cam>
);

const WaterPour: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0C-24 -34 24 -34 30 0C22 20 -22 20 -30 0Z" fill="url(#bbGold)" stroke="#6B3F13" strokeWidth={4} />
    {[-8, 0, 8].map((xx, i) => (
      <path key={i} d={`M${xx} 12C${xx + Math.sin(f / 5 + i) * 5} 70 ${xx - 4 + i * 4} 130 ${xx + 2} 190`} stroke="#BFE8FF" strokeWidth={3.5} opacity={0.55} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

export const DawnOffering: React.FC<SP> = ({ f, a, b }) => {
  const walk = prog(f, a, b);
  return (
    <Cam f={f} a={a} b={b} cx={520} cy={1080} s0={1.03} s1={1.12} dx={-15}>
      <SolarBattlefield f={f} river={1} />
      <g transform="translate(500 1510)">
        <rect x={-170} y={-110} width={340} height={230} fill="#162536" opacity={0.55} />
        <KarnaFigure f={f} x={0} y={0} s={1.28} offering={1} glow={1.1} seed={19} />
        <WaterPour f={f} x={12} y={-250} s={1.2} />
      </g>
      <g opacity={0.82}>
        <Bust look={LOOKS.indra} f={f} flip x={lerp(230, 105, walk)} y={35} s={0.76} e={{ eye: blinkF(f, 23), smile: 0.18 }} />
      </g>
      <ellipse cx={500} cy={1530} rx={190} ry={32} fill="#FFE7A0" opacity={0.11} filter="url(#bbBlur8)" />
    </Cam>
  );
};

export const DeathAsk: React.FC<SP> = ({ f, a, b }) => {
  const close = prog(f, a + 12, b - 6);
  return (
    <Cam f={f} a={a} b={b} cx={520} cy={1030} s0={1.06} s1={1.2} dy={-20}>
      <SolarBattlefield f={f} river={0.45} />
      <Bust look={LOOKS.indra} f={f} x={-135} y={10} s={0.76} e={{ eye: blinkF(f, 29), smile: 0.06, brow: 0.18 }} />
      <Bust look={LOOKS.karna} f={f} flip x={220} y={-70} s={0.94} e={{ eye: 1 - close * 0.88, smile: 0.08, brow: -0.28 }} />
      <circle cx={540} cy={1060} r={250} fill="#FFF4D6" opacity={0.05 + close * 0.08} filter="url(#bbBlur18)" />
    </Cam>
  );
};

export const ArmourGift: React.FC<SP & { flashAt: number }> = ({ f, a, b, flashAt }) => {
  const u = prog(f, a + 8, flashAt);
  const flash = prog(f, flashAt - 2, flashAt + 2) * (1 - prog(f, flashAt + 2, flashAt + 12));
  return (
    <Cam f={f} a={a} b={b} cx={540} cy={1030} s0={1.03} s1={1.16} hits={[flashAt]} amp={8}>
      <SolarBattlefield f={f} river={0.25} />
      <circle cx={540} cy={1040} r={400} fill="#FFE7A0" opacity={0.1 + u * 0.15} filter="url(#bbBlur18)" />
      <KarnaFigure f={f} x={500} y={1535} s={1.55} offering={u} glow={1 + u} noArmour={u > 0.55} seed={31} />
      <g transform={`translate(${lerp(500, 745, u)} ${lerp(1160, 1050, u)}) rotate(${lerp(0, 22, u)})`} opacity={1 - prog(f, flashAt, b) * 0.25}>
        <KavachPiece x={0} y={0} s={0.82} glow={1.2} />
      </g>
      {Array.from({ length: 28 }, (_, i) => {
        const yy = 1180 - u * 260 + rnd(i, 180) * 120;
        return <circle key={i} cx={500 + (rnd(i, 181) - 0.5) * 300 * u} cy={yy} r={2 + rnd(i, 182) * 5} fill="#FFF1A8" opacity={u * (0.2 + rnd(i, 183) * 0.55)} />;
      })}
      {flash > 0.01 ? <rect width={W} height={H} fill="#FFF9ED" opacity={flash * 0.75} /> : null}
    </Cam>
  );
};

export const ShaktiGrant: React.FC<SP> = ({ f, a, b }) => {
  const reveal = prog(f, a + 14, b - 12);
  return (
    <Cam f={f} a={a} b={b} cx={540} cy={1010} s0={1.02} s1={1.15} dy={-18}>
      <IndraClouds f={f} />
      <Bust look={LOOKS.indra} f={f} x={-80} y={30} s={0.78} e={{ eye: blinkF(f, 37), smile: 0.2, brow: -0.25 }} />
      <g opacity={reveal}>
        <ShaktiSpear x={690} y={1010} s={1.45} rot={-12} glow={1.4} />
        <circle cx={690} cy={1010} r={250} fill="#FFF4D6" opacity={0.13 * reveal} filter="url(#bbBlur18)" />
      </g>
    </Cam>
  );
};

export const NoArmour: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1080} s0={1.0} s1={1.14} dy={-24}>
    <SolarBattlefield f={f} empty={1} />
    <circle cx={560} cy={900} r={430} fill="#FFE7A0" opacity={0.13} filter="url(#bbBlur18)" />
    <KarnaFigure f={f} x={540} y={1510} s={1.45} noArmour glow={1.2} seed={41} />
    <Motes f={f} n={32} color="#FFE083" ember seed={191} y0={700} y1={1650} />
  </Cam>
);

export const DaanveerTitle: React.FC<SP> = ({ f, a, b }) => {
  return (
    <Cam f={f} a={a} b={b} cx={540} cy={1080} s0={1.02} s1={1.1} dy={-18}>
      <SolarBattlefield f={f} empty={1} />
      <SunGod f={f} x={540} y={690} s={0.82} />
      <KarnaFigure f={f} x={540} y={1530} s={1.38} noArmour glow={1.2} seed={43} />
    </Cam>
  );
};
