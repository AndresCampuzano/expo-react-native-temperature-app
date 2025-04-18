import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0ECC6' }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F0ECC6' },
          }}
        />
      </SafeAreaView>
    </>
  );
}
