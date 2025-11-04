# Navigation System

This directory contains the centralized navigation configuration and utilities for the FixterConnect application.

## Files

- **routes.ts** - Route constants and metadata
- **useNavigation.ts** - Custom navigation hooks
- **NavigationGuard.tsx** - Route protection components
- **index.ts** - Main export file

## Usage

### 1. Using Route Constants

Instead of hardcoding routes, use the `ROUTES` constants:

```tsx
import { ROUTES } from '../navigation';

// ❌ Don't do this:
navigate('/client-dashboard');

// ✅ Do this:
navigate(ROUTES.CLIENT_DASHBOARD);
```

### 2. Using Navigation Hook

The `useAppNavigation` hook provides type-safe navigation functions:

```tsx
import { useAppNavigation } from '../navigation';

function MyComponent() {
  const nav = useAppNavigation();

  return (
    <div>
      <button onClick={nav.goToHome}>Home</button>
      <button onClick={nav.goToServices}>Services</button>
      <button onClick={() => nav.goToContractors(123)}>View Contractors</button>
      <button onClick={nav.goToDashboard}>My Dashboard</button>
    </div>
  );
}
```

### 3. Protecting Routes with NavigationGuard

Use the `NavigationGuard` component to protect routes:

```tsx
import { NavigationGuard } from '../navigation';

function ProtectedPage() {
  return (
    <NavigationGuard requiresAuth allowedUserTypes={['client']}>
      <ClientDashboard />
    </NavigationGuard>
  );
}
```

Or use the HOC:

```tsx
import { withNavigationGuard } from '../navigation';

const ProtectedClientDashboard = withNavigationGuard(ClientDashboard, {
  requiresAuth: true,
  allowedUserTypes: ['client']
});
```

### 4. Checking Active Routes

```tsx
import { useIsActiveRoute } from '../navigation';
import { ROUTES } from '../navigation';

function NavMenu() {
  const isActive = useIsActiveRoute(ROUTES.CLIENT_DASHBOARD);

  return (
    <nav>
      <a
        href={ROUTES.CLIENT_DASHBOARD}
        style={{ fontWeight: isActive ? 'bold' : 'normal' }}
      >
        Dashboard
      </a>
    </nav>
  );
}
```

## Route Structure

### Public Routes
- `/` - Home
- `/login` - Login page
- `/services` - Services list
- `/contractors/:serviceId` - Contractors for a service
- `/contractor/:contractorId` - Contractor details

### Client Routes (Protected)
- `/client-dashboard` - Client dashboard
- `/client-dashboard/profile` - Client profile
- `/client-dashboard/messages` - Client messages
- `/client-dashboard/bookings` - Client bookings

### Contractor Routes (Protected)
- `/contractor-dashboard` - Contractor dashboard
- `/contractor-dashboard/profile` - Contractor profile
- `/contractor-dashboard/jobs` - Contractor jobs
- `/contractor-dashboard/schedule` - Contractor schedule
- `/contractor-dashboard/messages` - Contractor messages

## Benefits

✅ **Type Safety** - Route constants prevent typos
✅ **Centralized** - All routes defined in one place
✅ **Reusable** - Navigation hooks across components
✅ **Protected** - Built-in authentication guards
✅ **Maintainable** - Easy to update routes
✅ **User-aware** - Automatic dashboard routing based on user type
