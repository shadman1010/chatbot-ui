import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GroupedMessage } from '@/hooks/useChat';
import { useTheme } from '@/theme';

interface Props {
  message: GroupedMessage;
}

function initials(role: string) {
  return role === 'user' ? 'U' : 'B';
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  const { theme } = useTheme();
  return (
    <View style={[styles.row, isUser && { justifyContent: 'flex-end' }]}>      
      {!isUser && message.showAvatar && (
        <View style={[styles.avatar, { backgroundColor: theme.surfaceAlt }]}><Text style={[styles.avatarText, { color: theme.text }]}>{initials(message.role)}</Text></View>
      )}
      <View style={[styles.bubble, {
        backgroundColor: isUser ? theme.bubbleUser : theme.bubbleBot,
        borderColor: theme.border,
        borderWidth: message.streaming ? 1 : 0
      }]}>        
        <Text style={[styles.text, { color: isUser ? theme.primaryText : theme.text }]}>{message.content || (message.streaming ? ' ' : '')}</Text>
        {message.showTimestamp && (
          <Text style={[styles.timestamp, { color: theme.textDim }]}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 2, alignItems: 'flex-end' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatarText: { fontSize: 12, fontWeight: '600' },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderBottomLeftRadius: 6 },
  text: { fontSize: 15 },
  timestamp: { marginTop: 4, fontSize: 10, alignSelf: 'flex-end' }
});
