import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {colors} from './src/theme/colors';
import {ChatScreen} from './src/screens/ChatScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ChatScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
