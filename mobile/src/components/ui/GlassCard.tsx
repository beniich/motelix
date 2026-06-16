import { View, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '@/design/tokens';

type Props = ViewProps & {
  variant?: 'default' | 'strong' | 'gold';
};

export function GlassCard({ children, variant = 'default', style, ...rest }: Props) {
  const tintColor = variant === 'gold' ? 'rgba(212,175,55,0.05)' 
    : variant === 'strong' ? 'rgba(255,255,255,0.10)' 
    : 'rgba(255,255,255,0.05)';
  
  return (
    <BlurView 
      intensity={variant === 'strong' ? 40 : 20} 
      tint="dark" 
      style={[
        {
          backgroundColor: tintColor,
          borderRadius: radius.xl,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: variant === 'gold' ? 'rgba(212,175,55,0.20)' : 'rgba(255,255,255,0.10)',
          overflow: 'hidden',
        },
        style,
      ]}
      {...rest as any}
    >
      {children}
    </BlurView>
  );
}
