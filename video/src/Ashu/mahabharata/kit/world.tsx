import React from "react";
import { CloudBand, DotArmy, H, Motes, W, rnd } from "./kit";
import { SereneHead } from "./cast";

export const Battlefield: React.FC<{
  f: number;
  deep?: boolean;
  armies?: number;
  leftShrink?: number;
  rightShrink?: number;
  empty?: number;
  mist?: number;
  highSun?: boolean;
}> = ({ f, deep = false, armies = 1, leftShrink = 1, rightShrink = 1, empty = 0, mist = 0.6, highSun = false }) => {
  const skyDrift = f * 0.08;
  const midDrift = f * 0.18;
  return (
    <g>
      <rect width={W} height={H} fill={deep ? "url(#bbSkyDeep)" : "url(#bbSky)"} />
      <circle cx={highSun ? 740 : 705} cy={highSun ? 520 : 760} r={highSun ? 190 : 260} fill="url(#bbSun)" opacity={highSun ? 0.75 : 0.95} />
      <g transform={`translate(${-skyDrift} 0)`}>
        <CloudBand f={f} y={210} s={0.78} o={0.66} drift={0.12} />
        <CloudBand f={f + 40} y={390} s={1.02} o={0.48} drift={0.08} />
      </g>
      <g transform={`translate(${-midDrift * 0.3} 0)`} opacity={0.86}>
        <path d="M-80 930C180 820 310 860 520 790C700 730 890 810 1160 720V1220H-80Z" fill="#252C3E" opacity={0.62} />
        <path d="M-80 990C200 910 380 960 560 890C760 820 910 920 1160 850V1250H-80Z" fill="#1D2434" opacity={0.82} />
      </g>
      <rect y={1080} width={W} height={840} fill="url(#bbGround)" />
      <path d="M0 1105C240 1070 420 1118 650 1080C820 1054 960 1086 1080 1066V1190C840 1220 560 1180 310 1210C180 1224 70 1210 0 1220Z" fill="#51402E" opacity={0.72} />
      <g opacity={armies * (1 - empty)}>
        <DotArmy x={86} y={1125} cols={15} rows={7} dx={20} dy={17} shrink={leftShrink} color="#FFD67A" f={f} />
        <DotArmy x={978} y={1125} cols={15} rows={7} dx={20} dy={17} shrink={rightShrink} color="#FFB66E" f={f + 9} flip />
      </g>
      {mist > 0.01 ? (
        <g opacity={mist}>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={((f * (0.45 + i * 0.13) + i * 390) % (W + 620)) - 310} cy={1160 + i * 135} rx={390} ry={58} fill="#C8C1AE" opacity={0.11} filter="url(#bbBlur18)" />
          ))}
        </g>
      ) : null}
      <g opacity={0.8}>
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${rnd(i, 4) * W} ${1510 + rnd(i, 5) * 310}l${-8 + rnd(i, 6) * 16} ${-18 - rnd(i, 7) * 32}`} stroke={i % 2 ? "#3A2B1E" : "#6B4C2C"} strokeWidth={3 + rnd(i, 8) * 3} opacity={0.35} />
        ))}
      </g>
      <Motes f={f} n={34} color="#FFBF6A" o={0.75} ember seed={19} y0={760} y1={1790} />
    </g>
  );
};

export const Camp: React.FC<{ f: number; night?: boolean }> = ({ f, night = false }) => {
  const flap = Math.sin(f / 14) * 5;
  return (
    <g>
      <rect width={W} height={H} fill={night ? "url(#bbSkyDeep)" : "url(#bbSky)"} />
      <CloudBand f={f} y={260} s={0.9} o={0.46} drift={0.1} />
      <circle cx={830} cy={620} r={210} fill="url(#bbSun)" opacity={night ? 0.35 : 0.8} />
      <rect y={1080} width={W} height={840} fill="url(#bbGround)" />
      <path d="M0 1100C250 1070 500 1120 760 1084C900 1064 1010 1086 1080 1072V1920H0Z" fill="#4A3829" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${180 + i * 315} ${1130 + (i % 2) * 55}) scale(${1 - i * 0.08})`}>
          <path d="M-130 0L0 -155L130 0Z" fill={i % 2 ? "#7B4730" : "#6A3E2E"} stroke="#3A2319" strokeWidth={5} />
          <path d="M0 -155L0 0" stroke="#3A2319" strokeWidth={5} opacity={0.6} />
          <path d="M-18 0L0 -58L22 0Z" fill="#241813" opacity={0.82} />
          <path d={`M0 -155V-220`} stroke="#2A1B12" strokeWidth={5} />
          <path d={`M0 -220L${62 + flap} -204L0 -188Z`} fill={i % 2 ? "#2F6576" : "#963F3F"} />
        </g>
      ))}
      <g transform="translate(530 1410)">
        <ellipse cx={0} cy={30} rx={96} ry={22} fill="#150E0A" opacity={0.5} />
        {[-34, 0, 34].map((xx, i) => (
          <path key={i} d={`M${xx} 22C${xx - 16} -18 ${xx + 12} -42 ${xx + Math.sin(f / 5 + i) * 8} -78C${xx + 26} -44 ${xx + 20} -10 ${xx} 22Z`} fill="url(#bbFlame)" opacity={0.8 + 0.2 * Math.sin(f / 6 + i)} />
        ))}
        <path d="M-70 28L70 28" stroke="#3A2114" strokeWidth={14} strokeLinecap="round" />
      </g>
      <Motes f={f} n={26} color="#FFAA55" ember seed={31} y0={880} y1={1710} />
    </g>
  );
};

export const MemoryHome: React.FC<{ f: number }> = ({ f }) => {
  const glow = 0.75 + 0.25 * Math.sin(f / 16);
  return (
    <g>
      <rect width={W} height={H} fill="#3A2630" />
      <circle cx={780} cy={360} r={290} fill="#E69A55" opacity={0.25} filter="url(#bbBlur18)" />
      <path d="M0 0H1080V1920H0Z" fill="#5B3440" opacity={0.42} />
      <path d="M90 210H990V1290H90Z" fill="#69423A" opacity={0.72} />
      <path d="M150 270H930V1240H150Z" fill="#2D2028" opacity={0.5} />
      <path d="M150 270L540 120L930 270" fill="#7B4A34" />
      <path d="M150 270L540 120L540 270Z" fill="#9A5D3D" opacity={0.55} />
      {[260, 540, 820].map((x, i) => (
        <g key={i} transform={`translate(${x} 1020)`}>
          <path d="M-22 0V-170M22 0V-170M-34 -170H34" stroke="#321D17" strokeWidth={10} strokeLinecap="round" />
          <circle cx={0} cy={-184} r={20} fill="#F0AE55" opacity={0.55 * glow} filter="url(#bbBlur8)" />
          <path d="M0 -174C-10 -194 4 -210 0 -230C14 -210 12 -190 0 -174Z" fill="url(#bbFlame)" opacity={0.85} />
        </g>
      ))}
      <rect y={1240} width={W} height={680} fill="#2D1D1D" />
      <path d="M0 1265C240 1238 520 1285 760 1252C910 1232 1015 1255 1080 1240V1920H0Z" fill="#432820" />
      <path d="M150 1470C350 1420 730 1420 930 1470V1680C720 1630 360 1630 150 1680Z" fill="#6E3E32" opacity={0.6} />
      <Motes f={f} n={20} color="#FFD19A" seed={47} y0={350} y1={1480} />
    </g>
  );
};

export const ScaleVoid: React.FC<{ f: number; intensity?: number }> = ({ f, intensity = 1 }) => (
  <g>
    <rect width={W} height={H} fill="#151A2A" />
    <circle cx={540} cy={790} r={560} fill="#6B3B26" opacity={0.32 * intensity} filter="url(#bbBlur18)" />
    <CloudBand f={f} y={190} s={1.1} o={0.42} drift={0.08} />
    <path d="M0 1080C260 1048 520 1105 780 1072C930 1052 1015 1070 1080 1058V1920H0Z" fill="#201A18" />
    <path d="M0 1180C260 1155 520 1190 780 1162C930 1144 1015 1166 1080 1154V1920H0Z" fill="#2F241D" opacity={0.72} />
    <Motes f={f} n={38} color="#FFD36F" ember seed={57} y0={520} y1={1740} />
  </g>
);

export const HilltopBattle: React.FC<{ f: number; battle?: number; dusk?: boolean }> = ({ f, battle = 1, dusk = true }) => (
  <g>
    <rect width={W} height={H} fill={dusk ? "url(#bbSkyDeep)" : "url(#bbSky)"} />
    <circle cx={740} cy={720} r={250} fill="url(#bbSun)" opacity={0.78} />
    <CloudBand f={f} y={240} s={0.9} o={0.55} drift={0.1} />
    <g opacity={0.9}>
      <path d="M-80 935C160 850 300 890 520 805C720 730 900 840 1160 760V1330H-80Z" fill="#222A3B" />
      <path d="M-80 1045C210 950 390 1015 590 930C790 850 950 980 1160 900V1390H-80Z" fill="#171F2E" />
    </g>
    <rect y={1130} width={W} height={790} fill="url(#bbGround)" />
    <g opacity={battle}>
      <DotArmy x={120} y={1165} cols={12} rows={5} dx={17} dy={15} color="#FFD67A" f={f} shrink={0.78} />
      <DotArmy x={930} y={1165} cols={12} rows={5} dx={17} dy={15} color="#FFAF68" f={f + 5} flip shrink={0.78} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${170 + rnd(i, 80) * 740} ${1145 + rnd(i, 81) * 120}l${-30 + rnd(i, 82) * 60} ${-18 - rnd(i, 83) * 24}`} stroke="#D8B66A" strokeWidth={2.5} opacity={0.22 + 0.18 * Math.sin(f / 8 + i)} />
      ))}
    </g>
    <path d="M-80 1920V1510C130 1350 285 1320 470 1415C650 1505 820 1420 1160 1530V1920Z" fill="#17120F" />
    <path d="M-40 1920V1580C150 1435 310 1415 470 1495C650 1580 850 1495 1120 1605V1920Z" fill="#241913" />
    <path d="M60 1610C180 1555 310 1552 420 1600" stroke="#4A3424" strokeWidth={10} opacity={0.5} fill="none" />
    <Motes f={f} n={24} color="#FFAF62" ember seed={67} y0={870} y1={1710} />
  </g>
);

export const Shrine: React.FC<{ f: number; push?: number }> = ({ f, push = 0 }) => {
  const flame = 0.78 + 0.22 * Math.sin(f / 5);
  return (
    <g>
      <rect width={W} height={H} fill="#1A1320" />
      <circle cx={540} cy={720} r={560 + push * 30} fill="#814326" opacity={0.35} filter="url(#bbBlur18)" />
      <path d="M110 1520V520L540 210L970 520V1520Z" fill="#5B3026" stroke="#B36B32" strokeWidth={8} />
      <path d="M170 1490V570L540 310L910 570V1490Z" fill="#2B1C1D" stroke="#D89B36" strokeWidth={5} opacity={0.96} />
      <path d="M110 520L540 210L970 520" fill="none" stroke="#F0BE72" strokeWidth={13} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${250 + i * 145} ${512 + (i % 2) * 8})`}>
          <path d="M0 0V72" stroke="#D89B36" strokeWidth={4} />
          <path d="M-20 72H20L14 112H-14Z" fill="url(#bbGold)" stroke="#6B3F13" strokeWidth={3} />
          <circle cx={0} cy={86} r={5} fill="#FFF1A8" opacity={0.8} />
        </g>
      ))}
      <g transform="translate(540 925)">
        <circle cx={0} cy={-110} r={245} fill="#FFCF76" opacity={0.12} filter="url(#bbBlur18)" />
        <path d="M-185 285V-40C-160 -170 -92 -248 0 -248C94 -248 160 -170 185 -40V285Z" fill="#3A2420" stroke="#C88336" strokeWidth={7} />
        <path d="M-132 270V-10C-110 -118 -62 -180 0 -180C64 -180 110 -118 132 -10V270Z" fill="#171116" />
        <SereneHead f={f} x={0} y={-45} s={1.28} glow={0.8} />
        <path d="M-80 92C-30 116 34 116 82 92" stroke="#D89B36" strokeWidth={12} fill="none" opacity={0.85} />
        <path d="M-110 142C-45 176 48 176 110 142" stroke="#C94F38" strokeWidth={13} fill="none" opacity={0.78} />
        {Array.from({ length: 13 }, (_, i) => {
          const u = i / 12;
          const xx = -104 + u * 208;
          const yy = 143 + Math.sin(u * Math.PI) * 27;
          return <circle key={i} cx={xx} cy={yy} r={7 + (i % 2)} fill={i % 3 === 0 ? "#FFF1A8" : i % 3 === 1 ? "#E0602F" : "#F2C46D"} opacity={0.9} />;
        })}
      </g>
      <rect y={1420} width={W} height={500} fill="#211414" />
      <path d="M0 1450C260 1425 520 1462 780 1438C930 1422 1015 1442 1080 1430V1920H0Z" fill="#31201B" />
      {Array.from({ length: 18 }, (_, i) => {
        const xx = 78 + (i % 9) * 116 + (i > 8 ? 46 : 0);
        const yy = 1490 + Math.floor(i / 9) * 112 + (i % 3) * 8;
        return (
          <g key={i} transform={`translate(${xx} ${yy})`}>
            <ellipse cx={0} cy={20} rx={28} ry={9} fill="#120C0A" opacity={0.5} />
            <path d="M-24 8Q0 24 24 8L18 28H-18Z" fill="url(#bbGold)" stroke="#6B3F13" strokeWidth={2.5} />
            <path d={`M0 8C${-8 + Math.sin(f / 5 + i) * 3} -8 6 -20 0 -35C12 -18 10 -3 0 8Z`} fill="url(#bbFlame)" opacity={flame} />
            <circle cx={0} cy={-8} r={22} fill="#FFB34F" opacity={0.12 * flame} filter="url(#bbBlur8)" />
          </g>
        );
      })}
      {[190, 850].map((x, i) => (
        <g key={i} transform={`translate(${x} 1565) scale(${i ? -1 : 1})`} opacity={0.68}>
          <ellipse cx={0} cy={0} rx={42} ry={10} fill="#080606" opacity={0.5} />
          <path d="M-28 -88C-34 -48 -26 -18 -12 0H14C28 -24 32 -56 26 -88C10 -98 -12 -98 -28 -88Z" fill="#11100F" />
          <circle cx={0} cy={-112} r={24} fill="#11100F" />
          <path d="M20 -78C44 -60 54 -42 58 -20" stroke="#11100F" strokeWidth={12} strokeLinecap="round" />
        </g>
      ))}
      <Motes f={f} n={26} color="#FFD68F" seed={77} y0={430} y1={1530} />
    </g>
  );
};
