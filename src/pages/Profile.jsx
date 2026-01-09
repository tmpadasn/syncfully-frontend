import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getUserById, getUserRatings, getUserFollowers, getUserFollowing,
         followUser, unfollowUser, getAllWorks } from "../api";
import { useAuth } from "../hooks";
import { UserRatings, ProfileHeaderProfile, ProfileSkeleton } from "../components";
import logger from "../utils/logger";

/* ===================== PROFILE FUNCTION ===================== */
// Profile page component.
// Displays another user's public profile and rating summaries. Loads profile
// data and ratings, then derives follow relationship state to conditionally
// render follow actions. Data loading is batched to reduce round-trips.
// This page aggregates public profile data, ratings, and follow-state;
// comments document data-fetching and follow relationship logic.

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

    // Optimistic UI update: flip local follow state immediately to
    // provide instant feedback, then call the API and roll back on error.
    const prevFollowing = isFollowing;
    const prevStatus = followStatus;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        // optimistic: show unfollow in-progress by clearing state immediately
        setIsFollowing(false);
        setFollowStatus(prevStatus === 'both' ? 'followers' : null);
        await unfollowUser(currentUser.userId, parseInt(userId));
      } else {
        setIsFollowing(true);
        setFollowStatus(prevStatus === 'followers' ? 'both' : 'following');
        await followUser(currentUser.userId, parseInt(userId));
      }
    } catch (err) {
      logger.error('Follow action failed:', err);
      // rollback UI to previous state on failure
      setIsFollowing(prevFollowing);
      setFollowStatus(prevStatus);
    } finally {
      setFollowLoading(false);
    }
  };

  /* ===================== UI RENDERING ===================== */
  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", background: "var(--bg)" }}>
      <div className="page-container">
        <div className="page-inner">
          <main className="page-main" style={{ maxWidth: 860, margin: "0 auto" }}>

            {/* Profile Header - includes avatar, details, stats, and action buttons */}
            <div style={{ background: "#fff", padding: "40px 36px", borderRadius: "16px",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.08)", maxWidth: "820px", margin: "0 auto 48px" }}>
              <ProfileHeaderProfile
                profileUser={profileUser}
                ratings={ratings}
                works={works}
                currentUser={currentUser}
                userId={userId}
                isFollowing={isFollowing}
                followLoading={followLoading}
                onBack={() => prevSearch ? navigate(`/search${prevSearch}`) : navigate(-1)}
                onFollow={handleFollow}
              />
            </div>

            {/* RATING HISTORY */}
            <section style={{ marginTop: 48 }}>
              <h2 className="section-title" style={{ marginBottom: 24, fontSize: 28, fontWeight: 800 }}>
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
