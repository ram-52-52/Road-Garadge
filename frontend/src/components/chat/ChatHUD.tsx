import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/authStore';
import { socket } from '../../services/socket';
import { Send, User, Bot } from 'lucide-react';

interface ChatHUDProps {
  jobId: string;
  recipientId: string;
}

const ChatHUD: React.FC<ChatHUDProps> = ({ jobId, recipientId }) => {
  const [content, setContent] = useState('');
  const { messages, fetchHistory, addMessage, loading } = useChatStore();
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory(jobId);

    // Listen for incoming messages
    socket.on('receive_message', (message) => {
      if (message.jobId === jobId) {
        addMessage(message);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [jobId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const messageData = {
      senderId: user._id,
      recipientId,
      jobId,
      content,
    };

    socket.emit('send_message', messageData);
    setContent('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <User className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Operation Chat</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Secure Dispatch Channel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-emerald-400 font-mono tracking-tighter uppercase">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
            <Bot className="w-8 h-8 opacity-20" />
            <p className="text-xs uppercase tracking-widest">No signals detected</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
            const isMe = senderId === user?._id;
            return (
              <div 
                key={msg._id || index} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  <p>{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/30 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/40"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatHUD;
