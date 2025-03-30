// React is used by Storybook
import { Meta, StoryObj } from '@storybook/react';
import { BankingApplication } from '../components/BankingApplication';

const meta: Meta<typeof BankingApplication> = {
  title: 'Finance/BankingApplication',
  component: BankingApplication,
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
type Story = StoryObj<typeof BankingApplication>;

// Mock data
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=user1',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Anytown, USA 12345',
  notifications: {
    email: true,
    push: true,
    sms: false
  }
};

const accounts = [
  {
    id: 'acc-1',
    name: 'Checking Account',
    type: 'checking',
    balance: 2543.71,
    currency: 'USD',
    number: '****1234',
    available: 2543.71
  },
  {
    id: 'acc-2',
    name: 'Savings Account',
    type: 'savings',
    balance: 12750.83,
    currency: 'USD',
    number: '****5678',
    available: 12750.83,
    interestRate: 0.75
  },
  {
    id: 'acc-3',
    name: 'Credit Card',
    type: 'credit',
    balance: -450.24,
    currency: 'USD',
    number: '****9012',
    available: 4549.76,
    limit: 5000
  }
];

const transactions = [
  {
    id: 'tx-1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: 'Grocery Store',
    amount: 78.42,
    type: 'debit',
    category: 'food',
    accountId: 'acc-1',
    status: 'completed'
  },
  {
    id: 'tx-2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: 'Monthly Salary',
    amount: 3500.00,
    type: 'credit',
    category: 'income',
    accountId: 'acc-1',
    status: 'completed'
  },
  {
    id: 'tx-3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    description: 'Electric Bill',
    amount: 95.40,
    type: 'debit',
    category: 'utilities',
    accountId: 'acc-1',
    status: 'completed'
  },
  {
    id: 'tx-4',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    description: 'Restaurant',
    amount: 53.75,
    type: 'debit',
    category: 'dining',
    accountId: 'acc-3',
    status: 'completed'
  },
  {
    id: 'tx-5',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: 'Savings Transfer',
    amount: 500.00,
    type: 'debit',
    category: 'transfer',
    accountId: 'acc-1',
    status: 'completed'
  },
  {
    id: 'tx-6',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: 'Savings Transfer',
    amount: 500.00,
    type: 'credit',
    category: 'transfer',
    accountId: 'acc-2',
    status: 'completed'
  },
  {
    id: 'tx-7',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    description: 'Online Shopping',
    amount: 125.30,
    type: 'debit',
    category: 'shopping',
    accountId: 'acc-3',
    status: 'completed'
  },
  {
    id: 'tx-8',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: 'Gas Station',
    amount: 45.60,
    type: 'debit',
    category: 'transportation',
    accountId: 'acc-1',
    status: 'completed'
  }
];

const messages = [
  {
    id: 'msg-1',
    subject: 'Welcome to Online Banking',
    body: `<p>Dear John Doe,</p>
           <p>Welcome to our online banking platform! We're excited to have you as a customer.</p>
           <p>Here are a few things you can do with your new account:</p>
           <ul>
             <li>Check your account balances</li>
             <li>Transfer money between accounts</li>
             <li>Pay bills</li>
             <li>View transaction history</li>
           </ul>
           <p>If you have any questions, please don't hesitate to contact us.</p>
           <p>Best regards,<br>The Bank Team</p>`,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isRead: true,
    sender: 'bank'
  },
  {
    id: 'msg-2',
    subject: 'Security Alert: Login from New Device',
    body: `<p>Dear John Doe,</p>
           <p>We detected a login to your account from a new device or location.</p>
           <p><strong>Time:</strong> ${new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleString()}</p>
           <p><strong>Location:</strong> New York, USA</p>
           <p><strong>Device:</strong> iPhone</p>
           <p>If this was you, no action is needed. If you did not login at this time, please contact our security department immediately.</p>
           <p>Best regards,<br>The Security Team</p>`,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    isRead: true,
    sender: 'bank'
  },
  {
    id: 'msg-3',
    subject: 'Question about transaction',
    body: `<p>Hello,</p>
           <p>I noticed a transaction on my account that I don't recognize. It was for $53.75 at a restaurant on ${new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}. Can you provide more details about this charge?</p>
           <p>Thank you,<br>John</p>`,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    sender: 'user'
  },
  {
    id: 'msg-4',
    subject: 'Re: Question about transaction',
    body: `<p>Dear John,</p>
           <p>Thank you for your message. I've looked up the transaction in question.</p>
           <p>The charge for $53.75 was made at "City Bistro" on ${new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString()} at 7:32 PM using your credit card ending in 9012.</p>
           <p>If you still don't recognize this transaction, please let us know and we can initiate a dispute.</p>
           <p>Best regards,<br>Customer Support</p>`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: false,
    sender: 'bank'
  },
  {
    id: 'msg-5',
    subject: 'New Statement Available',
    body: `<p>Dear John Doe,</p>
           <p>Your monthly statement for the period ending ${new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} is now available.</p>
           <p>Account Summary:</p>
           <ul>
             <li>Checking Account: $2,543.71</li>
             <li>Savings Account: $12,750.83</li>
             <li>Credit Card: -$450.24</li>
           </ul>
           <p>You can view your complete statement by clicking the link below.</p>
           <p><a href="#">View Statement</a></p>
           <p>Thank you for banking with us!</p>`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: false,
    sender: 'bank',
    attachments: [
      {
        id: 'att-1',
        name: 'statement_march_2023.pdf',
        type: 'application/pdf',
        url: '#',
        size: 1240000
      }
    ]
  }
];

const contacts = [
  {
    id: 'contact-1',
    name: 'Jane Smith',
    accountNumber: '9876543210',
    bank: 'Chase Bank',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user2'
  },
  {
    id: 'contact-2',
    name: 'Mike Johnson',
    accountNumber: '5432167890',
    bank: 'Bank of America',
    email: 'mike.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user3'
  },
  {
    id: 'contact-3',
    name: 'Sarah Williams',
    accountNumber: '1234567890',
    bank: 'Wells Fargo',
    email: 'sarah.williams@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user4'
  }
];

// Mock handlers
const handleSendMessage = async (message: any) => {
  console.log('Message sent:', message);
  return Promise.resolve();
};

const handleTransfer = async (transfer: any) => {
  console.log('Transfer processed:', transfer);
  return Promise.resolve();
};

const handleUpdateProfile = async (profileData: any) => {
  console.log('Profile updated:', profileData);
  return Promise.resolve();
};

const handleFetchMoreTransactions = async () => {
  console.log('Fetching more transactions...');
  return Promise.resolve([]);
};

// Currency formatter
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

// Stories
export const Default: Story = {
  args: {
    user: currentUser,
    accounts,
    transactions,
    messages,
    contacts,
    onSendMessage: handleSendMessage,
    onTransfer: handleTransfer,
    onUpdateProfile: handleUpdateProfile,
    onFetchMoreTransactions: handleFetchMoreTransactions,
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