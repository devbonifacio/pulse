# PULSE — Sistema de Design Completo
> Versão 1.0 | Stack: React Native + Expo | Público: Gen Z 16–25

---

## PARTE 1 — TRÊS DIREÇÕES VISUAIS

---

### CONCEITO A — "GRÃO ANALÓGICO"
*Vibe: câmera descartável dos anos 90 encontra app de 2025*

A premissa do PULSE é autenticidade — e nada grita "real" mais do que a estética analógica. O visual usa uma textura de grão sutil sobreposta em todos os fundos (via noise SVG inline ou lib react-native-noise), como se o app fosse impresso em papel fotográfico. As fotos dos pulsos têm uma leve vinheta automática. Os cards têm bordas irregulares simuladas com border-width assimétrico (1px top/left, 2px bottom/right). A paleta não é preto puro — é **quase-preto com temperatura quente** (#0d0b09), como filme exposto à pouca luz.

**Paleta:** Quase-preto quente, creme sujo (#f5f0e8), laranja queimado (#c4622d) como accent principal (substituindo roxo), verde desgastado (#4a7c59) pra estados positivos. **Tipografia:** `DMSerifDisplay` pro logo e displays, `SpaceMono` pra timestamps e metadados (dá sensação de máquina de escrever), `Inter` somente pra corpo de texto. **Motion:** transições com `easing: Easing.out(Easing.expo)` lentas (350ms), sem bounces — como virar página de revista. Haptic leve no capture. **Assinatura:** overlay de grão em todos os fundos.

---

### CONCEITO B — "TERMINAL FRIO" ✅ RECOMENDADO
*Vibe: editor de código premium + rede social — tipo Linear se virasse BeReal*

O PULSE tem algo de crú e técnico — você *captura* um momento sem edição, como um log de sistema. O design abraça isso: interface de terminal ultra-limpa com grid de 4px, bordas 1px retas (rx=0 em alguns elementos), fonte monospace pra timestamps e usernames, e um sistema de cores baseado em **verde terminal frio** (#00ff87 como accent) sobre preto absoluto. Não é cyberpunk — é mais **hacker minimalista**. Sem gradientes. Sem curvas decorativas.

**Paleta:** Preto absoluto (#000000) e off-white técnico (#e8e8e2), verde terminal (#00ff87) como único accent vibrante, amarelo alert (#ffe566) pra notificações, vermelho discreto (#ff4444) pra erros. **Tipografia:** `JetBrainsMono` pro logo/usernames/timestamps, `Syne` pra headings (geométrico, forte), `Inter` pra corpo. **Motion:** `LayoutAnimation` rápidos (200ms), sem easing suave — cortes limpos como terminal. Scale de 0.97→1 nos botões. **Assinatura:** borda esquerda colorida (2px verde) em elementos ativos — como cursor piscando.

---

### CONCEITO C — "EDITORIAL UNDERGROUND"
*Vibe: fanzine digital + revista de moda alternativa*

Layout assimétrico proposital — títulos grandes que cortam o card, textos rotacionados 90°, grid quebrado onde a foto sangra pelas bordas. O PULSE vira uma publicação de cada usuário, não só um feed. Cada pulso parece uma página de zine digital. A assimetria é calculada, não caótica. Usa espaço negativo agressivo com texto display enorme.

**Paleta:** Creme (#f2ede4) como fundo (sim, fundo claro — diferente de tudo), preto absoluto (#000), vermelho editorial (#e63946) como accent, dourado (#d4a853) pra elementos premium. **Tipografia:** `BebasNeue` pra displays e números grandes (impacto visual imediato), `IBMPlexMono` pra metadados, `Literata` pra legendas (serif elegante). **Motion:** transições com `transform: rotate` suaves (-1° a 1°) nos cards ao aparecer — sensação de jogar foto na mesa. **Assinatura:** numeração de página em cada pulso (tipo "003 / 128") no canto superior direito.

---

## PARTE 2 — PALETA EXPANDIDA (Conceito B — Terminal Frio)

```typescript
// constants/theme.ts — PALETA COMPLETA

export const palette = {
  // === BASE ===
  black:          '#000000',   // fundo absoluto
  black_soft:     '#0a0a0a',   // fundo principal (levemente menos pesado)
  black_card:     '#111111',   // cards elevados
  black_raised:   '#1a1a1a',   // inputs, elementos interativos
  black_border:   '#222222',   // bordas padrão
  black_subtle:   '#2a2a2a',   // bordas hover / divisores

  // === TEXTO ===
  white:          '#e8e8e2',   // texto principal (off-white técnico, não #fff puro)
  white_dim:      '#9a9a94',   // texto secundário
  white_muted:    '#555550',   // texto desabilitado / placeholders
  white_ghost:    '#2e2e2a',   // texto quase invisível / watermark

  // === ACCENT PRINCIPAL — VERDE TERMINAL ===
  green:          '#00ff87',   // accent vibrante principal
  green_dim:      '#00cc6a',   // hover / pressed
  green_glow:     '#00ff8720', // overlay glow sutil (20% opacity)
  green_subtle:   '#00ff8710', // background tint em cards selecionados

  // === ACCENT SECUNDÁRIO — AMARELO ALERTA ===
  yellow:         '#ffe566',   // notificações, badges, "novo"
  yellow_dim:     '#ccb84f',   // hover
  yellow_subtle:  '#ffe56615', // background tint

  // === ESTADOS ===
  red:            '#ff4444',   // erro, deletar
  red_subtle:     '#ff444415',
  blue:           '#4488ff',   // info, links
  blue_subtle:    '#4488ff15',

  // === MOOD SYSTEM (pulso emocional) ===
  mood: {
    fire:     '#ff6b35',   // 🔥 energia alta
    calm:     '#4ecdc4',   // 😌 tranquilo
    happy:    '#ffe66d',   // 😊 feliz
    sad:      '#6b8cae',   // 😢 triste
    angry:    '#e63946',   // 😤 raiva
    magic:    '#b388ff',   // ✨ especial
  },

  // === CÍRCULOS (identidade visual de cada grupo) ===
  circles: {
    intimate:     '#00ff87',  // Íntimos — verde terminal
    friends:      '#ffe566',  // Amigos — amarelo
    acquaintances:'#555550',  // Conhecidos — cinza
  },

  // === STATUS ONLINE ===
  online:         '#00ff87',
  away:           '#ffe566',
  offline:        '#333333',
};
```

---

## PARTE 3 — TIPOGRAFIA HIERÁRQUICA

```typescript
// constants/theme.ts — TYPOGRAPHY

export const typography = {
  // === FONTES ===
  // No Expo: usar @expo-google-fonts/syne + @expo-google-fonts/jetbrains-mono
  // fallback: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  
  fonts: {
    display:  'Syne_700Bold',          // headings, logo
    mono:     'JetBrainsMono_400Regular', // usernames, timestamps, números
    monoBold: 'JetBrainsMono_700Bold',
    body:     'Inter_400Regular',
    bodyMed:  'Inter_500Medium',
  },

  // === TAMANHOS (escala 4px) ===
  size: {
    xs:    10,  // timestamps compactos
    sm:    12,  // captions, labels menores
    base:  14,  // body padrão
    md:    16,  // body prominent, inputs
    lg:    18,  // subtítulos
    xl:    22,  // títulos de seção
    xxl:   28,  // títulos de tela
    display: 42, // logo, números grandes de stats
    hero:    56, // logo na splash
  },

  // === LETTER SPACING ===
  tracking: {
    tight:   -0.5,  // headings grandes
    normal:   0,    // body
    wide:     0.5,  // labels uppercase
    wider:    1.5,  // captions, metadata (vibe terminal)
    widest:   3,    // seção headers em uppercase
  },

  // === CASOS DE USO ===
  // LOGO:        Syne 42px bold, tracking -0.5, cor: green
  // USERNAMES:   JetBrainsMono 13px, tracking 0.5, cor: white_dim
  // TIMESTAMPS:  JetBrainsMono 10px, tracking 1.5, cor: white_muted
  // BODY TEXT:   Inter 14px, tracking 0, cor: white
  // CAPTIONS:    Inter 13px, tracking 0, cor: white_dim
  // SECTION HDR: Syne 11px uppercase, tracking 3, cor: white_muted
  // NUMBERS BIG: JetBrainsMono 28px bold, cor: green
  // BUTTONS:     Inter 15px medium, tracking 0.3
};
```

---

## PARTE 4 — COMPONENTES PADRÃO

### 4.1 — Botões

```tsx
// components/ui/Button.tsx

import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { palette, typography } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary',
  loading, disabled, fullWidth
}: ButtonProps) {
  const styles = getButtonStyles(variant, disabled || loading);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[styles.container, fullWidth && { width: '100%' }]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? palette.black : palette.green} size="small" />
        : <Text style={styles.label}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

function getButtonStyles(variant: ButtonVariant, disabled?: boolean) {
  const base = {
    container: {
      height: 48,                    // touch target ≥ 44px ✅
      paddingHorizontal: 24,
      borderRadius: 4,               // quasi-reto — vibe terminal
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      opacity: disabled ? 0.4 : 1,
    },
    label: {
      fontFamily: typography.fonts.bodyMed,
      fontSize: typography.size.md,
      letterSpacing: typography.tracking.wide,
    }
  };

  const variants = {
    primary: {
      container: { ...base.container, backgroundColor: palette.green },
      label: { ...base.label, color: palette.black, fontFamily: typography.fonts.bodyMed },
    },
    secondary: {
      container: { ...base.container, backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.green },
      label: { ...base.label, color: palette.green },
    },
    ghost: {
      container: { ...base.container, backgroundColor: 'transparent' },
      label: { ...base.label, color: palette.white_dim },
    },
    danger: {
      container: { ...base.container, backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.red },
      label: { ...base.label, color: palette.red },
    },
  };

  return variants[variant];
}
```

---

### 4.2 — Input Field

```tsx
// components/ui/Input.tsx

import { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { palette, typography } from '../../constants/theme';

type InputState = 'idle' | 'focused' | 'error' | 'disabled';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;    // ex: "@" pra username
}

export function Input({ label, error, prefix, editable = true, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  
  const state: InputState = !editable ? 'disabled' : error ? 'error' : focused ? 'focused' : 'idle';
  const borderColor = {
    idle:     palette.black_border,
    focused:  palette.green,
    error:    palette.red,
    disabled: palette.black_border,
  }[state];

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{
          fontFamily: typography.fonts.mono,
          fontSize: typography.size.xs,
          letterSpacing: typography.tracking.widest,
          color: focused ? palette.green : palette.white_muted,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          {label}
        </Text>
      )}

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.black_raised,
        borderWidth: 1,
        borderColor,
        borderRadius: 4,
        // Assinatura PULSE: borda esquerda colorida quando focado
        borderLeftWidth: focused ? 2 : 1,
        borderLeftColor: focused ? palette.green : borderColor,
        paddingHorizontal: 14,
        height: 48,
      }}>
        {prefix && (
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: typography.size.base,
            color: palette.white_muted,
            marginRight: 4,
          }}>
            {prefix}
          </Text>
        )}
        <TextInput
          {...props}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={palette.white_muted}
          style={{
            flex: 1,
            fontFamily: typography.fonts.body,
            fontSize: typography.size.md,
            color: editable ? palette.white : palette.white_muted,
          }}
        />
      </View>

      {error && (
        <Text style={{
          fontFamily: typography.fonts.mono,
          fontSize: typography.size.xs,
          color: palette.red,
          marginTop: 4,
          letterSpacing: typography.tracking.wide,
        }}>
          ✕  {error}
        </Text>
      )}
    </View>
  );
}
```

---

### 4.3 — Card de Pulso

```tsx
// components/PulseCard.tsx

import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { palette, typography } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = width * 1.1; // proporção portrait levemente alongada

interface PulseCardProps {
  user: { name: string; username: string; avatar?: string };
  imageUri: string;
  caption?: string;
  mood?: string;
  moodColor?: string;
  timestamp: string;
  circle: 'intimate' | 'friends' | 'acquaintances';
  reactions: { emoji: string; count: number }[];
  onReact: (emoji: string) => void;
}

export function PulseCard({
  user, imageUri, caption, mood, moodColor,
  timestamp, circle, reactions, onReact
}: PulseCardProps) {
  const circleColor = palette.circles[circle];

  return (
    <View style={{
      backgroundColor: palette.black_card,
      marginBottom: 1,        // sem gap — cards colam levemente (vibe feed)
      overflow: 'hidden',
    }}>

      {/* HEADER — linha de status técnico */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: palette.black_subtle,
      }}>
        {/* Avatar com indicator de círculo */}
        <View style={{ position: 'relative', marginRight: 10 }}>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: palette.black_raised,
            borderWidth: 1, borderColor: circleColor + '60',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{
              fontFamily: typography.fonts.monoBold,
              fontSize: 14,
              color: circleColor,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          {/* Dot de status de círculo */}
          <View style={{
            position: 'absolute', bottom: -1, right: -1,
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: circleColor,
            borderWidth: 1.5, borderColor: palette.black_card,
          }} />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 13,
            color: palette.white,
            letterSpacing: 0.3,
          }}>
            {user.name}
          </Text>
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: 10,
            color: palette.white_muted,
            letterSpacing: typography.tracking.wider,
            marginTop: 1,
          }}>
            @{user.username}  ·  {timestamp}
          </Text>
        </View>

        {/* Mood indicator */}
        {mood && (
          <View style={{
            backgroundColor: (moodColor || palette.green) + '20',
            borderWidth: 1,
            borderColor: (moodColor || palette.green) + '40',
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}>
            <Text style={{ fontSize: 14 }}>{mood}</Text>
          </View>
        )}
      </View>

      {/* IMAGEM — full width, sem padding */}
      <View style={{ height: CARD_IMAGE_HEIGHT, backgroundColor: palette.black_raised }}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: typography.fonts.mono, fontSize: 10, color: palette.white_ghost, letterSpacing: 2 }}>
              SEM IMAGEM
            </Text>
          </View>
        )}
      </View>

      {/* FOOTER */}
      <View style={{ padding: 14 }}>
        {caption && (
          <Text style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.size.base,
            color: palette.white_dim,
            lineHeight: 20,
            marginBottom: 12,
          }}>
            {caption}
          </Text>
        )}

        {/* Reações */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {reactions.map(({ emoji, count }) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => onReact(emoji)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: palette.black_raised,
                borderWidth: 1,
                borderColor: palette.black_subtle,
                borderRadius: 4,
                paddingHorizontal: 10,
                paddingVertical: 5,
                minHeight: 32,
              }}
            >
              <Text style={{ fontSize: 14 }}>{emoji}</Text>
              {count > 0 && (
                <Text style={{
                  fontFamily: typography.fonts.mono,
                  fontSize: 11,
                  color: palette.white_muted,
                }}>
                  {count}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
```

---

### 4.4 — Bolha de Mensagem

```tsx
// components/MessageBubble.tsx

import { View, Text } from 'react-native';
import { palette, typography } from '../constants/theme';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: string;
  seen?: boolean;
  disappears?: boolean;
}

export function MessageBubble({ content, isOwn, timestamp, seen, disappears }: MessageBubbleProps) {
  return (
    <View style={{
      alignSelf: isOwn ? 'flex-end' : 'flex-start',
      maxWidth: '78%',
      marginBottom: 8,
      marginHorizontal: 16,
    }}>
      <View style={{
        backgroundColor: isOwn ? palette.green : palette.black_raised,
        borderRadius: 4,
        // Assinatura: canto "cortado" no lado do remetente
        borderBottomRightRadius: isOwn ? 0 : 4,
        borderBottomLeftRadius: isOwn ? 4 : 0,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: isOwn ? palette.green : palette.black_subtle,
      }}>
        <Text style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.size.base,
          color: isOwn ? palette.black : palette.white,
          lineHeight: 20,
        }}>
          {content}
        </Text>
      </View>

      {/* Meta */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        paddingHorizontal: 2,
      }}>
        {disappears && (
          <Text style={{ fontFamily: typography.fonts.mono, fontSize: 9, color: palette.yellow + '80' }}>
            ◈
          </Text>
        )}
        <Text style={{
          fontFamily: typography.fonts.mono,
          fontSize: 9,
          color: palette.white_ghost,
          letterSpacing: typography.tracking.wider,
        }}>
          {timestamp}{isOwn && seen ? '  ✓✓' : isOwn ? '  ✓' : ''}
        </Text>
      </View>
    </View>
  );
}
```

---

### 4.5 — Avatar

```tsx
// components/ui/Avatar.tsx

import { View, Text } from 'react-native';
import { palette, typography } from '../../constants/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  circleType?: 'intimate' | 'friends' | 'acquaintances';
  online?: boolean;
}

const sizes = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
const fontSizes = { xs: 10, sm: 12, md: 14, lg: 20, xl: 28 };

export function Avatar({ name, size = 'md', circleType, online }: AvatarProps) {
  const dim = sizes[size];
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const accentColor = circleType ? palette.circles[circleType] : palette.green;

  return (
    <View style={{ position: 'relative', width: dim, height: dim }}>
      <View style={{
        width: dim,
        height: dim,
        borderRadius: dim / 2,
        backgroundColor: accentColor + '18',
        borderWidth: 1,
        borderColor: accentColor + '50',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontFamily: typography.fonts.monoBold,
          fontSize: fontSizes[size],
          color: accentColor,
          letterSpacing: -0.5,
        }}>
          {initials}
        </Text>
      </View>
      {online !== undefined && (
        <View style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: Math.max(8, dim * 0.22),
          height: Math.max(8, dim * 0.22),
          borderRadius: 99,
          backgroundColor: online ? palette.online : palette.offline,
          borderWidth: 1.5,
          borderColor: palette.black_card,
        }} />
      )}
    </View>
  );
}
```

---

### 4.6 — Tab Bar Item

```tsx
// Dentro do app/(tabs)/_layout.tsx

function TabItem({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      paddingTop: 4,
      // Assinatura: linha superior verde quando ativo (como cursor de terminal)
      borderTopWidth: 2,
      borderTopColor: focused ? palette.green : 'transparent',
      paddingHorizontal: 16,
      paddingBottom: 4,
    }}>
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
      <Text style={{
        fontFamily: typography.fonts.mono,
        fontSize: 9,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: focused ? palette.green : palette.white_muted,
      }}>
        {label}
      </Text>
    </View>
  );
}

// Tab bar style:
// tabBarStyle: {
//   backgroundColor: palette.black,
//   borderTopColor: palette.black_border,
//   borderTopWidth: 1,
//   height: 64,
//   paddingBottom: 0,
//   paddingTop: 0,
// }
```

---

## PARTE 5 — MICRO-INTERAÇÕES

```typescript
// utils/interactions.ts

import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics'; // expo install expo-haptics

// ── 1. PRESS SCALE — todos os botões e cards tocáveis
export function usePressScale(scaleValue = 0.96) {
  const scale = new Animated.Value(1);
  
  const onPressIn = () => Animated.timing(scale, {
    toValue: scaleValue,
    duration: 100,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
  
  const onPressOut = () => Animated.timing(scale, {
    toValue: 1,
    duration: 150,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
  
  return { scale, onPressIn, onPressOut };
}

// ── 2. FADE IN — telas e cards ao montar
export function useFadeIn(duration = 300, delay = 0) {
  const opacity = new Animated.Value(0);
  
  const animate = () => Animated.timing(opacity, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
  
  return { opacity, animate };
}

// ── 3. SLIDE UP — modais e bottom sheets
export function useSlideUp(fromY = 40) {
  const translateY = new Animated.Value(fromY);
  const opacity = new Animated.Value(0);
  
  const animate = () => Animated.parallel([
    Animated.timing(opacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    Animated.timing(translateY, { toValue: 0, duration: 280, easing: Easing.out(Easing.exp), useNativeDriver: true }),
  ]).start();
  
  return { opacity, translateY, animate };
}

// ── 4. HAPTICS — onde usar cada tipo
export const haptic = {
  // Capture de pulso, enviar mensagem, confirmar ação
  impact: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  
  // Reagir com emoji, like, selecionar item
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  
  // Notificação de pulso chegando, novo match de círculo
  notification: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  
  // Erro, campo inválido
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

// ── 5. PULSE BLINK — o cursor piscando (assinatura visual)
// Usar em: elementos ativos, status online, campo focado
export function useBlink() {
  const opacity = new Animated.Value(1);
  
  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ])
  ).start();
  
  return opacity;
}
```

---

## PARTE 6 — ASSINATURA VISUAL DO PULSE

### O elemento: **ACTIVE LEFT BORDER**

Inspirado no cursor de terminal piscando — qualquer elemento ativo, selecionado ou focado no PULSE ganha uma **borda esquerda de 2px verde** (`#00ff87`). É sutil, funcional e instantaneamente reconhecível.

**Onde aparece:**
- Input focado → `borderLeftWidth: 2, borderLeftColor: green`
- Tab ativa → `borderTopWidth: 2` (adaptado pro mobile)
- Card de conversa selecionado
- Item de menu ativo
- Notificação não lida

É o equivalente do "background grid" do Linear — aparece em TODA a interface de forma consistente. Usuário não percebe conscientemente, mas sente que o app tem caráter próprio.

```tsx
// Exemplo de uso — qualquer View interativa:
const activeStyle = {
  borderLeftWidth: 2,
  borderLeftColor: palette.green,
  paddingLeft: 12,    // compensar a borda pra texto não desalinhar
};
```

---

## PARTE 7 — DESIGN TOKEN FILE COMPLETO

```typescript
// constants/theme.ts — EXPORTAR TUDO DAQUI

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
    fire: '#ff6b35', calm: '#4ecdc4', happy: '#ffe66d',
    sad: '#6b8cae', angry: '#e63946', magic: '#b388ff',
  },
  circles: {
    intimate: '#00ff87', friends: '#ffe566', acquaintances: '#555550',
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
    tight: -0.5, normal: 0, wide: 0.5,
    wider: 1.5, widest: 3,
  },
};

export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
};

export const radius = {
  none: 0,
  xs:   2,
  sm:   4,   // padrão PULSE — quasi-reto
  md:   8,
  lg:   12,
  pill: 999,
};

export const shadows = {
  // RN shadow pra iOS + Android elevation
  card: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    // Sombra verde pra elementos ativos importantes
    shadowColor: palette.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Shorthand pro active border (assinatura visual)
export const activeBorder = {
  borderLeftWidth: 2,
  borderLeftColor: palette.green,
};

export default { palette, typography, spacing, radius, shadows, activeBorder };
```

---

## GUIA DE INSTALAÇÃO DE FONTES

```bash
# Instalar fontes no projeto Expo:
npx expo install @expo-google-fonts/syne @expo-google-fonts/jetbrains-mono @expo-google-fonts/inter expo-font
```

```tsx
// app/_layout.tsx — carregar fontes
import { useFonts, Syne_700Bold } from '@expo-google-fonts/syne';
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // ... resto do layout
}
```
