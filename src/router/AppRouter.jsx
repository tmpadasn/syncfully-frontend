/* AppRouter: route table composing top-level pages within a consistent header and error boundary. */
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header';
import ErrorBoundary from '../components/ErrorBoundary';
import { Home, Recommendations, SearchResults, WorkDetails, Profile, Login, Account, EditAccount, Shelves } from '../pages';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

// Renders header and top-level route definitions.
// Each route is contained within a page-level error boundary to isolate
// page-specific failures from the rest of the application.
export default function AppRouter() {
  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<ErrorBoundary level="page"><Home /></ErrorBoundary>} />
          <Route path="/recommendations" element={<ErrorBoundary level="page"><Recommendations /></ErrorBoundary>} />
          <Route path="/search" element={<ErrorBoundary level="page"><SearchResults /></ErrorBoundary>} />
          <Route path="/works/:workId" element={<ErrorBoundary level="page"><WorkDetails /></ErrorBoundary>} />
          <Route path="/profile/:userId" element={<ErrorBoundary level="page"><Profile /></ErrorBoundary>} />
          <Route path="/login" element={<ErrorBoundary level="page"><GuestRoute><Login /></GuestRoute></ErrorBoundary>} />
          <Route path="/account" element={<ErrorBoundary level="page"><ProtectedRoute><Account /></ProtectedRoute></ErrorBoundary>} />
          <Route path="/account/edit" element={<ErrorBoundary level="page"><ProtectedRoute><EditAccount /></ProtectedRoute></ErrorBoundary>} />
          <Route path="/shelves" element={<ErrorBoundary level="page"><ProtectedRoute><Shelves /></ProtectedRoute></ErrorBoundary>} />
        </Routes>
      </main>
    </div>
  );
}

