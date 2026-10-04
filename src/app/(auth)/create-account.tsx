import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AuthField } from '@/components/auth-field';
import { colors } from '@/constants/theme';
import { useApp, type AppMode, type AppState } from '@/context/AppContext';

export default function CreateAccountScreen() {
  const { signUp, setMode, setState } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<AppMode>('buyer');
  const [phone, setPhone] = useState('');
  const [pickedState, setPickedState] = useState<AppState>('MI');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const canSubmit = email.trim().length > 0 && password.length > 0;

  function submit() {
    if (!canSubmit) {
      setError('Enter an email and password.');
      return;
    }
    // Mock/local auth — entering the app on any non-empty credentials.
    setMode(role);
    setState(pickedState);
    signUp(email, password);
  }

  return (
    <SafeAreaView className="flex-1 bg-savor">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName="px-6 pb-10 pt-6"
          keyboardShouldPersistTaps="handled">
          <Text className="text-[40px] font-semibold text-mint">Savor</Text>
          <Text className="mt-2 text-[18px] text-mint/70">
            Local food from people near you.
          </Text>

          <View className="mt-8 flex-row gap-2 rounded-full border border-white p-1">
            {(
              [
                { value: 'buyer', label: "I'm a buyer" },
                { value: 'maker', label: "I'm a seller" },
              ] as const
            ).map((option) => {
              const selected = role === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setRole(option.value)}
                  className="min-h-[48px] flex-1 items-center justify-center rounded-full bg-white">
                  <Text
                    className={`text-[15px] font-semibold ${
                      selected ? 'text-savor' : 'text-savor/45'
                    }`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-8">
            <AuthField
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthField
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError(null);
              }}
              secureTextEntry
            />
            <AuthField
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text className="mb-2 text-[15px] text-mint/80">State</Text>
            <Pressable
              onPress={() => setPickedState((current) => (current === 'MI' ? 'WY' : 'MI'))}
              className="mb-2 min-h-[52px] flex-row items-center justify-between rounded-full bg-white px-5">
              <Text className="text-[16px] text-cocoa">
                {pickedState === 'MI' ? 'Michigan' : 'Wyoming'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.cocoa} />
            </Pressable>
            <Text className="mb-5 text-[13px] leading-5 text-mint/45">
              Rules for what you can buy or sell depend on your state.
            </Text>

            <AuthField label="Street address" value={street} onChangeText={setStreet} />

            <View className="mb-5 flex-row gap-3">
              <View className="flex-[2]">
                <AuthField label="City" value={city} onChangeText={setCity} className="mb-0" />
              </View>
              <View className="flex-1">
                <AuthField
                  label="ZIP"
                  value={zip}
                  onChangeText={setZip}
                  keyboardType="number-pad"
                  className="mb-0"
                />
              </View>
            </View>

            {error ? (
              <Text className="mb-3 text-sm font-medium text-[#E8A598]">{error}</Text>
            ) : null}

            <Pressable
              onPress={submit}
              className="min-h-[56px] items-center justify-center rounded-full bg-white">
              <Text className="text-[17px] font-semibold text-savor">Create account</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.replace('/login')}
            className="mt-6 items-center py-2">
            <Text className="text-[15px] text-mint/70">
              Already have an account? <Text className="font-semibold text-mint">Log in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
