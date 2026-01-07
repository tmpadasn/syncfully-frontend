/**
 * Action buttons for profile navigation and follow functionality
 * Conditionally renders:
 * - Back to Search button (navigates to previous search or back)
 * - Follow/Unfollow button (only shown when viewing other users' profiles)
 *
 * Props:
 *   currentUser: Current authenticated user object
 *   userId: ID of the profile being viewed
 *   isFollowing: Boolean flag indicating follow status
 *   followLoading: Boolean flag for follow action in progress
 *   onBack: Callback function to navigate back
 *   onFollow: Callback function to toggle follow status
 */
export default function ActionButtons({
  currentUser,
  userId,
  isFollowing,
  followLoading,
  onBack,
  onFollow
}) {
  // Determine which buttons should be rendered
  const hasBackButton = onBack;
  // Only show follow button when viewing another user's profile
  const hasFollowButton = currentUser && parseInt(userId) !== currentUser.userId;

  // Return null if no buttons to show to avoid rendering empty grid
  if (!hasBackButton && !hasFollowButton) {
    return null;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: hasBackButton && hasFollowButton ? "1fr 1fr" : "1fr",
        gap: 16,
        marginTop: 32,
      }}
    >
      {/* Back button - shown only when onBack is provided */}
      {onBack && (
        <button
          style={{
            padding: "13px 26px",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            color: "#fff",
            background: "linear-gradient(135deg,#d4a574,#e8b896)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            transition:
              "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
          }}
          onClick={onBack}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          ← Back to Search
        </button>
      )}

      {/* Follow button - shown only for other users */}
      {currentUser && parseInt(userId) !== currentUser.userId && (
        <button
          style={{
            padding: "13px 26px",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            color: "#fff",
            background: isFollowing
              ? "#c0392b"
              : "linear-gradient(135deg,#9a4207,#b95716)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            transition:
              "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
          }}
          onClick={onFollow}
          disabled={followLoading}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          {isFollowing ? '✕ Unfollow' : '+ Follow'}
        </button>
      )}
    </div>
  );
}
