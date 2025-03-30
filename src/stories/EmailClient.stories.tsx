// React is used by Storybook
import { Meta, StoryObj } from '@storybook/react';
import { EmailClient } from '../components/EmailClient';

const meta: Meta<typeof EmailClient> = {
  title: 'Communication/EmailClient',
  component: EmailClient,
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
type Story = StoryObj<typeof EmailClient>;

// Mock data
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=user1',
};

const mockFolders = [
  { id: 'inbox', name: 'Inbox', type: 'inbox' as 'inbox', unreadCount: 4 },
  { id: 'starred', name: 'Starred', type: 'starred' as 'starred' },
  { id: 'sent', name: 'Sent', type: 'sent' as 'sent' },
  { id: 'drafts', name: 'Drafts', type: 'drafts' as 'drafts', unreadCount: 2 },
  { id: 'trash', name: 'Trash', type: 'trash' as 'trash' },
  { id: 'spam', name: 'Spam', type: 'spam' as 'spam', unreadCount: 1 },
  { id: 'work', name: 'Work', type: 'custom' as 'custom' },
  { id: 'personal', name: 'Personal', type: 'custom' as 'custom' }
];

const mockEmails = {
  inbox: [
    {
      id: 'email-1',
      subject: 'Weekly team meeting',
      snippet: 'Hello team, Just a reminder that we have our weekly meeting tomorrow at 10am. Please come prepared with updates on your current projects.',
      from: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user2'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      isStarred: false,
      hasAttachments: false,
      folder: 'inbox'
    },
    {
      id: 'email-2',
      subject: 'Project proposal',
      snippet: 'Hi John, I\'ve attached the project proposal for your review. Let me know if you have any questions or if anything needs to be adjusted.',
      from: {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user3'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      folder: 'inbox'
    },
    {
      id: 'email-3',
      subject: 'Vacation plans',
      snippet: 'Hey, I was thinking about our upcoming vacation. Should we go with the beach resort or the mountain cabin? Both have their perks.',
      from: {
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user4'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: 'inbox'
    },
    {
      id: 'email-4',
      subject: 'Invoice #1234',
      snippet: 'This is your invoice for the services rendered last month. Payment is due within 30 days. Thank you for your business!',
      from: {
        name: 'Accounting Department',
        email: 'accounting@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user5'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: false,
      isStarred: false,
      hasAttachments: true,
      labels: ['Finance'],
      folder: 'inbox'
    },
    {
      id: 'email-5',
      subject: 'New feature announcement',
      snippet: 'We\'re excited to announce a new feature that will be rolling out next week. This should greatly improve user experience and efficiency.',
      from: {
        name: 'Product Team',
        email: 'product@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user6'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: 'inbox'
    }
  ],
  starred: [
    {
      id: 'email-2',
      subject: 'Project proposal',
      snippet: 'Hi John, I\'ve attached the project proposal for your review. Let me know if you have any questions or if anything needs to be adjusted.',
      from: {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user3'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      folder: 'inbox'
    }
  ],
  sent: [
    {
      id: 'email-6',
      subject: 'Re: Weekly team meeting',
      snippet: 'Thanks for the reminder. I\'ll be there and will prepare my project updates.',
      from: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user1'
      },
      to: [
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: 'sent'
    },
    {
      id: 'email-7',
      subject: 'Meeting request',
      snippet: 'Hi David, I would like to schedule a meeting to discuss the new project requirements. Are you available this Friday?',
      from: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user1'
      },
      to: [
        { name: 'David Brown', email: 'david.brown@example.com' }
      ],
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: 'sent'
    }
  ],
  drafts: [
    {
      id: 'email-8',
      subject: 'Project timeline update',
      snippet: 'Hello team, I\'m writing to update you on the project timeline. We\'ve made some adjustments to accommodate...',
      from: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user1'
      },
      to: [
        { name: 'Project Team', email: 'team@example.com' }
      ],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: 'drafts'
    },
    {
      id: 'email-9',
      subject: 'Vacation request',
      snippet: 'Hi HR, I would like to request vacation days from July 15 to July 22. Please let me know if this works with the team schedule.',
      from: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://i.pravatar.cc/150?u=user1'
      },
      to: [
        { name: 'HR Department', email: 'hr@example.com' }
      ],
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: 'drafts'
    }
  ],
  trash: [],
  spam: [
    {
      id: 'email-10',
      subject: 'You\'ve won a prize!',
      snippet: 'Congratulations! You\'ve been selected as a winner in our sweepstakes. Click here to claim your prize now!',
      from: {
        name: 'Prize Center',
        email: 'noreply@prizes.example.com',
        avatar: 'https://i.pravatar.cc/150?u=user7'
      },
      to: [
        { name: 'John Doe', email: 'john.doe@example.com' }
      ],
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      isRead: false,
      isStarred: false,
      hasAttachments: false,
      folder: 'spam'
    }
  ],
  work: [],
  personal: []
};

// Mock email content for detailed view
const mockEmailContent = {
  'email-1': {
    id: 'email-1',
    subject: 'Weekly team meeting',
    body: `
      <p>Hello team,</p>
      <p>Just a reminder that we have our weekly meeting tomorrow at 10am. Please come prepared with updates on your current projects.</p>
      <p>Here's the agenda:</p>
      <ul>
        <li>Project status updates</li>
        <li>Upcoming deadlines</li>
        <li>Resource allocation</li>
        <li>Questions and concerns</li>
      </ul>
      <p>If you have any specific topics you'd like to discuss, please let me know before the meeting.</p>
      <p>Best regards,<br>Jane</p>
    `,
    from: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://i.pravatar.cc/150?u=user2'
    },
    to: [
      { name: 'John Doe', email: 'john.doe@example.com' },
      { name: 'Team', email: 'team@example.com' }
    ],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    isStarred: false,
    folder: 'inbox'
  },
  'email-2': {
    id: 'email-2',
    subject: 'Project proposal',
    body: `
      <p>Hi John,</p>
      <p>I've attached the project proposal for your review. Let me know if you have any questions or if anything needs to be adjusted.</p>
      <p>The proposal includes:</p>
      <ul>
        <li>Project scope</li>
        <li>Timeline</li>
        <li>Budget breakdown</li>
        <li>Resource requirements</li>
      </ul>
      <p>We need your feedback by the end of the week to move forward with the planning phase.</p>
      <p>Regards,<br>Mike</p>
    `,
    from: {
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?u=user3'
    },
    to: [
      { name: 'John Doe', email: 'john.doe@example.com' }
    ],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    isStarred: true,
    attachments: [
      {
        id: 'attach-1',
        name: 'project_proposal.pdf',
        type: 'application/pdf',
        size: 2.4 * 1024 * 1024, // 2.4 MB
        url: '#'
      }
    ],
    folder: 'inbox'
  },
  'email-4': {
    id: 'email-4',
    subject: 'Invoice #1234',
    body: `
      <p>Dear John Doe,</p>
      <p>This is your invoice for the services rendered last month. Payment is due within 30 days.</p>
      <p>Invoice details:</p>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="padding: 8px; text-align: left;">Description</th>
          <th style="padding: 8px; text-align: right;">Amount</th>
        </tr>
        <tr>
          <td style="padding: 8px;">Professional services - 20 hours</td>
          <td style="padding: 8px; text-align: right;">$2,000.00</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Materials</td>
          <td style="padding: 8px; text-align: right;">$350.00</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Total</strong></td>
          <td style="padding: 8px; text-align: right;"><strong>$2,350.00</strong></td>
        </tr>
      </table>
      <p>Please make payment to the following account:</p>
      <p>
        Bank: Example Bank<br>
        Account: 1234567890<br>
        Reference: INV-1234
      </p>
      <p>Thank you for your business!</p>
      <p>Regards,<br>Accounting Department</p>
    `,
    from: {
      name: 'Accounting Department',
      email: 'accounting@example.com',
      avatar: 'https://i.pravatar.cc/150?u=user5'
    },
    to: [
      { name: 'John Doe', email: 'john.doe@example.com' }
    ],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: false,
    isStarred: false,
    attachments: [
      {
        id: 'attach-2',
        name: 'invoice_1234.pdf',
        type: 'application/pdf',
        size: 1.2 * 1024 * 1024, // 1.2 MB
        url: '#'
      }
    ],
    labels: ['Finance'],
    folder: 'inbox'
  }
};

// Mock handlers
const mockFetchEmails = async (folderId: string) => {
  console.log(`Fetching emails for folder: ${folderId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEmails[folderId as keyof typeof mockEmails] || [];
};

const mockFetchEmail = async (emailId: string) => {
  console.log(`Fetching email: ${emailId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockEmailContent[emailId as keyof typeof mockEmailContent] || null;
};

const mockSendEmail = async (email: any) => {
  console.log('Sending email:', email);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Promise.resolve();
};

const mockDeleteEmail = async (emailId: string) => {
  console.log('Deleting email:', emailId);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
};

const mockMarkAsRead = async (emailId: string, isRead: boolean) => {
  console.log(`Marking email ${emailId} as ${isRead ? 'read' : 'unread'}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve();
};

const mockMarkAsStarred = async (emailId: string, isStarred: boolean) => {
  console.log(`Marking email ${emailId} as ${isStarred ? 'starred' : 'unstarred'}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve();
};

const mockMoveToFolder = async (emailId: string, folderId: string) => {
  console.log(`Moving email ${emailId} to folder ${folderId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
};

// Stories
export const Default: Story = {
  args: {
    user: currentUser,
    folders: mockFolders,
    onFetchEmails: mockFetchEmails,
    onFetchEmail: mockFetchEmail,
    onSendEmail: mockSendEmail,
    onDeleteEmail: mockDeleteEmail,
    onMarkAsRead: mockMarkAsRead,
    onMarkAsStarred: mockMarkAsStarred,
    onMoveToFolder: mockMoveToFolder,
    theme: 'light',
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

export const EmptyInbox: Story = {
  args: {
    ...Default.args,
    onFetchEmails: async () => [],
  },
};