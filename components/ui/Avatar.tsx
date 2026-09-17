import { Text, View } from 'react-native';

import { initials } from '@/lib/format';
import { avatarColor } from '@/lib/theme';

interface Props {
  name: string;
  colorIndex: number;
  size?: 'sm' | 'md' | 'lg';
}

const box = { sm: 'h-10 w-10 rounded-xl', md: 'h-12 w-12 rounded-2xl', lg: 'h-20 w-20 rounded-3xl' };
const text = { sm: 'text-[14px]', md: 'text-[16px]', lg: 'text-[26px]' };

export function Avatar({ name, colorIndex, size = 'md' }: Props) {
  const colors = avatarColor(colorIndex);

  return (
    <View
      className={`items-center justify-center ${box[size]}`}
      style={{ backgroundColor: colors.bg }}
    >
      <Text className={`font-ui-bold ${text[size]}`} style={{ color: colors.fg }}>
        {initials(name)}
      </Text>
    </View>
  );
}
