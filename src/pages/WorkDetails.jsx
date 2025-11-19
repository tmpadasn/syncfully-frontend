import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWork, getWorkRatings, postWorkRating, getSimilarWorks, getPopularWorks } from '../api/works';
import WorkCard from '../components/WorkCard';

// small popular list reused from Home for "also like" row
const mockPopular = [
  {
    workId: 3000,
    title: 'I am Music',
    rating: 4.8,
    coverUrl: '/album_covers/i_am_music.jpg',
  },
  {
    workId: 3001,
    title: 'Kendrick Lamar',
    rating: 4.3,
    coverUrl: '/album_covers/kendrick_lamar.png',
  },
  {
    workId: 3002,
    title: 'Snowwhite',
    rating: 4.5,
    coverUrl: '/album_covers/snow_white.jpg',
  },
  {
    workId: 3003,
    title: 'Anora',
    rating: 3.5,
    coverUrl: '/album_covers/anora.jpg',
  },
  {
    workId: 3004,
    title: 'Crime and Punishment',
    rating: 4.0,
    coverUrl: '/album_covers/crime_and_punishment.jpg',
  }
];

export default function WorkDetails(){
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
    // helper to fill recommended list to exactly 5 items (similar first, then popular fallback)
    const fillRecommended = async (simList, currentId) => {
      const normalized = (simList || []).map(s => ({
        workId: s.workId || s.id || s.title,
        title: s.title,
        coverUrl: s.coverUrl || s.image || s.cover || ''
      }));

      // keep order and unique by workId
      const seen = new Set();
      const out = [];
      for (const it of normalized) {
        if (!it || !it.workId) continue;
        const id = String(it.workId);
        if (id === String(currentId)) continue;
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(it);
        if (out.length >= 5) break;
      }

      // if we still need items, fetch popular works as fallback
      if (out.length < 5) {
        try {
          const popular = await getPopularWorks();
          const list = popular || [];
          for (const p of list) {
            const id = String(p.workId || p.id || p.title || '');
            if (!id || seen.has(id) || id === String(currentId)) continue;
            seen.add(id);
            out.push({ workId: id, title: p.title, coverUrl: p.coverUrl || p.image || p.cover || '' });
            if (out.length >= 5) break;
          }
        } catch (e) {
          // ignore fallback failure
        }
      }

      setRecommended(out.slice(0,5));
    };

    // special-case for The Dark Side of the Moon (local demo data)
    if (workId && workId.toLowerCase().includes('dark')) {
      const special = {
        workId: workId,
        title: 'The Dark Side of the Moon',
        creator: 'Pink Floyd',
        year: 1973,
        type: 'album',
        description: 'The Dark Side of the Moon is the eighth studio album by English rock band Pink Floyd, released on March 1st, 1973.',
        genre: 'Progressive rock',
        rating: 4.8,
        coverUrl: '/album_covers/pink_floyd_1.jpg',
        findAt: [
          { label: 'Spotify', url: 'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv' },
          { label: 'YouTube', url: 'https://www.youtube.com/results?search_query=the+dark+side+of+the+moon+pink+floyd' }
        ]
      };
      setWork(special);
      setRatings([{ userId: 2, score: 5, ratedAt: new Date().toISOString() }, { userId: 3, score: 4.5, ratedAt: new Date().toISOString() }]);
      setComments([{ id: 'c-s1', userId: 2, body: 'A masterpiece.', at: new Date().toISOString() }]);
      setSimilar([]);
      // fill recommended for demo too
      fillRecommended([], workId);
      setLoading(false);
      return;
    }

    Promise.all([getWork(workId), getWorkRatings(workId), getSimilarWorks(workId)])
      .then(([w, r, s])=>{
        const theWork = (w && w.works && w.works[0]) ? w.works[0] : w;
        setWork(theWork);
        const rlist = r.ratings || [];
        setRatings(rlist);
        // seed comments from any rating.comment fields, otherwise empty
        setComments(rlist.filter(x=>x.comment).map((c,i)=>({ id: `r-${i}`, userId: c.userId, body: c.comment, at: c.ratedAt })));
        const sims = (s && s.works) ? s.works : (s && s.length ? s : (s && s.items ? s.items : []));
        setSimilar(sims);
        // compute recommended (similar first, then popular fallback)
        fillRecommended(sims, workId);
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[workId]);

  const submitRating = async (overrideScore) => {
    const sendScore = typeof overrideScore === 'number' ? overrideScore : score;
    try{
      // local fallback for demo items (no backend)
      if (workId && workId.toLowerCase().includes('dark')) {
        const r = { userId: Number(process.env.REACT_APP_DEFAULT_USER_ID || 1), score: sendScore, ratedAt: new Date().toISOString() };
        setRatings(prev => [r, ...prev]);
        alert('Rating submitted (local)');
        return;
      }

      await postWorkRating(workId, { score: sendScore, workId, userId: Number(process.env.REACT_APP_DEFAULT_USER_ID || 1), ratedAt: new Date().toISOString() });
      const r = await getWorkRatings(workId);
      setRatings(r.ratings || []);
      alert('Rating submitted');
    }catch(e){
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
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 20 }}>
          <aside style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ marginLeft: -10 }}>
              <WorkCard work={work} coverStyle={{ width: 180, height: 260 }} flat hideInfo />
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'inline-block' }}>
                <h4 style={{ margin: 0, display: 'inline-block' }}>WHERE TO FIND</h4>
                <div style={{ height: 2, background: '#bfaea0', marginTop: 6, borderRadius: 2 }} />
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
            <p>{work.description}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {work.type && (
                <span style={{ padding: '6px 10px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: '#0b6623', color: '#fff' }}>{String(work.type).toUpperCase()}</span>
              )}
              {work.genre && (
                <span style={{ padding: '6px 10px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: '#0b6623', color: '#fff' }}>{String(work.genre).toUpperCase()}</span>
              )}
            </div>

            {/* <section>
              <h3>Characteristics</h3>
              <ul>
                <li><strong>Genre:</strong> {work.genre || '—'}</li>
                <li><strong>Type:</strong> {work.type || '—'}</li>
                <li><strong>Year:</strong> {work.year || '—'}</li>
                <li><strong>Rating:</strong> {work.rating ?? '—'}</li>
              </ul>
            </section> */}

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
                <h3 style={{ fontWeight: 400, margin: 0 }}>YOU MAY ALSO LIKE</h3>
                <div style={{ height: 2, background: '#bfaea0', marginTop: 6, borderRadius: 2, width: '140%', marginLeft: '-20%' }} />
              </div>
              {recommended && recommended.length > 0 && (
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                  {recommended.slice(0,5).map(s => (
                    <div key={s.workId || s.id || s.title} style={{ minWidth: 140 }}>
                      <Link to={`/works/${s.workId}`} style={{ textDecoration: 'none' }}>
                        <WorkCard work={s} flat hideInfo coverStyle={{ width: 140, height: 200 }} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {/* Also show a compact popular-albums row (like Home) */}
              <div style={{ marginTop: 12 }}>
                <div className="works-grid" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                  {mockPopular.map(w => (
                    <Link key={`pop-${w.workId}`} to={`/works/${w.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ minWidth: 120 }}>
                        <div style={{ width: 120, height: 170, overflow: 'hidden', borderRadius: 6 }}>
                          <img src={w.coverUrl} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <aside style={{ borderLeft: '1px solid #eee', paddingLeft: 12 }}>
            <div style={{ display: 'inline-block' }}>
              <h3 style={{ margin: 0, display: 'inline-block' }}>RATE</h3>
              <div style={{ height: 2, background: '#bfaea0', marginTop: 6, borderRadius: 2 }} />
            </div>

            <div style={{ marginTop: 8 }}>
              <h4 style={{ margin: '6px 0' }}>Your rating</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div>
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
                          padding: 0,
                          margin: 0,
                          cursor: 'pointer',
                          fontSize: 28,
                          lineHeight: 1,
                          color: filled ? '#f5b301' : '#ccc'
                        }}
                      >
                        {filled ? '★' : '☆'}
                      </button>
                    );
                  })}
                </div>

                {/* Add to Shelf moved below the ratings diagram */}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              {totalRatings === 0 ? (
                <p>No ratings yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 200 }}>
                  {bucketCounts.map(b => {
                    const pct = totalRatings ? Math.round((b.count / totalRatings) * 100) : 0;
                    return (
                      <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 36, textAlign: 'right', fontSize: 13 }}>{b.star}★</div>
                        <div style={{ flex: 1, background: '#eee', height: 10, borderRadius: 6, overflow: 'hidden' }} aria-hidden>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#bfaea0' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={addToShelf}
                    style={{
                      background: '#0b6623',
                      color: '#fff',
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer'
                    }}
                  >
                    Add to Shelf
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
    </div>
  );
}
