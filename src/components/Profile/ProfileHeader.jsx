import { DEFAULT_AVATAR_URL } from "../../config/constants";
import RatingBreakdown from "./RatingBreakdown";
import TopGenres from "./TopGenres";
import ActionButtons from "./ActionButtons";

/** Profile header section - all profile details in one box */
export default function ProfileHeader({ profileUser, ratings, works, currentUser, userId, isFollowing, followLoading, onBack, onFollow }) {
  return (
    <>
      {/* Avatar, username, email row */}
      <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
        {/* Avatar */}
        <img
          src={profileUser.profilePictureUrl || DEFAULT_AVATAR_URL}
          alt="avatar"
          style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", border: "4px solid #e8dccf" }}
        />

        {/* Username */}
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

        {/* Email */}
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

      {/* Works Rated */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px", textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#9a4207", marginBottom: "8px" }}>
          {Object.keys(ratings).length}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#5d4c4c" }}>
          Works Rated
        </div>
      </div>

      {/* Rating Breakdown */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px" }}>
        <RatingBreakdown ratings={ratings} works={works} />
      </div>

      {/* Top Genres */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid #efe5db", marginTop: "24px" }}>
        <TopGenres ratings={ratings} works={works} />
      </div>

      {/* Action Buttons */}
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
