// Lumen Advanced Education — Design tokens
// Inspired by lumenfrance.com — warm beige + academic ink + soft gold

window.LUMEN = {
  c: {
    // Backgrounds
    cream: '#F5EFE6',        // page bg
    paper: '#FBF7F0',        // card bg
    paperDeep: '#EFE7D8',    // raised card / wash
    ink: '#1F1A14',          // primary text — warm near-black
    inkSoft: '#3D3528',      // secondary text
    muted: '#8A7E6A',        // tertiary / labels
    line: '#E4DAC6',         // hairlines
    lineSoft: '#EFE7D8',

    // Brand accents
    gold: '#B5894A',         // primary accent — Lumen warm gold
    goldDeep: '#8A6535',
    goldSoft: '#E8D9B8',
    goldWash: '#F4ECDB',

    sage: '#7A8C6E',         // secondary — academic green
    sageSoft: '#D9DECF',

    terracotta: '#C56F4D',   // alert / milestone red
    terracottaSoft: '#F2D7CC',

    midnight: '#2C3142',     // deep navy — for charts/contrast
    midnightSoft: '#5A6378',

    // Subject color tags
    chinese: '#C56F4D',      // 中文 — terracotta
    math:    '#5A6378',      // 数学 — slate
    english: '#7A8C6E',      // 英语 — sage
    french:  '#B5894A',      // 法语 — gold
    support: '#9C7BA8',      // 学习支持 — soft plum

    // Status
    good: '#6F8B5C',
    warn: '#C9A24A',
    bad:  '#B05B3D',
  },

  // Fonts (Google fonts loaded in index.html)
  font: {
    serif: '"Cormorant Garamond", "Songti SC", "STSong", serif', // display
    sans:  '"Plus Jakarta Sans", "PingFang SC", -apple-system, system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, monospace',
    cn:    '"Noto Serif SC", "Songti SC", "STSong", serif',
  },

  // Spacing
  s: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  // Radii
  r: { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 },
};
