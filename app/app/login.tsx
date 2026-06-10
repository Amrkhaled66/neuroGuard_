import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import logo from '@assets/images/logo.png';
import { useAuth } from '@features/auth/context/useAuth';
import { useLoginForm } from '@features/auth/hooks/useLoginForm';
import { StatusBar } from "expo-status-bar";
export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { values, errors, submitLabel, isPending, handleChange, handleSubmit } = useLoginForm();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/(tabs)' as never);
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#0e3b31" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-background">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 items-center justify-center bg-brand-primary">
          <View className="h-[40%] items-center justify-center">
            <Image source={logo} resizeMode="contain" className="size-80" />
          </View>

          <View className="flex-1 w-full bg-app-background">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="flex-grow px-6 py-8">
              <View className="flex-1">
                <Text className="text-[30px] font-bold leading-9 text-brand-secondary">
                  Welcome back
                </Text>

                <Text className="mt-3 text-base leading-6 text-text-secondary">
                  Log in to continue monitoring your health
                </Text>

                <View className="mt-8 gap-4">
                  <View>
                    <Text className="mb-2 text-sm font-semibold text-text-primary">
                      Medical ID
                    </Text>

                    <TextInput
                      autoCapitalize="characters"
                      autoCorrect={false}
                      placeholder="NG-99231"
                      placeholderTextColor="#708078"
                      value={values.medicalId}
                      onChangeText={(value) => handleChange('medicalId', value)}
                      className="min-h-13.5 rounded-[18px] border border-border-subtle bg-white px-4 text-base text-text-primary"
                    />

                    {errors.medicalId ? (
                      <Text className="mt-2 text-sm text-status-danger">{errors.medicalId}</Text>
                    ) : null}
                  </View>

                  <View>
                    <Text className="mb-2 text-sm font-semibold text-text-primary">
                      Password
                    </Text>

                    <TextInput
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Enter your password"
                      placeholderTextColor="#708078"
                      value={values.password}
                      onChangeText={(value) => handleChange('password', value)}
                      className="min-h-13.5 rounded-[18px] border border-border-subtle bg-white px-4 text-base text-text-primary"
                    />

                    {errors.password ? (
                      <Text className="mt-2 text-sm text-status-danger">{errors.password}</Text>
                    ) : null}
                  </View>
                </View>

                <Pressable
                  disabled={isPending}
                  onPress={handleSubmit}
                  className={`mt-8 min-h-13.5 flex-row items-center justify-center rounded-[18px] ${isPending ? 'bg-brand-primary/70' : 'bg-brand-primary'
                    }`}>
                  {isPending ? <ActivityIndicator size="small" color="#14211c" /> : null}

                  <Text className="ml-2 text-base font-bold text-white">{submitLabel}</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
