import { create } from 'zustand';
import { getChatHistory } from '../services/chatService';

interface Message {
  _id: string;
  sender: { _id: string; name: string; role: string };
  recipient: { _id: string; name: string; role: string };
  jobId: string;
  content: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  fetchHistory: (jobId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  loading: false,
  
  fetchHistory: async (jobId) => {
    set({ loading: true });
    try {
      const response = await getChatHistory(jobId);
      set({ messages: response.data, loading: false });
    } catch (error) {
      console.error('Fetch Chat Error:', error);
      set({ loading: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearChat: () => {
    set({ messages: [] });
  },
}));
