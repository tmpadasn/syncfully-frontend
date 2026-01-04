import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getUserById, getUserRatings, getUserFollowers, getUserFollowing, followUser, unfollowUser } from "../api/users";
import useAuth from "../hooks/useAuth";
import { getAllWorks } from "../api/works";
import UserRatings from "../components/users/UserRatings";
import { ProfileSkeleton } from "../components/Skeleton";
import logger from "../utils/logger";
import { DEFAULT_AVATAR_URL } from "../config/constants";
import { statsStyles } from "../styles/stats";
import BreakdownList from "../components/BreakdownList";
import HoverBar from "../components/HoverBar";

/* ===================== PROFILE FUNCTION ===================== */
// Profile page component.
// Displays another user's public profile and rating summaries. Loads profile
// data and ratings, then derives follow relationship state to conditionally
// render follow actions. Data loading is batched to reduce round-trips.
// This page aggregates public profile data, ratings, and follow-state; comments document data-fetching and follow relationship logic.
export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  
  const prevSearch = location.state?.prevSearch || '';

  const [profileUser, setProfileUser] = useState(null);
  const [ratings, setRatings] = useState({});
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState(null); // 'following', 'followers', 'both', null
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Load profile data and follow status on mount
    /* Follow-state derivation: batch public profile and follow lists, then
      compute relationship flags to drive conditional UI affordances. */
    useEffect(() => {
    const load = async () => {
      // Reset state immediately to prevent flash of old content
      setProfileUser(null);
      setRatings({});
      setWorks([]);
      setLoading(true);
      
      try {
        const [u, ratingsResponse, allWorks] = await Promise.all([
          getUserById(userId),
          getUserRatings(userId),
          getAllWorks()
        ]);

        setProfileUser(u);
        const ratingsObject = ratingsResponse?.ratings || ratingsResponse || {};
        setRatings(ratingsObject);
        setWorks(allWorks?.works || []);

        // Check follow relationship if user is logged in
        if (currentUser && currentUser.userId != userId) {
          try {
            const [currentUserFollowing, profileUserFollowers] = await Promise.all([
              getUserFollowing(currentUser.userId),
              getUserFollowers(userId)
            ]);

            // Check if current user is following the profile user
            const isCurrentUserFollowing = currentUserFollowing.following?.some(f => 
              (f.userId || f.id) === parseInt(userId)
            );
            
            // Check if profile user is following the current user
            const isProfileUserFollowing = profileUserFollowers.followers?.some(f =>
              (f.userId || f.id) === currentUser.userId
            );

            setIsFollowing(isCurrentUserFollowing || false);

            if (isCurrentUserFollowing && isProfileUserFollowing) {
              setFollowStatus('both');
            } else if (isCurrentUserFollowing) {
              setFollowStatus('following');
            } else if (isProfileUserFollowing) {
              setFollowStatus('followers');
            } else {
              setFollowStatus(null);
            }
          } catch (err) {
            logger.error('Failed to check follow status:', err);
          }
        }
      } catch (err) {
        logger.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, currentUser]);

  if (loading) return <ProfileSkeleton />;
  if (!profileUser) return <p style={{ padding: 20 }}>User not found.</p>;

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.userId, parseInt(userId));
        setIsFollowing(false);
        setFollowStatus(followStatus === 'both' ? 'followers' : null);
      } else {
        await followUser(currentUser.userId, parseInt(userId));
        setIsFollowing(true);
        setFollowStatus(followStatus === 'followers' ? 'both' : 'following');
      }
    } catch (err) {
      logger.error('Follow action failed:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  /* Follow semantics: compute local follow-state immediately after action
     to reflect intent in the UI while the backend confirms the change. */

  /* ===================== UI STYLES ===================== */

  const styles = {
    /* ===================== PAGE LAYOUT ===================== */
    pageContainer: {
      minHeight: "100vh",
      padding: "40px 20px",
      background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
    },
    profileCard: {
      background: "#fff",
      padding: "40px 36px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      maxWidth: "820px",
      margin: "0 auto 48px",
    },
    profileLayout: {
      display: "flex",
      gap: 48,
      alignItems: "center",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 24,
      marginTop: 36,
      paddingTop: 32,
      borderTop: "1px solid #efe5db",
    },
    buttonContainer: {
      display: "grid",
      gridTemplateColumns: "auto",
      gap: 16,
      marginTop: 32,
    },

    /* ===================== PROFILE INFO ===================== */
    avatar: {
      width: 160,
      height: 160,
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #e8dccf",
    },
    infoColumn: {
      flex: 1,
      textAlign: "center",
    },
    infoLabel: {
      fontSize: 12,
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#8a6f5f",
      marginBottom: 6,
      opacity: 0.75,
      letterSpacing: 0.8,
    },
    infoText: {
      fontSize: 16,
      fontWeight: 600,
      color: "#3b2e2e",
    },

    /* ===================== STATS SECTION ===================== */

    /* ===================== BREAKDOWN SECTION ===================== */
    breakdownHeader: {
      fontSize: 13,
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#8a6f5f",
      marginBottom: 14,
      opacity: 0.75,
      letterSpacing: 0.8,
    },
    breakdownGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: 12,
    },
    breakdownCard: {
      background: "linear-gradient(135deg, #fff9f5 0%, #fef5f0 100%)",
      padding: "16px",
      borderRadius: 10,
      border: "1.5px solid #f0e0d8",
      textAlign: "center",
      transition: "all 0.2s ease",
    },
    breakdownValue: {
      fontSize: 24,
      fontWeight: 800,
      color: "#9a4207",
    },
    breakdownLabel: {
      fontSize: 12,
      marginTop: 6,
      fontWeight: 600,
      color: "#5d4c4c",
      textTransform: "capitalize",
    },

    /* ===================== GENRES SECTION ===================== */
    genresContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    genreRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    genreCount: {
      width: 30,
      textAlign: "right",
      fontSize: 13,
      fontWeight: 700,
      color: "#3b2e2e",
    },
    genreBar: (idx) => ({
      height: 28,
      background: ["#9a4207", "#b95716", "#c86f38", "#d4885c", "#d9956f"][idx % 5],
      backgroundImage: `linear-gradient(90deg, ${["#9a4207", "#b95716", "#c86f38", "#d4885c", "#d9956f"][idx % 5]}, ${["#9a4207", "#b95716", "#c86f38", "#d4885c", "#d9956f"][idx % 5]}dd)`,
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
      flex: 1,
    }),

    /* ===================== BUTTONS ===================== */
    button: (bg) => ({
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
    }),

    /* ===================== RATING HISTORY ===================== */
    historySection: {
      marginTop: 48,
    },
    historyTitle: {
      marginBottom: 24,
      fontSize: 28,
      fontWeight: 800,
    },
  };

  // RETURN PROFILE PAGE LAYOUT
  return (
    <div style={styles.pageContainer}>
      <div className="page-container">
        <div className="page-inner">
          <main className="page-main" style={{ maxWidth: 860, margin: "0 auto" }}>

            {/* PROFILE SECTION */}
            <div style={styles.profileCard}>
              <div style={styles.profileLayout}>
                {/* Column 1: Avatar */}
                <img
                  src={
                    profileUser.profilePictureUrl ||
                    DEFAULT_AVATAR_URL
                  }
                  alt="avatar"
                  style={styles.avatar}
                />

                {/* Column 2: Username */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ ...styles.infoLabel, fontSize: 14, marginBottom: 10 }}>USERNAME</div>
                  <div style={{ ...styles.infoText, fontSize: 22 }}>{profileUser.username}</div>
                </div>

                {/* Column 3: Email Address */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ ...styles.infoLabel, fontSize: 14, marginBottom: 10 }}>EMAIL ADDRESS</div>
                  <div style={{ ...styles.infoText, fontSize: 18 }}>{profileUser.email}</div>
                </div>
              </div>

              {/* User Stats Grid */}
              <div style={styles.statsContainer}>
                {/* Works Rated */}
                <div style={statsStyles.statCard}>
                  <div style={statsStyles.statValue}>{Object.keys(ratings).length}</div>
                  <div style={statsStyles.statLabel}>Works Rated</div>
                </div>

                {/* Stats by Type */}
                <div>
                  <div style={styles.breakdownHeader}>
                    📊 Rating Breakdown by Type
                  </div>
                  <div style={styles.breakdownGrid}>
                    <BreakdownList
                      ratings={ratings}
                      works={works}
                      keyName="type"
                      emptyMessage="No ratings yet"
                      cardStyle={styles.breakdownCard}
                      valueStyle={styles.breakdownValue}
                      labelStyle={styles.breakdownLabel}
                    />
                  </div>
                </div>

                {/* Most Rated Genres */}
                <div>
                  <div style={styles.breakdownHeader}>
                    🎭 Most Rated Genres
                  </div>
                  <div style={styles.genresContainer}>
                    {(() => {
                      // Count genres from the user's rated works.
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

                      return sorted.map(([genre, count], idx) => (
                        <div key={genre} style={styles.genreRow}>
                          <div style={styles.genreCount}>
                            {count}
                          </div>
                          <div style={{ flex: 1 }}>
                            <HoverBar style={styles.genreBar(idx)}>
                              {genre}
                            </HoverBar>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Back Button and Follow Button */}
              <div style={{...styles.buttonContainer, gridTemplateColumns: currentUser && parseInt(userId) !== currentUser.userId ? "1fr 1fr" : "1fr" }}>
                <button
                  style={styles.button("linear-gradient(135deg,#d4a574,#e8b896)")}
                  onClick={() => prevSearch ? navigate(`/search${prevSearch}`) : navigate(-1)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  ← Back to Search
                </button>

                {currentUser && parseInt(userId) !== currentUser.userId && (
                  <button
                    style={styles.button(isFollowing ? "#c0392b" : "linear-gradient(135deg,#9a4207,#b95716)")}
                    onClick={handleFollow}
                    disabled={followLoading}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                  >
                    {isFollowing ? '✕ Unfollow' : '+ Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* RATING HISTORY */}
            <section style={styles.historySection}>
              <h2 className="section-title" style={styles.historyTitle}>
                {profileUser.username}'s Rating History
              </h2>
              <UserRatings ratings={ratings} works={works} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
