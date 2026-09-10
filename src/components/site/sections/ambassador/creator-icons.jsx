/**
 * Platform glyphs and program icons for the ambassador page. They are drawn
 * inline rather than imported so they can inherit `currentColor` and change
 * with a card's state, the way the rest of the page's icons do.
 */

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const perkIcons = {
  /* a completed payout */
  payout: (
    <svg {...stroke}>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  ),
  /* money changing hands */
  commission: (
    <svg {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.6 9.1a2.9 2.9 0 00-2.6-1.4c-1.5 0-2.6.8-2.6 2s1 1.8 2.6 2.1c1.7.3 2.8.9 2.8 2.2s-1.2 2.1-2.8 2.1a3 3 0 01-2.7-1.4" />
      <path d="M12 6.1v1.6M12 16.1v1.7" />
    </svg>
  ),
  /* a personal code */
  code: (
    <svg {...stroke}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M8.4 10.6L6.6 12l1.8 1.4M15.6 10.6L17.4 12l-1.8 1.4M13.3 9.8l-2.6 4.4" />
    </svg>
  ),
  /* a real person on the other end */
  support: (
    <svg {...stroke}>
      <path d="M4.5 13.5v-1.4a7.5 7.5 0 0115 0v1.4" />
      <rect x="3" y="12.6" width="3.6" height="5.4" rx="1.8" />
      <rect x="17.4" y="12.6" width="3.6" height="5.4" rx="1.8" />
      <path d="M19.2 18v.6a2.4 2.4 0 01-2.4 2.4H13" />
    </svg>
  ),
};

/** Brand marks, drawn as solid single-colour glyphs so one `color` tints them. */
export const platformIcons = {
  YouTube: (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M22.2 7.4a2.7 2.7 0 00-1.9-1.9C18.6 5 12 5 12 5s-6.6 0-8.3.5A2.7 2.7 0 001.8 7.4 28 28 0 001.3 12c0 1.6.2 3.1.5 4.6a2.7 2.7 0 001.9 1.9c1.7.5 8.3.5 8.3.5s6.6 0 8.3-.5a2.7 2.7 0 001.9-1.9c.3-1.5.5-3 .5-4.6s-.2-3.1-.5-4.6zM9.9 15.2V8.8l5.5 3.2z" />
    </svg>
  ),
  Instagram: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.9" cy="7.1" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M20.1 2H3.9A1.9 1.9 0 002 3.9v16.2A1.9 1.9 0 003.9 22h16.2a1.9 1.9 0 001.9-1.9V3.9A1.9 1.9 0 0020.1 2zM8.1 18.7H5.3V9.8h2.8zM6.7 8.6a1.6 1.6 0 110-3.3 1.6 1.6 0 010 3.3zm12 10.1h-2.8v-4.3c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.4H9.9V9.8h2.7v1.2h.1a3 3 0 012.7-1.5c2.8 0 3.4 1.9 3.4 4.3z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.6 2h-3v13.1a2.6 2.6 0 11-2-2.5V9.5a5.7 5.7 0 105.1 5.6V8.9a6.7 6.7 0 003.8 1.2V7a3.9 3.9 0 01-3.9-3.9z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.6 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.1 21H2l7.3-8.3L2.3 3h6.4l4.4 5.9zm-1.1 16.1h1.7L7.6 4.8H5.8z" />
    </svg>
  ),
  Threads: (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.9 11.3a6 6 0 00-.5-.2c-.3-2.9-1.9-4.6-4.6-4.6a4.6 4.6 0 00-4 2l1.5 1a2.8 2.8 0 012.5-1.2c1.5 0 2.5.8 2.8 2.4a10 10 0 00-2.2-.2c-2.6 0-4.4 1.4-4.4 3.4 0 1.9 1.6 3.2 3.6 3.2 2.2 0 3.6-1.3 4.1-3.2 1 .6 1.5 1.5 1.5 2.6 0 1.8-1.7 3.7-5.2 3.7-3.7 0-5.9-2.5-5.9-6.9S8.4 5.4 12 5.4c2.7 0 4.6 1 5.6 3l1.6-.8c-1.3-2.5-3.8-3.9-7.2-3.9C7.3 3.7 4.3 6.9 4.3 13.3S7.3 22.7 12 22.7c4.5 0 7-2.6 7-5.5 0-2-1-3.6-2.1-4.4zm-4.3 4.1c-1 0-1.8-.5-1.8-1.4 0-1 1-1.6 2.4-1.6.7 0 1.3.1 1.9.2-.2 1.6-1 2.8-2.5 2.8z" />
    </svg>
  ),
};

export const platformColor = {
  YouTube: "#ff0033",
  Instagram: "#d62976",
  LinkedIn: "#0a66c2",
  TikTok: "#1d1d1d",
  X: "#1d1d1d",
  Threads: "#1d1d1d",
};
