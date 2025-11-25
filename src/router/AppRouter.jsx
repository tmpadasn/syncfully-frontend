import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Recommendations from '../pages/Recommendations';
import Header from '../components/Header';
import SearchResults from '../pages/SearchResults';
import WorkDetails from '../pages/WorkDetails';
import Login from '../pages/Login';
import Account from '../pages/Account';
import ProtectedRoute from '../pages/ProtectedRoute';
import EditAccount from "../pages/EditAccount";

export default function AppRouter() {
  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/works/:workId" element={<WorkDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route 
            path="/account/edit"
            element={
              <ProtectedRoute>
                <EditAccount />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

