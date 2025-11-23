import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getUserById, updateUser } from "../api/users";

export default function EditAccount() {
  const { user, authLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profilePictureUrl: ""
  });

  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     Load user
  --------------------------------------------------------- */
  useEffect(() => {
    if (authLoading || !user) return;

    (async () => {
      const data = await getUserById(user.userId);
      setForm({
        username: data.username,
        email: data.email,
        password: "",
        profilePictureUrl: data.profilePictureUrl || ""
      });
      setLoading(false);
    })();
  }, [authLoading, user]);

  /* ---------------------------------------------------------
     Handlers
  --------------------------------------------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = await updateUser(user.userId, form);

      // update auth context
      setUser({
        ...user,
        username: updated.username,
        email: updated.email,
        profilePictureUrl: updated.profilePictureUrl
      });

      alert("Your account was updated.");
      navigate("/account");
    } catch (err) {
      alert("Update failed.");
      console.error(err);
    }
  };

  if (authLoading || loading) return <p>Loading…</p>;

  /* ---------------------------------------------------------
     UI Styles
  --------------------------------------------------------- */
  const card = {
    background: "#ffffff",
    padding: "28px",
    maxWidth: 460,
    margin: "0 auto",
    borderRadius: 14,
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)"
  };

  const label = {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    color: "#4a3f3f"
  };

  const input = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 18,
    borderRadius: 8,
    border: "1px solid #d4c4b0",
    fontSize: 15,
    background: "#faf8f5"
  };

  const button = (bg) => ({
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: ".3px",
    fontSize: 15,
    color: "#fff",
    background: bg,
    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
    transition: "0.15s"
  });

  const cancelBtn = {
    ...button("#888"),
    marginTop: 10
  };

  const avatarStyle = {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 18,
    border: "3px solid #ddd"
  };

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">

          <h1 className="section-title" style={{ textAlign: "center" }}>
            Edit Your Account
          </h1>

          <div style={card}>

            {/* Avatar Preview */}
            <div style={{ textAlign: "center" }}>
              <img
                src={
                  form.profilePictureUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                }
                alt="avatar"
                style={avatarStyle}
              />
            </div>

            {/* Username */}
            <div>
              <label style={label}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                style={input}
                type="text"
              />
            </div>

            {/* Email */}
            <div>
              <label style={label}>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                style={input}
                type="email"
              />
            </div>

            {/* Password */}
            <div>
              <label style={label}>New Password (optional)</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                style={input}
                type="password"
                placeholder="Leave blank to keep current password"
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label style={label}>Profile Picture URL</label>
              <input
                name="profilePictureUrl"
                value={form.profilePictureUrl}
                onChange={handleChange}
                style={input}
                type="text"
              />
            </div>

            {/* Buttons */}
            <button
              onClick={handleSave}
              style={button("linear-gradient(135deg,#0b6623,#0d7225)")}
            >
              Save Changes
            </button>

            <button
              onClick={() => navigate("/account")}
              style={cancelBtn}
            >
              Cancel
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}
