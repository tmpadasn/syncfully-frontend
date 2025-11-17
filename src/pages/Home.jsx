import { useEffect, useState } from 'react';
import { getPopularWorks } from '../api/works';
import { Link } from 'react-router-dom';

/*------------------- Mock data for home page -------------- */
const user = {
  id: 123,
  name: 'John',
  last_name: 'Doe',
  avatar: '/profile_picture.jpg',
}

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

const mockFriends = [
  {
    id: 1,
    name: 'Stratos',
    avatar: '/profile_picture.jpg',
    likedAlbum: { title: 'Pink Floyd', coverUrl: '/album_covers/pink_floyd_1.jpg', workId: 2001 }
  },
  {
    id: 2,
    name: 'Natalia',
    avatar: '/profile_picture.jpg',
    likedAlbum: { title: 'Pulp Fiction', coverUrl: '/album_covers/pulp_fiction.jpg', workId: 2002 }
  },
  {
    id: 3,
    name: 'Giannis',
    avatar: '/profile_picture.jpg',
    likedAlbum: { title: 'Lord of the Rings', coverUrl: '/album_covers/lord_of_the_rings.jpg', workId: 2003}
  },
  {
    id: 4,
    name: 'Eleni',
    avatar: '/profile_picture.jpg',
    likedAlbum: { title: 'Harry Potter Book', coverUrl: '/album_covers/harry_potter_1.jpg', workId: 2004 }
  },
  {
    id: 5,
    name: 'Maria',
    avatar: '/profile_picture.jpg',
    likedAlbum: { title: 'Damn', coverUrl: '/album_covers/damn.png', workId: 2005 }
  }

];

/*------------------- Home page component -------------- */
export default function Home() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPopularWorks()
      .then(data => setPopular(data.works || []))
      .catch(() => setPopular([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <p className="welcome-text">Welcome back <em>{user.name}</em>. Here's what others have been discovering...</p>

          <h3 className="section-title">NEW FROM FRIENDS</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading...</p>
          ) : (
            <div className="friend-grid">
              {mockFriends.map(f => (
                <Link key={f.id} to={`/works/${f.likedAlbum.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="friend-card">
                    <div className="friend-inner">
                      <img className="friend-cover" src={f.likedAlbum.coverUrl} alt={f.likedAlbum.title} />
                      <div className="friend-meta">
                        <img className="friend-avatar" src={f.avatar} alt={f.name} />
                        <div style={{flex:1,textAlign:'left'}}>
                          <div className="friend-name">{f.name}</div>
                          <div className="friend-album-title">{f.likedAlbum.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <h3 className="section-title" style={{marginTop:30}}>THIS WEEK'S MOST POPULAR</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading...</p>
          ) : (
            <div className="works-grid">
              {(() => {
                const displayWorks = !loading && popular.length === 0 ? mockPopular : popular;
                return displayWorks.map(w => (
                  <Link key={`row2-${w.workId}`} to={`/works/${w.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="album-compact">
                      <div className="album-cover-frame">
                        <img className="album-cover-img" src={w.coverUrl} alt={w.title} />
                      </div>
                    </div>
                  </Link>
                ));
              })()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
