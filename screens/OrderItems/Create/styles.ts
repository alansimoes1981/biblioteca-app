import { StyleSheet } from 'react-native';

export const stylesCreateOrderItem = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerTitle: {
    alignItems: 'flex-start',
  },
  containerInputRow: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  containerInputLabel: {
    width: '50%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  containerButton: {
    marginTop: 30,
    gap: 20,
  },
});
