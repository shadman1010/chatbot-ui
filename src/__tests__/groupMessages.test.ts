import { groupMessages, ChatMessage } from '@/hooks/useChat';

describe('groupMessages', () => {
  const base = Date.now();
  function m(id: string, role: 'user' | 'bot'): ChatMessage {
    return { id, role, content: id, createdAt: base };
  }
  it('groups consecutive same-role messages', () => {
    const input = [m('1','user'), m('2','user'), m('3','bot'), m('4','bot'), m('5','user')];
    const grouped = groupMessages(input);
    expect(grouped[0].firstInGroup).toBe(true);
    expect(grouped[1].firstInGroup).toBe(false);
    expect(grouped[0].lastInGroup).toBe(false);
    expect(grouped[1].lastInGroup).toBe(true);
    expect(grouped[2].firstInGroup).toBe(true);
    expect(grouped[3].lastInGroup).toBe(true);
    expect(grouped[4].firstInGroup).toBe(true);
  });
});
