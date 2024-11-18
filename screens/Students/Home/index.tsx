import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import Text from 'components/Text';
import { useDeleteCollection } from 'hooks/Collections/useCollections';
import {
  Box,
  Button,
  Center,
  CheckIcon,
  Divider,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Select,
  Switch,
  useToast,
  VStack,
} from 'native-base';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from 'types/IScreenNavigationProps';
import { useGetStudentsBySearch } from 'hooks/Students/useStudents';
import { IStudentOutput } from 'types/IStudents';
import dayjs from 'dayjs';
import { FontAwesome } from '@expo/vector-icons';

type ColumnType = {
  title: string;
  dataIndex: keyof IStudentOutput;
  width?: number;
  render?: (value: any) => React.ReactNode;
};

export default function StudentsHomeScreen() {
  const navigation = useNavigation<ScreenNavigationProps>();
  const { data: students, mutate: getStudents } = useGetStudentsBySearch();

  useEffect(() => {
    getStudents({ status: undefined, studentName: '' });
  }, []);

  const validationSchema = Yup.object().shape({
    studentName: Yup.string(),
    status: Yup.string(),
  });

  const columns: ColumnType[] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Data Nasc.',
      dataIndex: 'brithday_date',
      width: 120,
      render: (value) => {
        return (
          <View>
            <Text>{dayjs(value).format('DD/MM/YYYY')}</Text>
          </View>
        );
      },
    },
    {
      title: 'Turma',
      dataIndex: 'class',
      width: 100,
    },
    {
      title: 'Situação',
      dataIndex: 'status',
      width: 100,
      render: (value) => <Text color="blue.500">{value ? 'Ativo' : 'Inativo'}</Text>,
    },
    {
      title: 'Ações',
      dataIndex: 'id',
      width: 150,
      render: (value) => {
        return (
          <View style={{ flexDirection: 'row', gap: 40 }}>
            <FontAwesome
              name="edit"
              size={25}
              color="blue"
              onPress={() => {
                navigation.navigate('StudentCreate', { id: value });
              }}
            />
          </View>
        );
      },
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{ studentName: '', status: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const { studentName, status } = values;
            getStudents({
              studentName,
              status: status !== '' ? status : undefined,
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <Box paddingX={'24px'} paddingY={'40px'}>
              <Box width="100%" p={5} bg="white" rounded="xl">
                <Text size={30}>Alunos</Text>

                <FormControl.Label style={{ marginTop: 10 }}>Nome aluno</FormControl.Label>
                <Input
                  onChangeText={handleChange('studentName')}
                  onBlur={handleBlur('studentName')}
                  value={values.studentName}
                  rounded="md"
                />
                <FormControl.Label>Situação</FormControl.Label>
                <Select
                  selectedValue={values.status}
                  placeholder="Selecione:"
                  _selectedItem={{
                    bg: 'cyan.600',
                    endIcon: <CheckIcon size="5" />,
                  }}
                  onValueChange={handleChange('status')}>
                  <Select.Item label="Selecione:" value={''} />
                  <Select.Item label="Ativo" value="true" />
                  <Select.Item label="Inativo" value="false" />
                </Select>

                <View style={{ alignItems: 'flex-end', marginTop: 25 }}>
                  <Button width="100%" onPress={() => handleSubmit()}>
                    Buscar
                  </Button>

                  <Button
                    width="100%"
                    marginTop={3}
                    onPress={() => {
                      navigation.navigate('StudentCreate', { id: undefined });
                    }}>
                    Cadastrar
                  </Button>
                </View>
              </Box>

              <Box flex={1} mt={8} p={5} width="100%" bg="white" rounded="xl">
                <ScrollView horizontal>
                  <VStack>
                    <HStack
                      bg="gray.200"
                      px={4}
                      py={2}
                      borderBottomWidth={1}
                      borderBottomColor="gray.500">
                      {columns.map((column, index) => (
                        <Center key={index} width={column.width} px={2}>
                          <Text>{column.title}</Text>
                        </Center>
                      ))}
                    </HStack>
                    <Divider />
                    {students && students.data?.length === 0 ? (
                      <Center p={25}>
                        <Text>Alunos não encontrados</Text>
                      </Center>
                    ) : (
                      students?.data?.map((item: any) => (
                        <HStack
                          key={item.id}
                          px={4}
                          py={2}
                          borderBottomWidth={1}
                          borderBottomColor="gray.200">
                          {columns.map((column, index) => (
                            <Center key={index} width={column.width} px={2}>
                              {column.render ? (
                                column.render(item[column.dataIndex])
                              ) : (
                                <Text key={index}>{item[column.dataIndex]}</Text>
                              )}
                            </Center>
                          ))}
                        </HStack>
                      ))
                    )}
                  </VStack>
                </ScrollView>
              </Box>
            </Box>
          )}
        </Formik>

        <Center></Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
