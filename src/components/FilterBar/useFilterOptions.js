import { useEffect, useState } from 'react';
import { getAllWorks } from '../../api/works';
import logger from '../../utils/logger';

const RATINGS = ['5','4','3','2','1'];

// Hook: encapsulates fetching catalogue data and deriving filter options.
// This keeps `FilterBar` focused on rendering and URL sync.
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

          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: currentYear - 1849 }, (_, i) => String(currentYear - i));

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
