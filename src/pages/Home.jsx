import { useEffect, useState, useCallback, useRef } from 'react';
import { getPopularWorks, getAllWorks } from '../api/works';
import { getUserRatings, getUserFollowing } from '../api/users';
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


/* ===================== DATA PROCESSING FUNCTION ===================== */

const processPopularWorks = (data) => {
  const works = extractWorksFromResponse(data);
  return normalizeWorks(works);
};


const processFollowingData = async (following, allWorks, isMountedRef) => {
  const followingWithActivity = [];

  if (!following || following.length === 0) return [];

  // First, fetch all ratings for each user being followed
  const followingRatings = [];

  for (const followedUser of following) {
    if (!isMountedRef.current) break;

    try {
      const ratingsResponse = await getUserRatings(followedUser.userId || followedUser.id);

      if (!isMountedRef.current) break;

      const ratingsData = ratingsResponse?.data || ratingsResponse || {};
      const entries = normalizeRatingsObject(ratingsData);
      if (entries.length === 0) continue;

      // Get all ratings sorted by most recent
      const sortedRatings = entries.sort((a, b) => b.ratedAt - a.ratedAt);

      // Get up to 5 most recent ratings per followed user
      const userWorks = [];
      for (let i = 0; i < Math.min(5, sortedRatings.length); i++) {
        const rating = sortedRatings[i];
        const ratedWork = allWorks.find(w =>
          (w.id || w.workId) === rating.workId
        );

        if (ratedWork) {
          const normalizedWork = normalizeWork(ratedWork);
          userWorks.push({
            id: `${followedUser.userId || followedUser.id}-${i}`,
            followerId: followedUser.userId || followedUser.id,
            name: followedUser.username,
            avatar: followedUser.profilePictureUrl || DEFAULT_AVATAR_URL,
            likedAlbum: {
              title: normalizedWork.title,
              coverUrl: normalizedWork.coverUrl,
              workId: normalizedWork.workId
            }
          });
        }
      }

      if (userWorks.length > 0) {
        followingRatings.push(userWorks);
      }
    } catch (error) {
      logger.error('Failed to fetch ratings for followed user:', followedUser.userId || followedUser.id, error);
    }
  }

  // Alternate between followed users - take one work from each in round-robin fashion
  let maxWorks = Math.max(...followingRatings.map(f => f.length));
  for (let i = 0; i < maxWorks; i++) {
    for (let j = 0; j < followingRatings.length; j++) {
      if (i < followingRatings[j].length) {
        followingWithActivity.push(followingRatings[j][i]);
      }
    }
  }

  return followingWithActivity;
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

/**
 * FriendCard component - Displays friend's recently liked work
 * Uses .friend-card-home CSS class for consistent Home page styling
 *
 * @param {Object} props - Component props
 * @param {Object} props.friend - Friend data with name, avatar, and liked album info
 * @returns {React.ReactNode} Card showing friend's profile, avatar, and liked album cover
 */
const FriendCard = ({ friend }) => (
  <div className="friend-card-home">
    {/* Album cover image with link to work details */}
    <Link to={`/works/${friend.likedAlbum.workId}`} style={{ flex: 1, textDecoration: 'none' }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img
          src={friend.likedAlbum.coverUrl}
          alt={friend.likedAlbum.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </Link>

    {/* Friend info section with avatar and name */}
    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <img
          src={friend.avatar}
          style={{ width: 20, height: 20, borderRadius: '50%' }}
        />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{friend.name}</span>
      </div>

      {/* Album title text */}
      <div style={{ fontSize: 12 }}>
        liked <strong>{friend.likedAlbum.title}</strong>
      </div>
    </div>
  </div>
);

/**
 * PopularWorkCard component - Displays work cover with hover effects
 * Uses .popular-work-card CSS class for consistent styling across carousels
 *
 * @param {Object} props - Component props
 * @param {Object} props.work - Work data with cover URL and ID
 * @returns {React.ReactNode} Clickable card linking to work details with cover image
 */
const PopularWorkCard = ({ work }) => (
  <Link to={`/works/${work.workId}`} style={{ textDecoration: 'none' }}>
    <div className="popular-work-card">
      {/* Work cover image - fills entire card container */}
      <img
        src={work.coverUrl}
        alt={work.title}
      />
    </div>
  </Link>
);

/* ===================== HOME PAGE FUNCTION ===================== */

export default function Home() {
  useNavigationWithClearFilters();

  const { user } = useAuth(); // NOW decides login state
  const currentUserId = user?.userId || null;
  const isMountedRef = useRef(true);

  const [popular, setPopular] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentMusic, setRecentMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  /* removed styles object - using inline styles and CSS classes instead */

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
      setFollowing([]);
      setRecentMovies([]);
      setRecentMusic([]);
      setLoading(true);
      setFollowingLoading(true);
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
        // Fetch following data
        try {
          const followingResponse = await getUserFollowing(currentUserId);
          const followingList = followingResponse?.following || [];

          if (!isMountedRef.current) return;

          const followingActivity = await processFollowingData(
            followingList,
            allWorks,
            isMountedRef
          );

          if (!isMountedRef.current) return;

          setFollowing(followingActivity);
        } catch (error) {
          logger.error('Failed to fetch following:', error);
          setFollowing([]);
        }
      } else {
        setFollowing([]);
      }

      setLoading(false);
      setFollowingLoading(false);

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
        setFollowingLoading(false);
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

  // RETURN HOME PAGE LAYOUT
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
          {!user && (
            <div style={{
              marginTop: 40,
              marginBottom: 60,
              background: 'linear-gradient(135deg, #9a4207 0%, #c85609 100%)',
              borderRadius: 16,
              padding: '48px 32px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(154, 66, 7, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background elements */}
              <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  Unlock Your Personalized Experience
                </h2>
                <p style={{
                  fontSize: 18,
                  marginBottom: 32,
                  color: '#fff',
                  opacity: 0.95,
                  maxWidth: 600,
                  margin: '0 auto 32px',
                  lineHeight: 1.6
                }}>
                  Join Syncfully to get personalized recommendations, track what you've watched and listened to, and discover works tailored just for you.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-block',
                      padding: '14px 40px',
                      background: '#fff',
                      color: '#9a4207',
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 8,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=signup"
                    style={{
                      display: 'inline-block',
                      padding: '14px 40px',
                      background: 'transparent',
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 8,
                      textDecoration: 'none',
                      border: '2px solid #fff',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Create Account
                  </Link>
                </div>

                {/* Feature highlights */}
                <div style={{
                  display: 'flex',
                  gap: 64,
                  justifyContent: 'center',
                  marginTop: 40,
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'center', maxWidth: 200 }}>
                    <div style={{
                      fontSize: 36,
                      marginBottom: 12,
                      width: 60,
                      height: 60,
                      margin: '0 auto 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                      Personalized Recommendations
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: 200 }}>
                    <div style={{
                      fontSize: 36,
                      marginBottom: 12,
                      width: 60,
                      height: 60,
                      margin: '0 auto 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                      Track Your Collection
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: 200 }}>
                    <div style={{
                      fontSize: 36,
                      marginBottom: 12,
                      width: 60,
                      height: 60,
                      margin: '0 auto 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                      See Friends' Favorites
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Friends' Favourites Section */}
          {user && (
            <>
              <h3 className="section-title" style={{ marginTop: 40 }}>
                FRIENDS' FAVOURITES
              </h3>
              {followingLoading ? (
                <FriendGridSkeleton count={4} />
              ) : following.length === 0 ? (
                <p>You are not following anyone yet, or they haven't rated any works.</p>
              ) : (
                <HomeCarousel scrollChunk={3}>
                  {following.map(f => (
                    <div key={f.id} style={{ flexShrink: 0, width: '180px' }}>
                      <FriendCard friend={f} />
                    </div>
                  ))}
                </HomeCarousel>
              )}
            </>
          )}

          {/* Popular Works */}
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

          {/* Recently Watched */}
          {user && (
            <>
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
            </>
          )}

          {/* Recently Played */}
          {user && (
            <>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
