import React from "react";
import { Cam, H, Motes, W, lerp, prog } from "./kit";
import { Barbarik, ElderWarrior, GiantSilhouette, GoldenScale, Krishna, Mother, SereneHead, ShivaGlow, ThreadBlessing, ThreeArrows } from "./cast";
import { Battlefield, Camp, HilltopBattle, MemoryHome, ScaleVoid, Shrine } from "./world";

type SP = { f: number; a: number; b: number };

export const HookWide: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1110} s0={1.02} s1={1.13} dy={-20}>
    <Battlefield f={f} />
    <g transform="translate(540 1485)">
      <Barbarik f={f} x={0} y={0} s={1.05} mode="archer" silhouette draw={0.8} quiver seed={5} />
      <path d="M90 -250C240 -350 350 -380 480 -410" stroke="#FFEA9A" strokeWidth={4} opacity={0.28} fill="none" />
    </g>
  </Cam>
);

export const HookDots: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1160} s0={1.16} s1={1.04} dx={-30}>
    <Battlefield f={f} mist={0.85} />
    <g opacity={0.35}>
      <path d="M130 1410C390 1320 680 1320 950 1415" stroke="#FFD67A" strokeWidth={3} strokeDasharray="2 18" fill="none" />
      <path d="M950 1320C700 1260 390 1260 130 1325" stroke="#FFAD66" strokeWidth={3} strokeDasharray="2 18" fill="none" />
    </g>
  </Cam>
);

export const HookArcher: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={500} cy={1130} s0={1.05} s1={1.21} dy={-30}>
    <Battlefield f={f} deep armies={0.55} />
    <circle cx={570} cy={1110} r={360} fill="#FFAF52" opacity={0.13} filter="url(#bbBlur18)" />
    <Barbarik f={f} x={500} y={1515} s={1.65} mode="archer" silhouette draw={0.95} quiver seed={8} glow={3} />
    <Motes f={f} n={22} color="#FFE083" ember seed={91} y0={760} y1={1680} />
  </Cam>
);

export const StopShot: React.FC<SP> = ({ f, a, b }) => {
  const glow = prog(f, a, a + 35);
  return (
    <Cam f={f} a={a} b={b} cx={475} cy={1000} s0={1.04} s1={1.18} dx={20}>
      <Battlefield f={f} deep armies={0.35} />
      <Barbarik f={f} x={770} y={1460} s={1.05} facing={-1} mode="archer" silhouette draw={0.25} seed={9} />
      <g transform={`translate(${120} 1510) scale(1.8)`} opacity={0.94}>
        <Krishna f={f} x={0} y={0} s={1} raised={1} palm seed={11} />
      </g>
      <circle cx={345} cy={1020} r={210 + 35 * glow} fill="url(#bbBlueGlow)" opacity={0.35 * glow} filter="url(#bbBlur18)" />
    </Cam>
  );
};

export const Reveal: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={520} cy={1080} s0={1.0} s1={1.15} dy={-25}>
    <Battlefield f={f} armies={0.22} deep />
    <circle cx={530} cy={1090} r={390} fill="#FFBF65" opacity={0.13} filter="url(#bbBlur18)" />
    <Barbarik f={f} x={520} y={1535} s={1.75} mode="stand" quiver glow={3} seed={13} />
  </Cam>
);

export const Lineage: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1080} s0={1.05} s1={0.98} dx={-20}>
    <Battlefield f={f} armies={0.1} deep />
    <GiantSilhouette x={235} y={1515} s={1.55} kind="ghatot" facing={1} o={0.72} />
    <GiantSilhouette x={875} y={1535} s={1.75} kind="bhima" facing={-1} o={0.76} />
    <circle cx={540} cy={1090} r={285} fill="#FFCE7A" opacity={0.14} filter="url(#bbBlur18)" />
    <Barbarik f={f} x={540} y={1515} s={1.25} mode="stand" quiver glow={3} seed={17} />
  </Cam>
);

export const ShivaBoon: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1010} s0={1.0} s1={1.12} dy={-20}>
    <rect width={W} height={H} fill="#121A2E" />
    <ShivaGlow f={f} x={540} y={1040} s={1.45} />
    <Barbarik f={f} x={540} y={1600} s={1.05} mode="bow" quiver={false} seed={19} bowing={0.35} />
    <Motes f={f} n={42} color="#BFEFFF" seed={101} y0={500} y1={1650} />
  </Cam>
);

export const ArrowClose: React.FC<SP & { lit: number }> = ({ f, a, b, lit }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={960} s0={1.04} s1={1.18} dy={-10} hits={[Math.round(lerp(a, b, 0.55))]} amp={7}>
    <rect width={W} height={H} fill="#141827" />
    <circle cx={540} cy={950} r={520} fill="#273047" opacity={0.75} filter="url(#bbBlur18)" />
    <path d="M0 1230C270 1180 810 1180 1080 1230V1920H0Z" fill="#1E1713" />
    <ThreeArrows x={540} y={1020} s={2.15} f={f} lit={lit} />
    <Motes f={f} n={28} color="#FFE27A" ember seed={109} y0={620} y1={1500} />
  </Cam>
);

export const CampQuestion: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={530} cy={1110} s0={1.08} s1={1.0} dx={-25}>
    <Camp f={f} night />
    <ElderWarrior f={f} x={760} y={1490} s={0.9} facing={-1} kind="bhishma" silhouette />
    <ElderWarrior f={f} x={900} y={1510} s={0.82} facing={-1} kind="drona" silhouette />
    <Krishna f={f} x={425} y={1515} s={1.35} facing={1} seed={23} />
  </Cam>
);

export const KrishnaAsk: React.FC<SP> = ({ f, a, b }) => {
  const ring = 0.65 + 0.35 * Math.sin(f / 8);
  return (
    <Cam f={f} a={a} b={b} cx={500} cy={1010} s0={1.05} s1={1.19} dy={-20}>
      <Camp f={f} night />
      <circle cx={710} cy={940} r={170} fill="none" stroke="#9FEAFF" strokeWidth={6} opacity={0.18 * ring} strokeDasharray="20 18" transform={`rotate(${f * 1.5} 710 940)`} />
      <Krishna f={f} x={500} y={1565} s={2.05} seed={29} raised={0.15} />
    </Cam>
  );
};

export const ElderAnswer: React.FC<SP & { kind: "bhishma" | "drona"; days: string }> = ({ f, a, b, kind, days }) => (
  <Cam f={f} a={a} b={b} cx={520} cy={1040} s0={1.02} s1={1.15} dy={-18}>
    <Camp f={f} night={false} />
    <ElderWarrior f={f} x={510} y={1530} s={1.9} kind={kind} facing={1} />
    <g transform="translate(735 1210)">
      <rect x={-120} y={-74} width={240} height={122} rx={26} fill="#120D0A" opacity={0.68} />
      <text x={0} y={18} textAnchor="middle" fontSize={64} fontWeight={800} fill="#FFF2D0" style={{ fontFamily: "Mukta, sans-serif" }}>{days}</text>
    </g>
  </Cam>
);

export const EkPal: React.FC<SP & { hit: number }> = ({ f, a, b, hit }) => {
  const k = prog(f, hit - 3, hit + 9);
  return (
    <Cam f={f} a={a} b={b} cx={510} cy={1020} s0={1.03} s1={1.16} hits={[hit]} amp={10}>
      <Battlefield f={f} deep armies={0.18} />
      <circle cx={510} cy={1070} r={420} fill="#FFCA72" opacity={0.12 + 0.12 * k} filter="url(#bbBlur18)" />
      <Barbarik f={f} x={510} y={1545} s={2.0} mode="smile" quiver glow={3} seed={37} />
      <text x={540} y={520} textAnchor="middle" fontSize={150 + 14 * k} fontWeight={400} fill="#FFF2C2" stroke="#3B1C0D" strokeWidth={5} style={{ fontFamily: "Rozha One, serif" }} opacity={0.15 + 0.85 * k}>एक पल।</text>
    </Cam>
  );
};

export const MemoryBlessing: React.FC<SP & { close?: boolean }> = ({ f, a, b, close = false }) => (
  <Cam f={f} a={a} b={b} cx={520} cy={close ? 1040 : 1110} s0={close ? 1.16 : 1.02} s1={close ? 1.25 : 1.12} dx={close ? -15 : 20}>
    <MemoryHome f={f} />
    <Mother f={f} x={close ? 360 : 360} y={1510} s={close ? 1.55 : 1.28} facing={1} />
    <Barbarik f={f} x={close ? 690 : 670} y={1545} s={close ? 1.15 : 1.0} facing={-1} mode="stand" quiver={false} seed={41} />
    <ThreadBlessing f={f} x={close ? 565 : 555} y={close ? 1135 : 1190} s={close ? 1.65 : 1.1} glow={1} />
  </Cam>
);

export const ScaleScene: React.FC<SP & { phase: number }> = ({ f, a, b, phase }) => {
  const u = prog(f, a, b);
  const tilt = phase === 0 ? lerp(-0.6, 0.85, u) : phase === 1 ? lerp(0.85, -0.9, u) : lerp(-0.9, 0.15, u);
  const jump = phase === 1 ? prog(f, a + 12, b - 8) : phase === 2 ? 1 : 0;
  const bx = lerp(360, 720, jump);
  const fade = phase === 2 ? prog(f, a, b) : 0;
  return (
    <Cam f={f} a={a} b={b} cx={540} cy={1040} s0={1.03} s1={1.12} dy={-15} hits={[Math.round(lerp(a, b, 0.52))]} amp={5}>
      <ScaleVoid f={f} />
      <GoldenScale f={f} x={540} y={990} s={1.32} tilt={tilt} glow={1 - fade * 0.5} />
      <g opacity={1 - fade * 0.75}>
        <circle cx={310} cy={1115} r={5} fill="#FFD67A" /><circle cx={340} cy={1120} r={4} fill="#FFD67A" /><circle cx={370} cy={1112} r={4} fill="#FFD67A" />
        <circle cx={710} cy={1115} r={5} fill="#FFAF68" /><circle cx={740} cy={1120} r={4} fill="#FFAF68" /><circle cx={770} cy={1112} r={4} fill="#FFAF68" />
      </g>
      <g transform={`translate(${bx} ${1285 - Math.sin(jump * Math.PI) * 90}) scale(0.72)`} opacity={1 - fade * 0.35}>
        <Barbarik f={f} x={0} y={0} s={1} mode="stand" silhouette={phase === 2} quiver glow={3} seed={43} />
      </g>
      {phase === 2 ? <rect width={W} height={H} fill="#0B0A09" opacity={0.25 * fade} /> : null}
    </Cam>
  );
};

export const LoneField: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1120} s0={1.0} s1={1.16} dy={-28}>
    <Battlefield f={f} deep armies={0} empty={1} mist={0.9} />
    <circle cx={540} cy={1110} r={310} fill="#FFAF52" opacity={0.1} filter="url(#bbBlur18)" />
    <Barbarik f={f} x={540} y={1500} s={1.08} mode="stand" silhouette quiver seed={47} />
  </Cam>
);

export const BrahminApproach: React.FC<SP> = ({ f, a, b }) => {
  const walk = prog(f, a, b);
  return (
    <Cam f={f} a={a} b={b} cx={500} cy={1080} s0={1.05} s1={1.0} dx={-20}>
      <Battlefield f={f} deep armies={0.08} />
      <Krishna f={f} x={lerp(250, 470, walk)} y={1510} s={1.4} facing={1} brahmin seed={53} />
      <Barbarik f={f} x={790} y={1515} s={1.2} facing={-1} mode="stand" quiver glow={3} seed={59} />
    </Cam>
  );
};

export const AskHand: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={520} cy={1040} s0={1.08} s1={1.2} dy={-18}>
    <Battlefield f={f} deep armies={0.05} />
    <Krishna f={f} x={370} y={1540} s={1.8} facing={1} brahmin raised={1} palm seed={61} />
    <circle cx={520} cy={1040} r={250} fill="url(#bbBlueGlow)" opacity={0.32} filter="url(#bbBlur18)" />
    <Barbarik f={f} x={780} y={1535} s={1.15} facing={-1} mode="bow" quiver seed={67} bowing={0.3} />
  </Cam>
);

export const SacrificeBow: React.FC<SP & { flashAt: number }> = ({ f, a, b, flashAt }) => {
  const white = prog(f, flashAt - 2, flashAt + 2) * (1 - prog(f, flashAt + 2, flashAt + 12));
  return (
    <Cam f={f} a={a} b={b} cx={520} cy={1050} s0={1.02} s1={1.15} hits={[flashAt]} amp={9}>
      <Battlefield f={f} deep armies={0.04} />
      <Krishna f={f} x={330} y={1520} s={1.25} brahmin seed={71} />
      <Barbarik f={f} x={640} y={1545} s={1.55} facing={-1} mode="bow" quiver={false} seed={73} bowing={prog(f, a + 15, flashAt)} />
      {white > 0.01 ? <rect width={W} height={H} fill="#FFF9ED" opacity={white} /> : null}
    </Cam>
  );
};

export const PeaceHead: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={970} s0={1.08} s1={1.2} dy={-20}>
    <rect width={W} height={H} fill="#141827" />
    <circle cx={540} cy={930} r={430} fill="#70442A" opacity={0.5} filter="url(#bbBlur18)" />
    <SereneHead f={f} x={540} y={1000} s={2.25} glow={1.15} />
    <Motes f={f} n={36} color="#FFE7A0" seed={113} y0={520} y1={1500} />
  </Cam>
);

export const WishWatch: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1010} s0={1.02} s1={1.14} dy={-10}>
    <Battlefield f={f} deep armies={0.35} />
    <circle cx={540} cy={870} r={360} fill="#FFE7A0" opacity={0.12} filter="url(#bbBlur18)" />
    <SereneHead f={f} x={540} y={920} s={1.55} glow={1} />
    <path d="M250 1210C420 1160 650 1160 830 1210" stroke="#FFD67A" strokeWidth={4} fill="none" opacity={0.3} />
  </Cam>
);

export const HillPlace: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1070} s0={1.04} s1={1.13} dx={-15}>
    <HilltopBattle f={f} battle={0.35} />
    <Krishna f={f} x={360} y={1510} s={1.25} brahmin seed={79} />
    <SereneHead f={f} x={610} y={1200} s={0.88} glow={1.2} />
  </Cam>
);

export const WatchBattle: React.FC<SP> = ({ f, a, b }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1080} s0={1.0} s1={1.12} dy={-22}>
    <HilltopBattle f={f} battle={1} />
    <path d="M300 1515C410 1455 650 1450 790 1515L1080 1920H0Z" fill="#17120F" opacity={0.94} />
    <SereneHead f={f} x={540} y={1290} s={1.0} glow={1.2} />
  </Cam>
);

export const ShrineToday: React.FC<SP & { end?: boolean }> = ({ f, a, b, end = false }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={960} s0={end ? 1.1 : 1.0} s1={end ? 1.22 : 1.12} dy={end ? -30 : -18}>
    <Shrine f={f} />
  </Cam>
);
