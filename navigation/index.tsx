import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import Text from 'components/Text';
import Menu from 'components/Menu';
import SignInScreen from '../screens/SignIn';
import { useAuth } from 'context/auth';
import RegisterScreen from 'screens/Register';
import { Box, useToast } from 'native-base';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import React, { useEffect } from 'react';
import CollectionHomeScreen from '../screens/Collections/Home';
import { LogBox } from 'react-native';
import CollectionCreateScreen from 'screens/Collections/Create';
import OrderItemsHomeScreen from 'screens/OrderItems/Home';
import OrderItemCreateScreen from 'screens/OrderItems/Create';
import StudentsHomeScreen from 'screens/Students/Home';
import StudentCreateScreen from 'screens/Students/Create';

dayjs.extend(utc);
dayjs.extend(timezone);

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  Register: undefined;
  Details: { name: string };
  CollectionsHome: any;
  CollectionsCreate: { id?: string };
  OrderItemsHome: undefined;
  OrderItemCreate: { id?: string };
  StudentsHome: undefined;
  StudentCreate: { id?: string };
};

const AuthenticatedStack = createStackNavigator();
const UnauthenticatedStack = createStackNavigator();

const UnauthenticatedNavigator = () => (
  <UnauthenticatedStack.Navigator>
    <UnauthenticatedStack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        headerLeft: () => <Menu options={[]} />,
        headerTitle: () => (
          <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
            Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
          </Text>
        ),
        headerStyle: { backgroundColor: '#0B5B8C' },
        headerTitleStyle: { color: '#fff' },
      }}
    />
    <UnauthenticatedStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        headerLeft: () => <Menu options={[]} />,
        headerTitle: () => (
          <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
            Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
          </Text>
        ),
        headerStyle: { backgroundColor: '#0B5B8C' },
        headerTitleStyle: { color: '#fff' },
      }}
    />
  </UnauthenticatedStack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Função de logout
  const toast = useToast();

  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
      'Encountered two children with the same key, `.$.$.$id`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.',
    ]);
  }, []);

  const AuthenticatedNavigator = () => {
    // useEffect(() => {
    //   if (isAuthenticated && user) {
    //     const { exp } = user;

    //     if (exp) {
    //       const expirationTime = dayjs.unix(exp).tz('America/Sao_Paulo');
    //       const now = dayjs().tz('America/Sao_Paulo');

    //       if (now.isAfter(expirationTime)) {
    //         toast.show({
    //           placement: 'top',
    //           render: () => (
    //             <Box bg="emerald.600" px="2" py="1" rounded="sm" mb={5}>
    //               Seu acesso expirou. Faça login!
    //             </Box>
    //           ),
    //         });
    //         logout();
    //         return;
    //       }
    //       console.log('TOKEN TA FUNCIONANDO');
    //     }
    //   }
    // }, [isAuthenticated, user]);

    return (
      <AuthenticatedStack.Navigator>
        <AuthenticatedStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />
        <AuthenticatedStack.Screen
          name="CollectionsHome"
          component={CollectionHomeScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />

        <AuthenticatedStack.Screen
          name="CollectionsCreate"
          component={CollectionCreateScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />

        <AuthenticatedStack.Screen
          name="OrderItemsHome"
          component={OrderItemsHomeScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />

        <AuthenticatedStack.Screen
          name="OrderItemCreate"
          component={OrderItemCreateScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />

        <AuthenticatedStack.Screen
          name="StudentsHome"
          component={StudentsHomeScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />

        <AuthenticatedStack.Screen
          name="StudentCreate"
          component={StudentCreateScreen}
          options={{
            headerLeft: () => <Menu />,
            headerTitle: () => (
              <Text size={18} color="#fff" style={{ textAlign: 'center' }}>
                Biblioteca E.M PROFESSORA NICE DE ALMEIDA MUNIZ
              </Text>
            ),
            headerStyle: { backgroundColor: '#0B5B8C' },
            headerTitleStyle: { color: '#fff' },
          }}
        />
      </AuthenticatedStack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
