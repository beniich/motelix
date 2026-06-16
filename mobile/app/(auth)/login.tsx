import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Sparkles, Mail, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';
import { colors, fontSize, fontWeight, gradients, spacing } from '@/design/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  
  const onSubmit = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      // l'erreur est gérée dans le store auth et affichée ci-dessous
    }
  };
  
  return (
    <LinearGradient
      colors={gradients.dark}
      style={{ flex: 1, padding: spacing.xl }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
          <View style={{ 
            width: 80, height: 80, borderRadius: 24, 
            backgroundColor: 'rgba(59,130,246,0.20)', 
            alignItems: 'center', justifyContent: 'center',
            marginBottom: spacing.lg,
          }}>
            <Sparkles size={40} color={colors.gold[400]} />
          </View>
          <Text style={{ 
            color: colors.midnight[50], 
            fontSize: 32, 
            fontWeight: fontWeight.bold, 
            marginBottom: spacing.xs,
          }}>
            Sapphire
          </Text>
          <Text style={{ color: colors.midnight[200], fontSize: fontSize.md }}>
            Centre d'opérations
          </Text>
        </View>
        
        <View>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Mail size={18} color={colors.midnight[300]} />}
            placeholder="vous@hotel.com"
          />
          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            leftIcon={<Lock size={18} color={colors.midnight[300]} />}
            placeholder="••••••••"
          />
          
          {error && (
            <View style={{ 
              backgroundColor: 'rgba(239,68,68,0.10)', 
              borderWidth: 1, 
              borderColor: 'rgba(239,68,68,0.30)',
              borderRadius: 12,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}>
              <Text style={{ color: '#FCA5A5', fontSize: fontSize.sm }}>
                Email ou mot de passe incorrect
              </Text>
            </View>
          )}
          
          <Button
            title="Se connecter"
            onPress={onSubmit}
            variant="primary"
            size="lg"
            isLoading={isLoading}
          />
          
          <Text style={{ 
            color: colors.midnight[300], 
            fontSize: fontSize.xs, 
            textAlign: 'center', 
            marginTop: spacing.xl,
          }}>
            Demo: admin@sapphire.luxury / Password123!
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
