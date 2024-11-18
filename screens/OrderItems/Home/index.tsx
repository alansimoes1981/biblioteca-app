import { View, KeyboardAvoidingView, Platform } from 'react-native';
import Text from 'components/Text';
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
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from 'types/IScreenNavigationProps';
import { useGetOrderItemsBySearch, useUpdateStatusOrderItem } from 'hooks/orderItems/useOrderItems';
import { IOrderItemOutput } from 'types/IOrderItems';
import dayjs from 'dayjs';

type ColumnType = {
  title: string;
  dataIndex: keyof IOrderItemOutput;
  width?: number;
  render?: (value: any) => React.ReactNode;
};

export default function OrderItemsHomeScreen() {
  const navigation = useNavigation<ScreenNavigationProps>();
  const toast = useToast();
  const {
    data: orderItems,
    mutate: getOrderItems,
    isLoading: loadingGet,
  } = useGetOrderItemsBySearch();
  const { mutate: updateStatusOrderItem } = useUpdateStatusOrderItem();

  useEffect(() => {
    getOrderItems({ status: undefined, studentName: '' });
  }, []);

  const validationSchema = Yup.object().shape({
    studentName: Yup.string(),
    status: Yup.string(),
  });

  const handleChangeStatus = (data?: IOrderItemOutput) => {
    if (data) {
      updateStatusOrderItem(
        { id: data.id, body: { status: !data.status } },
        {
          onSuccess: () => {
            toast.show({
              placement: 'top',
              render: () => {
                return (
                  <Box bg="emerald.600" px="2" py="1" rounded="sm" mb={5}>
                    Devolução realizada com sucesso
                  </Box>
                );
              },
            });
          },
          onError: () => {
            toast.show({
              placement: 'top',
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    Erro ao realizar devolução
                  </Box>
                );
              },
            });
          },
        }
      );
    }
  };

  const columns: ColumnType[] = [
    {
      title: 'Nome',
      dataIndex: 'id',
      width: 200,
      render: (value) => {
        const data: IOrderItemOutput | undefined = orderItems?.data?.find(
          (orderItem: any) => orderItem?.id === value
        );

        return (
          <View style={{ flexDirection: 'column', gap: 5 }}>
            <Text>{data?.student.name}</Text>
            <Text>{data?.student.class}</Text>
          </View>
        );
      },
    },
    {
      title: 'Livro',
      dataIndex: 'collection',
      width: 200,
      render: (value) => <Text>{value.title}</Text>,
    },
    {
      title: 'Periodo',
      dataIndex: 'id',
      width: 200,
      render: (value) => {
        const data: IOrderItemOutput | undefined = orderItems?.data?.find(
          (orderItem: any) => orderItem?.id === value
        );

        return (
          <View style={{ flexDirection: 'column', gap: 5 }}>
            <Text>{dayjs(data?.createdAt).format('DD/MM/YYYY')}</Text>
            <Text>{dayjs(data?.devolution_date).format('DD/MM/YYYY')}</Text>
          </View>
        );
      },
    },
    {
      title: 'Situação',
      dataIndex: 'status',
      width: 100,
      render: (value) => <Text>{value ? 'Emprestado' : 'Devolvido'}</Text>,
    },
    {
      title: 'Devolvido',
      dataIndex: 'id',
      width: 150,
      render: (value) => {
        const data: IOrderItemOutput | undefined = orderItems?.data?.find(
          (orderItem: any) => orderItem?.id === value
        );

        return (
          <View>
            <Switch
              defaultIsChecked={!data?.status}
              disabled={data?.status === false ? true : false}
              // isChecked={!value}
              onToggle={() => {
                handleChangeStatus(data);
              }}
              accessibilityLabel="Status Switch"
              size="lg"
              colorScheme="teal"
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

            getOrderItems({
              studentName,
              status: status !== '' ? status : undefined,
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <Box paddingX={'24px'} paddingY={'40px'}>
              <Box flex={1} width="100%" p={5} bg="white" rounded="xl">
                <Text size={30}>Empréstimos</Text>

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
                  <Select.Item label="Emprestado" value="true" />
                  <Select.Item label="Devolvido" value="false" />
                </Select>

                <View style={{ alignItems: 'flex-end', marginTop: 25 }}>
                  <Button width="100%" onPress={() => handleSubmit()}>
                    Buscar
                  </Button>

                  <Button
                    width="100%"
                    marginTop={3}
                    onPress={() => {
                      navigation.navigate('OrderItemCreate', { id: undefined });
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
                    {loadingGet && !orderItems ? (
                      <Center p={25}>
                        <Text>Carregando...</Text>
                      </Center>
                    ) : orderItems && orderItems.data?.length === 0 ? (
                      <Center p={25}>
                        <Text>Empréstimos não encontrados</Text>
                      </Center>
                    ) : (
                      orderItems?.data?.map((item: any) => (
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
