import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserRecommendations } from '../api/users';

const mockInterestAlbums = [
  { workId: 3000, title: 'I am Music', coverUrl: '/album_covers/i_am_music.jpg' },
  { workId: 3001, title: 'Kendrick Lamar', coverUrl: '/album_covers/kendrick_lamar.png' },
  { workId: 3002, title: 'Snowwhite', coverUrl: '/album_covers/snow_white.jpg' },
  { workId: 3003, title: 'Anora', coverUrl: '/album_covers/anora.jpg' },
  { workId: 3004, title: 'Crime and Punishment', coverUrl: '/album_covers/crime_and_punishment.jpg' },
];

const mockProfileAlbums = [
  { workId: 3100, title: 'Profile Pick 1', coverUrl: '/album_covers/harry_styles.png' },
  { workId: 3101, title: 'Profile Pick 2', coverUrl: '/album_covers/mezzanine.png' },
  { workId: 3102, title: 'Profile Pick 3', coverUrl: '/album_covers/pink_floyd_2.jpg' },
  { workId: 3103, title: 'Profile Pick 4', coverUrl: '/album_covers/pink_floyd_1.jpg' },
  { workId: 3104, title: 'Profile Pick 5', coverUrl: '/album_covers/damn.png' },
];


export default function Recommendations() {
  const { user } = useAuth();
  const [lists, setLists] = useState({ current: [], profile: []});
  const [loading, setLoading] = useState(true);

  const renderGrid = (items = []) => (
    <div className="works-grid">
      {items.map(item => (
        <Link key={item.workId} to={`/works/${item.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="album-compact">
            <div className="album-cover-frame">
              <img className="album-cover-img" src={item.coverUrl} alt={item.title} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  useEffect(() => {
    setLoading(true);
    if (!user) {
      const t = setTimeout(() => {
        setLists({ current: mockInterestAlbums, profile: mockProfileAlbums });
        setLoading(false);
      }, 500);
      return () => clearTimeout(t);
    }

    getUserRecommendations(user.userId)
      .then(data => setLists(data || { current: mockInterestAlbums, profile: mockProfileAlbums }))
      .catch(() => setLists({ current: mockInterestAlbums, profile: mockProfileAlbums }))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <p className="welcome-text">We found some new picks for you!</p>

          <h3 className="section-title">BASED ON YOUR LATEST INTEREST</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading recommendations...</p>
          ) : (
            renderGrid(lists.current)
          )}

          <h3 className="section-title" style={{ marginTop: 30 }}>BASED ON YOUR PROFILE</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading recommendations...</p>
          ) : (
            renderGrid(lists.profile)
          )}
        </main>
      </div>
    </div>
  );
}

