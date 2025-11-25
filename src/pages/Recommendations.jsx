import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserRecommendations } from '../api/users';
import { getAllWorks } from '../api/works';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';

export default function Recommendations() {
  useNavigationWithClearFilters();
  const navigate = useNavigate();

  const { user, isGuest } = useAuth();

  const [lists, setLists] = useState({ current: [], profile: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- GRID RENDER ----------
  const renderGrid = (items = []) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
      }}
    >
      {items.map((item) => (
        <Link
          key={item.workId}
          to={`/works/${item.workId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              height: '280px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.2s ease',
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
      ))}
    </div>
  );

  // ---------- MAIN LOGIC ----------
  useEffect(() => {
    // 🚫 If guest, redirect to login immediately
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
        // 1️⃣ Try personalized recommendations
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
          const mappedRecs = recommendations.map((rec) => ({
            workId: rec.id || rec.workId,
            title: rec.title,
            coverUrl: rec.coverUrl || '/album_covers/default.jpg',
            type: rec.type,
            creator: rec.creator,
            rating: rec.averageRating || rec.rating || 0,
          }));

          const midpoint = Math.ceil(mappedRecs.length / 2);
          setLists({
            current: mappedRecs.slice(0, midpoint),
            profile: mappedRecs.slice(midpoint),
          });

          return;
        }

        // 2️⃣ Fallback → All works (no personal data)
        const worksData = await getAllWorks();
        const allWorks = worksData?.works || [];

        if (allWorks.length === 0) {
          throw new Error('No works available from backend');
        }

        const mappedWorks = allWorks.map((work) => ({
          workId: work.id || work.workId,
          title: work.title,
          coverUrl: work.coverUrl || '/album_covers/default.jpg',
          type: work.type,
          creator: work.creator,
          rating: work.averageRating || work.rating || 0,
        }));

        const shuffled = [...mappedWorks].sort(() => Math.random() - 0.5);

        setLists({
          current: shuffled.slice(0, 5),
          profile: shuffled.slice(5, 10),
        });
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Unable to load recommendations. Please try again later.');
        setLists({ current: [], profile: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, isGuest, navigate]);

  // ---------- RENDER ----------
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <p className="welcome-text">We found some new picks for you!</p>

          {error && (
            <div
              style={{
                padding: '16px',
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
                color: '#721c24',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          {/* CURRENT */}
          <h3 className="section-title">BASED ON YOUR LATEST INTEREST</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading recommendations...</p>
          ) : lists.current.length > 0 ? (
            renderGrid(lists.current)
          ) : (
            <p style={{ color: '#392c2cff' }}>
              No recommendations available at the moment.
            </p>
          )}

          {/* PROFILE */}
          <h3 className="section-title" style={{ marginTop: 30 }}>
            BASED ON YOUR PROFILE
          </h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading recommendations...</p>
          ) : lists.profile.length > 0 ? (
            renderGrid(lists.profile)
          ) : (
            <p style={{ color: '#392c2cff' }}>
              No profile-based recommendations available.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
