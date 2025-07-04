
export interface Message {
  _id: string;
  content: string;
  mode: 'affirming' | 'direct' | 'hostile'
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface ChatHistory {
  _id: string
  title: string
  mode: string
  isPinned: boolean
  chatId: string
  lastUpdated: string
}