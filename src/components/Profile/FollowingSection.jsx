import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR_URL } from "../../config/constants";

/**
 * Reusable user list section - displays users in a grid (followers or following)
 * Shows clickable user cards with profile picture and username.
 * Each card navigates to the user's profile when clicked.
 *
 * Props:
 *   users: Array of user objects (default: empty array)
 *   title: Section title to display (e.g., "Following", "Followers")
 *   emoji: Emoji to display in title (e.g., "👫", "👥")
 *   emptyMessage: Message to show when list is empty
 */
function UserListSection({ users = [], title = "Users", emoji = "👤", emptyMessage = "No users yet" }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Section title */}
      <div style={{
            fontSize: 13,
            fontWeight: 800,
            textTransform: "uppercase",
            color: "#8a6f5f",
            marginBottom: 14,
            opacity: 0.75,
            letterSpacing: 0.8 }}>
        {emoji} {title}
      </div>

      {/* Empty state or user grid */}
      {users.length === 0 ? (
        <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13 }}>{emptyMessage}</div>
      ) : (
        // Responsive grid of user cards (120px width, auto-fill columns)
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
          {/* Render each user as a clickable card */}
          {users.map((user) => (
            <div
              key={user.userId || user.id}
              // Navigate to user's profile on click
              onClick={() => navigate(`/profile/${user.userId || user.id}`)}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                border: "1.5px solid #e8dccf",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                boxSizing: "border-box",
                background: "linear-gradient(135deg, #fff9f5 0%, #fef5f0 100%)",
                cursor: "pointer",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                overflow: "hidden",
              }}
              // Hover effect: lift card up with shadow
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(154, 66, 7, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Circular profile picture */}
              <img
                src={user.profilePictureUrl || DEFAULT_AVATAR_URL}
                alt={user.username}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e8dccf",
                  display: "block",
                }}
              />
              {/* Username display */}
              <div style={{ fontSize: 12, fontWeight: 600, color: "#3b2e2e", marginTop: 6 }}>
                {user.username}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Following list section - displays users that this user is following
 *
 * Props:
 *   following: Array of followed user objects (default: empty array)
 */
export function FollowingSection({ following = [] }) {
  return (
    <UserListSection
      users={following}
      title="Following"
      emoji="👫"
      emptyMessage="Not following anyone yet"
    />
  );
}

/**
 * Followers list section - displays user's followers
 *
 * Props:
 *   followers: Array of follower user objects (default: empty array)
 */
export function FollowersSection({ followers = [] }) {
  return (
    <UserListSection
      users={followers}
      title="Followers"
      emoji="👥"
      emptyMessage="No followers yet"
    />
  );
}

export default FollowingSection;
