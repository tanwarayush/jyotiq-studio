import React from "react";
import { Easing, interpolate } from "remotion";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";

export const W = 1080;
export const H = 1920;
export const MUKTA = loadMukta("normal", { weights: ["500", "700", "800"], subsets: ["devanagari", "latin"] }).fontFamily;
export const ROZHA = loadRozha("normal", { weights: ["400"], subsets: ["devanagari", "latin"] }).fontFamily;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const prog = (f: number, a: number, b: number, ease: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
export const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const outBack = Easing.out(Easing.back(1.55));
export const outCubic = Easing.out(Easing.cubic);
export const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const vnoise = (t: number, seed: number) => {
  const i = Math.floor(t);
  const u = t - i;
  const a = rnd(i, seed) * 2 - 1;
  const b = rnd(i + 1, seed) * 2 - 1;
  const s = u * u * (3 - 2 * u);
  return a + (b - a) * s;
};
export const shakeAt = (f: number, hits: number[], amp = 14, dur = 13) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const t = f - h;
    if (t < 0 || t > dur) continue;
    const k = Math.pow(1 - t / dur, 2) * amp;
    x += vnoise(t * 1.7, h) * k;
    y += vnoise(t * 1.7, h + 99) * k;
  }
  return { x, y };
};

export const Cam: React.FC<{
  f: number;
  a: number;
  b: number;
  cx: number;
  cy: number;
  s0?: number;
  s1?: number;
  dx?: number;
  dy?: number;
  hits?: number[];
  amp?: number;
  children: React.ReactNode;
}> = ({ f, a, b, cx, cy, s0 = 1, s1 = 1.05, dx = 0, dy = 0, hits = [], amp = 14, children }) => {
  const u = prog(f, a, b, Easing.inOut(Easing.sin));
  const s = lerp(s0, s1, u);
  const sh = shakeAt(f, hits, amp);
  const bx = vnoise(f / 47, 7) * 2.2;
  const by = vnoise(f / 53, 11) * 2.2;
  return <g transform={`translate(${cx + dx * u + sh.x + bx} ${cy + dy * u + sh.y + by}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>;
};

export const Flash: React.FC<{ f: number; at: number; color?: string; peak?: number; rise?: number; fall?: number }> = ({ f, at, color = "#FFF8EE", peak = 0.9, rise = 2, fall = 10 }) => {
  const o = interpolate(f, [at - rise, at, at + fall], [0, peak, 0], clamp);
  if (o <= 0.001) return null;
  return <rect width={W} height={H} fill={color} opacity={o} />;
};

export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="bbSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#26354F" />
      <stop offset="0.42" stopColor="#596077" />
      <stop offset="0.72" stopColor="#A8653E" />
      <stop offset="1" stopColor="#E0A15C" />
    </linearGradient>
    <linearGradient id="bbSkyDeep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#121A2E" />
      <stop offset="0.55" stopColor="#3C3F58" />
      <stop offset="1" stopColor="#9A5B3E" />
    </linearGradient>
    <linearGradient id="bbGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5E4732" />
      <stop offset="1" stopColor="#1D1712" />
    </linearGradient>
    <linearGradient id="bbGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFF1A8" />
      <stop offset="0.45" stopColor="#D99B35" />
      <stop offset="1" stopColor="#8E551B" />
    </linearGradient>
    <linearGradient id="bbSkinWarm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#5E321D" />
      <stop offset="0.45" stopColor="#875334" />
      <stop offset="0.82" stopColor="#B8794C" />
      <stop offset="1" stopColor="#E2A96F" />
    </linearGradient>
    <linearGradient id="bbSkinKrishna" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#1D3B5C" />
      <stop offset="0.48" stopColor="#2F638D" />
      <stop offset="0.86" stopColor="#5D96BA" />
      <stop offset="1" stopColor="#9BC9DA" />
    </linearGradient>
    <linearGradient id="bbClothOrange" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#78351D" />
      <stop offset="0.5" stopColor="#C77335" />
      <stop offset="1" stopColor="#F0B56C" />
    </linearGradient>
    <linearGradient id="bbClothTeal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#173548" />
      <stop offset="0.52" stopColor="#3B6576" />
      <stop offset="1" stopColor="#77A7AE" />
    </linearGradient>
    <linearGradient id="bbRobeGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#8E551B" />
      <stop offset="0.5" stopColor="#E4A92F" />
      <stop offset="1" stopColor="#FFE08A" />
    </linearGradient>
    <linearGradient id="sp-gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff0a8" />
      <stop offset="0.52" stopColor="#f3c24f" />
      <stop offset="1" stopColor="#8a5a14" />
    </linearGradient>
    <linearGradient id="sp-goldH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8a5a14" />
      <stop offset="0.5" stopColor="#f3c24f" />
      <stop offset="1" stopColor="#fff0a8" />
    </linearGradient>
    <linearGradient id="ar-white" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#bdb6a6" />
      <stop offset="0.55" stopColor="#f7f1e6" />
      <stop offset="1" stopColor="#fffdf4" />
    </linearGradient>
    <linearGradient id="bbFlame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#E36B2C" />
      <stop offset="0.5" stopColor="#FFC94F" />
      <stop offset="1" stopColor="#FFF6B8" />
    </linearGradient>
    <radialGradient id="bbSun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFE8A8" stopOpacity="1" />
      <stop offset="0.45" stopColor="#FFAF52" stopOpacity="0.65" />
      <stop offset="1" stopColor="#FF8B3D" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="bbBlueGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#B9F1FF" stopOpacity="0.9" />
      <stop offset="0.55" stopColor="#68B7D9" stopOpacity="0.35" />
      <stop offset="1" stopColor="#315F87" stopOpacity="0" />
    </radialGradient>
    <filter id="bbBlur8" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="bbBlur18" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <filter id="bbGrainFilter" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="17" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.52  0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0.23 0" />
    </filter>
    <filter id="bbSoftShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#080604" floodOpacity="0.42" />
    </filter>
  </defs>
);

export const PaperGrain: React.FC<{ o?: number }> = ({ o = 0.18 }) => (
  <g opacity={o} pointerEvents="none">
    <rect width={W} height={H} filter="url(#bbGrainFilter)" opacity={0.75} />
    {Array.from({ length: 90 }, (_, i) => (
      <circle key={i} cx={rnd(i, 31) * W} cy={rnd(i, 32) * H} r={0.8 + rnd(i, 33) * 1.8} fill={i % 2 ? "#FFF0C8" : "#2B1D14"} opacity={0.12 + rnd(i, 34) * 0.16} />
    ))}
  </g>
);

export const Vignette: React.FC<{ o?: number; color?: string }> = ({ o = 0.55, color = "#09070B" }) => (
  <g opacity={o}>
    <rect width={W} height={H} fill="none" stroke={color} strokeWidth={150} opacity={0.35} filter="url(#bbBlur18)" />
    <path d={`M0 0H${W}V${H}H0Z M70 70V${H - 70}H${W - 70}V70Z`} fill={color} fillRule="evenodd" opacity={0.23} filter="url(#bbBlur18)" />
  </g>
);

export const Motes: React.FC<{ f: number; n?: number; color?: string; o?: number; seed?: number; y0?: number; y1?: number; ember?: boolean }> = ({ f, n = 28, color = "#FFD793", o = 1, seed = 5, y0 = 320, y1 = 1720, ember = false }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const span = y1 - y0;
      const speed = ember ? 1.1 + rnd(i, seed) * 2.0 : 0.25 + rnd(i, seed) * 0.8;
      const yy = ember ? y1 - ((rnd(i, seed + 1) * span + f * speed) % span) : y0 + ((rnd(i, seed + 1) * span + f * speed) % span);
      const xx = rnd(i, seed + 2) * W + Math.sin(f / (19 + i % 9) + i) * (10 + rnd(i, seed + 3) * 22);
      const rr = (ember ? 2.1 : 1.5) + rnd(i, seed + 4) * (ember ? 3.4 : 2.4);
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (13 + i % 7) + i * 1.7));
      return <circle key={i} cx={xx} cy={yy} r={rr} fill={color} opacity={(ember ? 0.32 : 0.18) + 0.5 * tw} />;
    })}
  </g>
);

export const CloudBand: React.FC<{ f: number; y: number; s?: number; o?: number; dark?: boolean; drift?: number }> = ({ f, y, s = 1, o = 0.65, dark = true, drift = 0.18 }) => {
  const x = -80 + ((f * drift) % 180);
  const c1 = dark ? "#263349" : "#71809A";
  const c2 = dark ? "#1D2940" : "#9AA3B4";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx={i * 170 + (i % 2) * 34} cy={(i % 3) * 18} rx={145 + (i % 3) * 40} ry={44 + (i % 2) * 18} fill={i % 2 ? c1 : c2} opacity={0.82} />
      ))}
    </g>
  );
};

export const DotArmy: React.FC<{ x: number; y: number; cols?: number; rows?: number; dx?: number; dy?: number; color?: string; o?: number; flip?: boolean; shrink?: number; f?: number }> = ({
  x,
  y,
  cols = 14,
  rows = 7,
  dx = 18,
  dy = 16,
  color = "#FFD67A",
  o = 1,
  flip = false,
  shrink = 1,
  f = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -shrink : shrink} ${shrink})`} opacity={o}>
    {Array.from({ length: cols * rows }, (_, i) => {
      const cx = (i % cols) * dx;
      const cy = Math.floor(i / cols) * dy;
      const tw = 0.65 + 0.35 * Math.sin((f ?? 0) / 11 + i * 0.73);
      return <circle key={i} cx={cx} cy={cy} r={3.1 + (i % 3) * 0.35} fill={color} opacity={(0.48 + (i % 5) * 0.07) * tw} />;
    })}
    {Array.from({ length: 4 }, (_, i) => (
      <path key={i} d={`M${20 + i * 58} -18V-54`} stroke="#3A281C" strokeWidth={4} opacity={0.8} />
    ))}
    {Array.from({ length: 4 }, (_, i) => (
      <path key={`fl${i}`} d={`M${20 + i * 58} -54L${48 + i * 58} -46L${20 + i * 58} -37Z`} fill={i % 2 ? "#8F3540" : "#2F6576"} opacity={0.78} />
    ))}
  </g>
);

export const CaptionShade: React.FC = () => (
  <g>
    <path d="M0 1200H1080V1660H0Z" fill="#050404" opacity={0.24} filter="url(#bbBlur18)" />
  </g>
);
