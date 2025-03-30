// React is used by Storybook
import { Meta, StoryObj } from '@storybook/react';
import { CRMApplication } from '../components/CRMApplication';

const meta: Meta<typeof CRMApplication> = {
  title: 'Business/CRMApplication',
  component: CRMApplication,
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
type Story = StoryObj<typeof CRMApplication>;

// Mock data
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=user1',
  role: 'Sales Manager',
  department: 'Sales'
};

// Generate a date object for X days ago
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const customers = [
  {
    id: 'cust-1',
    name: 'Alice Johnson',
    company: 'Acme Corporation',
    email: 'alice@acmecorp.com',
    phone: '+1 (555) 123-4567',
    status: 'customer' as const,
    industry: 'Technology',
    website: 'https://acmecorp.com',
    address: '123 Main St, San Francisco, CA 94105',
    createdAt: daysAgo(120),
    lastContactedAt: daysAgo(5),
    tags: ['enterprise', 'tech', 'high-value'],
    notes: 'Key decision maker is Alice. Renewal coming up in 3 months.',
    avatar: 'https://i.pravatar.cc/150?u=alice'
  },
  {
    id: 'cust-2',
    name: 'Bob Smith',
    company: 'Global Industries',
    email: 'bob@globalind.com',
    phone: '+1 (555) 987-6543',
    status: 'prospect' as const,
    industry: 'Manufacturing',
    website: 'https://globalindustries.com',
    address: '456 Market St, Chicago, IL 60601',
    createdAt: daysAgo(45),
    lastContactedAt: daysAgo(10),
    tags: ['manufacturing', 'mid-market'],
    notes: 'Interested in our premium plan. Follow up about pricing.',
    avatar: 'https://i.pravatar.cc/150?u=bob'
  },
  {
    id: 'cust-3',
    name: 'Carol Martinez',
    company: 'Sunshine Retail',
    email: 'carol@sunshine.com',
    phone: '+1 (555) 234-5678',
    status: 'lead' as const,
    industry: 'Retail',
    website: 'https://sunshineretail.com',
    address: '789 Broadway, New York, NY 10003',
    createdAt: daysAgo(15),
    tags: ['retail', 'small-business'],
    avatar: 'https://i.pravatar.cc/150?u=carol'
  },
  {
    id: 'cust-4',
    name: 'David Wilson',
    company: 'First Financial',
    email: 'david@firstfin.com',
    phone: '+1 (555) 345-6789',
    status: 'customer' as const,
    industry: 'Finance',
    website: 'https://firstfinancial.com',
    address: '321 Park Ave, Miami, FL 33101',
    createdAt: daysAgo(200),
    lastContactedAt: daysAgo(30),
    tags: ['finance', 'enterprise', 'high-value'],
    avatar: 'https://i.pravatar.cc/150?u=david'
  },
  {
    id: 'cust-5',
    name: 'Eva Brown',
    company: 'Health Plus',
    email: 'eva@healthplus.com',
    phone: '+1 (555) 456-7890',
    status: 'churned' as const,
    industry: 'Healthcare',
    website: 'https://healthplus.com',
    address: '654 Oak St, Seattle, WA 98101',
    createdAt: daysAgo(300),
    lastContactedAt: daysAgo(90),
    tags: ['healthcare', 'mid-market'],
    notes: 'Cancelled due to budget cuts. May revisit in next fiscal year.',
    avatar: 'https://i.pravatar.cc/150?u=eva'
  },
  {
    id: 'cust-6',
    name: 'Frank Davis',
    company: 'Eco Builders',
    email: 'frank@ecobuilders.com',
    phone: '+1 (555) 567-8901',
    status: 'lead' as const,
    industry: 'Construction',
    website: 'https://ecobuilders.com',
    address: '987 Pine St, Denver, CO 80202',
    createdAt: daysAgo(10),
    tags: ['construction', 'small-business', 'green'],
    avatar: 'https://i.pravatar.cc/150?u=frank'
  },
  {
    id: 'cust-7',
    name: 'Grace Lee',
    company: 'Creative Solutions',
    email: 'grace@creative.com',
    phone: '+1 (555) 678-9012',
    status: 'prospect' as const,
    industry: 'Marketing',
    website: 'https://creativesolutions.com',
    address: '159 Elm St, Austin, TX 78701',
    createdAt: daysAgo(60),
    lastContactedAt: daysAgo(7),
    tags: ['marketing', 'mid-market', 'creative'],
    avatar: 'https://i.pravatar.cc/150?u=grace'
  }
];

const deals = [
  {
    id: 'deal-1',
    title: 'Enterprise License Renewal',
    customerId: 'cust-1',
    value: 50000,
    currency: 'USD',
    stage: 'negotiation' as const,
    priority: 'high' as const,
    startDate: daysAgo(30),
    expectedCloseDate: daysAgo(-15),
  },
  {
    id: 'deal-2',
    title: 'Premium Plan Subscription',
    customerId: 'cust-2',
    value: 12000,
    currency: 'USD',
    stage: 'proposal' as const,
    priority: 'medium' as const,
    startDate: daysAgo(20),
    expectedCloseDate: daysAgo(-45),
  },
  {
    id: 'deal-3',
    title: 'Basic Plan Trial',
    customerId: 'cust-3',
    value: 3600,
    currency: 'USD',
    stage: 'qualification' as const,
    priority: 'low' as const,
    startDate: daysAgo(5),
    expectedCloseDate: daysAgo(-20),
  },
  {
    id: 'deal-4',
    title: 'Financial Services Add-on',
    customerId: 'cust-4',
    value: 25000,
    currency: 'USD',
    stage: 'closed-won' as const,
    priority: 'medium' as const,
    startDate: daysAgo(90),
    expectedCloseDate: daysAgo(20),
    closedDate: daysAgo(20),
  },
  {
    id: 'deal-5',
    title: 'Healthcare Package Renewal',
    customerId: 'cust-5',
    value: 18000,
    currency: 'USD',
    stage: 'closed-lost' as const,
    priority: 'medium' as const,
    startDate: daysAgo(120),
    expectedCloseDate: daysAgo(30),
    closedDate: daysAgo(30),
  },
  {
    id: 'deal-6',
    title: 'Construction Software Package',
    customerId: 'cust-6',
    value: 7500,
    currency: 'USD',
    stage: 'prospecting' as const,
    priority: 'low' as const,
    startDate: daysAgo(3),
    expectedCloseDate: daysAgo(-60),
  },
  {
    id: 'deal-7',
    title: 'Marketing Campaign Management',
    customerId: 'cust-7',
    value: 15000,
    currency: 'USD',
    stage: 'qualification' as const,
    priority: 'medium' as const,
    startDate: daysAgo(15),
    expectedCloseDate: daysAgo(-30),
  },
  {
    id: 'deal-8',
    title: 'Data Analytics Add-on',
    customerId: 'cust-1',
    value: 20000,
    currency: 'USD',
    stage: 'proposal' as const,
    priority: 'high' as const,
    startDate: daysAgo(10),
    expectedCloseDate: daysAgo(-40),
  }
];

const tasks = [
  {
    id: 'task-1',
    title: 'Follow up on enterprise license renewal',
    description: 'Call Alice to discuss renewal terms and potential upgrade to premium tier.',
    status: 'to-do' as const,
    priority: 'high' as const,
    dueDate: daysAgo(-2),
    assignedTo: 'user-1',
    relatedTo: { type: 'customer' as const, id: 'cust-1' }
  },
  {
    id: 'task-2',
    title: 'Send proposal to Global Industries',
    description: 'Finalize and send proposal document for premium plan subscription.',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    dueDate: daysAgo(-5),
    assignedTo: 'user-1',
    relatedTo: { type: 'deal' as const, id: 'deal-2' }
  },
  {
    id: 'task-3',
    title: 'Demo for Sunshine Retail',
    description: 'Schedule and prepare for product demonstration for Carol at Sunshine Retail.',
    status: 'to-do' as const,
    priority: 'low' as const,
    dueDate: daysAgo(-10),
    assignedTo: 'user-1',
    relatedTo: { type: 'customer' as const, id: 'cust-3' }
  },
  {
    id: 'task-4',
    title: 'Quarterly review with First Financial',
    description: 'Prepare quarterly business review presentation for David at First Financial.',
    status: 'completed' as const,
    priority: 'medium' as const,
    dueDate: daysAgo(10),
    completedAt: daysAgo(11),
    assignedTo: 'user-1',
    relatedTo: { type: 'customer' as const, id: 'cust-4' }
  },
  {
    id: 'task-5',
    title: 'Check in with Eva at Health Plus',
    description: 'Call Eva to see if circumstances have changed, potential to win back the business.',
    status: 'cancelled' as const,
    priority: 'low' as const,
    dueDate: daysAgo(15),
    assignedTo: 'user-1',
    relatedTo: { type: 'customer' as const, id: 'cust-5' }
  },
  {
    id: 'task-6',
    title: 'Initial discovery call with Eco Builders',
    description: 'Learn about Frank\'s needs and introduce our construction industry solutions.',
    status: 'to-do' as const,
    priority: 'medium' as const,
    dueDate: daysAgo(-1),
    assignedTo: 'user-1',
    relatedTo: { type: 'customer' as const, id: 'cust-6' }
  },
  {
    id: 'task-7',
    title: 'Prepare marketing proposal for Creative Solutions',
    description: 'Draft proposal for marketing campaign management services.',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    dueDate: daysAgo(-3),
    assignedTo: 'user-1',
    relatedTo: { type: 'deal' as const, id: 'deal-7' }
  }
];

// Mock analytics data
const analyticsData = {
  revenueByMonth: [
    { month: 'Jan', revenue: 85000 },
    { month: 'Feb', revenue: 72000 },
    { month: 'Mar', revenue: 93000 },
    { month: 'Apr', revenue: 121000 },
    { month: 'May', revenue: 110000 },
    { month: 'Jun', revenue: 105000 }
  ],
  dealsByStage: [
    { stage: 'Prospecting', count: 8 },
    { stage: 'Qualification', count: 12 },
    { stage: 'Proposal', count: 7 },
    { stage: 'Negotiation', count: 5 },
    { stage: 'Closed Won', count: 15 },
    { stage: 'Closed Lost', count: 6 }
  ],
  customersByStatus: [
    { status: 'Lead', count: 24 },
    { status: 'Prospect', count: 18 },
    { status: 'Customer', count: 35 },
    { status: 'Churned', count: 8 }
  ],
  topPerformers: [
    { userId: 'user-1', name: 'John Doe', dealsWon: 12, revenue: 180000 },
    { userId: 'user-2', name: 'Jane Smith', dealsWon: 10, revenue: 150000 },
    { userId: 'user-3', name: 'Alex Johnson', dealsWon: 8, revenue: 120000 }
  ]
};

// Mock handlers
const handleCreateCustomer = async (customer: any) => {
  console.log('Creating customer:', customer);
  return Promise.resolve({ id: `cust-${Date.now()}` });
};

const handleUpdateCustomer = async (customerId: string, data: any) => {
  console.log('Updating customer:', customerId, data);
  return Promise.resolve();
};

const handleDeleteCustomer = async (customerId: string) => {
  console.log('Deleting customer:', customerId);
  return Promise.resolve();
};

const handleCreateDeal = async (deal: any) => {
  console.log('Creating deal:', deal);
  return Promise.resolve({ id: `deal-${Date.now()}` });
};

const handleUpdateDeal = async (dealId: string, data: any) => {
  console.log('Updating deal:', dealId, data);
  return Promise.resolve();
};

const handleDeleteDeal = async (dealId: string) => {
  console.log('Deleting deal:', dealId);
  return Promise.resolve();
};

const handleCreateTask = async (task: any) => {
  console.log('Creating task:', task);
  return Promise.resolve({ id: `task-${Date.now()}` });
};

const handleUpdateTask = async (taskId: string, data: any) => {
  console.log('Updating task:', taskId, data);
  return Promise.resolve();
};

const handleDeleteTask = async (taskId: string) => {
  console.log('Deleting task:', taskId);
  return Promise.resolve();
};

const handleImportData = async (file: File) => {
  console.log('Importing data from file:', file.name);
  return Promise.resolve();
};

const handleExportData = async (type: string) => {
  console.log('Exporting data of type:', type);
  return Promise.resolve();
};

const handleFetchAnalytics = async () => {
  console.log('Fetching analytics data');
  return Promise.resolve(analyticsData);
};

// Formatter functions
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Stories
export const Default: Story = {
  args: {
    user: currentUser,
    customers,
    deals,
    tasks,
    onCreateCustomer: handleCreateCustomer,
    onUpdateCustomer: handleUpdateCustomer,
    onDeleteCustomer: handleDeleteCustomer,
    onCreateDeal: handleCreateDeal,
    onUpdateDeal: handleUpdateDeal,
    onDeleteDeal: handleDeleteDeal,
    onCreateTask: handleCreateTask,
    onUpdateTask: handleUpdateTask,
    onDeleteTask: handleDeleteTask,
    onImportData: handleImportData,
    onExportData: handleExportData,
    onFetchAnalytics: handleFetchAnalytics,
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