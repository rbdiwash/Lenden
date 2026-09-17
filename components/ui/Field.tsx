import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { palette } from '@/lib/theme';

interface Props extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  prefix?: string;
}

export const Field = forwardRef<TextInput, Props>(function Field(
  { label, hint, error, prefix, className, ...rest },
  ref,
) {
  return (
    <View className="gap-2">
      <Text className="font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
        {label}
      </Text>

      <View
        className={
          error
            ? 'flex-row items-center rounded-2xl border border-give-400 bg-white px-4'
            : 'flex-row items-center rounded-2xl border border-ink-200 bg-white px-4'
        }
      >
        {prefix ? (
          <Text className="mr-2 font-ui-semibold text-[17px] text-ink-400">{prefix}</Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={palette.ink300}
          className={`h-14 flex-1 font-ui-medium text-[17px] text-ink-900 ${className ?? ''}`}
          {...rest}
        />
      </View>

      {error ? (
        <Text className="font-ui-medium text-[13px] text-give-600">{error}</Text>
      ) : hint ? (
        <Text className="font-sans text-[13px] text-ink-400">{hint}</Text>
      ) : null}
    </View>
  );
});
