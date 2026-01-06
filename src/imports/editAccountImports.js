/**
 * EditAccount Page - Centralized Imports
 * Re-exports all dependencies used in EditAccount component
 * Provides clean import statements with single source of truth
 *
 * Structure:
 *   - React hooks
 *   - Router
 *   - Custom hooks (authentication)
 *   - API functions (user operations)
 *   - EditAccount sub-components (form fields, buttons, headers)
 */

// React and Router
export { useEffect, useState } from 'react';
export { useNavigate } from 'react-router-dom';

// Custom Hooks
export { default as useAuth } from '../hooks/useAuth';

// API calls
export { getUserById, updateUser } from '../api/users';

// EditAccount Sub-Components
export { default as FormField } from '../components/EditAccount/FormField';
export { default as ActionButton } from '../components/EditAccount/ActionButton';
export { default as ProfileHeader } from '../components/EditAccount/ProfileHeader';
export { default as MessageBox } from '../components/EditAccount/MessageBox';
