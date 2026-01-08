import { useEffect, useState } from 'react';
import { getAllWorks } from '../../api/works';
import logger from '../../utils/logger';

/*
  useFilterOptions
  ----------------
  A small, focused hook that performs impure I/O (network fetch)
  and transforms the raw catalogue into deterministic option sets.

  Rationale (brief): isolating side-effects improves testability and
  keeps the presentational component (`FilterBar`) purely concerned
  with rendering and URL synchronization.
*/
const RATINGS = ['5','4','3','2','1'];

export function useFilterOptions() {
  const [filterOptions, setFilterOptions] = useState({ types: [], years: [], genres: [], genresByType: {}, ratings: RATINGS });
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const worksData = await getAllWorks();
        const works = worksData?.works || worksData?.data || [];

        if (works.length > 0) {
          const types = [...new Set(works.map(w => w.type).filter(Boolean))].sort();

          // Derive a descending year range (current -> 1850) deterministically
          // so that the UI remains stable across client sessions.
          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: currentYear - 1849 }, (_, i) => String(currentYear - i));

          // Build a set of unique genres and a lightweight mapping from
          // genre -> representative type. The mapping is intentionally
          // simple: it records the first-seen type for a genre to allow
          // grouping in the UI without forging strict type relationships.
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

          setFilterOptions({ types, years, genres, genresByType, ratings: RATINGS });
        } else {
          logger.warn('⚠️ FilterBar: No works found in backend, using empty arrays');
          setFilterOptions({ types: [], years: [], genres: [], genresByType: {}, ratings: RATINGS });
        }
      } catch (err) {
        logger.error('❌ FilterBar: Failed to load filter options from backend:', err);
        setFilterOptions({ types: [], years: [], genres: [], genresByType: {}, ratings: RATINGS });
      } finally {
        setOptionsLoaded(true);
      }
    }

    loadFilterOptions();
  }, []);

  return { filterOptions, optionsLoaded };
}
