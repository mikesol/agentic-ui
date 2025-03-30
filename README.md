# Agentic UI

A comprehensive UI component library designed for maximum reusability and deep configurability.

## Component Structure

The project follows a "components all the way down" philosophy, where everything from simple buttons to complete applications is a component.

### Rich Media Chat Application

The first high-level component showcases a complete chat application with rich media support:

- **RichMediaChatApplication**: The top-level component that combines all chat functionality
  - **ChatHeader**: Displays conversation information and actions
  - **ChatConversation**: Container for chat messages with grouping and day dividers
    - **ChatMessage**: Individual message component with various types and interactions
      - **MediaRenderer**: Handles different media types (images, videos, documents, etc.)
    - **ChatDayDivider**: Date separators between messages from different days
  - **ChatInput**: Rich input with text, emoji, and media upload support

### Email Client Application

The second high-level component implements an email client with similar patterns:

- **EmailClient**: The top-level component for email functionality
  - **EmailSidebar**: Navigation for email folders and actions
  - **EmailList**: Displays emails with sorting and filtering
  - **EmailViewer**: Shows full email content with attachments
  - **EmailComposer**: Modal interface for creating new emails
  - **Avatar**: Reused from both applications for user profiles
  - **MediaAttachment**: Reused for handling attachments (extracted from MediaRenderer)

## Component Reuse Patterns

As we created the second high-level application, several reusable patterns emerged:

1. **Avatar Component**: Extracted as a standalone component for user profile display in both applications
2. **Media Handling**: The MediaRenderer from the chat app was adapted into MediaAttachment for email
3. **Prop Patterns**: Similar prop interfaces for customization across domains (theming, handlers, etc.)
4. **JSDoc Documentation**: Consistent machine-readable patterns for LLM discovery
5. **UI Patterns**: Similar patterns for headers, sidebars, and content areas

Each component is:
- Self-contained with its own logic
- Extensively configurable via props
- Documented with JSDoc comments
- Designed for composition
- Styled with Tailwind CSS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build
```

## Philosophy

This project aims to create thousands of UI components for every task imaginable in a modern web browser, from simple buttons to complete applications. The approach is:

1. Start with complete UIs
2. Break them down into reusable components
3. Extract shared patterns when multiple applications show similar needs
4. Enable deep configuration through props
5. Document thoroughly for discoverability
6. Allow API integration with flexible prop injection

The goal is to create a library where component reuse emerges naturally as more UIs are added, with minimal refactoring by focusing on prop-based configuration rather than complex component hierarchies.