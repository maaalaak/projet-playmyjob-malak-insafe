export type ChatAuthor = 'character' | 'player' | 'narrator';

export interface ChatMessage {
  id: string;
  author: ChatAuthor;
  characterId: string | null;
  text: string;
  time: string;
}
