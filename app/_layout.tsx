import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#091857' : '#F0ECC6';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor, color: textColor },
          }}
        />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

