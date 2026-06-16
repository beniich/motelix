import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '@/lib/auth';
import { colors, fontSize, fontWeight, spacing } from '@/design/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/design/tokens';

export default function DashboardScreen() {
  const { user } = useAuth();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.midnight[900] }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ 
          color: colors.midnight[50], 
          fontSize: fontSize.xxxl, 
          fontWeight: fontWeight.bold, 
          marginBottom: spacing.xs,
        }}>
          Bonjour, {user?.firstName}
        </Text>
        <Text style={{ color: colors.midnight[300], fontSize: fontSize.md, marginBottom: spacing.xxl }}>
          Voici l'état de l'hôtel aujourd'hui.
        </Text>
        
        {/* WIP: Real data will be integrated later */}
        <View style={{ 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          padding: spacing.lg, 
          borderRadius: 16,
          alignItems: 'center',
        }}>
          <Text style={{ color: colors.midnight[200] }}>Le dashboard arrivera dans les prochains sprints.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
