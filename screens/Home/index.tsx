import { StyleSheet, View } from 'react-native';
import Text from 'components/Text';
import { useAuth } from 'context/auth';
import { useGetAllOrderItems } from 'hooks/orderItems/useOrderItems';
import { useQueryGetByStatus } from 'hooks/Collections/useCollections';
import { useMemo } from 'react';

export default function HomeScreen() {
  const { user } = useAuth();
  const { data: allOrderItems, isLoading: loadingOrderItems } = useGetAllOrderItems();
  const { data: allCollections, isLoading: loadingCollections } = useQueryGetByStatus(true);
  const quantityOrderItems = useMemo(
    () => allOrderItems?.data?.filter((orderItem) => orderItem.status === true).length,
    [allOrderItems]
  );
  const quantityCollection = useMemo(() => allCollections?.data?.length, [allCollections]);

  return (
    <View style={styles.container}>
      <Text size={35}>Olá {user?.name}, bom te ver aqui!</Text>

      <View style={styles.containerCards}>
        <View style={styles.containerCard1}>
          <View style={styles.containerTitleCard}>
            <Text size={16} color="#fff">
              Acervos
            </Text>
          </View>
          <View style={styles.containerContentCard}>
            <Text size={16} color="#000">
              {!loadingCollections && `${quantityCollection} livros`}
            </Text>
          </View>
        </View>
        <View style={styles.containerCard2}>
          <View style={styles.containerTitleCard}>
            <Text size={16} color="#fff">
              Emprestímos
            </Text>
          </View>
          <View style={styles.containerContentCard}>
            <Text size={16} color="#000">
              {!loadingOrderItems && `${quantityOrderItems} livros`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  containerCards: {
    width: '100%',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    flexDirection: 'row',
    marginTop: 30,
  },
  containerCard1: {
    width: '40%',
    height: 90,
    backgroundColor: '#fff',
  },
  containerCard2: {
    width: '40%',
    height: 90,
    backgroundColor: '#fff',
  },
  containerTitleCard: {
    height: 30,
    backgroundColor: '#0B5B8C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerContentCard: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
