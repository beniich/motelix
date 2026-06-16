import { Tabs } from 'expo-router';
import { LayoutDashboard, BedDouble, ListTodo, User, Sparkles } from 'lucide-react-native';
import { colors } from '@/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold[400],
        tabBarInactiveTintColor: colors.midnight[300],
        tabBarStyle: {
          backgroundColor: '#0A1233',
          borderTopColor: 'rgba(212,175,55,0.20)',
          height: 84,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerStyle: { backgroundColor: '#0A0E27' },
        headerTintColor: colors.midnight[50],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Chambres',
          tabBarIcon: ({ color }) => <BedDouble size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="housekeeping"
        options={{
          title: 'Ménage',
          tabBarIcon: ({ color }) => <Sparkles size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tâches',
          tabBarIcon: ({ color }) => <ListTodo size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
