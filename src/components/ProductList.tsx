import React, { useState } from 'react';

/**
 * @component ProductList
 * @description Displays a grid of products with filtering, sorting, and search capabilities
 * @domain e-commerce, retail, shopping
 * @usage Display products in a responsive grid with filtering and sorting options
 * 
 * @example
 * // Basic usage
 * <ProductList 
 *   products={products}
 *   onViewProduct={handleViewProduct}
 *   onAddToCart={handleAddToCart}
 * />
 * 
 * @example
 * // With categories and search
 * <ProductList 
 *   products={products}
 *   categories={categories}
 *   onViewProduct={handleProductView}
 *   onAddToCart={handleAddToCart}
 *   onSearch={handleSearch}
 *   onFilter={handleFilter}
 * />
 */
export interface ProductListProps {
  /** Products to display */
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
  }>;
  
  /** Product categories */
  categories?: Array<{
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    image?: string;
  }>;
  
  /** Function to format currency display */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to handle viewing a product's details */
  onViewProduct: (productId: string) => void;
  
  /** Function to handle adding a product to the cart */
  onAddToCart: (productId: string, quantity: number, options?: Record<string, string>) => Promise<void> | void;
  
  /** Function to handle product search */
  onSearch?: (query: string) => Promise<Array<any>> | void;
  
  /** Function to handle filtering products */
  onFilter?: (filters: Record<string, any>) => Promise<Array<any>> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ProductList Component
 */
export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories = [],
  formatCurrency,
  onViewProduct,
  onAddToCart,
  onSearch,
  onFilter,
  className = '',
  style = {}
}) => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Sort option state
  const [sortOption, setSortOption] = useState<'featured' | 'newest' | 'price-low' | 'price-high'>('featured');
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      await onSearch(searchQuery);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    if (onFilter) {
      const filters = categoryId ? { categoryId } : {};
      await onFilter(filters);
    }
  };
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as any);
  };
  
  // Filter and sort products based on current selections
  const filteredAndSortedProducts = products
    // Filter by category if one is selected
    .filter(product => !selectedCategory || product.categoryId === selectedCategory)
    // Filter by search query if one exists
    .filter(product => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    })
    // Sort based on selected sort option
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          // Assuming product IDs are sequential or contain timestamps
          return b.id.localeCompare(a.id);
          
        case 'price-low':
          const aPrice = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const bPrice = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return aPrice - bPrice;
          
        case 'price-high':
          const aPriceHigh = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const bPriceHigh = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return bPriceHigh - aPriceHigh;
          
        case 'featured':
        default:
          // Featured products come first, then sort by rating
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
      }
    });
  
  return (
    <div className={`${className}`} style={style}>
      {/* Header with search and filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Sort options */}
          <div className="flex items-center">
            <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-300 mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map(product => {
          // Calculate display price with discount
          const displayPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;
          
          return (
            <div 
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              {/* Product image */}
              <div 
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => onViewProduct(product.id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
                
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              
              {/* Product info */}
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold text-gray-800 dark:text-white mb-1 cursor-pointer"
                  onClick={() => onViewProduct(product.id)}
                >
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  {/* Star rating */}
                  {product.rating && (
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(product.rating!) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {product.reviewCount ? `(${product.reviewCount})` : ''}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {product.discount ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          {formatCurrency(displayPrice, product.currency)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                          {formatCurrency(product.price, product.currency)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onAddToCart(product.id, 1)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty state */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No products found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSortOption('featured');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;