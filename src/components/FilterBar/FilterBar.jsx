/* FilterBar: derives client-side filter controls from backend catalogue and exposes keyboard-friendly dropdowns. */
/* Synchronizes filter state into URL params to preserve navigation and shareability. */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './FilterBarStyles.jsx';
import MenuControl from './MenuControl';
import { getAllWorks } from '../../api/works';
import logger from '../../utils/logger';

// Component-level contract: the browser URL (query string) is the
// authoritative representation of filter state. This component keeps
// UI controls and URL parameters synchronized to enable sharing and
// stable navigation behavior.
export default function FilterBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [filterOptions, setFilterOptions] = useState({
    types: [],
    years: [],
    genres: [],
    genresByType: {},
    ratings: ['5','4','3','2','1']
  });
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  // On mount, fetch catalogue data and derive control options
  // (types, genre mapping, year range). Deriving options client-side
  // from the backend ensures the UI stays consistent with server data
  // without duplicated hard-coded lists.
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const worksData = await getAllWorks();
        const works = worksData?.works || worksData?.data || [];

        if (works.length > 0) {
          const types = [...new Set(works.map(w => w.type).filter(Boolean))].sort();

          const currentYear = new Date().getFullYear();
          const years = [];
          for (let year = currentYear; year >= 1850; year--) years.push(String(year));

          const genresByType = {};
          const genresSet = new Set();

          works.forEach(work => {
            const workType = work.type;
            let workGenres = [];
            if (Array.isArray(work.genres)) workGenres = work.genres;
            else if (work.genre) workGenres = work.genre.split(/[,;]/).map(g => g.trim());

            workGenres.forEach(genre => {
              if (genre) {
                genresSet.add(genre);
                if (!genresByType[genre]) genresByType[genre] = workType;
              }
            });
          });

          const genres = Array.from(genresSet).sort();

          setFilterOptions({ types, years, genres, genresByType, ratings: ['5','4','3','2','1'] });
        } else {
          logger.warn('⚠️ FilterBar: No works found in backend, using empty arrays');
          setFilterOptions({ types: [], years: [], genres: [], genresByType: {}, ratings: ['5','4','3','2','1'] });
        }
      } catch (err) {
        logger.error('❌ FilterBar: Failed to load filter options from backend:', err);
        setFilterOptions({ types: [], years: [], genres: [], genresByType: {}, ratings: ['5','4','3','2','1'] });
      } finally {
        setOptionsLoaded(true);
      }
    };

    loadFilterOptions();
  }, []);

  // Update a single URL parameter and perform an in-place navigation.
  // Using `replace: true` updates the address bar without creating
  // an additional history entry, preserving sensible back/forward UX.
  function updateParam(key, value) {
    if (!value) params.delete(key); else params.set(key, value);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }

  // Render strategy: while options are loading show a compact loading
  // affordance; once derived, render four `MenuControl` dropdowns that
  // encapsulate keyboard navigation and selection semantics. The
  // controls push updates back into the canonical URL state.
  return (
    <div style={styles.outer}>
      <div style={styles.bar}>
        {!optionsLoaded ? (
          <div style={{ ...styles.container, justifyContent: 'center', ...styles.loading }}>Loading filters...</div>
        ) : (
          <div style={styles.container}>
            <div style={styles.filterItem}>
              <MenuControl
                label="TYPE"
                currentValue={params.get('type') || ''}
                options={[{ label: 'ALL', value: '' }, { label: 'USERS', value: 'user' }, ...filterOptions.types.map(t => ({ label: t === 'book' ? 'BOOKS' : t === 'movie' ? 'MOVIES' : t.toUpperCase(), value: t }))]}
                onSelect={v => updateParam('type', v)}
                disabled={!optionsLoaded}
              />
            </div>

            <div style={styles.filterItem}>
              <MenuControl
                label="YEAR"
                currentValue={params.get('year') || ''}
                options={[{ label: 'ALL', value: '' }, ...filterOptions.years.map(y => ({ label: `${y}+`, value: y }))]}
                onSelect={v => updateParam('year', v)}
                disabled={!optionsLoaded}
              />
            </div>

            <div style={styles.filterItem}>
              <MenuControl
                label="GENRE"
                currentValue={params.get('genre') || ''}
                options={[{ label: 'ALL', value: '' }, ...filterOptions.genres.map(g => ({ label: g.toUpperCase(), value: g, type: filterOptions.genresByType[g] }))]}
                onSelect={v => updateParam('genre', v)}
                disabled={!optionsLoaded}
                showIcons={true}
              />
            </div>

            <div style={styles.filterItem}>
              <MenuControl
                label="RATING"
                currentValue={params.get('rating') || ''}
                options={[{ label: 'ALL', value: '' }, ...filterOptions.ratings.map(r => ({ label: `${r}★+`.toUpperCase(), value: r }))]}
                onSelect={v => updateParam('rating', v)}
                disabled={!optionsLoaded}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
