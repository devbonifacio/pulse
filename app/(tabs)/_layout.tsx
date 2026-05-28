import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

// Componente customizado de ícone da tab (emoji + label)
function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 2, width: 60 }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      <Text style={{
        fontSize: 10,
        color: focused ? '#8B5CF6' : '#444',
        fontWeight: focused ? '700' : '400',
      }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#1e1e1e',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 68,
        },
        tabBarShowLabel: false, // usamos label custom dentro do TabIcon
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" label="Feed" focused={focused} /> }}
      />
      <Tabs.Screen
        name="pulse"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📸" label="Pulso" focused={focused} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chat" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Perfil" focused={focused} /> }}
      />
    </Tabs>
  );
}
