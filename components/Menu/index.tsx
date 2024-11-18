import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Menu as MenuPaper, Provider } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from 'types/IScreenNavigationProps';
import { useAuth } from 'context/auth';

interface MenuButtonProps {
  options?: { label: string; onPress: () => void }[]; // Array de opções com rótulo e ação
}

const Menu: React.FC<MenuButtonProps> = ({ options }) => {
  const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do menu
  const navigation = useNavigation<ScreenNavigationProps>();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { logout } = useAuth();
  const optionData =
    options === undefined
      ? [
          {
            label: 'Início',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
          {
            label: 'Acervo',
            onPress: () => {
              navigation.navigate('CollectionsHome');
            },
          },
          {
            label: 'Empréstimos',
            onPress: () => {
              navigation.navigate('OrderItemsHome');
            },
          },
          {
            label: 'Alunos',
            onPress: () => {
              navigation.navigate('StudentsHome');
            },
          },
          // {
          //   label: 'Usuários',
          //   onPress: () => {
          //     navigation.navigate('Details', {
          //       name: 'Dan',
          //     });
          //   },
          // },
          {
            label: 'Logout',
            onPress: () => {
              logout();
            },
          },
        ]
      : [];

  return (
    <Provider>
      <TouchableOpacity onPress={openMenu} style={styles.container}>
        <Entypo name="menu" size={28} color="#fff" />
      </TouchableOpacity>
      <MenuPaper
        visible={visible}
        onDismiss={closeMenu}
        anchor={<View style={styles.anchor}></View>}>
        {optionData.map((option, index) => (
          <MenuPaper.Item
            titleStyle={{
              color: '#fff',
            }}
            key={index}
            onPress={() => {
              option.onPress();
              closeMenu(); // Fecha o menu após selecionar a opção
            }}
            title={option.label}
            style={styles.containerItem}
          />
        ))}
      </MenuPaper>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16, // Espaçamento ao redor do botão
    // Espaçamento ao redor do botão
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  anchor: {
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  containerItem: {
    backgroundColor: '#0B5B8C', // Cor do cabeçalho
  },
});

export default Menu;
