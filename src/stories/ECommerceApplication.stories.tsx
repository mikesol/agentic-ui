// React is used by Storybook
import { Meta, StoryObj } from '@storybook/react';
import { ECommerceApplication } from '../components/ECommerceApplication';

const meta: Meta<typeof ECommerceApplication> = {
  title: 'E-Commerce/ECommerceApplication',
  component: ECommerceApplication,
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
type Story = StoryObj<typeof ECommerceApplication>;

// Mock data
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=user1',
};

const products = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation, high-fidelity sound, and all-day battery life.',
    price: 199.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1524678714210-9917a6c619c2?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-1',
    tags: ['audio', 'headphones', 'wireless', 'premium'],
    rating: 4.7,
    reviewCount: 128,
    inventory: 25,
    featured: true,
    specifications: {
      'Battery Life': 'Up to 20 hours',
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Noise Cancellation': 'Active',
      'Connectivity': 'Bluetooth 5.0, 3.5mm jack',
      'Weight': '250g'
    },
    options: [
      {
        name: 'Color',
        values: ['Black', 'White', 'Blue']
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Smart Watch',
    description: 'Track your fitness, receive notifications, and more with this advanced smartwatch featuring a bright OLED display.',
    price: 249.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-2',
    tags: ['wearable', 'smartwatch', 'fitness'],
    rating: 4.5,
    reviewCount: 87,
    discount: 10,
    inventory: 42,
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery Life': 'Up to 7 days',
      'Water Resistance': '5 ATM',
      'Sensors': 'Heart rate, GPS, Accelerometer',
      'Compatibility': 'iOS, Android',
      'Weight': '48g'
    },
    options: [
      {
        name: 'Band',
        values: ['Silicon', 'Leather', 'Metal']
      },
      {
        name: 'Size',
        values: ['40mm', '44mm']
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging for all Qi-compatible devices with sleek, minimalist design.',
    price: 39.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1612815568527-192424c48b6c?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-3',
    tags: ['charger', 'wireless', 'accessories'],
    rating: 4.2,
    reviewCount: 56,
    discount: 15,
    inventory: 120,
    specifications: {
      'Charging Speed': 'Up to 15W',
      'Compatibility': 'Qi-enabled devices',
      'Input': 'USB-C',
      'Dimensions': '100mm x 100mm x 10mm',
      'LED Indicator': 'Yes'
    },
    options: [
      {
        name: 'Color',
        values: ['Black', 'White']
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with immersive 360° sound and waterproof design, perfect for any adventure.',
    price: 129.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-1',
    tags: ['audio', 'speaker', 'bluetooth', 'portable'],
    rating: 4.3,
    reviewCount: 95,
    inventory: 38,
    specifications: {
      'Sound Output': '20W',
      'Battery Life': 'Up to 12 hours',
      'Water Resistance': 'IPX7',
      'Connectivity': 'Bluetooth 5.0, AUX',
      'Dimensions': '180mm x 70mm',
      'Weight': '650g'
    },
    options: [
      {
        name: 'Color',
        values: ['Black', 'Blue', 'Red']
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Laptop Backpack',
    description: 'Durable backpack with padded laptop compartment, multiple organization pockets, and water-resistant material.',
    price: 79.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-4',
    tags: ['bag', 'backpack', 'laptop', 'travel'],
    rating: 4.6,
    reviewCount: 113,
    discount: 20,
    inventory: 85,
    specifications: {
      'Capacity': '25L',
      'Laptop Compartment': 'Fits up to 15.6"',
      'Material': 'Polyester, Water-resistant',
      'Dimensions': '45cm x 30cm x 20cm',
      'Weight': '0.9kg',
      'Pockets': '6'
    },
    options: [
      {
        name: 'Color',
        values: ['Black', 'Navy', 'Gray']
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with premium sound quality, touch controls, and compact charging case.',
    price: 149.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-1',
    tags: ['audio', 'earbuds', 'wireless'],
    rating: 4.4,
    reviewCount: 76,
    inventory: 57,
    featured: true,
    specifications: {
      'Battery Life': 'Up to 6 hours (24 hours with case)',
      'Driver Size': '7mm',
      'Water Resistance': 'IPX4',
      'Connectivity': 'Bluetooth 5.0',
      'Controls': 'Touch',
      'Microphones': 'Dual'
    },
    options: [
      {
        name: 'Color',
        values: ['Black', 'White']
      }
    ]
  },
  {
    id: 'prod-7',
    name: 'External SSD 1TB',
    description: 'High-speed external solid state drive with compact design for easy storage and backup.',
    price: 159.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1596452932476-7461adb14b1b?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-3',
    tags: ['storage', 'ssd', 'accessories'],
    rating: 4.8,
    reviewCount: 42,
    discount: 5,
    inventory: 94,
    specifications: {
      'Capacity': '1TB',
      'Interface': 'USB 3.2 Gen 2',
      'Read Speed': 'Up to 1050 MB/s',
      'Write Speed': 'Up to 1000 MB/s',
      'Dimensions': '95mm x 50mm x 9mm',
      'Weight': '58g'
    }
  },
  {
    id: 'prod-8',
    name: 'Smartphone Stand',
    description: 'Adjustable aluminum stand for phones and tablets with stable base and cable management.',
    price: 29.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1603380380244-241a9b8f6f1f?q=80&w=500&h=500&fit=crop'
    ],
    categoryId: 'cat-3',
    tags: ['accessories', 'stand', 'desk'],
    rating: 4.1,
    reviewCount: 29,
    inventory: 150,
    specifications: {
      'Material': 'Aluminum alloy',
      'Adjustable Height': 'Yes',
      'Adjustable Angle': 'Yes',
      'Compatibility': 'Phones and tablets up to 10.5"',
      'Folding': 'Yes',
      'Weight': '210g'
    },
    options: [
      {
        name: 'Color',
        values: ['Silver', 'Black', 'Rose Gold']
      }
    ]
  }
];

const categories = [
  {
    id: 'cat-1',
    name: 'Audio',
    description: 'Headphones, speakers, and audio accessories'
  },
  {
    id: 'cat-2',
    name: 'Wearables',
    description: 'Smartwatches and fitness trackers'
  },
  {
    id: 'cat-3',
    name: 'Accessories',
    description: 'Chargers, stands, and other accessories'
  },
  {
    id: 'cat-4',
    name: 'Bags',
    description: 'Backpacks, cases, and travel bags'
  }
];

// Mock handlers
const handleAddToCart = async (productId: string, quantity: number, options?: Record<string, string>) => {
  console.log('Added to cart:', { productId, quantity, options });
  return Promise.resolve();
};

const handleUpdateCart = async (cartItemId: string, quantity: number) => {
  console.log('Updated cart item:', { cartItemId, quantity });
  return Promise.resolve();
};

const handleRemoveFromCart = async (cartItemId: string) => {
  console.log('Removed from cart:', { cartItemId });
  return Promise.resolve();
};

const handleCheckout = async (cartItems: any, shippingDetails: any, paymentDetails: any) => {
  console.log('Checkout:', { cartItems, shippingDetails, paymentDetails });
  return Promise.resolve({ orderId: `ORD-${Date.now()}` });
};

const handleProductView = async (productId: string) => {
  console.log('Product viewed:', productId);
  return Promise.resolve();
};

const handleSearch = async (query: string) => {
  console.log('Search query:', query);
  return Promise.resolve(products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase())
  ));
};

const handleFilter = async (filters: Record<string, any>) => {
  console.log('Filter applied:', filters);
  return Promise.resolve(products.filter(p => {
    if (filters.categoryId && p.categoryId !== filters.categoryId) {
      return false;
    }
    return true;
  }));
};

const handleFetchRelatedProducts = async (productId: string) => {
  const product = products.find(p => p.id === productId);
  if (!product) return Promise.resolve([]);
  
  return Promise.resolve(
    products
      .filter(p => p.id !== productId && (
        p.categoryId === product.categoryId || 
        (p.tags && product.tags && p.tags.some(tag => product.tags!.includes(tag)))
      ))
      .slice(0, 4)
  );
};

// Stories
export const Default: Story = {
  args: {
    user: currentUser,
    products,
    categories,
    onAddToCart: handleAddToCart,
    onUpdateCart: handleUpdateCart,
    onRemoveFromCart: handleRemoveFromCart,
    onCheckout: handleCheckout,
    onProductView: handleProductView,
    onSearch: handleSearch,
    onFilter: handleFilter,
    onFetchRelatedProducts: handleFetchRelatedProducts,
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