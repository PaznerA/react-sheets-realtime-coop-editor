# SpaceTimeSheets

A modern project management and spreadsheet application with real-time collaboration capabilities.

## Project Overview

SpaceTimeSheets is designed for organizations and teams who need to collaboratively manage projects and tabular data. The application features:

- Project management with customizable sheets
- Flexible column structure for different data types
- Version history (savepoints) for data recovery
- Real-time collaboration
- Role-based user management

## Technologies

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **Data Storage**: Local storage with cloud sync capabilities
- **API Integration**: REST API architecture

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
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

3. Start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or another port shown in your terminal).

## Project Structure

```
spacetimeSheets/
├── public/           # Static assets
├── server/           # Server-side code
│   └── Lib.cs        # Data models and business logic
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── services/     # Data services
│   ├── stores/       # State management
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── package.json      # Project dependencies
└── README.md         # This file
```

## Features

### Projects and Sheets

- Create and manage projects with multiple sheets
- Each sheet can have a custom structure for different use cases
- Support for different column types (text, numbers, dates, etc.)

### Row Management

- Group rows for better organization
- Reorder rows and groups with drag-and-drop

### Data Management

- Version control with savepoints
- Import and export data
- Filter and search functionality

### Collaboration

- Multiple users can work on the same project
- Role-based permissions (admin, member, viewer)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run tests (when available)

## Deployment

The project can be deployed to any static hosting service:

1. Build the project:

```sh
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting service

## License

This project is [MIT](LICENSE) licensed.
