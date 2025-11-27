import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { getPopularWorks, getAllWorks } from '../api/works';
import { getAllUsers, getUserRatings, getUserById } from '../api/users';
import { testConnection } from '../api/client';
import { Link } from 'react-router-dom';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import useAuth from '../hooks/useAuth';
import { WorkGridSkeleton, FriendGridSkeleton } from '../components/Skeleton';
import HomeCarousel from '../components/HomeCarousel';
import logger from '../utils/logger';
import {
  extractWorksFromResponse,
  normalizeWork,
  normalizeWorks,
  normalizeRatingsObject,
  shuffleArray,
} from '../utils/normalize';
import { 
  DEFAULT_AVATAR_URL, 
  WORK_TYPES, 
  HOME_CAROUSEL_LIMIT, 
  STORAGE_KEY_JUST_LOGGED_IN 
} from '../config/constants';

/* ---------------------- DATA PROCESSING HELPERS ---------------------- */

const processPopularWorks = (data) => {
  const works = extractWorksFromResponse(data);
  return normalizeWorks(works);
};

const processFriendsData = async (users, allWorks, currentUserId, isMountedRef) => {
  const friendsWithActivity = [];

  if (!currentUserId) return []; // If not logged in → no friends

  const eligibleUsers = users.filter(
    user => user.userId !== currentUserId && user.ratedWorks > 0
  );

  for (const user of eligibleUsers) {
    if (!isMountedRef.current) break; // Stop if component unmounted
    
    try {
      const ratingsResponse = await getUserRatings(user.userId);
      
      if (!isMountedRef.current) break; // Check again after async call
      
      const ratingsData = ratingsResponse?.data || ratingsResponse || {};

      const entries = normalizeRatingsObject(ratingsData);
      if (entries.length === 0) continue;

      const mostRecentRating = entries
        .sort((a, b) => b.ratedAt - a.ratedAt)[0];

      const ratedWork = allWorks.find(w =>
        (w.id || w.workId) === mostRecentRating.workId
      );

      if (ratedWork) {
        const normalizedWork = normalizeWork(ratedWork);
        friendsWithActivity.push({
          id: user.userId,
          name: user.username,
          avatar: user.profilePictureUrl || DEFAULT_AVATAR_URL,
          likedAlbum: {
            title: normalizedWork.title,
            coverUrl: normalizedWork.coverUrl,
            workId: normalizedWork.workId
          }
        });
      }
    } catch (_) {}
  }

  return friendsWithActivity;
};

const getRandomWorks = (allWorks, type, limit = 10) => {
  try {
    // Filter works by type
    const filteredWorks = allWorks.filter(work => work.type === type);
    
    // Shuffle and take first 'limit' items
    const shuffled = shuffleArray(filteredWorks);
    return shuffled.slice(0, limit).map(normalizeWork).filter(Boolean);
  } catch (error) {
    logger.error('Error getting random works:', error);
    return [];
  }
};

/* ---------------------- CARD COMPONENTS ---------------------- */

const FriendCard = ({ friend }) => (
  <div
    style={{
      background: '#9a4207c8',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '280px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
  >
    <Link to={`/works/${friend.likedAlbum.workId}`} style={{ flex: 1 }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img
          src={friend.likedAlbum.coverUrl}
          alt={friend.likedAlbum.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </Link>

    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <img
          src={friend.avatar}
          style={{ width: 20, height: 20, borderRadius: '50%' }}
        />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{friend.name}</span>
      </div>

      <div style={{ fontSize: 12 }}>
        liked <strong>{friend.likedAlbum.title}</strong>
      </div>
    </div>
  </div>
);

const PopularWorkCard = ({ work }) => (
  <Link to={`/works/${work.workId}`} style={{ textDecoration: 'none' }}>
    <div
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '280px',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.querySelector('div').style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.querySelector('div').style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          height: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <img
          src={work.coverUrl}
          alt={work.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  </Link>
);

/* ---------------------- HOME PAGE ---------------------- */

export default function Home() {
  useNavigationWithClearFilters();

  const { user } = useAuth(); // NOW decides login state
  const currentUserId = user?.userId || null;
  const isMountedRef = useRef(true);

  const [popular, setPopular] = useState([]);
  const [friends, setFriends] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentMusic, setRecentMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if user just logged in
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY_JUST_LOGGED_IN) === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem(STORAGE_KEY_JUST_LOGGED_IN);
    }
  }, []);

  // Memoized load page function
  const loadPage = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // Reset state immediately to prevent flash of old content
      setPopular([]);
      setFriends([]);
      setRecentMovies([]);
      setRecentMusic([]);
      setLoading(true);
      setFriendsLoading(true);
      setRecentLoading(true);

      await testConnection();

      const [popularData, worksData] = await Promise.all([
        getPopularWorks(),
        getAllWorks()
      ]);

      if (!isMountedRef.current) return;

      setPopular(processPopularWorks(popularData));
      const allWorks = worksData?.works || [];

      if (currentUserId) {
        // Only fetch friends if logged in
        const usersResponse = await getAllUsers();
        
        if (!isMountedRef.current) return;
        
        const users = usersResponse?.data || usersResponse || [];
        const friendActivity = await processFriendsData(
          users,
          allWorks,
          currentUserId,
          isMountedRef
        );
        
        if (!isMountedRef.current) return;
        
        setFriends(friendActivity);
      } else {
        setFriends([]); // logged-out users see no friends list
      }

      setLoading(false);
      setFriendsLoading(false);

      // Load random movies and music
      const movies = getRandomWorks(allWorks, WORK_TYPES.MOVIE, HOME_CAROUSEL_LIMIT);
      const music = getRandomWorks(allWorks, WORK_TYPES.MUSIC, HOME_CAROUSEL_LIMIT);
      
      if (!isMountedRef.current) return;
      
      setRecentMovies(movies);
      setRecentMusic(music);
      setRecentLoading(false);
    } catch (error) {
      logger.error('Error loading home page:', error);
      if (isMountedRef.current) {
        setLoading(false);
        setFriendsLoading(false);
        setRecentLoading(false);
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    isMountedRef.current = true;
    loadPage();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadPage]);

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          {/* ------------------ WELCOME MESSAGE ------------------ */}
          {!user ? (
            <p className="welcome-text">
              Welcome to <strong>Syncfully</strong>. Discover the most popular works this week.
            </p>
          ) : showWelcome ? (
            <p className="welcome-text">
              Welcome back <strong style={{ color: '#9a4207', fontSize: '20px' }}>{user.username}</strong>. Here's what others have been discovering...
            </p>
          ) : null}

          {/* ------------------ FRIENDS ACTIVITY ------------------ */}
          {user && (
            <>
              <h3 className="section-title">FRIENDS' FAVOURITES</h3>
              {friendsLoading ? (
                <FriendGridSkeleton count={4} />
              ) : friends.length === 0 ? (
                <p>No recent activity from friends.</p>
              ) : (
                <HomeCarousel scrollChunk={3}>
                  {friends.map(f => (
                    <div key={f.id} style={{ flexShrink: 0, width: '180px' }}>
                      <FriendCard friend={f} />
                    </div>
                  ))}
                </HomeCarousel>
              )}
            </>
          )}

          {/* ------------------ POPULAR WORKS ------------------ */}
          <h3 className="section-title" style={{ marginTop: 20 }}>
            WEEK'S TOP 10
          </h3>

          {loading ? (
            <WorkGridSkeleton count={6} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : (
            <HomeCarousel scrollChunk={3}>
              {popular.map(w => (
                <div key={w.workId} style={{ flexShrink: 0, width: '180px' }}>
                  <PopularWorkCard work={w} />
                </div>
              ))}
            </HomeCarousel>
          )}

          {/* ------------------ RECENTLY WATCHED ------------------ */}
          <h3 className="section-title" style={{ marginTop: 40 }}>
            RECENTLY WATCHED
          </h3>

          {recentLoading ? (
            <WorkGridSkeleton count={6} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : recentMovies.length === 0 ? (
            <p>No recently rated movies yet.</p>
          ) : (
            <HomeCarousel scrollChunk={3}>
              {recentMovies.map(w => (
                <div key={w.workId} style={{ flexShrink: 0, width: '180px' }}>
                  <PopularWorkCard work={w} />
                </div>
              ))}
            </HomeCarousel>
          )}

          {/* ------------------ RECENTLY PLAYED ------------------ */}
          <h3 className="section-title" style={{ marginTop: 40 }}>
            RECENTLY PLAYED
          </h3>

          {recentLoading ? (
            <WorkGridSkeleton count={6} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : recentMusic.length === 0 ? (
            <p>No recently rated music yet.</p>
          ) : (
            <HomeCarousel scrollChunk={3}>
              {recentMusic.map(w => (
                <div key={w.workId} style={{ flexShrink: 0, width: '180px' }}>
                  <PopularWorkCard work={w} />
                </div>
              ))}
            </HomeCarousel>
          )}
        </main>
      </div>
    </div>
  );
}
