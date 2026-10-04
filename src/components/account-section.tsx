import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { LabeledInput } from '@/components/labeled-input';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { USER_ID } from '@/constants/config';
import { fetchUser, updateUser } from '@/lib/api';

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

const EMPTY_FIELDS: Fields = {
  name: '',
  phone: '',
  email: '',
  address: '',
};

function isEmptyUser(user: { name?: string; phone?: string; email?: string } | null | undefined) {
  if (!user) {
    return true;
  }
  return !user.name?.trim() && !user.phone?.trim() && !user.email?.trim();
}

/**
 * Shared account editor used by both buyer and maker profiles. Edits the
 * private contact fields (name/phone/email/address) stored on the server.
 * Load failures never hide the form — fields stay editable with empty defaults.
 */
export function AccountSection() {
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const user = await fetchUser(USER_ID);
      if (isEmptyUser(user)) {
        setFields({
          name: '',
          phone: '',
          email: '',
          address: user?.address ?? '',
        });
        return;
      }
      setFields({
        name: user.name ?? '',
        phone: user.phone ?? '',
        email: user.email ?? '',
        address: user.address ?? '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load your account.';
      console.log('[account] load failed:', message);
      console.error('[account] load failed:', err);
      setFields((current) => ({
        name: current.name || '',
        phone: current.phone || '',
        email: current.email || '',
        address: current.address,
      }));
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
    </View>
  );
}
