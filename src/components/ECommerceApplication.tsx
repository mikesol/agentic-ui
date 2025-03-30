import React, { useState } from 'react';
import { ProductList } from './ProductList';
import { ProductDetail } from './ProductDetail';
import { ShoppingCart } from './ShoppingCart';
import { Checkout } from './Checkout';
import { Avatar } from './Avatar';

/**
 * @component ECommerceApplication
 * @description A complete e-commerce application with product browsing, cart management, and checkout
 * @domain e-commerce, retail, shopping
 * @usage Shopping interface with product listings, cart management, and checkout process
 * 
 * @example
 * // Basic usage with default styling
 * <ECommerceApplication 
 *   user={{ id: 'user-1', name: 'John Doe', email: 'john@example.com' }}
 *   products={products}
 *   onAddToCart={(product, quantity) => api.addToCart(product, quantity)}
 *   onCheckout={(cart, shippingDetails) => api.processOrder(cart, shippingDetails)}
 * />
 * 
 * @example
 * // With custom handlers and theme
 * <ECommerceApplication 
 *   user={currentUser}
 *   products={products}
 *   categories={categories}
 *   onAddToCart={handleAddToCart}
 *   onUpdateCart={handleUpdateCart}
 *   onCheckout={handleCheckout}
 *   onProductView={handleProductView}
 *   theme="dark"
 * />
 */
export interface ECommerceApplicationProps {
  /** Current user information */
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  
  /** Products available in the store */
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    images: string[];
    categoryId?: string;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
    inventory?: number;
    discount?: number;
    featured?: boolean;
    specifications?: Record<string, string>;
    options?: Array<{
      name: string;
      values: string[];
    }>;
  }>;
  
  /** Product categories */
  categories?: Array<{
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    image?: string;
  }>;
  
  /** Function to handle adding a product to the cart */
  onAddToCart: (productId: string, quantity: number, options?: Record<string, string>) => Promise<void> | void;
  
  /** Function to handle updating cart items */
  onUpdateCart?: (cartItemId: string, quantity: number) => Promise<void> | void;
  
  /** Function to handle removing items from the cart */
  onRemoveFromCart?: (cartItemId: string) => Promise<void> | void;
  
  /** Function to handle checkout process */
  onCheckout: (
    cartItems: Array<{
      productId: string;
      quantity: number;
      options?: Record<string, string>;
    }>,
    shippingDetails: {
      name: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      email: string;
      phone?: string;
    },
    paymentDetails: {
      method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | string;
      cardNumber?: string;
      cardExpiry?: string;
      cardCvc?: string;
      billingAddress?: string;
    }
  ) => Promise<{ orderId: string }> | void;
  
  /** Function to track product views */
  onProductView?: (productId: string) => Promise<void> | void;
  
  /** Function to handle product search */
  onSearch?: (query: string) => Promise<Array<any>> | void;
  
  /** Function to handle filtering products */
  onFilter?: (filters: Record<string, any>) => Promise<Array<any>> | void;
  
  /** Function to fetch related products */
  onFetchRelatedProducts?: (productId: string) => Promise<Array<any>> | void;
  
  /** Theme (optional) */
  theme?: 'light' | 'dark' | 'system' | string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

type ViewType = 'productList' | 'productDetail' | 'cart' | 'checkout';

/**
 * ECommerceApplication Component
 */
export const ECommerceApplication: React.FC<ECommerceApplicationProps> = ({
  user,
  products,
  categories = [],
  onAddToCart,
  onUpdateCart,
  onRemoveFromCart,
  onCheckout,
  onProductView,
  onSearch,
  onFilter,
  onFetchRelatedProducts,
  theme = 'light',
  className = '',
  style = {}
}) => {
  // Current view state
  const [currentView, setCurrentView] = useState<ViewType>('productList');
  
  // Selected product for detail view
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Shopping cart items
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    productId: string;
    quantity: number;
    options?: Record<string, string>;
  }>>([]);
  
  // Format currency based on currency code
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(amount);
  };
  
  // Calculate cart totals
  const cartTotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    
    const price = product.discount 
      ? product.price * (1 - product.discount / 100) 
      : product.price;
    
    return sum + (price * item.quantity);
  }, 0);
  
  // Handle adding a product to the cart
  const handleAddToCart = async (productId: string, quantity: number, options?: Record<string, string>) => {
    // Call the external handler
    if (onAddToCart) {
      await onAddToCart(productId, quantity, options);
    }
    
    // Update local state
    const cartItemId = `cart-item-${Date.now()}`;
    setCartItems(prev => [...prev, { id: cartItemId, productId, quantity, options }]);
  };
  
  // Handle updating cart item quantity
  const handleUpdateCart = async (cartItemId: string, quantity: number) => {
    // Call the external handler
    if (onUpdateCart) {
      await onUpdateCart(cartItemId, quantity);
    }
    
    // Update local state
    setCartItems(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity } : item
    ));
  };
  
  // Handle removing an item from the cart
  const handleRemoveFromCart = async (cartItemId: string) => {
    // Call the external handler
    if (onRemoveFromCart) {
      await onRemoveFromCart(cartItemId);
    }
    
    // Update local state
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };
  
  // Handle checkout process
  const handleCheckout = async (
    shippingDetails: any,
    paymentDetails: any
  ) => {
    // Call the external handler
    const cartItemsForCheckout = cartItems.map(({ productId, quantity, options }) => ({
      productId, quantity, options
    }));
    
    const result = await onCheckout(cartItemsForCheckout, shippingDetails, paymentDetails);
    
    // Clear cart after successful checkout
    if (result && result.orderId) {
      setCartItems([]);
      setCurrentView('productList');
    }
    
    return result;
  };
  
  // Handle viewing a product's details
  const handleViewProduct = async (productId: string) => {
    setSelectedProduct(productId);
    setCurrentView('productDetail');
    
    // Track product view if handler provided
    if (onProductView) {
      await onProductView(productId);
    }
  };
  
  // Render the main content based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case 'productList':
        return (
          <ProductList
            products={products}
            categories={categories}
            formatCurrency={formatCurrency}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            onSearch={onSearch}
            onFilter={onFilter}
          />
        );
        
      case 'productDetail':
        if (!selectedProduct) {
          return null;
        }
        
        const product = products.find(p => p.id === selectedProduct);
        if (!product) {
          return <div>Product not found</div>;
        }
        
        return (
          <ProductDetail
            product={product}
            formatCurrency={formatCurrency}
            onAddToCart={handleAddToCart}
            onBackToList={() => setCurrentView('productList')}
            onFetchRelatedProducts={onFetchRelatedProducts}
          />
        );
        
      case 'cart':
        return (
          <ShoppingCart
            cartItems={cartItems}
            products={products}
            formatCurrency={formatCurrency}
            onUpdateCart={handleUpdateCart}
            onRemoveFromCart={handleRemoveFromCart}
            onContinueShopping={() => setCurrentView('productList')}
            onProceedToCheckout={() => setCurrentView('checkout')}
          />
        );
        
      case 'checkout':
        return (
          <Checkout
            cartItems={cartItems}
            products={products}
            user={user}
            formatCurrency={formatCurrency}
            onBackToCart={() => setCurrentView('cart')}
            onProcessCheckout={handleCheckout}
          />
        );
        
      default:
        return <div>Select a view</div>;
    }
  };
  
  return (
    <div 
      className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''} ${className}`}
      style={style}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer"
              onClick={() => setCurrentView('productList')}
            >
              ShopUI
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentView('cart')}
                className="relative p-2"
              >
                <svg 
                  className="w-6 h-6 text-gray-600 dark:text-gray-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
              
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-300">
                    {user.name}
                  </span>
                  <Avatar
                    name={user.name}
                    src={user.avatar}
                    size="sm"
                    shape="circle"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {renderMainContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} ShopUI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ECommerceApplication;