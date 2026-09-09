/**
 * Every image used by the landing page.
 *
 * Files live in `public/images` and keep the original content-hash filenames
 * that the design tool exported, so re-syncing an asset is a straight copy.
 * Reference them through this map instead of hard-coding paths.
 */

const img = (file) => `/images/${file}`;

/* Brand glyphs — single-path SVGs tinted with a CSS mask, shared across
   whichever section needs to point at a specific platform. */
export const marks = {
  linkedin: img("logos/linkedin.svg"),
  indeed: img("logos/indeed.svg"),
  monster: img("logos/monster.svg"),
  handshake: img("logos/handshake.svg"),
  wellfound: img("logos/wellfound.svg"),
  greenhouse: img("logos/greenhouse.svg"),
  gmail: img("logos/gmail.svg"),
  whatsapp: img("logos/whatsapp.svg"),
};

export const assets = {
  hero: {
    aiBadge: img("MvCoibXjquEPyTLgOctzXJU.png"),
    dashboard: img("dashboard.webp"),
    cloud01: img("Rorgfh4qpKNsZyFzGNQ9wt5C0i4.png"),
    cloud02: img("fLN6Wx8BsWTV2MkQDeC8mB2BQKA.png"),
    cloud03: img("lSZuKptayJeB4Xcw10qjE7IisQw.png"),
    hills: img("OH5Re0X1fnTabOLoEQYYNvYZWdQ.png"),
    sky: img("QonQfzdUmEwRaww2TW9LW9ODvR0.jpg"),
  },

  icons: {
    arrow: img("RXZaWpPO8xqy7UXViVlRYw1NH14.svg"),
    star: img("DR5ESv57oR37TVFwEH7Mx1yI0.svg"),
    shield: img("TPz3R1Zrox75UYaGWia5OJWG0LY.svg"),
    bolt: img("yMT4mMoFpKnWs2yU5HHxgRIdrc.svg"),
    heart: img("aljF5lhKI0wLwJbLJN7Va9tNyCI.svg"),
    users: img("haC1N7nJkCBSyVJF33CEFhE4Ls.svg"),
    stars5: img("Ks3rxCrb5LDuCsoN57uNgnYXtc.svg"),
    chevron: img("OXmFlFjSz1lrJp3vaL02MNthg.svg"),
    chevronBlue: img("5qbimdlaVq6A7LLm15aiqqrGNMQ.svg"),
    crossRed: img("59eNALHIwT6GZ6JhLrrkTHE0f7Y.svg"),
    checkGreen: img("cU6Yacp6C42TCWSRq8qtycxvNeY.svg"),
  },

  clients: [
    { name: "LinkedIn", icon: img("logos/linkedin.svg") },
    { name: "Google", icon: img("logos/google.svg") },
    { name: "Morgan Stanley", icon: undefined },
    { name: "JPMorgan Chase", icon: undefined },
    { name: "Microsoft", icon: img("logos/microsoft.svg") },
    { name: "Amazon", icon: img("logos/amazon.svg") },
    { name: "Meta", icon: img("logos/meta.svg") },
    { name: "Apple", icon: img("logos/apple.svg") },
  ],

  comparison: {
    dialBefore: img("BepIwACX380EUEqBMK5sdcQgh3k.png"),
    dialAfter: img("KVlQJuvBpDGKGjMPCFXDMbkUo.png"),
    afterBg: img("Osh2UHQcarC8mZnL6oh6gwYnbA.jpg"),
  },

  features: {
    chartBg: img("IZgCL46gW5tJW2TUtUKnT2MFgMs.jpg"),
    outreachBg: img("subirXJz7lXrSNejZPxoXXA90Ik.jpg"),
  },

  overview: {
    dashboard: img("dashboard.webp"),
    bg: img("sGvx8VOXGYVGBocxGp5Wy6GfeA.jpg"),
    iconRocket: img("9TgPFzikB5iacM06fvtpGu10.svg"),
    iconBolt: img("pRdU9KB8r1iwhd7rBdjtgbzG2k.svg"),
    iconBulb: img("G0m9o7lLo6sZqM2mtPuo6EgtA.svg"),
  },

  useCases: [
    {
      photo: img("QJxW9eYj0OFH6UvNuY4WNkVNJ0.jpg"),
      card: img("l4todGvJ7jL3WhxngE8F0mr2mks.jpg"),
    },
    {
      photo: img("ir92iMEO3JaF66SNrwrpEtYCY.jpg"),
      card: img("rF4nkbqTtccZBPQrR1TG1yKqD8.jpg"),
    },
    {
      photo: img("nkS8pAWPKcD8U7ncGVFOqXVV0o.jpg"),
      card: img("Rl52kJV49NxXXh2BR2NJhjJuN7I.jpg"),
    },
    {
      photo: img("omPOmfMdMLLw0U7G41FgZY7Cfmg.jpg"),
      card: img("nPSRrYomcOALmLPJavAfjBIboI.jpg"),
    },
  ],

  integrations: {
    hills: img("XlxsE037ei7LGhxYPQDC3jctO9A.png"),
    hub: img("4LS9gC9h4W4WbsmhQmoxQ7DsncQ.svg"),
  },

  stats: {
    users: img("q5j0wSdwMKoffsX85Ad5pRD16WY.svg"),
    search: img("HVHGQkyxoQVs16N8JfQt5jzI.svg"),
    send: img("cM86wDyqMYapxowGxtKW64TcFC4.svg"),
    globe: img("QHWxFsQnPvlSmhvomNozoRBtSjk.svg"),
    bulb: img("wiruZRRAYkGg8lZDZWNz9Puunw.svg"),
  },

  testimonials: {
    bg: img("cQBpXWVe2IileA0HCzW5W4uvgY.jpg"),
    avatars: {
      a: img("7Z2d6WeDiCpoz0B6ookMTPOFAU.jpg"),
      b: img("hYfCvJ3IVdEznEOwIQiiAxWOsPY.jpg"),
      c: img("622M5cyJBdKPIK1fPnBlo3qONk.jpg"),
      d: img("W13V3WO2YwDah4yBxCcZc70Es.jpg"),
      e: img("5O8P63EQwkFO1m5OTR4jsw7hI8.jpg"),
    },
  },

  pricing: {
    enterprise: img("KbVFR1CeRk5msFRW70lzRZLV8I.png"),
  },

  faq: {
    avatars: [
      img("gDcaZH5xt6hqSU2VbK2snAw.jpg"),
      img("X0ECJ5xGgYrCVgHB8RYd3RABTQ.jpg"),
      img("622M5cyJBdKPIK1fPnBlo3qONk.jpg"),
    ],
  },

  /* /blog — the sky behind a post header, and every article cover. */
  blog: {
    postBg: img("MvIsbu8ZmP32FmMItfwSlvTCzE.jpg"),
    covers: {
      aiTools: img("x6J03MSIElNiU7GkHeFzdCXyJo.jpg"),
      dataSearch: img("75KCFcFt38gsnUsGuwHSaDPmVPk.jpg"),
      ats: img("KbAkwMOmDMbBrbeVBhkuOXMqEU.jpg"),
      alerts: img("9rtD4BVjnpBbBwrgJso9YK9jOAw.jpg"),
      tailoring: img("0R1MWUhUGYeVu8Kp2vKBwyUnkKo.jpg"),
      security: img("QiTvuX4rj0Ikxkajt1axKhZedC8.jpg"),
      integrations: img("mJD3HCcFuvurKzlLWANGOOlY98.jpg"),
    },
  },

  /* /feature page — the template's own artwork for that route. */
  featurePage: {
    hero: img("VaTVNg3ReUeDytqAhBA1KYmYGmg.png"),
    signals: img("ixHeRnAI0qhzdoCm4eL8vAFx0.png"),
    depth: img("ec4uQ2RRHVbYypFsBUsSov3augQ.png"),
    bg: img("cQBpXWVe2IileA0HCzW5W4uvgY.jpg"),
  },

  footer: {
    bg: img("Osh2UHQcarC8mZnL6oh6gwYnbA.jpg"),
    social: [
      img("o2TaY2EYkSR14NmiylM3v3i9wM.svg"),
      img("H9Hsu1XWqgxCmWVKfgBn5BvSlrI.svg"),
      img("yapJfaMs4UJGW8x5avLvLiT0juU.svg"),
      img("DFinrfV7RnNPMg9DUYcgTgRnaM.svg"),
    ],
  },
};
