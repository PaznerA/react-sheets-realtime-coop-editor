export const SPACETIME_CONFIG = {
    API_URL: 'https://api.spacetimedb.com',
    API_KEY: process.env.VITE_SPACETIME_API_KEY || '',
    PROJECT_ID: process.env.VITE_SPACETIME_PROJECT_ID || '',
    SYNC_INTERVAL: 30000, // ms
  };