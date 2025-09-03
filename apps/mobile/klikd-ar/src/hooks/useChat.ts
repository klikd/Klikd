import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'ncp_greeting' | 'system';
  timestamp: string;
  metadata?: {
    senderName?: string;
    senderAvatar?: string;
    replyTo?: string;
    attachments?: string[];
  };
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const sendMessage = useCallback((message: Omit<ChatMessage, 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const startTyping = useCallback((userId: string) => {
    setTypingUsers(prev => [...prev.filter(id => id !== userId), userId]);
    setIsTyping(true);
  }, []);

  const stopTyping = useCallback((userId: string) => {
    setTypingUsers(prev => prev.filter(id => id !== userId));
    setIsTyping(prev => prev && typingUsers.length > 1);
  }, [typingUsers]);

  return {
    messages,
    isTyping,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  };
};
