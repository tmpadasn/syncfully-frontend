/* App root: mounts auth provider and error boundary for global context and fault containment. */
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Composes top-level providers and router; maintains isolation of route errors.
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}
