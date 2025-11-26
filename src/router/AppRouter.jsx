import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import Recommendations from '../pages/Recommendations';
import SearchResults from '../pages/SearchResults';
import WorkDetails from '../pages/WorkDetails';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Account from '../pages/Account';
import EditAccount from '../pages/EditAccount';
import ProtectedRoute from '../pages/ProtectedRoute';
import GuestRoute from '../pages/GuestRoute';
import Shelves from '../pages/Shelves';

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
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/account/edit" element={<ProtectedRoute><EditAccount /></ProtectedRoute>} />
          <Route path="/shelves" element={<ProtectedRoute><Shelves /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

