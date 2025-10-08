import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { MessageList } from '@/components/MessageList';
import { InputBar } from '@/components/InputBar';
import { useChat } from '@/hooks/useChat';
import { ThemeProvider, useTheme } from '@/theme';

function ChatScreen() {
  const { grouped, typing, sendMessage } = useChat();
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>      
  <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
      <Header />
      <View style={styles.flex}>
        <MessageList data={grouped} typing={typing} />
      </View>
      <InputBar onSend={sendMessage} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ChatScreen />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  flex: { flex: 1 }
});
