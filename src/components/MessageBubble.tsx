import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GroupedMessage } from '@/hooks/useChat';
import { useTheme } from '@/theme';

interface Props {
  message: GroupedMessage;
  onStop?: (id: string) => void;
  onRetry?: (id: string) => void;
}

function initials(role: string) {
  return role === 'user' ? 'U' : 'B';
}

export const MessageBubble: React.FC<Props> = ({ message, onStop, onRetry }) => {
  const isUser = message.role === 'user';
  const { theme } = useTheme();
  return (
    <View style={[styles.row, isUser && { justifyContent: 'flex-end' }, message.firstInGroup && styles.groupGap]}>      
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
      {/* Actions */}
      {!isUser && (
        <View style={styles.actionsRow}>
          {message.streaming && onStop && (
            <Pressable onPress={() => onStop(message.id)} hitSlop={10}><Text style={[styles.actionText, { color: theme.primary }]}>Stop</Text></Pressable>
          )}
          {message.failed && onRetry && (
            <Pressable onPress={() => onRetry(message.id)} hitSlop={10}><Text style={[styles.actionText, { color: theme.primary }]}>Retry</Text></Pressable>
          )}
        </View>
      )}
      {isUser && message.showAvatar && (
        <View style={[styles.avatar, { backgroundColor: theme.surfaceAlt, marginLeft: 8, marginRight: 0 }]}><Text style={[styles.avatarText, { color: theme.text }]}>{initials(message.role)}</Text></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 2, alignItems: 'flex-end' },
  groupGap: { marginTop: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatarText: { fontSize: 12, fontWeight: '600' },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderBottomLeftRadius: 6 },
  text: { fontSize: 15 },
  timestamp: { marginTop: 4, fontSize: 10, alignSelf: 'flex-end' },
  actionsRow: { marginLeft: 44, marginTop: 4 },
  actionText: { fontSize: 12, fontWeight: '600' }
});
