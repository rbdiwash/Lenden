import { Text } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { haptics } from '@/lib/haptics';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function Chip({ label, active, onPress }: Props) {
  return (
    <PressableScale
      scaleTo={0.94}
      onPress={() => {
        haptics.select();
        onPress();
      }}
      className={
        active
          ? 'rounded-full bg-ink-900 px-4 py-2'
          : 'rounded-full border border-ink-200 bg-white px-4 py-2'
      }
    >
      <Text
        className={
          active
            ? 'font-ui-semibold text-[13px] text-white'
            : 'font-ui-semibold text-[13px] text-ink-500'
        }
      >
        {label}
      </Text>
    </PressableScale>
  );
}
