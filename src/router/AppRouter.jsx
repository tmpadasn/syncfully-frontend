/* AppRouter: route table composing top-level pages within a consistent header and error boundary. */
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import PageErrorBoundary from '../components/PageErrorBoundary';
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

// Renders header and route definitions; routes are wrapped with a page-level error boundary.
export default function AppRouter() {
  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<PageErrorBoundary><Home /></PageErrorBoundary>} />
          <Route path="/recommendations" element={<PageErrorBoundary><Recommendations /></PageErrorBoundary>} />
          <Route path="/search" element={<PageErrorBoundary><SearchResults /></PageErrorBoundary>} />
          <Route path="/works/:workId" element={<PageErrorBoundary><WorkDetails /></PageErrorBoundary>} />
          <Route path="/profile/:userId" element={<PageErrorBoundary><Profile /></PageErrorBoundary>} />
          <Route path="/login" element={<PageErrorBoundary><GuestRoute><Login /></GuestRoute></PageErrorBoundary>} />
          <Route path="/account" element={<PageErrorBoundary><ProtectedRoute><Account /></ProtectedRoute></PageErrorBoundary>} />
          <Route path="/account/edit" element={<PageErrorBoundary><ProtectedRoute><EditAccount /></ProtectedRoute></PageErrorBoundary>} />
          <Route path="/shelves" element={<PageErrorBoundary><ProtectedRoute><Shelves /></ProtectedRoute></PageErrorBoundary>} />
        </Routes>
      </main>
    </div>
  );
}

