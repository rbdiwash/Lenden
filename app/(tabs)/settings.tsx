import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TAB_BAR_SPACE } from '@/components/TabBar';
import { Chip } from '@/components/ui/Chip';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import { useEntries, usePeople } from '@/hooks/useLedgerData';
import { confirm } from '@/lib/confirm';
import { CURRENCIES } from '@/lib/currencies';
import { haptics } from '@/lib/haptics';
import { LANGUAGES } from '@/lib/i18n';
import { summarise, totalsOf } from '@/lib/ledger';
import { palette } from '@/lib/theme';
import { useLedger } from '@/store/useLedger';

export default function SettingsScreen() {
  const { t, money } = useI18n();
  const people = usePeople();
  const entries = useEntries();
  const settings = useLedger((state) => state.settings);
  const updateSettings = useLedger((state) => state.updateSettings);
  const clearAll = useLedger((state) => state.clearAll);
  const loadSampleData = useLedger((state) => state.loadSampleData);

  const [name, setName] = useState(settings.userName);

  // Keep the field in step if the name changes elsewhere (e.g. sample data).
  useEffect(() => setName(settings.userName), [settings.userName]);

  const totals = totalsOf(summarise(people, entries));

  const onExport = async () => {
    haptics.tap();
    const payload = JSON.stringify({ version: 1, people, entries, settings }, null, 2);

    if (Platform.OS === 'web') {
      await confirm({
        title: t('exportWebTitle'),
        message: t('exportWebBody'),
        confirmLabel: t('gotIt'),
      });
      return;
    }

    try {
      await Share.share({ title: t('shareTitle'), message: payload });
    } catch {
      // The user dismissed the share sheet — nothing to do.
    }
  };

  const onClear = async () => {
    const ok = await confirm({
      title: t('confirmClearTitle'),
      message: t('confirmClearBody'),
      confirmLabel: t('confirmClearAction'),
      cancelLabel: t('cancel'),
      destructive: true,
    });
    if (!ok) return;
    haptics.warning();
    clearAll();
  };

  const onSample = async () => {
    const ok = await confirm({
      title: t('confirmSampleTitle'),
      message: t('confirmSampleBody'),
      confirmLabel: t('confirmSampleAction'),
      cancelLabel: t('cancel'),
    });
    if (!ok) return;
    haptics.success();
    loadSampleData();
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        className="px-5"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="pb-5 pt-2 font-display text-[26px] text-ink-900">
          {t('settingsTitle')}
        </Text>

        <Card title={t('yourKhata')}>
          <View className="flex-row items-center justify-between py-1">
            <Stat label={t('statPeople')} value={`${people.length}`} />
            <Stat label={t('statEntries')} value={`${entries.length}`} />
            <Stat label={t('statNet')} value={money(totals.net)} />
          </View>
        </Card>

        <Card title={t('languageSection')}>
          <View className="flex-row flex-wrap gap-2">
            {LANGUAGES.map((option) => (
              <Chip
                key={option.code}
                label={option.label}
                active={settings.language === option.code}
                onPress={() => updateSettings({ language: option.code })}
              />
            ))}
          </View>
        </Card>

        <Card title={t('currencySection')}>
          <View className="flex-row flex-wrap gap-2">
            {CURRENCIES.map((option) => (
              <Chip
                key={option.symbol}
                label={`${option.symbol}  ${t(option.nameKey)}`}
                active={settings.currency === option.symbol}
                onPress={() => updateSettings({ currency: option.symbol })}
              />
            ))}
          </View>
        </Card>

        <Card title={t('yourName')}>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={() => updateSettings({ userName: name.trim() })}
            placeholder={t('yourNamePlaceholder')}
            placeholderTextColor={palette.ink300}
            className="h-12 rounded-2xl bg-ink-50 px-4 font-ui-medium text-[15px] text-ink-900"
            returnKeyType="done"
            onSubmitEditing={() => updateSettings({ userName: name.trim() })}
          />
        </Card>

        <Card title={t('dataSection')}>
          <Row
            icon="sparkles-outline"
            label={t('loadSample')}
            caption={t('loadSampleCaption')}
            onPress={onSample}
          />
          <Row
            icon="share-outline"
            label={t('exportBackup')}
            caption={t('exportBackupCaption')}
            onPress={onExport}
          />
          <Row
            icon="trash-outline"
            label={t('clearAllData')}
            caption={t('clearAllCaption')}
            tone="danger"
            onPress={onClear}
            last
          />
        </Card>

        <View className="mt-2 items-center px-6 py-8">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
            <Ionicons name="shield-checkmark-outline" size={22} color={palette.brand600} />
          </View>
          <Text className="mt-3 text-center font-ui-semibold text-[14px] text-ink-500">
            {t('privacyTitle')}
          </Text>
          <Text className="mt-1 text-center font-sans text-[13px] leading-5 text-ink-400">
            {t('privacyBody')}
          </Text>
          <Text className="mt-4 font-sans text-[12px] text-ink-300">
            {t('version', { version: Constants.expoConfig?.version ?? '1.0.0' })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
        {title}
      </Text>
      <View className="rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5">{children}</View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 pr-2">
      <Text className="font-sans text-[12px] text-ink-400" numberOfLines={1}>
        {label}
      </Text>
      <Text className="mt-1 font-ui-bold text-[17px] text-ink-900" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Row({
  icon,
  label,
  caption,
  onPress,
  tone = 'default',
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  caption: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
  last?: boolean;
}) {
  const danger = tone === 'danger';

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      className={
        last ? 'flex-row items-center py-3' : 'flex-row items-center border-b border-ink-100 py-3'
      }
    >
      <View
        className={
          danger
            ? 'h-10 w-10 items-center justify-center rounded-xl bg-give-50'
            : 'h-10 w-10 items-center justify-center rounded-xl bg-brand-50'
        }
      >
        <Ionicons name={icon} size={18} color={danger ? palette.give600 : palette.brand600} />
      </View>
      <View className="ml-3 flex-1">
        <Text
          className={
            danger
              ? 'font-ui-semibold text-[15px] text-give-600'
              : 'font-ui-semibold text-[15px] text-ink-900'
          }
        >
          {label}
        </Text>
        <Text className="font-sans text-[12px] text-ink-400">{caption}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={palette.ink300} />
    </PressableScale>
  );
}
