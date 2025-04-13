
export const SPACETIME_CONFIG = {
  host: process.env.VITE_SPACETIME_HOST || 'localhost',
  port: parseInt(process.env.VITE_SPACETIME_PORT || '8080', 10),
  namespace: process.env.VITE_SPACETIME_NAMESPACE || 'spacetime-sheets',
  API_URL: process.env.VITE_SPACETIME_API_URL || 'https://api.spacetimedb.com',
  API_KEY: process.env.VITE_SPACETIME_API_KEY || '',
  PROJECT_ID: process.env.VITE_SPACETIME_PROJECT_ID || '',
  SYNC_INTERVAL: parseInt(process.env.VITE_SPACETIME_SYNC_INTERVAL || '30000', 10),
  FALLBACK_TO_LOCAL: process.env.VITE_FALLBACK_TO_LOCAL !== 'false', // Default to true
};
