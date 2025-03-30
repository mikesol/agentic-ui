import React from 'react';
import { MediaAttachment } from './MediaAttachment';

/**
 * @component ShoppingCart
 * @description Displays the shopping cart with items, quantities, and totals
 * @domain e-commerce, retail, shopping
 * @usage Display cart contents, update quantities, and proceed to checkout
 * 
 * @example
 * // Basic usage
 * <ShoppingCart 
 *   cartItems={cartItems}
 *   products={products}
 *   formatCurrency={formatCurrency}
 *   onUpdateCart={handleUpdateCart}
 *   onRemoveFromCart={handleRemoveFromCart}
 *   onContinueShopping={() => setView('productList')}
 *   onProceedToCheckout={() => setView('checkout')}
 * />
 */
export interface ShoppingCartProps {
  /** Items in the cart */
  cartItems: Array<{
    id: string;
    productId: string;
    quantity: number;
    options?: Record<string, string>;
  }>;
  
  /** All products (used to get product details by ID) */
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    images: string[];
    discount?: number;
    inventory?: number;
  }>;
  
  /** Function to format currency display */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to handle updating cart items */
  onUpdateCart: (cartItemId: string, quantity: number) => Promise<void> | void;
  
  /** Function to handle removing items from the cart */
  onRemoveFromCart: (cartItemId: string) => Promise<void> | void;
  
  /** Function to navigate back to shopping */
  onContinueShopping: () => void;
  
  /** Function to proceed to checkout */
  onProceedToCheckout: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ShoppingCart Component
 */
export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  products,
  formatCurrency,
  onUpdateCart,
  onRemoveFromCart,
  onContinueShopping,
  onProceedToCheckout,
  className = '',
  style = {}
}) => {
  // Calculate totals
  const { subtotal, taxes, shipping, total } = calculateCartTotals(cartItems, products);
  
  // Calculate totals function
  function calculateCartTotals(
    items: ShoppingCartProps['cartItems'],
    productsList: ShoppingCartProps['products']
  ) {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const product = productsList.find(p => p.id === item.productId);
      if (!product) return sum;
      
      const price = product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      
      return sum + (price * item.quantity);
    }, 0);
    
    // Estimate taxes (for example purposes)
    const taxes = subtotal * 0.08; // 8% tax rate
    
    // Shipping cost (free over $50 for example)
    const shipping = subtotal > 50 ? 0 : 5.99;
    
    // Calculate total
    const total = subtotal + taxes + shipping;
    
    return { subtotal, taxes, shipping, total };
  }
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`} style={style}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          // Empty cart state
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Looks like you haven't added any products to your cart yet
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onContinueShopping}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start shopping
              </button>
            </div>
          </div>
        ) : (
          // Cart with items
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="md:col-span-2">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Product</span>
                  <span className="text-right">Total</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {cartItems.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  
                  const price = product.discount 
                    ? product.price * (1 - product.discount / 100) 
                    : product.price;
                  
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                          <MediaAttachment
                            type="image"
                            url={product.images[0]}
                            altText={product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </h3>
                          
                          {item.options && Object.keys(item.options).length > 0 && (
                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {Object.entries(item.options).map(([key, value]) => (
                                <p key={key}>{key}: {value}</p>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-2 flex items-center">
                            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Qty:</span>
                            <select
                              value={item.quantity}
                              onChange={(e) => onUpdateCart(item.id, parseInt(e.target.value))}
                              className="rounded border border-gray-300 dark:border-gray-600 py-1 text-base text-gray-900 dark:text-white dark:bg-gray-700"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {formatCurrency(itemTotal, product.currency)}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(item.id)}
                          className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-base text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-base text-gray-600 dark:text-gray-300">Taxes</span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(taxes)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-base text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4 border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onProceedToCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;