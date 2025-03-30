# CLAUDE.md - Guidelines for Claude/AI Assistants

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm run test`
- Test single component: `npm run test -- src/components/ComponentName.test.tsx`
- Storybook: `npm run storybook`

## Project Structure
- `/src/components`: The only directory for all components of any complexity level

## Component Philosophy
- **Components All The Way Down**: Every UI element is a component, from buttons to entire applications
- **Descriptive Naming**: Component names must clearly convey purpose and functionality
- **Self-Contained**: Components encapsulate their own logic, styling, and behavior
- **Documentation First**: Machine-readable JSDoc with consistent tagging (@domain, @example, @usage)
- **Semantic Domains**: Documentation clearly expresses component's semantic domain and purpose
- **Deep Configurability**: Every component has extensive prop options for customization
- **API Integration**: Components support configurable API integration points via prop injection
- **Data Flow**: Clear patterns for injecting data fetching, mutations, and real-time updates
- **Adapters Over Coupling**: Props allow adapting to different API shapes without component modification
- **Extract on Patterns**: Extract shared components when clear reuse patterns emerge across domains
- **Granularity Balance**: Components should be specific enough to be useful but generic enough for reuse
- **Flat Hierarchy**: No artificial distinction between "atomic" and "complex" components
- **Discoverability**: Component names and documentation optimize for agent discovery

## Code Guidelines
- **Tailwind**: Use Tailwind for all styling with prop-based customization
- **TypeScript**: Strong typing with interfaces/types in same file as component
- **Props**: Default props for common use cases, but allow complete customization
- **API Patterns**: Consistent patterns for injecting API clients, fetchers, and handlers
- **Mock Data**: Include mock data patterns for each component requiring external data
- **Tests**: Each component has thorough tests for all configurations

Before creating a new component, search existing ones thoroughly. When creating a new high-level component, look for opportunities to extract and reuse patterns from existing components. The goal is maximum reuse, refactoring components along the way to extract out common components.