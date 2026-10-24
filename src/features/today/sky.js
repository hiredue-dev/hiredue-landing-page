/*
 * The sky behind today's count on /today: colours, sun, moon and night for an
 * hour of the day (0–24, IST). Pure, so the server and the browser draw the
 * same scene from the same `asOf`.
 */

// [hour, sky top, sky middle, horizon, far hills, near hills]
const KEYS = [
  [0, "#0b0a1e", "#17132e", "#2a1f3f", "#1c1932", "#110f23"],
  [4.5, "#0e0c24", "#1c1636", "#33244a", "#201c38", "#131028"],
  [5.5, "#2a2350", "#6a4470", "#c27a7a", "#3c3052", "#251e3b"],
  [6.5, "#3f4f95", "#b87486", "#f0a47a", "#5a4a6a", "#3a3050"],
  [8, "#3a6cc0", "#6b97d6", "#efc49c", "#5e8a78", "#3e6658"],
  [10, "#3170c8", "#5b93dc", "#a9c8ea", "#6a9a7c", "#47745e"],
  [13, "#2b6ccc", "#5490de", "#a2c4ec", "#6a9a7c", "#47745e"],
  [16, "#3567c0", "#6a8fd2", "#e2b996", "#648e72", "#426a56"],
  [17.3, "#3d4b9c", "#a06a9a", "#f09a6a", "#5a5a72", "#3c3e58"],
  [18.2, "#2a2a6a", "#7a4a80", "#e07858", "#3a3352", "#262340"],
  [19.2, "#17163e", "#3a2756", "#6a3a5e", "#241f3c", "#17142c"],
  [20.5, "#0e0c26", "#1a1536", "#2c2044", "#1c1931", "#110f24"],
  [24, "#0b0a1e", "#17132e", "#2a1f3f", "#1c1932", "#110f23"],
];

const clamp = (x) => Math.max(0, Math.min(1, x));

/** Blends two #rrggbb colours; f = 0 is `a`, 1 is `b`. */
export function mix(a, b, f) {
  const parse = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = parse(a);
  const B = parse(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * f).toString(16).padStart(2, "0")).join("")}`;
}

/** The five sky colours at `hour`, blended between the nearest keyframes. */
export function skyAt(hour) {
  let i = 0;
  while (i < KEYS.length - 2 && hour >= KEYS[i + 1][0]) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const f = clamp((hour - a[0]) / (b[0] - a[0]));
  const [top, middle, horizon, hillFar, hillNear] = [1, 2, 3, 4, 5].map((j) => mix(a[j], b[j], f));
  return { top, middle, horizon, hillFar, hillNear };
}

export function phaseAt(hour) {
  if (hour < 5) return "Night";
  if (hour < 7) return "Sunrise";
  if (hour < 11.5) return "Morning";
  if (hour < 16.5) return "Afternoon";
  if (hour < 18.8) return "Sunset";
  if (hour < 20.5) return "Evening";
  return "Night";
}

// Sun and moon ride the same arc across the right half of the card.
const arcX = (p) => `${(52 + p * 42).toFixed(2)}%`;
const arcY = (p) => `${(82 - Math.sin(p * Math.PI) * 62).toFixed(2)}%`;

/** Everything the scene needs for `hour`. */
export function skyScene(hour) {
  const sky = skyAt(hour);
  // 1 at night, 0 by day, easing through dawn (5–6:30) and dusk (6–8 PM).
  const night =
    hour < 5 ? 1 : hour < 6.5 ? 1 - (hour - 5) / 1.5 : hour < 18 ? 0 : hour < 20 ? (hour - 18) / 2 : 1;

  // The sun is up from 6 AM to 6:30 PM, fading in and out at either end.
  const sunProgress = clamp((hour - 6) / 12.5);
  const sunColor = mix("#ffa560", "#fff4d2", Math.sin(sunProgress * Math.PI));
  // The moon rises at 6:30 PM and sets at 6 AM.
  const moonHours = (hour - 18.5 + 24) % 24;
  const moonProgress = clamp(moonHours / 11.5);

  return {
    background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.middle} 60%, ${sky.horizon} 100%)`,
    hillFar: sky.hillFar,
    hillNear: sky.hillNear,
    house: mix(sky.hillNear, "#000000", 0.35),
    roof: mix(sky.hillNear, "#000000", 0.55),
    night,
    phase: phaseAt(hour),
    sun: {
      x: arcX(sunProgress),
      y: arcY(sunProgress),
      color: sunColor,
      opacity: clamp((hour - 5.6) / 0.9) * clamp((18.9 - hour) / 0.9),
    },
    moon: {
      x: arcX(moonProgress),
      y: arcY(moonProgress),
      opacity: moonHours <= 11.5 ? clamp(moonHours / 0.8) * clamp((11.5 - moonHours) / 0.8) : 0,
    },
    cloudOpacity: Math.max(0.12, 1 - night) * 0.85,
    cloudTint: mix("#ffffff", sky.horizon, 0.35),
    // The window is lit before 7 AM and after 5 PM.
    windowOpacity: hour < 7 || hour > 17 ? 1 : 0.12,
    smoke: night > 0.5 ? "rgba(200,190,220,0.35)" : "rgba(255,255,255,0.6)",
  };
}

/** "5:35 PM" for an hour of the day. */
export function clockAt(hour) {
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

// Fixed seed, so the stars sit in the same places on the server and in every browser.
export const STARS = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: 44 }, () => ({
    x: `${(rnd() * 100).toFixed(1)}%`,
    y: `${(rnd() * 75).toFixed(1)}%`,
    size: `${(1 + rnd() * 1.8).toFixed(1)}px`,
    delay: `${(-rnd() * 3).toFixed(2)}s`,
  }));
})();

export const FIREFLIES = [
  [14, 40, 0],
  [26, 70, -1.2],
  [38, 34, -2.4],
  [55, 58, -0.6],
  [63, 30, -3.1],
  [74, 76, -1.8],
  [92, 44, -2.7],
].map(([x, y, delay]) => ({ x: `${x}%`, y: `${y}px`, delay: `${delay}s` }));
