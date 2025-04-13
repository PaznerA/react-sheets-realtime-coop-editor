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

## Deployment

### Local Development

To run the application locally:

```sh
./scripts/run-local.sh
```

This will:
1. Build the C# server module
2. Deploy it to your local SpacetimeDB instance
3. Start the React frontend with the correct configuration

### Deploy to SpacetimeDB Maincloud

To deploy to SpacetimeDB's managed cloud service:

```sh
./scripts/deploy-maincloud.sh
```

This will:
1. Build the C# server module
2. Deploy it to SpacetimeDB Maincloud
3. Output connection details for the frontend

### GitHub Actions Deployment

This repository includes GitHub Actions workflow for automatic deployment:

1. Add the following secrets to your GitHub repository:
   - `SPACETIME_AUTH_TOKEN`: Your SpacetimeDB authentication token
   - `SPACETIME_MODULE_NAME`: Your desired module name

2. The workflow will automatically deploy your application when changes are pushed to the main branch.

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

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview the production build
- `./scripts/run-local.sh` - Run local development environment
- `./scripts/deploy-maincloud.sh` - Deploy to SpacetimeDB Maincloud

## License

This project is [MIT](LICENSE) licensed.
