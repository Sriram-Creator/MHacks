import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LabeledInput } from '@/components/labeled-input';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { useApp } from '@/context/AppContext';

export default function CreateAccountScreen() {
  const { signUp } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  function submit() {
    if (!canSubmit) {
      setError('Enter an email and password.');
      return;
    }
    // Mock/local auth — entering the app on any non-empty credentials.
    signUp(email, password);
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 justify-center px-6">
          <Text className="text-[32px] font-semibold text-savor">Create account</Text>
          <Text className="mt-2 text-base text-savor/70">
            Join Savor to buy and sell local cottage foods.
          </Text>

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
              placeholder="Choose a password"
              secureTextEntry
            />

            {error ? (
              <Text className="mb-3 text-sm font-medium text-terracotta">{error}</Text>
            ) : null}

            <PrimaryButton label="Create account" onPress={submit} />
          </View>

          <Pressable
            onPress={() => router.replace('/login')}
            className="mt-6 items-center py-2">
            <Text className="text-base text-savor/60">
              Already have an account?{' '}
              <Text className="font-semibold text-terracotta">Log in</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
