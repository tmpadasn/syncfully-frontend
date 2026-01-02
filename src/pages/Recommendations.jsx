/*
 Recommendations page.
 Shows personalized picks and fallback lists.
 Uses backend recommendations when available.
*/
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserRecommendations } from '../api/users';
import { getAllWorks } from '../api/works';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import { WorkGridSkeleton } from '../components/Skeleton';
import HomeCarousel from '../components/HomeCarousel';
import logger from '../utils/logger';
import {
  extractWorksFromResponse,
  normalizeWorks,
  shuffleArray,
} from '../utils/normalize';

/* ===================== RECOMMENDATIONS FUNCTION ===================== */

export default function Recommendations() {
  useNavigationWithClearFilters();
  const navigate = useNavigate();

  const { user, isGuest } = useAuth();

  const [lists, setLists] = useState({ 
    current: [], 
    profile: [], 
    friends: [], 
    explore: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

/* ===================== UI STYLES ===================== */

const styles = {
  /* ===================== PAGE LAYOUT ===================== */
  pageContainer: {
    display: "flex",
    flexDirection: "column",
  },
  pageInner: {
    flex: 1,
  },
  pageMain: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },

  /* ===================== HEADINGS ===================== */
  welcomeText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#392c2c',
    marginTop: '40px',
    marginBottom: '24px',
    textAlign: 'center'
  },
  welcomeEmphasis: {
    color: '#9a4207',
    fontWeight: '900'
  },

  /* ===================== ERROR MESSAGES ===================== */
  errorBox: {
    padding: '16px',
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    color: '#721c24',
    marginBottom: '20px',
  },

  /* ===================== EMPTY STATE ===================== */
  emptyMessage: {
    color: '#392c2cff'
  },
};

/* ===================== WORK CARD COMPONENT ===================== */
const WorkCard = ({ item }) => (
    <Link
      to={`/works/${item.workId}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          height: '280px',
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
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            height: '100%',
          }}
        >
          <img
            src={item.coverUrl}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </div>
    </Link>
  );

  // GRID RENDER
  const renderCarousel = (items = []) => (
    <HomeCarousel scrollChunk={3}>
      {items.map((item) => (
        <div key={item.workId} style={{ flexShrink: 0, width: '180px' }}>
          <WorkCard item={item} />
        </div>
      ))}
    </HomeCarousel>
  );

  // MAIN LOGIC
  useEffect(() => {
    // If guest, redirect to login
    if (isGuest) {
      navigate('/login', {
        state: { message: 'Log in to see your personalized recommendations.' },
      });
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      const userId = user.userId;

      try {
        // Fetch all works first for fallback sections
        const worksData = await getAllWorks();
        const allWorks = extractWorksFromResponse(worksData);

        if (allWorks.length === 0) {
          throw new Error('No works available from backend');
        }

        const mappedWorks = normalizeWorks(allWorks);

        // Generate random static lists for sections 2, 3, 4
        const shuffled = shuffleArray(mappedWorks);
        const staticProfile = shuffled.slice(0, 10);
        const staticFriends = shuffled.slice(10, 20);
        const staticExplore = shuffled.slice(20, 30);

        // Try backend recommendations first
        let currentRecommendations = [];
        try {
          const recommendationsData = await getUserRecommendations(userId);
          const responseData = recommendationsData?.data || recommendationsData;

          let recommendations = [];

          if (responseData?.recommendations) {
            recommendations = responseData.recommendations;
          } else if (responseData?.current || responseData?.profile) {
            recommendations = [
              ...(responseData.current || []),
              ...(responseData.profile || []),
            ];
          } else if (Array.isArray(responseData)) {
            recommendations = responseData;
          }

          if (recommendations.length > 0) {
            currentRecommendations = normalizeWorks(recommendations.slice(0, 10));
          }
        } catch (recError) {
          logger.error('Error fetching personalized recommendations:', recError);
        }

        // If no personalized recommendations, use random works
        if (currentRecommendations.length === 0) {
          currentRecommendations = shuffled.slice(30, 40);
        }

        setLists({
          current: currentRecommendations,
          profile: staticProfile,
          friends: staticFriends,
          explore: staticExplore,
        });
      } catch (err) {
        logger.error('Failed to fetch recommendations:', err);
        setError('Unable to load recommendations. Please try again later.');
        setLists({ current: [], profile: [], friends: [], explore: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, isGuest, navigate]);

  // RETURN RECOMMENDATIONS PAGE LAYOUT
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <p style={styles.welcomeText}>
            We found some <span style={styles.welcomeEmphasis}>amazing picks</span> for you!
          </p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* CURRENT */}
          <h3 className="section-title">BASED ON YOUR LATEST INTEREST</h3>
          {loading ? (
            <WorkGridSkeleton count={10} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : lists.current.length > 0 ? (
            renderCarousel(lists.current)
          ) : (
            <p style={styles.emptyMessage}>
              No recommendations available at the moment.
            </p>
          )}

          {/* PROFILE */}
          <h3 className="section-title" style={{ marginTop: 40 }}>
            BASED ON YOUR PROFILE
          </h3>
          {loading ? (
            <WorkGridSkeleton count={10} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : lists.profile.length > 0 ? (
            renderCarousel(lists.profile)
          ) : (
            <p style={styles.emptyMessage}>
              No profile-based recommendations available.
            </p>
          )}

          {/* FRIENDS */}
          <h3 className="section-title" style={{ marginTop: 40 }}>
            BASED ON YOUR FRIEND'S FAVOURITES
          </h3>
          {loading ? (
            <WorkGridSkeleton count={10} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : lists.friends.length > 0 ? (
            renderCarousel(lists.friends)
          ) : (
            <p style={styles.emptyMessage}>
              No friend-based recommendations available.
            </p>
          )}

          {/* EXPLORE */}
          <h3 className="section-title" style={{ marginTop: 40 }}>
            EXPLORE MORE
          </h3>
          {loading ? (
            <WorkGridSkeleton count={10} columns="repeat(auto-fill, minmax(180px, 1fr))" />
          ) : lists.explore.length > 0 ? (
            renderCarousel(lists.explore)
          ) : (
            <p style={styles.emptyMessage}>
              No additional works to explore.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
