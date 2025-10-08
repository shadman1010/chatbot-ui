import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

interface Props {
  onSend: (text: string) => void;
}

export const InputBar: React.FC<Props> = ({ onSend }) => {
  const [value, setValue] = useState('');
  const canSend = value.trim().length > 0;
  const { theme } = useTheme();

  function handleSend() {
    if (!canSend) return;
    onSend(value);
    setValue('');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>        
      <TextInput
        multiline
        placeholder="Message"
        placeholderTextColor={theme.textDim}
        value={value}
        onChangeText={setValue}
        style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
      />
      <Pressable onPress={handleSend} style={[styles.button, { backgroundColor: theme.primary }, !canSend && { opacity: 0.4 }]} disabled={!canSend}>
        <Text style={[styles.buttonText, { color: theme.primaryText }]}>Send</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, fontSize: 16, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, maxHeight: 120 },
  button: { marginLeft: 8, paddingHorizontal: 18, borderRadius: 20, justifyContent: 'center' },
  buttonText: { fontWeight: '600' }
});
