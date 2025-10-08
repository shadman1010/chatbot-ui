import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>      
      <Text style={[styles.title, { color: theme.text }]}>Graphland Chat</Text>
      <Pressable onPress={toggleTheme} style={[styles.toggleBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>        
        <Text style={{ color: theme.textDim, fontSize: 12 }}>{theme.name === 'dark' ? 'Light' : 'Dark'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 14, alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 18, fontWeight: '600' },
  toggleBtn: { position: 'absolute', right: 12, top: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth }
});
