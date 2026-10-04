import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/auth-field';
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
    router.replace('/');
  }

  return (
    <SafeAreaView className="flex-1 bg-savor">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 justify-center px-6">
          <Text className="text-[40px] font-semibold text-mint">Savor</Text>
          <Text className="mt-2 text-[18px] text-mint/70">Welcome back.</Text>

          <View className="mt-10">
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

            {error ? (
              <Text className="mb-3 text-sm font-medium text-[#E8A598]">{error}</Text>
            ) : null}

            <Pressable
              onPress={submit}
              className="mt-1 min-h-[56px] items-center justify-center rounded-full bg-white">
              <Text className="text-[17px] font-semibold text-savor">Log in</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.replace('/create-account')}
            className="mt-8 items-center py-2">
            <Text className="text-[15px] text-mint/70">
              Need an account? <Text className="font-semibold text-mint">Create account</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
