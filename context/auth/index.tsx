import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceAuth } from 'services/auth';
import { IBodyLogin, IUser } from 'types/IAuth';
import { Box, useToast } from 'native-base';
import { ScreenNavigationProps } from 'types/IScreenNavigationProps';
import { useNavigation } from '@react-navigation/native';

interface AuthContextType {
  accessToken: string | null;
  signIn: ({ email, password }: IBodyLogin) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user?: { exp: number; iat: number; name: string };
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ exp: number; iat: number; name: string } | undefined>(
    undefined
  );
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const dataUser = await ServiceAuth.signIn({ email, password });

      if (dataUser.data?.accessToken) {
        const token = dataUser.data.accessToken;
        const arrayToken = token.split('.');
        const userData = JSON.parse(atob(arrayToken[1]));

        setAccessToken(token);
        setUser(userData);

        AsyncStorage.setItem('accessToken', JSON.stringify(token));
        AsyncStorage.setItem('user', JSON.stringify(dataUser));

        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Box bg="emerald.600" px="2" py="1" rounded="sm" mb={5}>
                Login realizado com sucesso
              </Box>
            );
          },
        });
        return;
      }
    } catch (error) {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
              Email ou senha incorretos
            </Box>
          );
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(undefined);
    setAccessToken(null);
    await AsyncStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (storedToken) {
        setAccessToken(storedToken);
        return;
      }
    };
    const loadUser = async () => {
      const dataUser = await AsyncStorage.getItem('user');
      if (dataUser) {
        setUser(JSON.parse(dataUser));
        return;
      }
    };

    loadToken();
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        signIn,
        logout,
        isAuthenticated: !!accessToken,
        user,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
