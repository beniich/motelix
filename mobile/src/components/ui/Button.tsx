import { Pressable, Text, ActivityIndicator, type ViewProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, radius, spacing } from '@/design/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/design/tokens';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = ViewProps & {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  hapticFeedback?: boolean;
};

const sizeStyles = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: fontSize.sm },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: fontSize.md },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: fontSize.lg },
};

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  disabled, 
  leftIcon,
  hapticFeedback = true,
  style,
  ...rest 
}: Props) {
  const isDisabled = disabled || isLoading;
  
  const handlePress = () => {
    if (hapticFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.midnight[100] : colors.midnight[900]} />
      ) : (
        <>
          {leftIcon}
          <Text style={[
            {
              color: variant === 'primary' || variant === 'gold' 
                ? colors.midnight[900] 
                : variant === 'danger' 
                ? colors.midnight[50]
                : colors.midnight[50],
              fontSize: sizeStyles[size].fontSize,
              fontWeight: fontWeight.semibold,
              marginLeft: leftIcon ? spacing.sm : 0,
            }
          ]}>
            {title}
          </Text>
        </>
      )}
    </>
  );
  
  const baseStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: radius.lg,
    paddingVertical: sizeStyles[size].paddingVertical,
    paddingHorizontal: sizeStyles[size].paddingHorizontal,
    opacity: isDisabled ? 0.5 : 1,
  };
  
  if (variant === 'primary' || variant === 'gold' || variant === 'danger') {
    const bgColors = variant === 'gold' ? gradients.gold 
      : variant === 'danger' ? (['#EF4444', '#DC2626'] as [string, string])
      : gradients.sapphire;
    
    return (
      <Pressable 
        onPress={handlePress} 
        disabled={isDisabled}
        style={({ pressed }) => [baseStyle, pressed && { transform: [{ scale: 0.98 }] }, style]}
        {...rest}
      >
        <LinearGradient
          colors={bgColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: radius.lg,
          }}
        />
        {content}
      </Pressable>
    );
  }
  
  const bgStyle = variant === 'secondary' 
    ? { backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }
    : {};
  
  return (
    <Pressable 
      onPress={handlePress} 
      disabled={isDisabled}
      style={({ pressed }) => [baseStyle, bgStyle, pressed && { transform: [{ scale: 0.98 }] }, style]}
      {...rest}
    >
      {content}
    </Pressable>
  );
}
