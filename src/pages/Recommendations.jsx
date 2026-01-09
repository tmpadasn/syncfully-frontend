/*
 Recommendations page.
 Shows personalized picks and fallback lists.
 Uses backend recommendations when available.
*/
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useNavigationWithClearFilters } from '../hooks';
import { getUserRecommendations, getAllWorks } from '../api';
import { WorkCard, Carousel } from '../components';
import logger from '../utils/logger';
import { extractWorksFromResponse, normalizeWorks, shuffleArray } from '../utils/normalize';

/* ===================== RECOMMENDATIONS FUNCTION ===================== */

// Recommendations page component.
// Shows personalized picks and fallbacks when no backend data present.
export default function Recommendations() {
  useNavigationWithClearFilters();
  const navigate = useNavigate();

  // Auth context - get current user and guest status
  const { user, isGuest } = useAuth();

  // State for storing recommendation lists (4 categories)
  const [lists, setLists] = useState({
    current: [],    // Personalized picks based on user's latest interests
    profile: [],    // Recommendations based on user profile
    friends: [],    // Works liked by user's friends
    explore: []     // General exploration section with random works
  });

  // Loading state for skeleton rendering
  const [loading, setLoading] = useState(true);

  // Error state for failed requests
  const [error, setError] = useState(null);

  /* ===================== MAIN LOGIC ===================== */
  // Fetch recommendations on component mount
  // Redirects guests to login and handles error states
  useEffect(() => {
    // Redirect guests to login page
    if (isGuest) {
      navigate('/login', { state: { message: 'Log in to see your personalized recommendations.' } });
      return;
    }

    // Async function to fetch and process recommendations
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all available works for fallback sections
        const worksData = await getAllWorks();
        const allWorks = extractWorksFromResponse(worksData);
        if (allWorks.length === 0) throw new Error('No works available from backend');

        // Normalize and shuffle works for static sections
        const mappedWorks = normalizeWorks(allWorks);
        const shuffled = shuffleArray(mappedWorks);

        // Placeholder for personalized recommendations
        let currentRecommendations = [];

        // Try to fetch personalized recommendations from backend
        try {
          const recData = await getUserRecommendations(user.userId);
          const data = recData?.data || recData;
          // Handle multiple response formats from API
          const recs = data?.recommendations ||
                      [...(data?.current || []), ...(data?.profile || [])] ||
                      (Array.isArray(data) ? data : []);
          // Use personalized recommendations if available, fallback to shuffled works
          currentRecommendations = recs.length > 0 ? normalizeWorks(recs.slice(0, 10)) : shuffled.slice(30, 40);
        } catch (recError) {
          // Log error and use fallback random works
          logger.error('Error fetching personalized recommendations:', recError);
          currentRecommendations = shuffled.slice(30, 40);
        }

        // Set recommendation lists with non-overlapping slices of shuffled works
        setLists({
          current: currentRecommendations,       // Personalized picks (positions 30-40)
          profile: shuffled.slice(0, 10),         // Profile-based (positions 0-10)
          friends: shuffled.slice(10, 20),        // Friends' favorites (positions 10-20)
          explore: shuffled.slice(20, 30),        // Exploration section (positions 20-30)
        });
      } catch (err) {
        // Handle critical errors (no works available, network issues, etc.)
        logger.error('Failed to fetch recommendations:', err);
        setError('Unable to load recommendations. Please try again later.');
      } finally {
        // Stop loading regardless of success or failure
        setLoading(false);
      }
    };

    // Execute fetch on mount or when user/auth status changes
    fetchRecommendations();
  }, [user, isGuest, navigate]);

  // Define recommendation sections with titles and data
  // Used for mapping and rendering multiple carousels dynamically

  /* ===================== RENDER ===================== */
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          {/* Welcome message with emphasis */}
          <p style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#392c2c',
            marginTop: '40px',
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            We found some <span style={{
              color: '#9a4207',
              fontWeight: '900',
            }}>amazing picks</span> for you!
          </p>

          {/* Display error message if fetch failed */}
          {error && <div style={{
            padding: '16px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            color: '#721c24',
            marginBottom: '20px',
          }}>{error}</div>}

          {/* Render recommendation sections dynamically */}
          {[
            { key: 'current', title: 'BASED ON YOUR LATEST INTEREST', data: lists.current },
            { key: 'profile', title: 'BASED ON YOUR PROFILE', data: lists.profile },
            { key: 'friends', title: "BASED ON YOUR FRIEND'S FAVOURITES", data: lists.friends },
            { key: 'explore', title: 'EXPLORE MORE', data: lists.explore },
          ].map((section) =>
            loading ? (
              <Carousel
                key={section.key}
                title={section.title}
                loading={true}
                emptyMessage="No recommendations available."
                scrollChunk={3}
              />
            ) : (
              <Carousel
                key={section.key}
                title={section.title}
                loading={false}
                emptyMessage="No recommendations available."
                scrollChunk={3}
              >
                {section.data.map((item) => (
                  <div key={item.workId} style={{ flexShrink: 0, width: '180px' }}>
                    <Link to={`/works/${item.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <WorkCard work={item} flat hideInfo coverStyle={{ width: '180px', height: '280px' }} />
                    </Link>
                  </div>
                ))}
              </Carousel>
            )
          )}
        </main>
      </div>
    </div>
  );
}
