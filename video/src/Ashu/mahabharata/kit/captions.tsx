import React from "react";
import { MUKTA, ROZHA, outBack, outCubic, prog } from "./kit";

export type TimingWord = { w: string; a: number; b: number; l: number; p: number; who: string };
export type TimingPhrase = { a: number; b: number; l: number; who: string; text: string; code: string };
export type SpeakerMap = Record<string, string>;

type CaptionChunk = { p: number; words: TimingWord[]; a: number; b: number };

export const buildCaptionChunks = (phrases: TimingPhrase[], words: TimingWord[], maxWords = 4, maxChars = 25): CaptionChunk[] =>
  phrases.flatMap((_, p) => {
    const ws = words.filter((w) => w.p === p);
    const chunks: CaptionChunk[] = [];
    let cur: TimingWord[] = [];
    const flush = () => {
      if (!cur.length) return;
      chunks.push({ p, words: cur, a: cur[0].a, b: cur[cur.length - 1].b });
      cur = [];
    };
    for (const w of ws) {
      const textLen = cur.reduce((n, x) => n + x.w.length + 1, 0);
      if (cur.length >= maxWords || (cur.length > 0 && textLen + w.w.length > maxChars)) flush();
      cur.push(w);
    }
    flush();
    return chunks;
  });

export const CaptionTrack: React.FC<{
  f: number;
  phrases: TimingPhrase[];
  words: TimingWord[];
  speakers?: SpeakerMap;
  top?: number;
  maxWidth?: number;
}> = ({ f, phrases, words, speakers = {}, top = 1370, maxWidth = 780 }) => {
  let pi = -1;
  for (let i = 0; i < phrases.length; i++) {
    const ph = phrases[i];
    const next = phrases[i + 1];
    const end = Math.min(next ? next.a - 2 : 1e9, ph.b + 18);
    if (f >= ph.a - 2 && f < end) pi = i;
  }
  if (pi < 0) return null;
  const ph = phrases[pi];
  const chunks = buildCaptionChunks(phrases, words).filter((c) => c.p === pi);
  let ci = 0;
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    if (f >= chunks[i].a - 1 && f < (next ? next.a - 1 : chunks[i].b + 13)) ci = i;
  }
  const chunk = chunks[ci];
  if (!chunk) return null;
  const ws = chunk.words;
  const pop = prog(f, chunk.a - 2, chunk.a + 4, outBack);
  const nextA = phrases[pi + 1] ? phrases[pi + 1].a - 2 : 1e9;
  const fadeOut = pi === phrases.length - 1 ? 1 - prog(f, ph.b + 1, ph.b + 11, outCubic) : 1 - prog(f, Math.min(ph.b + 11, nextA - 4), Math.min(ph.b + 18, nextA), outCubic);
  const who = speakers[ph.who];
  return (
    <div style={{ position: "absolute", left: 42, right: 172, top, height: 225, display: "flex", alignItems: "flex-end", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          maxWidth,
          minHeight: 92,
          textAlign: "center",
          fontFamily: MUKTA,
          fontWeight: 800,
          fontSize: ph.who === "narrator" ? 58 : 62,
          lineHeight: 1.18,
          color: "#FFFFFF",
          textShadow: "0 4px 10px rgba(0,0,0,0.86), 0 0 24px rgba(0,0,0,0.62)",
          opacity: Math.min(1, pop * 1.4) * fadeOut,
          transform: `scale(${0.94 + 0.06 * pop})`,
          transformOrigin: "50% 100%",
        }}
      >
        {who ? (
          <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: 0.8, color: ph.who === "krishna" ? "#B9F1FF" : "#FFE083", marginBottom: 4, textShadow: "0 3px 8px rgba(0,0,0,0.85)" }}>
            {who}
          </div>
        ) : null}
        {ws.map((w, i) => {
          const cur = f >= w.a - 1 && f < (ws[i + 1] ? ws[i + 1].a - 1 : w.b + 11);
          const said = f >= w.a - 1;
          const k = cur ? prog(f, w.a - 1, w.a + 3, outBack) : 0;
          if (!said) return null;
          return (
            <React.Fragment key={`${w.w}-${i}`}>
              <span
                style={{
                  display: "inline-block",
                  padding: cur ? "0 7px" : "0 1px",
                  margin: "1px 0",
                  borderRadius: 12,
                  background: cur ? "linear-gradient(135deg,#D69B35,#B9542E)" : "transparent",
                  color: cur ? "#FFF8E8" : "#FFFFFF",
                  opacity: 1,
                  transform: `scale(${1 + 0.08 * k})`,
                  boxShadow: cur ? "0 6px 14px rgba(0,0,0,0.42)" : undefined,
                }}
              >
                {w.w}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const HookTitle: React.FC<{ f: number; lines: string[]; endFrame?: number; top?: number; fontSize?: number }> = ({ f, lines, endFrame = 82, top = 245, fontSize = 78 }) => {
  const out = 1 - prog(f, endFrame - 20, endFrame, outCubic);
  if (out <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 55, right: 55, top, textAlign: "center", opacity: out, pointerEvents: "none" }}>
      <div style={{ fontFamily: ROZHA, fontSize: fontSize, lineHeight: 1.16, color: "#FFF3CF", textShadow: "0 6px 0 rgba(77,28,10,0.75), 0 14px 34px rgba(0,0,0,0.65)" }}>
        {lines.map((line, i) => (
          <React.Fragment key={line}>
            {i ? <br /> : null}
            {line}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const SeriesEndCard: React.FC<{ f: number; startFrame: number; part: number; title: string; nextTitle: string; top?: number }> = ({ f, startFrame, part, title, nextTitle, top = 1115 }) => {
  const t = prog(f, startFrame, startFrame + 22, outBack);
  if (t <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 55, right: 55, top, textAlign: "center", opacity: t, transform: `scale(${0.92 + 0.08 * t})`, pointerEvents: "none" }}>
      <div style={{ fontFamily: MUKTA, fontSize: 28, fontWeight: 800, letterSpacing: 1.4, color: "#FFE083", textShadow: "0 4px 12px rgba(0,0,0,0.85)" }}>
        महाभारत · भाग {part}/10
      </div>
      <div style={{ marginTop: 18, fontFamily: ROZHA, fontSize: 84, lineHeight: 1.08, color: "#FFF3CF", textShadow: "0 6px 0 rgba(64,25,9,0.75), 0 16px 36px rgba(0,0,0,0.72)" }}>
        {title}
      </div>
      <div style={{ marginTop: 28, fontFamily: MUKTA, fontSize: 32, fontWeight: 800, color: "#FFF7E8", textShadow: "0 4px 12px rgba(0,0,0,0.8)" }}>
        अगला भाग: <span style={{ color: "#FFE083" }}>{nextTitle}</span>
      </div>
      <div style={{ marginTop: 18, fontFamily: MUKTA, fontSize: 29, fontWeight: 700, color: "#FFF7E8", textShadow: "0 4px 12px rgba(0,0,0,0.8)" }}>
        Follow <span style={{ color: "#FFE083" }}>@ashuanimates</span>
      </div>
    </div>
  );
};
