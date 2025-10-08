import replies from './botReplies.json';

export interface BotReplyOptions {
  userMessage: string;
}

const keywordMap: Record<string, string> = {
  react: 'tech',
  native: 'tech',
  code: 'tech',
  hello: 'greeting',
  hi: 'greeting',
  fun: 'fun',
  fact: 'fun'
};

interface ReplyCategory {
  category: string;
  texts: string[];
}

const list = replies as ReplyCategory[];

export function generateBotReply({ userMessage }: BotReplyOptions): string {
  const lc = userMessage.toLowerCase();
  const foundKey = Object.keys(keywordMap).find(k => lc.includes(k));
  const category = foundKey ? keywordMap[foundKey] : 'fallback';
  const pool = list.find(r => r.category === category) || list.find(r => r.category === 'fallback')!;
  return pool.texts[Math.floor(Math.random() * pool.texts.length)];
}
