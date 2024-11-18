import React, { useEffect, useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Text from 'components/Text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { stylesCreateStudent } from './styles';
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Select,
  useToast,
  VStack,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenNavigationProps, SreenRouteProp } from 'types/IScreenNavigationProps';
import dayjs from 'dayjs';
import * as Localization from 'expo-localization';
import { useCreateStudent, useGetStudentById, useUpdateStudent } from 'hooks/Students/useStudents';

dayjs.locale(Localization.locale.startsWith('pt') ? 'pt-br' : 'en');

const validationSchema = Yup.object().shape({
  name: Yup.string().required('O Nome é obrigatório'),
  status: Yup.string().required('O status é obrigatório'),
  email: Yup.string().email('Digite um email válido').required('O email é obrigatório'),
  class: Yup.string().required('A turma é obrigatório'),
});

const StudentCreateScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProps>();
  const { mutate: createStudent, isLoading: loadingCreate } = useCreateStudent();
  const { mutate: updateStudent, isLoading: loadingUpdate } = useUpdateStudent();
  const router = useRoute<SreenRouteProp>();
  const id = useMemo(() => router?.params?.id, [router]);
  const isEdit = useMemo(() => {
    return id !== undefined ? true : false;
  }, [id]);
  const toast = useToast();
  const { data: student, isLoading: loadingStudent } = useGetStudentById(id);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(dayjs(date).format('DD/MM/YYYY'));

  const handleChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(dayjs(currentDate).format('DD/MM/YYYY'));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            name: '',
            email: '',
            status: '',
            class: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const bodyCreate = {
              ...values,
              status: values.status === 'true' ? true : false,
              brithday_date: date,
              school: 'E.M PROFESSORA NICE DE ALMEIDA MUNIZ',
            };
            if (isEdit) {
              const bodyEdit = {
                name: values.name,
                class: values.class,
                status: values.status === 'true' ? true : false,
                brithday_date: date,
                school: 'E.M PROFESSORA NICE DE ALMEIDA MUNIZ',
              };
              updateStudent(
                { id: id, body: bodyEdit },
                {
                  onSuccess: () => {
                    toast.show({
                      placement: 'top',
                      render: () => {
                        return (
                          <Box bg="emerald.600" px="2" py="1" rounded="sm" mb={5}>
                            Edição realizada com sucesso
                          </Box>
                        );
                      },
                    });
                    navigation.navigate('StudentsHome');
                  },
                  onError: () => {
                    toast.show({
                      placement: 'top',
                      render: () => {
                        return (
                          <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                            Erro ao realizar operação
                          </Box>
                        );
                      },
                    });
                  },
                }
              );
              return;
            }
            createStudent(bodyCreate, {
              onSuccess: () => {
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
                navigation.navigate('StudentsHome');
              },
              onError: () => {
                toast.show({
                  placement: 'top',
                  render: () => {
                    return (
                      <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                        Erro ao realizar operação
                      </Box>
                    );
                  },
                });
              },
            });
            console.log(values);
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setValues }) => {
            useEffect(() => {
              if (student?.data && isEdit) {
                setDate(student.data.brithday_date);
                setFormattedDate(dayjs(student.data.brithday_date).format('DD/MM/YYYY'));

                const values = {
                  ...student.data,
                  status: String(student.data.status),
                  email: student.data.email,
                };
                setValues(values);
                return;
              }
            }, [student]);

            return (
              <Box paddingX={'24px'} paddingY={'40px'}>
                {!student && loadingStudent ? (
                  <Text size={28}> Carregando...</Text>
                ) : (
                  <Box flex={1} width="100%" bg="white" p={5} rounded="xl">
                    <View style={stylesCreateStudent.containerTitle}>
                      <Text size={28}>{isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}</Text>
                      <Text size={14} style={{ marginBottom: 10 }}>
                        {isEdit
                          ? 'Preencha os campos para editar o aluno:'
                          : 'Preencha os campos para cadastrar um novo aluno:'}
                      </Text>
                    </View>
                    <View>
                      <Box>
                        <FormControl.Label>Nome do Aluno</FormControl.Label>
                        <Input
                          rounded="md"
                          placeholder="Nome"
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                        />
                        {touched.name && errors.name && (
                          <Text style={stylesCreateStudent.errorText}>{errors.name}</Text>
                        )}
                      </Box>

                      <Box>
                        <FormControl.Label>Data de Nascimento</FormControl.Label>
                        <VStack space={4}>
                          <Pressable onPressIn={() => setShowPicker(true)}>
                            <Input
                              isReadOnly
                              value={formattedDate}
                              placeholder="Selecione a data"
                            />
                          </Pressable>
                          {!formattedDate && (
                            <Text
                              style={{
                                color: 'red',
                                marginBottom: 10,
                              }}>
                              Campo obrigatório
                            </Text>
                          )}

                          {Platform.OS === 'ios' && (
                            <Modal
                              isOpen={showPicker}
                              onClose={() => setShowPicker(false)}
                              size="md">
                              <Modal.Content>
                                <Modal.Header>Selecionar Data</Modal.Header>
                                <Modal.Body>
                                  <DateTimePicker
                                    locale="pt-br"
                                    maximumDate={date}
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChange}
                                  />
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button onPress={() => setShowPicker(false)}>Confirmar</Button>
                                </Modal.Footer>
                              </Modal.Content>
                            </Modal>
                          )}

                          {Platform.OS === 'android' && showPicker && (
                            <DateTimePicker
                              locale="pt-br"
                              maximumDate={date}
                              value={date}
                              mode="date"
                              display="default"
                              onChange={(event: any, selectedDate: any) => {
                                setShowPicker(false);
                                handleChangeDate(event, selectedDate);
                              }}
                            />
                          )}
                        </VStack>
                      </Box>

                      <View style={stylesCreateStudent.containerInputRow}>
                        <View style={stylesCreateStudent.containerInputLabel}>
                          <FormControl.Label>Status</FormControl.Label>
                          <Select
                            selectedValue={values.status}
                            placeholder="Selecione:"
                            _selectedItem={{
                              bg: 'cyan.600',
                              endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={handleChange('status')}
                            // onBlur={handleBlur('status')}
                          >
                            <Select.Item label="Ativo" value="true" />
                            <Select.Item label="Inativo" value="false" />
                          </Select>

                          {touched.status && errors.status && (
                            <Text style={stylesCreateStudent.errorText}>{errors.status}</Text>
                          )}
                        </View>
                        <View style={stylesCreateStudent.containerInputLabel}>
                          <FormControl.Label>Turma</FormControl.Label>
                          <Input
                            rounded="md"
                            placeholder="Turma"
                            onChangeText={handleChange('class')}
                            onBlur={handleBlur('class')}
                            value={values.class.toString()}
                          />
                          {touched.class && errors.class && (
                            <Text style={stylesCreateStudent.errorText}>{errors.class}</Text>
                          )}
                        </View>
                      </View>
                      <Box>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input
                          isDisabled={isEdit}
                          rounded="md"
                          placeholder="Email"
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                        />
                        {touched.email && errors.email && (
                          <Text style={stylesCreateStudent.errorText}>{errors.email}</Text>
                        )}
                      </Box>
                    </View>

                    <View style={stylesCreateStudent.containerButton}>
                      <Button onPress={() => navigation.navigate('StudentsHome')}>Voltar</Button>
                      <Button
                        isLoading={isEdit ? loadingUpdate : loadingCreate}
                        isLoadingText={isEdit ? 'Editando' : 'Cadastrando'}
                        onPress={() => handleSubmit()}>
                        {isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}
                      </Button>
                    </View>
                  </Box>
                )}
              </Box>
            );
          }}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentCreateScreen;
