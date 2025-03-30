import React, { useState } from 'react';

/**
 * @component Checkout
 * @description Handles the checkout process with shipping, payment, and order review
 * @domain e-commerce, retail, shopping
 * @usage Process checkout with shipping details, payment information, and order summary
 * 
 * @example
 * // Basic usage
 * <Checkout 
 *   cartItems={cartItems}
 *   products={products}
 *   formatCurrency={formatCurrency}
 *   onBackToCart={() => setView('cart')}
 *   onProcessCheckout={handleCheckout}
 * />
 * 
 * @example
 * // With user information pre-filled
 * <Checkout 
 *   cartItems={cartItems}
 *   products={products}
 *   user={currentUser}
 *   formatCurrency={formatCurrency}
 *   onBackToCart={() => setView('cart')}
 *   onProcessCheckout={handleCheckout}
 * />
 */
export interface CheckoutProps {
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
    price: number;
    currency?: string;
    images: string[];
    discount?: number;
  }>;
  
  /** Current user information (optional) */
  user?: {
    id: string;
    name: string;
    email: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  
  /** Function to format currency display */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to navigate back to cart */
  onBackToCart: () => void;
  
  /** Function to process checkout */
  onProcessCheckout: (
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
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

type CheckoutStep = 'shipping' | 'payment' | 'review';

/**
 * Checkout Component
 */
export const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  products,
  user,
  formatCurrency,
  onBackToCart,
  onProcessCheckout,
  className = '',
  style = {}
}) => {
  // Current checkout step
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  
  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
    country: user?.country || 'US',
    phone: user?.phone || ''
  });
  
  // Payment information state
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card' as const,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingAddress: 'same' // 'same' or 'different'
  });
  
  // Loading state during checkout
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Success state after checkout
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Calculate order totals
  const { subtotal, taxes, shipping, total } = calculateOrderTotals(cartItems, products);
  
  function calculateOrderTotals(
    items: CheckoutProps['cartItems'],
    productsList: CheckoutProps['products']
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
    
    // Estimate taxes
    const taxes = subtotal * 0.08; // 8% tax rate
    
    // Shipping cost
    const shipping = subtotal > 50 ? 0 : 5.99;
    
    // Calculate total
    const total = subtotal + taxes + shipping;
    
    return { subtotal, taxes, shipping, total };
  }
  
  // Handle shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };
  
  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };
  
  // Handle order submission
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const result = await onProcessCheckout(shippingInfo, paymentInfo);
      
      if (result && result.orderId) {
        setOrderId(result.orderId);
        setOrderComplete(true);
      }
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Render form steps based on current step
  const renderCheckoutStep = () => {
    if (orderComplete) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Order Complete!</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your order #{orderId} has been successfully placed. You'll receive a confirmation email shortly.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.location.reload()} // Reload the page to start fresh
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 'shipping':
        return (
          <form onSubmit={handleShippingSubmit}>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ZIP / Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    required
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="MX">Mexico</option>
                    <option value="GB">United Kingdom</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="JP">Japan</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={onBackToCart}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Cart
              </button>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        );
        
      case 'payment':
        return (
          <form onSubmit={handlePaymentSubmit}>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Payment Method</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select payment method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="credit-card"
                      name="method"
                      type="radio"
                      value="credit_card"
                      checked={paymentInfo.method === 'credit_card'}
                      onChange={handlePaymentChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Credit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="method"
                      type="radio"
                      value="paypal"
                      checked={paymentInfo.method === 'paypal'}
                      onChange={handlePaymentChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              {paymentInfo.method === 'credit_card' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Card number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Expiration date (MM/YY)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={paymentInfo.cardExpiry}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          required
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        CVC
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={paymentInfo.cardCvc}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          required
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Billing address
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="billing-same"
                          name="billingAddress"
                          type="radio"
                          value="same"
                          checked={paymentInfo.billingAddress === 'same'}
                          onChange={handlePaymentChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="billing-same" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Same as shipping address
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="billing-different"
                          name="billingAddress"
                          type="radio"
                          value="different"
                          checked={paymentInfo.billingAddress === 'different'}
                          onChange={handlePaymentChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="billing-different" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Use a different billing address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('shipping')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Shipping
              </button>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Review Order
              </button>
            </div>
          </form>
        );
        
      case 'review':
        return (
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Review Your Order</h2>
            
            <div className="space-y-8">
              {/* Order summary */}
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Items</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {cartItems.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      
                      const price = product.discount 
                        ? product.price * (1 - product.discount / 100) 
                        : product.price;
                      
                      return (
                        <li key={item.id} className="py-3 flex justify-between">
                          <div className="flex items-center">
                            <span className="text-gray-900 dark:text-white font-medium mr-2">
                              {item.quantity}x
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                            {item.options && Object.keys(item.options).length > 0 && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                ({Object.values(item.options).join(', ')})
                              </span>
                            )}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formatCurrency(price * item.quantity, product.currency)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              
              {/* Cost breakdown */}
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Cost Summary</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Taxes</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(taxes)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Shipping</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-900 dark:text-white font-medium">Total</span>
                        <span className="text-gray-900 dark:text-white font-bold">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping info */}
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Shipping Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">{shippingInfo.name}</p>
                  <p className="text-gray-700 dark:text-gray-300">{shippingInfo.address}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{shippingInfo.country}</p>
                  <p className="text-gray-700 dark:text-gray-300">{shippingInfo.email}</p>
                  {shippingInfo.phone && (
                    <p className="text-gray-700 dark:text-gray-300">{shippingInfo.phone}</p>
                  )}
                </div>
              </div>
              
              {/* Payment info */}
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Payment Method</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  {paymentInfo.method === 'credit_card' ? (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">Credit Card</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        **** **** **** {paymentInfo.cardNumber.slice(-4)}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Expires: {paymentInfo.cardExpiry}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        Billing address: {paymentInfo.billingAddress === 'same' ? 'Same as shipping' : 'Different address'}
                      </p>
                    </div>
                  ) : paymentInfo.method === 'paypal' ? (
                    <p className="text-gray-700 dark:text-gray-300">PayPal</p>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{paymentInfo.method}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('payment')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Payment
              </button>
              
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render step indicators
  const renderStepIndicator = () => {
    const steps = [
      { id: 'shipping', name: 'Shipping' },
      { id: 'payment', name: 'Payment' },
      { id: 'review', name: 'Review' }
    ];
    
    return (
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
            
            return (
              <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {/* Step connector */}
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${isCompleted ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  </div>
                )}
                
                {/* Step indicator */}
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? 'border-blue-600 bg-white dark:bg-gray-800'
                      : isCompleted
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {stepIdx + 1}
                    </span>
                  )}
                </div>
                
                {/* Step name */}
                <div className="mt-2 hidden sm:block">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{step.name}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`} style={style}>
      <div className="p-6">
        {!orderComplete && renderStepIndicator()}
        {renderCheckoutStep()}
      </div>
    </div>
  );
};

export default Checkout;