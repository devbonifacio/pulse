import {
  View, Text, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, ScrollView, Image,
} from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import api from '../../services/api';
import { palette, typography, radius, spacing } from '../../constants/theme';

const MOODS = ['😊', '🔥', '😌', '😢', '😤', '✨', '🧠', '☕'];

export default function PulseCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('');
  const [captionFocused, setCaptionFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.black_soft, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={palette.green} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.black_soft, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{
          fontFamily: typography.fonts.mono, fontSize: 40, color: palette.green, marginBottom: 18,
        }}>◉</Text>
        <Text style={{
          fontFamily: typography.fonts.display, fontSize: typography.size.xl,
          color: palette.white, marginBottom: 8, textAlign: 'center',
        }}>
          acesso à câmera
        </Text>
        <Text style={{
          fontFamily: typography.fonts.mono, fontSize: 11,
          color: palette.white_muted, letterSpacing: typography.tracking.wider,
          textAlign: 'center', marginBottom: 28,
        }}>
          [ PULSE precisa da câmera ]{'\n'}[ pra você registrar momentos reais ]
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          activeOpacity={0.8}
          style={{
            backgroundColor: palette.green,
            paddingHorizontal: spacing.xl, paddingVertical: 14,
            borderRadius: radius.sm,
          }}
        >
          <Text style={{
            fontFamily: typography.fonts.bodyMed, fontSize: typography.size.md,
            color: palette.black, letterSpacing: typography.tracking.wide,
          }}>
            ▶  PERMITIR
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6, base64: true });
      if (photo?.base64) {
        const uri = photo.base64.startsWith('data:') ? photo.base64 : `data:image/jpeg;base64,${photo.base64}`;
        setPhotoUri(uri);
        return;
      }
      if (photo?.uri) {
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') setPhotoUri(reader.result);
        };
        reader.readAsDataURL(blob);
        return;
      }
      Alert.alert('Erro', 'Câmera não retornou imagem');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível tirar a foto');
    }
  };

  const handlePost = async () => {
    if (!photoUri) return;
    setLoading(true);
    try {
      await api.post('/pulses', { imageUrl: photoUri, caption, mood, circle: 'friends' });
      Alert.alert('✓ POSTADO', 'Vai conferir no feed', [
        { text: 'OK', onPress: () => {
          setPhotoUri(null); setCaption(''); setMood('');
          router.push('/(tabs)');
        }},
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível postar');
    } finally {
      setLoading(false);
    }
  };

  // PREVIEW
  if (photoUri) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: palette.black_soft }}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 64, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{
          fontFamily: typography.fonts.mono, fontSize: 10,
          color: palette.green, letterSpacing: typography.tracking.widest, marginBottom: 6,
        }}>
          ▌ PREVIEW · CONFIRM
        </Text>
        <Text style={{
          fontFamily: typography.fonts.display, fontSize: typography.size.xl,
          color: palette.white, marginBottom: spacing.lg,
        }}>
          confirma o pulso?
        </Text>

        <Image
          source={{ uri: photoUri }}
          style={{
            width: '100%', height: 400, borderRadius: radius.sm,
            marginBottom: spacing.lg, backgroundColor: palette.black_card,
            borderWidth: 1, borderColor: palette.green + '40',
          }}
          resizeMode="cover"
        />

        <Text style={{
          fontFamily: typography.fonts.mono, fontSize: typography.size.xs,
          color: captionFocused ? palette.green : palette.white_muted,
          letterSpacing: typography.tracking.widest,
          textTransform: 'uppercase', marginBottom: 6,
        }}>
          // legenda
        </Text>
        <TextInput
          placeholder="O que tá rolando agora?"
          placeholderTextColor={palette.white_ghost}
          value={caption}
          onChangeText={setCaption}
          onFocus={() => setCaptionFocused(true)}
          onBlur={() => setCaptionFocused(false)}
          maxLength={280}
          multiline
          style={{
            backgroundColor: palette.black_raised,
            color: palette.white,
            fontFamily: typography.fonts.body,
            fontSize: typography.size.md,
            padding: 14,
            borderRadius: radius.sm,
            borderWidth: 1,
            borderColor: captionFocused ? palette.green : palette.black_border,
            borderLeftWidth: captionFocused ? 2 : 1,
            borderLeftColor: captionFocused ? palette.green : palette.black_border,
            marginBottom: spacing.lg,
            minHeight: 80,
            textAlignVertical: 'top',
          }}
        />

        <Text style={{
          fontFamily: typography.fonts.mono, fontSize: typography.size.xs,
          color: palette.white_muted, letterSpacing: typography.tracking.widest,
          textTransform: 'uppercase', marginBottom: 8,
        }}>
          // mood
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.xl }}>
          {MOODS.map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => setMood(mood === m ? '' : m)}
              activeOpacity={0.7}
              style={{
                padding: 10,
                borderRadius: radius.sm,
                backgroundColor: mood === m ? palette.green + '20' : palette.black_raised,
                borderWidth: 1,
                borderColor: mood === m ? palette.green : palette.black_border,
                borderLeftWidth: mood === m ? 2 : 1,
                borderLeftColor: mood === m ? palette.green : palette.black_border,
              }}
            >
              <Text style={{ fontSize: 22 }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handlePost}
          disabled={loading}
          activeOpacity={0.8}
          style={{
            backgroundColor: palette.green,
            height: 52,
            borderRadius: radius.sm,
            alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.6 : 1,
            marginBottom: 10,
          }}
        >
          {loading
            ? <ActivityIndicator color={palette.black} />
            : (
              <Text style={{
                fontFamily: typography.fonts.bodyMed,
                fontSize: typography.size.md,
                color: palette.black,
                letterSpacing: typography.tracking.wide,
              }}>
                ▶  POSTAR PULSO
              </Text>
            )
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPhotoUri(null)}
          disabled={loading}
          activeOpacity={0.7}
          style={{
            borderWidth: 1,
            borderColor: palette.black_border,
            height: 48,
            borderRadius: radius.sm,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{
            fontFamily: typography.fonts.mono,
            fontSize: typography.size.sm,
            color: palette.white_dim,
            letterSpacing: typography.tracking.wide,
          }}>
            ↺  tirar outra
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // CÂMERA AO VIVO
  return (
    <View style={{ flex: 1, backgroundColor: palette.black }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View style={{ paddingTop: 56, paddingHorizontal: 20, alignItems: 'center' }}>
          <View style={{
            backgroundColor: palette.black + 'cc',
            borderWidth: 1,
            borderColor: palette.green + '60',
            borderLeftWidth: 2,
            borderLeftColor: palette.green,
            paddingHorizontal: 12, paddingVertical: 6,
            borderRadius: radius.sm,
          }}>
            <Text style={{
              fontFamily: typography.fonts.mono,
              fontSize: 10,
              color: palette.green,
              letterSpacing: typography.tracking.widest,
            }}>
              ▌ CAPTURE · LIVE
            </Text>
          </View>
        </View>

        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          paddingBottom: 40, paddingHorizontal: 32,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <View style={{ width: 56 }} />

          <TouchableOpacity
            onPress={takePhoto}
            activeOpacity={0.85}
            style={{
              width: 78, height: 78, borderRadius: 39,
              backgroundColor: palette.green,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 4, borderColor: palette.black,
            }}
          >
            <View style={{
              width: 60, height: 60, borderRadius: 30,
              backgroundColor: palette.green,
              borderWidth: 2, borderColor: palette.black,
            }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            activeOpacity={0.75}
            style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: palette.black + 'cc',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: palette.green + '50',
            }}
          >
            <Text style={{ color: palette.green, fontSize: 18 }}>↻</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
