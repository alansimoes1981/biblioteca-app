import 'react-native-gesture-handler';
import AppNavigator from './navigation';
import { AuthProvider } from 'context/auth';
import { NativeBaseProvider } from 'native-base';
import queryClient from 'services/queryClient';
import { QueryClientProvider } from 'react-query';
import { OrientationLocker } from 'react-native-orientation-locker';
import React from 'react';

export default function App() {
  return (
    <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>
        <OrientationLocker orientation={'UNLOCK'} />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}
