import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { 
  getUserById, 
  deleteUser, 
  getUserRatings, 
} from "../api/users";

import { getAllWorks } from "../api/works";
import UserRatings from "../components/users/UserRatings";

export default function Account() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  const [backendUser, setBackendUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [works, setWorks] = useState([]);
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

        const [u, ratingsResponse, allWorks] = await Promise.all([
          getUserById(userId),
          getUserRatings(userId),
          getAllWorks()
        ]);

        setBackendUser(u);

        const ratingsObject = ratingsResponse?.ratings || ratingsResponse || {};
        const ratingsArray = Object.entries(ratingsObject).map(([workId, d]) => ({
          workId: Number(workId),
          score: d.score,
          ratedAt: d.ratedAt
        }));

        setRatings(ratingsArray);
        setWorks(allWorks?.works || []);

      } catch (err) {
        console.error("Account load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authLoading, user]);

  if (authLoading || loading || !backendUser) {
    return <p>Loading your account…</p>;
  }

  /* ---------------------------------------------------------
     DELETE ACCOUNT
  --------------------------------------------------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete your account?")) return;

    try {
      await deleteUser(backendUser.userId);
      logout();
      navigate("/");
    } catch {
      alert("Failed to delete account.");
    }
  };

  /* ---------------------------------------------------------
      STYLES
  --------------------------------------------------------- */
  const profileCard = {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    maxWidth: "750px",
    margin: "0 auto 40px",
  };

  const avatarStyle = {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e8dccf",
  };

  const infoLabel = {
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
    color: "#7a5a3f",
    marginBottom: 4,
    opacity: 0.7,
  };

  const statCard = {
    background: "#faf6f1",
    padding: "16px",
    borderRadius: 12,
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.06)",
    flex: 1,
    textAlign: "center",
  };

  const actionButton = (bg) => ({
    padding: "12px 22px",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    color: "#fff",
    background: bg,
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    transition: "opacity .15s",
  });

  /* ---------------------------------------------------------
      RENDER
  --------------------------------------------------------- */
  return (
    <div className="page-container">
      <div className="page-inner">

        <main className="page-main">

          <h1 className="section-title" style={{ textAlign: "center" }}>
            Your Account
          </h1>

          {/* PROFILE SECTION */}
          <div style={profileCard}>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              
              {/* Avatar */}
              <img
                src={
                  backendUser.profilePictureUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                }
                alt="avatar"
                style={avatarStyle}
              />

              {/* User Info */}
              <div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#3b2e2e" }}>
                  {backendUser.username}
                </h2>

                <div style={{ marginTop: 8 }}>
                  <div style={infoLabel}>Email</div>
                  <div>{backendUser.email}</div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={infoLabel}>Joined</div>
                  <div>
                    {backendUser.createdAt
                      ? new Date(backendUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={infoLabel}>Last Active</div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div
              style={{
                display: "flex",
                marginTop: 28,
                gap: 16,
              }}
            >
              <div style={statCard}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{ratings.length}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Rated Works</div>
              </div>

              <div style={statCard}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {new Set(ratings.map((r) => r.workId)).size}
                </div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Unique Items</div>
              </div>

              <div style={statCard}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {Math.round(
                    ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length || 0
                  )}
                </div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Avg Rating</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              
              <button
                style={actionButton("linear-gradient(135deg,#9a4207,#b95716)")}
                onClick={() => navigate("/account/edit")}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Edit Account
              </button>

              <button
                style={actionButton("#c0392b")}
                onClick={handleDelete}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Delete Account
              </button>

            </div>
          </div>

          {/* RATING HISTORY */}
          <section>
            <h2 className="section-title">Your Rating History</h2>
            <UserRatings ratings={ratings} works={works} />
          </section>
        </main>
      </div>
    </div>
  );
}
