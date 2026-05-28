import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { palette, typography } from '../../constants/theme';

function TabItem({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingTop: 8,
      paddingHorizontal: 14,
      paddingBottom: 4,
      borderTopWidth: 2,
      borderTopColor: focused ? palette.green : 'transparent',
      width: 72,
    }}>
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
      <Text style={{
        fontFamily: typography.fonts.mono,
        fontSize: 9,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: focused ? palette.green : palette.white_muted,
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
          backgroundColor: palette.black,
          borderTopColor: palette.black_border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index"   options={{ tabBarIcon: ({ focused }) => <TabItem icon="⚡" label="FEED"   focused={focused} /> }} />
      <Tabs.Screen name="pulse"   options={{ tabBarIcon: ({ focused }) => <TabItem icon="◉"  label="PULSO"  focused={focused} /> }} />
      <Tabs.Screen name="chat"    options={{ tabBarIcon: ({ focused }) => <TabItem icon="▣"  label="CHAT"   focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabItem icon="◈"  label="PERFIL" focused={focused} /> }} />
    </Tabs>
  );
}
