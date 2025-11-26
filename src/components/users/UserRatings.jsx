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
      badge: {
        text: `${rating.score}★`,
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#ff9f5a'
      },
      metaPrimary: rating ? `Rated on ${new Date(rating.ratedAt).toLocaleDateString()}` : 'Not Rated yet',
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
