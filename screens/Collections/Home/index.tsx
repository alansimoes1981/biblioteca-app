import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Text from 'components/Text';
import {
  useDeleteCollection,
  useGetAllCollections,
  useGetCollectionsBySearch,
} from 'hooks/Collections/useCollections';
import { ICollectionOutput } from 'types/ICollections';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Input,
  ScrollView,
  useToast,
  VStack,
} from 'native-base';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { IResponse } from 'types/IResponse';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from 'types/IScreenNavigationProps';
import DeleteModal from 'components/ModalDelete';

type ColumnType = {
  title: string;
  dataIndex: keyof ICollectionOutput;
  width?: number;
  render?: (value: any) => React.ReactNode;
};

export default function CollectionsHomeScreen() {
  const navigation = useNavigation<ScreenNavigationProps>();
  const toast = useToast();
  const { data: allCollections, refetch: getAllCollections } = useGetAllCollections();
  const { mutate: deleteCollection, isLoading: loadingDelete } = useDeleteCollection();
  const { mutate: getCollectionsBySearch, data: allCollectionsBySearch } =
    useGetCollectionsBySearch();
  const [collections, setCollections] = useState<IResponse<ICollectionOutput[]> | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string>('');

  useEffect(() => {
    setCollections(allCollectionsBySearch);
  }, [allCollectionsBySearch]);

  useEffect(() => {
    setCollections(allCollections);
  }, [allCollections]);

  const validationSchema = Yup.object().shape({
    search: Yup.string(),
  });

  const columns: ColumnType[] = [
    { title: 'Titulo', dataIndex: 'title', width: 200 },
    { title: 'Autor', dataIndex: 'author', width: 150 },
    {
      title: 'Status',
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
                navigation.navigate('CollectionsCreate', { id: value });
              }}
            />

            <MaterialIcons
              name="delete"
              size={25}
              color="red"
              onPress={() => {
                setCollectionToDelete(value);
                openModal();
              }}
            />
          </View>
        );
      },
    },
  ];

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleDelete = () => {
    deleteCollection(collectionToDelete, {
      onSuccess: () => {
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Box bg="emerald.600" px="2" py="1" rounded="sm" mb={5}>
                Deleção realizada com sucesso
              </Box>
            );
          },
        });
        closeModal();
      },
      onError: (error) => {
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                Erro ao realizar operação, verifique se esse livro não está vinculado a algum
                emprestímo
              </Box>
            );
          },
        });
        closeModal();
      },
    });
    setCollectionToDelete('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{ search: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const { search } = values;
            if (search !== '') {
              getCollectionsBySearch(search);
              return;
            }
            getAllCollections();
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <Box paddingX={'24px'} paddingY={'40px'}>
              <Box flex={1} width="100%" p={5} bg="white" rounded="xl">
                <Text size={30}>Acervo</Text>
                <Text size={16} style={{ marginTop: 15 }}>
                  Titulo do livro ou nome do autor
                </Text>
                <Input
                  onChangeText={handleChange('search')}
                  onBlur={handleBlur('search')}
                  value={values.search}
                  mt={3}
                  rounded="md"
                />
                <View style={{ alignItems: 'flex-end', marginTop: 25 }}>
                  <Button width="100%" onPress={() => handleSubmit()}>
                    Buscar
                  </Button>

                  <Button
                    width="100%"
                    marginTop={3}
                    onPress={() => {
                      navigation.navigate('CollectionsCreate', { id: undefined });
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
                    {collections && collections.data?.length === 0 ? (
                      <Center p={25}>
                        <Text>Livros não encontrados</Text>
                      </Center>
                    ) : (
                      collections?.data?.map((item: any) => (
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
                                <Text>{item[column.dataIndex]}</Text>
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

        <Center>
          <DeleteModal
            isOpen={isOpen}
            closeModal={closeModal}
            handleDelete={handleDelete}
            loadingDelete={loadingDelete}
          />
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
