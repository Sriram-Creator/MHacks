import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LabeledInput } from '@/components/maker/labeled-input';
import { LegalBanner } from '@/components/maker/legal-banner';
import { PrimaryButton } from '@/components/maker/primary-button';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { createItem, generateListing, STATE_NAMES, type Legality } from '@/lib/api';
import { toDownscaledDataUrl } from '@/lib/image';

/** Splits a comma-separated string into a trimmed, non-empty list. */
function splitList(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

type Phase = 'idle' | 'loading' | 'form' | 'published' | 'error';

export default function MakerListScreen() {
  console.log('[maker] List item screen mounted');

  const { state } = useApp();
  const stateName = STATE_NAMES[state] ?? state;

  const [phase, setPhase] = useState<Phase>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [legality, setLegality] = useState<Legality | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Editable form fields.
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [capacity, setCapacity] = useState('');

  async function handleAsset(asset: ImagePicker.ImagePickerAsset) {
    setPreview(asset.uri);
    setPhase('loading');
    setError(null);
    try {
      const dataUrl = await toDownscaledDataUrl(asset);
      const listing = await generateListing(dataUrl, state);

      setName(listing.name);
      setCategory(listing.category);
      setPrice(String(listing.suggested_price));
      setDescription(listing.description);
      setIngredients(listing.ingredients.join(', '));
      setAllergens(listing.allergens.join(', '));
      setCapacity('12');
      setLegality(listing.legality);
      setPhase('form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setPhase('error');
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera needed', 'Allow camera access to photograph your product.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (!result.canceled) {
      handleAsset(result.assets[0]);
    }
  }

  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photos needed', 'Allow photo access to choose a product picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled) {
      handleAsset(result.assets[0]);
    }
  }

  function reset() {
    setPhase('idle');
    setPreview(null);
    setError(null);
    setLegality(null);
    setPublishError(null);
    setName('');
    setCategory('');
    setPrice('');
    setDescription('');
    setIngredients('');
    setAllergens('');
    setCapacity('');
  }

  async function publish() {
    setPublishing(true);
    setPublishError(null);
    try {
      await createItem({
        name,
        category,
        description,
        price: Number(price) || 0,
        ingredients: splitList(ingredients),
        allergens: splitList(allergens),
        left_this_week: Number(capacity) || 0,
        photo: preview ?? undefined,
      });
      setPhase('published');
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Could not publish.');
    } finally {
      setPublishing(false);
    }
  }

  // --- Loading ---------------------------------------------------------------
  if (phase === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-mint" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-6">
          {preview ? (
            <Image
              source={{ uri: preview }}
              contentFit="cover"
              className="h-48 w-48 rounded-[28px] bg-map"
            />
          ) : null}
          <ActivityIndicator className="mt-8" size="large" color={colors.dark} />
          <Text className="mt-4 text-xl font-semibold text-cocoa">Reading your product…</Text>
          <Text className="mt-1 text-sm text-cocoa/55">Writing a listing and checking the rules</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Published -------------------------------------------------------------
  if (phase === 'published') {
    return (
      <SafeAreaView className="flex-1 bg-mint" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full items-center rounded-[28px] bg-white p-8">
            <Ionicons name="checkmark-circle" size={56} color={colors.sage} />
            <Text className="mt-4 text-2xl font-semibold text-cocoa">{name} is live</Text>
            <Text className="mt-2 text-center text-base text-cocoa/60">
              Buyers near you can now add it to their meetup box.
            </Text>
            <View className="mt-6 w-full">
              <PrimaryButton label="List another" onPress={reset} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --- Idle / Error / Form ---------------------------------------------------
  const showForm = phase === 'form';
  const isLegal = legality?.is_legal ?? false;

  return (
    <SafeAreaView className="flex-1 bg-mint" edges={['bottom']}>
      <ScrollView contentContainerClassName="px-5 pb-10 pt-2" keyboardShouldPersistTaps="handled">
        {preview && showForm ? (
          <Image
            source={{ uri: preview }}
            contentFit="cover"
            className="h-44 w-full rounded-[22px] bg-map"
          />
        ) : null}

        {!showForm ? (
          <View className="mt-4 gap-3">
            <Text className="text-base leading-6 text-cocoa/60">
              Snap a photo and we&apos;ll draft the listing and check if it&apos;s legal to sell.
            </Text>
            <Pressable
              onPress={takePhoto}
              className="min-h-[56px] flex-row items-center justify-center rounded-full bg-savor px-5">
              <Ionicons name="camera" size={22} color={colors.mint} />
              <Text className="ml-3 text-lg font-semibold text-mint">Take a photo</Text>
            </Pressable>
            <Pressable
              onPress={pickFromLibrary}
              className="min-h-[56px] flex-row items-center justify-center rounded-full bg-white px-5">
              <Ionicons name="images-outline" size={22} color={colors.cocoa} />
              <Text className="ml-3 text-lg font-semibold text-cocoa">Choose from library</Text>
            </Pressable>
          </View>
        ) : null}

        {phase === 'error' ? (
          <View className="mt-6 rounded-[22px] bg-white p-5">
            <Text className="text-base font-semibold text-terracotta">Couldn&apos;t read that</Text>
            <Text className="mt-1 text-sm leading-5 text-cocoa/70">{error}</Text>
            <Text className="mt-2 text-xs text-cocoa/45">
              Make sure the Savor server is running, then try again.
            </Text>
          </View>
        ) : null}

        {showForm ? (
          <View className="mt-6">
            <LabeledInput label="Name" value={name} onChangeText={setName} />
            <LabeledInput label="Category" value={category} onChangeText={setCategory} />
            <LabeledInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
            <LabeledInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <LabeledInput
              label="Ingredients"
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="Comma separated"
              multiline
            />
            <LabeledInput
              label="Allergens"
              value={allergens}
              onChangeText={setAllergens}
              placeholder="None"
            />
            <LabeledInput
              label="Quantity this week"
              value={capacity}
              onChangeText={(value) => setCapacity(value.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              placeholder="How many you can make"
            />

            {legality ? (
              <View className="mb-4">
                <LegalBanner
                  isLegal={isLegal}
                  stateName={stateName}
                  reason={legality.reason}
                />
              </View>
            ) : null}

            {publishError ? (
              <Text className="mb-3 text-sm font-medium text-terracotta">{publishError}</Text>
            ) : null}

            <PrimaryButton
              label={
                publishing ? 'Publishing…' : isLegal ? 'Publish' : 'Not allowed to publish'
              }
              disabled={!isLegal || publishing}
              onPress={publish}
            />
            <Pressable onPress={reset} className="mt-4 items-center py-2">
              <Text className="text-base font-semibold text-cocoa/40">Start over</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
