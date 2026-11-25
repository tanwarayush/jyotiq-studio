import React from "react";
import { lerp } from "./kit";

const ink = "#21150E";
const rim = "#FFD39A";

export const Bow: React.FC<{ x?: number; y?: number; s?: number; rot?: number; draw?: number; glow?: number }> = ({ x = 0, y = 0, s = 1, rot = 0, draw = 0, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -150C58 -100 58 100 0 150" stroke="#4B2B16" strokeWidth={11} fill="none" strokeLinecap="round" />
    <path d={`M0 -150L${-10 - draw * 28} 0L0 150`} stroke="#E8D7B8" strokeWidth={2.8} fill="none" opacity={0.9} />
    {draw > 0.05 ? (
      <g transform={`translate(${-34 - draw * 24} 0)`}>
        <path d="M0 0H112" stroke="#D9B66A" strokeWidth={5} strokeLinecap="round" />
        <path d="M112 0L92 -8L98 0L92 8Z" fill="#FFF1A8" opacity={0.9 + glow * 0.1} />
        {glow > 0.01 ? <circle cx={112} cy={0} r={22 * glow} fill="#FFE786" opacity={0.35 * glow} filter="url(#bbBlur8)" /> : null}
      </g>
    ) : null}
  </g>
);

export const GlowingArrow: React.FC<{ x?: number; y?: number; s?: number; rot?: number; glow?: number; lit?: number }> = ({ x = 0, y = 0, s = 1, rot = 0, glow = 1, lit = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={lit}>
    {glow > 0.01 ? <path d="M0 -86V70" stroke="#FFE77A" strokeWidth={24} opacity={0.22 * glow} filter="url(#bbBlur8)" /> : null}
    <path d="M0 -86V70" stroke="#D9B66A" strokeWidth={6} strokeLinecap="round" />
    <path d="M0 -118L-17 -82H17Z" fill="#FFF3A5" stroke="#8B551D" strokeWidth={3} />
    <path d="M-13 70L0 48L13 70" fill="none" stroke="#B64B38" strokeWidth={6} strokeLinecap="round" />
    <circle cx={0} cy={-104} r={10 + 9 * glow} fill="#FFF0A0" opacity={0.35 + 0.35 * glow} filter="url(#bbBlur8)" />
  </g>
);

export const ThreeArrows: React.FC<{ x: number; y: number; s?: number; f?: number; lit?: number; upright?: boolean }> = ({ x, y, s = 1, f = 0, lit = 3, upright = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-52, 0, 52].map((xx, i) => {
      const on = lit > i ? 1 : 0.28;
      const pulse = on * (0.72 + 0.28 * Math.sin(f / 7 + i * 1.8));
      return <GlowingArrow key={i} x={xx} y={0} rot={upright ? (i - 1) * 4 : 90} glow={pulse} lit={on} />;
    })}
  </g>
);

const blinkK = (f: number, seed: number) => ((f + seed) % 137 < 6 ? 0.12 : 1);
const Eye: React.FC<{ x: number; y: number; k?: number; look?: number; skinLine?: string }> = ({ x, y, k = 1, look = 0, skinLine = ink }) => (
  <g transform={`translate(${x} ${y}) scale(1 ${k})`}>
    <path d="M-11 0Q-5 -6 1 -5.6Q8 -5.4 11 -0.6Q5 5.2 -1 5Q-8 4.6 -11 0Z" fill="#FFF4E4" opacity={0.94} />
    <circle cx={look * 3 + 1} cy={0.2} r={3.35} fill="#1A0D07" />
    <circle cx={look * 3 + 2.1} cy={-1} r={1.05} fill="#FFF9EA" opacity={0.9} />
    <path d="M-11 -0.4Q-4 -6.5 3 -5.4Q8 -4.6 11 -0.8" stroke={skinLine} strokeWidth={2.8} fill="none" strokeLinecap="round" opacity={0.9} />
    <path d="M-8 3.2Q0 5.7 8 2.7" stroke={skinLine} strokeWidth={1.25} fill="none" opacity={0.35} />
  </g>
);

export type FigureMode = "stand" | "archer" | "smile" | "bow" | "bless" | "walk" | "seated";

export const Barbarik: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  facing?: number;
  mode?: FigureMode;
  silhouette?: boolean;
  draw?: number;
  glow?: number;
  quiver?: boolean;
  seed?: number;
  bowing?: number;
}> = ({ f, x, y, s = 1, facing = 1, mode = "stand", silhouette = false, draw = 0, glow = 0, quiver = true, seed = 1, bowing = 0 }) => {
  const skin = silhouette ? "#17110E" : "url(#bbSkinWarm)";
  const shade = silhouette ? "#100C0A" : "#633620";
  const cloth = silhouette ? "#17110E" : "url(#bbClothOrange)";
  const cloth2 = silhouette ? "#100C0A" : "url(#bbClothTeal)";
  const hair = silhouette ? "#0D0A08" : "#16100B";
  const gold = silhouette ? "#17110E" : "#D6A247";
  const sw = Math.sin(f / 18 + seed) * 4;
  const bob = Math.sin(f / 24 + seed) * 2.2;
  const blink = silhouette ? 0 : blinkK(f, seed * 19);
  const archer = mode === "archer";
  const smile = mode === "smile" ? 0.75 : mode === "bow" ? 0.1 : 0.28;
  const lean = (mode === "bow" ? 13 : archer ? -3 : 0) + bowing * 18;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${facing * s} ${s})`}>
      <ellipse cx={0} cy={5} rx={78} ry={16} fill="#080606" opacity={0.28} />
      {quiver ? (
        <g transform={`translate(-48 -250) rotate(-16)`}>
          <path d="M-18 -20H28L20 92H-28Z" fill={silhouette ? "#0F0B09" : "#4B2C20"} stroke={silhouette ? "#0F0B09" : "#8B5B32"} strokeWidth={4} />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${-8 + i * 13} -42) rotate(${-5 + i * 5})`}>
              <path d="M0 0V-58" stroke="#C9A76A" strokeWidth={3.5} />
              <path d="M0 -76L-8 -55H8Z" fill={i < glow ? "#FFF0A0" : silhouette ? "#0F0B09" : "#AA6C35"} />
              {i < glow ? <circle cx={0} cy={-68} r={12} fill="#FFE777" opacity={0.3 + 0.18 * Math.sin(f / 6 + i)} filter="url(#bbBlur8)" /> : null}
            </g>
          ))}
        </g>
      ) : null}
      <g transform={`rotate(${lean} 0 -160)`}>
        <path d="M-44 -142C-62 -96 -58 -42 -40 0H-9L-4 -118Z" fill={shade} />
        <path d="M44 -142C62 -96 58 -42 40 0H9L4 -118Z" fill={shade} />
        <path d="M-44 -96C-52 -64 -49 -28 -39 0H-10L-4 -92Z" fill={silhouette ? cloth : "#7B452C"} opacity={0.96} />
        <path d="M44 -96C52 -64 49 -28 39 0H10L4 -92Z" fill={silhouette ? cloth : "#6C3B25"} opacity={0.96} />
        <path d="M-58 -160C-52 -98 -44 -55 -25 -34C-8 -22 13 -22 30 -34C47 -58 56 -105 56 -160C31 -176 -30 -176 -58 -160Z" fill={cloth} stroke={silhouette ? cloth : "#743B1E"} strokeWidth={4} />
        <path d={`M-58 -160C-20 -140 18 -138 56 -160L60 -128C24 -104 -24 -106 -62 -128Z`} fill={cloth2} opacity={0.95} />
        <path d={`M-58 -126C-30 -102 10 -96 58 -116L62 -88C28 -66 -18 -70 -62 -92Z`} fill={silhouette ? cloth : "#E0A15C"} opacity={0.72} />
        <path d={`M-54 -88C-20 -68 18 -68 56 -88L54 -62C20 -44 -18 -46 -56 -66Z`} fill={silhouette ? cloth : "#D6A247"} opacity={0.86} />
        <path d="M-8 -58C-14 -38 -13 -18 -8 0M13 -58C18 -38 17 -18 11 0" stroke={silhouette ? cloth : "#E7B76E"} strokeWidth={4} opacity={0.42} fill="none" />
        <path d={`M-38 -163C-34 -210 -24 -236 0 -238C25 -236 36 -210 40 -163C18 -150 -16 -150 -38 -163Z`} fill={silhouette ? cloth : "#3B6576"} stroke={silhouette ? cloth : "#1D3D4C"} strokeWidth={4} />
        <path d={`M-20 -238C-18 -254 18 -254 21 -238L16 -218H-15Z`} fill={skin} />
        {archer ? (
          <g>
            <path d="M28 -218C78 -210 112 -196 137 -177" stroke={skin} strokeWidth={20} strokeLinecap="round" fill="none" />
            <circle cx={139} cy={-176} r={12} fill={skin} />
            <path d="M-28 -216C-52 -198 -66 -184 -76 -164" stroke={shade} strokeWidth={18} strokeLinecap="round" fill="none" />
            <circle cx={-78} cy={-160} r={11} fill={skin} />
          </g>
        ) : mode === "bless" ? (
          <g>
            <path d="M28 -218C60 -196 76 -172 86 -136" stroke={skin} strokeWidth={19} strokeLinecap="round" fill="none" />
            <circle cx={88} cy={-130} r={12} fill={skin} />
            <path d="M-30 -218C-50 -180 -54 -148 -48 -112" stroke={shade} strokeWidth={18} strokeLinecap="round" fill="none" />
          </g>
        ) : mode === "bow" ? (
          <g>
            <path d="M30 -214C52 -190 56 -162 44 -136" stroke={skin} strokeWidth={19} strokeLinecap="round" fill="none" />
            <path d="M-30 -214C-52 -190 -56 -162 -44 -136" stroke={shade} strokeWidth={19} strokeLinecap="round" fill="none" />
            <circle cx={42} cy={-130} r={11} fill={skin} />
            <circle cx={-42} cy={-130} r={11} fill={skin} />
          </g>
        ) : (
          <g>
            <path d="M30 -214C54 -184 62 -148 54 -104" stroke={skin} strokeWidth={19} strokeLinecap="round" fill="none" />
            <path d="M-30 -214C-54 -184 -62 -148 -54 -104" stroke={shade} strokeWidth={19} strokeLinecap="round" fill="none" />
            <circle cx={54} cy={-98} r={11} fill={skin} />
            <circle cx={-54} cy={-98} r={11} fill={skin} />
          </g>
        )}
        <path d={`M-54 -166C-22 -144 22 -142 56 -164L58 -146C20 -122 -24 -124 -60 -148Z`} fill={gold} opacity={0.82} />
        <path d={`M-8 -158C-18 -118 -17 -70 -5 -18`} stroke={silhouette ? cloth : "#F0BE72"} strokeWidth={7} opacity={0.55} fill="none" />
        <g transform={`translate(${sw * 0.5} -162)`}>
          <path d={`M28 0C56 34 68 74 60 112C38 82 24 40 18 4Z`} fill={cloth2} opacity={0.88} />
        </g>
        <g transform={`translate(0 -286)`}>
          <ellipse cx={0} cy={0} rx={48} ry={54} fill={skin} stroke={silhouette ? skin : "#4E2816"} strokeWidth={3} />
          {!silhouette ? (
            <g>
              <path d="M-38 -6C-34 22 -20 43 2 49C-22 48 -42 31 -45 4Z" fill="#4A2415" opacity={0.18} />
              <path d="M29 -39C42 -24 45 5 35 28" stroke="#FFD39A" strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
              <path d="M-21 -37Q-4 -45 17 -39" stroke="#2A130B" strokeWidth={3} fill="none" opacity={0.35} />
            </g>
          ) : null}
          <path d="M-47 -12C-42 -48 -20 -66 7 -64C36 -61 49 -39 47 -9C28 -24 -4 -30 -47 -12Z" fill={hair} />
          <path d="M-10 -65C-8 -88 18 -88 21 -66C12 -72 0 -72 -10 -65Z" fill={hair} />
          <circle cx={8} cy={-86} r={13} fill={hair} />
          {!silhouette ? (
            <g>
              <Eye x={-17} y={-8} k={blink} look={0.2} />
              <Eye x={18} y={-8} k={blink} look={0.2} />
              <path d="M-28 -24Q-17 -31 -6 -25" stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d="M7 -25Q19 -31 30 -23" stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d="M2 -7C-3 5 -3 14 4 18M4 18C8 19 11 18 13 16" stroke="#5A2E19" strokeWidth={3.2} fill="none" strokeLinecap="round" />
              <path d={`M-15 28Q0 ${28 + smile * 14} 16 28`} stroke="#4C1E13" strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d="M-41 2C-48 4 -48 20 -39 22" fill={skin} />
              <path d="M41 2C48 4 48 20 39 22" fill={skin} />
              <circle cx={-31} cy={-3} r={2.4} fill={rim} opacity={0.6} />
            </g>
          ) : null}
        </g>
      </g>
      {archer ? <Bow x={120} y={-180} s={0.85} rot={-7} draw={draw} glow={glow} /> : null}
    </g>
  );
};

export const Krishna: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  facing?: number;
  raised?: number;
  brahmin?: boolean;
  silhouette?: boolean;
  seed?: number;
  palm?: boolean;
}> = ({ f, x, y, s = 1, facing = 1, raised = 0, brahmin = false, silhouette = false, seed = 2, palm = false }) => {
  const skin = silhouette ? "#15100E" : brahmin ? "#405F76" : "url(#bbSkinKrishna)";
  const shade = silhouette ? "#0F0B09" : "#214765";
  const robe = silhouette ? "#15100E" : brahmin ? "#E8DCC5" : "url(#bbRobeGold)";
  const robe2 = silhouette ? "#0F0B09" : brahmin ? "#B85732" : "#2F6F73";
  const sw = Math.sin(f / 19 + seed) * 3.5;
  const blink = silhouette ? 0 : blinkK(f, seed * 23);
  const armLift = lerp(0, 1, raised);
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      <ellipse cx={0} cy={5} rx={74} ry={15} fill="#080606" opacity={0.26} />
      {!silhouette ? <circle cx={0} cy={-290} r={122} fill="url(#bbBlueGlow)" opacity={brahmin ? 0.22 : 0.48} filter="url(#bbBlur18)" /> : null}
      <path d="M-42 -140C-58 -88 -54 -40 -36 0H-8L-4 -116Z" fill={shade} />
      <path d="M42 -140C58 -88 54 -40 36 0H8L4 -116Z" fill={shade} />
      <path d="M-56 -164C-51 -100 -40 -40 -18 0H22C46 -48 56 -105 54 -164C24 -178 -26 -178 -56 -164Z" fill={robe} stroke={silhouette ? robe : "#75511E"} strokeWidth={4} />
      <path d={`M-54 -156C-18 -132 20 -130 54 -154L58 -120C24 -94 -24 -96 -58 -122Z`} fill={robe2} opacity={0.9} />
      <path d="M-36 -162C-32 -210 -22 -236 0 -238C24 -236 34 -210 38 -162C16 -148 -16 -148 -36 -162Z" fill={silhouette ? robe : brahmin ? "#F1E6CF" : "#F2C14E"} stroke={silhouette ? robe : "#946324"} strokeWidth={4} />
      <path d="M-17 -238C-14 -254 16 -254 19 -238L14 -218H-13Z" fill={skin} />
      {armLift > 0.03 ? (
        <g transform={`rotate(${-52 * armLift} 30 -214)`}>
          <path d="M30 -214C58 -204 76 -184 90 -154" stroke={skin} strokeWidth={19} strokeLinecap="round" fill="none" />
          <circle cx={93} cy={-148} r={13} fill={skin} />
          {palm ? <path d="M92 -150C104 -160 112 -158 119 -149M94 -145C107 -145 115 -139 119 -130" stroke={skin} strokeWidth={5} strokeLinecap="round" /> : null}
        </g>
      ) : (
        <path d="M30 -214C54 -184 62 -148 54 -104" stroke={skin} strokeWidth={19} strokeLinecap="round" fill="none" />
      )}
      <path d="M-30 -214C-54 -184 -62 -148 -54 -104" stroke={shade} strokeWidth={19} strokeLinecap="round" fill="none" />
      <circle cx={54} cy={-98} r={11} fill={skin} />
      <circle cx={-54} cy={-98} r={11} fill={skin} />
      <g transform={`translate(${sw * 0.45} -162)`}>
        <path d="M24 0C50 30 60 68 54 108C36 78 22 38 16 2Z" fill={robe2} opacity={0.86} />
      </g>
      <g transform="translate(0 -286)">
        <ellipse cx={0} cy={0} rx={47} ry={53} fill={skin} stroke={silhouette ? skin : "#14283B"} strokeWidth={3} />
        {!silhouette ? (
          <g>
            <path d="M-37 -5C-33 22 -19 42 2 48C-22 47 -41 30 -44 4Z" fill="#102A42" opacity={0.18} />
            <path d="M28 -38C41 -22 44 5 34 28" stroke="#B9F1FF" strokeWidth={3.5} fill="none" opacity={0.42} strokeLinecap="round" />
          </g>
        ) : null}
        <path d="M-44 -14C-38 -50 -14 -66 10 -62C36 -58 48 -36 45 -8C25 -24 -4 -29 -44 -14Z" fill={silhouette ? skin : "#101019"} />
        {!brahmin ? (
          <g>
            <path d="M-30 -55L0 -86L32 -55Z" fill="#D8A93D" stroke="#7E4E16" strokeWidth={3} />
            <circle cx={0} cy={-62} r={7} fill="#6FC7D8" />
            <g transform={`translate(20 -82) rotate(18)`}>
              <path d="M0 0C12 -28 24 -42 40 -48" stroke="#2D7B57" strokeWidth={5} fill="none" />
              <ellipse cx={42} cy={-50} rx={10} ry={15} fill="#2E9A72" transform="rotate(24 42 -50)" />
              <ellipse cx={42} cy={-50} rx={5} ry={8} fill="#254F9E" transform="rotate(24 42 -50)" />
            </g>
          </g>
        ) : (
          <g opacity={0.55}>
            <path d="M-32 -55H32" stroke="#E8DCC5" strokeWidth={8} />
            <path d="M18 -76C28 -96 40 -102 52 -106" stroke="#7FD2B2" strokeWidth={3.5} fill="none" opacity={0.5} />
          </g>
        )}
        {!silhouette ? (
          <g>
            <Eye x={-17} y={-8} k={blink} look={0} />
            <Eye x={18} y={-8} k={blink} look={0} />
            <path d="M-28 -24Q-17 -29 -6 -24" stroke="#07111E" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M7 -24Q19 -29 30 -23" stroke="#07111E" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M0 -15V13M0 13C4 17 8 18 12 15" stroke="#F1D469" strokeWidth={4} strokeLinecap="round" opacity={0.9} fill="none" />
            <path d="M-14 28Q0 36 15 28" stroke="#0B1D2D" strokeWidth={4} fill="none" strokeLinecap="round" /><path d="M-8 31Q0 34 9 31" stroke="#8CC8DC" strokeWidth={1.4} fill="none" opacity={0.45} />
            {brahmin ? <path d="M-24 4Q0 15 24 4" stroke="#E8DCC5" strokeWidth={4} opacity={0.4} fill="none" /> : null}
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const ElderWarrior: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  facing?: number;
  kind: "bhishma" | "drona";
  silhouette?: boolean;
}> = ({ f, x, y, s = 1, facing = 1, kind, silhouette = false }) => {
  const bh = kind === "bhishma";
  const skin = silhouette ? "#15100E" : bh ? "#8B5A3A" : "#9A633D";
  const cloth = silhouette ? "#15100E" : bh ? "#D8D5C8" : "#E8DCC5";
  const trim = silhouette ? "#100C0A" : bh ? "#A9B6C5" : "#A75B2E";
  const beard = silhouette ? "#0F0B09" : "#F0EEE4";
  const blink = silhouette ? 0 : blinkK(f, bh ? 31 : 47);
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      <ellipse cx={0} cy={5} rx={76} ry={15} fill="#080606" opacity={0.25} />
      <path d="M-58 -158C-52 -96 -40 -38 -18 0H22C46 -48 56 -105 54 -158C24 -174 -26 -174 -58 -158Z" fill={cloth} stroke={silhouette ? cloth : trim} strokeWidth={4} />
      <path d="M-38 -160C-34 -208 -22 -234 0 -237C23 -234 35 -208 39 -160C16 -147 -16 -147 -38 -160Z" fill={bh && !silhouette ? "#C5CBD3" : cloth} />
      <path d="M30 -212C52 -182 58 -146 52 -106" stroke={skin} strokeWidth={18} strokeLinecap="round" fill="none" />
      <path d="M-30 -212C-52 -182 -58 -146 -52 -106" stroke={skin} strokeWidth={18} strokeLinecap="round" fill="none" opacity={0.82} />
      <path d="M-48 -150C-20 -130 22 -128 54 -148" stroke={trim} strokeWidth={13} opacity={0.8} />
      <g transform="translate(0 -282)">
        <ellipse cx={0} cy={0} rx={46} ry={52} fill={skin} />
        <path d="M-42 -10C-38 -44 -18 -62 5 -61C33 -58 45 -37 43 -8C24 -22 -4 -27 -42 -10Z" fill={beard} />
        {bh ? <path d="M-42 -48C-20 -76 20 -76 43 -48L35 -32C16 -45 -14 -45 -34 -32Z" fill={silhouette ? beard : "#E7E3D5"} /> : <path d="M-8 -63C-4 -82 16 -82 18 -62" stroke={beard} strokeWidth={9} fill="none" />}
        <path d="M-28 16C-20 52 20 52 29 16C18 30 -16 30 -28 16Z" fill={beard} opacity={0.95} />
        {!silhouette ? (
          <g>
            <Eye x={-16} y={-8} k={blink} look={0} />
            <Eye x={17} y={-8} k={blink} look={0} />
            <path d="M-28 -23Q-16 -30 -5 -24" stroke="#E9E5D8" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M6 -24Q18 -30 29 -22" stroke="#E9E5D8" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M-10 25Q0 31 11 25" stroke="#4C2415" strokeWidth={3.5} fill="none" />
            {!bh ? <path d="M-4 -28V-8" stroke="#B63A2E" strokeWidth={4} strokeLinecap="round" /> : null}
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const Mother: React.FC<{ f: number; x: number; y: number; s?: number; facing?: number; silhouette?: boolean }> = ({ f, x, y, s = 1, facing = 1, silhouette = false }) => {
  const skin = silhouette ? "#15100E" : "#935C3A";
  const sari = silhouette ? "#15100E" : "#7E3646";
  const sari2 = silhouette ? "#100C0A" : "#D9984A";
  const blink = silhouette ? 0 : blinkK(f, 73);
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      <ellipse cx={0} cy={5} rx={70} ry={14} fill="#080606" opacity={0.25} />
      <path d="M-52 -152C-62 -92 -50 -40 -24 0H26C52 -48 58 -105 48 -152C20 -168 -24 -168 -52 -152Z" fill={sari} />
      <path d="M-50 -142C-14 -120 20 -118 50 -140L54 -108C24 -82 -20 -84 -54 -110Z" fill={sari2} opacity={0.86} />
      <path d="M-34 -158C-28 -204 -18 -230 0 -232C21 -230 31 -204 35 -158C14 -146 -14 -146 -34 -158Z" fill={sari} />
      <path d="M28 -210C62 -196 86 -176 100 -146" stroke={skin} strokeWidth={17} strokeLinecap="round" fill="none" />
      <circle cx={103} cy={-141} r={11} fill={skin} />
      <path d="M-28 -210C-46 -180 -50 -146 -44 -106" stroke={skin} strokeWidth={17} strokeLinecap="round" fill="none" opacity={0.85} />
      <g transform="translate(0 -274)">
        <ellipse cx={0} cy={0} rx={43} ry={50} fill={skin} />
        <path d="M-41 -8C-40 -42 -20 -62 5 -61C33 -58 44 -35 41 -5C20 -22 -5 -26 -41 -8Z" fill={silhouette ? skin : "#17100C"} />
        <path d="M-40 -30C-54 20 -48 66 -28 100" stroke={sari2} strokeWidth={18} fill="none" opacity={0.9} />
        {!silhouette ? (
          <g>
            <Eye x={-15} y={-6} k={blink} look={0.4} />
            <Eye x={16} y={-6} k={blink} look={0.4} />
            <circle cx={0} cy={-20} r={3.5} fill="#B83338" />
            <path d="M-12 25Q0 32 13 25" stroke="#4C1E13" strokeWidth={3.8} fill="none" strokeLinecap="round" />
            <circle cx={-35} cy={10} r={4} fill="#D8A93D" />
            <circle cx={35} cy={10} r={4} fill="#D8A93D" />
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const GiantSilhouette: React.FC<{ x: number; y: number; s?: number; facing?: number; kind: "bhima" | "ghatot"; o?: number }> = ({ x, y, s = 1, facing = 1, kind, o = 0.78 }) => {
  const bh = kind === "bhima";
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`} opacity={o} fill="#14100E">
      <ellipse cx={0} cy={4} rx={95} ry={18} opacity={0.35} />
      <path d={bh ? "M-92 -150C-78 -230 -42 -275 0 -276C48 -275 82 -226 94 -150C72 -96 62 -42 50 0H-48C-62 -46 -72 -96 -92 -150Z" : "M-82 -150C-70 -220 -38 -260 0 -260C42 -260 72 -218 84 -150C66 -94 58 -42 46 0H-44C-58 -46 -66 -96 -82 -150Z"} />
      <circle cx={0} cy={-304} r={bh ? 55 : 50} />
      {bh ? <path d="M-42 -344C-24 -380 26 -380 44 -344Z" /> : <path d="M-45 -330L-72 -374L-26 -352L-8 -394L10 -352L55 -378L38 -330Z" />}
      <path d="M72 -220C116 -194 138 -158 148 -106" stroke="#14100E" strokeWidth={28} strokeLinecap="round" fill="none" />
      <path d="M140 -116L178 -40" stroke="#14100E" strokeWidth={16} strokeLinecap="round" />
      <circle cx={184} cy={-26} r={28} />
    </g>
  );
};

export const ShivaGlow: React.FC<{ f: number; x: number; y: number; s?: number; o?: number }> = ({ f, x, y, s = 1, o = 1 }) => {
  const pulse = 0.8 + 0.2 * Math.sin(f / 12);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle cx={0} cy={-170} r={220 * pulse} fill="#BFEFFF" opacity={0.13} filter="url(#bbBlur18)" />
      <circle cx={0} cy={-170} r={120 * pulse} fill="#D9FBFF" opacity={0.18} filter="url(#bbBlur18)" />
      <g fill="#17202A" opacity={0.88}>
        <path d="M-78 -78C-52 -116 52 -116 78 -78C54 -52 28 -38 0 -38C-28 -38 -54 -52 -78 -78Z" />
        <path d="M-46 -78C-42 -142 -24 -176 0 -178C26 -176 44 -142 48 -78C26 -62 -24 -62 -46 -78Z" />
        <circle cx={0} cy={-214} r={43} />
        <path d="M-30 -248C-12 -280 20 -280 34 -248C16 -260 -12 -260 -30 -248Z" />
      </g>
      <path d="M-72 -284C-88 -300 -86 -326 -66 -334C-76 -314 -72 -296 -52 -286" fill="none" stroke="#D9FBFF" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      <path d="M86 -286V-120M86 -286L62 -248M86 -286L110 -248" stroke="#17202A" strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${-170 + i * 170} ${-310 + i * 12}Q0 ${-380 - i * 8} ${170 - i * 170} ${-310 + i * 12}`} stroke="#C9F5FF" strokeWidth={3} opacity={0.18 + 0.08 * Math.sin(f / 10 + i)} fill="none" />
      ))}
    </g>
  );
};

export const SereneHead: React.FC<{ f: number; x: number; y: number; s?: number; glow?: number }> = ({ f, x, y, s = 1, glow = 1 }) => {
  const pulse = 0.75 + 0.25 * Math.sin(f / 13);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={116 * pulse * glow} fill="#FFE7A0" opacity={0.16 * glow} filter="url(#bbBlur18)" />
      <circle cx={0} cy={0} r={72} fill="#875334" stroke="#FFD39A" strokeWidth={4} />
      <path d="M-66 -18C-58 -64 -25 -88 10 -84C50 -78 68 -48 65 -12C34 -36 -8 -42 -66 -18Z" fill="#16100B" />
      <path d="M-11 -84C-8 -112 22 -112 25 -84C12 -92 1 -92 -11 -84Z" fill="#16100B" />
      <circle cx={9} cy={-104} r={15} fill="#16100B" />
      <path d="M-35 -12Q-20 -20 -5 -12M6 -12Q21 -20 37 -12" stroke="#21150E" strokeWidth={5.5} fill="none" strokeLinecap="round" />
      <Eye x={-19} y={3} k={0.55} look={0} />
      <Eye x={20} y={3} k={0.55} look={0} />
      <path d="M2 4C-3 19 -2 29 7 33M7 33C11 34 14 32 16 30" stroke="#5A2E19" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M-20 43Q0 54 22 43" stroke="#4C1E13" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d="M-12 46Q0 51 14 46" stroke="#D88B65" strokeWidth={1.7} fill="none" opacity={0.55} />
      <path d="M0 -70V-34" stroke="#F1D469" strokeWidth={5} strokeLinecap="round" opacity={0.95} />
      <path d="M-56 -34C-30 -50 28 -50 58 -34" stroke="#D8A93D" strokeWidth={6} fill="none" opacity={0.85} />
      <circle cx={-34} cy={-3} r={3} fill="#FFD39A" opacity={0.65} />
    </g>
  );
};

export const GoldenScale: React.FC<{ f: number; x: number; y: number; s?: number; tilt?: number; glow?: number }> = ({ f, x, y, s = 1, tilt = 0, glow = 0.7 }) => {
  const ang = tilt * 13;
  const chain = 92;
  const panL = { x: -178, y: chain + ang * -1.2 };
  const panR = { x: 178, y: chain + ang * 1.2 };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-180} r={100} fill="#FFDC7A" opacity={0.1 * glow + 0.018 * Math.sin(f / 9)} filter="url(#bbBlur18)" />
      <path d="M0 -180V112" stroke="#4A250B" strokeWidth={28} strokeLinecap="round" opacity={0.75} />
      <path d="M0 -180V112" stroke="#F0BE55" strokeWidth={18} strokeLinecap="round" />
      <path d="M-28 -154L0 -188L28 -154Z" fill="url(#bbGold)" stroke="#5B310E" strokeWidth={4} />
      <path d="M-72 112H72L96 154H-96Z" fill="url(#bbGold)" stroke="#6B3F13" strokeWidth={5} />
      <g transform={`rotate(${ang} 0 -178)`}>
        <path d="M-205 -178H205" stroke="#4A250B" strokeWidth={24} strokeLinecap="round" opacity={0.78} />
        <path d="M-205 -178H205" stroke="#F2C45C" strokeWidth={14} strokeLinecap="round" />
        <circle cx={0} cy={-178} r={22} fill="#FFF1A8" stroke="#7A4715" strokeWidth={5} />
        {[panL, panR].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${-178})`}>
            <path d={`M0 0L${-42} ${chain}M0 0L42 ${chain}M0 0V${chain}`} stroke="#4A250B" strokeWidth={8} opacity={0.55} />
            <path d={`M0 0L${-42} ${chain}M0 0L42 ${chain}M0 0V${chain}`} stroke="#F2C45C" strokeWidth={4.5} />
            <path d={`M-64 ${chain}Q0 ${chain + 42} 64 ${chain}L52 ${chain + 12}Q0 ${chain + 32} -52 ${chain + 12}Z`} fill="url(#bbGold)" stroke="#704112" strokeWidth={5} />
          </g>
        ))}
      </g>
    </g>
  );
};

export const ThreadBlessing: React.FC<{ f: number; x: number; y: number; s?: number; glow?: number }> = ({ f, x, y, s = 1, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={42 * glow} fill="#FFD98A" opacity={0.16 * glow} filter="url(#bbBlur8)" />
    <path d={`M-56 0C-24 ${-16 + Math.sin(f / 12) * 3} 24 ${16 - Math.sin(f / 12) * 3} 56 0`} stroke="#D34F35" strokeWidth={7} fill="none" strokeLinecap="round" />
    <circle cx={0} cy={0} r={9} fill="#F4C05A" />
  </g>
);

export const KarnaFigure: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  facing?: number;
  silhouette?: boolean;
  noArmour?: boolean;
  offering?: number;
  glow?: number;
  seed?: number;
}> = ({ f, x, y, s = 1, facing = 1, silhouette = false, noArmour = false, offering = 0, glow = 0, seed = 1 }) => {
  const skin = silhouette ? "#17110E" : "url(#bbSkinWarm)";
  const shade = silhouette ? "#100C0A" : "#633620";
  const cloth = silhouette ? "#17110E" : "#F0DFB8";
  const clothDark = silhouette ? "#100C0A" : "#8A5528";
  const gold = silhouette ? "#17110E" : "url(#bbGold)";
  const hair = silhouette ? "#0D0A08" : "#17100B";
  const bob = Math.sin(f / 24 + seed) * 2;
  const sw = Math.sin(f / 16 + seed) * 4;
  const armLift = offering * 44;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${facing * s} ${s})`}>
      <ellipse cx={0} cy={5} rx={78} ry={15} fill="#080606" opacity={0.28} />
      {glow > 0 ? <circle cx={0} cy={-190} r={145 * glow} fill="#FFE39A" opacity={0.13 * glow} filter="url(#bbBlur18)" /> : null}
      <path d="M-42 -128C-56 -82 -52 -35 -36 0H-8L-5 -112Z" fill={shade} />
      <path d="M42 -128C56 -82 52 -35 36 0H8L5 -112Z" fill={shade} />
      <path d={`M-58 -142C-50 -92 -40 -52 -20 -28C-5 -15 12 -15 28 -28C46 -55 55 -98 55 -142C30 -158 -28 -158 -58 -142Z`} fill={cloth} stroke={silhouette ? cloth : "#6B3B1F"} strokeWidth={4} />
      <path d={`M-55 -108C-24 -88 18 -88 55 -110L58 -82C28 -60 -20 -62 -58 -84Z`} fill={clothDark} opacity={0.88} />
      <path d={`M-54 -82C-28 -62 20 -60 56 -78L55 -50C24 -30 -24 -34 -56 -52Z`} fill={silhouette ? cloth : "#D89545"} opacity={0.55} />
      {!noArmour ? (
        <g>
          <path d="M-48 -226C-38 -180 -28 -152 0 -142C28 -152 40 -180 48 -226C24 -238 -24 -238 -48 -226Z" fill={gold} stroke={silhouette ? gold : "#74430F"} strokeWidth={4} />
          <path d="M-35 -210C-12 -198 14 -198 37 -210M-38 -188C-12 -174 14 -174 38 -188M-28 -166C-8 -156 10 -156 28 -166" stroke="#FFF0A8" strokeWidth={3} opacity={silhouette ? 0 : 0.48} fill="none" />
          <circle cx={0} cy={-190} r={13} fill={silhouette ? gold : "#FFF1A8"} opacity={0.8} />
        </g>
      ) : (
        <path d="M-42 -222C-32 -178 -22 -154 0 -144C22 -154 32 -178 42 -222C20 -232 -20 -232 -42 -222Z" fill={skin} stroke={silhouette ? skin : "#7A472C"} strokeWidth={3} />
      )}
      <g transform={`translate(${-44 - offering * 8} ${-205 - armLift}) rotate(${-18 - offering * 24 + sw * 0.25})`}>
        <path d="M0 0C-20 38 -25 68 -14 94" stroke={skin} strokeWidth={20} strokeLinecap="round" fill="none" />
        <circle cx={-12} cy={98} r={13} fill={skin} />
      </g>
      <g transform={`translate(${44 + offering * 8} ${-205 - armLift}) rotate(${18 + offering * 24 - sw * 0.25})`}>
        <path d="M0 0C20 38 25 68 14 94" stroke={skin} strokeWidth={20} strokeLinecap="round" fill="none" />
        <circle cx={12} cy={98} r={13} fill={skin} />
      </g>
      <path d="M-28 -254C-30 -224 -20 -205 0 -200C20 -205 30 -224 28 -254C14 -266 -14 -266 -28 -254Z" fill={skin} />
      <circle cx={0} cy={-287} r={42} fill={skin} />
      <path d="M-40 -292C-38 -330 -10 -346 22 -336C44 -328 48 -300 35 -278C28 -304 8 -318 -18 -312C-32 -308 -38 -300 -40 -292Z" fill={hair} />
      <ellipse cx={-6} cy={-334} rx={32} ry={20} fill={hair} />
      <circle cx={-16} cy={-356} r={18} fill={hair} />
      <path d="M-12 -286Q1 -294 16 -286" stroke="#1B0E08" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M-2 -270Q10 -266 20 -274" stroke="#5B2B18" strokeWidth={3} fill="none" strokeLinecap="round" />
      <circle cx={-35} cy={-264} r={7} fill={silhouette ? hair : "#F2C46D"} />
      <path d="M-35 -257L-42 -238L-28 -238Z" fill={silhouette ? hair : "#F2C46D"} />
      <path d="M-8 -318L-4 -342" stroke="#C23B2D" strokeWidth={4} strokeLinecap="round" opacity={silhouette ? 0 : 1} />
    </g>
  );
};

export const ShaktiSpear: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -170V150" stroke="#FFF7DA" strokeWidth={18} opacity={0.22 * glow} filter="url(#bbBlur8)" />
    <path d="M0 -170V150" stroke="#D9B66A" strokeWidth={7} strokeLinecap="round" />
    <path d="M0 -220L-28 -162H28Z" fill="#FFF8D6" stroke="#8B551D" strokeWidth={4} />
    <circle cx={0} cy={-184} r={30 * glow} fill="#FFF4C2" opacity={0.25 * glow} filter="url(#bbBlur8)" />
    <path d="M-24 150H24L0 196Z" fill="#D9B66A" />
  </g>
);

export const KavachPiece: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={0} cy={-30} r={135 * glow} fill="#FFE7A0" opacity={0.14 * glow} filter="url(#bbBlur18)" />
    <path d="M-80 -120C-66 -52 -36 -8 0 10C36 -8 66 -52 80 -120C42 -142 -42 -142 -80 -120Z" fill="url(#bbGold)" stroke="#6B3F13" strokeWidth={6} />
    <path d="M-58 -98C-20 -76 20 -76 58 -98M-62 -66C-20 -42 20 -42 62 -66M-40 -30C-12 -16 12 -16 40 -30" stroke="#FFF0A8" strokeWidth={5} fill="none" opacity={0.65} />
    <circle cx={0} cy={-78} r={21} fill="#FFF1A8" stroke="#9A5A18" strokeWidth={4} />
  </g>
);

export const BabyBasket: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => {
  const bob = Math.sin(f / 13) * 7;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={44} rx={118} ry={20} fill="#0B1720" opacity={0.22} />
      <path d="M-96 -12C-70 48 70 48 96 -12C58 10 -58 10 -96 -12Z" fill="#8A5A2E" stroke="#3E2616" strokeWidth={5} />
      <path d="M-82 -5C-35 16 35 16 82 -5M-66 18C-25 32 25 32 66 18" stroke="#D4A15A" strokeWidth={4} fill="none" opacity={0.65} />
      <circle cx={0} cy={-32} r={34} fill="url(#bbSkinWarm)" />
      <path d="M-26 -45C-12 -62 16 -62 28 -42C12 -50 -8 -50 -26 -45Z" fill="#17100B" />
      <circle cx={-11} cy={-33} r={3.5} fill="#1A0D07" /><circle cx={13} cy={-33} r={3.5} fill="#1A0D07" />
      <path d="M-8 -18Q2 -12 12 -19" stroke="#6B321E" strokeWidth={2.5} fill="none" />
      <path d="M-38 -2C-20 -28 22 -28 40 -2C18 10 -18 10 -38 -2Z" fill="url(#bbGold)" opacity={0.95} />
      <circle cx={0} cy={-5} r={50} fill="#FFE8A0" opacity={0.16} filter="url(#bbBlur8)" />
    </g>
  );
};
