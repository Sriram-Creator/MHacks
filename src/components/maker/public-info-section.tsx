import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { ErrorRetry } from '@/components/error-retry';
import { LabeledInput } from '@/components/labeled-input';
import { PrimaryButton } from '@/components/maker/primary-button';
import { USER_ID } from '@/constants/config';
import { colors } from '@/constants/theme';
import { fetchUser, updateUser } from '@/lib/api';
import { toDownscaledDataUrl } from '@/lib/image';

/**
 * Maker-only editor for the public parts of a profile buyers can see:
 * the shop bio and photo. Kept separate from private contact details.
 */
export function PublicInfoSection() {
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const user = await fetchUser(USER_ID);
      setLoadError(null);
      setBio(user.bio);
      setPhoto(user.photo);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load your profile.';
      console.log('[public-info] load failed:', message);
      console.error('[public-info] load failed:', err);
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

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photos needed', 'Allow photo access to choose a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled) {
      const dataUrl = await toDownscaledDataUrl(result.assets[0]);
      setPhoto(dataUrl);
      setSaved(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await updateUser(USER_ID, { bio, photo });
      setSaved(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save.';
      console.log('[public-info] save failed:', message);
      console.error('[public-info] save failed:', err);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="mt-4 rounded-2xl bg-white p-5">
      <Text className="text-sm font-semibold uppercase tracking-wide text-sage">Public profile</Text>
      <Text className="mt-1 text-sm text-savor/60">
        What buyers see on your listings and shop page.
      </Text>

      {loading && !loadError ? (
        <ActivityIndicator className="mt-6" color={colors.terracotta} />
      ) : loadError ? (
        <View className="mt-4">
          <ErrorRetry
            title="Couldn't load public profile"
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
          <View className="mb-4 flex-row items-center">
            {photo ? (
              <Image
                source={{ uri: photo }}
                contentFit="cover"
                className="h-20 w-20 rounded-full bg-map"
              />
            ) : (
              <View className="h-20 w-20 items-center justify-center rounded-full bg-map">
                <Ionicons name="storefront-outline" size={28} color={colors.sage} />
              </View>
            )}
            <Pressable
              onPress={pickPhoto}
              className="ml-4 flex-row items-center rounded-2xl border border-savor/15 bg-cream px-4 py-3">
              <Ionicons name="images-outline" size={18} color={colors.dark} />
              <Text className="ml-2 text-base font-semibold text-savor">
                {photo ? 'Change photo' : 'Add photo'}
              </Text>
            </Pressable>
          </View>

          <LabeledInput
            label="Bio"
            value={bio}
            onChangeText={(value) => {
              setBio(value);
              setSaved(false);
            }}
            placeholder="Tell buyers about your kitchen and what you make."
            multiline
          />

          {error ? (
            <Text className="mb-3 text-sm font-medium text-terracotta">{error}</Text>
          ) : null}
          {saved ? <Text className="mb-3 text-sm font-medium text-sage">Saved.</Text> : null}

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save public profile'}
            disabled={saving}
            onPress={save}
          />
        </View>
      )}
    </View>
  );
}
