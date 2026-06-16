import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/design/tokens';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
};

export function Input({ label, error, leftIcon, style, ...rest }: Props) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <Text style={{ 
          color: colors.midnight[100], 
          fontSize: fontSize.sm, 
          fontWeight: '500', 
          marginBottom: spacing.xs + 2,
        }}>
          {label}
        </Text>
      )}
      <View style={{ position: 'relative' }}>
        {leftIcon && (
          <View style={{
            position: 'absolute',
            left: spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            zIndex: 1,
          }}>
            {leftIcon}
          </View>
        )}
        <TextInput
          placeholderTextColor={colors.midnight[300]}
          style={[
            {
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.10)',
              borderRadius: radius.lg,
              padding: spacing.md,
              paddingLeft: leftIcon ? spacing.md * 3 : spacing.md,
              color: colors.midnight[50],
              fontSize: fontSize.md,
            },
            style,
          ]}
          {...rest}
        />
      </View>
      {error && (
        <Text style={{ color: '#FCA5A5', fontSize: fontSize.xs, marginTop: spacing.xs + 2 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
