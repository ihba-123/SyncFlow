import { create } from 'zustand';
const mockChats = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    lastMessage: 'That sounds great! Let me check my calendar 📅',
    timestamp: '2:45 PM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    lastMessage: 'See you tomorrow!',
    timestamp: '1:30 PM',
  },
  {
    id: '3',
    name: 'Design Team',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
    lastMessage: 'The new mockups are ready for review',
    timestamp: '11:20 AM',
    unread: 5,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: 'Thanks for the help earlier! 🙏',
    timestamp: '10:15 AM',
  },
  {
    id: '5',
    name: 'Project Updates',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Project',
    lastMessage: 'Sprint planning is at 3 PM today',
    timestamp: '9:30 AM',
  },
];

// Mock messages data
const mockMessages = {
  '1': [
    { id: '1-1', text: 'Hey Alice! How are you doing?', timestamp: '2:30 PM', isOutgoing: true, isRead: true },
    { id: '1-2', text: "I'm doing great! Just finished a project 🎉", timestamp: '2:35 PM', isOutgoing: false, isRead: true },
    { id: '1-3', text: 'Want to grab coffee tomorrow?', timestamp: '2:40 PM', isOutgoing: true, isRead: true },
    { id: '1-4', text: 'That sounds great! Let me check my calendar 📅', timestamp: '2:45 PM', isOutgoing: false, isRead: true },
  ],
  '2': [
    { id: '2-1', text: "Hi Bob! How's everything?", timestamp: '1:15 PM', isOutgoing: true, isRead: true },
    { id: '2-2', text: 'All good! Working on the new feature', timestamp: '1:20 PM', isOutgoing: false, isRead: true },
    { id: '2-3', text: 'See you tomorrow!', timestamp: '1:30 PM', isOutgoing: false, isRead: true },
  ],
  '3': [
    { id: '3-1', text: 'Hey team, check out the latest designs', timestamp: '11:10 AM', isOutgoing: true, isRead: true },
    { id: '3-2', text: 'Looking good! Love the new color scheme', timestamp: '11:15 AM', isOutgoing: false, isRead: true },
    { id: '3-3', text: 'The new mockups are ready for review', timestamp: '11:20 AM', isOutgoing: false, isRead: true },
  ],
  '4': [],
  '5': [],
};

export const useChatStore = create((set) => ({
  chats: mockChats,
  messages: mockMessages,
  addMessage: (chatId, message) => {
    const newMessage = {
      id: `${chatId}-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      ...message,
    };

    if (message.isOutgoing) {
      setTimeout(() => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: [
              ...(state.messages[chatId] || []),
              {
                id: `${chatId}-${Date.now()}-reply`,
                text: '👍 Got it! Thanks for the message',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                isOutgoing: false,
                isRead: false,
              },
            ],
          },
        }));
      }, 1000);
    }

    // Add the new message
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
    }));
  },
}));