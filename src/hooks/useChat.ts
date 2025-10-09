import { useCallback, useEffect, useRef, useState } from 'react';
import { generateBotReply } from '@/data/generateBotReply';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number; // epoch ms
  streaming?: boolean; // for bot messages being typed
  failed?: boolean; // when generation fails and can be retried
}

export interface GroupedMessage extends ChatMessage {
  showAvatar: boolean;
  showTimestamp: boolean;
  firstInGroup: boolean;
  lastInGroup: boolean;
}

function uuid() {
  return Math.random().toString(36).slice(2, 11);
}

export function groupMessages(messages: ChatMessage[]): GroupedMessage[] {
  const result: GroupedMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const samePrev = prev && prev.role === m.role;
    const sameNext = next && next.role === m.role;
    result.push({
      ...m,
      firstInGroup: !samePrev,
      lastInGroup: !sameNext,
      // Show avatar and timestamp on the last message of a group to reduce clutter
      showAvatar: !sameNext,
      showTimestamp: !sameNext,
    });
  }
  return result;
}

export interface UseChatResult {
  messages: ChatMessage[];
  grouped: GroupedMessage[];
  typing: boolean;
  sendMessage: (text: string) => void;
  stopStreaming: (id: string) => void;
  retryMessage: (failedId: string) => void;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const streamingRef = useRef<{ id: string; full: string; index: number } | null>(null);
  const hydratedRef = useRef(false);
  const STORAGE_KEY = 'chatbot.messages.v1';

  // hydrate stored messages
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: ChatMessage[] = JSON.parse(raw);
          setMessages(parsed);
        }
      } catch {}
      hydratedRef.current = true;
    })();
  }, []);

  // persist messages (skip while hydrating or during streaming partial updates for performance every 1s)
  useEffect(() => {
    if (!hydratedRef.current) return;
    const handle = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages)).catch(() => {});
    }, 1000);
    return () => clearTimeout(handle);
  }, [messages]);

  // streaming effect
  useEffect(() => {
    if (!streamingRef.current) return;
    const handle = setInterval(() => {
      setMessages((prev: ChatMessage[]) => {
        const stream = streamingRef.current;
        if (!stream) return prev;
        const { id, full, index } = stream;
        if (index >= full.length) {
          streamingRef.current = null;
          return prev.map((m: ChatMessage) => (m.id === id ? { ...m, streaming: false } : m));
        }
        stream.index += 1;
        return prev.map((m: ChatMessage) => (m.id === id ? { ...m, content: full.slice(0, stream.index) } : m));
      });
    }, 25);
    return () => clearInterval(handle);
  }, [streamingRef.current]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const user: ChatMessage = { id: uuid(), role: 'user', content: text.trim(), createdAt: Date.now() };
  setMessages((prev: ChatMessage[]) => [...prev, user]);

    // schedule bot typing
    setTyping(true);
    const delay = 400 + Math.random() * 700; // 0.4 - 1.1s
    setTimeout(() => {
      setTyping(false);
      // Simulate failure ~10% of the time
      const failed = Math.random() < 0.1;
      if (failed) {
        const botFail: ChatMessage = { id: uuid(), role: 'bot', content: 'Generation failed. Tap Retry.', createdAt: Date.now(), failed: true };
        setMessages((prev: ChatMessage[]) => [...prev, botFail]);
        return;
      }
      const full = generateBotReply({ userMessage: text });
      const bot: ChatMessage = { id: uuid(), role: 'bot', content: '', createdAt: Date.now(), streaming: true };
      streamingRef.current = { id: bot.id, full, index: 0 };
  setMessages((prev: ChatMessage[]) => [...prev, bot]);
    }, delay);
  }, []);

  const stopStreaming = useCallback((id: string) => {
    if (streamingRef.current?.id === id) {
      streamingRef.current = null;
      setMessages((prev: ChatMessage[]) => prev.map(m => (m.id === id ? { ...m, streaming: false } : m)));
    }
  }, []);

  const retryMessage = useCallback((failedId: string) => {
    // Find the failed message and the nearest previous user message
    setTyping(true);
    const delay = 300 + Math.random() * 400;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev: ChatMessage[]) => {
        const idx = prev.findIndex(m => m.id === failedId && m.failed);
        if (idx === -1) return prev;
        let userText = 'Hello';
        for (let i = idx - 1; i >= 0; i--) {
          if (prev[i].role === 'user') { userText = prev[i].content; break; }
        }
        const full = generateBotReply({ userMessage: userText });
        const updated = [...prev];
        const msg = updated[idx];
        updated[idx] = { ...msg, content: '', failed: false, streaming: true, createdAt: Date.now() };
        streamingRef.current = { id: msg.id, full, index: 0 };
        return updated;
      });
    }, delay);
  }, []);

  const grouped = groupMessages(messages);

  return { messages, grouped, typing, sendMessage, stopStreaming, retryMessage };
}
