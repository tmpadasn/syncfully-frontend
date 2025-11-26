import WorkCardCarousel from '../WorkCardCarousel';

export default function UserRatings({ ratings = {}, works = [] }) {
  const entries = Object.entries(ratings);

  // Sort by ratedAt descending (most recent first)
  const sortedEntries = entries.sort((a, b) => {
    const dateA = new Date(a[1].ratedAt);
    const dateB = new Date(b[1].ratedAt);
    return dateB - dateA;
  });

  const cards = sortedEntries.map(([workId, rating]) => {
    const work = works.find(w => (w.id || w.workId) === Number(workId));
    if (!work) return null;

    return {
      id: workId,
      title: work.title,
      coverUrl: work.coverUrl,
      averageRating: work.averageRating || work.rating || 0,
      userRating: rating?.score || null,
      ratedAt: rating?.ratedAt || null,
      metaPrimary: work.creator || work.author || work.artist || 'Unknown Creator',
      metaSecondary: work.year ? `${work.type || 'Work'} • ${work.year}` : (work.type || undefined),
      link: `/works/${work.id || work.workId}`
    };
  }).filter(Boolean);

  return (
    <WorkCardCarousel
      cards={cards}
      emptyMessage="No ratings yet. Start rating some works!"
    />
  );
}
