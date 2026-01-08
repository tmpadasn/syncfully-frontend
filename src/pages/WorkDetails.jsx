import { useEffect, useState, useCallback, useRef, useParams, useNavigate } from '../imports/workDetailsImports';
import { Toast, WorkDetailsSkeleton, WorkDetailsLeftSidebar, WorkDetailsMainContent, WorkDetailsRatings, getWork,
          getWorkRatings, postWorkRating, getSimilarWorks, getUserRecommendations, logger, extractWorkFromResponse,
          extractRatingsFromResponse, normalizeWork, normalizeWorks, normalizeGenres } from '../imports/workDetailsImports';
import { useNavigationWithClearFilters, useAuth, useShelves } from '../imports/workDetailsImports';

// Configuration constants
const MAX_RECOMMENDATIONS = 5;
const RATING_TOAST_TIMEOUT = 2000;

// Transform raw work data into displayable format with normalized genres and external links
const processWork = (wr) => !wr ? null : (() => {
  const w = extractWorkFromResponse(wr);
  const n = w ? normalizeWork(w) : null;
  return !n ? null : { ...n, genres: normalizeGenres(w.genres), genre: Array.isArray(n.genres) ? n.genres.join(', ') : '',
                            findAt: w.foundAt ? [{ label: 'External Link', url: w.foundAt }] : [] };
})();

// Calculate distribution of ratings for histogram visualization (5-star to 1-star)
const calcDistribution = (r) => [5, 4, 3, 2, 1].map((s) =>
                         ({ star: s, count: r.filter((x) => Math.round(Number(x.score) || 0) === s).length }));

export default function WorkDetails() {
  // Initialize navigation and auth/context hooks
  useNavigationWithClearFilters();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { shelves } = useShelves(user?.userId);
  const { workId } = useParams();
  const isMountedRef = useRef(true);
  const loggedUserId = user?.userId || null;

  // Consolidated state for all component data
  const [{ work, ratings, recommended, score, hoverScore, loading, message, messageType, ratingSubmittedMessage,
          showRecommendationToast, recommendationVersion }, setState] = useState({
          work: null, ratings: [], recommended: [], score: 0, hoverScore: 0, loading: true, message: null,
          messageType: null, ratingSubmittedMessage: false, showRecommendationToast: false, recommendationVersion: null,
  });

  // Helper to update individual state fields
  const setStateField = useCallback((field, value) => setState((s) => ({ ...s, [field]: value })), []);

  // Load work, ratings, and recommendations from API
  const loadWorkData = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      setState((s) => ({ ...s, work: null, ratings: [], recommended: [], score: 0, loading: true }));
      const [wr, rr, sr] = await Promise.all([getWork(workId), getWorkRatings(workId), getSimilarWorks(workId)]);
      if (isMountedRef.current) setState((s) => ({ ...s, work: processWork(wr), ratings: extractRatingsFromResponse(rr),
                                  recommended: normalizeWorks(sr || []).slice(0, MAX_RECOMMENDATIONS), loading: false }));
    } catch (error) {
      logger.error('Error loading work details:', error);
      if (isMountedRef.current) setStateField('loading', false);
    }
  }, [workId, setStateField]);

  // Manage component lifecycle and load data on workId change
  useEffect(() => {
    isMountedRef.current = true;
    loadWorkData();
    return () => { isMountedRef.current = false; };
  }, [loadWorkData]);

  // Fetch recommendation version for logged-in users to detect new recommendations
  useEffect(() => {
    if (!isGuest && loggedUserId) getUserRecommendations(loggedUserId).then((d) => { if (isMountedRef.current && d?.version)
                                  setStateField('recommendationVersion', d.version); }).catch(() => {});
  }, [isGuest, loggedUserId, setStateField]);

  // Update user's score when ratings load to show their existing rating
  useEffect(() => {
    if (!isGuest && ratings.length > 0 && loggedUserId) {
      const r = ratings.find((x) => x.userId === loggedUserId);
      if (r) setStateField('score', Math.round(Number(r.score) || 0));
    }
  }, [ratings, loggedUserId, isGuest, setStateField]);

  // Submit user's rating and refresh rating data and recommendations
  const submitRating = useCallback(async (ov) => {
    if (isGuest) { navigate('/login', { state: { message: 'You must log in to rate this work.' } }); return; }
    try {
      setStateField('message', null);
      const ratingScore = typeof ov === 'number' ? ov : score;
      await postWorkRating(workId, { score: ratingScore, workId, userId: loggedUserId, ratedAt: new Date().toISOString() });
      const r = extractRatingsFromResponse(await getWorkRatings(workId));
      setStateField('ratings', r);
      setStateField('ratingSubmittedMessage', true);
      setTimeout(() => setStateField('ratingSubmittedMessage', false), RATING_TOAST_TIMEOUT);
      // Check if user has new recommendations after rating
      if (loggedUserId) {
        const rec = await getUserRecommendations(loggedUserId).catch(() => ({}));
        if (rec?.version && recommendationVersion && rec.version !== recommendationVersion) setStateField('showRecommendationToast', true);
        if (rec?.version) setStateField('recommendationVersion', rec.version);
      }
    } catch (e) {
      setStateField('message', e.response?.data?.message || e.message || 'Failed to submit rating');
      setStateField('messageType', 'error');
    }
  }, [isGuest, navigate, score, workId, loggedUserId, recommendationVersion, setStateField]);

  // Calculate rating distribution and get current user's rating
  const bucketCounts = calcDistribution(ratings);
  const userRatingScore = !isGuest ? ratings.find((r) => r.userId === loggedUserId) : null;

  // Show loading skeleton or error if data not ready
  if (loading) return <WorkDetailsSkeleton />;
  if (!work) return <p>Work not found.</p>;

  // Handle link button hover animations
  const handleLink = (e, h) => {
    e.currentTarget.style.transform = h ? 'translateY(-2px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = h ? '0 6px 16px rgba(154, 66, 7, 0.4)' : '0 4px 12px rgba(154, 66, 7, 0.3)';
  };

  // Render individual rating distribution bar
  const renderDist = (b) => {
    const pct = ratings.length ? Math.round((b.count / ratings.length) * 100) : 0;
    return (
      <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, textAlign: 'right', fontSize: 12, fontWeight: 500 }}>{b.star}★</div>
        <div style={{ flex: 1, background: '#eee', height: 20, borderRadius: 4, overflow: 'hidden', minWidth: 100, position: 'relative' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #9a4207, #b95716)',
                        transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ width: 32, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#333' }}>{b.count}</div>
      </div>
    );
  };

  // Message box styling based on success/error status
  const msgStyle = { padding: '12px 16px', marginBottom: 16, borderRadius: 8, fontSize: 14, fontWeight: 500,
                      border: messageType === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                      background: messageType === 'success' ? '#d4edda' : '#f8d7da',
                      color: messageType === 'success' ? '#155724' : '#721c24' };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
      {message && <div style={msgStyle}>{message}</div>}
      {/* 3-column layout: left sidebar (work card), main content (description), right sidebar (ratings) */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 24, alignItems: 'start' }}>
        <WorkDetailsLeftSidebar work={work} onLinkHover={handleLink} />
        <WorkDetailsMainContent work={work} recommended={recommended} />
        <WorkDetailsRatings isGuest={isGuest} user={user} workId={workId} shelves={shelves} ratingSubmittedMessage={ratingSubmittedMessage}
                            userRatingScore={userRatingScore ? Math.round(Number(userRatingScore.score) || 0) : null} score={score}
                            hoverScore={hoverScore} bucketCounts={bucketCounts} ratings={ratings}
                            onRatingChange={(i) => { setStateField('score', i); submitRating(i); }}
                            onRatingHover={(h) => setStateField('hoverScore', h)} renderDist={renderDist} />
      </div>
      {showRecommendationToast && <Toast message="You have new recommendations!"
                                         onClose={() => setStateField('showRecommendationToast', false)} link="/recommendations" />}
    </div>
  );
}
