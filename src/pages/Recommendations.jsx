import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserRecommendations } from '../api/users';
import { getAllWorks } from '../api/works';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';


export default function Recommendations() {
  // Auto-clear search parameters if they exist on non-search pages
  useNavigationWithClearFilters();
  
  const { user } = useAuth();
  const [lists, setLists] = useState({ current: [], profile: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderGrid = (items = []) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
      {items.map(item => (
        <Link key={item.workId} to={`/works/${item.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div 
            style={{
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              height: '280px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease',
              height: '100%'
            }}>
              <img 
                src={item.coverUrl} 
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      const userId = user?.userId || 1; // Default to user 1 if no auth context
      
      try {
        // First try to get user-specific recommendations
        const recommendationsData = await getUserRecommendations(userId);
        const responseData = recommendationsData?.data || recommendationsData;
        
        let recommendations = [];
        
        // Extract recommendations from various possible response formats
        if (responseData?.recommendations) {
          recommendations = responseData.recommendations;
        } else if (responseData?.current || responseData?.profile) {
          recommendations = [...(responseData.current || []), ...(responseData.profile || [])];
        } else if (Array.isArray(responseData)) {
          recommendations = responseData;
        }
        
        // If we have recommendations, use them
        if (recommendations.length > 0) {
          const mappedRecs = recommendations.map(rec => ({
            workId: rec.id || rec.workId,
            title: rec.title,
            coverUrl: rec.coverUrl || '/album_covers/default.jpg',
            type: rec.type,
            creator: rec.creator,
            rating: rec.averageRating || rec.rating || 0
          }));
          
          // Split recommendations into categories
          const midpoint = Math.ceil(mappedRecs.length / 2);
          const current = mappedRecs.slice(0, midpoint);
          const profile = mappedRecs.slice(midpoint);
          
          setLists({ current, profile });
          return;
        }
        
        // If no specific recommendations, fall back to popular works from backend
        const worksData = await getAllWorks();
        const allWorks = worksData?.works || [];
        
        if (allWorks.length === 0) {
          throw new Error('No works available from backend');
        }
        
        // Map and use backend works as recommendations
        const mappedWorks = allWorks.map(work => ({
          workId: work.id || work.workId,
          title: work.title,
          coverUrl: work.coverUrl || '/album_covers/default.jpg',
          type: work.type,
          creator: work.creator,
          rating: work.averageRating || work.rating || 0
        }));
        
        // Shuffle and split for variety
        const shuffled = [...mappedWorks].sort(() => Math.random() - 0.5);
        const current = shuffled.slice(0, 5);
        const profile = shuffled.slice(5, 10);
        
        setLists({ current, profile });
        
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setError('Unable to load recommendations. Please try again later.');
        setLists({ current: [], profile: [] });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);
  

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <p className="welcome-text">We found some new picks for you!</p>

          {error && (
            <div style={{ 
              padding: '16px', 
              background: '#f8d7da', 
              border: '1px solid #f5c6cb', 
              borderRadius: '8px', 
              color: '#721c24', 
              marginBottom: '20px' 
            }}>
              {error}
            </div>
          )}

          <h3 className="section-title">BASED ON YOUR LATEST INTEREST</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading recommendations...</p>
          ) : lists.current.length > 0 ? (
            renderGrid(lists.current)
          ) : (
            <p style={{ color: '#392c2cff' }}>No recommendations available at the moment.</p>
          )}

          <h3 className="section-title" style={{ marginTop: 30 }}>BASED ON YOUR PROFILE</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading recommendations...</p>
          ) : lists.profile.length > 0 ? (
            renderGrid(lists.profile)
          ) : (
            <p style={{ color: '#392c2cff' }}>No profile-based recommendations available.</p>
          )}
        </main>
      </div>
    </div>
  );
}

