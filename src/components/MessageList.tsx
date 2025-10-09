import React, { useEffect, useRef } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { GroupedMessage } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  data: GroupedMessage[];
  typing: boolean;
  onStop?: (id: string) => void;
  onRetry?: (id: string) => void;
}

export const MessageList: React.FC<Props> = ({ data, typing, onStop, onRetry }) => {
  const ref = useRef<FlatList<GroupedMessage>>(null);
  const { theme } = useTheme();
  // Auto-scroll when new messages arrive, typing indicator shows, or content height changes (streaming)
  useEffect(() => {
    if (ref.current) {
      setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [data.length, typing]);
  return (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={m => m.id}
  renderItem={({ item }) => <MessageBubble message={item} onStop={onStop} onRetry={onRetry} />}
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: true })}
      ListFooterComponent={typing ? <View style={styles.typingWrapper}><TypingIndicator /></View> : null}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 12, backgroundColor: theme.background }}
    />
  );
};

const styles = StyleSheet.create({
  typingWrapper: { paddingHorizontal: 12 }
});
