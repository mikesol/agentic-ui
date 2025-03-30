import React, { useState } from 'react';

/**
 * @component ProductDetail
 * @description Displays detailed information about a product with options to add to cart
 * @domain e-commerce, retail, shopping
 * @usage View detailed product information, select options, and add to cart
 * 
 * @example
 * // Basic usage
 * <ProductDetail 
 *   product={product}
 *   formatCurrency={formatCurrency}
 *   onAddToCart={handleAddToCart}
 *   onBackToList={() => setView('productList')}
 * />
 * 
 * @example
 * // With related products
 * <ProductDetail 
 *   product={product}
 *   formatCurrency={formatCurrency}
 *   onAddToCart={handleAddToCart}
 *   onBackToList={() => setView('productList')}
 *   onFetchRelatedProducts={handleFetchRelated}
 * />
 */
export interface ProductDetailProps {
  /** Product to display */
  product: {
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
  };
  
  /** Function to format currency display */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to handle adding a product to the cart */
  onAddToCart: (productId: string, quantity: number, options?: Record<string, string>) => Promise<void> | void;
  
  /** Function to navigate back to product list */
  onBackToList: () => void;
  
  /** Function to fetch related products */
  onFetchRelatedProducts?: (productId: string) => Promise<Array<any>> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ProductDetail Component
 */
export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  formatCurrency,
  onAddToCart,
  onBackToList,
  onFetchRelatedProducts,
  className = '',
  style = {}
}) => {
  // Selected image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  
  // Selected options state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // Related products state
  const [relatedProducts, setRelatedProducts] = useState<Array<any>>([]);
  
  // Fetch related products on component mount
  React.useEffect(() => {
    const fetchRelated = async () => {
      if (onFetchRelatedProducts) {
        const related = await onFetchRelatedProducts(product.id);
        setRelatedProducts(related);
      }
    };
    
    fetchRelated();
  }, [product.id, onFetchRelatedProducts]);
  
  // Calculate display price with discount
  const displayPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  // Handle increment quantity
  const incrementQuantity = () => {
    if (product.inventory && quantity >= product.inventory) {
      return;
    }
    setQuantity(prev => prev + 1);
  };
  
  // Handle decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(product.id, quantity, Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined);
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`} style={style}>
      {/* Back button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBackToList}
          className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    className={`flex-none h-16 w-16 rounded-md overflow-hidden ${
                      idx === selectedImageIndex
                        ? 'ring-2 ring-blue-500'
                        : 'ring-1 ring-gray-200 dark:ring-gray-700'
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={image} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product info */}
          <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            
            {/* Price and discount */}
            <div className="mb-4">
              {product.discount ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(displayPrice, product.currency)}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                  <span className="ml-2 text-sm font-medium text-red-500">
                    Save {product.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(product.price, product.currency)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(product.rating!) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}
            
            {/* Description */}
            <div className="prose dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
              <p>{product.description}</p>
            </div>
            
            {/* Product options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.options.map(option => (
                  <div key={option.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map(value => (
                        <button
                          key={value}
                          className={`px-3 py-1 text-sm border rounded-full ${
                            selectedOptions[option.name] === value
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                          onClick={() => handleOptionChange(option.name, value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Inventory info */}
            {product.inventory !== undefined && (
              <div className="mb-4">
                <span className={`text-sm ${
                  product.inventory > 10
                    ? 'text-green-500'
                    : product.inventory > 0
                      ? 'text-yellow-500'
                      : 'text-red-500'
                }`}>
                  {product.inventory > 10
                    ? 'In Stock'
                    : product.inventory > 0
                      ? `Only ${product.inventory} left in stock`
                      : 'Out of Stock'}
                </span>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  disabled={quantity <= 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.inventory}
                  className="w-12 text-center border-y border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={incrementQuantity}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  disabled={product.inventory !== undefined && quantity >= product.inventory}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={product.inventory !== undefined && product.inventory === 0}
              className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inventory !== undefined && product.inventory === 0
                ? 'Out of Stock'
                : 'Add to Cart'}
            </button>
          </div>
        </div>
        
        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Specifications</h2>
            <div className="border-t border-b border-gray-200 dark:border-gray-700">
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`py-3 flex justify-between ${
                    idx !== Object.keys(product.specifications!).length - 1
                      ? 'border-b border-gray-200 dark:border-gray-700'
                      : ''
                  }`}
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">{key}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatCurrency(relatedProduct.price, relatedProduct.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;