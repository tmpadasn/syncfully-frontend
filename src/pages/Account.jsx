import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAccountData from "../hooks/useAccountData";
import { Skeleton } from "../components/SkeletonBase";
import logger from "../utils/logger";

import {
  deleteUser,
} from "../api/users";

import UserRatings from "../components/UserRatings";
import ProfileHeader from "../components/Profile/ProfileHeader";
import FollowersSection from "../components/Profile/FollowersSection";
import FollowingSection from "../components/Profile/FollowingSection";
import EditDeleteButtons from "../components/Profile/EditDeleteButtons";


/* ===================== ACCOUNT PAGE FUNCTION ===================== */
// Account page component.
// Presents the authenticated user's profile, computed statistics, followers
// and following lists, and rating history. Data is fetched once on mount and
// grouped to minimize redundant API calls and re-renders.
// Notes: batching of API calls reduces latency; ratings are filtered to the current catalogue.
export default function Account() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch account data
  const { backendUser, ratings, works, followers, following, loading } = useAccountData(
    user?.userId
  );
  // Show loading state while authenticating
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
  // Show loading state while fetching account data
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

  // Delete account
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
  // Rationale: Require explicit confirmation to prevent accidental destructive actions.
  // Rationale: Clearing client session immediately avoids lingering auth state after deletion.

  /* ===================== UI RENDERING ===================== */
  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", background: "var(--bg)" }}>
      <div className="page-container">
        <div className="page-inner">

          <main className="page-main" style={{ maxWidth: 860, margin: "0 auto" }}>

            <h1 className="section-title" style={{ textAlign: "center", marginBottom: 40, fontSize: 36, fontWeight: 800 }}>
              Your Account
            </h1>

            {/* Profile Section - Header, Stats, and Actions in One Box */}
            <div style={{ background: "#fff", padding: "40px 36px", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", maxWidth: "820px", margin: "0 auto 48px" }}>
              {/* Profile Header Component */}
              <div>
                <ProfileHeader
                  profileUser={backendUser}
                  ratings={ratings}
                  works={works}
                  currentUser={null}
                  userId={null}
                  isFollowing={false}
                  followLoading={false}
                  onBack={null}
                  onFollow={null}
                />
              </div>

              {/* Followers Section */}
              <div style={{ paddingTop: 32 }}>
                <FollowersSection followers={followers} />
              </div>

              {/* Following Section */}
              <div style={{ paddingTop: 32, borderTop: "1px solid #efe5db", marginTop: 24 }}>
                <FollowingSection following={following} />
              </div>

              {/* Edit and Delete Buttons */}
              <EditDeleteButtons onDelete={handleDelete} />
            </div>

            {/* Rating History */}
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
