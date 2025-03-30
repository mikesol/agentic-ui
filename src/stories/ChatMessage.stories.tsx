// React is used by Storybook
import { Meta, StoryObj } from '@storybook/react';
import { ChatMessage } from '../components/ChatMessage';

const meta: Meta<typeof ChatMessage> = {
  title: 'Communication/ChatMessage',
  component: ChatMessage,
  argTypes: {
    isCurrentUser: {
      control: 'boolean',
      defaultValue: false,
    },
    onDelete: { action: 'onDelete' },
    onEdit: { action: 'onEdit' },
    onReact: { action: 'onReact' },
  },
};

export default meta;
type Story = StoryObj<typeof ChatMessage>;

// Base message props
const baseMessage = {
  id: 'msg-1',
  senderId: 'user-2',
  senderName: 'Jane Smith',
  senderAvatar: 'https://i.pravatar.cc/150?u=user2',
  timestamp: new Date(),
};

// Stories
export const TextMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'Hello! This is a simple text message.',
    },
    isCurrentUser: false,
  },
};

export const CurrentUserMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      senderId: 'user-1',
      senderName: 'John Doe',
      senderAvatar: 'https://i.pravatar.cc/150?u=user1',
      text: 'This is a message from the current user.',
    },
    isCurrentUser: true,
  },
};

export const ImageMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'Check out this image:',
      media: [
        {
          type: 'image',
          url: 'https://picsum.photos/800/600?random=1',
          dimensions: { width: 800, height: 600 },
        },
      ],
    },
    isCurrentUser: false,
  },
};

export const MultipleImagesMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'Here are some photos from my trip:',
      media: [
        {
          type: 'image',
          url: 'https://picsum.photos/800/600?random=2',
          dimensions: { width: 800, height: 600 },
        },
        {
          type: 'image',
          url: 'https://picsum.photos/800/600?random=3',
          dimensions: { width: 800, height: 600 },
        },
        {
          type: 'image',
          url: 'https://picsum.photos/800/600?random=4',
          dimensions: { width: 800, height: 600 },
        },
      ],
    },
    isCurrentUser: false,
  },
};

export const VideoMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'Check out this video:',
      media: [
        {
          type: 'video',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          thumbnailUrl: 'https://picsum.photos/800/600?random=5',
          duration: 123,
        },
      ],
    },
    isCurrentUser: false,
  },
};

export const DocumentMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'Here\'s the document you requested:',
      media: [
        {
          type: 'document',
          url: '#',
          filename: 'presentation.pdf',
          filesize: 2.5 * 1024 * 1024, // 2.5MB
        },
      ],
    },
    isCurrentUser: false,
  },
};

export const ReplyMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'Yes, that sounds like a great plan!',
      replyTo: {
        id: 'msg-original',
        text: 'Do you want to meet for coffee later?',
        senderName: 'John Doe',
      },
    },
    isCurrentUser: false,
  },
};

export const MessageWithReactions: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'What do you think of this new design?',
      media: [
        {
          type: 'image',
          url: 'https://picsum.photos/800/600?random=6',
          dimensions: { width: 800, height: 600 },
        },
      ],
      reactions: {
        '👍': ['user-1', 'user-3'],
        '❤️': ['user-4'],
        '👏': ['user-5', 'user-6', 'user-7'],
      },
    },
    isCurrentUser: false,
  },
};

export const DeletedMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      isDeleted: true,
    },
    isCurrentUser: false,
  },
};

export const EditedMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      text: 'This message has been edited to fix a typo.',
      isEdited: true,
    },
    isCurrentUser: false,
  },
};