import React, { useState } from 'react';
import { View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Box, Button, FormControl, Icon, Input, useToast } from 'native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'context/auth';
import Text from 'components/Text';
import { stylesSignIn } from './styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { MaterialIcons } from '@expo/vector-icons';
type ScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Digite um email válido').required('O email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha precisa ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
});

const SignInScreen = () => {
  const { signIn, loading } = useAuth();
  const navigation = useNavigation<ScreenNavigationProps>();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          signIn(values);
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={stylesSignIn.container}>
            <View style={stylesSignIn.containerTitle}>
              <Text size={28}>Login</Text>
              <Text size={14}>Faça login para acessar o sistema</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Box>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  rounded={'md'}
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={stylesSignIn.errorText}>{errors.email}</Text>
                )}
              </Box>

              <Box>
                <FormControl.Label>Senha</FormControl.Label>
                <Input
                  rounded={'md'}
                  placeholder="Senha"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={!showPassword}
                  InputRightElement={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Icon
                        as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />}
                        size={5}
                        mr={2}
                        color="muted.400"
                      />
                    </Pressable>
                  }
                />
                {touched.password && errors.password && (
                  <Text style={stylesSignIn.errorText}>{errors.password}</Text>
                )}
              </Box>

              <View style={stylesSignIn.createAccount}>
                <TouchableOpacity
                  onPress={() => {
                    toast.show({
                      placement: 'top',
                      render: () => {
                        return (
                          <Box bg="error.600" px="5" py="4" rounded="sm" mb={5} color={'white'}>
                            Entre em contato com o departamento de TI para resetar a senha.
                          </Box>
                        );
                      },
                    });
                  }}>
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                    Esqueci minha conta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Register');
                  }}>
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                    Criar uma conta
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={stylesSignIn.containerButton}>
              <Button
                isLoading={loading}
                isLoadingText="Entrando"
                onPress={() => {
                  handleSubmit();
                }}>
                Entrar
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default SignInScreen;
