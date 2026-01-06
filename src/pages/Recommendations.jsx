/*
 Recommendations page.
 Shows personalized picks and fallback lists.
 Uses backend recommendations when available.
*/
import {
  useEffect, useState, Link, useNavigate, useAuth,
  useNavigationWithClearFilters, getUserRecommendations,
  getAllWorks, WorkGridSkeleton, HomeCarousel,
  logger, extractWorksFromResponse, normalizeWorks, shuffleArray,
} from '../imports/recommendationsImports';

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

  /* ===================== WORK CARD COMPONENT ===================== */
  // Individual work card that links to work details page
  // Props: item - work object containing workId, coverUrl, title
  const WorkCard = ({ item }) => (
    <Link to={`/works/${item.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="work-card-recommendations">
        <div className="work-card-recommendations-inner">
          <img src={item.coverUrl} alt={item.title} className="work-card-recommendations-img" />
        </div>
      </div>
    </Link>
  );

  // Carousel component renderer with conditional states
  // Props: items - array of works to display, loading - boolean for skeleton state
  // Displays loading skeleton, carousel with items, or empty message
  const RenderCarousel = ({ items = [], loading }) => (
    <>
      {loading ? (
        <WorkGridSkeleton count={10} columns="repeat(auto-fill, minmax(180px, 1fr))" />
      ) : items.length > 0 ? (
        <HomeCarousel scrollChunk={3}>
          {items.map((item) => (
            <div key={item.workId} style={{ flexShrink: 0, width: '180px' }}>
              <WorkCard item={item} />
            </div>
          ))}
        </HomeCarousel>
      ) : (
        <p className="empty-message">No recommendations available.</p>
      )}
    </>
  );

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
          <p className="welcome-text">
            We found some <span className="welcome-emphasis">amazing picks</span> for you!
          </p>

          {/* Display error message if fetch failed */}
          {error && <div className="error-box">{error}</div>}

          {/* Render recommendation sections dynamically */}
          {[
            { key: 'current', title: 'BASED ON YOUR LATEST INTEREST', data: lists.current },
            { key: 'profile', title: 'BASED ON YOUR PROFILE', data: lists.profile },
            { key: 'friends', title: "BASED ON YOUR FRIEND'S FAVOURITES", data: lists.friends },
            { key: 'explore', title: 'EXPLORE MORE', data: lists.explore },
          ].map((section, idx) => (
            <div key={section.key}>
              {/* Section title with spacing for non-first items */}
              <h3 className={`section-title ${idx > 0 ? 'section-spacing' : ''}`}>{section.title}</h3>
              {/* Carousel with loading state and items */}
              <RenderCarousel items={section.data} loading={loading} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
