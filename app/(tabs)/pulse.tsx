import {
  View, Text, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, ScrollView, Image, Platform,
} from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import api from '../../services/api';

const MOODS = ['😊', '🔥', '😌', '😢', '😤', '✨', '🧠', '☕'];

export default function PulseCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);

  // 1) Pedindo permissão
  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // 2) Sem permissão ainda
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>📸</Text>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          Permita o acesso à câmera
        </Text>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 28, lineHeight: 22 }}>
          O PULSE precisa da câmera pra você{'\n'}registrar seus momentos reais.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: '#8B5CF6',
            paddingHorizontal: 32, paddingVertical: 14,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3) Tira a foto (funciona web e celular)
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: true,
      });

      // Caminho 1: base64 veio direto
      // No web, expo-camera às vezes já devolve o data URL completo no campo base64
      if (photo?.base64) {
        const uri = photo.base64.startsWith('data:')
          ? photo.base64
          : `data:image/jpeg;base64,${photo.base64}`;
        setPhotoUri(uri);
        return;
      }

      // Caminho 2: só veio o URI (comum no web) — converte pra data URL
      if (photo?.uri) {
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPhotoUri(reader.result);
          } else {
            Alert.alert('Erro', 'Falha ao processar a foto');
          }
        };
        reader.onerror = () => Alert.alert('Erro', 'Falha ao ler a foto');
        reader.readAsDataURL(blob);
        return;
      }

      Alert.alert('Erro', 'Câmera não retornou imagem');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível tirar a foto');
    }
  };

  // 4) Publica o pulso
  const handlePost = async () => {
    if (!photoUri) return;
    setLoading(true);
    try {
      await api.post('/pulses', {
        imageUrl: photoUri,
        caption,
        mood,
        circle: 'friends',
      });
      Alert.alert('🎉 Pulso postado!', 'Vai conferir no feed', [
        { text: 'Beleza', onPress: () => {
          setPhotoUri(null);
          setCaption('');
          setMood('');
          router.push('/(tabs)');
        }},
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível postar');
    } finally {
      setLoading(false);
    }
  };

  // 5) Tela de preview + legenda (depois de tirar a foto)
  if (photoUri) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#0a0a0a' }}
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>
          Confirma seu pulso?
        </Text>

        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: 380, borderRadius: 16, marginBottom: 20, backgroundColor: '#141414' }}
          resizeMode="cover"
        />

        <Text style={{ color: '#888', fontSize: 13, marginBottom: 8, fontWeight: '600' }}>
          Legenda
        </Text>
        <TextInput
          placeholder="O que tá rolando agora?"
          placeholderTextColor="#444"
          value={caption}
          onChangeText={setCaption}
          maxLength={280}
          multiline
          style={{
            backgroundColor: '#141414', color: '#fff',
            padding: 14, borderRadius: 12,
            borderWidth: 1, borderColor: '#1e1e1e',
            fontSize: 15, marginBottom: 20,
            minHeight: 70, textAlignVertical: 'top',
          }}
        />

        <Text style={{ color: '#888', fontSize: 13, marginBottom: 8, fontWeight: '600' }}>
          Como você tá?
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {MOODS.map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => setMood(mood === m ? '' : m)}
              style={{
                padding: 10, borderRadius: 12,
                backgroundColor: mood === m ? '#8B5CF620' : '#141414',
                borderWidth: 1,
                borderColor: mood === m ? '#8B5CF6' : '#1e1e1e',
              }}
            >
              <Text style={{ fontSize: 24 }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão postar */}
        <TouchableOpacity
          onPress={handlePost}
          disabled={loading}
          style={{
            backgroundColor: '#8B5CF6', padding: 18,
            borderRadius: 999, alignItems: 'center',
            opacity: loading ? 0.7 : 1, marginBottom: 12,
          }}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Postar pulso</Text>
          }
        </TouchableOpacity>

        {/* Tirar outra */}
        <TouchableOpacity
          onPress={() => setPhotoUri(null)}
          disabled={loading}
          style={{
            borderWidth: 1, borderColor: '#1e1e1e',
            padding: 16, borderRadius: 999, alignItems: 'center',
          }}
        >
          <Text style={{ color: '#888', fontWeight: '600' }}>Tirar outra</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // 6) Câmera ao vivo
  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      >
        {/* Overlay no topo */}
        <View style={{ paddingTop: 56, paddingHorizontal: 20, alignItems: 'center' }}>
          <View style={{
            backgroundColor: '#00000080',
            paddingHorizontal: 14, paddingVertical: 6,
            borderRadius: 999, borderWidth: 1, borderColor: '#EC489960',
          }}>
            <Text style={{ color: '#EC4899', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              MOMENTO DO PULSO
            </Text>
          </View>
        </View>

        {/* Controles na base */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          paddingBottom: 40, paddingHorizontal: 32,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Espaço esquerdo */}
          <View style={{ width: 56 }} />

          {/* Botão tirar foto (grande) */}
          <TouchableOpacity
            onPress={takePhoto}
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: '#fff',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 4, borderColor: '#8B5CF6',
            }}
          >
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: '#fff', borderWidth: 2, borderColor: '#0a0a0a',
            }} />
          </TouchableOpacity>

          {/* Botão trocar câmera */}
          <TouchableOpacity
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: '#00000080',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: '#ffffff30',
            }}
          >
            <Text style={{ fontSize: 24 }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
