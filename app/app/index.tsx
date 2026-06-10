import { ActivityIndicator, Image, View } from 'react-native';
import logo from '@assets/images/logo.png';
import { useAuthBootstrap } from '@features/auth/hooks/useAuthBootstrap';

export default function SplashScreen() {
  const { isBootstrapping } = useAuthBootstrap();

  return (
    <View className="flex-1 bg-brand-primary">
      <View className="flex-1 items-center justify-center px-8">
        <Image source={logo} resizeMode="contain" className="size-70" />
        <ActivityIndicator
          size="small"
          color="#0e3b31"
          className={`mt-6 ${isBootstrapping ? 'opacity-100' : 'opacity-0'}`}
        />
      </View>
    </View>
  );
}
