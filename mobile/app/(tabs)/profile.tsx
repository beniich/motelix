import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { LogOut, User } from 'lucide-react-native';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, fontSize, fontWeight, spacing } from '@/design/tokens';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.midnight[900], padding: spacing.lg }}>
      <Text style={{ 
        color: colors.midnight[50], 
        fontSize: fontSize.xxxl, 
        fontWeight: fontWeight.bold,
        marginBottom: spacing.xl,
      }}>
        Profil
      </Text>
      
      <GlassCard style={{ marginBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{ 
            width: 64, height: 64, borderRadius: 32, 
            backgroundColor: 'rgba(59,130,246,0.20)', 
            alignItems: 'center', justifyContent: 'center',
            marginRight: spacing.md,
          }}>
            <User size={32} color={colors.sapphire[400]} />
          </View>
          <View>
            <Text style={{ color: colors.midnight[50], fontSize: fontSize.xl, fontWeight: fontWeight.semibold }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{ color: colors.midnight[200], fontSize: fontSize.md }}>
              {user?.role} • {user?.hotel?.name || 'Hôtel'}
            </Text>
          </View>
        </View>
        
        <Text style={{ color: colors.midnight[300], fontSize: fontSize.sm }}>
          Email : {user?.email}
        </Text>
      </GlassCard>
      
      <Button
        title="Se déconnecter"
        onPress={handleLogout}
        variant="ghost"
        leftIcon={<LogOut size={18} color={colors.midnight[100]} />}
      />
      
      <Text style={{ color: colors.midnight[400], fontSize: fontSize.xs, textAlign: 'center', marginTop: 'auto', marginBottom: spacing.xl }}>
        Sapphire v0.1.0 (Expo)
      </Text>
    </View>
  );
}
