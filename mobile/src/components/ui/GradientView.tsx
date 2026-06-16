import { LinearGradient } from 'expo-linear-gradient';
import { View, type ViewProps } from 'react-native';
import { gradients, radius } from '@/design/tokens';

type Props = ViewProps & {
  gradient?: 'sapphire' | 'emerald' | 'gold' | 'dark';
  rounded?: keyof typeof radius;
};

export function GradientView({ 
  children, 
  gradient = 'sapphire', 
  rounded = 'lg',
  style,
  ...rest 
}: Props) {
  return (
    <LinearGradient
      colors={gradients[gradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        { borderRadius: radius[rounded] },
        style,
      ]}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
}
