import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { useI18n } from '@/hooks/useI18n';
import { usePerson } from '@/hooks/useLedgerData';
import { haptics } from '@/lib/haptics';
import { dismiss } from '@/lib/nav';
import { palette } from '@/lib/theme';
import { useLedger } from '@/store/useLedger';

/** Doubles as the edit screen when an `id` param is present. */
export default function NewPersonScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useI18n();
  const existing = usePerson(id);

  const addPerson = useLedger((state) => state.addPerson);
  const updatePerson = useLedger((state) => state.updatePerson);
  const people = useLedger((state) => state.people);

  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(existing);
  const trimmed = name.trim();

  const onSave = () => {
    if (trimmed.length === 0) {
      setError(t('errorNameRequired'));
      return;
    }

    const duplicate = people.some(
      (person) => person.id !== existing?.id && person.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setError(t('errorDuplicateName'));
      return;
    }

    if (existing) updatePerson(existing.id, { name: trimmed, phone, note });
    else addPerson({ name: trimmed, phone, note });

    haptics.success();
    dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center justify-between px-5 pb-1 pt-2">
          <Text className="flex-1 pr-3 font-display text-[22px] text-ink-900" numberOfLines={1}>
            {editing ? t('editPerson') : t('newPerson')}
          </Text>
          <Pressable
            onPress={() => dismiss()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-ink-900/5"
            accessibilityRole="button"
            accessibilityLabel={t('close')}
          >
            <Ionicons name="close" size={20} color={palette.ink700} />
          </Pressable>
        </View>

        <ScrollView
          className="px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="items-center py-6">
            <Avatar
              name={trimmed || '?'}
              colorIndex={existing?.colorIndex ?? people.length}
              size="lg"
            />
            <Text className="mt-3 text-center font-sans text-[13px] text-ink-400">
              {trimmed ? t('avatarHintFilled') : t('avatarHintEmpty')}
            </Text>
          </View>

          <View className="gap-4 rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5">
            <Field
              label={t('fieldName')}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError(null);
              }}
              placeholder={t('fieldNamePlaceholder')}
              autoFocus={!editing}
              autoCapitalize="words"
              maxLength={40}
              error={error ?? undefined}
            />
            <Field
              label={t('fieldPhone')}
              value={phone}
              onChangeText={setPhone}
              placeholder={t('fieldPhonePlaceholder')}
              keyboardType="phone-pad"
              maxLength={20}
            />
            <Field
              label={t('fieldNote')}
              value={note}
              onChangeText={setNote}
              placeholder={t('fieldNotePlaceholder')}
              maxLength={60}
            />
          </View>
        </ScrollView>

        <View className="border-t border-ink-100 bg-canvas px-5 pb-2 pt-3">
          <Button
            label={editing ? t('saveChanges') : t('addToKhata')}
            icon="checkmark-circle"
            onPress={onSave}
            disabled={trimmed.length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
