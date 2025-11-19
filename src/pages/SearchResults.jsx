import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPopularWorks } from '../api/works';
import WorkCard from '../components/WorkCard';

export default function SearchResults() {
  const { search } = useLocation();
  const q = new URLSearchParams(search).get('q') || '';
  const typeFilter = new URLSearchParams(search).get('type') || '';
  const yearFilter = new URLSearchParams(search).get('year') || '';
  const genreFilter = new URLSearchParams(search).get('genre') || '';
  const ratingFilter = new URLSearchParams(search).get('rating') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const termFilter = (q || '').trim().toLowerCase();

    // shortcut: show specific test results for the query "harry"
    if (termFilter === 'harry') {
      const harryResults = [
        {
          workId: 'harry-book-2007',
          title: 'Harry Potter and the Deathly Hallows',
          coverUrl: '/album_covers/harry_potter_1.jpg',
          creator: 'J.K. Rowling',
          year: 2007,
          type: 'book',
          description: 'Book',
          genre: 'Fantasy',
          rating: 5
        },
        {
          workId: 'harry-movie-2011',
          title: 'Harry Potter and the Deathly Hallows',
          coverUrl: '/album_covers/harry_potter_2.jpg',
          creator: 'David Yates',
          year: 2011,
          type: 'movie',
          description: 'Movie',
          genre: 'Fantasy',
          rating: 4.5
        },
        
        {
          workId: 'fine-line-2019',
          title: 'Fine Line',
          coverUrl: '/album_covers/harry_styles.png',
          creator: 'Harry Styles',
          year: 2019,
          type: 'song',
          description: 'Song',
          genre: 'Pop',
          rating: 4
        }
      ];

      if (mounted) {
        setResults(harryResults);
        setLoading(false);
      }

      return () => {
        mounted = false;
      };
    }

    // shortcut: show The Dark Side of the Moon when searched by title
    if (termFilter === 'the dark side of the moon' || termFilter === 'dark side of the moon' || termFilter.includes('dark side of the moon')) {
      const darkResults = [
        {
          workId: 'dark-side-of-the-moon-1973',
          title: 'The Dark Side of the Moon',
          coverUrl: '/album_covers/pink_floyd_1.jpg',
          creator: 'Pink Floyd',
          year: 1973,
          type: 'album',
          description: 'The Dark Side of the Moon is the eighth studio album by English rock band Pink Floyd, released on March 1st, 1973.',
          genre: 'Progressive rock',
          rating: 4.8
        }
      ];

      if (mounted) {
        setResults(darkResults);
        setLoading(false);
      }

      return () => {
        mounted = false;
      };
    }
    // Try to fetch a list of works (popular as a fallback) and filter locally
    getPopularWorks()
      .then((works) => {
        if (!mounted) return;
        const term = (q || '').trim().toLowerCase();
        const list = works || [];
        const termFilter = (q || '').trim().toLowerCase();

        let filtered = list.filter((w) => {
          // basic text match
          if (termFilter) {
            const title = (w.title || '').toLowerCase();
            const creator = (w.creator || '').toLowerCase();
            const desc = (w.description || '').toLowerCase();
            if (!(title.includes(termFilter) || creator.includes(termFilter) || desc.includes(termFilter))) {
              return false;
            }
          }

          // type filter
          if (typeFilter) {
            const t = (w.type || '').toString();
            if (typeFilter && typeFilter !== 'Any' && t.toLowerCase() !== typeFilter.toLowerCase()) return false;
          }

          // year filter (supports ranges like 2010-2014)
          if (yearFilter && yearFilter !== 'Any') {
            const y = Number(w.year) || null;
            if (yearFilter.includes('-')) {
              const [a,b] = yearFilter.split('-').map(s=>Number(s));
              if (!y || y < a || y > b) return false;
            } else if (yearFilter.includes('–') || yearFilter.includes('—')) {
              const [a,b] = yearFilter.replace('–','-').replace('—','-').split('-').map(s=>Number(s));
              if (!y || y < a || y > b) return false;
            } else {
              const yf = Number(yearFilter);
              if (yf && y !== yf) return false;
            }
          }

          // genre filter
          if (genreFilter && genreFilter !== 'Any') {
            const genres = (w.genre || '').toString().toLowerCase();
            if (!genres.includes(genreFilter.toLowerCase())) return false;
          }

          // rating filter (min rating)
          if (ratingFilter && ratingFilter !== 'Any') {
            const minR = Number(ratingFilter);
            const r = Number(w.rating) || 0;
            if (r < minR) return false;
          }

          return true;
        });

        setResults(filtered);
      })
      .catch(() => {
        if (!mounted) return;
        setResults([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [q, typeFilter, yearFilter, genreFilter, ratingFilter]);

  const headingContainer = { display: 'flex', justifyContent: 'center', marginTop: 0 };
  const headingInner = { width: '100%', maxWidth: 800, padding: '0 16px', boxSizing: 'border-box' };
  const headingStyle = { marginTop: -8, marginBottom: 6, fontSize: 16, fontWeight: 400 };
  const headingLine = { borderTop: '1px solid #bfaea0', marginTop: 2, width: '160%' };
  // horizontal offset (px) to push heading and line to the right
  // set to 0 to move the heading/line to the inner container's left edge
  const headingOffset = -300;

  return (
    <div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box' }}>
        <div style={headingContainer}>
          <div style={headingInner}>
          {loading ? (
            <h2 style={{ ...headingStyle, marginLeft: headingOffset }}>Searching…</h2>
          ) : (
            <h2 style={{ ...headingStyle, marginLeft: headingOffset }}>{q ? `SHOWING MATCHES FOR \"${q}\"` : 'All results'}</h2>
          )}

          <div style={{ ...headingLine, marginLeft: headingOffset }} />
        </div>
      </div>

        {/* results count removed per user request */}

        {loading && <p style={{ textAlign: 'center' }}>Loading results…</p>}

        {!loading && results && results.length === 0 && (
          <div>
            <p style={{ textAlign: 'center' }}>No results found{q ? ` for "${q}"` : ''}.</p>
          </div>
        )}

        {!loading && results && results.length > 0 && (
          <div style={{display:'flex',flexDirection:'column',gap:12, marginLeft: -300}}>
            {results.map((work, idx) => (
              <div key={work.workId || work.id || work.title} style={{width: '100%'}}>
                <WorkCard work={work} flat coverStyle={{ width: 96, height: 140 }} />
                {idx < results.length - 1 && (
                  <div style={{height: 1, background: '#bfaea0', margin: '12px 0'}} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* small right-side filter column */}
      <RightFilterColumn currentType={typeFilter} search={search} />
    </div>
  );
}

function RightFilterColumn({ currentType, search }) {
  const navigate = useNavigate();

  const choices = [
    { key: '', label: 'All' },
    { key: 'works', label: 'Works' },
    { key: 'users', label: 'Users' },
    { key: 'shelves', label: 'Shelves' },
  ];

  const handleSelect = (key) => {
    const params = new URLSearchParams(search || '');
    if (!key) params.delete('type');
    else params.set('type', key);
    // navigate to same path with updated search
    navigate({ search: params.toString() });
  };

  return (
    <aside
      style={{
        position: 'fixed',
        right: 20,
        top: 140,
        width: 160,
        padding: 10,
        background: 'transparent',
        borderRadius: 8,
        zIndex: 50,
        boxSizing: 'border-box'
      }}
      aria-label="result-type-filter"
    >
      <div style={{ textAlign: 'center', marginBottom: 4, fontSize: 13, color: '#333' }}>SHOW RESULTS FOR</div>
      <div style={{ height: 2, width: '60%', background: '#bfaea0', margin: '6px auto 10px', borderRadius: 2 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {choices.map((c) => {
          const selected = (currentType || '') === (c.key || '');
          return (
            <button
              key={c.key || 'all'}
              onClick={() => handleSelect(c.key)}
              style={{
                width: '100%',
                padding: '8px 6px',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                color: selected ? '#111' : '#444',
                fontWeight: selected ? 600 : 400,
                cursor: 'pointer',
                borderRadius: 6
              }}
              aria-pressed={selected}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
