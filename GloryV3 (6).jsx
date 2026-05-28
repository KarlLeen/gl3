import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════════
   GLORY v3 — Futuristic Football Prediction Broadcast System
   Refinement pass: custom glyph language replaces all Lucide + emoji.
   Structure, routing, branding, palette, typography PRESERVED from v2.
═══════════════════════════════════════════════════════════════════════ */

const C = {
  navy: "#06111F", navy2: "#0B1B2D", black: "#020617",
  green: "#00FF88", gold: "#FFD166", blue: "#00A3FF",
  white: "#F8FAFC", red: "#FF3B3B", purple: "#8b5cf6",
  mute: "rgba(248,250,252,.58)", mute2: "rgba(248,250,252,.42)",
  line: "rgba(255,255,255,.08)", lineG: "rgba(0,255,136,.14)",
};
const FD = "'Sora',sans-serif";
const FB = "'Manrope',sans-serif";

/* ════════════════════════════════════════════════════════════════════
   CUSTOM GLYPH SYSTEM  — broadcast-grade SVG marks, no Lucide, no emoji
   Every glyph: 1em-scalable, currentColor-aware, thin tactical linework.
═══════════════════════════════════════════════════════════════════════ */
function Glyph({ name, size = 18, color = "currentColor", glow = false, style = {} }) {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0, filter: glow ? `drop-shadow(0 0 5px ${color}aa)` : "none", ...style };
  const sw = 1.6;
  const common = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const P = {
    // trophy — chalice from two arcs + stem + base
    trophy: <g {...common}><path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4.5a2.5 2.5 0 0 0 2.8 2.8M17 5h2.5a2.5 2.5 0 0 1-2.8 2.8" /><path d="M12 12v4M9 19h6M10 16h4" /></g>,
    // pitch — center circle + halfway line (tactical)
    pitch: <g {...common}><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="M12 5v14" /><circle cx="12" cy="12" r="2.6" /><path d="M3.5 9.5h2v5h-2M20.5 9.5h-2v5h2" /></g>,
    // chart — momentum curve, broadcast style
    momentum: <g {...common}><path d="M3 17c3-1 4-7 7-7s4 4 7 1 3-6 3-6" /><path d="M3 20h18" opacity=".4" /></g>,
    // pulse — heartbeat/live signal
    pulse: <g {...common}><path d="M3 12h4l2-5 3 10 2-7 2 2h5" /></g>,
    // target — prediction reticle
    target: <g {...common}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.4" /><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" /></g>,
    // bolt — speed/lightning, sharp
    bolt: <g {...common}><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-12H12l1-8Z" /></g>,
    // crown — champion
    crown: <g {...common}><path d="M3 8l3.5 3 5.5-7 5.5 7L21 8l-1.6 10H4.6L3 8Z" /><path d="M4.6 18h14.8" /></g>,
    // wallet
    wallet: <g {...common}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 9.5h18" /><circle cx="16.5" cy="14" r="1.3" fill={color} stroke="none" /></g>,
    // grid — markets
    grid: <g {...common}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></g>,
    // home — arena
    home: <g {...common}><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></g>,
    // award — medal
    award: <g {...common}><circle cx="12" cy="9" r="5.5" /><path d="M9 13.5 7.5 21 12 18.5 16.5 21 15 13.5" /></g>,
    // flame — heat (geometric, not emoji)
    flame: <g {...common}><path d="M12 2.5c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3.5 2.5-5 .5 1.5 1.5 2 2.5 2 0-3-1-5-1-7Z" /></g>,
    // radar — sweep
    radar: <g {...common}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" opacity=".5" /><path d="M12 12 19 7" /><circle cx="12" cy="12" r="1" fill={color} stroke="none" /></g>,
    // search
    search: <g {...common}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></g>,
    // close
    close: <g {...common}><path d="M6 6l12 12M18 6 6 18" /></g>,
    // menu — broadcast bars
    menu: <g {...common}><path d="M4 7h16M4 12h16M4 17h16" /></g>,
    // chevron right
    chevR: <g {...common}><path d="m9 5 7 7-7 7" /></g>,
    // chevron left / back arrow
    arrowL: <g {...common}><path d="M19 12H5M11 6 5 12l6 6" /></g>,
    // check
    check: <g {...common}><path d="m4 12 5 5L20 6" /></g>,
    // x-mark thin (for compare list)
    cross: <g {...common}><path d="M7 7l10 10M17 7 7 17" /></g>,
    // shield — secure/legal
    shield: <g {...common}><path d="M12 2.5 4.5 6v6c0 4.5 3 7.5 7.5 9.5 4.5-2 7.5-5 7.5-9.5V6L12 2.5Z" /><path d="m9 12 2 2 4-4" /></g>,
    // clock / timer
    clock: <g {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></g>,
    // volume — sound (crowd roar)
    volume: <g {...common}><path d="M4 9.5v5h3l4 3.5v-12L7 9.5H4Z" /><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" /></g>,
    // book — docs
    book: <g {...common}><path d="M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2V4.5Z" /><path d="M5 18a2 2 0 0 1 2-2h11" /><path d="M9 8h6M9 11h6" opacity=".5" /></g>,
    // scale — legal
    scale: <g {...common}><path d="M12 3v18M7 21h10" /><path d="M5 7h14l-3 6a3 3 0 0 1-4 0L5 7Z" /><path d="m5 7-3 6a3 3 0 0 0 6 0" /></g>,
    // swap
    swap: <g {...common}><path d="M7 4v16M7 20l-3.5-3.5M7 20l3.5-3.5M17 20V4M17 4l-3.5 3.5M17 4l3.5 3.5" /></g>,
    // copy
    copy: <g {...common}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></g>,
    // sparkle — community/create (4-point star)
    spark: <g {...common}><path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" /></g>,
    // users — community
    users: <g {...common}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 19a5.5 5.5 0 0 0-2.5-4.6" /></g>,
    // message — chat thread
    message: <g {...common}><path d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10Z" /><path d="M8 9h8M8 12h5" opacity=".5" /></g>,
    // ball — abstract football (pentagon hint, not emoji)
    ball: <g {...common}><circle cx="12" cy="12" r="8.5" /><path d="m12 7 3 2.2-1.1 3.6h-3.8L9 9.2 12 7Z" /><path d="M12 7V3.6M15 9.2l3.2-1.1M13.9 12.8l2 2.8M10.1 12.8l-2 2.8M9 9.2 5.8 8.1" opacity=".55" /></g>,
    // coin — token (G monogram ring)
    coin: <g {...common}><circle cx="12" cy="12" r="8.5" /><path d="M15 9.2a4 4 0 1 0 .4 4.3H12" /></g>,
    // bars — volume/stat
    bars: <g {...common}><path d="M5 20V11M10 20V5M15 20v-6M20 20V8" /></g>,
    // trend up
    trend: <g {...common}><path d="M3 16l5-5 4 3 8-8" /><path d="M16 6h4v4" /></g>,
    // signal — live dot triad
    signal: <g {...common}><path d="M4 18a14 14 0 0 1 16 0" opacity=".4" /><path d="M7 18a9 9 0 0 1 10 0" opacity=".7" /><circle cx="12" cy="18" r="1.6" fill={color} stroke="none" /></g>,
    // flag — generic team marker (replaces nation emoji)
    flag: <g {...common}><path d="M6 21V4M6 5h11l-2 3 2 3H6" /></g>,
    // x-social
    twitter: <g fill={color} stroke="none"><path d="M17.5 3h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8L6.3 19.5H3.5l6.6-7.5L3 3h5.7l4 5.3L17.5 3Zm-1 15h1.5L8.1 4.6H6.5L16.5 18Z" /></g>,
    // discord-ish hash mark stylized
    hash: <g {...common}><path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" /></g>,
    // arrow up-right (external)
    upRight: <g {...common}><path d="M7 17 17 7M9 7h8v8" /></g>,
    // arrow down-up (swap small)
    downUp: <g {...common}><path d="M7 4v14M7 4 4 7M7 4l3 3M17 20V6M17 20l-3-3M17 20l3-3" /></g>,
    // goal net (golden boot section)
    goal: <g {...common}><path d="M3 7h18v11H3zM3 7l3-3h12l3 3" /><path d="M7 7v11M12 7v11M17 7v11M3 11h18M3 15h18" opacity=".4" /></g>,
    // star
    star: <g {...common}><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.6 1-5.8-4.2-4.1 5.9-.9L12 3.5Z" /></g>,
  };
  return <svg viewBox="0 0 24 24" style={s} aria-hidden>{P[name] || P.target}</svg>;
}

/* country code chip — replaces flag emoji with broadcast 3-letter chip */
function NationChip({ code, color = C.green, size = 13 }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FD, fontWeight: 800, fontSize: size, letterSpacing: .5 }}>
    <span style={{ width: size * .34, height: size * 1.05, borderRadius: 2, background: `linear-gradient(180deg,${color},${color}55)`, boxShadow: `0 0 6px ${color}66`, display: "inline-block" }} />{code}
  </span>;
}

/* ─────────────────────── DATA (with broadcast codes, no emoji) ─────────────────────── */
const MARKETS = [
  { id: "argentina-vs-brazil", tag: "Match Winner", cat: "Live", codes: ["ARG", "BRA"], cc: [C.blue, C.gold], title: "Argentina vs Brazil — Who wins?", closes: "2h 14m", pool: "4.21M", vol: "8.9M", sentiment: 62, hot: true,
    options: [{ label: "Argentina", odds: "1.9x", pct: 52 }, { label: "Draw", odds: "3.4x", pct: 18 }, { label: "Brazil", odds: "2.1x", pct: 30 }] },
  { id: "goals-over-under", tag: "Over / Under", cat: "Live", codes: ["FRA", "GER"], cc: [C.blue, C.white], title: "Total Goals: Over or Under 2.5?", closes: "1h 02m", pool: "2.88M", vol: "5.1M", sentiment: 54, hot: true,
    options: [{ label: "Over 2.5", odds: "1.7x", pct: 58 }, { label: "Under 2.5", odds: "2.2x", pct: 42 }] },
  { id: "first-goal-scorer", tag: "First Goal", cat: "Live", codes: ["ESP", "POR"], cc: [C.red, C.green], title: "Who scores the first goal?", closes: "44m", pool: "1.93M", vol: "3.0M", sentiment: 71,
    options: [{ label: "Striker", odds: "1.6x", pct: 64 }, { label: "Midfielder", odds: "2.8x", pct: 24 }, { label: "Defender", odds: "5.1x", pct: 12 }] },
  { id: "golden-boot", tag: "Tournament", cat: "Player", codes: ["TOP"], cc: [C.gold], title: "Golden Boot Winner this cycle?", closes: "12d", pool: "6.50M", vol: "14.2M", sentiment: 48, hot: true,
    options: [{ label: "No. 9", odds: "3.2x", pct: 31 }, { label: "No. 10", odds: "2.4x", pct: 38 }, { label: "Field", odds: "1.8x", pct: 31 }] },
  { id: "finalist", tag: "Knockout", cat: "Tournament", codes: ["FIN"], cc: [C.purple], title: "Which nation reaches the Final?", closes: "5d", pool: "5.12M", vol: "11.4M", sentiment: 66,
    options: [{ label: "Argentina", odds: "2.6x", pct: 40 }, { label: "France", odds: "2.9x", pct: 34 }, { label: "Field", odds: "1.5x", pct: 26 }] },
  { id: "keeper-hero", tag: "Meme Market", cat: "Meme", codes: ["GK"], cc: [C.green], title: "Will the keeper become a national hero?", closes: "3h", pool: "1.07M", vol: "1.9M", sentiment: 83,
    options: [{ label: "Yes", odds: "2.0x", pct: 71 }, { label: "No", odds: "1.8x", pct: 29 }] },
  { id: "red-card", tag: "Discipline", cat: "Upcoming", codes: ["ITA", "ENG"], cc: [C.blue, C.white], title: "Will there be a red card?", closes: "1d", pool: "920K", vol: "1.6M", sentiment: 39,
    options: [{ label: "Yes", odds: "2.5x", pct: 33 }, { label: "No", odds: "1.5x", pct: 67 }] },
  { id: "penalty-shootout", tag: "Knockout", cat: "Upcoming", codes: ["NED", "CRO"], cc: [C.gold, C.red], title: "Decided by penalty shootout?", closes: "2d", pool: "1.34M", vol: "2.2M", sentiment: 45,
    options: [{ label: "Yes", odds: "3.1x", pct: 29 }, { label: "No", odds: "1.4x", pct: 71 }] },
  { id: "group-winner", tag: "Group Stage", cat: "Tournament", codes: ["GRP C"], cc: [C.blue], title: "Who tops Group C?", closes: "8d", pool: "2.05M", vol: "4.1M", sentiment: 57,
    options: [{ label: "Seed A", odds: "1.7x", pct: 48 }, { label: "Seed B", odds: "2.6x", pct: 30 }, { label: "Seed C", odds: "4.0x", pct: 22 }] },
];

const FEED = [
  { u: "@goalhunter", a: "backed Argentina with", v: "12,400", t: "12s" },
  { u: "@xg_wizard", a: "predicted Over 2.5 with", v: "8,900", t: "44s" },
  { u: "@penalty_king", a: "entered Golden Boot pool with", v: "31,200", t: "1m" },
  { u: "@elgolazo", a: "backed the keeper market with", v: "5,600", t: "2m" },
  { u: "@offside_oracle", a: "predicted France final with", v: "19,000", t: "3m" },
  { u: "@derbydon", a: "backed No red card with", v: "4,100", t: "4m" },
];

const LEADERS = [
  { r: 1, u: "@striker_99", wr: 78, w: 184, g: "1.92M", streak: 9 },
  { r: 2, u: "@elgolazo", wr: 74, w: 171, g: "1.44M", streak: 5 },
  { r: 3, u: "@penalty_king", wr: 71, w: 158, g: "1.20M", streak: 3 },
  { r: 4, u: "@offside_oracle", wr: 69, w: 142, g: "980K", streak: 7 },
  { r: 5, u: "@xg_wizard", wr: 66, w: 133, g: "865K", streak: 2 },
  { r: 6, u: "@goalhunter", wr: 64, w: 121, g: "740K", streak: 4 },
  { r: 7, u: "@tikitaka", wr: 61, w: 108, g: "612K", streak: 1 },
  { r: 8, u: "@derbydon", wr: 59, w: 97, g: "540K", streak: 6 },
];

const NATIONS = [
  { n: "Argentina", code: "ARG", c: C.blue, heat: 92 }, { n: "Brazil", code: "BRA", c: C.gold, heat: 88 },
  { n: "France", code: "FRA", c: C.blue, heat: 81 }, { n: "Spain", code: "ESP", c: C.red, heat: 73 },
  { n: "England", code: "ENG", c: C.white, heat: 70 }, { n: "Germany", code: "GER", c: C.gold, heat: 66 },
  { n: "Portugal", code: "POR", c: C.green, heat: 64 }, { n: "Netherlands", code: "NED", c: C.gold, heat: 58 },
];

const BOOT = [
  { p: "No. 10 · Argentina", g: 7, back: 38, odds: "2.4x" },
  { p: "No. 9 · France", g: 6, back: 31, odds: "3.2x" },
  { p: "No. 7 · Brazil", g: 6, back: 19, odds: "3.8x" },
  { p: "No. 11 · Spain", g: 5, back: 12, odds: "5.5x" },
];

const ROADMAP = [
  { p: "Phase 1", n: "Kickoff", state: "live", items: ["Brand launch", "Community formation", "Website launch", "Social campaigns", "Meme contests"] },
  { p: "Phase 2", n: "Warm Up", state: "next", items: ["Token launch", "DEX listing", "Prediction market beta", "Leaderboard beta", "Partner campaigns"] },
  { p: "Phase 3", n: "Group Stage", state: "locked", items: ["Full prediction arena", "Community markets", "Daily match pools", "Glory Index dashboard", "KOL activations"] },
  { p: "Phase 4", n: "Knockout", state: "locked", items: ["Bracket predictions", "Major reward pools", "Mobile-first experience", "Advanced player markets"] },
  { p: "Phase 5", n: "Final Glory", state: "locked", items: ["Championship event", "Leaderboard winners", "NFT / badge rewards", "Post-tournament expansion"] },
];

const TOKENOMICS = [
  { l: "Liquidity", v: 25, c: C.blue }, { l: "Community Rewards", v: 22, c: C.green },
  { l: "Prediction Rewards", v: 20, c: C.gold }, { l: "Ecosystem", v: 15, c: C.purple },
  { l: "Marketing", v: 10, c: C.red }, { l: "Treasury", v: 8, c: "#64748b" },
];

/* ─────────────────────── APP STATE / ROUTER ─────────────────────── */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || "/arena");
  useEffect(() => {
    const h = () => { setRoute(window.location.hash.slice(1) || "/arena"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const nav = useCallback((to) => { window.location.hash = to; }, []);
  return [route, nav];
}

/* ─────────────────────── HOOKS ─────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, seen] = useReveal();
  return <div ref={ref} className={className} style={{ ...style, opacity: seen ? 1 : 0, transform: seen ? "translateY(0)" : "translateY(24px)", transition: `opacity .65s cubic-bezier(.16,1,.3,1) ${delay}s, transform .65s cubic-bezier(.16,1,.3,1) ${delay}s` }}>{children}</div>;
}
function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => { const diff = Math.max(0, target - Date.now()); setT({ d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) }); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ════════════════════════════════════════════════════════════════════
   CUSTOM DATA-VIZ PRIMITIVES — sports-native, glowing, animated
═══════════════════════════════════════════════════════════════════════ */

/* Confidence ring — radial meter replacing % text-only stats */
function ConfidenceRing({ value, size = 64, color = C.green, label, thick = 5 }) {
  const r = (size - thick) / 2, circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setV(value)); return () => cancelAnimationFrame(id); }, [value]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={thick} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (v / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)", filter: `drop-shadow(0 0 4px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: size * .26, color }}>{value}</span>
        {label && <span style={{ fontSize: size * .12, color: C.mute2, marginTop: -2 }}>{label}</span>}
      </div>
    </div>
  );
}

/* Volumetric liquidity bar — animated depth with shimmer */
function LiquidityBar({ pct, color = C.green, h = 7, glow = true }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(() => setW(pct), 60); return () => clearTimeout(id); }, [pct]);
  return (
    <div style={{ height: h, borderRadius: 99, background: "rgba(255,255,255,.06)", overflow: "hidden", position: "relative" }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: 99, background: `linear-gradient(90deg,${color},${color}88)`, transition: "width 1s cubic-bezier(.16,1,.3,1)", position: "relative", overflow: "hidden", boxShadow: glow ? `0 0 8px ${color}66` : "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)", animation: "shimmer 2.4s linear infinite" }} />
      </div>
    </div>
  );
}

/* Momentum sparkline — curved glowing line for live movement */
function Momentum({ points, color = C.green, h = 40, w = 120, fill = true }) {
  const max = Math.max(...points), min = Math.min(...points);
  const norm = points.map((p, i) => [(i / (points.length - 1)) * w, h - ((p - min) / (max - min || 1)) * (h - 6) - 3]);
  const path = norm.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  const gid = "mg" + color.replace("#", "");
  return (
    <svg width={w} height={h} style={{ overflow: "visible", display: "block" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".35" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${color}aa)` }} />
      <circle cx={norm[norm.length - 1][0]} cy={norm[norm.length - 1][1]} r="2.6" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

/* Mini pitch with heat zones — tactical glyph for market context */
function MiniPitch({ w = 100, h = 62, heat = [] }) {
  return (
    <svg width={w} height={h} viewBox="0 0 100 62" style={{ display: "block" }}>
      <rect x="1" y="1" width="98" height="60" rx="3" fill="rgba(0,255,136,.03)" stroke="rgba(0,255,136,.2)" strokeWidth="1" />
      <line x1="50" y1="1" x2="50" y2="61" stroke="rgba(0,255,136,.2)" strokeWidth="1" />
      <circle cx="50" cy="31" r="9" fill="none" stroke="rgba(0,255,136,.2)" strokeWidth="1" />
      <rect x="1" y="18" width="12" height="26" fill="none" stroke="rgba(0,255,136,.16)" strokeWidth="1" />
      <rect x="87" y="18" width="12" height="26" fill="none" stroke="rgba(0,255,136,.16)" strokeWidth="1" />
      {heat.map((z, i) => <circle key={i} cx={z.x} cy={z.y} r={z.r} fill={z.c} opacity={z.o} style={{ filter: "blur(3px)" }} />)}
    </svg>
  );
}

/* Radar chart — community sentiment / tactical analysis */
function SentimentRadar({ axes, size = 160, color = C.gold }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 22, n = axes.length;
  const pt = (val, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return [cx + Math.cos(a) * R * (val / 100), cy + Math.sin(a) * R * (val / 100)]; };
  const poly = axes.map((ax, i) => pt(ax.v, i).join(",")).join(" ");
  const rings = [0.33, 0.66, 1];
  return (
    <svg width={size} height={size}>
      {rings.map((r, ri) => <polygon key={ri} points={axes.map((_, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r].join(","); }).join(" ")} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />)}
      {axes.map((_, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R} stroke="rgba(255,255,255,.06)" strokeWidth="1" />; })}
      <polygon points={poly} fill={`${color}22`} stroke={color} strokeWidth="1.6" style={{ filter: `drop-shadow(0 0 4px ${color}66)` }} />
      {axes.map((ax, i) => { const [x, y] = pt(ax.v, i); return <circle key={i} cx={x} cy={y} r="2.4" fill={color} />; })}
      {axes.map((ax, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; const lx = cx + Math.cos(a) * (R + 12), ly = cy + Math.sin(a) * (R + 12); return <text key={i} x={lx} y={ly} fontSize="8" fill={C.mute} textAnchor="middle" dominantBaseline="middle" fontFamily="Manrope" fontWeight="600">{ax.l}</text>; })}
    </svg>
  );
}

/* Live pulse dot — broadcast LIVE indicator */
function LivePulse({ color = C.green, size = 8 }) {
  return <span style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: color, animation: "ping 1.6s cubic-bezier(0,0,.2,1) infinite" }} />
    <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}` }} />
  </span>;
}

/* ════════════════════════════════════════════════════════════════════
   CINEMATIC FOOTBALL ATMOSPHERE  — original SVG/CSS environment layers.
   No FIFA / federation / player / trophy-replica assets. All abstract.
   Every layer is pointer-events:none and sits behind content.
═══════════════════════════════════════════════════════════════════════ */

/* Floodlight rig — twin beams raking from the top corners */
function Floodlights({ color = C.gold, opacity = 1 }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity }}>
      <div style={{ position: "absolute", top: -40, left: "12%", width: 260, height: "180%", background: `linear-gradient(180deg,${color}26,transparent 62%)`, transform: "rotate(14deg)", transformOrigin: "top center", filter: "blur(14px)", animation: "beam 7s ease-in-out infinite", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", top: -40, right: "12%", width: 260, height: "180%", background: `linear-gradient(180deg,${C.white}1c,transparent 62%)`, transform: "rotate(-14deg)", transformOrigin: "top center", filter: "blur(14px)", animation: "beam 7s ease-in-out infinite 1.6s", mixBlendMode: "screen" }} />
      {/* rig lamps */}
      {[16, 84].map((x, i) => <div key={i} style={{ position: "absolute", top: 8, left: `${x}%`, transform: "translateX(-50%)", display: "flex", gap: 4 }}>{[0, 1, 2, 3].map((j) => <span key={j} style={{ width: 6, height: 5, borderRadius: 2, background: color, boxShadow: `0 0 8px ${color}`, opacity: .8, animation: `lampFlick ${3 + j * .4}s ease-in-out infinite ${j * .2}s` }} />)}</div>)}
    </div>
  );
}

/* Stadium tier + crowd silhouette band — concentric stands with speckled crowd */
function CrowdStands({ height = 130, dim = .5 }) {
  const dots = [];
  for (let r = 0; r < 5; r++) for (let i = 0; i < 60; i++) dots.push(<circle key={`${r}-${i}`} cx={8 + i * 16} cy={14 + r * 18 + (i % 2) * 4} r={1.6} fill={[C.green, C.blue, C.gold, C.white, C.red][(i + r) % 5]} opacity={0.12 + ((i * r) % 5) * 0.04} />);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height, pointerEvents: "none", opacity: dim, overflow: "hidden", maskImage: "linear-gradient(180deg,transparent,black 60%)" }}>
      <svg width="100%" height={height} viewBox="0 0 960 130" preserveAspectRatio="xMidYMax slice" style={{ display: "block" }}>
        {/* tier arcs */}
        {[0, 1, 2].map((t) => <path key={t} d={`M0 ${130 - t * 30} Q480 ${90 - t * 34} 960 ${130 - t * 30}`} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" />)}
        <g style={{ animation: "crowdSway 9s ease-in-out infinite" }}>{dots}</g>
      </svg>
    </div>
  );
}

/* Pitch geometry floor — perspective field lines fading into distance */
function PitchFloor({ color = C.green, opacity = .5 }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "62%", pointerEvents: "none", opacity, overflow: "hidden", maskImage: "linear-gradient(0deg,black,transparent 88%)" }}>
      <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" style={{ display: "block" }}>
        <defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0" /><stop offset="100%" stopColor={color} stopOpacity=".5" /></linearGradient></defs>
        {/* receding horizontal stripes */}
        {[0, 1, 2, 3, 4, 5].map((i) => { const y = 60 + i * i * 8; return <rect key={i} x="0" y={y} width="800" height={i * i * 1.6 + 4} fill={color} opacity={0.015 + i * 0.01} />; })}
        {/* converging verticals */}
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => <line key={i} x1={400 + i * 30} y1="60" x2={400 + i * 220} y2="300" stroke="url(#pf)" strokeWidth="1" />)}
        {/* halfway arc */}
        <ellipse cx="400" cy="300" rx="150" ry="46" fill="none" stroke={color} strokeOpacity=".3" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

/* LED perimeter board — scrolling luminous advertising band (generic GLORY copy) */
function LedBoard({ messages = ["PREDICT · BACK YOUR BELIEF · CHASE GLORY", "ONE TOKEN · EVERY MATCH · $GLORY", "ROAD TO FINAL GLORY · 2026 CYCLE"], color = C.green }) {
  const row = [...messages, ...messages, ...messages];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, overflow: "hidden", pointerEvents: "none", background: `linear-gradient(180deg,transparent,${color}10)`, borderTop: `1px solid ${color}22`, display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 40, whiteSpace: "nowrap", animation: "scrollX 24s linear infinite", width: "max-content" }}>
        {row.map((m, i) => <span key={i} style={{ fontFamily: FD, fontWeight: 800, fontSize: 11, letterSpacing: 2, color: `${color}bb`, textShadow: `0 0 8px ${color}66` }}>{m}</span>)}
      </div>
    </div>
  );
}

/* Atmospheric smoke / flare haze drifting upward */
function SmokeHaze({ color = C.green }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      {[["8%", color, 0], ["68%", C.blue, 2.5], ["40%", C.gold, 1.2]].map(([x, c, d], i) => (
        <div key={i} style={{ position: "absolute", bottom: -120, left: x, width: 220, height: 260, background: `radial-gradient(circle,${c}1a,transparent 70%)`, filter: "blur(30px)", animation: `drift 14s ease-in-out infinite ${d}s` }} />
      ))}
    </div>
  );
}

/* Player silhouettes — cinematic anonymous athlete figures (original, layered).
   Built from articulated body segments for a premium AAA-render feel. */
function PlayerSilhouette({ pose = "striker", color = "#040c16", size = 200, glow = C.gold, jersey = C.blue, style = {}, animate = false }) {
  const uid = `sil_${pose}_${Math.round(size)}`;
  // Each pose = ordered limb/torso polylines (stroke-based "thick-limb" body) + head + jersey torso path.
  const figures = {
    // striker — exploding into a shot, planted leg + driven kicking leg
    striker: { head: [50, 14, 7], torso: "M44 22 L58 24 L62 52 L48 56 L40 30 Z", limbs: [[58, 26, 76, 18, 88, 30], [44, 26, 30, 40, 22, 30], [50, 54, 44, 78, 58, 96], [54, 52, 74, 64, 92, 52]], boot: [92, 52] },
    // bicycle kick — inverted airborne scissor
    bicycle: { head: [40, 70, 7], torso: "M36 60 L52 54 L66 66 L54 80 L40 80 Z", limbs: [[52, 56, 70, 44, 86, 30], [40, 64, 26, 56, 14, 64], [60, 70, 80, 60, 96, 44], [50, 78, 46, 96, 60, 108]], boot: [96, 44] },
    // sprint — full stride, arms pumping
    sprint: { head: [54, 16, 7], torso: "M46 24 L60 26 L58 54 L46 56 L42 30 Z", limbs: [[58, 28, 78, 22, 86, 38], [46, 28, 28, 30, 18, 18], [52, 54, 64, 74, 60, 98], [48, 54, 30, 70, 22, 92]], boot: [60, 98] },
    // goalkeeper — full horizontal dive
    keeper: { head: [78, 30, 7], torso: "M64 36 L80 30 L86 46 L70 52 L60 44 Z", limbs: [[80, 34, 94, 22, 104, 28], [66, 40, 50, 40, 36, 34], [64, 48, 44, 56, 24, 58], [70, 50, 52, 64, 34, 72]], boot: [24, 58] },
    // captain lift — raising abstract cup, triumphant
    lift: { head: [50, 18, 7], torso: "M44 26 L58 26 L58 60 L44 60 Z", limbs: [[56, 28, 66, 14, 62, 2], [46, 28, 36, 14, 40, 2], [52, 58, 56, 82, 52, 104], [50, 58, 46, 82, 50, 104]], cup: true },
    // celebration — knee-slide arms wide, roaring
    celebrate: { head: [48, 22, 7], torso: "M42 30 L56 30 L58 56 L44 58 L40 34 Z", limbs: [[56, 32, 78, 24, 88, 10], [42, 32, 20, 26, 8, 14], [52, 56, 66, 74, 88, 80], [46, 56, 38, 78, 30, 96]], boot: [88, 80] },
  };
  const f = figures[pose] || figures.striker;
  return (
    <svg viewBox="0 0 110 120" width={size} height={size * 1.1} style={{ filter: `drop-shadow(0 8px 24px ${glow}55) drop-shadow(0 0 2px ${glow}33)`, ...style }} aria-hidden className={animate ? "g-player-loop" : undefined}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={glow} stopOpacity=".3" /><stop offset="42%" stopColor={color} stopOpacity=".96" /><stop offset="100%" stopColor="#01060c" /></linearGradient>
        <linearGradient id={uid + "j"} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={jersey} stopOpacity=".85" /><stop offset="100%" stopColor={jersey} stopOpacity=".35" /></linearGradient>
        <radialGradient id={uid + "rim"} cx="0.5" cy="0.3" r="0.7"><stop offset="0%" stopColor={glow} stopOpacity=".5" /><stop offset="100%" stopColor={glow} stopOpacity="0" /></radialGradient>
      </defs>
      {/* rim-light halo */}
      <ellipse cx="55" cy="50" rx="48" ry="56" fill={`url(#${uid}rim)`} opacity=".5" />
      {/* limbs as thick rounded strokes */}
      <g stroke={`url(#${uid})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {f.limbs.map((pts, i) => <polyline key={i} points={pts.reduce((a, v, j) => j % 2 ? a + "," + v + " " : a + v, "")} />)}
      </g>
      {/* torso (jersey) */}
      <path d={f.torso} fill={`url(#${uid}j)`} stroke={glow} strokeOpacity=".35" strokeWidth="1" />
      <path d={f.torso} fill={`url(#${uid})`} opacity=".5" />
      {/* head */}
      <circle cx={f.head[0]} cy={f.head[1]} r={f.head[2]} fill={`url(#${uid})`} stroke={glow} strokeOpacity=".4" strokeWidth="1" />
      {/* boot accent / ball at striking foot */}
      {f.boot && <circle cx={f.boot[0]} cy={f.boot[1]} r="6" fill="none" stroke={glow} strokeWidth="1.5" opacity=".9" style={animate ? { animation: "ballSpin 1.2s linear infinite" } : undefined} />}
      {f.boot && <path d={`M${f.boot[0] - 3} ${f.boot[1]} l3 -3 3 3 -3 3 z`} fill={glow} opacity=".8" />}
      {/* captain's cup */}
      {f.cup && <g stroke={glow} strokeWidth="2" fill={`url(#${uid}j)`}><path d="M44 2 h12 v3 a6 6 0 0 1 -12 0 z" /><path d="M50 5 v4 M47 9 h6" /></g>}
    </svg>
  );
}

/* Cinematic hero athlete composition — large dramatic figure with motion accents */
function HeroAthlete({ pose = "striker", glow = C.gold, jersey = C.blue, size = 360 }) {
  return (
    <div style={{ position: "relative", pointerEvents: "none" }}>
      {/* dramatic backlight */}
      <div style={{ position: "absolute", inset: "-20% -10%", background: `radial-gradient(ellipse at 50% 40%,${glow}22,transparent 65%)`, filter: "blur(20px)" }} />
      {/* motion streaks behind figure */}
      <svg viewBox="0 0 120 130" width={size} height={size * 1.08} style={{ position: "absolute", inset: 0, opacity: .4 }} aria-hidden>
        {[20, 34, 48].map((y, i) => <line key={i} x1="2" y1={y} x2="46" y2={y + 6} stroke={glow} strokeWidth="1.5" strokeLinecap="round" opacity={.5 - i * .12} style={{ animation: `streak 1.8s ease-out infinite ${i * .2}s` }} />)}
      </svg>
      <PlayerSilhouette pose={pose} glow={glow} jersey={jersey} size={size} animate />
    </div>
  );
}

/* Animated football with passing-line trajectory */
function BallMotion({ color = C.gold, w = 200, h = 90 }) {
  return (
    <svg viewBox="0 0 200 90" width={w} height={h} style={{ overflow: "visible" }} aria-hidden>
      <defs><linearGradient id="passln" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={color} stopOpacity="0" /><stop offset="100%" stopColor={color} stopOpacity=".8" /></linearGradient></defs>
      <path d="M6 80 Q100 -20 194 40" fill="none" stroke="url(#passln)" strokeWidth="2" strokeDasharray="4 5" style={{ animation: "dashFlow 1.4s linear infinite" }} />
      <g style={{ animation: "ballArc 3.2s ease-in-out infinite" }}>
        <circle r="7" fill="#0a141f" stroke={color} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        <path d="M-4 -2 l4 -3 4 3 -1.5 5 h-5 z" fill={color} opacity=".7" />
      </g>
    </svg>
  );
}

/* Goal-net texture overlay */
function GoalNet({ color = C.white, opacity = .06 }) {
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }} aria-hidden preserveAspectRatio="none">
      <defs><pattern id="net" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="skewX(-8)"><path d="M0 0 L22 22 M22 0 L0 22" stroke={color} strokeWidth=".5" fill="none" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#net)" />
    </svg>
  );
}

/* Cinematic rain — diagonal streaks for dramatic matchnight atmosphere */
function RainFX({ count = 40, color = "rgba(180,210,255,.18)" }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", maskImage: "linear-gradient(180deg,black,transparent)" }}>
      {[...Array(count)].map((_, i) => <span key={i} style={{ position: "absolute", top: "-12%", left: `${(i * 2.6) % 100}%`, width: 1, height: 40 + (i % 4) * 14, background: `linear-gradient(180deg,transparent,${color})`, transform: "rotate(12deg)", animation: `rainFall ${0.7 + (i % 5) * 0.12}s linear infinite ${(i % 7) * 0.1}s` }} />)}
    </div>
  );
}

/* Waving supporter scarves — stylized banner shapes that wave */
function Scarves({ items = [[C.blue, C.gold], [C.green, C.white], [C.red, C.gold]] }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {items.map(([a, b], i) => (
        <svg key={i} viewBox="0 0 120 40" width={120} style={{ position: "absolute", bottom: 30 + (i % 2) * 26, left: `${12 + i * 30}%`, opacity: .18, animation: `wave 5s ease-in-out infinite ${i * .7}s` }} aria-hidden>
          <path d="M2 8 Q30 2 60 8 T118 8 L118 30 Q90 36 60 30 T2 30 Z" fill={a} />
          <path d="M2 14 Q30 8 60 14 T118 14 L118 20 Q90 26 60 20 T2 20 Z" fill={b} opacity=".7" />
        </svg>
      ))}
    </div>
  );
}

/* Composite cinematic backdrop for hero blocks — stacks the layers */
function StadiumScene({ accent = C.gold, players = null, smoke = true, scarves = false, led = true, rain = false, net = false, children }) {
  return (
    <>
      <Floodlights color={accent} />
      {smoke && <SmokeHaze color={accent} />}
      {net && <GoalNet />}
      <PitchFloor color={C.green} opacity={.55} />
      <CrowdStands height={120} dim={.55} />
      {rain && <RainFX />}
      {scarves && <Scarves />}
      {players}
      {led && <LedBoard color={C.green} />}
      {children}
    </>
  );
}

/* ─────────────────────── SHARED UI ─────────────────────── */
function Btn({ children, variant = "primary", onClick, style = {}, size = "md" }) {
  const pad = size === "sm" ? "9px 16px" : size === "lg" ? "16px 32px" : "13px 24px";
  const fs = size === "sm" ? 13 : size === "lg" ? 16 : 14.5;
  const base = { padding: pad, borderRadius: 12, fontWeight: 800, fontSize: fs, cursor: "pointer", border: "none", fontFamily: FD, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .22s cubic-bezier(.16,1,.3,1)", whiteSpace: "nowrap", position: "relative", overflow: "hidden" };
  const v = variant === "primary" ? { background: `linear-gradient(95deg,${C.gold},#ffb347)`, color: C.black, boxShadow: `0 10px 30px -12px ${C.gold}` }
    : variant === "green" ? { background: "transparent", color: C.green, border: `1.5px solid ${C.green}` }
    : variant === "solidGreen" ? { background: `linear-gradient(95deg,${C.green},#00cc6e)`, color: C.black, boxShadow: `0 10px 30px -14px ${C.green}` }
    : { background: "rgba(255,255,255,.05)", color: C.white, border: `1px solid ${C.line}`, backdropFilter: "blur(8px)" };
  return <button onClick={onClick} style={{ ...base, ...v, ...style }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; if (variant === "primary") e.currentTarget.style.boxShadow = `0 16px 40px -10px ${C.gold}`; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; if (variant === "primary") e.currentTarget.style.boxShadow = `0 10px 30px -12px ${C.gold}`; }}>{children}</button>;
}
function Eyebrow({ children, color = C.green }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color, fontWeight: 700, marginBottom: 16, fontFamily: FD }}><span style={{ width: 22, height: 1.5, background: color, boxShadow: `0 0 6px ${color}` }} />{children}</span>;
}
/* glass card with edge lighting */
function Card({ children, style = {}, hover, glowColor = C.gold }) {
  const [h, setH] = useState(false);
  return <div onMouseEnter={hover ? () => setH(true) : undefined} onMouseLeave={hover ? () => setH(false) : undefined}
    style={{ background: "linear-gradient(160deg,rgba(13,28,46,.66),rgba(6,17,31,.86))", backdropFilter: "blur(14px)", border: `1px solid ${h ? `${glowColor}55` : C.line}`, borderRadius: 18, transition: "all .4s cubic-bezier(.16,1,.3,1)", transform: h ? "translateY(-5px)" : "none", boxShadow: h ? `0 28px 60px -28px ${glowColor}44, inset 0 1px 0 rgba(255,255,255,.06)` : "inset 0 1px 0 rgba(255,255,255,.04)", position: "relative", ...style }}>
    {children}</div>;
}
function Pill({ children, color = C.green, bg }) {
  return <span style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 99, background: bg || `${color}1a`, color, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase", fontFamily: FD, display: "inline-flex", alignItems: "center", gap: 5, border: `1px solid ${color}22` }}>{children}</span>;
}
function SectionTitle({ eyebrow, title, sub, color }) {
  return <>
    <Reveal><Eyebrow color={color}>{eyebrow}</Eyebrow></Reveal>
    <Reveal delay={.05}><h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.4vw,44px)", lineHeight: 1.12, margin: "0 0 12px", letterSpacing: "-.5px" }}>{title}</h2></Reveal>
    {sub && <Reveal delay={.1}><p style={{ fontSize: 16, color: C.mute, maxWidth: 640, lineHeight: 1.6, margin: "0 0 36px" }}>{sub}</p></Reveal>}
  </>;
}
/* GLORY logo — custom mark (chevron-trophy), no Lucide */
function Logo({ size = 23 }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FD, fontWeight: 800, fontSize: size * .9, letterSpacing: 1.5 }}>
    <span style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <Glyph name="trophy" size={size} color={C.gold} glow />
    </span>
    <span style={{ background: `linear-gradient(100deg,${C.gold},${C.white})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GLORY</span>
  </span>;
}

/* ─────────────────────── MARKET CARD (premiumized) ─────────────────────── */
function MarketCard({ m, onPredict, onOpen }) {
  const [hover, setHover] = useState(false);
  const lead = m.options.reduce((a, b) => (b.pct > a.pct ? b : a), m.options[0]);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: "linear-gradient(160deg,rgba(13,28,46,.9),rgba(6,17,31,.95))", backdropFilter: "blur(14px)", border: `1px solid ${hover ? `${C.gold}55` : C.lineG}`, borderRadius: 18, padding: 20, position: "relative", overflow: "hidden", transition: "all .4s cubic-bezier(.16,1,.3,1)", transform: hover ? "translateY(-6px)" : "none", boxShadow: hover ? `0 28px 64px -28px ${C.gold}55, inset 0 1px 0 rgba(255,255,255,.07)` : "inset 0 1px 0 rgba(255,255,255,.04)", cursor: "pointer" }}>
      {/* edge light sweep on hover */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity: hover ? 1 : 0, transition: "opacity .4s" }} />
      {/* tactical pitch overlay appears on hover */}
      <div style={{ position: "absolute", inset: 0, opacity: hover ? .5 : 0, transition: "opacity .5s", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MiniPitch w={220} h={140} heat={[{ x: 30, y: 31, r: 14, c: C.blue, o: .25 }, { x: 70, y: 31, r: 14, c: C.gold, o: .2 }]} />
      </div>
      {m.hot && <div style={{ position: "absolute", top: 13, right: -30, transform: "rotate(45deg)", background: `linear-gradient(90deg,${C.red},#ff6b6b)`, color: C.white, fontSize: 9, fontWeight: 800, padding: "3px 34px", letterSpacing: 1.5, fontFamily: FD, boxShadow: `0 0 16px ${C.red}88` }}>HOT</div>}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Pill>{m.tag}</Pill>
          <span style={{ fontSize: 11, color: C.mute2, display: "flex", alignItems: "center", gap: 5 }}><Glyph name="clock" size={12} /> {m.closes}</span>
        </div>
        <div onClick={() => onOpen(m.id)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6 }}>{m.codes.map((cd, i) => <NationChip key={i} code={cd} color={m.cc[i]} />)}</div>
        </div>
        <h4 onClick={() => onOpen(m.id)} style={{ fontFamily: FD, fontSize: 16.5, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.25 }}>{m.title}</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {m.options.map((o, i) => {
            const oc = [C.green, C.blue, C.gold][i % 3];
            return <div key={i} style={{ position: "relative", padding: "10px 13px", borderRadius: 10, border: `1px solid ${o === lead ? `${oc}33` : C.line}`, background: "rgba(255,255,255,.02)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, width: `${o.pct}%`, background: `linear-gradient(90deg,${oc}26,${oc}08)`, transition: "width .6s cubic-bezier(.16,1,.3,1)" }} />
              {o === lead && <div style={{ position: "absolute", top: 0, bottom: 0, width: 40, left: 0, background: `linear-gradient(90deg,transparent,${oc}1f,transparent)`, animation: "scanWipe 3.4s ease-in-out infinite" }} />}
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{o.label} <span style={{ color: C.mute2, fontSize: 11 }}>· {o.pct}%</span></span>
                <span style={{ color: oc, fontWeight: 800, fontFamily: FD, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>{o === lead && <Glyph name="trend" size={11} color={oc} style={{ animation: "oddsTick 2.2s ease-in-out infinite" }} />}{o.odds}</span>
              </div>
            </div>;
          })}
        </div>
        {/* expand reveal: momentum + depth */}
        <div style={{ height: hover ? 52 : 0, opacity: hover ? 1 : 0, overflow: "hidden", transition: "all .4s cubic-bezier(.16,1,.3,1)", marginBottom: hover ? 12 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: C.mute2, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Volume momentum</div>
              <Momentum points={[40, 52, 48, 61, 58, 72, 69, 84]} color={C.green} w={110} h={28} />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.mute2, textTransform: "uppercase", letterSpacing: 1 }}>Confidence</div>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: C.gold }}>{m.sentiment}<span style={{ fontSize: 12, color: C.mute }}>%</span></div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12.5, color: C.mute, display: "flex", alignItems: "center", gap: 5 }}><Glyph name="coin" size={13} color={C.gold} /> Pool <b style={{ color: C.gold }}>{m.pool}</b></span>
          <Btn size="sm" onClick={() => onPredict(m)}>Predict <Glyph name="chevR" size={14} /></Btn>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── PREDICTION MODAL ─────────────────────── */
function PredictModal() {
  const { predictTarget, setPredictTarget, balance, setBalance, connected, connect, addPrediction } = useApp();
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState(null);
  const [amt, setAmt] = useState("");
  useEffect(() => { if (predictTarget) { setStep(1); setPick(null); setAmt(""); } }, [predictTarget]);
  if (!predictTarget) return null;
  const m = predictTarget;
  const opt = pick != null ? m.options[pick] : null;
  const mult = opt ? parseFloat(opt.odds) : 0;
  const payout = amt && opt ? (parseFloat(amt) * mult).toFixed(0) : "0";
  const close = () => setPredictTarget(null);
  const confirm = () => {
    setBalance((b) => Math.max(0, b - parseFloat(amt || 0)));
    addPrediction({ market: m.title, pick: opt.label, amount: parseFloat(amt), payout, odds: opt.odds });
    setStep(5);
  };
  return (
    <div onClick={close} className="g-modal-wrap" style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,6,23,.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fade .25s" }}>
      <div onClick={(e) => e.stopPropagation()} className="g-modal" style={{ width: "100%", maxWidth: 440, background: "linear-gradient(160deg,#0c1d31,#06111f)", border: `1px solid ${C.lineG}`, borderRadius: 22, overflow: "hidden", position: "relative", boxShadow: `0 40px 90px -30px ${C.black}, inset 0 1px 0 rgba(255,255,255,.06)` }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
        {step < 5 && (
          <>
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ display: "flex", gap: 5 }}>{m.codes.map((cd, i) => <NationChip key={i} code={cd} color={m.cc[i]} size={11} />)}</div><span style={{ fontFamily: FD, fontWeight: 700, fontSize: 14.5 }}>{m.title}</span></div>
              <span style={{ cursor: "pointer" }} onClick={close}><Glyph name="close" size={20} color={C.mute} /></span>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "14px 22px 0" }}>
              {[1, 2, 3, 4].map((s) => <div key={s} style={{ flex: 1, height: 4, borderRadius: 9, background: s <= step ? C.gold : "rgba(255,255,255,.1)", transition: "background .3s", boxShadow: s <= step ? `0 0 8px ${C.gold}88` : "none" }} />)}
            </div>
            <div style={{ padding: 22 }}>
              {step === 1 && (<>
                <h3 style={{ fontFamily: FD, fontSize: 16, margin: "0 0 14px" }}>Step 1 · Choose your outcome</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {m.options.map((o, i) => (
                    <button key={i} onClick={() => setPick(i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${pick === i ? C.gold : C.line}`, background: pick === i ? `${C.gold}14` : "rgba(255,255,255,.02)", color: C.white, fontFamily: FB, transition: "all .2s" }}>
                      <span style={{ fontWeight: 600, fontSize: 14.5 }}>{o.label}</span>
                      <span style={{ color: pick === i ? C.gold : C.green, fontWeight: 800, fontFamily: FD }}>{o.odds}</span>
                    </button>
                  ))}
                </div>
                <Btn style={{ width: "100%", marginTop: 18, opacity: pick == null ? .4 : 1 }} onClick={() => pick != null && setStep(2)}>Continue</Btn>
              </>)}
              {step === 2 && (<>
                <h3 style={{ fontFamily: FD, fontSize: 16, margin: "0 0 6px" }}>Step 2 · Enter $GLORY amount</h3>
                <p style={{ fontSize: 12.5, color: C.mute, margin: "0 0 14px" }}>Balance: <b style={{ color: C.gold }}>{connected ? balance.toLocaleString() : "—"}</b> $GLORY</p>
                {!connected ? <Btn variant="solidGreen" style={{ width: "100%" }} onClick={connect}><Glyph name="wallet" size={16} /> Connect Wallet to Continue</Btn> : <>
                  <div style={{ position: "relative" }}>
                    <input value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" inputMode="numeric"
                      style={{ width: "100%", padding: "16px 70px 16px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,.03)", color: C.white, fontSize: 22, fontFamily: FD, fontWeight: 800, outline: "none" }} />
                    <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: C.gold, fontWeight: 800, fontFamily: FD }}>$GLORY</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {[1000, 5000, 25000].map((q) => <button key={q} onClick={() => setAmt(String(q))} style={{ flex: 1, padding: "8px", borderRadius: 9, border: `1px solid ${C.line}`, background: "rgba(255,255,255,.03)", color: C.mute, cursor: "pointer", fontSize: 12.5, fontFamily: FB, fontWeight: 600 }}>{q.toLocaleString()}</button>)}
                    <button onClick={() => setAmt(String(balance))} style={{ flex: 1, padding: "8px", borderRadius: 9, border: `1px solid ${C.gold}44`, background: `${C.gold}12`, color: C.gold, cursor: "pointer", fontSize: 12.5, fontFamily: FB, fontWeight: 700 }}>MAX</button>
                  </div>
                  <Btn style={{ width: "100%", marginTop: 18, opacity: !amt || +amt <= 0 ? .4 : 1 }} onClick={() => amt && +amt > 0 && setStep(3)}>Preview Payout</Btn>
                </>}
              </>)}
              {step === 3 && (<>
                <h3 style={{ fontFamily: FD, fontSize: 16, margin: "0 0 14px" }}>Step 3 · Preview</h3>
                <div style={{ borderRadius: 14, border: `1px solid ${C.line}`, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["Outcome", opt.label], ["Your stake", `${(+amt).toLocaleString()} $GLORY`], ["Odds", opt.odds], ["Closes in", m.closes]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span style={{ color: C.mute }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span></div>
                  ))}
                  <div style={{ height: 1, background: C.line }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: C.mute }}>Potential payout</span><span style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: C.green }}>{(+payout).toLocaleString()}</span></div>
                </div>
                <Btn style={{ width: "100%", marginTop: 18 }} onClick={() => setStep(4)}>Confirm Prediction</Btn>
              </>)}
              {step === 4 && (<>
                <h3 style={{ fontFamily: FD, fontSize: 16, margin: "0 0 14px" }}>Step 4 · Lock it in</h3>
                <p style={{ fontSize: 14, color: C.mute, lineHeight: 1.6, marginBottom: 18 }}>You're backing <b style={{ color: C.white }}>{opt.label}</b> with <b style={{ color: C.gold }}>{(+amt).toLocaleString()} $GLORY</b>. Once locked, your prediction enters the pool and cannot be withdrawn before settlement.</p>
                <Btn variant="solidGreen" style={{ width: "100%" }} onClick={confirm}><Glyph name="shield" size={16} /> Lock Prediction</Btn>
              </>)}
            </div>
          </>
        )}
        {step === 5 && <SuccessScreen opt={opt} amt={amt} payout={payout} close={close} />}
      </div>
    </div>
  );
}

function SuccessScreen({ opt, amt, payout, close }) {
  return (
    <div style={{ padding: "44px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* GOAL-moment stadium light flash */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 35%,${C.white},${C.gold}55,transparent 60%)`, animation: "goalFlash 1.1s ease-out forwards", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%,${C.gold}22,transparent 60%)`, animation: "fade .6s" }} />
      {/* kickoff pulse rings */}
      {[0, .25, .5].map((d, i) => <div key={i} style={{ position: "absolute", top: 66, left: "50%", marginLeft: -44, width: 88, height: 88, borderRadius: "50%", border: `2px solid ${C.gold}`, animation: `kickRing 1.4s ease-out ${d}s forwards`, pointerEvents: "none" }} />)}
      {[...Array(28)].map((_, i) => (
        <div key={i} style={{ position: "absolute", top: -10, left: `${(i * 3.6) % 100}%`, width: 7, height: 7, borderRadius: i % 2 ? 2 : 99, background: [C.gold, C.green, C.blue, C.red][i % 4], animation: `confetti ${1.6 + (i % 4) * .4}s ease-in ${(i % 6) * .08}s forwards` }} />
      ))}
      <div style={{ position: "relative" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,${C.gold},#c9942f)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", animation: "pop .5s cubic-bezier(.16,1.4,.3,1)", boxShadow: `0 0 70px -4px ${C.gold}` }}>
          <Glyph name="check" size={46} color={C.black} />
        </div>
        <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, margin: "0 0 6px", letterSpacing: 1 }}>PREDICTION LOCKED</h3>
        <p style={{ fontSize: 14, color: C.mute, margin: "0 0 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Glyph name="volume" size={14} color={C.green} /> The crowd roars. Floodlights flash.</p>
        <p style={{ fontSize: 15, margin: "16px 0 24px" }}>Backed <b style={{ color: C.gold }}>{opt.label}</b> · {(+amt).toLocaleString()} $GLORY → up to <b style={{ color: C.green }}>{(+payout).toLocaleString()}</b></p>
        <Btn style={{ width: "100%" }} onClick={close}>Back to the Arena</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────── WALLET MODAL ─────────────────────── */
function WalletModal() {
  const { walletOpen, setWalletOpen, connect } = useApp();
  if (!walletOpen) return null;
  const wallets = [["Hyperliquid", C.green, true], ["WalletConnect", C.blue, true], ["MetaMask", C.gold, true], ["Phantom · Solana soon", C.purple, false]];
  return (
    <div onClick={() => setWalletOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,6,23,.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fade .25s" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 380, background: "linear-gradient(160deg,#0c1d31,#06111f)", border: `1px solid ${C.lineG}`, borderRadius: 20, padding: 24, position: "relative", boxShadow: `0 40px 90px -30px ${C.black}` }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.green},transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontFamily: FD, fontSize: 18, margin: 0 }}>Connect Wallet</h3>
          <span style={{ cursor: "pointer" }} onClick={() => setWalletOpen(false)}><Glyph name="close" size={20} color={C.mute} /></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {wallets.map(([n, col, on]) => (
            <button key={n} disabled={!on} onClick={() => on && connect()} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 13, border: `1px solid ${on ? C.line : "rgba(255,255,255,.04)"}`, background: on ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.01)", color: on ? C.white : C.mute2, cursor: on ? "pointer" : "not-allowed", fontFamily: FB, fontWeight: 600, fontSize: 14.5, opacity: on ? 1 : .5, transition: "all .2s" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: `${col}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Glyph name="wallet" size={16} color={col} /></span> {n}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: C.mute2, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>Demo wallet — no real funds. Built for high-speed on-chain football prediction culture.</p>
      </div>
    </div>
  );
}

/* ─────────────────────── HEADER ─────────────────────── */
const NAVITEMS = [["Arena", "/arena"], ["Markets", "/markets"], ["Tournament", "/tournament"], ["Leaderboard", "/leaderboard"], ["How It Works", "/how-it-works"], ["Roadmap", "/roadmap"]];

function Header() {
  const { route, nav, connected, balance, address, setWalletOpen, setMobileNav } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const active = (p) => route === p || (p !== "/arena" && route.startsWith(p));
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "13px clamp(16px,4vw,48px)", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(2,6,23,.72)" : "transparent", backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none", borderBottom: `1px solid ${scrolled ? C.lineG : "transparent"}`, transition: "all .4s", boxShadow: scrolled ? `0 8px 32px -16px ${C.black}` : "none" }}>
      {/* stadium light reflection */}
      {scrolled && <div style={{ position: "absolute", top: 0, left: "30%", width: 300, height: "100%", background: `radial-gradient(ellipse at top,${C.gold}0a,transparent 70%)`, pointerEvents: "none" }} />}
      <div onClick={() => nav("/arena")} style={{ cursor: "pointer", position: "relative" }}><Logo /></div>
      <div className="g-desk" style={{ display: "flex", gap: 26, fontSize: 14, fontWeight: 600 }}>
        {NAVITEMS.map(([l, p]) => (
          <a key={p} onClick={() => nav(p)} style={{ color: active(p) ? C.gold : "rgba(248,250,252,.72)", textDecoration: "none", cursor: "pointer", position: "relative", paddingBottom: 4, transition: "color .25s" }}
            onMouseEnter={(e) => !active(p) && (e.currentTarget.style.color = C.white)} onMouseLeave={(e) => !active(p) && (e.currentTarget.style.color = "rgba(248,250,252,.72)")}>
            {l}<span style={{ position: "absolute", left: 0, bottom: -1, height: 2, width: active(p) ? "100%" : 0, background: C.gold, borderRadius: 9, boxShadow: `0 0 8px ${C.gold}`, transition: "width .3s cubic-bezier(.16,1,.3,1)" }} />
          </a>
        ))}
      </div>
      <div className="g-desk" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ cursor: "pointer", opacity: .7, transition: "opacity .2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = .7}><Glyph name="twitter" size={17} color={C.mute} /></span>
        <span style={{ cursor: "pointer", opacity: .7, transition: "opacity .2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = .7}><Glyph name="hash" size={17} color={C.mute} /></span>
        {connected ? (
          <div onClick={() => nav(`/profile/${address}`)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 13px 7px 7px", borderRadius: 99, border: `1px solid ${C.lineG}`, background: "rgba(0,255,136,.06)", cursor: "pointer" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.green},${C.blue})`, boxShadow: `0 0 10px ${C.green}55` }} />
            <div style={{ lineHeight: 1.1 }}><div style={{ fontSize: 12.5, fontWeight: 800, fontFamily: FD, color: C.gold }}>{balance.toLocaleString()}</div><div style={{ fontSize: 9.5, color: C.mute2 }}>{address.slice(0, 6)}…{address.slice(-4)}</div></div>
          </div>
        ) : <Btn size="sm" variant="green" onClick={() => setWalletOpen(true)}><Glyph name="wallet" size={15} /> Connect</Btn>}
        <Btn size="sm" onClick={() => nav("/buy")}>Buy $GLORY</Btn>
      </div>
      <div className="g-mob" style={{ display: "none", alignItems: "center", gap: 12 }}>
        {connected && <span style={{ fontSize: 13, fontWeight: 800, fontFamily: FD, color: C.gold }}>{balance.toLocaleString()}</span>}
        <span style={{ cursor: "pointer" }} onClick={() => setMobileNav(true)}><Glyph name="menu" size={26} color={C.white} /></span>
      </div>
    </nav>
  );
}

function MobileNavOverlay() {
  const { mobileNav, setMobileNav, nav, connected, setWalletOpen } = useApp();
  if (!mobileNav) return null;
  const go = (p) => { nav(p); setMobileNav(false); };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "linear-gradient(180deg,#06111f,#020617)", animation: "slideDown .35s cubic-bezier(.16,1,.3,1)", padding: "20px clamp(16px,5vw,40px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ambient light sweep */}
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 360, height: 360, background: `radial-gradient(circle,${C.gold}1a,transparent 70%)`, filter: "blur(40px)", animation: "flood 6s ease-in-out infinite" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, position: "relative" }}>
        <Logo />
        <span style={{ cursor: "pointer" }} onClick={() => setMobileNav(false)}><Glyph name="close" size={28} color={C.white} /></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, position: "relative" }}>
        {[...NAVITEMS, ["Tokenomics", "/tokenomics"], ["Community", "/community"], ["Docs", "/docs"]].map(([l, p], i) => (
          <a key={p} onClick={() => go(p)} style={{ fontFamily: FD, fontWeight: 700, fontSize: 27, color: C.white, textDecoration: "none", padding: "12px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.line}`, animation: `fadeUp .4s ease ${i * .05}s both` }}>{l} <Glyph name="chevR" size={20} color={C.gold} /></a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 24, position: "relative" }}>
        {!connected && <Btn variant="green" style={{ flex: 1 }} onClick={() => { setWalletOpen(true); setMobileNav(false); }}>Connect Wallet</Btn>}
        <Btn style={{ flex: 1 }} onClick={() => go("/buy")}>Buy $GLORY</Btn>
      </div>
    </div>
  );
}

function MobileBottomNav() {
  const { route, nav } = useApp();
  const items = [["Arena", "/arena", "home"], ["Markets", "/markets", "grid"], ["Cup", "/tournament", "trophy"], ["Ranks", "/leaderboard", "award"], ["Buy", "/buy", "coin"]];
  const active = (p) => route === p || (p !== "/arena" && route.startsWith(p));
  return (
    <div className="g-mob" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, background: "rgba(2,6,23,.9)", backdropFilter: "blur(20px) saturate(1.4)", borderTop: `1px solid ${C.lineG}`, padding: "8px 6px calc(8px + env(safe-area-inset-bottom,0px))", justifyContent: "space-around" }}>
      {items.map(([l, p, g]) => {
        const on = active(p);
        return <button key={p} onClick={() => nav(p)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 10px", color: on ? C.gold : C.mute, position: "relative", transition: "color .2s" }}>
          {on && <span style={{ position: "absolute", top: -8, width: 5, height: 5, borderRadius: 99, background: C.gold, boxShadow: `0 0 8px ${C.gold}` }} />}
          <Glyph name={g} size={21} glow={on} /><span style={{ fontSize: 10, fontWeight: 700, fontFamily: FD }}>{l}</span>
        </button>;
      })}
    </div>
  );
}

/* ─────────────────────── FOOTER ─────────────────────── */
function Footer() {
  const { nav } = useApp();
  const cols = [
    ["Platform", [["Arena", "/arena"], ["Markets", "/markets"], ["Tournament", "/tournament"], ["Leaderboard", "/leaderboard"], ["Tokenomics", "/tokenomics"]]],
    ["Resources", [["Docs", "/docs"], ["How It Works", "/how-it-works"], ["Roadmap", "/roadmap"], ["Legal", "/legal"]]],
    ["Community", [["Twitter / X", "#"], ["Telegram", "#"], ["Discord", "#"], ["Medium", "#"]]],
  ];
  return (
    <footer style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${C.lineG}`, background: "rgba(2,6,23,.7)", marginTop: 40, overflow: "hidden" }}>
      {/* ambient stadium lighting */}
      <div style={{ position: "absolute", top: -140, left: "25%", width: 500, height: 280, background: `radial-gradient(ellipse,${C.gold}14,transparent 70%)`, filter: "blur(50px)", animation: "flood 7s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: -100, right: "10%", width: 360, height: 220, background: `radial-gradient(ellipse,${C.green}10,transparent 70%)`, filter: "blur(50px)", animation: "flood 9s ease-in-out infinite 1.5s" }} />
      <Ticker compact />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px clamp(20px,5vw,48px) 30px", position: "relative" }}>
        <div className="g-foot-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ marginBottom: 12 }}><Logo size={25} /></div>
            <p style={{ fontSize: 14.5, color: C.mute, maxWidth: 320, lineHeight: 1.55, margin: 0 }}>Predict. Back your belief. Chase Glory. The single-token football prediction meme coin for the biggest stage on earth.</p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.mute2, fontWeight: 700, marginBottom: 14, fontFamily: FD }}>{h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(([l, p]) => <a key={l} onClick={() => p.startsWith("/") && nav(p)} style={{ fontSize: 14, color: C.mute, textDecoration: "none", cursor: "pointer", transition: "color .2s", width: "fit-content" }} onMouseEnter={(e) => e.currentTarget.style.color = C.gold} onMouseLeave={(e) => e.currentTarget.style.color = C.mute}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 22, borderTop: `1px solid ${C.line}` }}>
          <p style={{ fontSize: 11.5, color: C.mute2, lineHeight: 1.6, margin: "0 0 12px", maxWidth: 880 }}>GLORY is an independent meme token and prediction-based entertainment product. It is not affiliated with, endorsed by, or sponsored by FIFA, UEFA, any football governing body, national team, club, league, or player. $GLORY is a high-risk crypto asset. Prediction markets may be restricted in some jurisdictions. Users are responsible for following local laws.</p>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12.5, color: C.mute2, alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}><LivePulse size={6} /> Built for the fans chasing Glory.</span>
            <span>© 2026 GLORY · Launching on Hyperliquid</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Ticker({ compact }) {
  const items = [["ARG vs BRA pool crosses 4.2M $GLORY", C.gold], ["Golden Boot race heating up", C.red], ["Knockout brackets now open", C.green], ["Glory Index at 87 — ALL TIME HIGH", C.blue], ["12,480 predictions placed today", C.green], ["New leaderboard king: @striker_99", C.gold]];
  const row = [...items, ...items];
  return (
    <div style={{ borderTop: `1px solid ${C.lineG}`, borderBottom: compact ? "none" : `1px solid ${C.lineG}`, background: "rgba(0,255,136,.04)", overflow: "hidden", padding: compact ? "10px 0" : "12px 0" }}>
      <div style={{ display: "flex", gap: 38, whiteSpace: "nowrap", animation: "scrollX 30s linear infinite", width: "max-content" }}>
        {row.map(([t, c], i) => <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "rgba(248,250,252,.78)", fontFamily: FB, display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: 99, background: c, boxShadow: `0 0 6px ${c}` }} />{t}</span>)}
      </div>
    </div>
  );
}

/* ─────────────────────── PAGE WRAPPER ─────────────────────── */
function Page({ children, wide }) {
  const { route } = useApp();
  return <main key={route} className="g-page" style={{ position: "relative", zIndex: 2, maxWidth: wide ? 1320 : 1240, margin: "0 auto", padding: "100px clamp(16px,4vw,48px) 60px", minHeight: "70vh", animation: "sceneCut .55s cubic-bezier(.16,1,.3,1)" }}>
    {/* broadcast scan-wipe on scene change */}
    <div key={"wipe" + route} style={{ position: "fixed", inset: 0, zIndex: 95, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: "45%", left: 0, background: `linear-gradient(90deg,transparent,${C.green}10,${C.gold}14,transparent)`, animation: "scanWipe .7s cubic-bezier(.7,0,.3,1) forwards" }} />
    </div>
    {children}
  </main>;
}

/* ═══════════════════════ PAGES ═══════════════════════ */

/* Hero match card — the wordless product explainer: match + odds + community + volume + bracket */
function HeroMatchCard({ onPredict, onOpen, cd }) {
  const m = MARKETS[0]; // Argentina vs Brazil
  const [tab, setTab] = useState(0);
  return (
    <div style={{ position: "relative" }}>
      {/* floating bracket glimpse behind, top-right (kept inside bounds) */}
      <div className="g-hide-lg" style={{ position: "absolute", top: -14, right: 4, transform: "rotate(2deg)", opacity: .92, zIndex: 1 }}>
        <div style={{ background: "linear-gradient(160deg,rgba(13,28,46,.96),rgba(6,17,31,.98))", border: `1px solid ${C.gold}33`, borderRadius: 13, padding: "11px 13px", boxShadow: `0 20px 50px -20px ${C.black}` }}>
          <div style={{ fontSize: 8.5, letterSpacing: 1, textTransform: "uppercase", color: C.mute2, fontWeight: 700, marginBottom: 7, display: "flex", alignItems: "center", gap: 4 }}><Glyph name="trophy" size={9} color={C.gold} /> Knockout bracket</div>
          {[["ARG", C.blue, "FRA", C.blue], ["BRA", C.gold, "ESP", C.red]].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 5, background: i === 0 ? `${C.gold}1a` : "rgba(255,255,255,.03)", border: `1px solid ${i === 0 ? C.gold + "44" : C.line}` }}><NationChip code={row[0]} color={row[1]} size={8} /></span>
              </span>
              <Glyph name="chevR" size={9} color={C.mute2} />
              <span style={{ padding: "2px 6px", borderRadius: 5, background: "rgba(255,255,255,.03)", border: `1px solid ${C.line}` }}><NationChip code={i === 0 ? "ARG" : "—"} color={C.blue} size={8} /></span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, paddingTop: 6, borderTop: `1px solid ${C.line}` }}><Glyph name="crown" size={11} color={C.gold} glow /><span style={{ fontFamily: FD, fontWeight: 800, fontSize: 9, color: C.gold }}>YOUR FINAL PICK</span></div>
        </div>
      </div>

      {/* main live match card */}
      <div style={{ position: "relative", zIndex: 2, background: "linear-gradient(160deg,rgba(13,28,46,.97),rgba(6,17,31,.99))", border: `1px solid ${C.gold}40`, borderRadius: 20, overflow: "hidden", boxShadow: `0 30px 70px -28px ${C.black}, 0 0 40px -20px ${C.gold}55, inset 0 1px 0 rgba(255,255,255,.07)` }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
        {/* scoreboard header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,59,59,.04)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FD, fontWeight: 800, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.red }}><LivePulse size={6} color={C.red} /> Live Market</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.mute }}><Glyph name="clock" size={13} /> Closes <b style={{ color: C.white, fontFamily: FD }}>{String(cd.h).padStart(2, "0")}:{String(cd.m).padStart(2, "0")}:{String(cd.s).padStart(2, "0")}</b></span>
        </div>
        {/* country vs country */}
        <div style={{ padding: "20px 18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          {[["Argentina", "ARG", C.blue, "52%"], null, ["Brazil", "BRA", C.gold, "30%"]].map((t, i) => t === null ? (
            <div key="vs" style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 13, color: C.mute2 }}>VS</div>
              <div style={{ fontSize: 9.5, color: C.mute2, marginTop: 2 }}>Draw 18%</div>
            </div>
          ) : (
            <div key={t[1]} style={{ flex: 1, textAlign: i === 0 ? "left" : "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: i === 0 ? "flex-start" : "flex-end", marginBottom: 6 }}><NationChip code={t[1]} color={t[2]} size={18} /></div>
              <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 14 }}>{t[0]}</div>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: i === 0 ? C.green : C.gold }}>{t[3]}</div>
              <div style={{ fontSize: 9.5, color: C.mute2, textTransform: "uppercase", letterSpacing: .5 }}>community backing</div>
            </div>
          ))}
        </div>
        {/* community split bar */}
        <div style={{ padding: "0 18px 14px" }}>
          <div style={{ height: 8, borderRadius: 99, overflow: "hidden", display: "flex", boxShadow: "inset 0 1px 2px rgba(0,0,0,.4)" }}>
            <div style={{ width: "52%", background: `linear-gradient(90deg,${C.green},${C.green}aa)` }} />
            <div style={{ width: "18%", background: "rgba(255,255,255,.15)" }} />
            <div style={{ width: "30%", background: `linear-gradient(90deg,${C.gold}aa,${C.gold})` }} />
          </div>
        </div>
        {/* prediction buttons (odds) */}
        <div style={{ padding: "0 18px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {m.options.map((o, i) => {
            const oc = [C.green, C.mute, C.gold][i];
            return <button key={i} onClick={() => onPredict(m)} style={{ padding: "11px 8px", borderRadius: 11, border: `1px solid ${oc === C.mute ? C.line : oc + "44"}`, background: oc === C.mute ? "rgba(255,255,255,.03)" : `${oc}12`, color: C.white, cursor: "pointer", fontFamily: FB, transition: "all .2s", textAlign: "center" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = oc === C.mute ? C.mute2 : oc; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = oc === C.mute ? C.line : oc + "44"; }}>
              <div style={{ fontSize: 10.5, color: C.mute, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.label}</div>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: i === 1 ? C.white : oc }}>{o.odds}</div>
            </button>;
          })}
        </div>
        {/* footer: volume + predict CTA */}
        <div style={{ padding: "13px 18px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,.02)" }}>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontSize: 11.5, color: C.mute }}>Pool <b style={{ color: C.gold, fontFamily: FD }}>{m.pool}</b></span>
            <span style={{ fontSize: 11.5, color: C.mute, display: "flex", alignItems: "center", gap: 4 }}><Glyph name="trend" size={12} color={C.green} /> Vol <b style={{ color: C.green, fontFamily: FD }}>{m.vol}</b></span>
          </div>
          <Btn size="sm" onClick={() => onPredict(m)}>Predict <Glyph name="chevR" size={13} /></Btn>
        </div>
      </div>

      {/* live activity ticker under the card */}
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", borderRadius: 12, background: "rgba(0,255,136,.05)", border: `1px solid ${C.lineG}`, overflow: "hidden" }}>
        <LivePulse size={6} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 28, whiteSpace: "nowrap", animation: "scrollX 22s linear infinite", width: "max-content" }}>
            {[...FEED, ...FEED].map((f, i) => <span key={i} style={{ fontSize: 11.5, color: C.mute }}><b style={{ color: C.white }}>{f.u}</b> {f.a} <b style={{ color: C.gold }}>{f.v}</b></span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- ARENA ---- */
function ArenaPage() {
  const { nav, openPredict } = useApp();
  const cd = useCountdown(new Date("2026-06-11T16:00:00Z").getTime());
  const trending = MARKETS.filter((m) => m.hot || ["red-card", "keeper-hero"].includes(m.id)).slice(0, 5);
  return (
    <Page wide>
      {/* hero — ONE cinematic broadcast scene: text, player, market all share the environment */}
      <Reveal>
        <div style={{ position: "relative", borderRadius: 26, overflow: "hidden", padding: "clamp(26px,4vw,52px)", marginBottom: 28, background: "radial-gradient(ellipse at 72% 30%,#11304d,#0a1b2e 55%,#050f1b)", border: `1px solid ${C.lineG}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)" }}>
          {/* ── full-bleed stadium environment (spans the whole hero, not just one side) ── */}
          <CrowdStands height={150} dim={.5} />
          <Floodlights color={C.gold} opacity={.55} />
          <SmokeHaze color={C.gold} />
          {/* pitch perspective floor anchoring the whole scene */}
          <div style={{ position: "absolute", inset: 0, opacity: .5, pointerEvents: "none" }}><PitchFloor color={C.green} opacity={.5} /></div>
          {/* depth gradients: warm light pooling on the right where the match lives */}
          <div style={{ position: "absolute", top: "-30%", right: "-8%", width: 620, height: 620, background: `radial-gradient(circle,${C.gold}1f,transparent 68%)`, filter: "blur(60px)", animation: "flood 7s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-40%", left: "-6%", width: 520, height: 520, background: `radial-gradient(circle,${C.blue}18,transparent 70%)`, filter: "blur(60px)", animation: "flood 9s ease-in-out infinite 1.4s" }} />
          {/* faint pitch grid tying both halves together */}
          <div style={{ position: "absolute", inset: 0, opacity: .14, backgroundImage: `linear-gradient(${C.green}10 1px,transparent 1px),linear-gradient(90deg,${C.green}10 1px,transparent 1px)`, backgroundSize: "58px 58px", maskImage: "radial-gradient(ellipse at 60% 45%,black,transparent 80%)" }} />
          {/* giant hero athlete bridging center → right, sitting INSIDE the scene */}
          <div className="g-hide-sm" style={{ position: "absolute", right: "30%", bottom: -28, opacity: .9, zIndex: 1, pointerEvents: "none", maskImage: "linear-gradient(180deg,black 78%,transparent)", filter: "drop-shadow(0 20px 50px rgba(0,0,0,.55))" }}>
            <HeroAthlete pose="striker" glow={C.gold} jersey={C.blue} size={440} />
          </div>
          {/* passing-line motion sweeping across the scene */}
          <div className="g-hide-sm" style={{ position: "absolute", left: "22%", top: "20%", opacity: .5, zIndex: 1, pointerEvents: "none" }}><BallMotion color={C.gold} w={300} h={120} /></div>
          {/* floating tactical radar — broadcast graphic, bottom-left depth */}
          <div className="g-hide-sm" style={{ position: "absolute", left: 30, bottom: 26, opacity: .4, zIndex: 1, pointerEvents: "none" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="52" fill="none" stroke={`${C.green}40`} strokeWidth="1" />
              <circle cx="60" cy="60" r="32" fill="none" stroke={`${C.green}30`} strokeWidth="1" />
              <line x1="60" y1="60" x2="112" y2="60" stroke={`${C.green}30`} strokeWidth="1" />
              <g style={{ transformOrigin: "60px 60px", animation: "radarSweep 4s linear infinite" }}><path d="M60 60 L112 60 A52 52 0 0 1 96 96 Z" fill={`${C.green}14`} /></g>
            </svg>
          </div>

          {/* ── content grid: weighted right, vertically centered into the scene ── */}
          <div className="g-arena-hero" style={{ position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: ".92fr 1.18fr", gap: 30, alignItems: "center", minHeight: 440 }}>
            {/* LEFT — headline + CTA */}
            <div>
              <Pill color={C.green}><LivePulse size={6} /> Live football prediction markets</Pill>
              <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(32px,4.4vw,54px)", lineHeight: 1.02, margin: "16px 0 16px", letterSpacing: "-1.2px", textShadow: "0 2px 30px rgba(0,0,0,.5)" }}>Predict the world's biggest <span style={{ background: `linear-gradient(100deg,${C.gold},${C.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>football moments.</span></h1>
              <p style={{ fontSize: 16, color: C.mute, maxWidth: 430, lineHeight: 1.55, margin: "0 0 24px" }}>Use $GLORY to predict match winners, goals, players, and full tournament brackets — in the ultimate Web3 football prediction arena.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <Btn size="lg" onClick={() => nav("/markets")}><Glyph name="bolt" size={18} /> Start Predicting</Btn>
                <Btn size="lg" variant="green" onClick={() => nav("/markets")}>Explore Markets</Btn>
              </div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                {[["63.4M", "$GLORY volume"], ["128", "live markets"], ["12,480", "predictions today"]].map(([v, l]) => (
                  <div key={l}><div style={{ fontFamily: FD, fontWeight: 800, fontSize: 19, color: C.gold }}>{v}</div><div style={{ fontSize: 11.5, color: C.mute2 }}>{l}</div></div>
                ))}
              </div>
            </div>
            {/* RIGHT — match embedded in a broadcast-screen frame, fused to the scene */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", minWidth: 0 }}>
              {/* giant stadium screen housing: gives the card a "big screen on the gantry" feel */}
              <div className="g-livebox" style={{ position: "relative", width: "100%", maxWidth: 420, borderRadius: 22, padding: 12, background: "linear-gradient(160deg,rgba(8,20,34,.72),rgba(4,12,22,.55))", border: `1px solid ${C.gold}26`, boxShadow: `0 40px 90px -34px #000, 0 0 60px -28px ${C.gold}55, inset 0 1px 0 rgba(255,255,255,.06)`, backdropFilter: "blur(6px)" }}>
                {/* screen header lugs */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FD, fontWeight: 800, fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", color: C.mute2 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: C.red, boxShadow: `0 0 6px ${C.red}` }} /> Stadium Screen · Cam 01</span>
                  <span style={{ display: "flex", gap: 4 }}>{[C.green, C.gold, C.blue].map((c, i) => <span key={i} style={{ width: 5, height: 5, borderRadius: 99, background: c, opacity: .8 }} />)}</span>
                </div>
                <HeroMatchCard onPredict={openPredict} onOpen={(id) => nav(`/markets/${id}`)} cd={cd} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* stat strip — broadcast chips with viz */}
      <Reveal delay={.05}>
        <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 36 }}>
          <StatChip glyph="bars" label="Total Volume" value="63.4M" color={C.green} spark={[30, 42, 38, 55, 60, 72, 80]} />
          <StatChip glyph="grid" label="Active Markets" value="128" color={C.blue} spark={[120, 122, 119, 124, 126, 125, 128]} />
          <StatChip glyph="target" label="Predictions Today" value="12,480" color={C.gold} spark={[8, 9, 11, 10, 12, 11, 12.5]} />
          <StatChip glyph="flame" label="Glory Index" value="87" suffix="↑" color={C.red} spark={[70, 74, 72, 80, 78, 84, 87]} />
        </div>
      </Reveal>

      {/* slim kickoff countdown banner */}
      <Reveal delay={.08}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 14, marginBottom: 36, padding: "12px 18px", background: `linear-gradient(100deg,${C.gold}10,transparent 60%)`, border: `1px solid ${C.gold}22`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: FD, fontWeight: 700, fontSize: 14 }}><Glyph name="trophy" size={17} color={C.gold} glow /> Tournament kickoff in</span>
          <div style={{ display: "flex", gap: 7 }}>
            {[["D", cd.d], ["H", cd.h], ["M", cd.m], ["S", cd.s]].map(([l, v]) => <FlipDigit key={l} label={l} value={v} />)}
          </div>
        </div>
      </Reveal>

      <div className="g-arena-grid" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 24 }}>
        <div>
          <SectionTitle eyebrow="Live Trending Predictions" title="Hottest markets right now" />
          <div className="g-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {trending.map((m, i) => <Reveal key={m.id} delay={(i % 2) * .06}><MarketCard m={m} onPredict={openPredict} onOpen={(id) => nav(`/markets/${id}`)} /></Reveal>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Glory Index — radial + heatmap */}
          <Reveal>
            <Card style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Glyph name="flame" size={18} color={C.red} glow /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, margin: 0 }}>Glory Index</h3></div>
                <Pill color={C.red}>Global Hype</Pill>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <ConfidenceRing value={87} size={84} color={C.gold} label="hype" thick={6} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 3 }}>
                    {[...Array(27)].map((_, i) => { const v = (Math.sin(i * 1.4) + 1) / 2; return <div key={i} style={{ aspectRatio: "1", borderRadius: 2, background: `rgba(0,255,136,${.1 + v * .7})`, boxShadow: v > .7 ? `0 0 4px ${C.green}66` : "none" }} />; })}
                  </div>
                  <div style={{ fontSize: 11, color: C.mute2, marginTop: 8 }}>Momentum <b style={{ color: C.green }}>+12%</b> last 24h</div>
                </div>
              </div>
            </Card>
          </Reveal>
          {/* Live activity */}
          <Reveal delay={.05}>
            <Card style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><Glyph name="signal" size={17} color={C.green} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, margin: 0 }}>Live Activity</h3><LivePulse size={7} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {FEED.map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: C.mute, lineHeight: 1.4, display: "flex", justifyContent: "space-between", gap: 10, animation: i === 0 ? "feedIn .5s ease" : "none" }}>
                    <span><b style={{ color: C.white }}>{f.u}</b> {f.a} <b style={{ color: C.gold }}>{f.v}</b> $GLORY</span>
                    <span style={{ color: C.mute2, flexShrink: 0, fontSize: 11 }}>{f.t}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          {/* Trending nations */}
          <Reveal delay={.1}>
            <Card style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><Glyph name="radar" size={17} color={C.blue} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, margin: 0 }}>Trending Nations</h3></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {NATIONS.slice(0, 6).map((n) => (
                  <div key={n.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <NationChip code={n.code} color={n.c} size={12} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1, color: C.mute }}>{n.n}</span>
                    <div style={{ width: 90 }}><LiquidityBar pct={n.heat} color={n.heat > 75 ? C.red : C.gold} h={6} /></div>
                    <span style={{ fontSize: 11.5, color: C.gold, fontWeight: 700, fontFamily: FD, width: 24, textAlign: "right" }}>{n.heat}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* leaderboard preview */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <SectionTitle eyebrow="Top Predictors" title="This week's Glory leaders" />
          <Btn size="sm" variant="ghost" onClick={() => nav("/leaderboard")} style={{ marginBottom: 36 }}>Full board <Glyph name="upRight" size={14} /></Btn>
        </div>
        <LeaderTable rows={LEADERS.slice(0, 5)} />
      </div>
    </Page>
  );
}

/* flip-style countdown digit */
function FlipDigit({ label, value }) {
  return <div style={{ minWidth: 54, textAlign: "center", padding: "10px 4px", borderRadius: 11, background: "linear-gradient(180deg,rgba(2,6,23,.8),rgba(2,6,23,.5))", border: `1px solid ${C.gold}22`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(0,0,0,.4)" }} />
    <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: C.gold, textShadow: `0 0 12px ${C.gold}55` }}>{String(value).padStart(2, "0")}</div>
    <div style={{ fontSize: 9, color: C.mute2 }}>{label}</div>
  </div>;
}

/* broadcast stat chip with sparkline */
function StatChip({ glyph, label, value, suffix, color, spark }) {
  return (
    <Card hover glowColor={color} style={{ padding: 18, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}22` }}><Glyph name={glyph} size={19} color={color} glow /></div>
        <Momentum points={spark} color={color} w={56} h={26} fill={false} />
      </div>
      <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color }}>{value}{suffix && <span style={{ fontSize: 15, marginLeft: 3 }}>{suffix}</span>}</div>
      <div style={{ fontSize: 11.5, color: C.mute2 }}>{label}</div>
    </Card>
  );
}

/* ---- MARKETS ---- */
function MarketsPage() {
  const { nav, openPredict } = useApp();
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Trending");
  const [q, setQ] = useState("");
  const filters = ["All", "Live", "Upcoming", "Tournament", "Player", "Meme", "Community"];
  let list = MARKETS.filter((m) => (filter === "All" || m.cat === filter || (filter === "Community" && m.cat === "Meme")) && (!q || m.title.toLowerCase().includes(q.toLowerCase())));
  if (sort === "Ending Soon") list = [...list].sort((a, b) => a.closes.length - b.closes.length);
  if (sort === "Highest Volume") list = [...list].sort((a, b) => parseFloat(b.vol) - parseFloat(a.vol));
  return (
    <Page wide>
      <SectionTitle eyebrow="The Arena" title="Prediction Markets" sub="Turn football opinions into on-chain predictions. Live markets, real odds energy, community sentiment — all settled in $GLORY." />
      {/* matchday command center — broadcast control strip */}
      <Reveal>
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", marginBottom: 16, padding: "18px 20px", background: "linear-gradient(120deg,#0a1b2e,#06111f)", border: `1px solid ${C.lineG}` }}>
          <Floodlights color={C.green} opacity={.5} />
          <LedBoard color={C.green} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FD, fontWeight: 800, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.green }}><LivePulse size={7} /> Matchday Control</span>
              <span style={{ fontSize: 12.5, color: C.mute }}>Live tournament feed</span>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              {[["Live now", "3", C.red], ["Today", "8", C.gold], ["Open pools", "128", C.green]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: "right" }}><div style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: c }}>{v}</div><div style={{ fontSize: 10, color: C.mute2, textTransform: "uppercase", letterSpacing: .5 }}>{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      {/* live ticker board strip */}
      <Reveal>
        <Card style={{ padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 16, overflow: "hidden" }}>
          <Pill color={C.red}><LivePulse size={6} /> Live Board</Pill>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 28, whiteSpace: "nowrap", animation: "scrollX 26s linear infinite", width: "max-content" }}>
              {[...MARKETS, ...MARKETS].map((m, i) => <span key={i} style={{ fontSize: 12.5, color: C.mute, display: "inline-flex", alignItems: "center", gap: 7 }}><NationChip code={m.codes[0]} color={m.cc[0]} size={10} /> {m.options[0].label} <b style={{ color: C.green }}>{m.options[0].odds}</b></span>)}
            </div>
          </div>
        </Card>
      </Reveal>
      <div className="g-mkt-bar" style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}><Glyph name="search" size={17} color={C.mute2} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search matches, players, predictions..." style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,.03)", color: C.white, fontSize: 14, fontFamily: FB, outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Trending", "Highest Volume", "Ending Soon"].map((s) => (
            <button key={s} onClick={() => setSort(s)} style={{ padding: "11px 16px", borderRadius: 11, border: `1px solid ${sort === s ? C.gold : C.line}`, background: sort === s ? `${C.gold}12` : "rgba(255,255,255,.03)", color: sort === s ? C.gold : C.mute, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FB, whiteSpace: "nowrap", transition: "all .2s" }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "9px 18px", borderRadius: 99, border: `1px solid ${filter === f ? C.green : C.line}`, background: filter === f ? `${C.green}14` : "transparent", color: filter === f ? C.green : C.mute, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FD, transition: "all .2s", boxShadow: filter === f ? `0 0 16px -4px ${C.green}66` : "none" }}>{f}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: C.mute }}>
          <Glyph name="search" size={40} color={C.mute2} style={{ marginBottom: 16 }} />
          <h3 style={{ fontFamily: FD, fontSize: 20, margin: "0 0 8px" }}>No markets found</h3>
          <p style={{ fontSize: 14 }}>Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="g-cols-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {list.map((m, i) => <Reveal key={m.id} delay={(i % 3) * .06}><MarketCard m={m} onPredict={openPredict} onOpen={(id) => nav(`/markets/${id}`)} /></Reveal>)}
        </div>
      )}
    </Page>
  );
}

/* ---- MARKET DETAIL ---- */
function MarketDetailPage({ id }) {
  const { nav, openPredict } = useApp();
  const m = MARKETS.find((x) => x.id === id);
  if (!m) return <Page><EmptyState title="Market not found" sub="This market may have settled or never existed." cta={["Browse markets", "/markets"]} /></Page>;
  return (
    <Page wide>
      <button onClick={() => nav("/markets")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.mute, cursor: "pointer", fontSize: 13.5, fontFamily: FB, marginBottom: 18 }}><Glyph name="arrowL" size={16} /> All markets</button>
      <Reveal>
        <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", padding: "clamp(26px,4vw,44px)", marginBottom: 24, background: "linear-gradient(135deg,#0a1b2e,#06111f)", border: `1px solid ${C.lineG}` }}>
          <Floodlights color={C.gold} opacity={.6} />
          <CrowdStands height={80} dim={.4} />
          <div className="g-hide-sm" style={{ position: "absolute", right: "2%", bottom: -8, opacity: .42, zIndex: 0, pointerEvents: "none", maskImage: "linear-gradient(180deg,black,transparent 92%)" }}><HeroAthlete pose="celebrate" glow={C.gold} jersey={m.cc[0]} size={210} /></div>
          <LedBoard color={C.green} />
          <div style={{ position: "absolute", inset: 0, opacity: .25, backgroundImage: `linear-gradient(${C.green}10 1px,transparent 1px),linear-gradient(90deg,${C.green}10 1px,transparent 1px)`, backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse at 50% 0%,black,transparent 75%)" }} />
          <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: `linear-gradient(90deg,transparent,${C.gold}08,transparent)`, transform: "rotate(20deg)", animation: "sweep 9s ease-in-out infinite" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}><Pill>{m.tag}</Pill>{m.hot && <Pill color={C.red}><LivePulse size={5} /> Hot</Pill>}<span style={{ fontSize: 12.5, color: C.mute, display: "flex", alignItems: "center", gap: 5 }}><Glyph name="clock" size={13} /> Closes in {m.closes}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10 }}>{m.codes.map((cd, i) => <NationChip key={i} code={cd} color={m.cc[i]} size={24} />)}</div>
              <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(26px,3.6vw,40px)", margin: 0, lineHeight: 1.1 }}>{m.title}</h1>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="g-detail-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* probabilities with rings */}
          <Reveal>
            <Card style={{ padding: 24 }}>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: "0 0 18px" }}>Win Probabilities</h3>
              <div style={{ display: "flex", gap: 20, marginBottom: 22, flexWrap: "wrap", justifyContent: "center" }}>
                {m.options.map((o, i) => <div key={i} style={{ textAlign: "center" }}><ConfidenceRing value={o.pct} size={76} color={[C.green, C.blue, C.gold][i % 3]} /><div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 8 }}>{o.label}</div><div style={{ fontSize: 11, color: C.mute2 }}>{o.odds}</div></div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, paddingTop: 20, borderTop: `1px solid ${C.line}` }}>
                {[["Liquidity", m.pool], ["Total Volume", m.vol], ["Confidence", `${m.sentiment}%`]].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize: 11, color: C.mute2, marginBottom: 4 }}>{l}</div><div style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: C.gold }}>{v}</div></div>
                ))}
              </div>
            </Card>
          </Reveal>
          {/* analytics: momentum + radar */}
          <Reveal delay={.05}>
            <Card style={{ padding: 24 }}>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: "0 0 18px" }}>Market Analytics</h3>
              <div className="g-detail-an" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: C.mute2, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Volume & sentiment flow</div>
                  <Momentum points={[40, 55, 48, 70, 62, 85, 78, 92, 80, 96, 88, 100]} color={C.green} w={320} h={90} />
                  <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 12, color: C.mute }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: C.green }} />Volume</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Glyph name="trend" size={13} color={C.green} /> Up {m.sentiment}%</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <SentimentRadar size={170} color={C.gold} axes={[{ l: "Volume", v: 82 }, { l: "Heat", v: m.sentiment }, { l: "Whales", v: 64 }, { l: "Retail", v: 73 }, { l: "Trend", v: 88 }]} />
                </div>
              </div>
            </Card>
          </Reveal>
          {/* community feed */}
          <Reveal delay={.1}>
            <Card style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Glyph name="message" size={18} color={C.blue} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: 0 }}>Community Activity</h3></div>
              {FEED.slice(0, 5).map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? `1px solid ${C.line}` : "none", fontSize: 13.5 }}>
                  <span><b style={{ color: C.white }}>{f.u}</b> <span style={{ color: C.mute }}>{f.a}</span> <b style={{ color: C.gold }}>{f.v}</b></span>
                  <span style={{ color: C.mute2, fontSize: 11.5 }}>{f.t}</span>
                </div>
              ))}
            </Card>
          </Reveal>
          {/* rules */}
          <Reveal delay={.12}>
            <Card style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Glyph name="shield" size={18} color={C.mute} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: 0 }}>Rules & Settlement</h3></div>
              <p style={{ fontSize: 14, color: C.mute, lineHeight: 1.65, margin: 0 }}>This market resolves based on the official final result once the event concludes. Settlement is triggered via the GLORY oracle within 30 minutes of confirmation. Winning predictions are paid out in $GLORY proportional to pool share and locked odds. In the event of postponement, predictions roll over to the rescheduled fixture.</p>
            </Card>
          </Reveal>
        </div>
        <div>
          <div style={{ position: "sticky", top: 90 }}>
            <Reveal delay={.05}>
              <Card style={{ padding: 24, border: `1px solid ${C.gold}33` }} glowColor={C.gold}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: "0 0 4px" }}>Place Your Prediction</h3>
                <p style={{ fontSize: 13, color: C.mute, margin: "0 0 18px" }}>Back your outcome before the market closes.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
                  {m.options.map((o, i) => {
                    const oc = [C.green, C.blue, C.gold][i % 3];
                    return <div key={i} style={{ position: "relative", overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 15px", borderRadius: 11, border: `1px solid ${C.line}`, background: "rgba(255,255,255,.02)" }}>
                      <div style={{ position: "absolute", inset: 0, width: `${o.pct}%`, background: `${oc}12` }} />
                      <span style={{ fontSize: 14, fontWeight: 600, position: "relative" }}>{o.label}</span><span style={{ color: oc, fontWeight: 800, fontFamily: FD, position: "relative" }}>{o.odds}</span>
                    </div>;
                  })}
                </div>
                <Btn size="lg" style={{ width: "100%" }} onClick={() => openPredict(m)}><Glyph name="bolt" size={17} /> Predict with $GLORY</Btn>
                <p style={{ fontSize: 11, color: C.mute2, textAlign: "center", marginTop: 12 }}>Settled on-chain · Launching on Hyperliquid</p>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ---- TOURNAMENT ---- */
function TournamentPage() {
  const { nav, openPredict } = useApp();
  const cd = useCountdown(new Date("2026-06-11T16:00:00Z").getTime());
  return (
    <Page wide>
      <Reveal>
        <div style={{ position: "relative", borderRadius: 26, overflow: "hidden", padding: "clamp(32px,5vw,64px)", marginBottom: 36, background: "linear-gradient(135deg,#0a1b2e,#041019)", border: `1px solid ${C.gold}22`, textAlign: "center" }}>
          <StadiumScene accent={C.gold} smoke scarves rain players={<>
            <div className="g-hide-sm" style={{ position: "absolute", left: "1%", bottom: 0, pointerEvents: "none", opacity: .9 }}><HeroAthlete pose="keeper" glow={C.blue} jersey={C.blue} size={250} /></div>
            <div className="g-hide-sm" style={{ position: "absolute", right: "1%", bottom: 0, pointerEvents: "none", opacity: .95 }}><HeroAthlete pose="lift" glow={C.gold} jersey={C.gold} size={290} /></div>
          </>} />
          <div style={{ position: "absolute", inset: 0, opacity: .3, backgroundImage: `radial-gradient(circle at 50% 120%,${C.gold}22,transparent 60%)` }} />
          {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", top: "-20%", left: `${10 + i * 16}%`, width: 2, height: "140%", background: `linear-gradient(180deg,transparent,${C.green}33,transparent)`, animation: `flood ${4 + i}s ease-in-out infinite ${i * .5}s` }} />)}
          <div style={{ position: "relative" }}>
            <Pill color={C.gold}><Glyph name="trophy" size={12} color={C.gold} /> Glory Cup · 2026 Cycle</Pill>
            <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(36px,6vw,68px)", margin: "16px 0 12px", letterSpacing: "-1px" }}>The Road to Glory</h1>
            <p style={{ fontSize: 17, color: C.mute, maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.55 }}>Fill your bracket, race the Golden Boot, and battle nation vs nation. The biggest prediction stage on earth.</p>
            <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
              {[["DAYS", cd.d], ["HRS", cd.h], ["MIN", cd.m], ["SEC", cd.s]].map(([l, v]) => <FlipDigit key={l} label={l} value={v} />)}
            </div>
          </div>
        </div>
      </Reveal>

      <SectionTitle eyebrow="Interactive Bracket" title="Predict the road to the Final" sub="Tap a team to advance them. Build your full knockout prediction and compare with the community." color={C.gold} />
      <Bracket />

      <div className="g-tourn-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 48 }}>
        <Reveal>
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}><Glyph name="goal" size={20} color={C.gold} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: 0 }}>Golden Boot Race</h3></div>
            {BOOT.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < BOOT.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <span style={{ width: 24, height: 24, borderRadius: 7, background: i === 0 ? C.gold : "rgba(255,255,255,.06)", color: i === 0 ? C.black : C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: FD, boxShadow: i === 0 ? `0 0 12px ${C.gold}66` : "none" }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{b.p}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.green, fontFamily: FD, fontWeight: 800 }}><Glyph name="ball" size={13} color={C.green} />{b.g}</span>
                <span style={{ fontSize: 12, color: C.gold, fontFamily: FD, fontWeight: 700, width: 38, textAlign: "right" }}>{b.odds}</span>
              </div>
            ))}
          </Card>
        </Reveal>
        <Reveal delay={.05}>
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}><Glyph name="bars" size={20} color={C.blue} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: 0 }}>Group C Tracker</h3></div>
            <div style={{ fontSize: 11.5, color: C.mute2, display: "grid", gridTemplateColumns: "1.6fr .5fr .6fr .8fr", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${C.line}`, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}><span>Team</span><span>Pts</span><span>GD</span><span>Qual%</span></div>
            {[["ARG", C.blue, "Seed A", 9, "+6", 94], ["ESP", C.red, "Seed B", 6, "+2", 71], ["NED", C.gold, "Seed C", 3, "-1", 28], ["CRO", C.red, "Seed D", 0, "-7", 7]].map(([code, col, t, p, gd, q], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr .5fr .6fr .8fr", gap: 8, padding: "11px 0", borderBottom: i < 3 ? `1px solid ${C.line}` : "none", fontSize: 13.5, alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}><NationChip code={code} color={col} size={11} /> <span style={{ color: C.mute }}>{t}</span></span><span style={{ fontFamily: FD, fontWeight: 800 }}>{p}</span><span style={{ color: C.mute }}>{gd}</span><span style={{ color: q > 50 ? C.green : C.mute, fontWeight: 700 }}>{q}%</span>
              </div>
            ))}
          </Card>
        </Reveal>
      </div>

      <div style={{ marginTop: 44 }}>
        <SectionTitle eyebrow="Nation vs Nation" title="Fan Wars" sub="Pick your army and battle for community supremacy. Volume drives the heat." color={C.blue} />
        <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {NATIONS.map((n, i) => (
            <Reveal key={n.n} delay={(i % 4) * .05}>
              <Card hover glowColor={n.c} style={{ padding: 20, textAlign: "center", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><NationChip code={n.code} color={n.c} size={22} /></div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{n.n}</div>
                <LiquidityBar pct={n.heat} color={n.heat > 75 ? C.red : C.gold} h={6} />
                <div style={{ fontSize: 11.5, color: C.mute, marginTop: 8 }}>Heat <b style={{ color: C.gold }}>{n.heat}</b></div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 44 }}>
        <SectionTitle eyebrow="Daily Match Center" title="Today's fixtures" color={C.green} />
        <div className="g-cols-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {MARKETS.filter((m) => m.cat === "Live").map((m, i) => <Reveal key={m.id} delay={(i % 3) * .06}><MarketCard m={m} onPredict={openPredict} onOpen={(id) => nav(`/markets/${id}`)} /></Reveal>)}
        </div>
      </div>
    </Page>
  );
}

function Bracket() {
  const [picks, setPicks] = useState({});
  const r16 = [[["ARG", C.blue], ["NED", C.gold]], [["BRA", C.gold], ["CRO", C.red]], [["FRA", C.blue], ["POR", C.green]], [["ESP", C.red], ["GER", C.gold]]];
  const pick = (round, idx, team) => setPicks((p) => ({ ...p, [`${round}-${idx}`]: team }));
  const Match = ({ round, idx, teams }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {teams.map((t, i) => {
        const code = Array.isArray(t) ? t[0] : t; const col = Array.isArray(t) ? t[1] : C.mute;
        const sel = picks[`${round}-${idx}`] === code;
        return <button key={i} onClick={() => code !== "—" && pick(round, idx, code)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 9, border: `1px solid ${sel ? C.gold : C.line}`, background: sel ? `${C.gold}1a` : "rgba(255,255,255,.02)", color: sel ? C.gold : C.white, cursor: code === "—" ? "default" : "pointer", fontSize: 13, fontWeight: 700, fontFamily: FB, textAlign: "left", minWidth: 124, transition: "all .2s", boxShadow: sel ? `0 0 16px -6px ${C.gold}` : "none" }}>{code !== "—" && <NationChip code={code} color={col} size={11} />}{code === "—" && <span style={{ color: C.mute2 }}>—</span>}</button>;
      })}
    </div>
  );
  const winner = (round, idx) => picks[`${round}-${idx}`] || "—";
  const cFor = (code) => { const all = r16.flat(); const f = all.find((t) => t[0] === code); return f ? f[1] : C.gold; };
  const qf = [[[winner("r16", 0), cFor(winner("r16", 0))], [winner("r16", 1), cFor(winner("r16", 1))]], [[winner("r16", 2), cFor(winner("r16", 2))], [winner("r16", 3), cFor(winner("r16", 3))]]];
  const sf = [[[winner("qf", 0), cFor(winner("qf", 0))], [winner("qf", 1), cFor(winner("qf", 1))]]];
  return (
    <Reveal>
      <Card style={{ padding: "28px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 28, minWidth: 760, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}><BLabel>Round of 16</BLabel>{r16.map((t, i) => <Match key={i} round="r16" idx={i} teams={t} />)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 60 }}><BLabel>Quarter-Finals</BLabel>{qf.map((t, i) => <Match key={i} round="qf" idx={i} teams={t} />)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}><BLabel>Semi-Finals</BLabel>{sf.map((t, i) => <Match key={i} round="sf" idx={i} teams={t} />)}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <BLabel>Champion</BLabel>
            <div style={{ padding: "20px 22px", borderRadius: 14, background: `linear-gradient(160deg,${C.gold}22,transparent)`, border: `1.5px solid ${C.gold}55`, textAlign: "center", minWidth: 130, boxShadow: `0 0 30px -10px ${C.gold}66` }}>
              <Glyph name="trophy" size={30} color={C.gold} glow style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: C.gold, display: "flex", justifyContent: "center" }}>{winner("sf", 0) !== "—" ? <NationChip code={winner("sf", 0)} color={cFor(winner("sf", 0))} size={16} /> : "—"}</div>
              <div style={{ fontSize: 10.5, color: C.mute2, marginTop: 6 }}>Your pick</div>
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
const BLabel = ({ children }) => <div style={{ fontSize: 10.5, letterSpacing: 1.2, textTransform: "uppercase", color: C.mute2, fontWeight: 700, fontFamily: FD, marginBottom: 4 }}>{children}</div>;

/* ---- LEADERBOARD ---- */
function LeaderTable({ rows }) {
  return (
    <Card style={{ padding: "6px 8px", overflow: "hidden" }}>
      <div className="g-lb-head" style={{ display: "grid", gridTemplateColumns: "50px 1.6fr .9fr .8fr .8fr .7fr", gap: 8, padding: "14px 16px", fontSize: 11, color: C.mute2, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, borderBottom: `1px solid ${C.line}` }}>
        <span>#</span><span>Predictor</span><span>Win Rate</span><span>Wins</span><span>$GLORY</span><span>Streak</span>
      </div>
      {rows.map((p) => (
        <div key={p.r} className="g-lb-row" style={{ display: "grid", gridTemplateColumns: "50px 1.6fr .9fr .8fr .8fr .7fr", gap: 8, padding: "13px 16px", alignItems: "center", borderBottom: `1px solid ${C.line}`, fontSize: 14, transition: "background .2s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.02)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <span style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, background: p.r <= 3 ? C.gold : "rgba(255,255,255,.06)", color: p.r <= 3 ? C.black : C.white, fontFamily: FD, boxShadow: p.r <= 3 ? `0 0 12px ${C.gold}55` : "none" }}>{p.r}</span>
          <span style={{ fontWeight: 700 }}>{p.u}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 40 }}><LiquidityBar pct={p.wr} color={C.green} h={5} glow={false} /></div><b style={{ color: C.green, fontFamily: FD }}>{p.wr}%</b></span>
          <span style={{ color: C.mute }}>{p.w}</span>
          <span style={{ color: C.gold, fontFamily: FD, fontWeight: 700 }}>{p.g}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: p.streak >= 5 ? C.red : C.mute }}>{p.streak >= 5 && <Glyph name="flame" size={13} color={C.red} />}{p.streak}</span>
        </div>
      ))}
    </Card>
  );
}
function LeaderboardPage() {
  const [tab, setTab] = useState("All-Time");
  return (
    <Page>
      <SectionTitle eyebrow="Hall of Glory" title="Leaderboard" sub="The sharpest predictors in the arena. Climb the ranks, build your streak, claim your Glory." color={C.gold} />
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["All-Time", "This Season", "This Week", "Tournament"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 18px", borderRadius: 99, border: `1px solid ${tab === t ? C.gold : C.line}`, background: tab === t ? `${C.gold}12` : "transparent", color: tab === t ? C.gold : C.mute, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FD, transition: "all .2s" }}>{t}</button>
        ))}
      </div>
      <div className="g-cols-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {[LEADERS[1], LEADERS[0], LEADERS[2]].map((p, i) => {
          const isFirst = p.r === 1;
          return <Reveal key={p.u} delay={i * .06}>
            <Card glowColor={C.gold} style={{ padding: 24, textAlign: "center", border: isFirst ? `1.5px solid ${C.gold}55` : `1px solid ${C.line}`, transform: isFirst ? "scale(1.04)" : "none", background: isFirst ? `linear-gradient(160deg,${C.gold}14,rgba(6,17,31,.9))` : undefined }}>
              <div style={{ marginBottom: 8 }}><Glyph name={p.r === 1 ? "crown" : "award"} size={26} color={p.r === 1 ? C.gold : p.r === 2 ? "#cbd5e1" : "#b45309"} glow={p.r === 1} /></div>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg,${C.green},${C.blue})`, margin: "0 auto 10px", boxShadow: `0 0 14px ${C.green}44` }} />
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 16 }}>{p.u}</div>
              <div style={{ fontSize: 12, color: C.mute, margin: "4px 0 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{p.wr}% win rate · {p.streak}<Glyph name="flame" size={11} color={C.red} /></div>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: C.gold }}>{p.g}</div>
              <div style={{ fontSize: 11, color: C.mute2 }}>$GLORY earned</div>
            </Card>
          </Reveal>;
        })}
      </div>
      <LeaderTable rows={LEADERS} />
    </Page>
  );
}

/* ---- HOW IT WORKS ---- */
function HowItWorksPage() {
  const steps = [
    { n: "01", g: "wallet", t: "Get $GLORY", d: "Buy or earn $GLORY and connect your wallet to enter the arena." },
    { n: "02", g: "target", t: "Pick a Market", d: "Choose from match, player, tournament, or community-created predictions." },
    { n: "03", g: "bolt", t: "Predict With $GLORY", d: "Back your outcome with $GLORY before the market closes." },
    { n: "04", g: "crown", t: "Claim Glory", d: "If your prediction wins, claim rewards and climb the leaderboard." },
  ];
  return (
    <Page>
      <Reveal>
        <div style={{ textAlign: "center", padding: "20px 0 50px" }}>
          <Pill color={C.green}>How It Works</Pill>
          <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(34px,5vw,56px)", margin: "16px 0 14px", letterSpacing: "-1px" }}>GLORY in <span style={{ color: C.gold }}>10 seconds</span></h1>
          <p style={{ fontSize: 17, color: C.mute, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>One token. Football prediction markets. Back your belief with $GLORY. Win, climb, repeat.</p>
        </div>
      </Reveal>
      <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 56, position: "relative" }}>
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * .08}>
            <Card hover style={{ padding: 26, height: "100%", position: "relative" }}>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 38, color: `${C.gold}33`, lineHeight: 1 }}>{s.n}</div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${C.gold}14`, border: `1px solid ${C.gold}22`, display: "flex", alignItems: "center", justifyContent: "center", margin: "14px 0" }}><Glyph name={s.g} size={22} color={C.gold} glow /></div>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: C.mute, margin: 0 }}>{s.d}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <SectionTitle eyebrow="Why One Token Matters" title="One token beats a hundred" />
      <div className="g-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 56 }}>
        <Reveal>
          <Card style={{ padding: 28, border: `1px solid ${C.red}33` }}>
            <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, margin: "0 0 16px", color: C.red }}>Other football meme projects</h3>
            {["Too many team & player tokens", "Fragmented liquidity everywhere", "Confusing onboarding", "Dead markets after one match", "Diluted community energy"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", fontSize: 14, color: C.mute }}><Glyph name="cross" size={16} color={C.red} />{t}</div>
            ))}
          </Card>
        </Reveal>
        <Reveal delay={.06}>
          <Card style={{ padding: 28, border: `1px solid ${C.green}44`, background: `linear-gradient(160deg,${C.green}0d,rgba(6,17,31,.9))` }}>
            <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, margin: "0 0 16px", color: C.green }}>GLORY</h3>
            {["One token — $GLORY — for everything", "Unified, deep liquidity", "Effortless onboarding", "Every market funnels into one ecosystem", "All community energy in one arena"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", fontSize: 14 }}><Glyph name="check" size={16} color={C.green} />{t}</div>
            ))}
          </Card>
        </Reveal>
      </div>
      <SectionTitle eyebrow="How Rewards Work" title="Win and climb" />
      <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
        {[["trophy", "Winning Predictions", "Correct calls pay out in $GLORY at locked odds."], ["crown", "Leaderboards", "Climb seasonal ranks and earn status."], ["flame", "Seasonal Campaigns", "Glory Cup events with major reward pools."], ["users", "Community Rewards", "Create markets and earn creator rewards."]].map(([g, t, d], i) => (
          <Reveal key={i} delay={i * .06}><Card hover style={{ padding: 22, height: "100%" }}><div style={{ marginBottom: 12 }}><Glyph name={g} size={24} color={C.gold} glow /></div><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, margin: "0 0 8px" }}>{t}</h3><p style={{ fontSize: 13.5, color: C.mute, lineHeight: 1.55, margin: 0 }}>{d}</p></Card></Reveal>
        ))}
      </div>
      <RiskBox />
    </Page>
  );
}

/* ---- ROADMAP ---- */
function RoadmapPage() {
  return (
    <Page>
      <SectionTitle eyebrow="The Journey" title="Road to Final Glory" sub="From kickoff to championship. Each phase unlocks the next stage of the arena." color={C.gold} />
      <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
        <div className="g-rm-line" style={{ position: "absolute", left: 27, top: 30, bottom: 30, width: 2, background: `linear-gradient(180deg,${C.gold},${C.line})` }} />
        {ROADMAP.map((ph, i) => {
          const live = ph.state === "live", next = ph.state === "next", locked = ph.state === "locked";
          return (
            <Reveal key={i} delay={i * .07}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: live ? C.gold : next ? `${C.green}1a` : "rgba(255,255,255,.04)", border: `2px solid ${live ? C.gold : next ? C.green : C.line}`, color: live ? C.black : next ? C.green : C.mute2, zIndex: 2, boxShadow: live ? `0 0 24px ${C.gold}66` : "none" }}>
                  {locked ? <Glyph name="shield" size={22} color={C.mute2} /> : <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18 }}>{i + 1}</span>}
                </div>
                <Card style={{ padding: 24, flex: 1, border: live ? `1.5px solid ${C.gold}55` : `1px solid ${C.line}`, background: live ? `linear-gradient(160deg,${C.gold}12,rgba(6,17,31,.9))` : undefined, opacity: locked ? .7 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: live ? C.gold : C.mute2, letterSpacing: 1, textTransform: "uppercase" }}>{ph.p}</span>
                    {live && <Pill color={C.green}><LivePulse size={5} /> Live</Pill>}{next && <Pill color={C.blue}>Up Next</Pill>}{locked && <Pill color={C.mute2} bg="rgba(255,255,255,.05)">Locked</Pill>}
                  </div>
                  <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, margin: "0 0 14px" }}>{ph.n}</h3>
                  <div className="g-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {ph.items.map((it, j) => <div key={j} style={{ fontSize: 13.5, color: C.mute, display: "flex", gap: 8, alignItems: "center" }}><Glyph name="chevR" size={14} color={live ? C.gold : C.green} />{it}</div>)}
                  </div>
                </Card>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Page>
  );
}

/* ---- TOKENOMICS ---- */
function TokenomicsPage() {
  const utilities = ["Access prediction markets", "Enter special tournament pools", "Create community markets", "Climb seasonal leaderboards", "Unlock badges & fan status", "Participate in community votes", "Earn rewards from wins", "Join limited-time match events"];
  return (
    <Page>
      <SectionTitle eyebrow="Tokenomics" title="One token. Clean supply." sub="$GLORY is the only token in the ecosystem — community-first, unified liquidity." color={C.gold} />
      <div className="g-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 36, alignItems: "center", marginBottom: 56 }}>
        <Reveal>
          <Card style={{ padding: 32, textAlign: "center" }}>
            <DonutChart />
            <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 30, color: C.gold, marginTop: 18 }}>1,000,000,000</div>
            <div style={{ fontSize: 13.5, color: C.mute }}>Total Supply $GLORY</div>
          </Card>
        </Reveal>
        <Reveal delay={.06}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {TOKENOMICS.map((t, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, marginBottom: 6 }}><span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: t.c, boxShadow: `0 0 6px ${t.c}88` }} />{t.l}</span><span style={{ color: t.c, fontFamily: FD, fontWeight: 800 }}>{t.v}%</span></div>
                <LiquidityBar pct={t.v * 3.5 > 100 ? 100 : t.v * 3.5} color={t.c} h={8} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <SectionTitle eyebrow="Why $GLORY Exists" title="The only token you need" color={C.green} />
      <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 40 }}>
        {utilities.map((u, i) => (
          <Reveal key={i} delay={(i % 4) * .05}><Card hover style={{ padding: "18px 16px", display: "flex", alignItems: "center", gap: 11, height: "100%" }}><Glyph name="shield" size={17} color={C.green} /><span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4 }}>{u}</span></Card></Reveal>
        ))}
      </div>
      <p style={{ fontSize: 13, color: C.mute2, fontStyle: "italic", textAlign: "center" }}>Final tokenomics subject to official launch announcement.</p>
    </Page>
  );
}
function DonutChart() {
  let acc = 0; const R = 70, cx = 90, cy = 90, sw = 26;
  const segs = TOKENOMICS.map((t) => { const start = acc; acc += t.v; const len = (t.v / 100) * 2 * Math.PI; const sa = (start / 100) * 2 * Math.PI - Math.PI / 2; const ea = sa + len; const x1 = cx + R * Math.cos(sa), y1 = cy + R * Math.sin(sa), x2 = cx + R * Math.cos(ea), y2 = cy + R * Math.sin(ea); return { d: `M ${x1} ${y1} A ${R} ${R} 0 ${len > Math.PI ? 1 : 0} 1 ${x2} ${y2}`, c: t.c }; });
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" style={{ margin: "0 auto", display: "block" }}>
      {segs.map((s, i) => <path key={i} d={s.d} fill="none" stroke={s.c} strokeWidth={sw} strokeLinecap="butt" style={{ filter: `drop-shadow(0 0 3px ${s.c}66)` }} />)}
      <text x="90" y="84" textAnchor="middle" fill={C.gold} fontFamily="Sora" fontWeight="800" fontSize="26">1B</text>
      <text x="90" y="104" textAnchor="middle" fill={C.mute} fontFamily="Manrope" fontSize="11">$GLORY</text>
    </svg>
  );
}

/* ---- BUY ---- */
function BuyPage() {
  const { connected, connect, balance } = useApp();
  const [amt, setAmt] = useState("");
  const rate = 18500;
  return (
    <Page>
      <SectionTitle eyebrow="Get In The Game" title="Buy $GLORY" sub="The single token powering every prediction. Launching on Hyperliquid — built for high-speed on-chain football prediction culture." color={C.gold} />
      <div className="g-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "flex-start" }}>
        <Reveal>
          <Card style={{ padding: 28, border: `1px solid ${C.gold}33` }} glowColor={C.gold}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12.5, color: C.mute }}>You pay</span>{connected && <span style={{ fontSize: 12, color: C.mute2 }}>Balance: {balance.toLocaleString()}</span>}</div>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <input value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.0" inputMode="decimal" style={{ width: "100%", padding: "16px 80px 16px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,.03)", color: C.white, fontSize: 24, fontFamily: FD, fontWeight: 800, outline: "none" }} />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 6, color: C.white, fontWeight: 700, fontFamily: FD }}><span style={{ width: 8, height: 8, borderRadius: 99, background: C.green }} /> USDC</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", margin: "-4px 0 10px" }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.05)", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph name="downUp" size={16} color={C.green} /></div></div>
            <div style={{ fontSize: 12.5, color: C.mute, marginBottom: 6 }}>You receive (est.)</div>
            <div style={{ padding: "16px", borderRadius: 12, border: `1px solid ${C.gold}33`, background: `${C.gold}0a`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 24, fontFamily: FD, fontWeight: 800, color: C.gold }}>{amt ? (parseFloat(amt) * rate).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}</span>
              <span style={{ fontWeight: 800, fontFamily: FD, display: "flex", alignItems: "center", gap: 6 }}><Glyph name="coin" size={16} color={C.gold} /> $GLORY</span>
            </div>
            {connected ? <Btn size="lg" style={{ width: "100%" }}><Glyph name="swap" size={17} /> Swap to $GLORY</Btn> : <Btn variant="solidGreen" size="lg" style={{ width: "100%" }} onClick={connect}><Glyph name="wallet" size={17} /> Connect Wallet</Btn>}
            <p style={{ fontSize: 11, color: C.mute2, textAlign: "center", marginTop: 12 }}>Demo rate · 1 USDC ≈ {rate.toLocaleString()} $GLORY</p>
          </Card>
        </Reveal>
        <Reveal delay={.06}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, margin: "0 0 14px" }}>How to buy</h3>
              {["Connect a Hyperliquid-compatible wallet", "Swap USDC for $GLORY", "Head to the Arena and start predicting"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 0" }}><span style={{ width: 24, height: 24, borderRadius: 7, background: `${C.gold}1a`, color: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: FD, flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 13.5 }}>{s}</span></div>
              ))}
            </Card>
            <Card style={{ padding: 24 }}>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, margin: "0 0 8px" }}>Contract</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,.03)", border: `1px solid ${C.line}` }}>
                <span style={{ fontSize: 12.5, fontFamily: "monospace", color: C.mute }}>0xGLORY…coming soon</span>
                <span style={{ cursor: "pointer" }}><Glyph name="copy" size={15} color={C.gold} /></span>
              </div>
              <p style={{ fontSize: 11.5, color: C.mute2, marginTop: 12, lineHeight: 1.5 }}>Always verify the official contract address from GLORY's verified channels before trading. Beware of imitations.</p>
            </Card>
          </div>
        </Reveal>
      </div>
      <div style={{ marginTop: 32 }}><RiskBox /></div>
    </Page>
  );
}

/* ---- COMMUNITY ---- */
function CommunityPage() {
  const items = [["flame", "Meme Raids", "Coordinate timeline takeovers around big fixtures."], ["target", "Prediction Battles", "Squad vs squad prediction contests."], ["users", "Fan Armies", "Rally behind your nation and climb the heat board."], ["message", "Daily Match Threads", "Live discussion for every fixture."], ["spark", "Community Markets", "Create your own prediction markets."], ["star", "Creator Rewards", "Earn $GLORY for popular markets."], ["crown", "Ambassador Program", "Lead a region, unlock perks."], ["trophy", "Glory Squads", "Form a crew and compete together."]];
  return (
    <Page>
      <Reveal>
        <div style={{ textAlign: "center", padding: "20px 0 44px" }}>
          <Pill color={C.green}>Community</Pill>
          <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(32px,5vw,54px)", margin: "16px 0 14px", letterSpacing: "-1px" }}>Football is tribal.<br />Crypto is tribal.<br /><span style={{ color: C.green }}>GLORY unites both.</span></h1>
          <p style={{ fontSize: 16.5, color: C.mute, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>Two of the most passionate communities on earth, in one global arena. Pick your army and battle for prediction supremacy.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <Btn variant="solidGreen"><Glyph name="twitter" size={16} /> Join on X</Btn>
            <Btn variant="ghost"><Glyph name="message" size={16} /> Telegram</Btn>
            <Btn variant="ghost"><Glyph name="hash" size={16} /> Discord</Btn>
          </div>
        </div>
      </Reveal>
      <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {items.map(([g, t, d], i) => (
          <Reveal key={i} delay={(i % 4) * .05}><Card hover style={{ padding: 22, height: "100%", cursor: "pointer" }}><div style={{ marginBottom: 12 }}><Glyph name={g} size={24} color={C.gold} glow /></div><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, margin: "0 0 8px" }}>{t}</h3><p style={{ fontSize: 13.5, color: C.mute, lineHeight: 1.55, margin: 0 }}>{d}</p></Card></Reveal>
        ))}
      </div>
    </Page>
  );
}

/* ---- DOCS / LEGAL ---- */
function DocsPage() {
  const sections = [["What is GLORY?", "GLORY is a single-token football prediction meme coin. There is only one token — $GLORY — powering every prediction market, leaderboard, and community feature."], ["The Single-Token Model", "No team tokens, no player tokens, no fragmented liquidity. All engagement flows through $GLORY, keeping liquidity deep and the community unified."], ["Prediction Markets", "Markets cover match winners, over/under, first scorer, golden boot, finalists, discipline events, and community-created meme markets. Each settles on-chain at locked odds."], ["Settlement & Oracles", "Markets resolve from official final results via the GLORY oracle, typically within 30 minutes of confirmation. Postponed fixtures roll predictions to the rescheduled match."], ["Chain", "GLORY is launching on Hyperliquid, built for high-speed on-chain football prediction culture. Additional chains may be supported in future."], ["Rewards", "Winning predictions pay out in $GLORY proportional to pool share and locked odds. Seasonal leaderboards and Glory Cup campaigns add extra reward pools."]];
  return (
    <Page>
      <SectionTitle eyebrow="Documentation" title="GLORY Docs" sub="Everything you need to understand the single-token football prediction arena." color={C.blue} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map(([t, d], i) => (
          <Reveal key={i} delay={i * .04}>
            <Card hover style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><Glyph name="book" size={18} color={C.blue} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: 0 }}>{t}</h3></div>
              <p style={{ fontSize: 14.5, color: C.mute, lineHeight: 1.65, margin: 0 }}>{d}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Page>
  );
}
function LegalPage() {
  return (
    <Page>
      <SectionTitle eyebrow="Legal" title="Terms, Privacy & Risk" color={C.red} />
      <RiskBox big />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
        {[["Terms of Use", "By accessing GLORY you agree to use the platform lawfully and at your own risk. GLORY provides prediction-based entertainment and makes no guarantee of returns."], ["Privacy", "GLORY interacts with public blockchain data. Wallet addresses are pseudonymous. We do not custody funds. Review connected-wallet permissions before signing."], ["Eligibility", "You are responsible for ensuring prediction markets are permitted in your jurisdiction. Access may be restricted where prohibited by law."]].map(([t, d], i) => (
          <Card key={i} style={{ padding: 24 }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><Glyph name="scale" size={18} color={C.mute} /><h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, margin: 0 }}>{t}</h3></div><p style={{ fontSize: 14, color: C.mute, lineHeight: 1.65, margin: 0 }}>{d}</p></Card>
        ))}
      </div>
    </Page>
  );
}
function RiskBox({ big }) {
  return (
    <Reveal>
      <div style={{ padding: big ? 28 : 22, borderRadius: 16, background: `${C.red}0c`, border: `1px solid ${C.red}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: C.red, fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", fontFamily: FD }}><Glyph name="shield" size={16} color={C.red} /> Risk & Legal Disclaimer</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: C.mute, margin: 0 }}>GLORY is an independent meme token and prediction-based entertainment product. It is <b style={{ color: C.white }}>not affiliated with, endorsed by, or sponsored by FIFA, UEFA, any football governing body, national team, club, league, or player.</b> $GLORY is a high-risk crypto asset. Prediction markets may be restricted in some jurisdictions. Users are responsible for following local laws.</p>
      </div>
    </Reveal>
  );
}

/* ---- PROFILE ---- */
function ProfilePage({ addr }) {
  const { connected, predictions, balance, connect, nav } = useApp();
  if (!connected) return <Page><EmptyState title="Connect your wallet" sub="Connect to view your prediction history, rewards, and Glory rank." cta={null}><Btn variant="solidGreen" onClick={connect} style={{ marginTop: 16 }}><Glyph name="wallet" size={16} /> Connect Wallet</Btn></EmptyState></Page>;
  const badges = ["First Prediction", "Group Stage Survivor", "Meme Market Maker", "5-Win Streak"];
  return (
    <Page>
      <Reveal>
        <Card style={{ padding: 28, marginBottom: 24, display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${C.green},${C.blue})`, flexShrink: 0, boxShadow: `0 0 18px ${C.green}44` }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, margin: "0 0 4px" }}>{addr?.slice(0, 6)}…{addr?.slice(-4)}</h1>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: C.mute, flexWrap: "wrap" }}><span>Rank <b style={{ color: C.gold }}>#42</b></span><span>Win rate <b style={{ color: C.green }}>67%</b></span><span style={{ display: "flex", alignItems: "center", gap: 4 }}>Streak <b style={{ color: C.red }}>4</b><Glyph name="flame" size={12} color={C.red} /></span></div>
          </div>
          <div style={{ textAlign: "right" }}><div style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: C.gold }}>{balance.toLocaleString()}</div><div style={{ fontSize: 12, color: C.mute2 }}>$GLORY balance</div></div>
        </Card>
      </Reveal>
      <div className="g-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[["target", "Active Predictions", predictions.length, C.green], ["coin", "Total Staked", `${predictions.reduce((a, p) => a + p.amount, 0).toLocaleString()}`, C.gold], ["trophy", "Rewards Earned", "284K", C.blue], ["award", "Community Rank", "#42", C.red]].map(([g, l, v, c]) => (
          <Card key={l} hover glowColor={c} style={{ padding: 18 }}><div style={{ marginBottom: 8 }}><Glyph name={g} size={18} color={c} glow /></div><div style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: c }}>{v}</div><div style={{ fontSize: 11.5, color: C.mute2 }}>{l}</div></Card>
        ))}
      </div>
      <div className="g-cols-2" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 }}>
        <div>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: "0 0 14px" }}>Active Predictions</h3>
          {predictions.length === 0 ? (
            <Card style={{ padding: 36, textAlign: "center" }}>
              <Glyph name="target" size={32} color={C.mute2} style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, color: C.mute, margin: "0 0 16px" }}>No predictions yet. Time to back your belief.</p>
              <Btn onClick={() => nav("/markets")}>Browse Markets</Btn>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {predictions.map((p, i) => (
                <Card key={i} hover style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div><div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{p.market}</div><div style={{ fontSize: 12.5, color: C.mute }}>Backed <b style={{ color: C.gold }}>{p.pick}</b> @ {p.odds}</div></div>
                    <Pill color={C.green}><LivePulse size={5} /> Active</Pill>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`, fontSize: 13 }}><span style={{ color: C.mute }}>Stake <b style={{ color: C.white }}>{p.amount.toLocaleString()}</b></span><span style={{ color: C.mute }}>Payout <b style={{ color: C.green }}>{(+p.payout).toLocaleString()}</b></span></div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, margin: "0 0 14px" }}>Badges</h3>
          <Card style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {badges.map((b, i) => (
                <div key={i} style={{ padding: "16px 12px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: `1px solid ${C.line}`, textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.gold}1a`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Glyph name="award" size={20} color={C.gold} glow /></div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.3 }}>{b}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

function EmptyState({ title, sub, cta, children }) {
  const { nav } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><Glyph name="trophy" size={28} color={C.mute2} /></div>
      <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, margin: "0 0 8px" }}>{title}</h2>
      <p style={{ fontSize: 15, color: C.mute, maxWidth: 380, margin: "0 auto" }}>{sub}</p>
      {cta && <Btn style={{ marginTop: 18 }} onClick={() => nav(cta[1])}>{cta[0]}</Btn>}
      {children}
    </div>
  );
}

/* ─────────────────────── ROUTER ─────────────────────── */
function Router() {
  const { route } = useApp();
  if (route.startsWith("/markets/")) return <MarketDetailPage id={route.split("/markets/")[1]} />;
  if (route.startsWith("/profile/")) return <ProfilePage addr={route.split("/profile/")[1]} />;
  switch (route) {
    case "/arena": return <ArenaPage />;
    case "/markets": return <MarketsPage />;
    case "/tournament": return <TournamentPage />;
    case "/leaderboard": return <LeaderboardPage />;
    case "/how-it-works": return <HowItWorksPage />;
    case "/roadmap": return <RoadmapPage />;
    case "/tokenomics": return <TokenomicsPage />;
    case "/buy": return <BuyPage />;
    case "/community": return <CommunityPage />;
    case "/docs": return <DocsPage />;
    case "/legal": return <LegalPage />;
    default: return <ArenaPage />;
  }
}

/* Ambient stadium sound — WebAudio-generated crowd rumble, no external files */
function AmbientSound() {
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  const toggle = useCallback(() => {
    if (!on) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ac = new Ctx();
        // filtered noise = distant crowd rumble
        const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
        const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
        const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420; lp.Q.value = 0.6;
        const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 90;
        const gain = ac.createGain(); gain.gain.value = 0; gain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 1.2);
        // slow swell LFO for crowd-surge feel
        const lfo = ac.createOscillator(); lfo.frequency.value = 0.08;
        const lfoGain = ac.createGain(); lfoGain.gain.value = 0.025;
        lfo.connect(lfoGain); lfoGain.connect(gain.gain);
        src.connect(hp); hp.connect(lp); lp.connect(gain); gain.connect(ac.destination);
        src.start(); lfo.start();
        ref.current = { ac, gain };
        setOn(true);
      } catch (e) { /* audio unsupported */ }
    } else {
      const r = ref.current;
      if (r) { try { r.gain.gain.linearRampToValueAtTime(0, r.ac.currentTime + 0.4); setTimeout(() => r.ac.close(), 500); } catch (e) {} ref.current = null; }
      setOn(false);
    }
  }, [on]);
  return (
    <button onClick={toggle} aria-label="Toggle stadium ambience" style={{ position: "fixed", bottom: 20, right: 18, zIndex: 130, width: 42, height: 42, borderRadius: 12, border: `1px solid ${on ? C.green + "55" : C.line}`, background: on ? `${C.green}14` : "rgba(2,6,23,.7)", backdropFilter: "blur(10px)", color: on ? C.green : C.mute, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s", boxShadow: `0 8px 24px -10px ${C.black}` }} className="g-sound-toggle">
      <Glyph name="volume" size={19} glow={on} />
      {on && <span style={{ position: "absolute", inset: -1, borderRadius: 12, border: `1px solid ${C.green}`, animation: "kickRing 2s ease-out infinite", pointerEvents: "none" }} />}
    </button>
  );
}

/* ─────────────────────── ROOT ─────────────────────── */
export default function GloryApp() {
  const [route, nav] = useHashRoute();
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address] = useState("0x7Af3" + "0000".repeat(7) + "9c2E");
  const [walletOpen, setWalletOpen] = useState(false);
  const [predictTarget, setPredictTarget] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const connect = useCallback(() => { setConnected(true); setBalance(250000); setWalletOpen(false); }, []);
  const openPredict = useCallback((m) => setPredictTarget(m), []);
  const addPrediction = useCallback((p) => setPredictions((prev) => [p, ...prev]), []);

  const ctx = { route, nav, connected, connect, balance, setBalance, address, walletOpen, setWalletOpen, predictTarget, setPredictTarget, openPredict, mobileNav, setMobileNav, predictions, addPrediction };

  return (
    <AppCtx.Provider value={ctx}>
      <div style={{ background: C.navy, color: C.white, fontFamily: FB, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
          @keyframes scrollX{from{transform:translateX(0)}to{transform:translateX(-50%)}}
          @keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-18px) rotate(4deg)}}
          @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
          @keyframes ping{0%{transform:scale(1);opacity:.8}70%,100%{transform:scale(2.4);opacity:0}}
          @keyframes flood{0%,100%{opacity:.35}50%{opacity:.75}}
          @keyframes glow{0%,100%{box-shadow:0 0 36px -10px ${C.gold}}50%{box-shadow:0 0 64px -4px ${C.gold}}}
          @keyframes confetti{to{transform:translateY(420px) rotate(540deg);opacity:0}}
          @keyframes fade{from{opacity:0}to{opacity:1}}
          @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
          @keyframes slideDown{from{transform:translateY(-12px);opacity:0}to{transform:translateY(0);opacity:1}}
          @keyframes fadeUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
          @keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
          @keyframes sweep{0%,100%{transform:translateX(-30%) rotate(20deg);opacity:0}50%{transform:translateX(60%) rotate(20deg);opacity:1}}
          @keyframes beam{0%,100%{opacity:.5;transform:rotate(14deg) scaleY(1)}50%{opacity:1;transform:rotate(11deg) scaleY(1.06)}}
          @keyframes lampFlick{0%,100%{opacity:.85}48%{opacity:.85}50%{opacity:.45}52%{opacity:.9}}
          @keyframes crowdSway{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
          @keyframes drift{0%{transform:translateY(0) scale(1);opacity:0}30%{opacity:.7}100%{transform:translateY(-180px) scale(1.5);opacity:0}}
          @keyframes wave{0%,100%{transform:rotate(-2deg) translateY(0)}50%{transform:rotate(2deg) translateY(-4px)}}
          @keyframes shake{0%,100%{transform:translate(0,0)}25%{transform:translate(-1px,1px)}75%{transform:translate(1px,-1px)}}
          @keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes feedIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
          /* ── football broadcast motion ── */
          @keyframes sceneCut{0%{opacity:0;transform:translateY(14px) scale(.985);filter:blur(3px)}60%{filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1)}}
          @keyframes scanWipe{0%{transform:translateX(-100%)}100%{transform:translateX(220%)}}
          @keyframes oddsTick{0%,100%{transform:translateY(0);opacity:1}45%{transform:translateY(-2px);opacity:.7}}
          @keyframes goalFlash{0%{opacity:0}8%{opacity:1}100%{opacity:0}}
          @keyframes kickRing{0%{transform:scale(.4);opacity:.8}100%{transform:scale(2.6);opacity:0}}
          @keyframes ballRoll{0%{transform:translateX(-30px) rotate(0)}100%{transform:translateX(30px) rotate(360deg)}}
          @keyframes radarSweep{from{transform:rotate(0)}to{transform:rotate(360deg)}}
          @keyframes camDrift{0%,100%{transform:scale(1.02) translate(0,0)}50%{transform:scale(1.04) translate(-6px,3px)}}
          @keyframes volPulse{0%,100%{opacity:.5;transform:scaleY(.85)}50%{opacity:1;transform:scaleY(1.15)}}
          @keyframes flashPhoto{0%,97%,100%{opacity:0}98%{opacity:.55}}
          @media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important}}
          @keyframes ballSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
          @keyframes ballArc{0%{transform:translate(6px,80px)}50%{transform:translate(100px,12px)}100%{transform:translate(194px,40px)}}
          @keyframes dashFlow{to{stroke-dashoffset:-18}}
          @keyframes streak{0%{opacity:0;transform:translateX(8px)}40%{opacity:.6}100%{opacity:0;transform:translateX(-12px)}}
          @keyframes rainFall{from{transform:translateY(-40px) rotate(12deg)}to{transform:translateY(120px) rotate(12deg)}}
          @keyframes playerBreathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
          *{box-sizing:border-box;}
          ::selection{background:${C.gold};color:${C.black};}
          input::placeholder{color:rgba(248,250,252,.3);}
          body{margin:0;}
          ::-webkit-scrollbar{width:10px;height:10px}
          ::-webkit-scrollbar-track{background:${C.black}}
          ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:9px}
          ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.18)}
          @media(max-width:1100px){
            .g-hide-lg{display:none!important}
          }
          @media(max-width:980px){
            .g-arena-grid,.g-detail-grid,.g-tourn-grid,.g-detail-an{grid-template-columns:1fr!important}
            .g-cols-3{grid-template-columns:1fr 1fr!important}
            .g-arena-hero{grid-template-columns:1fr!important;text-align:left;row-gap:8px!important;min-height:0!important}
            .g-livebox{max-width:440px!important;margin:0 auto}
          }
          @media(max-width:760px){
            .g-desk{display:none!important}
            .g-mob{display:flex!important}
            .g-hide-sm{display:none!important}
            .g-sound-toggle{bottom:74px!important}
            .g-cols-2,.g-cols-3,.g-cols-4,.g-foot-grid{grid-template-columns:1fr!important}
            .g-lb-head,.g-lb-row{grid-template-columns:38px 1.4fr .9fr .8fr!important}
            .g-lb-head span:nth-child(5),.g-lb-head span:nth-child(6),.g-lb-row span:nth-child(5),.g-lb-row span:nth-child(6){display:none!important}
            .g-page{padding-bottom:90px!important}
            .g-livebox{max-width:100%!important}
          }
          @media(max-width:480px){ .g-cols-4{grid-template-columns:1fr 1fr!important} }
        `}</style>

        {/* ambient stadium glow */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-8%", left: "18%", width: 420, height: 420, background: `radial-gradient(circle,${C.green}1c,transparent 70%)`, filter: "blur(50px)", animation: "flood 6s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "35%", right: "4%", width: 460, height: 460, background: `radial-gradient(circle,${C.blue}1c,transparent 70%)`, filter: "blur(60px)", animation: "flood 8s ease-in-out infinite 1s" }} />
          <div style={{ position: "absolute", bottom: "2%", left: "2%", width: 480, height: 480, background: `radial-gradient(circle,${C.gold}14,transparent 70%)`, filter: "blur(70px)", animation: "flood 7s ease-in-out infinite 2s" }} />
          {/* distant arena architecture silhouette */}
          <svg width="100%" height="42%" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: 0, opacity: .5, maskImage: "linear-gradient(180deg,transparent,black 70%)" }} aria-hidden>
            <path d="M0 320 V150 Q220 70 460 96 Q720 124 980 96 Q1220 70 1440 150 V320 Z" fill="none" stroke="rgba(0,255,136,.06)" strokeWidth="1" />
            <path d="M0 320 V190 Q220 120 460 142 Q720 166 980 142 Q1220 120 1440 190 V320 Z" fill="rgba(6,17,31,.5)" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
            {/* floodlight pylons */}
            {[140, 1300].map((x, i) => <g key={i}><line x1={x} y1="150" x2={x} y2="40" stroke="rgba(255,255,255,.07)" strokeWidth="2" /><rect x={x - 26} y="26" width="52" height="18" rx="3" fill="rgba(255,209,102,.08)" stroke="rgba(255,209,102,.2)" /></g>)}
          </svg>
          {/* faint pitch line geometry overlay across whole app */}
          <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: `linear-gradient(${C.green} 1px,transparent 1px),linear-gradient(90deg,${C.green} 1px,transparent 1px)`, backgroundSize: "120px 120px", maskImage: "radial-gradient(ellipse at 50% 30%,black,transparent 80%)" }} />
        </div>

        <Header />
        <AmbientSound />
        <MobileNavOverlay />
        <Router />
        <Footer />
        <MobileBottomNav />
        <PredictModal />
        <WalletModal />
      </div>
    </AppCtx.Provider>
  );
}
