import { useEffect, useState } from 'react';
import { getPopularWorks, getAllWorks } from '../api/works';
import { getAllUsers, getUserRatings, getUserById } from '../api/users';
import { testConnection } from '../api/client';
import { Link } from 'react-router-dom';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';

// Current user ID configuration
const CURRENT_USER_ID = 1;
const defaultAvatarUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

// Helper function to process popular works data
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

// Helper function to process user data and extract friends with activity
const processFriendsData = async (users, allWorks) => {
  const friendsWithActivity = [];
  
  // Filter out current user and users without ratings upfront
  const eligibleUsers = users.filter(user => 
    user.userId !== CURRENT_USER_ID && 
    user.ratedWorks && 
    user.ratedWorks > 0
  );
  
  for (const user of eligibleUsers) {
    try {
      const ratingsResponse = await getUserRatings(user.userId);
      const ratingsData = ratingsResponse?.data || ratingsResponse || {};
      
      // Convert ratings to array and get most recent
      const ratingsEntries = Object.entries(ratingsData);
      if (ratingsEntries.length === 0) continue;
      
      const mostRecentRating = ratingsEntries
        .map(([workId, rating]) => ({
          workId: parseInt(workId),
          score: rating.score,
          ratedAt: new Date(rating.ratedAt)
        }))
        .sort((a, b) => b.ratedAt - a.ratedAt)[0];
      
      // Find the corresponding work
      const ratedWork = allWorks.find(work => 
        (work.id || work.workId) === mostRecentRating.workId
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
    } catch (error) {
      // Silently continue on error - user just won't appear in friends list
      console.warn(`Could not fetch ratings for user ${user.username}`);
    }
  }
  
  return friendsWithActivity;
};

// FriendCard component with AlbumCard for image and description at bottom
const FriendCard = ({ friend }) => (
  <div style={{ 
    background: '#9a4207c8',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    height: '280px',
    display: 'flex',
    flexDirection: 'column'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }}>
    {/* Album Cover using AlbumCard styling */}
    <Link to={`/works/${friend.likedAlbum.workId}`} style={{ flex: 1, textDecoration: 'none' }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={friend.likedAlbum.coverUrl} 
          alt={friend.likedAlbum.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
    </Link>
    
    {/* Friend description at bottom */}
    <div style={{
      padding: '12px',
      textAlign: 'left',
      height: '68px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '6px' 
      }}>
        <img 
          src={friend.avatar} 
          alt={friend.name} 
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '1px solid #ddd'
          }}
        />
        <span style={{
          fontWeight: 600,
          color: '#392c2cff',
          fontSize: '13px'
        }}>
          {friend.name}
        </span>
      </div>
      <div style={{
        color: '#392c2cff',
        fontSize: '12px',
        lineHeight: '1.3'
      }}>
        liked <strong>{friend.likedAlbum.title}</strong>
      </div>
    </div>
  </div>
);

// PopularWorkCard component for better code organization
const PopularWorkCard = ({ work }) => (
  <Link to={`/works/${work.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div 
      style={{
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        height: '280px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.2s ease',
        height: '100%'
      }}>
        <img 
          src={work.coverUrl} 
          alt={work.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>
    </div>
  </Link>
);

/*------------------- Home page component -------------- */
export default function Home() {
  // Auto-clear search parameters if they exist on non-search pages
  useNavigationWithClearFilters();
  
  const [popular, setPopular] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      // Test backend connection
      const isBackendRunning = await testConnection();
      
      if (!isBackendRunning) {
        console.error('Backend server is not running');
        setFriendsLoading(false);
        setLoading(false);
        setUserLoading(false);
        return;
      }
      
      // Fetch current user from backend
      const fetchCurrentUser = async () => {
        setUserLoading(true);
        try {
          const userData = await getUserById(CURRENT_USER_ID);
          setCurrentUser({
            id: userData.userId || userData.id,
            name: userData.username || userData.name || 'User',
            avatar: userData.profilePictureUrl || defaultAvatarUrl
          });
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // Fallback user data
          setCurrentUser({
            id: CURRENT_USER_ID,
            name: 'User',
            avatar: defaultAvatarUrl
          });
        } finally {
          setUserLoading(false);
        }
      };
      
      // Fetch popular works and friends data in parallel
      const fetchPopularWorks = async () => {
        setLoading(true);
        try {
          const popularWorksData = await getPopularWorks();
          const processedWorks = processPopularWorks(popularWorksData);
          setPopular(processedWorks);
        } catch (error) {
          console.error('Failed to fetch popular works:', error);
          setPopular([]);
        } finally {
          setLoading(false);
        }
      };
      
      // Execute all data fetching operations in parallel
      await Promise.all([
        fetchPopularWorks(),
        fetchFriendsData(),
        fetchCurrentUser()
      ]);
    };

    const fetchFriendsData = async () => {
      setFriendsLoading(true);
      
      try {
        // Fetch users and works data in parallel
        const [usersResponse, worksData] = await Promise.all([
          getAllUsers(),
          getAllWorks()
        ]);
        
        // Extract and validate data
        const users = usersResponse?.data || usersResponse || [];
        const allWorks = worksData?.works || [];
        
        // Validate data format
        if (!Array.isArray(users) || !Array.isArray(allWorks)) {
          throw new Error('Invalid data format received from backend');
        }
        
        // Process friends data
        const friendsWithActivity = await processFriendsData(users, allWorks);
        setFriends(friendsWithActivity);
        
      } catch (error) {
        console.error('Failed to load friends data:', error);
      } finally {
        setFriendsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          {userLoading ? (
            <p className="welcome-text">Loading...</p>
          ) : (
            <p className="welcome-text">
              Welcome back <em>{currentUser?.name || 'User'}</em>. Here's what others have been discovering...
            </p>
          )}

          <h3 className="section-title">NEW FROM FRIENDS</h3>
          {friendsLoading ? (
            <p style={{ color: '#392c2cff' }}>Loading friends activity...</p>
          ) : friends.length === 0 ? (
            <p style={{ color: '#392c2cff' }}>No recent activity from friends.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {friends.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          )}

          <h3 className="section-title" style={{marginTop: 20}}>THIS WEEK'S MOST POPULAR</h3>
          {loading ? (
            <p style={{ color: '#392c2cff' }}>Loading popular works...</p>
          ) : popular.length === 0 ? (
            <p style={{ color: '#392c2cff' }}>No popular works available.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {popular.map(work => (
                <PopularWorkCard key={work.workId} work={work} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
