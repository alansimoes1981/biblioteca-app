import { StyleSheet } from 'react-native';

export const stylesSignIn = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-evenly',
  },
  containerTitle: {
    alignItems: 'flex-start',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  createAccount: {
    color: '#000',
    marginTop: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  containerButton: {
    marginTop: 30,
  },
});
