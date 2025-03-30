// React is used by Storybook
import { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from '../components/ChatInput';

const meta: Meta<typeof ChatInput> = {
  title: 'Communication/ChatInput',
  component: ChatInput,
  argTypes: {
    onSendMessage: { action: 'onSendMessage' },
    onCancelReply: { action: 'onCancelReply' },
  },
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

// Mock media upload handler for demos
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
export const Basic: Story = {
  args: {
    onSendMessage: (text, media) => {
      console.log('Message sent:', { text, media });
    },
    placeholder: 'Type a message...',
    autoFocus: true,
  },
};

export const WithMediaUpload: Story = {
  args: {
    ...Basic.args,
    mediaUploadHandler: mockMediaUploadHandler,
    allowedMediaTypes: ['image', 'video', 'audio', 'document'],
    maxMediaSize: 10 * 1024 * 1024, // 10MB
  },
};

export const WithReply: Story = {
  args: {
    ...Basic.args,
    replyTo: {
      id: 'msg-1',
      text: 'Do you want to meet for coffee later?',
      senderName: 'Jane Smith',
    },
    onCancelReply: () => {
      console.log('Reply cancelled');
    },
  },
};

export const WithCustomEmojis: Story = {
  args: {
    ...Basic.args,
    customEmojis: {
      'custom1': '🚀',
      'custom2': '🔥',
      'custom3': '💯',
      'custom4': '🎉',
    },
  },
};

export const WithCustomLabels: Story = {
  args: {
    ...Basic.args,
    labels: {
      sendButton: 'Submit',
      attachmentButton: 'Add Files',
      emojiButton: 'Add Emoji',
      placeholder: 'Write your message...',
    },
  },
};