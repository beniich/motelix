import { View, Text } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '@/design/tokens';

export default function RoomsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.midnight[900], padding: spacing.lg }}>
      <Text style={{ 
        color: colors.midnight[50], 
        fontSize: fontSize.xxxl, 
        fontWeight: fontWeight.bold 
      }}>
        Chambres
      </Text>
      <Text style={{ color: colors.midnight[300], marginTop: spacing.md }}>
        (En cours de construction)
      </Text>
    </View>
  );
}
