import { DEFAULT_AVATAR_URL } from '../config/constants';

// Helper to extract ID from objects with various ID field names
const id = (obj) => obj?.id || obj?.workId || obj?._id || obj?.entityId;

// Normalize a single work object, handles various API response formats
export const normalizeWork = (work) => {
  if (!work || !id(work)) return null;
  return {
    workId: id(work),
    title: work.title || work.name || 'Untitled Work',
    creator: work.creator || work.author || work.artist || 'Unknown Creator',
    coverUrl: work.coverUrl || work.cover || '/album_covers/default.jpg',
    type: work.type || work.workType || work.category || 'unknown',
    rating: Number(work.averageRating || work.rating || work.avgRating || work.score || 0),
    year: work.year || work.releaseYear || work.publishedYear || null,
    genres: normalizeGenres(work.genres || work.genre),
    description: work.description || '',
    foundAt: work.foundAt || work.externalLink || null,
  };
};

export const normalizeWorks = (works) =>
  Array.isArray(works) ? works.map(normalizeWork).filter(Boolean) : [];

export const normalizeWorkWithMeta = (work) => {
  const n = normalizeWork(work);
  if (!n) return null;
  const g = (Array.isArray(n.genres) ? n.genres : []).join(', ') || 'Unknown Genre';
  return {...n, genre: g, meta: `${n.year || 'Unknown Year'} • ${n.type || 'Unknown Type'} • ${g}`, subtitle: n.creator};
};

export const normalizeWorkEntity = (item) => {
  if (!item || !id(item)) return null;
  const g = normalizeGenres(item.genres || item.genre),
    y = item.year || item.releaseYear || item.publishedYear,
    t = item.type || item.workType || item.category,
    r = Number(item.averageRating || item.rating || item.avgRating || item.score || 0);
  return {
    entityId: String(id(item)), kind: 'work', title: item.title || item.name || 'Untitled Work',
    coverUrl: item.coverUrl || item.cover || '/album_covers/default.jpg',
    subtitle: item.creator || item.author || item.artist || 'Unknown Creator',
    meta: `${y || 'Unknown Year'} • ${t || 'Unknown Type'} • ${g.length > 0 ? g.join(', ') : 'Unknown Genre'}`,
    description: item.description || '', rating: Number.isNaN(r) ? 0 : r,
    workType: t ? String(t).toLowerCase() : 'unknown', year: y ? Number(y) : null,
    genres: g.map(x => x.toLowerCase()), raw: item
  };
};

export const normalizeGenres = (genres) =>
  Array.isArray(genres) ? genres.filter(Boolean) :
  (typeof genres === 'string' && genres.trim()) ? genres.split(/[,;]/).map(g => g.trim()).filter(Boolean) :
  [];

// Helper to extract array from various API response structures
const extractFromResponse = (r, k) => {
  const d = r?.data || r;
  return Array.isArray(r) ? r : Array.isArray(d) ? d : Array.isArray(d?.[k]) ? d[k] : [];
};
export const extractWorksFromResponse = r => extractFromResponse(r, 'works');
export const extractRatingsFromResponse = r => extractFromResponse(r, 'ratings');
export const extractShelvesFromResponse = r => extractFromResponse(r, 'shelves');
export const extractWorkFromResponse = (r) => {
  const d = r?.data || r;
  return Array.isArray(d?.works) ? d.works[0] : d?.work || (d?.workId || d?.id ? d : null);
};

// User normalization functions
export const normalizeUser = (user) =>
  !user || !id(user) ? null : {
    userId: id(user), username: user.username || user.name || 'Unknown User',
    email: user.email || '', profilePictureUrl: user.profilePictureUrl || user.avatar || DEFAULT_AVATAR_URL,
    bio: user.bio || user.description || '', ratedWorks: user.ratedWorks || 0
  };
export const normalizeUsers = (users) => Array.isArray(users) ? users.map(normalizeUser).filter(Boolean) : [];

// Rating normalization - supports both single and bulk rating objects
export const normalizeRating = (rating) => !rating ? null : {
  ratingId: rating.ratingId || rating.id || rating._id,
  userId: rating.userId || rating.user?.userId,
  workId: rating.workId || rating.work?.workId,
  score: Number(rating.score || rating.rating || 0),
  comment: rating.comment || rating.review || '',
  ratedAt: rating.ratedAt || rating.createdAt || new Date().toISOString()
};
export const normalizeRatingsObject = (ratingsData) =>
  !ratingsData || typeof ratingsData !== 'object' ? [] :
  Object.entries(ratingsData).map(([wId, r]) => ({
    workId: parseInt(wId), score: r.score || r.rating || 0,
    comment: r.comment || r.review || '',
    ratedAt: r.ratedAt ? new Date(r.ratedAt) : new Date()
  }));

// Shelf normalization
export const normalizeShelf = (shelf) =>
  !shelf || !id(shelf) ? null : {
    shelfId: id(shelf), name: shelf.name || 'Untitled Shelf',
    description: shelf.description || '', userId: shelf.userId || shelf.user?.userId,
    works: Array.isArray(shelf.works) ? shelf.works : [],
    createdAt: shelf.createdAt || new Date().toISOString()
  };

// Collection utilities - extract, merge, shuffle work arrays
export const extractWorkIdsFromShelf = (works) => new Set(
  !Array.isArray(works) ? [] : works.map(w =>
    w ? (typeof w === 'string' || typeof w === 'number' ? String(w) :
      (nw => nw ? nw.id || nw._id : w.id || w.workId || w._id || w.entityId)(typeof w.work === 'object' ? w.work : null)) :
    null
  ).filter(Boolean)
);

export const mergeUniqueWorks = (primary, secondary) => {
  const seen = new Set(primary.map(w => w.entityId || w.workId || w.id)),
    merged = [...primary];
  secondary.forEach(w => {
    const wId = w?.entityId || w?.workId || w?.id;
    if (w && wId && !seen.has(wId)) seen.add(wId), merged.push(w);
  });
  return merged;
};

// Fisher-Yates shuffle algorithm for random array ordering
export const shuffleArray = (array) => {
  const s = [...array];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};
export const getRandomItems = (array, count) =>
  !Array.isArray(array) || array.length === 0 ? [] : shuffleArray(array).slice(0, count);

// Apply client-side filters for work type, genre, year, and rating
export const applyWorkFilters = (works, filters) => {
  if (!Array.isArray(works)) return [];
  const {type: t, genre: g, year: y, rating: r} = filters;
  return works.filter(w =>
    w && (!t || t === 'user' || (w.workType || w.type || '').toLowerCase() === String(t).toLowerCase()) &&
    (!g || (Array.isArray(w.genres) ? w.genres.map(x => x.toLowerCase()) : []).some(x => x === String(g).toLowerCase())) &&
    (r === undefined || Number(w.rating || 0) >= Number(r)) &&
    (y === undefined || (Year => Year && Year >= Number(y))(Number(w.year || 0)))
  );
};
export const logNormalization = () => {};
