import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LabeledInput } from '@/components/labeled-input';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  function submit() {
    if (!canSubmit) {
      setError('Enter your email and password.');
      return;
    }
    // Mock/local auth — entering the app on any non-empty credentials.
    signIn(email, password);
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 justify-center px-6">
          <Text className="text-[32px] font-semibold text-savor">Welcome back</Text>
          <Text className="mt-2 text-base text-savor/70">Log in to your Savor account.</Text>

          <View className="mt-8">
            <LabeledInput
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(null);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <LabeledInput
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError(null);
              }}
              placeholder="Your password"
              secureTextEntry
            />

            {error ? (
              <Text className="mb-3 text-sm font-medium text-terracotta">{error}</Text>
            ) : null}

            <PrimaryButton label="Log in" onPress={submit} />
          </View>

          <Pressable
            onPress={() => router.replace('/create-account')}
            className="mt-6 items-center py-2">
            <Text className="text-base text-savor/60">
              Don&apos;t have an account?{' '}
              <Text className="font-semibold text-terracotta">Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
