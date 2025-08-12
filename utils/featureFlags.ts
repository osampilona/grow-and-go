// Global feature flags for the app
// Toggle this via NEXT_PUBLIC_ENABLE_FAVORITES_SYNC=true when backend is ready
export const ENABLE_FAVORITES_SYNC: boolean =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_FAVORITES_SYNC === 'true';
