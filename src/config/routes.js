
export const ROUTES = {
  // Public Routes
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Protected Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  LOST_ITEMS: '/lost',
  FOUND_ITEMS: '/found',
  MY_ITEMS: '/my-items',
  ITEM_DETAILS: '/item/:id',
  SEARCH: '/search',
  REPORT_ITEM: '/report',
  
  // Alternative routes for consistency
  LOST_ITEMS_ALT: '/lost-items',
  FOUND_ITEMS_ALT: '/found-items',
  
  // Error Routes
  NOT_FOUND: '/404',
};

// Navigation items for sidebar/menu
export const NAVIGATION = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
  { path: ROUTES.LOST_ITEMS, label: 'Lost Items', icon: 'lost' },
  { path: ROUTES.FOUND_ITEMS, label: 'Found Items', icon: 'found' },
  { path: ROUTES.MY_ITEMS, label: 'My Items', icon: 'person' },
  { path: ROUTES.PROFILE, label: 'Profile', icon: 'settings' },
];

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.NOT_FOUND,
];

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.LOST_ITEMS,
  ROUTES.FOUND_ITEMS,
  ROUTES.MY_ITEMS,
  ROUTES.ITEM_DETAILS,
  ROUTES.SEARCH,
  ROUTES.REPORT_ITEM,
  ROUTES.LOST_ITEMS_ALT,
  ROUTES.FOUND_ITEMS_ALT,
];

// Helper function to check if a route is public
export const isPublicRoute = (path) => {
  return PUBLIC_ROUTES.some(route => {
    // Handle dynamic routes like /reset-password/:token
    if (route.includes(':') && path.includes('/reset-password/')) {
      return route.split('/:')[0] === path.split('/')[1];
    }
    return route === path;
  });
};

// Helper function to check if a route is protected
export const isProtectedRoute = (path) => {
  return PROTECTED_ROUTES.some(route => {
    // Handle dynamic routes like /item/:id
    if (route.includes(':') && path.includes('/item/')) {
      return route.split('/:')[0] === path.split('/')[0];
    }
    return route === path;
  });
};