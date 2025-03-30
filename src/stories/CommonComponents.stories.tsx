// React is used by Storybook
import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

// Import all common components
import { 
  Avatar, 
  Badge, 
  Card, 
  FormField, 
  Modal, 
  SearchBar, 
  TabGroup 
} from '../components/common';

const meta: Meta = {
  title: 'Common/Overview',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

/**
 * Demo component to showcase all common components in one view
 */
export const CommonComponentsShowcase = () => {
  // State for interactive components
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    status: 'active',
    message: '',
    subscribe: false
  });

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Common Components</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          A collection of reusable components extracted from across the application domains.
        </p>

        {/* Tabs for different component categories */}
        <TabGroup
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'display', label: 'Display Components', badge: 2 },
            { id: 'input', label: 'Input Components', badge: 2 },
            { id: 'layout', label: 'Layout Components', badge: 2 },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Avatar Card */}
              <Card
                header={<h3 className="text-lg font-medium">Avatar</h3>}
                hoverable
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="flex space-x-4 mb-4">
                    <Avatar name="John Doe" size="sm" />
                    <Avatar name="Jane Smith" size="md" src="https://i.pravatar.cc/150?img=2" />
                    <Avatar name="Mike Brown" size="lg" src="https://i.pravatar.cc/150?img=3" status="online" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Configurable user avatars with fallback initials, status indicators, and various sizes.
                  </p>
                </div>
              </Card>

              {/* Badge Card */}
              <Card
                header={<h3 className="text-lg font-medium">Badge</h3>}
                hoverable
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info" showDot>Info</Badge>
                    <Badge variant="secondary" rounded="full">42</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Status indicators, counts, and labels with consistent styling.
                  </p>
                </div>
              </Card>

              {/* SearchBar Card */}
              <Card
                header={<h3 className="text-lg font-medium">Search</h3>}
                hoverable
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-full mb-4">
                    <SearchBar
                      value={searchValue}
                      onChange={setSearchValue}
                      placeholder="Search for anything..."
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Consistent search interface with optional filtering and instant search.
                  </p>
                </div>
              </Card>

              {/* Card showcase */}
              <Card
                header={<h3 className="text-lg font-medium">Card</h3>}
                hoverable
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-full mb-4 grid grid-cols-2 gap-4">
                    <Card variant="outline" padding="sm">
                      <p className="text-xs">Outline</p>
                    </Card>
                    <Card variant="flat" padding="sm">
                      <p className="text-xs">Flat</p>
                    </Card>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Flexible card layouts with customizable headers, footers, and styles.
                  </p>
                </div>
              </Card>

              {/* Modal Card */}
              <Card
                header={<h3 className="text-lg font-medium">Modal</h3>}
                hoverable
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                  >
                    Open Modal
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Reusable modal dialogs with configurable sections.
                  </p>
                </div>
              </Card>

              {/* FormField Card */}
              <Card
                header={<h3 className="text-lg font-medium">Form Fields</h3>}
                hoverable
              >
                <div className="flex flex-col p-4">
                  <FormField
                    label="Name"
                    name="name"
                    type="text"
                    value={formValues.name}
                    onChange={handleFormChange}
                    placeholder="Enter your name"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Standardized form controls with built-in validation.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* Avatar section */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Avatar Component</h3>
                <div className="flex flex-wrap gap-6 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sizes</h4>
                    <div className="flex items-center space-x-4">
                      <Avatar name="XS User" size="xs" />
                      <Avatar name="SM User" size="sm" />
                      <Avatar name="MD User" size="md" />
                      <Avatar name="LG User" size="lg" />
                      <Avatar name="XL User" size="xl" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">With Image</h4>
                    <div className="flex items-center space-x-4">
                      <Avatar name="John Doe" src="https://i.pravatar.cc/150?img=1" size="md" />
                      <Avatar name="Jane Smith" src="https://i.pravatar.cc/150?img=2" size="md" />
                      <Avatar name="Bob Johnson" src="https://i.pravatar.cc/150?img=3" size="md" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">With Status</h4>
                    <div className="flex items-center space-x-4">
                      <Avatar name="User" size="md" status="online" />
                      <Avatar name="User" size="md" status="away" />
                      <Avatar name="User" size="md" status="busy" />
                      <Avatar name="User" size="md" status="offline" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Badge section */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Badge Component</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Variants</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="danger">Danger</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                      <Badge variant="neutral">Neutral</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sizes</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary" size="sm">Small</Badge>
                      <Badge variant="primary" size="md">Medium</Badge>
                      <Badge variant="primary" size="lg">Large</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">With Dot</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success" showDot>Online</Badge>
                      <Badge variant="warning" showDot>Away</Badge>
                      <Badge variant="danger" showDot>Offline</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Outlined</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary" outlined>Primary</Badge>
                      <Badge variant="success" outlined>Success</Badge>
                      <Badge variant="danger" outlined>Danger</Badge>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'input' && (
            <div className="space-y-6">
              {/* Search Bar section */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Search Bar Component</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Default</h4>
                    <SearchBar
                      value={searchValue}
                      onChange={setSearchValue}
                      placeholder="Search..."
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">With Filter Button</h4>
                    <SearchBar
                      value={searchValue}
                      onChange={setSearchValue}
                      placeholder="Search products..."
                      showFilterButton
                      onFilterClick={() => alert('Filter clicked')}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Variants</h4>
                    <div className="space-y-2">
                      <SearchBar
                        value={searchValue}
                        onChange={setSearchValue}
                        placeholder="Default variant..."
                        variant="default"
                      />
                      <SearchBar
                        value={searchValue}
                        onChange={setSearchValue}
                        placeholder="Outline variant..."
                        variant="outline"
                      />
                      <SearchBar
                        value={searchValue}
                        onChange={setSearchValue}
                        placeholder="Filled variant..."
                        variant="filled"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Form Field section */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Form Field Component</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Text Input</h4>
                    <FormField
                      label="Name"
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={handleFormChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Email Input</h4>
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email"
                      helperText="We'll never share your email."
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Select Input</h4>
                    <FormField
                      label="Status"
                      name="status"
                      type="select"
                      value={formValues.status}
                      onChange={handleFormChange}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'pending', label: 'Pending' }
                      ]}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Textarea</h4>
                    <FormField
                      label="Message"
                      name="message"
                      type="textarea"
                      value={formValues.message}
                      onChange={handleFormChange}
                      placeholder="Enter your message"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Checkbox</h4>
                    <FormField
                      label="Subscribe to newsletter"
                      name="subscribe"
                      type="checkbox"
                      value={formValues.subscribe}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">With Validation Error</h4>
                    <FormField
                      label="Username"
                      name="username"
                      type="text"
                      value=""
                      onChange={() => {}}
                      error="Username is required"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* Card section */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Card Component</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card
                    header={<h4 className="text-base font-medium">Default Card</h4>}
                    footer={<button className="text-blue-600 hover:text-blue-800">Action</button>}
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      A card with default styling, header, and footer.
                    </p>
                  </Card>
                  
                  <Card
                    variant="outline"
                    header={<h4 className="text-base font-medium">Outline Variant</h4>}
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      A card with outline styling and no shadow.
                    </p>
                  </Card>
                  
                  <Card
                    variant="flat"
                    header={<h4 className="text-base font-medium">Flat Variant</h4>}
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      A card with flat styling and subtle background.
                    </p>
                  </Card>
                  
                  <Card
                    hoverable
                    selected
                  >
                    <h4 className="text-base font-medium mb-2">Hoverable & Selected</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Hover over this card to see the effect. It's also in a selected state.
                    </p>
                  </Card>
                  
                  <Card
                    padding="lg"
                  >
                    <h4 className="text-base font-medium mb-2">Large Padding</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      This card has larger padding around its content.
                    </p>
                  </Card>
                  
                  <Card
                    padding="sm"
                    interactive
                    onClick={() => alert('Card clicked')}
                  >
                    <h4 className="text-base font-medium mb-2">Interactive Card</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Click on this card to trigger an action.
                    </p>
                  </Card>
                </div>
              </section>

              {/* Tab Group section */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Tab Group Component</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Underline Variant (Default)</h4>
                    <TabGroup
                      tabs={[
                        { id: 'tab1', label: 'Account' },
                        { id: 'tab2', label: 'Password' },
                        { id: 'tab3', label: 'Settings' }
                      ]}
                      activeTab="tab1"
                      onChange={() => {}}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Pills Variant</h4>
                    <TabGroup
                      tabs={[
                        { id: 'tab1', label: 'Day' },
                        { id: 'tab2', label: 'Week' },
                        { id: 'tab3', label: 'Month' }
                      ]}
                      activeTab="tab2"
                      onChange={() => {}}
                      variant="pills"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Buttons Variant</h4>
                    <TabGroup
                      tabs={[
                        { id: 'tab1', label: 'All' },
                        { id: 'tab2', label: 'Active', badge: 5 },
                        { id: 'tab3', label: 'Archived' }
                      ]}
                      activeTab="tab2"
                      onChange={() => {}}
                      variant="buttons"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bordered Variant</h4>
                    <TabGroup
                      tabs={[
                        { id: 'tab1', label: 'Details' },
                        { id: 'tab2', label: 'Reviews' },
                        { id: 'tab3', label: 'Shipping', disabled: true }
                      ]}
                      activeTab="tab1"
                      onChange={() => {}}
                      variant="bordered"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      {/* Modal demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Example"
        footer={
          <>
            <button 
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setIsModalOpen(false)}
            >
              Confirm
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This is a reusable modal component that can be used across all applications.
            It supports custom headers, content, and footers.
          </p>
          <FormField
            label="Sample Input"
            name="sampleInput"
            type="text"
            value=""
            onChange={() => {}}
            placeholder="Try typing here..."
          />
        </div>
      </Modal>
    </div>
  );
};

// Type for the showcase story
type Story = StoryObj<typeof CommonComponentsShowcase>;

// Export the story
export const Showcase: Story = {
  name: 'Common Components'
};