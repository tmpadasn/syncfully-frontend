import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Skeleton } from "../components/Skeleton";
import logger from "../utils/logger";
import { DEFAULT_AVATAR_URL } from "../config/constants";

import { 
  getUserById, 
  deleteUser, 
  getUserRatings,
  getUserFollowers,
  getUserFollowing,
} from "../api/users";

import { getAllWorks } from "../api/works";
import UserRatings from "../components/users/UserRatings";

export default function Account() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  const [backendUser, setBackendUser] = useState(null);
  // ratings is stored as an object map { <workId>: { score, ratedAt } }
  const [ratings, setRatings] = useState({});
  const [works, setWorks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     FETCH USER DATA ONCE AUTH IS READY
  --------------------------------------------------------- */
  useEffect(() => {
    if (authLoading || !user) return;

    const load = async () => {
      setLoading(true);

      try {
        const userId = user.userId;

        const [u, ratingsResponse, allWorks, followersResponse, followingResponse] = await Promise.all([
          getUserById(userId),
          getUserRatings(userId),
          getAllWorks().catch(err => {
            logger.error("Failed to fetch works:", err);
            return { works: [] };
          }),
          getUserFollowers(userId).catch(err => {
            logger.error("Failed to fetch followers:", err);
            return { followers: [] };
          }),
          getUserFollowing(userId).catch(err => {
            logger.error("Failed to fetch following:", err);
            return { following: [] };
          })
        ]);

        setBackendUser(u);

        // Backend returns an object map of ratings keyed by workId
        const ratingsObject = ratingsResponse?.ratings || ratingsResponse || {};
        
        // Filter out work IDs that don't exist in the works list
        const validWorks = allWorks?.works || [];
        const validWorkIds = new Set(validWorks.map(w => w.id || w.workId));
        const filteredRatings = Object.keys(ratingsObject).reduce((acc, workId) => {
          if (validWorkIds.has(Number(workId))) {
            acc[workId] = ratingsObject[workId];
          }
          return acc;
        }, {});

        setRatings(filteredRatings);
        setWorks(validWorks);
        
        // Set followers
        const followersList = followersResponse?.followers || [];
        setFollowers(followersList);
        
        // Set following
        const followingList = followingResponse?.following || [];
        setFollowing(followingList);

      } catch (err) {
        // Handle errors - set backendUser to the auth user if API fails
        logger.error("Account load failed:", err);
        setBackendUser(user);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <Skeleton width="160px" height="160px" borderRadius="50%" style={{ margin: '0 auto 24px' }} />
          <Skeleton width="200px" height="32px" style={{ margin: '0 auto 12px' }} />
          <Skeleton width="150px" height="20px" style={{ margin: '0 auto 24px' }} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
            <Skeleton width="120px" height="80px" borderRadius="12px" />
            <Skeleton width="120px" height="80px" borderRadius="12px" />
            <Skeleton width="120px" height="80px" borderRadius="12px" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <p>Please log in to view your account</p>;
  }

  if (loading || !backendUser) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <Skeleton width="160px" height="160px" borderRadius="50%" style={{ margin: '0 auto 24px' }} />
          <Skeleton width="200px" height="32px" style={{ margin: '0 auto 12px' }} />
          <Skeleton width="150px" height="20px" style={{ margin: '0 auto 24px' }} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
            <Skeleton width="120px" height="80px" borderRadius="12px" />
            <Skeleton width="120px" height="80px" borderRadius="12px" />
            <Skeleton width="120px" height="80px" borderRadius="12px" />
          </div>
          <Skeleton width="100%" height="200px" borderRadius="16px" />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
     DELETE ACCOUNT
  --------------------------------------------------------- */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      await deleteUser(backendUser.userId);
      logout();
      navigate("/");
    } catch (err) {
      logger.error("Delete account failed:", err);
    }
  };

  /* ---------------------------------------------------------
      STYLES
  --------------------------------------------------------- */
  const pageContainer = {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
  };

  const profileCard = {
    background: "#fff",
    padding: "40px 36px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    maxWidth: "820px",
    margin: "0 auto 48px",
  };

  const avatarStyle = {
    width: 160,
    height: 160,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e8dccf",
  };

  const infoLabel = {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#8a6f5f",
    marginBottom: 6,
    opacity: 0.75,
    letterSpacing: 0.8,
  };

  const infoText = {
    fontSize: 16,
    fontWeight: 600,
    color: "#3b2e2e",
  };

  const statCard = {
    background: "linear-gradient(135deg, #faf6f1 0%, #f5f0ea 100%)",
    padding: "20px 16px",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    flex: 1,
    textAlign: "center",
    border: "1px solid #efe5db",
  };

  const actionButton = (bg) => ({
    padding: "13px 26px",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    color: "#fff",
    background: bg,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
  });

  /* ---------------------------------------------------------
      RENDER
  --------------------------------------------------------- */
  return (
    <div style={pageContainer}>
      <div className="page-container">
        <div className="page-inner">

          <main className="page-main" style={{ maxWidth: 860, margin: "0 auto" }}>

            <h1 className="section-title" style={{ textAlign: "center", marginBottom: 40, fontSize: 36, fontWeight: 800 }}>
              Your Account
            </h1>

            {/* PROFILE SECTION */}
            <div style={profileCard}>
              <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
                
                {/* Column 1: Avatar */}
                <img
                  src={
                    backendUser.profilePictureUrl ||
                    DEFAULT_AVATAR_URL
                  }
                  alt="avatar"
                  style={avatarStyle}
                />

                {/* Column 2: Username */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ ...infoLabel, fontSize: 14, marginBottom: 10 }}>USERNAME</div>
                  <div style={{ ...infoText, fontSize: 22 }}>{backendUser.username}</div>
                </div>

                {/* Column 3: Email Address */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ ...infoLabel, fontSize: 14, marginBottom: 10 }}>EMAIL ADDRESS</div>
                  <div style={{ ...infoText, fontSize: 18 }}>{backendUser.email}</div>
                </div>
              </div>

              {/* User Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 24,
                  marginTop: 36,
                  paddingTop: 32,
                  borderTop: "1px solid #efe5db",
                }}
              >
                {/* Works Rated */}
                <div style={statCard}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#9a4207" }}>{Object.keys(ratings).length}</div>
                  <div style={{ fontSize: 14, opacity: 0.75, marginTop: 8, fontWeight: 600 }}>Works Rated</div>
                </div>

                {/* Stats by Type */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#8a6f5f", marginBottom: 14, opacity: 0.75, letterSpacing: 0.8 }}>
                    📊 Rating Breakdown by Type
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                    {(() => {
                      const typeStats = {};
                      Object.keys(ratings).forEach(workId => {
                        const work = works.find(w => (w.id || w.workId) === Number(workId));
                        if (work && work.type) {
                          if (!typeStats[work.type]) typeStats[work.type] = 0;
                          typeStats[work.type]++;
                        }
                      });
                      
                      const sorted = Object.entries(typeStats).sort((a, b) => b[1] - a[1]);
                      
                      if (sorted.length === 0) {
                        return <div style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.6, fontSize: 13 }}>No ratings yet</div>;
                      }
                      
                      return sorted.map(([type, count]) => (
                        <div key={type} style={{
                          background: "linear-gradient(135deg, #fff9f5 0%, #fef5f0 100%)",
                          padding: "16px",
                          borderRadius: 10,
                          border: "1.5px solid #f0e0d8",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 16px rgba(154, 66, 7, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{ fontSize: 24, fontWeight: 800, color: "#9a4207" }}>{count}</div>
                          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600, color: "#5d4c4c", textTransform: "capitalize" }}>
                            {type}
                            {count !== 1 ? "s" : ""}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Most Rated Genres */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#8a6f5f", marginBottom: 14, opacity: 0.75, letterSpacing: 0.8 }}>
                    🎭 Most Rated Genres
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(() => {
                      const genreStats = {};
                      Object.keys(ratings).forEach(workId => {
                        const work = works.find(w => (w.id || w.workId) === Number(workId));
                        if (work && work.genres && Array.isArray(work.genres)) {
                          work.genres.forEach(genre => {
                            if (!genreStats[genre]) genreStats[genre] = 0;
                            genreStats[genre]++;
                          });
                        }
                      });
                      
                      const sorted = Object.entries(genreStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
                      
                      if (sorted.length === 0) {
                        return <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13 }}>No genre data available</div>;
                      }
                      
                      const maxCount = sorted[0][1];
                      
                      return sorted.map(([genre, count], idx) => {
                        const percentage = (count / maxCount) * 100;
                        const colors = ["#9a4207", "#b95716", "#c86f38", "#d4885c", "#d9956f"];
                        
                        return (
                          <div key={genre} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 30, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#3b2e2e" }}>
                              {count}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                height: 28,
                                background: `linear-gradient(90deg, ${colors[idx % colors.length]}, ${colors[idx % colors.length]}dd)`,
                                borderRadius: 6,
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 12,
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "capitalize",
                                boxShadow: "0 4px 12px rgba(154, 66, 7, 0.15)",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateX(8px)";
                                e.currentTarget.style.boxShadow = "0 6px 16px rgba(154, 66, 7, 0.25)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(154, 66, 7, 0.15)";
                              }}
                              >
                                {genre}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Followers Section */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#8a6f5f", marginBottom: 14, opacity: 0.75, letterSpacing: 0.8 }}>
                    👥 Followers
                  </div>
                  {followers.length === 0 ? (
                    <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13, padding: "20px" }}>No followers yet</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
                      {followers.map((follower) => (
                        <div
                          key={follower.userId || follower.id}
                          onClick={() => navigate(`/profile/${follower.userId || follower.id}`)}
                          style={{
                            background: "linear-gradient(135deg, #fff9f5 0%, #fef5f0 100%)",
                            padding: "16px",
                            borderRadius: 10,
                            border: "1.5px solid #f0e0d8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(154, 66, 7, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <img
                            src={follower.profilePictureUrl || DEFAULT_AVATAR_URL}
                            alt={follower.username}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #e8dccf",
                              marginBottom: "8px",
                              display: "block",
                              margin: "0 auto 8px",
                            }}
                          />
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#3b2e2e", marginTop: 6 }}>
                            {follower.username}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Following Section */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#8a6f5f", marginBottom: 14, opacity: 0.75, letterSpacing: 0.8 }}>
                    👫 Following
                  </div>
                  {following.length === 0 ? (
                    <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13, padding: "20px" }}>Not following anyone yet</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
                      {following.map((user) => (
                        <div
                          key={user.userId || user.id}
                          onClick={() => navigate(`/profile/${user.userId || user.id}`)}
                          style={{
                            background: "linear-gradient(135deg, #fff9f5 0%, #fef5f0 100%)",
                            padding: "16px",
                            borderRadius: 10,
                            border: "1.5px solid #f0e0d8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(154, 66, 7, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <img
                            src={user.profilePictureUrl || DEFAULT_AVATAR_URL}
                            alt={user.username}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #e8dccf",
                              marginBottom: "8px",
                              display: "block",
                              margin: "0 auto 8px",
                            }}
                          />
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#3b2e2e", marginTop: 6 }}>
                            {user.username}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
                
                <button
                  style={actionButton("linear-gradient(135deg,#9a4207,#b95716)")}
                  onClick={() => navigate("/account/edit")}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  ✎ Edit Account
                </button>

                <button
                  style={actionButton("#c0392b")}
                  onClick={handleDelete}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  🗑 Delete Account
                </button>

              </div>
            </div>

            {/* RATING HISTORY */}
            <section style={{ marginTop: 48 }}>
              <h2 className="section-title" style={{ marginBottom: 24, fontSize: 28, fontWeight: 800 }}>Your Rating History</h2>
              <UserRatings ratings={ratings} works={works} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
