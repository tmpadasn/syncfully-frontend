import { useEffect, useState } from 'react';
import { getPopularWorks, getAllWorks } from '../api/works';
import { getAllUsers, getUserRatings, getUserById } from '../api/users';
import { testConnection } from '../api/client';
import { Link } from 'react-router-dom';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import useAuth from '../hooks/useAuth';

// Default avatar for users without profile picture
const defaultAvatarUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

/* ---------------------- DATA PROCESSING HELPERS ---------------------- */

const processPopularWorks = (data) => {
  const works = data?.works || [];
  return works.map(work => ({
    workId: work.id || work.workId,
    title: work.title,
    rating: work.averageRating || work.rating || 0,
    coverUrl: work.coverUrl || '/album_covers/default.jpg',
    type: work.type,
    creator: work.creator,
    year: work.year
  }));
};

const processFriendsData = async (users, allWorks, currentUserId) => {
  const friendsWithActivity = [];

  if (!currentUserId) return []; // If not logged in → no friends

  const eligibleUsers = users.filter(
    user => user.userId !== currentUserId && user.ratedWorks > 0
  );

  for (const user of eligibleUsers) {
    try {
      const ratingsResponse = await getUserRatings(user.userId);
      const ratingsData = ratingsResponse?.data || ratingsResponse || {};

      const entries = Object.entries(ratingsData);
      if (entries.length === 0) continue;

      const mostRecentRating = entries
        .map(([workId, r]) => ({
          workId: parseInt(workId),
          score: r.score,
          ratedAt: new Date(r.ratedAt)
        }))
        .sort((a, b) => b.ratedAt - a.ratedAt)[0];

      const ratedWork = allWorks.find(w =>
        (w.id || w.workId) === mostRecentRating.workId
      );

      if (ratedWork) {
        friendsWithActivity.push({
          id: user.userId,
          name: user.username,
          avatar: user.profilePictureUrl || defaultAvatarUrl,
          likedAlbum: {
            title: ratedWork.title,
            coverUrl: ratedWork.coverUrl || '/album_covers/default.jpg',
            workId: ratedWork.id || ratedWork.workId
          }
        });
      }
    } catch (_) {}
  }

  return friendsWithActivity;
};

/* ---------------------- CARD COMPONENTS ---------------------- */

const FriendCard = ({ friend }) => (
  <div
    style={{
      background: '#9a4207c8',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '280px',
      display: 'flex',
      flexDirection: 'column',
      transition: '0.2s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}
  >
    <Link to={`/works/${friend.likedAlbum.workId}`} style={{ flex: 1 }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img
          src={friend.likedAlbum.coverUrl}
          alt={friend.likedAlbum.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </Link>

    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <img
          src={friend.avatar}
          style={{ width: 20, height: 20, borderRadius: '50%' }}
        />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{friend.name}</span>
      </div>

      <div style={{ fontSize: 12 }}>
        liked <strong>{friend.likedAlbum.title}</strong>
      </div>
    </div>
  </div>
);

const PopularWorkCard = ({ work }) => (
  <Link to={`/works/${work.workId}`} style={{ textDecoration: 'none' }}>
    <div
      style={{
        transition: 'transform 0.2s',
        height: '280px',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          height: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <img
          src={work.coverUrl}
          alt={work.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  </Link>
);

/* ---------------------- HOME PAGE ---------------------- */

export default function Home() {
  useNavigationWithClearFilters();

  const { user } = useAuth(); // NOW decides login state
  const currentUserId = user?.userId || null;

  const [popular, setPopular] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendsLoading, setFriendsLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      await testConnection();

      const [popularData, worksData] = await Promise.all([
        getPopularWorks(),
        getAllWorks()
      ]);

      setPopular(processPopularWorks(popularData));
      const allWorks = worksData?.works || [];

      if (currentUserId) {
        // Only fetch friends if logged in
        const usersResponse = await getAllUsers();
        const users = usersResponse?.data || usersResponse || [];
        const friendActivity = await processFriendsData(
          users,
          allWorks,
          currentUserId
        );
        setFriends(friendActivity);
      } else {
        setFriends([]); // logged-out users see no friends list
      }

      setLoading(false);
      setFriendsLoading(false);
    };

    loadPage();
  }, [currentUserId]);

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          {/* ------------------ WELCOME MESSAGE ------------------ */}
          {!user ? (
            <p className="welcome-text">
              Welcome to <strong>Syncfully</strong>. Discover the most popular works this week.
            </p>
          ) : (
            <p className="welcome-text">
              Welcome back <em>{user.username}</em>. Here's what others have been discovering...
            </p>
          )}

          {/* ------------------ FRIENDS ACTIVITY ------------------ */}
          {user && (
            <>
              <h3 className="section-title">NEW FROM FRIENDS</h3>
              {friendsLoading ? (
                <p>Loading friends...</p>
              ) : friends.length === 0 ? (
                <p>No recent activity from friends.</p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '40px'
                  }}
                >
                  {friends.map(f => (
                    <FriendCard key={f.id} friend={f} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ------------------ POPULAR WORKS ------------------ */}
          <h3 className="section-title" style={{ marginTop: 20 }}>
            THIS WEEK'S MOST POPULAR
          </h3>

          {loading ? (
            <p>Loading popular works...</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px'
              }}
            >
              {popular.map(w => (
                <PopularWorkCard key={w.workId} work={w} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
