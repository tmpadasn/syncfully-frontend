import { useEffect, useState } from "react";
import { 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUserRatings, 
  getUserRecommendations 
} from "../api/users";
import { getAllWorks } from "../api/works";

import UserForm from "../components/users/UserForm";
import UserRatings from "../components/users/UserRatings";
import UserRecommendations from "../components/users/UserRecommendations";

const CURRENT_USER_ID = 1;

export default function Account() {
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [works, setWorks] = useState([]);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  /** ------------------------------
   *      LOAD ALL ACCOUNT DATA
   *  ------------------------------ */
  async function load() {
    /* -------- USER -------- */
    const u = await getUserById(CURRENT_USER_ID);
    setUser(u);

    /* -------- RATINGS -------- */
    const r = await getUserRatings(CURRENT_USER_ID);
    let ratingData = r.data || r;

    // Convert backend object → array if needed
    if (!Array.isArray(ratingData)) {
      ratingData = Object.entries(ratingData).map(([workId, rating]) => ({
        ...rating,
        workId: Number(workId),
      }));
    }
    setRatings(ratingData);

    /* -------- RECOMMENDATIONS -------- */
    const rec = await getUserRecommendations(CURRENT_USER_ID);
    const raw = rec.data || rec;

    let finalRecs = [];

    if (Array.isArray(raw)) {
      finalRecs = raw;
    } 
    else if (raw.recommendations) {
      finalRecs = raw.recommendations;
    }
    else if (raw.current || raw.profile) {
      finalRecs = [...(raw.current || []), ...(raw.profile || [])];
    }

    setRecommendations(finalRecs);

    /* -------- WORKS -------- */
    const all = await getAllWorks();
    const worksList =
      all.works || 
      all.data?.works || 
      all.data ||
      [];

    setWorks(worksList);
  }

  /** ------------------------------ */
  async function handleUpdate(data) {
    await updateUser(CURRENT_USER_ID, data);
    await load();
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    await deleteUser(CURRENT_USER_ID);
    alert("Account deleted");
  }

  if (!user) return <p>Loading account...</p>;

  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">

          <h1 className="section-title">Your Account</h1>

          {!editing ? (
            <>
              <img
                src={user.profilePictureUrl || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                alt="avatar"
                style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
              />
              <h2>{user.username}</h2>
              <p>{user.email}</p>

              {/* Styled Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>

                {/* Edit */}
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: "#9a4207c8",
                    color: "#fff",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    transition: "background 0.2s ease",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#a8531ccf")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#9a4207c8")}
                >
                  Edit Account
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  style={{
                    background: "#b3472f",
                    color: "#fff",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    transition: "background 0.2s ease",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#c1543a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#b3472f")}
                >
                  Delete Account
                </button>

              </div>
            </>
          ) : (
            <UserForm initial={user} onSubmit={handleUpdate} />
          )}

          {/* RATINGS */}
          <h3 className="section-title" style={{ marginTop: 40 }}>Your Ratings</h3>
          <UserRatings ratings={ratings} works={works} />

          {/* RECOMMENDATIONS */}
          <h3 className="section-title" style={{ marginTop: 40 }}>Recommended for You</h3>
          <UserRecommendations items={recommendations} />

        </main>
      </div>
    </div>
  );
}
