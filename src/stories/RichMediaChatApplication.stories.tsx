// React is used by Storybook
import type { Meta, StoryObj } from '@storybook/react';
import { RichMediaChatApplication } from '../components/RichMediaChatApplication';

const meta: Meta<typeof RichMediaChatApplication> = {
  title: 'Communication/RichMediaChatApplication',
  component: RichMediaChatApplication,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      defaultValue: 'light',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichMediaChatApplication>;

// Mock data
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?u=user1',
  status: 'online' as 'online',
};

const contacts = [
  {
    id: 'contact-1',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=user2',
    lastMessage: 'Hey, how are you?',
    unreadCount: 2,
    status: 'online' as 'online',
  },
  {
    id: 'contact-2',
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?u=user3',
    lastMessage: 'Did you see the latest update?',
    unreadCount: 0,
    status: 'offline' as 'offline',
  },
  {
    id: 'contact-3',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?u=user4',
    lastMessage: 'Let me know when you\'re free',
    unreadCount: 0,
    status: 'away' as 'away',
  },
];

const mockMessages = [
  {
    id: 'msg-1',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'Hey, how are you doing?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    status: 'read',
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'John Doe',
    senderAvatar: 'https://i.pravatar.cc/150?u=user1',
    text: 'I\'m good, thanks! Just working on that new project.',
    timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
    status: 'read',
  },
  {
    id: 'msg-3',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'That sounds interesting! Can you share some details?',
    timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    status: 'read',
  },
  {
    id: 'msg-4',
    senderId: 'user-1',
    senderName: 'John Doe',
    senderAvatar: 'https://i.pravatar.cc/150?u=user1',
    text: 'It\'s a new chat application with rich media support. Here\'s a preview:',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'read',
  },
  {
    id: 'msg-5',
    senderId: 'user-1',
    senderName: 'John Doe',
    senderAvatar: 'https://i.pravatar.cc/150?u=user1',
    media: [
      {
        type: 'image',
        url: 'https://picsum.photos/800/600?random=7',
        dimensions: { width: 800, height: 600 },
      }
    ],
    timestamp: new Date(Date.now() - 44 * 60 * 1000), // 44 minutes ago
    status: 'read',
  },
  {
    id: 'msg-6',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'Wow, that looks amazing! 😍',
    timestamp: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
    status: 'read',
    reactions: {
      '👍': ['user-1'],
    }
  },
  {
    id: 'msg-7',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'What features are you planning to include?',
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    status: 'read',
  },
  {
    id: 'msg-8',
    senderId: 'user-1',
    senderName: 'John Doe',
    senderAvatar: 'https://i.pravatar.cc/150?u=user1',
    text: 'It will support images, videos, audio messages, file sharing, emojis, reactions, and more!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'read',
  },
  {
    id: 'msg-9',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'That sounds great! Will it have mobile support too?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    status: 'read',
  },
  {
    id: 'msg-10',
    senderId: 'user-1',
    senderName: 'John Doe',
    senderAvatar: 'https://i.pravatar.cc/150?u=user1',
    text: 'Yes, it\'s fully responsive and works on all devices.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    status: 'read',
  },
  {
    id: 'msg-11',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'Perfect! I\'m looking forward to trying it out.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'read',
  },
  {
    id: 'msg-12',
    senderId: 'user-1',
    senderName: 'John Doe',
    senderAvatar: 'https://i.pravatar.cc/150?u=user1',
    text: 'I\'ll send you an invite as soon as it\'s ready for testing!',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: 'delivered',
  },
  {
    id: 'msg-13',
    senderId: 'contact-1',
    senderName: 'Jane Smith',
    senderAvatar: 'https://i.pravatar.cc/150?u=user2',
    text: 'Can\'t wait! 👏',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    status: 'read',
    reactions: {
      '🎉': ['user-1'],
      '👍': ['user-3'],
    }
  },
];

// Mock handlers
const mockSendMessage = async (message: any) => {
  console.log('Message sent:', message);
  return Promise.resolve();
};

const mockFetchMessages = async () => {
  console.log('Fetching messages...');
  return Promise.resolve(mockMessages);
};

const mockDeleteMessage = async (messageId: string) => {
  console.log('Deleting message:', messageId);
  return Promise.resolve();
};

const mockEditMessage = async (messageId: string, newContent: any) => {
  console.log('Editing message:', messageId, newContent);
  return Promise.resolve();
};

const mockReactToMessage = async (messageId: string, reaction: string) => {
  console.log('Reacting to message:', messageId, reaction);
  return Promise.resolve();
};

const mockMediaUploadHandler = async (file: File) => {
  console.log('Uploading file:', file.name);
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    url: URL.createObjectURL(file),
    metadata: {
      filename: file.name,
      filesize: file.size,
      contentType: file.type
    }
  };
};

// Stories
export const Default: Story = {
  args: {
    user: currentUser,
    contacts,
    activeConversationId: 'contact-1',
    onSendMessage: mockSendMessage,
    onFetchMessages: mockFetchMessages,
    onDeleteMessage: mockDeleteMessage,
    onEditMessage: mockEditMessage,
    onReactToMessage: mockReactToMessage,
    mediaUploadHandler: mockMediaUploadHandler,
    theme: 'light',
    allowedMediaTypes: ['image', 'video', 'audio', 'document'],
    maxMediaSize: 10 * 1024 * 1024, // 10MB
  },
};

export const Dark: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
};

export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const EmptyConversation: Story = {
  args: {
    ...Default.args,
    onFetchMessages: async () => [],
  },
};

export const WithCustomLabels: Story = {
  args: {
    ...Default.args,
    labels: {
      sendButton: 'Send Message',
      attachmentButton: 'Add Attachment',
      emojiButton: 'Insert Emoji',
      placeholder: 'Write your message here...',
    },
  },
};