import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ErrorRetry } from '@/components/error-retry';
import { LabeledInput } from '@/components/labeled-input';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { USER_ID } from '@/constants/config';
import { colors } from '@/constants/theme';
import { fetchUser, updateUser } from '@/lib/api';

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

/**
 * Shared account editor used by both buyer and maker profiles. Edits the
 * private contact fields (name/phone/email/address) stored on the server.
 */
export function AccountSection() {
  const [fields, setFields] = useState<Fields>({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const user = await fetchUser(USER_ID);
      setLoadError(null);
      setFields({
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load your account.';
      console.log('[account] load failed:', message);
      console.error('[account] load failed:', err);
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await updateUser(USER_ID, fields);
      setSaved(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save.';
      console.log('[account] save failed:', message);
      console.error('[account] save failed:', err);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="mt-4 rounded-2xl bg-white p-5">
      <Text className="text-sm font-semibold uppercase tracking-wide text-sage">Account</Text>
      <Text className="mt-1 text-sm text-savor/60">
        Your contact details for order handoffs.
      </Text>

      {loading && !loadError ? (
        <ActivityIndicator className="mt-6" color={colors.terracotta} />
      ) : loadError ? (
        <View className="mt-4">
          <ErrorRetry
            title="Couldn't load account"
            message={loadError}
            onRetry={() => {
              setLoadError(null);
              setLoading(true);
              load();
            }}
          />
        </View>
      ) : (
        <View className="mt-4">
          <LabeledInput
            label="Name"
            value={fields.name}
            onChangeText={(value) => update('name', value)}
            placeholder="Your full name"
          />
          <LabeledInput
            label="Phone"
            value={fields.phone}
            onChangeText={(value) => update('phone', value)}
            placeholder="(734) 555-0100"
            keyboardType="phone-pad"
          />
          <LabeledInput
            label="Email"
            value={fields.email}
            onChangeText={(value) => update('email', value)}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <LabeledInput
            label="Address"
            value={fields.address}
            onChangeText={(value) => update('address', value)}
            placeholder="Street, City, State ZIP"
            multiline
          />

          {error ? (
            <Text className="mb-3 text-sm font-medium text-terracotta">{error}</Text>
          ) : null}
          {saved ? (
            <Text className="mb-3 text-sm font-medium text-sage">Saved.</Text>
          ) : null}

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save account'}
            disabled={saving}
            onPress={save}
          />
        </View>
      )}
    </View>
  );
}
