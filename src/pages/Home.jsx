/*
 Home page.
 Shows popular works, recent activity, and carousels.
 Loads data on mount and keeps UI responsive.
*/
import { useNavigationWithClearFilters, useAuth, useHomePageData } from '../hooks';
import { FriendCardsCarousel, WorkCarousel, LoginPrompt } from '../components';

// Home page component.
// Aggregates multiple feeds (popular, friends, following) on one page.
// Uses custom hook for data loading and state management.
export default function Home() {
  useNavigationWithClearFilters();

  const { user } = useAuth();
  const currentUserId = user?.userId || null;
  const {
    popular,
    following,
    recentMovies,
    recentMusic,
    loading,
    followingLoading,
    recentLoading,
    showWelcome
  } = useHomePageData(currentUserId);

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          {/* Welcome Message */}
          {user && showWelcome && (
            <p className="welcome-text">
              Welcome back <strong style={{ color: '#9a4207', fontSize: '20px' }}>{user.username}</strong>. Here's what others have been discovering...
            </p>
          )}

          {/* Login Prompt Banner */}
          {!user && <LoginPrompt />}

          {/* Friends' Favourites Section */}
          {user && (
            <FriendCardsCarousel
              friends={following}
              loading={followingLoading}
            />
          )}

          {/* Popular Works */}
          <WorkCarousel
            title="WEEK'S TOP 10"
            items={popular}
            loading={loading}
            emptyMessage="No popular works available."
            variant="popular"
          />

          {/* Recently Watched */}
          {user && (
            <WorkCarousel
              title="RECENTLY WATCHED"
              items={recentMovies}
              loading={recentLoading}
              emptyMessage="No recently rated movies yet."
              variant="movie"
            />
          )}

          {/* Recently Played */}
          {user && (
            <WorkCarousel
              title="RECENTLY PLAYED"
              items={recentMusic}
              loading={recentLoading}
              emptyMessage="No recently rated music yet."
              variant="music"
            />
          )}
        </main>
      </div>
    </div>
  );
}
