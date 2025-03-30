import React from 'react';

/**
 * @component MediaAttachment
 * @description Renders different types of media attachments (images, videos, documents, etc.)
 * @domain communication, media, files, attachments
 * @usage Display media attachments in emails, chat messages, and other content
 * 
 * @example
 * // Single image attachment
 * <MediaAttachment
 *   media={{
 *     type: 'image',
 *     url: 'https://example.com/image.jpg',
 *     filename: 'vacation.jpg',
 *     filesize: 1024000
 *   }}
 * />
 * 
 * @example
 * // Document attachment with custom handler
 * <MediaAttachment
 *   media={{
 *     type: 'document',
 *     url: 'https://example.com/document.pdf',
 *     filename: 'report.pdf',
 *     filesize: 2048000
 *   }}
 *   onOpen={(media) => handleOpenDocument(media)}
 * />
 */
export interface MediaAttachmentProps {
  /** Media object with type, url, and other properties */
  media: {
    type: 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
    url: string;
    thumbnailUrl?: string;
    filename?: string;
    filesize?: number;
    duration?: number;
    dimensions?: { width: number; height: number };
    metadata?: Record<string, any>;
  };
  
  /** Display style */
  displayStyle?: 'compact' | 'full' | 'preview' | 'icon';
  
  /** Maximum dimensions */
  maxWidth?: number;
  maxHeight?: number;
  
  /** Whether to show download button */
  showDownloadButton?: boolean;
  
  /** Function to format file sizes */
  fileSizeFormatter?: (bytes: number) => string;
  
  /** Function to format durations */
  durationFormatter?: (seconds: number) => string;
  
  /** Handler for opening the media */
  onOpen?: (media: MediaAttachmentProps['media']) => void;
  
  /** Handler for downloading the media */
  onDownload?: (media: MediaAttachmentProps['media']) => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * MediaAttachment Component
 */
export const MediaAttachment: React.FC<MediaAttachmentProps> = ({
  media,
  displayStyle = 'full',
  maxWidth,
  maxHeight = 200,
  showDownloadButton = true,
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
  onOpen,
  onDownload,
  className = '',
  style = {}
}) => {
  // For future implementation:
  // const [isExpanded, setIsExpanded] = useState(false);
  
  // Default open handler opens in new tab
  const handleOpen = () => {
    if (onOpen) {
      onOpen(media);
    } else {
      window.open(media.url, '_blank');
    }
  };
  
  // Default download handler
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onDownload) {
      onDownload(media);
    } else {
      const link = document.createElement('a');
      link.href = media.url;
      link.download = media.filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Determine filename to display
  const displayFilename = media.filename || media.url.split('/').pop() || 'File';
  
  // Render based on media type and display style
  const renderMedia = () => {
    switch (media.type) {
      case 'image':
        if (displayStyle === 'icon') {
          return (
            <div className="flex items-center p-2 space-x-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex-shrink-0 text-blue-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="truncate">{displayFilename}</div>
              {media.filesize && <div className="text-xs text-gray-500">{fileSizeFormatter(media.filesize)}</div>}
            </div>
          );
        }
        
        return (
          <div 
            className="relative overflow-hidden rounded cursor-pointer"
            onClick={handleOpen}
            style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
          >
            <img
              src={media.url}
              alt={media.filename || 'Image'}
              className="object-contain max-w-full max-h-full"
              style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
            />
            
            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className="absolute bottom-2 right-2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                aria-label="Download"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        );
        
      case 'video':
        if (displayStyle === 'icon' || displayStyle === 'compact') {
          return (
            <div 
              className="flex items-center p-2 space-x-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer"
              onClick={handleOpen}
            >
              <div className="flex-shrink-0 text-red-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div className="flex-1 truncate">{displayFilename}</div>
              {media.duration && <div className="text-xs text-gray-500">{durationFormatter(media.duration)}</div>}
              {media.filesize && <div className="text-xs text-gray-500">{fileSizeFormatter(media.filesize)}</div>}
            </div>
          );
        }
        
        return (
          <div 
            className="relative overflow-hidden rounded"
            style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
          >
            {media.thumbnailUrl ? (
              <div 
                className="relative cursor-pointer"
                onClick={handleOpen}
              >
                <img
                  src={media.thumbnailUrl}
                  alt="Video thumbnail"
                  className="object-cover w-full h-full"
                  style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {media.duration && (
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {durationFormatter(media.duration)}
                  </div>
                )}
              </div>
            ) : (
              <video
                controls
                preload="metadata"
                className="max-w-full max-h-full"
                style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
              >
                <source src={media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            
            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className="absolute bottom-2 right-2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                aria-label="Download"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div className="w-full">
            {displayStyle === 'icon' || displayStyle === 'compact' ? (
              <div 
                className="flex items-center p-2 space-x-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                onClick={handleOpen}
              >
                <div className="flex-shrink-0 text-purple-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 truncate">{displayFilename}</div>
                {media.duration && <div className="text-xs text-gray-500">{durationFormatter(media.duration)}</div>}
                {media.filesize && <div className="text-xs text-gray-500">{fileSizeFormatter(media.filesize)}</div>}
              </div>
            ) : (
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="mb-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{displayFilename}</span>
                  </div>
                  {media.duration && (
                    <span className="text-sm text-gray-500">{durationFormatter(media.duration)}</span>
                  )}
                </div>
                
                <audio 
                  controls
                  preload="metadata"
                  className="w-full"
                >
                  <source src={media.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                
                {media.filesize && (
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {fileSizeFormatter(media.filesize)}
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'document':
        return (
          <div 
            className={`flex items-center p-3 rounded border border-gray-200 dark:border-gray-700 ${
              displayStyle !== 'icon' ? 'bg-gray-50 dark:bg-gray-800' : ''
            } cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            onClick={handleOpen}
          >
            <div className="mr-3 flex-shrink-0">
              {getDocumentIcon(displayFilename)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{displayFilename}</div>
              {media.filesize && (
                <div className="text-xs text-gray-500">
                  {fileSizeFormatter(media.filesize)}
                </div>
              )}
            </div>
            
            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Download"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
          </div>
        );
        
      case 'location':
        return (
          <div 
            className="relative overflow-hidden rounded cursor-pointer"
            onClick={handleOpen}
            style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
          >
            <img
              src={media.url}
              alt="Location"
              className="object-cover w-full h-full"
              style={{ maxHeight: maxHeight, maxWidth: maxWidth }}
            />
            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <div className="text-white text-sm truncate">
                {media.metadata?.address || 'Shared location'}
              </div>
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div 
            className="flex items-center p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium">{media.metadata?.name || 'Contact'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {media.metadata?.phone || 'Phone number'}
              </div>
              {media.metadata?.email && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {media.metadata.email}
                </div>
              )}
            </div>
            
            <button className="ml-2 p-2 rounded-full bg-blue-500 text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          </div>
        );
        
      default:
        return (
          <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm">Unsupported media type</div>
          </div>
        );
    }
  };
  
  // Helper function to get document icon based on file extension
  const getDocumentIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    // Color mapping for different file types
    const colorMap: Record<string, string> = {
      pdf: 'text-red-500',
      doc: 'text-blue-500',
      docx: 'text-blue-500',
      xls: 'text-green-500',
      xlsx: 'text-green-500',
      ppt: 'text-orange-500',
      pptx: 'text-orange-500',
      txt: 'text-gray-500',
      zip: 'text-yellow-700',
      rar: 'text-yellow-700',
      default: 'text-gray-500'
    };
    
    const color = colorMap[extension] || colorMap.default;
    
    return (
      <div className={`w-8 h-10 flex items-center justify-center ${color}`}>
        <svg className="w-8 h-10" viewBox="0 0 24 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 0C0.9 0 0 0.9 0 2V28C0 29.1 0.9 30 2 30H22C23.1 30 24 29.1 24 28V8L16 0H2Z" />
          <path fillOpacity="0.3" d="M16 0V6C16 7.1 16.9 8 18 8H24L16 0Z" />
          {extension && (
            <text
              x="12"
              y="22"
              textAnchor="middle"
              fontSize="6"
              fill="white"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              {extension.toUpperCase()}
            </text>
          )}
        </svg>
      </div>
    );
  };
  
  return (
    <div 
      className={`media-attachment ${className}`}
      style={style}
    >
      {renderMedia()}
    </div>
  );
};

export default MediaAttachment;