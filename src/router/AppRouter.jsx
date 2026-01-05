/* AppRouter: route table composing top-level pages within a consistent header and error boundary. */
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import ErrorBoundary from '../components/ErrorBoundary';
import Home from '../pages/Home';
import Recommendations from '../pages/Recommendations';
import SearchResults from '../pages/SearchResults';
import WorkDetails from '../pages/WorkDetails';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Account from '../pages/Account';
import EditAccount from '../pages/EditAccount';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import Shelves from '../pages/Shelves';

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

