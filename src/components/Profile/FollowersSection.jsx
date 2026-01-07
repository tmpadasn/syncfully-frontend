import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR_URL } from "../../config/constants";

/** Followers list section */
export default function FollowersSection({ followers = [] }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Section Title */}
      <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#8a6f5f", marginBottom: 14, opacity: 0.75, letterSpacing: 0.8 }}>
        👥 Followers
      </div>
      {followers.length === 0 ? (
        <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13 }}>No followers yet</div>
      ) : (
        // Users Grid
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
          {followers.map((follower) => (
            <div
              key={follower.userId || follower.id}
              onClick={() => navigate(`/profile/${follower.userId || follower.id}`)}
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
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e8dccf",
                  display: "block",
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
  );
}
