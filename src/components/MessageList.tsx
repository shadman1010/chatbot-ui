import React, { useEffect, useRef } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { GroupedMessage } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  data: GroupedMessage[];
  typing: boolean;
}

export const MessageList: React.FC<Props> = ({ data, typing }) => {
  const ref = useRef<FlatList<GroupedMessage>>(null);
  const { theme } = useTheme();
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
      renderItem={({ item }) => <MessageBubble message={item} />}
      ListFooterComponent={typing ? <View style={styles.typingWrapper}><TypingIndicator /></View> : null}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 12, backgroundColor: theme.background }}
    />
  );
};

const styles = StyleSheet.create({
  typingWrapper: { paddingHorizontal: 12 }
});
