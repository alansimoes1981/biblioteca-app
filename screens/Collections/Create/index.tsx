import React, { useEffect, useMemo } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Text from 'components/Text';
import { stylesCreateCollection } from './styles';
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  Input,
  ScrollView,
  Select,
  useToast,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenNavigationProps, SreenRouteProp } from 'types/IScreenNavigationProps';
import {
  useCreateCollection,
  useGetById,
  useUpdateCollection,
} from 'hooks/Collections/useCollections';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('O título é obrigatório'),
  ISBN: Yup.string().required('O ISBN é obrigatório'),
  publish_year: Yup.number().required('O ano de publicação é obrigatório'),
  language: Yup.string().required('O idioma é obrigatório'),
  publishing_company: Yup.string().required('A editora é obrigatória'),
  quantity: Yup.number().required('A quantidade é obrigatória'),
  cover_image: Yup.string().url('Insira uma URL válida para a capa'),
  status: Yup.string().required('O status é obrigatório'),
  location: Yup.string().required('A localização é obrigatória'),
  page_number: Yup.number().required('O número de páginas é obrigatório'),
  author: Yup.string().required('O autor é obrigatório'),
});

const CollectionCreateScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProps>();
  const { mutate: createCollection, isLoading: loadingCreate } = useCreateCollection();
  const { mutate: updateCollection, isLoading: loadingUpdate } = useUpdateCollection();
  const router = useRoute<SreenRouteProp>();
  const id = useMemo(() => router?.params?.id, [router]);
  const isEdit = useMemo(() => {
    return id !== undefined ? true : false;
  }, [id]);
  const toast = useToast();
  const { data: collection, isLoading: loadingCollection } = useGetById(id);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            title: '',
            ISBN: '',
            publish_year: '',
            language: '',
            publishing_company: '',
            quantity: '',
            cover_image: '',
            status: '',
            location: '',
            page_number: '',
            author: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const body = {
              ...values,
              quantity: Number(values.quantity),
              page_number: Number(values.page_number),
              status: values.status === 'true' ? true : false,
            };
            if (isEdit) {
              updateCollection(
                { id: id, body },
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
                    navigation.navigate('CollectionsHome');
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
            createCollection(body, {
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
                navigation.navigate('CollectionsHome');
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
              if (collection?.data && isEdit) {
                const values = {
                  ...collection.data,
                  quantity: String(collection.data.quantity),
                  page_number: String(collection.data.page_number),
                  status: String(collection.data.status),
                };
                setValues(values);
                return;
              }
            }, [collection]);

            return (
              <Box paddingX={'24px'} paddingY={'40px'}>
                {!collection && loadingCollection ? (
                  <Text size={28}> Carregando...</Text>
                ) : (
                  <Box flex={1} width="100%" bg="white" p={5} rounded="xl">
                    <View style={stylesCreateCollection.containerTitle}>
                      <Text size={28}>{isEdit ? 'Editar Livro' : 'Cadastrar Livro'}</Text>
                      <Text size={14} style={{ marginBottom: 10 }}>
                        {isEdit
                          ? 'Preencha os campos para editar o livro:'
                          : 'Preencha os campos para cadastrar um novo livro:'}
                      </Text>
                    </View>
                    <View>
                      <FormControl.Label>Título</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="Título"
                        onChangeText={handleChange('title')}
                        onBlur={handleBlur('title')}
                        value={values.title}
                      />
                      {touched.title && errors.title && (
                        <Text style={stylesCreateCollection.errorText}>{errors.title}</Text>
                      )}

                      <FormControl.Label>Autor</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="Autor"
                        onChangeText={handleChange('author')}
                        onBlur={handleBlur('author')}
                        value={values.author}
                      />
                      {touched.author && errors.author && (
                        <Text style={stylesCreateCollection.errorText}>{errors.author}</Text>
                      )}

                      <FormControl.Label>ISBN</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="ISBN"
                        onChangeText={handleChange('ISBN')}
                        onBlur={handleBlur('ISBN')}
                        value={values.ISBN}
                      />
                      {touched.ISBN && errors.ISBN && (
                        <Text style={stylesCreateCollection.errorText}>{errors.ISBN}</Text>
                      )}

                      <FormControl.Label>Editora</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="Editora"
                        onChangeText={handleChange('publishing_company')}
                        onBlur={handleBlur('publishing_company')}
                        value={values.publishing_company}
                      />
                      {touched.publishing_company && errors.publishing_company && (
                        <Text style={stylesCreateCollection.errorText}>
                          {errors.publishing_company}
                        </Text>
                      )}

                      <FormControl.Label>Idioma</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="Idioma"
                        onChangeText={handleChange('language')}
                        onBlur={handleBlur('language')}
                        value={values.language}
                      />
                      {touched.language && errors.language && (
                        <Text style={stylesCreateCollection.errorText}>{errors.language}</Text>
                      )}

                      <FormControl.Label>URL da Capa</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="URL da Capa"
                        onChangeText={handleChange('cover_image')}
                        onBlur={handleBlur('cover_image')}
                        value={values.cover_image}
                      />
                      {touched.cover_image && errors.cover_image && (
                        <Text style={stylesCreateCollection.errorText}>{errors.cover_image}</Text>
                      )}

                      <View style={stylesCreateCollection.containerInputRow}>
                        <View style={stylesCreateCollection.containerInputLabel}>
                          <FormControl.Label>Ano de Publicação</FormControl.Label>
                          <Input
                            rounded="md"
                            placeholder="Ano de Publicação"
                            onChangeText={handleChange('publish_year')}
                            onBlur={handleBlur('publish_year')}
                            value={values.publish_year.toString()}
                            keyboardType="numeric"
                          />
                          {touched.publish_year && errors.publish_year && (
                            <Text style={stylesCreateCollection.errorText}>
                              {errors.publish_year}
                            </Text>
                          )}
                        </View>
                        <View style={stylesCreateCollection.containerInputLabel}>
                          <FormControl.Label>Número de Páginas</FormControl.Label>
                          <Input
                            rounded="md"
                            placeholder="Número de Páginas"
                            onChangeText={handleChange('page_number')}
                            onBlur={handleBlur('page_number')}
                            value={values.page_number.toString()}
                            keyboardType="numeric"
                          />
                          {touched.page_number && errors.page_number && (
                            <Text style={stylesCreateCollection.errorText}>
                              {errors.page_number}
                            </Text>
                          )}
                        </View>
                      </View>

                      <FormControl.Label>Localização</FormControl.Label>
                      <Input
                        rounded="md"
                        placeholder="Localização"
                        onChangeText={handleChange('location')}
                        onBlur={handleBlur('location')}
                        value={values.location}
                      />
                      {touched.location && errors.location && (
                        <Text style={stylesCreateCollection.errorText}>{errors.location}</Text>
                      )}

                      <View style={stylesCreateCollection.containerInputRow}>
                        <View style={stylesCreateCollection.containerInputLabel}>
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
                            <Text style={stylesCreateCollection.errorText}>{errors.status}</Text>
                          )}
                        </View>
                        <View style={stylesCreateCollection.containerInputLabel}>
                          <FormControl.Label>Quantidade</FormControl.Label>
                          <Input
                            rounded="md"
                            placeholder="Quantidade"
                            onChangeText={handleChange('quantity')}
                            onBlur={handleBlur('quantity')}
                            value={values.quantity.toString()}
                            keyboardType="numeric"
                          />
                          {touched.quantity && errors.quantity && (
                            <Text style={stylesCreateCollection.errorText}>{errors.quantity}</Text>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={stylesCreateCollection.containerButton}>
                      <Button onPress={() => navigation.navigate('CollectionsHome')}>Voltar</Button>
                      <Button
                        isLoading={isEdit ? loadingUpdate : loadingCreate}
                        isLoadingText={isEdit ? 'Editando' : 'Cadastrando'}
                        onPress={() => handleSubmit()}>
                        {isEdit ? 'Editar Livro' : 'Cadastrar Livro'}
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

export default CollectionCreateScreen;
