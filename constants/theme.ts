export const palette = {
  black:          '#000000',
  black_soft:     '#0a0a0a',
  black_card:     '#111111',
  black_raised:   '#1a1a1a',
  black_border:   '#222222',
  black_subtle:   '#2a2a2a',

  white:          '#e8e8e2',
  white_dim:      '#9a9a94',
  white_muted:    '#555550',
  white_ghost:    '#2e2e2a',

  green:          '#00ff87',
  green_dim:      '#00cc6a',
  green_glow:     '#00ff8720',
  green_subtle:   '#00ff8710',

  yellow:         '#ffe566',
  yellow_dim:     '#ccb84f',
  yellow_subtle:  '#ffe56615',

  red:            '#ff4444',
  red_subtle:     '#ff444415',

  blue:           '#4488ff',
  blue_subtle:    '#4488ff15',

  online:         '#00ff87',
  away:           '#ffe566',
  offline:        '#333333',

  mood: {
    fire:  '#ff6b35',
    calm:  '#4ecdc4',
    happy: '#ffe66d',
    sad:   '#6b8cae',
    angry: '#e63946',
    magic: '#b388ff',
  },

  circles: {
    intimate:     '#00ff87',
    friends:      '#ffe566',
    acquaintances:'#555550',
  },
};

export const typography = {
  fonts: {
    display:  'Syne_700Bold',
    mono:     'JetBrainsMono_400Regular',
    monoBold: 'JetBrainsMono_700Bold',
    body:     'Inter_400Regular',
    bodyMed:  'Inter_500Medium',
  },
  size: {
    xs: 10, sm: 12, base: 14, md: 16,
    lg: 18, xl: 22, xxl: 28, display: 42, hero: 56,
  },
  tracking: {
    tight: -0.5, normal: 0, wide: 0.5, wider: 1.5, widest: 3,
  },
};

export const spacing = {
  xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48,
};

export const radius = {
  none: 0, xs: 2, sm: 4, md: 8, lg: 12, pill: 999,
};

export const activeBorder = {
  borderLeftWidth: 2,
  borderLeftColor: palette.green,
};
