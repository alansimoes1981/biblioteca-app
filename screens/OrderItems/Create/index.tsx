import React, { useEffect, useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Text from 'components/Text';
import { stylesCreateOrderItem } from './styles';
import { CheckIcon, FormControl, ScrollView, Select, useToast } from 'native-base';
import { Box, Input, FlatList, Pressable, VStack, Modal, Button } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenNavigationProps, SreenRouteProp } from 'types/IScreenNavigationProps';
import { useCreateCollection, useGetCollectionsByStatus } from 'hooks/Collections/useCollections';
import { ICollectionOutput } from 'types/ICollections';
import { useGetStudentsByStatus } from 'hooks/Students/useStudents';
import { IStudentOutput } from 'types/IStudents';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useCreateOrderItem } from 'hooks/orderItems/useOrderItems';

const validationSchema = Yup.object().shape({});

const OrderItemCreateScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProps>();
  const { mutate: createOrderItem, isLoading: loadingCreate } = useCreateOrderItem();
  const { data: collectionActive, mutate: getCollectionsActive } = useGetCollectionsByStatus();
  const { data: studentsActive } = useGetStudentsByStatus(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCollections, setFilteredCollections] = useState<ICollectionOutput[] | undefined>(
    undefined
  );
  const [selectedCollection, setSelectedCollection] = useState<ICollectionOutput | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<IStudentOutput[] | undefined>(
    studentsActive?.data ? studentsActive?.data : undefined
  );
  const [selectedStudent, setSelectedStudent] = useState<IStudentOutput | null>(null);
  const [showModalColletion, setShowModalCollection] = useState(false);
  const [showModalStudent, setShowModalStudent] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(dayjs(date).format('DD/MM/YYYY'));
  const toast = useToast();

  useEffect(() => {
    getCollectionsActive(true);
  }, []);

  const handleChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(dayjs(currentDate).format('DD/MM/YYYY'));
  };

  const handleSearchCollections = (text: string) => {
    setSearchTerm(text);
    setFilteredCollections(
      collectionActive?.data?.filter((option) =>
        option?.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  // Função para selecionar uma opção
  const handleSelectCollection = (option: ICollectionOutput) => {
    setSelectedCollection(option);
    setShowModalCollection(false); // Fecha o modal após a seleção
  };

  const handleSearchStudents = (text: string) => {
    setSearchTerm(text);
    setFilteredStudents(
      studentsActive?.data?.filter((option) =>
        option?.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  // Função para selecionar uma opção
  const handleSelectStudent = (option: IStudentOutput) => {
    setSelectedStudent(option);
    setShowModalStudent(false); // Fecha o modal após a seleção
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (selectedCollection?.id && selectedStudent?.id && date) {
              createOrderItem(
                {
                  status: true,
                  collection_id: selectedCollection?.id,
                  student_id: selectedStudent.id,
                  devolution_date: date,
                },
                {
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
                  },
                  onError: () => {
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
                  },
                }
              );
            }
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setValues }) => {
            return (
              <Box flex={1} paddingX={'24px'} paddingY={'40px'}>
                <Box flex={0.85} width="100%" bg="white" p={5} rounded="xl">
                  <View style={stylesCreateOrderItem.containerTitle}>
                    <Text size={28}>Cadastrar Empréstimo</Text>
                    <Text size={14} style={{ marginBottom: 10 }}>
                      Preencha os campos para cadastrar:
                    </Text>
                  </View>

                  <Box>
                    <FormControl.Label>Nome do Aluno</FormControl.Label>
                    <Pressable onPress={() => setShowModalStudent(true)}>
                      <Box
                        borderWidth={1}
                        borderRadius="md"
                        borderColor="gray.300"
                        p={3}
                        bg="white">
                        <Text>
                          {selectedStudent ? selectedStudent.name : 'Selecione uma opção'}
                        </Text>
                      </Box>
                    </Pressable>
                    {!selectedStudent && (
                      <Text
                        style={{
                          color: 'red',
                          marginBottom: 10,
                        }}>
                        Campo obrigatório
                      </Text>
                    )}

                    {/* Modal para busca e seleção */}
                    <Modal
                      isOpen={showModalStudent}
                      onClose={() => {
                        setShowModalStudent(false);
                        setFilteredStudents(undefined);
                        setSearchTerm('');
                      }}
                      size="lg">
                      <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Buscar e Selecionar</Modal.Header>
                        <Modal.Body>
                          <VStack space={4}>
                            <Input placeholder="Buscar..." onChangeText={handleSearchStudents} />
                            <FlatList
                              data={filteredStudents}
                              nestedScrollEnabled
                              keyExtractor={(item) => item.id.toString()}
                              renderItem={({ item }) => (
                                <View key={item.id}>
                                  <Box flex={1} width="100%" rounded="xl">
                                    <Pressable onPress={() => handleSelectStudent(item)}>
                                      <Box
                                        py={2}
                                        px={4}
                                        borderWidth={1}
                                        rounded={'md'}
                                        borderColor="gray.400">
                                        <Text>{item.name}</Text>
                                      </Box>
                                    </Pressable>{' '}
                                  </Box>
                                </View>
                              )}
                            />
                          </VStack>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            onPress={() => {
                              setFilteredStudents(undefined);
                              setShowModalStudent(false);
                              setSearchTerm('');
                            }}>
                            Fechar
                          </Button>
                        </Modal.Footer>
                      </Modal.Content>
                    </Modal>
                  </Box>

                  <Box>
                    <FormControl.Label>Titulo do Livro</FormControl.Label>
                    <Pressable onPress={() => setShowModalCollection(true)}>
                      <Box
                        borderWidth={1}
                        borderRadius="md"
                        borderColor="gray.300"
                        p={3}
                        bg="white">
                        <Text>
                          {selectedCollection ? selectedCollection.title : 'Selecione uma opção'}
                        </Text>
                      </Box>
                    </Pressable>
                    {!selectedCollection && (
                      <Text
                        style={{
                          color: 'red',
                          marginBottom: 10,
                        }}>
                        Campo obrigatório
                      </Text>
                    )}

                    {/* Modal para busca e seleção */}
                    <Modal
                      isOpen={showModalColletion}
                      onClose={() => {
                        setShowModalCollection(false);
                        setFilteredCollections(undefined);
                        setSearchTerm('');
                      }}
                      size="lg">
                      <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Buscar e Selecionar</Modal.Header>
                        <Modal.Body>
                          <VStack space={4}>
                            <Input placeholder="Buscar..." onChangeText={handleSearchCollections} />
                            <FlatList
                              nestedScrollEnabled
                              data={filteredCollections}
                              keyExtractor={(item) => item.id.toString()}
                              renderItem={({ item }) => (
                                <Pressable pt={6} onPress={() => handleSelectCollection(item)}>
                                  <Box
                                    py={2}
                                    px={4}
                                    borderWidth={1}
                                    rounded={'md'}
                                    borderColor="gray.400">
                                    <Text>{item.title}</Text>
                                  </Box>
                                </Pressable>
                              )}
                            />
                          </VStack>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            onPress={() => {
                              setShowModalCollection(false);
                              setFilteredCollections(undefined);
                              setSearchTerm('');
                            }}>
                            Fechar
                          </Button>
                        </Modal.Footer>
                      </Modal.Content>
                    </Modal>
                  </Box>

                  <Box>
                    <FormControl.Label>Data de devolução</FormControl.Label>
                    <VStack space={4}>
                      <Pressable onPressIn={() => setShowPicker(true)}>
                        <Input isReadOnly value={formattedDate} placeholder="Selecione a data" />
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
                        <Modal isOpen={showPicker} onClose={() => setShowPicker(false)} size="md">
                          <Modal.Content>
                            <Modal.Header>Selecionar Data</Modal.Header>
                            <Modal.Body>
                              <DateTimePicker
                                value={date}
                                mode="date"
                                display="spinner"
                                onChange={handleChange}
                                minimumDate={new Date()}
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
                          value={date}
                          mode="date"
                          display="default"
                          minimumDate={new Date()}
                          onChange={(event: any, selectedDate: any) => {
                            setShowPicker(false);
                            handleChangeDate(event, selectedDate);
                          }}
                        />
                      )}
                    </VStack>
                  </Box>

                  <View style={stylesCreateOrderItem.containerButton}>
                    <Button onPress={() => navigation.navigate('OrderItemsHome')}>Voltar</Button>
                    <Button
                      isLoading={loadingCreate}
                      isLoadingText={'Cadastrando'}
                      onPress={() => handleSubmit()}>
                      Cadastrar
                    </Button>
                  </View>
                </Box>
              </Box>
            );
          }}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OrderItemCreateScreen;
