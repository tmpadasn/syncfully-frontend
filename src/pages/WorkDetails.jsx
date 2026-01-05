import { useEffect, useState, useCallback, useRef, useParams, Link, useNavigate } from '../imports/workDetailsImports';
import { WorkCard, Toast, AddToShelfBtn, WorkDetailsSkeleton } from '../imports/workDetailsImports';
import { useNavigationWithClearFilters, useAuth, useShelves } from '../imports/workDetailsImports';
import { getWork, getWorkRatings, postWorkRating, getSimilarWorks,
        getUserRecommendations, logger, extractWorkFromResponse,
        extractRatingsFromResponse, normalizeWork, normalizeWorks, normalizeGenres } from '../imports/workDetailsImports';
import { workDetailsStyles, MAX_RECOMMENDATIONS, RATING_TOAST_TIMEOUT, EXTERNAL_LINK_HOVER_SHADOW, EXTERNAL_LINK_DEFAULT_SHADOW } from '../imports/workDetailsImports';

// Helper functions for data processing
const processWork = (wr) => {
  if (!wr) return null;
  const w = extractWorkFromResponse(wr);
  if (!w) return null;
  const n = normalizeWork(w);
  if (!n) return null;
  return {
    ...n,
    genres: normalizeGenres(w.genres),
    genre: Array.isArray(n.genres) ? n.genres.join(', ') : '',
    findAt: w.foundAt ? [{ label: 'External Link', url: w.foundAt }] : [],
  };
};

// Calculate rating distribution for histogram
const calcDistribution = (r) =>
  [5, 4, 3, 2, 1].map((s) => ({
    star: s, count: r.filter((x) => Math.round(Number(x.score) || 0) === s).length,
  }));

// Main Work Details Page Component
export default function WorkDetails() {
  useNavigationWithClearFilters();
  const navigate = useNavigate(), { user, isGuest } = useAuth(), { shelves } = useShelves(user?.userId);
  const { workId } = useParams(), isMountedRef = useRef(true), loggedUserId = user?.userId || null;

  // State: work data, ratings, recommendations, UI state
  const [work, setWork] = useState(null), [ratings, setRatings] = useState([]), [recommended, setRecommended] = useState([]);
  const [score, setScore] = useState(0), [hoverScore, setHoverScore] = useState(0), [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null), [messageType, setMessageType] = useState(null);
  const [ratingSubmittedMessage, setRatingSubmittedMessage] = useState(false),
    [showRecommendationToast, setShowRecommendationToast] = useState(false),
    [recommendationVersion, setRecommendationVersion] = useState(null);

  // Load work, ratings, and similar works data on mount
  const loadWorkData = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      setWork(null), setRatings([]), setRecommended([]), setScore(0), setLoading(true);
      const [wr, rr, sr] = await Promise.all([getWork(workId), getWorkRatings(workId), getSimilarWorks(workId)]);
      if (!isMountedRef.current) return;
      setWork(processWork(wr)), setRatings(extractRatingsFromResponse(rr));
      setRecommended(normalizeWorks(sr || []).slice(0, MAX_RECOMMENDATIONS));
    } catch (error) { logger.error('Error loading work details:', error); }
    finally { if (isMountedRef.current) setLoading(false); }
  }, [workId]);

  useEffect(() => { isMountedRef.current = true; loadWorkData(); return () => { isMountedRef.current = false; }; }, [loadWorkData]);
  useEffect(() => {
    if (!isGuest && loggedUserId)
      getUserRecommendations(loggedUserId).then((d) => { if (isMountedRef.current && d?.version) setRecommendationVersion(d.version); }).catch(() => {});
  }, [isGuest, loggedUserId]);
  useEffect(() => {
    if (!isGuest && ratings.length > 0 && loggedUserId) { const r = ratings.find((x) => x.userId === loggedUserId);
    if (r) setScore(Math.round(Number(r.score) || 0)); }
  }, [ratings, loggedUserId, isGuest]);

  // Handle rating submission with validation and recommendations check
  const submitRating = async (ov) => {
    if (isGuest) { navigate('/login', { state: { message: 'You must log in to rate this work.' } }); return; }
    try {
      setMessage(null);
      const ratingScore = typeof ov === 'number' ? ov : score;
      await postWorkRating(workId, { score: ratingScore, workId, userId: loggedUserId, ratedAt: new Date().toISOString() });
      const r = extractRatingsFromResponse(await getWorkRatings(workId));
      setRatings(r), setRatingSubmittedMessage(true), setTimeout(() => setRatingSubmittedMessage(false), RATING_TOAST_TIMEOUT);
      if (loggedUserId) {
        const rec = await getUserRecommendations(loggedUserId).catch(() => ({}));
        if (rec?.version) {
          if (recommendationVersion && rec.version !== recommendationVersion)
            setShowRecommendationToast(true);
            setRecommendationVersion(rec.version); }
      }
    } catch (e) { setMessage(e.response?.data?.message || e.message || 'Failed to submit rating'), setMessageType('error'); }
  };

  const bucketCounts = calcDistribution(ratings);
  const userRating = !isGuest ? ratings.find((r) => r.userId === loggedUserId) : null;
  const userRatingScore = userRating ? Math.round(Number(userRating.score) || 0) : null;
  if (loading) return <WorkDetailsSkeleton />;
  if (!work) return <p>Work not found.</p>;

  // Event handlers and render helpers
  const handleLink = (e, h) => {
    e.currentTarget.style.transform = h ? 'translateY(-2px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = h ? EXTERNAL_LINK_HOVER_SHADOW : EXTERNAL_LINK_DEFAULT_SHADOW;
  };
  const renderDist = (b) => {
    const pct = ratings.length ? Math.round((b.count / ratings.length) * 100) : 0;
    return (
      <div key={b.star} style={workDetailsStyles.distributionRow}>
        <div style={workDetailsStyles.distributionLabel}>{b.star}★</div>
        <div style={workDetailsStyles.distributionBar}><div style={{...workDetailsStyles.distributionFill, width: `${pct}%`}} /></div>
        <div style={workDetailsStyles.distributionCount}>{b.count}</div>
      </div>
    );
  };

  // Render: Left sidebar (work card) | Main (description) | Right (ratings)
  return (
    <div style={workDetailsStyles.pageContainer}>
      {message && <div style={{ ...workDetailsStyles.messageBox(messageType), marginBottom: 20 }}>{message}</div>}
      <div style={workDetailsStyles.gridLayout}>
        <aside style={workDetailsStyles.leftColumn}>
          <div style={{ marginLeft: -10 }}><WorkCard work={work} coverStyle={{ width: 180, height: 260 }} flat hideInfo /></div>
          <div style={{ marginTop: 12, width: 180 }}>
            {work?.findAt?.length > 0 ? (
              <div style={workDetailsStyles.linksContainer}>
            {work.findAt.map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noreferrer" style={workDetailsStyles.externalLink}
                onMouseEnter={(e) => handleLink(e, true)} onMouseLeave={(e) => handleLink(e, false)}>
                <span>🔗</span>
                <span>Find it Here{f.label && f.label !== 'External Link' ? `: ${f.label}` : ''}</span>
              </a>
            ))}
              </div>
            ) : <p>Available from online stores and libraries.</p>}
          </div>
        </aside>

        <main>
          <h1 style={workDetailsStyles.workTitle}>{work.title}</h1>
          <p style={workDetailsStyles.workMeta}>{work.creator} • {work.year}</p>
          <div style={workDetailsStyles.tagContainer}>
            {work.type && <span style={workDetailsStyles.typeTag}>{String(work.type)}</span>}
            {work.genres?.map((g, i) => <span key={i} style={workDetailsStyles.genreTag}>{g}</span>)}
          </div>
          {/* Description Section */}
          <section style={workDetailsStyles.descriptionSection}>
            <h3 style={workDetailsStyles.descriptionTitle}>Description</h3>
            {work.description ? <p style={workDetailsStyles.descriptionText}>{work.description}</p> :
             <p style={workDetailsStyles.descriptionPlaceholder}>No description available for this work yet.</p>}
          </section>
          {/* Recommendation Section */}
          <section style={workDetailsStyles.recommendationsSection}>
            <div style={{ display: 'inline-block', width: '100%' }}><h3 className="section-title">YOU MAY ALSO LIKE</h3></div>
            {recommended.length > 0 ? (
              <div style={workDetailsStyles.recommendationsDisplay}>
                {recommended.map((rw) => <div key={rw.workId} style={workDetailsStyles.recommendationCard}>
                  <Link to={`/works/${rw.workId}`} style={{ textDecoration: 'none' }}>
                  <WorkCard work={rw} flat hideInfo coverStyle={{ width: 140, height: 200 }} /></Link></div>)}
              </div>
            ) : <div style={workDetailsStyles.emptyRecommendations}><p>No similar works found for this item.</p></div>}
          </section>
        </main>
        {/* Right Part */}
        <aside style={workDetailsStyles.rightColumn}>
          {!isGuest && shelves.length > 0 && <div style={{ marginBottom: 24 }}><AddToShelfBtn workId={parseInt(workId)} userId={user?.userId} shelves={shelves} onSuccess={() => {}} /></div>}
          <div style={{ display: 'inline-block', marginBottom: 16 }}><h3 className="section-title">RATINGS</h3></div>
          <div style={workDetailsStyles.ratingContainer}>
            {ratingSubmittedMessage && <div style={workDetailsStyles.successMessage}>✓ Rating saved!</div>}
            <div style={workDetailsStyles.ratingHeader}><h4 style={workDetailsStyles.ratingTitle}>Your rating</h4>{userRatingScore && <div style={workDetailsStyles.ratingBadge}><span>✓ Rated</span></div>}</div>
            <div style={{ ...workDetailsStyles.starContainer, opacity: userRatingScore ? 1 : 0.5 }}>
              {[1, 2, 3, 4, 5].map((i) => { const filled = i <= (hoverScore || Math.round(score));
                return <button key={i} type="button" disabled={isGuest} onClick={() => { setScore(i); submitRating(i); }}
                                onMouseEnter={() => setHoverScore(i)} onMouseLeave={() => setHoverScore(0)} aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                                style={workDetailsStyles.star(isGuest, filled)}>{filled ? '★' : '☆'}</button>; })}
            </div>
          </div>
          <div style={workDetailsStyles.distributionContainer}>
            <h4 style={workDetailsStyles.distributionTitle}>Rating Distribution</h4>
            {ratings.length === 0 ? <p style={workDetailsStyles.distributionEmpty}>No ratings yet.</p> : <div style={workDetailsStyles.distributionRows}>{bucketCounts.map(renderDist)}
              <div style={workDetailsStyles.distributionTotal}>{ratings.length} total rating{ratings.length !== 1 ? 's' : ''}</div></div>}
          </div>
        </aside>
      </div>
      {showRecommendationToast && <Toast message="You have new recommendations!" onClose={() => setShowRecommendationToast(false)} link="/recommendations" />}
    </div>
  );
}
