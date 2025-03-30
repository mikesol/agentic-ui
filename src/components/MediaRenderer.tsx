import React, { useState } from 'react';

/**
 * @component MediaRenderer
 * @description Renders different types of media content in chat messages
 * @domain communication, social, messaging, media
 * @usage Display images, videos, audio, documents and other media types in chat messages
 * 
 * @example
 * // Single image
 * <MediaRenderer 
 *   media={[{
 *     type: 'image',
 *     url: 'https://example.com/image.jpg',
 *     dimensions: { width: 800, height: 600 }
 *   }]}
 * />
 * 
 * @example
 * // Multiple media items
 * <MediaRenderer 
 *   media={[
 *     { type: 'image', url: 'https://example.com/image1.jpg' },
 *     { type: 'video', url: 'https://example.com/video.mp4', thumbnailUrl: 'https://example.com/thumbnail.jpg' },
 *     { type: 'document', url: 'https://example.com/document.pdf', filename: 'report.pdf', filesize: 1024000 }
 *   ]}
 *   maxMediaHeight={300}
 *   lightboxEnabled={true}
 * />
 */
export interface MediaRendererProps {
  /** Array of media items to render */
  media: Array<{
    type: 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
    url: string;
    thumbnailUrl?: string;
    filename?: string;
    filesize?: number;
    duration?: number;
    dimensions?: { width: number; height: number };
    metadata?: Record<string, any>;
  }>;
  
  /** Maximum height for media items */
  maxMediaHeight?: number;
  
  /** Whether to enable lightbox for images and videos */
  lightboxEnabled?: boolean;
  
  /** Function to format file sizes */
  fileSizeFormatter?: (bytes: number) => string;
  
  /** Function to format durations */
  durationFormatter?: (seconds: number) => string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * MediaRenderer Component
 */
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  media,
  maxMediaHeight = 250,
  lightboxEnabled = true,
  fileSizeFormatter = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  },
  durationFormatter = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
  className = '',
  style = {}
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
  
  // Define a grid layout based on the number of media items
  const getGridClass = () => {
    switch (media.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-3';
    }
  };
  
  // Handle opening the lightbox
  const openLightbox = (index: number) => {
    if (lightboxEnabled) {
      setActiveLightboxIndex(index);
      setLightboxOpen(true);
    }
  };
  
  // Render an individual media item
  const renderMediaItem = (item: MediaRendererProps['media'][0], index: number) => {
    switch (item.type) {
      case 'image':
        return (
          <div 
            key={index}
            className="relative overflow-hidden rounded"
            style={{ 
              maxHeight: maxMediaHeight,
              cursor: lightboxEnabled ? 'pointer' : 'default'
            }}
            onClick={() => openLightbox(index)}
          >
            <img 
              src={item.url}
              alt={item.metadata?.alt || 'Image'}
              className="object-cover w-full h-full"
              style={{ maxHeight: maxMediaHeight }}
            />
          </div>
        );
        
      case 'video':
        return (
          <div 
            key={index}
            className="relative overflow-hidden rounded"
            style={{ maxHeight: maxMediaHeight }}
          >
            {item.thumbnailUrl ? (
              <div 
                className="relative cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={item.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  style={{ maxHeight: maxMediaHeight }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {item.duration && (
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {durationFormatter(item.duration)}
                  </div>
                )}
              </div>
            ) : (
              <video 
                controls
                preload="metadata"
                className="w-full h-full max-h-full object-contain"
                style={{ maxHeight: maxMediaHeight }}
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div key={index} className="w-full">
            <audio 
              controls
              preload="metadata"
              className="w-full"
            >
              <source src={item.url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
            {item.filename && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                {item.filename} {item.filesize && `(${fileSizeFormatter(item.filesize)})`}
              </div>
            )}
          </div>
        );
        
      case 'document':
        return (
          <div 
            key={index}
            className="flex items-center p-2 rounded bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            onClick={() => window.open(item.url, '_blank')}
          >
            <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded flex items-center justify-center text-blue-500 mr-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">
                {item.filename || 'Document'}
              </div>
              {item.filesize && (
                <div className="text-xs text-gray-500">
                  {fileSizeFormatter(item.filesize)}
                </div>
              )}
            </div>
            <div className="ml-2 text-blue-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );
        
      case 'location':
        return (
          <div 
            key={index}
            className="relative overflow-hidden rounded"
            style={{ maxHeight: maxMediaHeight }}
          >
            <img 
              src={item.url} 
              alt="Location"
              className="w-full h-full object-cover"
              style={{ maxHeight: maxMediaHeight }}
            />
            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <div className="text-white text-sm truncate">
                {item.metadata?.address || 'Shared location'}
              </div>
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div 
            key={index}
            className="flex items-center p-3 rounded bg-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium">
                {item.metadata?.name || 'Contact'}
              </div>
              <div className="text-sm text-gray-600">
                {item.metadata?.phone || 'Phone number'}
              </div>
            </div>
            <button className="ml-2 p-2 rounded-full bg-blue-500 text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render lightbox
  const renderLightbox = () => {
    if (!lightboxOpen) return null;
    
    const activeItem = media[activeLightboxIndex];
    
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
        <button 
          className="absolute top-4 right-4 text-white p-2"
          onClick={() => setLightboxOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative max-w-3xl max-h-[80vh]">
          {activeItem.type === 'image' ? (
            <img 
              src={activeItem.url}
              alt="Full size"
              className="max-w-full max-h-[80vh] object-contain"
            />
          ) : activeItem.type === 'video' ? (
            <video 
              controls 
              autoPlay
              className="max-w-full max-h-[80vh]"
            >
              <source src={activeItem.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
        
        {media.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {media.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeLightboxIndex ? 'bg-white' : 'bg-gray-400'
                }`}
                onClick={() => setActiveLightboxIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div 
      className={`w-full ${className}`}
      style={style}
    >
      {/* Media grid */}
      <div className={`grid gap-1 ${getGridClass()}`}>
        {media.map((item, index) => renderMediaItem(item, index))}
      </div>
      
      {/* Lightbox */}
      {renderLightbox()}
    </div>
  );
};

export default MediaRenderer;