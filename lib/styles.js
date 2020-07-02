import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  customCircleStyle: {
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.15,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
});
