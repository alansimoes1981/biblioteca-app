import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Text from 'components/Text';
import { stylesRegister } from './styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Button, FormControl, Input, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { IBodyRegister } from 'types/IAuth';
import { ServiceAuth } from 'services/auth';
type ScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string().email('Digite um email válido').required('O email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha precisa ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
  telephone: Yup.string().required('O telefone é obrigatório'),
});

const RegisterScreen = () => {
  const navigation = useNavigation<ScreenNavigationProps>();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (values: IBodyRegister) => {
    setLoading(true);
    try {
      const dataUser = await ServiceAuth.register(values);

      if (dataUser) {
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Box bg="emerald.600" px="2" py="1" rounded="sm" mb={5}>
                Cadastro realizado com sucesso
              </Box>
            );
          },
        });
        navigation.navigate('SignIn');
        return;
      }
    } catch (error) {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
              Erro ao realizar cadastro
            </Box>
          );
        },
      });
    } finally {
      setLoading(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={{ name: '', email: '', password: '', telephone: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleRegister({ ...values, school: 'E.M PROFESSORA NICE DE ALMEIDA MUNIZ' });
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={stylesRegister.container}>
            <View style={stylesRegister.containerTitle}>
              <Text size={28}>Cadastro</Text>
              <Text size={14}>Faça cadastro para ter acesso ao sistema</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <FormControl.Label>Nome</FormControl.Label>
              <Input
                rounded={'md'}
                placeholder="Nome"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                keyboardType="default"
              />
              {touched.name && errors.name && (
                <Text style={stylesRegister.errorText}>{errors.name}</Text>
              )}
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
                <Text style={stylesRegister.errorText}>{errors.email}</Text>
              )}
              <FormControl.Label>Senha</FormControl.Label>
              <Input
                rounded={'md'}
                placeholder="Senha"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={stylesRegister.errorText}>{errors.password}</Text>
              )}

              <FormControl.Label>Telefone</FormControl.Label>
              <Input
                rounded={'md'}
                variant="outline"
                placeholder="Telefone"
                onChangeText={handleChange('telephone')}
                onBlur={handleBlur('telephone')}
                value={values.telephone}
                keyboardType="phone-pad"
              />
              {touched.telephone && errors.telephone && (
                <Text style={stylesRegister.errorText}>{errors.telephone}</Text>
              )}

              <View style={stylesRegister.createAccount}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignIn');
                  }}>
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                    Acessar conta existente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={stylesRegister.containerButton}>
              <Button
                isLoading={loading}
                isLoadingText="Cadastrando"
                onPress={() => {
                  handleSubmit();
                }}>
                Cadastrar
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default RegisterScreen;
