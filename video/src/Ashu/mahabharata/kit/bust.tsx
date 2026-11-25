/**
 * भारत · विशेष cast: soft-shaded profile busts in one shared frame (head ~x 440-660, y 690-1072; faces right; mirror with flip).
 * Looks from the Virata Parva text (and Udyoga for Bhishma's white): Drona (old brahmana, white jata + beard, tripundra, white
 * robes, sacred thread), Bhishma (all white: pagri, beard, armour), Duryodhana (gold kirita + armour, moustache, arrogant),
 * Uttara (young prince, earrings, lion-gold), Brihannala (Arjuna in red garments with the long braid, conch bracelets).
 */
import React from "react";
const P = { gold: "#f3c24f", goldDark: "#8a5a14" };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export type Hair = "knot" | "braid" | "jata" | "crown" | "pagri" | "princeCrown" | "bare" | "warriorKnot";
export type Look = {
  id: string;
  skin: [string, string, string]; // lit, base, shadow
  hair: Hair;
  hairColor: string;
  beard: "none" | "moustache" | "full";
  beardColor?: string;
  cloth: string;
  clothDark: string;
  trim?: string;
  armour?: string; // armour colour
  old?: boolean;
  tilak?: "line" | "tripundra" | "none";
  thread?: boolean;
  bangles?: boolean;
};

export const LOOKS: Record<string, Look> = {
  drona: { id: "drona", skin: ["#d9a27a", "#b07a55", "#7a4e34"], hair: "jata", hairColor: "#ece8e0", beard: "full", beardColor: "#f2efe8", cloth: "#efe6d4", clothDark: "#b9a98c", trim: "#d98a2a", old: true, tilak: "tripundra", thread: true },
  bhishma: { id: "bhishma", skin: ["#e2b08a", "#bf8a62", "#86583c"], hair: "pagri", hairColor: "#f4f1ea", beard: "full", beardColor: "#f6f4ee", cloth: "#f2efe6", clothDark: "#bdb6a6", trim: "#d8c9a0", armour: "#e9e6de", old: true, tilak: "line" },
  duryo: { id: "duryo", skin: ["#d8a274", "#b27a50", "#764a2e"], hair: "crown", hairColor: "#1a120c", beard: "moustache", beardColor: "#1a120c", cloth: "#5a2a7a", clothDark: "#2e1240", trim: P.gold, armour: "#d9a83a", tilak: "line" },
  uttara: { id: "uttara", skin: ["#ecb488", "#cc9268", "#93603f"], hair: "princeCrown", hairColor: "#1c130d", beard: "none", cloth: "#d99a2a", clothDark: "#8a5a14", trim: "#fff0c0", tilak: "line" },
  arjuna: { id: "arjuna", skin: ["#e6a978", "#c4865b", "#8a5236"], hair: "knot", hairColor: "#17100c", beard: "none", cloth: "#c22b33", clothDark: "#5a0c14", trim: P.gold, tilak: "line" },
  brihannala: { id: "brihannala", skin: ["#e6a978", "#c4865b", "#8a5236"], hair: "braid", hairColor: "#17100c", beard: "none", cloth: "#c22b33", clothDark: "#5a0c14", trim: P.gold, tilak: "line", bangles: true },
  barbarik: { id: "barbarik", skin: ["#d79a68", "#a8643d", "#6e3b24"], hair: "warriorKnot", hairColor: "#17100c", beard: "none", cloth: "#c77335", clothDark: "#5b2c1d", trim: "#f2c46d", armour: "#315f73", tilak: "line" },
  krishna: { id: "krishna", skin: ["#77b6d2", "#3f789e", "#214765"], hair: "crown", hairColor: "#101019", beard: "none", cloth: "#e4a92f", clothDark: "#7a4c12", trim: "#73b6ad", armour: "#e0ae3d", tilak: "line" },
  krishnaBrahmin: { id: "krishnaBrahmin", skin: ["#77b6d2", "#3f789e", "#214765"], hair: "warriorKnot", hairColor: "#101019", beard: "none", cloth: "#e8dcc5", clothDark: "#8a5f3c", trim: "#b85732", tilak: "line", thread: true },
  karna: { id: "karna", skin: ["#e5aa73", "#bd7a4a", "#754327"], hair: "warriorKnot", hairColor: "#17100c", beard: "none", cloth: "#f0dfb8", clothDark: "#7a451d", trim: "#f2c46d", armour: "#d99a28", tilak: "line" },
  karnaNoArmour: { id: "karnaNoArmour", skin: ["#e5aa73", "#bd7a4a", "#754327"], hair: "warriorKnot", hairColor: "#17100c", beard: "none", cloth: "#f0dfb8", clothDark: "#7a451d", trim: "#c97836", tilak: "line" },
  indra: { id: "indra", skin: ["#f0c895", "#c9905e", "#754a32"], hair: "crown", hairColor: "#21130c", beard: "moustache", beardColor: "#21130c", cloth: "#f1dfb8", clothDark: "#8a5528", trim: "#f2c46d", armour: "#d7a037", tilak: "line" },
};

const FACE =
  "M560,760 C585,770 600,790 604,815 C608,830 614,840 612,850 C608,858 604,864 606,870 " +
  "C620,890 645,915 662,935 C664,942 650,950 630,948 C626,955 624,960 628,968 C636,972 638,978 628,984 " +
  "C624,986 622,987 626,990 C634,994 632,1002 618,1008 C612,1012 616,1022 626,1032 " +
  "C634,1046 626,1066 604,1072 C570,1078 520,1074 480,1050 L470,1030 L440,960 L450,800 Z";
const RIM = "M560,760 C585,770 600,790 604,815 C608,830 614,840 612,850 C608,858 604,864 606,870 C620,890 645,915 662,935";

export type Expr = {
  brow?: number; // -1 worried .. 0 neutral .. 1 fierce
  mouth?: number; // 0..1 open
  eye?: number; // 1 open .. 0 closed
  smile?: number; // 0..1
  look?: number; // pupil shift -1..1
  wide?: number; // 0..1 eyes widened (fear/awe)
};

export const Bust: React.FC<{ look: Look; f: number; e?: Expr; flip?: boolean; x?: number; y?: number; s?: number; hand?: React.ReactNode; light?: number }> = ({
  look: L,
  f,
  e = {},
  flip = false,
  x = 0,
  y = 0,
  s = 1,
  hand,
  light = 1,
}) => {
  const id = L.id;
  const brow = e.brow ?? 0;
  const mouth = clamp(e.mouth ?? 0);
  const eye = clamp(e.eye ?? 1);
  const smile = e.smile ?? 0;
  const look = e.look ?? 0;
  const wide = e.wide ?? 0;
  const wind = Math.sin(f / 6);
  const breathe = Math.sin(f / 24) * 3;
  const [lit, base, sh] = L.skin;
  const beardCol = L.beardColor ?? L.hairColor;
  const t = `translate(${x},${y + breathe}) ${flip ? `translate(1080,0) scale(-${s},${s})` : `scale(${s})`}`;
  return (
    <g transform={t}>
      <defs>
        <linearGradient id={`b-face-${id}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor={sh} />
          <stop offset="0.45" stopColor={base} />
          <stop offset="0.85" stopColor={lit} />
          <stop offset="1" stopColor="#f7c896" />
        </linearGradient>
        <linearGradient id={`b-cloth-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={L.cloth} />
          <stop offset="1" stopColor={L.clothDark} />
        </linearGradient>
        <linearGradient id={`b-arm-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={L.clothDark} />
          <stop offset="0.6" stopColor={L.armour ?? L.cloth} />
          <stop offset="1" stopColor="#fff6dc" />
        </linearGradient>
        <radialGradient id={`b-cheek-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={sh} stopOpacity="0.55" />
          <stop offset="1" stopColor={sh} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* braid behind (Brihannala): long, flying in the wind */}
      {L.hair === "braid" && (
        <g>
          <path d={`M400,960 C360,${1080 + wind * 10} ${320 + wind * 20},1250 ${300 + wind * 34},1460`} stroke={L.hairColor} strokeWidth={44} strokeLinecap="round" fill="none" />
          {Array.from({ length: 9 }, (_, i) => {
            const q = i / 9;
            const bx = 400 + (300 + wind * 34 - 400) * q - 20 * Math.sin(q * 3);
            const by = 960 + 500 * q;
            return <path key={i} d={`M${bx - 22},${by} q22,18 44,0`} stroke="#3a2a20" strokeWidth={3} fill="none" opacity={0.7} />;
          })}
          <circle cx={300 + wind * 34} cy={1470} r={18} fill={P.gold} />
          <path d={`M${292 + wind * 34},1484 l-12,50 l20,-6 l12,6 z`} fill="#c22b33" />
        </g>
      )}

      {/* torso */}
      <path d="M300,1920 C296,1600 316,1350 418,1236 C470,1204 560,1198 640,1214 C762,1250 824,1400 834,1920 Z" fill={`url(#b-cloth-${id})`} />
      {L.armour && (
        <g>
          <path d="M360,1920 C356,1620 380,1400 450,1290 C520,1260 640,1270 720,1320 C780,1420 800,1620 800,1920 Z" fill={`url(#b-arm-${id})`} />
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => (
              <path key={`${r}-${c}`} d={`M${430 + c * 70 + (r % 2) * 35},${1360 + r * 80} q35,40 70,0`} stroke={L.clothDark} strokeWidth={4} fill="none" opacity={0.45} />
            )),
          )}
          <path d="M440,1290 C520,1250 650,1260 724,1322" stroke={P.gold} strokeWidth={12} fill="none" />
        </g>
      )}
      {/* uttariya / shawl over far shoulder */}
      <path d="M610,1208 C672,1222 712,1250 724,1300 C650,1430 530,1570 392,1716 C360,1660 346,1620 336,1580 C446,1470 546,1336 610,1208 Z" fill={L.clothDark} opacity={0.9} />
      <path d="M610,1208 C672,1222 712,1250 724,1300 C650,1430 530,1570 392,1716" stroke={L.trim ?? P.gold} strokeWidth={8} fill="none" />
      {L.thread && <path d="M470,1240 C560,1420 680,1620 760,1920" stroke="#f6f0e0" strokeWidth={6} fill="none" />}
      {/* necklace */}
      {L.id === "drona" ? (
        <path d="M470,1214 C506,1330 600,1336 640,1220" stroke="#6a3a1c" strokeWidth={7} fill="none" strokeDasharray="1 13" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M476,1214 C506,1286 596,1292 634,1220" stroke={P.gold} strokeWidth={6} fill="none" strokeDasharray="1 11" strokeLinecap="round" />
          <path d="M484,1232 C520,1320 600,1324 628,1238" stroke="url(#sp-goldH)" strokeWidth={7} fill="none" />
          <circle cx={556} cy={1300} r={14} fill="#c0232e" stroke={P.gold} strokeWidth={4} />
        </g>
      )}
      {/* neck */}
      <path d="M572,1056 C574,1110 580,1160 600,1214 L440,1226 C430,1160 424,1080 420,1010 Z" fill={sh} />

      {/* head */}
      <path d={FACE} fill={`url(#b-face-${id})`} />
      <path d={RIM} stroke="#ffe3b6" strokeWidth={5} fill="none" opacity={0.7 * light} />
      <ellipse cx={548} cy={980} rx={60} ry={70} fill={`url(#b-cheek-${id})`} />
      <path d="M480,1050 C520,1074 570,1078 604,1072 C590,1086 540,1092 490,1074 Z" fill="#000" opacity={0.18} />
      {L.old && (
        <g stroke={sh} strokeWidth={3} fill="none" opacity={0.8}>
          <path d="M560,800 q20,-6 36,2" />
          <path d="M556,816 q22,-6 40,2" />
          <path d="M600,890 q-20,30 -18,60" />
          <path d="M570,882 q8,10 20,8" />
        </g>
      )}
      {/* nostril */}
      <path d="M634,944 C640,946 642,942 640,938" stroke="#6a3622" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* mouth: opens with the voice envelope */}
      {L.beard !== "full" && (
        <g>
          <path d={`M628,980 C620,${984 + mouth * 6} 610,${988 + mouth * 4 - smile * 6} 598,${992 - smile * 8}`} stroke="#5a2a1a" strokeWidth={4} fill="none" strokeLinecap="round" />
          {mouth > 0.05 && <ellipse cx={618} cy={987 + mouth * 6} rx={10} ry={2 + mouth * 12} fill="#3a120c" />}
        </g>
      )}
      {/* eye */}
      <g>
        <path d={`M568,870 Q586,${858 - wide * 6} 604,866 Q592,${880 + wide * 4} 570,878 Z`} fill="#fbf2e6" />
        <circle cx={593 + look * 3} cy={869} r={7.5 + wide * 1.5} fill="#2a160c" />
        <circle cx={596 + look * 3} cy={866} r={2.4} fill="#ffffff" />
        {eye < 1 && <path d={`M566,866 Q586,856 606,864 L606,${864 + (1 - eye) * 16} Q586,${856 + (1 - eye) * 24} 566,${866 + (1 - eye) * 14} Z`} fill={base} />}
        <path d={`M566,868 Q586,${854 - wide * 5} 606,864`} stroke="#1a100a" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
      {/* brow */}
      <path
        d={`M548,${846 - brow * 2 + (brow < 0 ? 6 : 0)} Q578,${826 + brow * 6} 614,${840 + brow * 10}`}
        stroke={L.old ? L.hairColor : "#1a100a"}
        strokeWidth={L.old ? 11 : 9}
        fill="none"
        strokeLinecap="round"
      />
      {/* tilak */}
      {L.tilak === "line" && <path d="M590,800 L593,772" stroke="#c0232e" strokeWidth={5} strokeLinecap="round" />}
      {L.tilak === "tripundra" && (
        <g stroke="#f4efe6" strokeWidth={5} strokeLinecap="round">
          <path d="M562,792 L600,786" />
          <path d="M562,804 L602,798" />
          <path d="M562,816 L604,810" />
          <circle cx={586} cy={826} r={4} fill="#c0232e" stroke="none" />
        </g>
      )}

      {/* beard */}
      {L.beard === "full" && (
        <g>
          <path
            d={`M470,1000 C480,1060 520,1090 560,1100 C580,1140 600,1220 640,1300 C660,1250 660,1150 646,1080 C640,1050 636,1030 630,1016 C640,${1000 + mouth * 6} 628,992 610,${994 + mouth * 4} C590,996 560,990 540,980 C510,970 488,960 470,960 Z`}
            fill={beardCol}
          />
          <path d="M620,980 C600,970 576,972 556,986 C580,990 604,992 628,986 Z" fill={beardCol} />
          <path d="M540,1060 C560,1120 590,1180 620,1250 M570,1040 C590,1100 612,1160 636,1220" stroke="#bdb6a8" strokeWidth={3} fill="none" opacity={0.7} />
          {mouth > 0.05 && <ellipse cx={612} cy={998} rx={9} ry={1 + mouth * 9} fill="#3a1a12" />}
        </g>
      )}
      {L.beard === "moustache" && <path d={`M600,976 C612,966 628,968 634,978 C640,${986 + smile * 4} 652,${990 - smile * 10} 660,${980 - smile * 14} C646,986 632,984 626,982 C616,982 606,982 600,976 Z`} fill={beardCol} />}

      {/* ear + earring (hidden under pagri/jata sides) */}
      <path d="M494,892 C470,880 452,900 455,930 C458,962 474,986 494,980 C502,960 500,920 494,892 Z" fill={base} />
      <path d="M488,906 C474,904 468,920 472,940 C476,954 484,960 490,956" stroke={sh} strokeWidth={4} fill="none" />
      {!L.old && (
        <g transform={`translate(482,990) rotate(${wind * 4})`}>
          <circle cx={0} cy={0} r={10} fill="url(#sp-gold)" />
          <path d="M-16,8 Q0,46 16,8 Z" fill="url(#sp-gold)" />
          <circle cx={0} cy={40} r={5} fill="#c0232e" />
        </g>
      )}

      {/* hair / headwear */}
      <Headwear L={L} f={f} />
      {hand}
    </g>
  );
};

const Headwear: React.FC<{ L: Look; f: number }> = ({ L, f }) => {
  const wind = Math.sin(f / 5);
  const hairMass =
    "M566,772 C562,720 520,688 458,690 C388,692 346,742 342,822 C338,902 358,982 408,1022 C428,1036 450,1032 462,1012 C452,982 448,942 452,906 C456,862 470,822 500,802 C526,786 548,782 566,772 Z";
  switch (L.hair) {
    case "bare":
      return (
        <g>
          <path d={hairMass} fill={L.hairColor} />
          <path d={`M380,800 C330,860 ${330 + wind * 8},960 ${350 + wind * 10},1060 L410,1020 C400,940 410,860 440,810 Z`} fill={L.hairColor} />
          <path d="M420,700 C440,670 480,668 520,690" stroke={L.hairColor} strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      );
    case "warriorKnot":
      return (
        <g>
          <path d="M566,772 C560,720 520,690 460,692 C392,696 350,748 350,828 C350,884 372,930 414,954 C438,966 456,954 460,930 C452,884 462,832 500,802 C526,786 548,782 566,772 Z" fill={L.hairColor} />
          <path d="M560,760 C540,730 500,712 456,712" stroke="#ffcf96" strokeWidth={5} fill="none" opacity={0.42} strokeLinecap="round" />
          <ellipse cx={430} cy={690} rx={54} ry={40} fill={L.hairColor} />
          <circle cx={404} cy={656} r={29} fill={L.hairColor} />
          <path d="M382,660 C398,636 432,638 446,662" stroke="#3a2a20" strokeWidth={4} fill="none" opacity={0.7} />
          <path d={`M390,714 C350,${728 + wind * 4} 332,${760 + wind * 6} 336,${806 + wind * 4} C360,792 384,760 404,724 Z`} fill={L.hairColor} />
          <path d="M398,686 C424,676 452,682 470,700" stroke="#3a2a20" strokeWidth={3} fill="none" opacity={0.5} />
        </g>
      );
    case "knot":
      return (
        <g>
          <path d={hairMass} fill={L.hairColor} />
          <path d="M560,760 C540,730 500,712 456,712" stroke="#ffcf96" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
          <ellipse cx={440} cy={690} rx={58} ry={44} fill={L.hairColor} />
          <path d="M392,676 C410,640 470,636 492,670 C496,690 490,708 480,716 C460,700 420,700 396,712 C388,700 388,688 392,676 Z" fill="url(#ar-white)" />
          <path d={`M396,700 C350,${702 + wind * 10} 300,${690 + wind * 22} ${240 + wind * 10},${700 + wind * 30} C${250 + wind * 6},${724 + wind * 26} 320,${724 + wind * 16} 398,716 Z`} fill="url(#ar-white)" />
          <path d={`M400,712 C360,${742 + wind * 14} 320,${760 + wind * 26} ${270 + wind * 12},${790 + wind * 30} C${290 + wind * 8},${804 + wind * 22} 350,${774 + wind * 14} 410,724 Z`} fill="#e9e1d4" />
        </g>
      );
    case "braid":
      return (
        <g>
          <path d={hairMass} fill={L.hairColor} />
          <path d="M560,760 C540,730 500,712 456,712" stroke="#ffcf96" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
          {/* parting ornament: matha patti for Brihannala */}
          <path d="M562,770 C530,744 490,730 450,730" stroke={P.gold} strokeWidth={6} fill="none" />
          <circle cx={566} cy={786} r={9} fill={P.gold} />
          <path d="M566,794 l-5,14 l10,0 z" fill="#c0232e" />
        </g>
      );
    case "jata":
      return (
        <g>
          <path d={hairMass} fill={L.hairColor} />
          <path d="M560,770 C540,700 480,640 420,640 C360,640 330,700 350,760 C380,720 420,700 470,710 Z" fill={L.hairColor} />
          {/* tall matted bun */}
          <path d="M420,700 C400,620 420,540 470,520 C520,540 530,620 500,700 Z" fill={L.hairColor} />
          <path d="M430,640 C450,630 480,630 500,640 M426,600 C450,590 482,590 504,600 M440,560 C456,552 476,552 492,560" stroke="#b9b2a4" strokeWidth={4} fill="none" />
          <path d="M424,690 C450,680 480,680 504,690" stroke="#7a5a2a" strokeWidth={8} fill="none" />
          {/* long locks down the back */}
          <path d={`M380,820 C340,920 ${330 + wind * 10},1060 ${350 + wind * 14},1200 L400,1180 C390,1060 400,940 430,840 Z`} fill={L.hairColor} />
        </g>
      );
    case "pagri":
      return (
        <g>
          <path d={hairMass} fill={L.hairColor} opacity={0.9} />
          <path d="M350,820 C330,720 380,640 470,630 C560,622 600,690 600,780 C560,770 520,768 470,780 C420,792 380,810 350,820 Z" fill="url(#ar-white)" />
          <path d="M360,760 C420,720 520,700 596,730 M356,790 C420,756 520,740 598,760" stroke="#c9c2b4" strokeWidth={5} fill="none" />
          <circle cx={560} cy={700} r={14} fill="#e8e2d4" stroke={P.gold} strokeWidth={4} />
          <path d="M560,686 C556,640 570,600 590,580" stroke="#f6f2ea" strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      );
    case "crown":
    case "princeCrown": {
      const tall = L.hair === "crown" ? 1 : 0.6;
      return (
        <g>
          <path d={hairMass} fill={L.hairColor} />
          <path d={`M380,800 C330,860 ${330 + wind * 8},960 ${350 + wind * 10},1060 L410,1020 C400,940 410,860 440,810 Z`} fill={L.hairColor} />
          {/* kirita: tall gold crown with bands and jewels */}
          <path d={`M370,780 C380,${720 - 60 * tall} 420,${640 - 120 * tall} 470,${600 - 160 * tall} C520,${640 - 120 * tall} 570,${700 - 70 * tall} 590,780 C520,760 440,760 370,780 Z`} fill="url(#sp-gold)" />
          <path d="M366,786 C440,760 520,760 594,786 L590,806 C520,782 440,782 370,806 Z" fill={P.goldDark} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${392 + i * 8},${740 - i * 50 * tall} C440,${720 - i * 50 * tall} 510,${720 - i * 50 * tall} ${568 - i * 10},${742 - i * 50 * tall}`} stroke={P.goldDark} strokeWidth={4} fill="none" opacity={0.7} />
          ))}
          <circle cx={480} cy={746} r={14} fill="#c0232e" stroke="#fff0b0" strokeWidth={3} />
          <circle cx={430} cy={752} r={8} fill="#2f9a52" />
          <circle cx={530} cy={752} r={8} fill="#2f9a52" />
          <circle cx={470} cy={600 - 160 * tall} r={10} fill="#fff0b0" />
          {L.id === "krishna" ? (
            <g transform={`translate(520 ${590 - 120 * tall}) rotate(${wind * 3})`}>
              <path d="M0 30C18 -20 42 -58 76 -86" stroke="#2E9A72" strokeWidth={7} fill="none" strokeLinecap="round" />
              <ellipse cx={82} cy={-94} rx={24} ry={36} fill="#2E9A72" transform="rotate(28 82 -94)" />
              <ellipse cx={82} cy={-94} rx={14} ry={23} fill="#254F9E" transform="rotate(28 82 -94)" />
              <ellipse cx={82} cy={-94} rx={7} ry={12} fill="#D8A93D" transform="rotate(28 82 -94)" />
              <path d="M62 -68C72 -52 86 -44 102 -42" stroke="#7FD2B2" strokeWidth={3} fill="none" opacity={0.7} />
            </g>
          ) : null}
        </g>
      );
    }
  }
};

export const RaisedPalm: React.FC<{ x?: number; y?: number; s?: number; skin?: string }> = ({ x = 680, y = 1010, s = 1, skin = "#3f789e" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-30 90C-8 40 14 -10 34 -78" stroke={skin} strokeWidth={34} strokeLinecap="round" fill="none" />
    <ellipse cx={42} cy={-98} rx={28} ry={34} fill={skin} />
    <path d="M25 -120C14 -145 18 -160 30 -164M40 -126C36 -154 42 -168 54 -170M55 -122C58 -148 68 -158 78 -154M68 -108C82 -128 94 -132 102 -124" stroke={skin} strokeWidth={12} strokeLinecap="round" fill="none" />
    <path d="M28 -102C42 -88 62 -86 78 -100" stroke="#9bc9da" strokeWidth={3} fill="none" opacity={0.55} />
    <circle cx={45} cy={-96} r={56} fill="#9feaff" opacity={0.12} filter="url(#bbBlur18)" />
  </g>
);

/** Conch held to the lips (for the Devadatta blast). */
export const Conch: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <path d="M0,0 C40,-30 120,-40 170,-10 C200,10 200,50 170,70 C120,96 40,80 0,30 Z" fill="#fbf6ec" />
    <path d="M20,10 C60,-10 120,-14 160,4 M30,30 C70,16 120,16 160,30 M40,50 C80,44 120,46 150,56" stroke="#d6c6ae" strokeWidth={4} fill="none" />
    <path d="M170,-10 C200,10 200,50 170,70 C186,40 186,20 170,-10 Z" fill="#e8b0a0" />
    <rect x={-16} y={4} width={22} height={22} rx={6} fill={P.gold} />
  </g>
);

/** Small full-body figure for wide shots (running / standing), facing right. */
export const Figure: React.FC<{ x: number; y: number; s: number; f: number; run?: number; cloth: string; skin?: string; braid?: boolean; crown?: boolean; white?: boolean; fallen?: number }> = ({
  x,
  y,
  s,
  f,
  run = 0,
  cloth,
  skin = "#b07a52",
  braid,
  crown,
  white,
  fallen = 0,
}) => {
  const ph = f / 3.2;
  const lg = Math.sin(ph) * 32 * run;
  const ar = Math.sin(ph) * 40 * run;
  const bob = Math.abs(Math.sin(ph)) * 6 * run;
  return (
    <g transform={`translate(${x},${y - bob * s}) scale(${s}) rotate(${fallen * 84 + run * 8},0,-40)`}>
      <ellipse cx={0} cy={2 + bob} rx={30} ry={6} fill="#1a0e08" opacity={0.3} />
      {/* legs */}
      <path d={`M-4,-70 L${-10 + lg * 0.5},-2`} stroke={skin} strokeWidth={10} strokeLinecap="round" />
      <path d={`M4,-70 L${10 - lg * 0.5},-2`} stroke={skin} strokeWidth={10} strokeLinecap="round" />
      <path d="M-16,-100 L16,-100 L22,-56 L-22,-56 Z" fill={cloth} />
      {/* torso */}
      <path d="M-14,-150 C-18,-130 -18,-110 -14,-96 L14,-96 C18,-110 18,-130 14,-150 Z" fill={white ? "#ece6da" : skin} />
      <path d="M-14,-150 L14,-104 L10,-96 L-16,-140 Z" fill={cloth} />
      {/* arms */}
      <path d={`M0,-144 L${18 + ar * 0.4},${-112 + Math.abs(ar) * 0.1}`} stroke={skin} strokeWidth={8} strokeLinecap="round" />
      <path d={`M0,-144 L${-18 - ar * 0.4},${-112 + Math.abs(ar) * 0.1}`} stroke={skin} strokeWidth={8} strokeLinecap="round" />
      {/* head */}
      <circle cx={2} cy={-166} r={14} fill={skin} />
      <path d="M-12,-170 C-12,-186 12,-188 16,-172 C8,-178 -4,-178 -12,-170 Z" fill={white ? "#f2efe8" : "#17100c"} />
      {crown && <path d="M-10,-176 L-6,-196 L2,-184 L8,-198 L14,-176 Z" fill={P.gold} />}
      {braid && <path d={`M-10,-166 C${-30 - run * 20},${-150 + Math.sin(ph) * 6} ${-40 - run * 30},-120 ${-46 - run * 40},${-96 + Math.sin(ph) * 10}`} stroke="#17100c" strokeWidth={6} fill="none" strokeLinecap="round" />}
    </g>
  );
};
