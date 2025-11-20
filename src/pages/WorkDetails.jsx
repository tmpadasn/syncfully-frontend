import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWork, getWorkRatings, postWorkRating, getSimilarWorks } from '../api/works';
import WorkCard from '../components/WorkCard';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';

// Helper functions for data processing
const processWorkData = (workResponse) => {
  if (!workResponse) return null;
  
  // Extract data from backend response format
  let workData = workResponse.data || workResponse;
  
  // Normalize work structure
  let work;
  if (workData.works && workData.works[0]) {
    work = workData.works[0];
  } else if (workData.work) {
    work = workData.work;
  } else {
    work = workData;
  }
  
  if (!work) return null;
  
  // Map to frontend format
  return {
    ...work,
    workId: work.id || work.workId,
    genres: work.genres || [],
    genre: Array.isArray(work.genres) ? work.genres.join(', ') : work.genre,
    coverUrl: work.coverUrl || '/album_covers/default.jpg',
    findAt: work.foundAt ? [{ 
      label: 'External Link', 
      url: work.foundAt 
    }] : []
  };
};

const processRatingsData = (ratingsResponse) => {
  if (!ratingsResponse) return [];
  
  const ratingsData = ratingsResponse.data || ratingsResponse;
  return ratingsData?.ratings || ratingsData || [];
};

const processSimilarWorksData = (similarWorksResponse) => {
  if (!similarWorksResponse || !Array.isArray(similarWorksResponse)) return [];
  
  return similarWorksResponse
    .map(work => ({
      workId: work.id || work.workId,
      title: work.title,
      coverUrl: work.coverUrl || '/album_covers/default.jpg',
      type: work.type,
      creator: work.creator
    }))
    .filter(work => work.workId && work.title);
};

export default function WorkDetails(){
  // Auto-clear search parameters if they exist on non-search pages
  useNavigationWithClearFilters();
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [score, setScore] = useState(4);
  const [hoverScore, setHoverScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(()=>{
    setLoading(true);

    // Fetch all data from backend
    Promise.all([
      getWork(workId), 
      getWorkRatings(workId), 
      getSimilarWorks(workId)
    ])
      .then(([workResponse, ratingsResponse, similarWorksResponse])=>{
        // Process work data
        const processedWork = processWorkData(workResponse);
        setWork(processedWork);
        
        // Process ratings data
        const processedRatings = processRatingsData(ratingsResponse);
        setRatings(processedRatings);
        
        // Extract comments from ratings
        const comments = processedRatings
          .filter(rating => rating.comment)
          .map((rating, index) => ({ 
            id: `r-${index}`, 
            userId: rating.userId, 
            body: rating.comment, 
            at: rating.ratedAt || rating.createdAt 
          }));
        setComments(comments);
        
        // Process similar works data
        const processedSimilarWorks = processSimilarWorksData(similarWorksResponse);
        setSimilar(processedSimilarWorks);
        
        // Set recommended works (limit to 5 items for display)
        const recommendedWorks = processedSimilarWorks.slice(0, 5);
        setRecommended(recommendedWorks);
        
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[workId]);

  const submitRating = async (overrideScore) => {
    const sendScore = typeof overrideScore === 'number' ? overrideScore : score;
    try{
      await postWorkRating(workId, { 
        score: sendScore, 
        workId, 
        userId: Number(process.env.REACT_APP_DEFAULT_USER_ID || 1), 
        ratedAt: new Date().toISOString() 
      });
      
      // Refresh ratings after submission
      const r = await getWorkRatings(workId);
      setRatings(r.ratings || []);
      alert('Rating submitted');
    }catch(e){
      console.error('Failed to submit rating:', e);
      alert('Failed to submit rating');
    }
  };

  const addToShelf = () => {
    const shelf = JSON.parse(localStorage.getItem('shelves') || '[]');
    shelf.push({ workId: work.workId, title: work.title });
    localStorage.setItem('shelves', JSON.stringify(shelf));
    alert('Added to shelf');
  };

  const submitComment = () => {
    if(!newComment.trim()) return;
    const c = { id: `c-${Date.now()}`, userId: Number(process.env.REACT_APP_DEFAULT_USER_ID || 1), body: newComment.trim(), at: new Date().toISOString() };
    setComments(prev=>[c, ...prev]);
    setNewComment('');
  };

  // compute rating distribution (buckets 5->1)
  const totalRatings = ratings.length;
  const bucketCounts = [5,4,3,2,1].map(star => ({ star, count: ratings.filter(r => Math.round(Number(r.score) || 0) === star).length }));

  if(loading) return <p>Loading work...</p>;
  if(!work) return <p>Work not found.</p>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 24, alignItems: 'start' }}>
          <aside style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ marginLeft: -10 }}>
              <WorkCard work={work} coverStyle={{ width: 180, height: 260 }} flat hideInfo />
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'inline-block' }}>
                <h3 className="section-title">WHERE TO FIND</h3>
              </div>
              {work && work.findAt && work.findAt.length ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                  {work.findAt.map((f, i)=> {
                    const lab = (f.label || '').toLowerCase();
                    return (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        <a href={f.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {lab.includes('spotify') && (
                            <svg width="18" height="18" viewBox="0 0 168 168" aria-hidden focusable="false">
                              <circle cx="84" cy="84" r="84" fill="#1DB954" />
                              <path d="M121.6 119.2c-1.9 2.9-5.9 3.9-8.8 2-24.1-15-54.4-18.4-90.1-9.8-3.3.8-6.6-1.1-7.4-4.4-.8-3.3 1.1-6.6 4.4-7.4 39.8-9.7 73.8-6 101.2 11.5 2.9 1.9 3.9 5.9 2 8.8z" fill="#fff" opacity="0.9" />
                              <path d="M129.4 92.3c-2.4 3.7-7.7 4.9-11.4 2.5-27-17.6-68.3-22.8-100.1-12.2-4 .9-8.1-1.4-9-5.4- .9-4 1.4-8.1 5.4-9C50.1 67 97.2 72.8 132.8 92.5c3.7 2.4 4.9 7.7 2.5 11.4z" fill="#fff" opacity="0.9" />
                              <path d="M131.6 73.1C100 53 46.6 55 29.6 58c-4.4.7-8.6-2.3-9.3-6.7-.7-4.4 2.3-8.6 6.7-9.3 20.8-3.3 82.8-5 119 19.4 3.6 2.4 4.7 7 2.3 10.6-2.4 3.6-7 4.7-10.7 2.1z" fill="#fff" opacity="0.9" />
                            </svg>
                          )}
                          {lab.includes('youtube') && (
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
                              <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-1-1.7-1-2.1-1.1C16.6 2.4 12 2.4 12 2.4h-.1s-4.6 0-8.6.4c-.4 0-1.3.1-2.1 1.1C.6 4.6.4 6.2.4 6.2S0 8.1 0 10v.1c0 1.9.4 3.8.4 3.8s.2 1.6.8 2.3c.8 1 1.9 1 2.4 1.1 1.8.2 7.8.4 7.8.4s4.6 0 8.6-.4c.4 0 1.3-.1 2.1-1.1.6-.7.8-2.3.8-2.3s.4-1.9.4-3.8v-.1c0-1.9-.4-3.8-.4-3.8z" fill="#FF0000" />
                              <path d="M9.5 15.5l6-3.5-6-3.5v7z" fill="#fff" />
                            </svg>
                          )}
                          <span style={{ color: '#111', textDecoration: 'none' }}>{f.label || f.url}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Available from online stores and libraries.</p>
              )}
            </div>
            
          </aside>

          <main>
            <h1 style={{ marginTop: 0 }}>{work.title}</h1>
            <p style={{ color: '#666' }}>{work.creator} • {work.year}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {work.type && (
                <span style={{ padding: '6px 10px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: '#0b6623', color: '#fff' }}>{String(work.type).toUpperCase()}</span>
              )}
              {work.genre && (
                <span style={{ padding: '6px 10px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: '#0b6623', color: '#fff' }}>{String(work.genre).toUpperCase()}</span>
              )}
            </div>

            <section style={{ marginTop: 20 }}>
              <h3>COMMENTS</h3>
              <div style={{ marginBottom: 8 }}>
                <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} rows={2} style={{ width: '100%', height: 64, fontSize: 15, padding: 8, boxSizing: 'border-box', resize: 'vertical' }} />
                <div style={{ textAlign: 'right', marginTop: 6 }}>
                  <button onClick={submitComment}>Add comment</button>
                </div>
              </div>

              {comments.length===0 ? <p>No comments yet.</p> : (
                <div>
                  {comments.map(c=> (
                    <div key={c.id} style={{ padding: '10px 0' }}>
                      <div style={{ fontSize: 13, color: '#666' }}>User {c.userId} • {new Date(c.at).toLocaleString()}</div>
                      <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.4 }}>{c.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={{ marginTop: 24 }}>
              <div style={{ display: 'inline-block', width: '100%', overflow: 'visible' }}>
                <h3 className="section-title">YOU MAY ALSO LIKE</h3>               
              </div>
              
              {recommended.length > 0 ? (
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, marginTop: 12 }}>
                  {recommended.map(work => (
                    <div key={work.workId} style={{ minWidth: 140 }}>
                      <Link to={`/works/${work.workId}`} style={{ textDecoration: 'none' }}>
                        <WorkCard work={work} flat hideInfo coverStyle={{ width: 140, height: 200 }} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 12, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                  <p>No similar works found for this item.</p>
                </div>
              )}
            </section>
          </main>

          <aside style={{ borderLeft: '1px solid #eee', paddingLeft: 16, minWidth: 240, maxWidth: 280 }}>
            <div style={{ display: 'inline-block', marginBottom: 16 }}>
              <h3 className="section-title">RATINGS</h3>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600 }}>Your rating</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map((i)=>{
                  const filled = i <= (hoverScore || Math.round(score));
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={()=>{ setScore(i); submitRating(i); }}
                      onMouseEnter={()=>setHoverScore(i)}
                      onMouseLeave={()=>setHoverScore(0)}
                      aria-label={`Rate ${i} star${i>1?'s':''}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        margin: 0,
                        cursor: 'pointer',
                        fontSize: 24,
                        lineHeight: 1,
                        color: filled ? '#f5b301' : '#ccc',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {filled ? '★' : '☆'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600 }}>Rating Distribution</h4>
              {totalRatings === 0 ? (
                <p style={{ fontSize: 13, color: '#666', margin: 0 }}>No ratings yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bucketCounts.map(b => {
                    const pct = totalRatings ? Math.round((b.count / totalRatings) * 100) : 0;
                    return (
                      <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, textAlign: 'right', fontSize: 12, fontWeight: 500 }}>
                          {b.star}★
                        </div>
                        <div style={{ 
                          flex: 1, 
                          background: '#eee', 
                          height: 8, 
                          borderRadius: 4, 
                          overflow: 'hidden',
                          minWidth: 100
                        }}>
                          <div style={{ 
                            width: `${pct}%`, 
                            height: '100%', 
                            background: '#bfaea0',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ 
                    fontSize: 11, 
                    color: '#666', 
                    marginTop: 4,
                    textAlign: 'center'
                  }}>
                    {totalRatings} total rating{totalRatings !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <button
                onClick={addToShelf}
                style={{
                  background: '#0b6623',
                  color: '#fff',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d7225';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0b6623';
                }}
              >
                Add to Shelf
              </button>
            </div>
          </aside>
        </div>
    </div>
  );
}
