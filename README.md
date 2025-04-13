# SpacetimeSheets

A modern project management and spreadsheet application with real-time collaboration capabilities powered by SpacetimeDB.

## Project Overview

SpacetimeSheets is designed for organizations and teams who need to collaboratively manage projects and tabular data. The application features:

- Project management with customizable sheets
- Flexible column structure for different data types
- Version history (savepoints) for data recovery
- Real-time collaboration
- Role-based user management
- Client-server architecture with optimized data flow

## Technologies

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **Backend**: SpacetimeDB with C# modules
- **Database**: SpacetimeDB (relational database with real-time capabilities)
- **State Management**: React Context API with optimized backend queries

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [.NET SDK](https://dotnet.microsoft.com/download) (v6.0 or newer)
- [SpacetimeDB CLI](https://spacetimedb.com/install)
- npm or another package manager (yarn, pnpm, etc.)

### Installation

1. Clone the repository:

```sh
git clone <REPOSITORY_URL>
cd spacetimeSheets
```

2. Install dependencies:

```sh
npm install
```

3. Configure your environment:

```sh
cp .env.example .env
# Edit .env with your SpacetimeDB settings
```

4. Start the development environment:

```sh
# Make scripts executable
chmod +x ./scripts/run-local.sh
chmod +x ./scripts/deploy-maincloud.sh

# Run local development environment
./scripts/run-local.sh
```

The application will be available at `http://localhost:5173` (or another port shown in your terminal).

## Project Structure

```
spacetimeSheets/
├── public/           # Static assets
├── scripts/          # Deployment and run scripts
├── server/           # SpacetimeDB C# module
│   └── Lib.cs        # Data models and backend logic
├── src/
│   ├── components/   # React components
│   ├── contexts/     # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── module_bindings/ # SpacetimeDB client bindings
│   ├── pages/        # Page components
│   ├── services/     # Data services
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── .env.example      # Example environment configuration
├── .env              # Environment configuration (create from .env.example)
├── package.json      # Project dependencies
└── README.md         # This file
```

## SpacetimeDB Integration

SpacetimeSheets uses SpacetimeDB for its backend, which provides:

- **Real-time data synchronization** between clients
- **Relational database** for structured data storage
- **C# module system** for server-side logic
- **Client-server architecture** with optimized data flow

### Server Module

The server module (`server/Lib.cs`) contains:

- Entity definitions for the database tables
- Reducers (server-side functions) for data manipulation
- Optimized query endpoints for efficient data fetching
- Business logic for sheet and project management

### Client Integration

The React frontend connects to SpacetimeDB using:

- Client bindings for type-safe communication
- Context providers for state management
- Optimized data fetching to minimize network traffic
- Real-time subscriptions for live updates

## Development Workflow

### Local Development

For local development with SpacetimeDB:

```sh
# Start the full local development environment (see makefile for details)
make local
```

This script will:
1. Build the C# module
2. Start a local SpacetimeDB instance if not already running
3. Deploy the module to the local SpacetimeDB
4. Start the React development server

### TypeScript Bindings

To generate TypeScript bindings from the C# module:

```sh
# Generate bindings
npm run generate-bindings
```

**Important:** Always regenerate the bindings after changing the C# module (Lib.cs) to ensure the frontend has up-to-date type definitions.

### Testing

SpacetimeSheets includes multiple levels of testing:

```sh
# Run all tests (except E2E)
npm run test

# Run E2E tests (requires local SpacetimeDB)
npm run test:e2e

# Run TypeScript type checking
npm run typecheck

# Run ESLint checks
npm run lint
```

#### Test Types:

1. **Server Tests:** C# unit tests for the SpacetimeDB module
2. **TypeScript Type Checking:** Static analysis of the frontend code
3. **Linting:** Code style and quality checks
4. **E2E Tests:** Playwright-based end-to-end testing of the full application

### Deployment

For deployment to the SpacetimeDB cloud:

```sh
# Deploy to the main cloud instance
./scripts/deploy-maincloud.sh
```

## Architecture

### Data Flow

1. **Client ⟶ Server:**
   - Reducer calls from client to SpacetimeDB module
   - Optimized bulk operations for performance

2. **Server ⟶ Client:**
   - SQL subscriptions for real-time data
   - Optimized query results for reduced network traffic

3. **Real-time Collaboration:**
   - All changes instantly propagate to connected clients
   - Conflict resolution handled by SpacetimeDB transactions

### Testing Strategy

1. **Unit Testing:**
   - Server-side C# tests for module logic
   - Isolated tests for client components

2. **Integration Testing:**
   - React component integration tests
   - API integration tests against mock SpacetimeDB

3. **End-to-End Testing:**
   - Playwright tests simulating real user interactions
   - Full application tests including SpacetimeDB integration

## Features

### Projects and Sheets

- Create and manage projects with multiple sheets
- Each sheet can have a custom structure for different use cases
- Support for different column types (text, numbers, dates, selects, etc.)

### Row Management

- Group rows for better organization
- Reorder rows and groups with drag-and-drop

### Data Management

- Version control with savepoints
- Import and export data
- Filter and search functionality
- Optimized backend queries for efficient data access

### Collaboration

- Multiple users can work on the same project simultaneously
- Real-time updates across all connected clients
- Role-based permissions (admin, member, viewer)

## Future Improvements

- Enhanced conflict resolution for concurrent edits
- Offline mode with sync capabilities
- Performance optimizations for large datasets
- Mobile application support

## License

This project is [MIT](LICENSE) licensed.
