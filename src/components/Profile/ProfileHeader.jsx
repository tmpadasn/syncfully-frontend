import { DEFAULT_AVATAR_URL } from "../../config/constants";
import RatingBreakdown from "./RatingBreakdown";
import TopGenres from "./TopGenres";
import ActionButtons from "./ActionButtons";

/**
 * Profile header component - main profile information display
 * Shows all user details in a structured, visual layout:
 * - Avatar (circular profile picture)
 * - Username and email
 * - Works rated count
 * - Rating breakdown by type
 * - Top rated genres
 * - Action buttons (Back/Follow or Edit/Delete depending on context)
 *
 * Used by both Profile.jsx (viewing other users) and Account.jsx (own profile)
 *
 * Props:
 *   profileUser: User object with profile data
 *   ratings: Object map of work ratings
 *   works: Array of available works
 *   currentUser: Currently logged-in user (null on Account page)
 *   userId: ID of profile being viewed
 *   isFollowing: Follow status flag
 *   followLoading: Loading state for follow action
 *   onBack: Back navigation callback
 *   onFollow: Follow action callback
 */
export default function ProfileHeader({ profileUser, ratings, works, currentUser, userId, isFollowing, followLoading, onBack, onFollow }) {
  return (
    <>
      {/* Top row: Avatar + Username + Email */}
      <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
        {/* Circular profile picture */}
        <img
          src={profileUser.profilePictureUrl || DEFAULT_AVATAR_URL}
          alt="avatar"
          style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", border: "4px solid #e8dccf" }}
        />

        {/* Username column */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#8a6f5f",
              marginBottom: 10,
              opacity: 0.75,
              letterSpacing: 0.8,
            }}
          >
            USERNAME
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#3b2e2e",
            }}
          >
            {profileUser.username}
          </div>
        </div>

        {/* Email column */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#8a6f5f",
              marginBottom: 10,
              opacity: 0.75,
              letterSpacing: 0.8,
            }}
          >
            EMAIL ADDRESS
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#3b2e2e",
            }}
          >
            {profileUser.email}
          </div>
        </div>
      </div>

      {/* Works Rated count section */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px", textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#9a4207", marginBottom: "8px" }}>
          {Object.keys(ratings).length}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#5d4c4c" }}>
          Works Rated
        </div>
      </div>

      {/* Rating Breakdown by Type section */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px" }}>
        <RatingBreakdown ratings={ratings} works={works} />
      </div>

      {/* Top Genres section */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px" }}>
        <TopGenres ratings={ratings} works={works} />
      </div>

      {/* Action Buttons section (Back/Follow or Empty) */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px" }}>
        <ActionButtons
          currentUser={currentUser}
          userId={userId}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onBack={onBack}
          onFollow={onFollow}
        />
      </div>
    </>
  );
}
