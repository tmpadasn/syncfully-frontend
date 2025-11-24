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
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const [isSaving, setIsSaving] = useState(false);

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
    if (isSaving) return; // Prevent duplicate submissions
    
    try {
      setMessage(null);
      setIsSaving(true);
      const updated = await updateUser(user.userId, form);

      // Update auth context
      setUser({
        ...user,
        username: updated.username,
        email: updated.email,
        profilePictureUrl: updated.profilePictureUrl
      });

      // Show success message briefly, then redirect
      setMessage("✓ Changes saved successfully!");
      setMessageType("success");
      
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Update failed.";
      setMessage(errorMsg);
      setMessageType("error");
      setIsSaving(false);
    }
  };

  if (authLoading || loading) return <p>Loading…</p>;

  /* ---------------------------------------------------------
     UI Styles
  --------------------------------------------------------- */
  const container = {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
  };

  const card = {
    background: "#ffffff",
    padding: "40px 36px",
    maxWidth: 480,
    margin: "0 auto",
    borderRadius: 14,
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  };

  const label = {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
    color: "#4a3f3f",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  };

  const input = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 20,
    borderRadius: 8,
    border: "1px solid #e0d5cc",
    fontSize: 15,
    background: "#fdfbf8",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const button = (bg) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: ".3px",
    fontSize: 15,
    color: "#fff",
    background: bg,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
  });

  const cancelBtn = {
    ...button("#a0a0a0"),
    marginTop: 12,
  };

  const avatarStyle = {
    width: 130,
    height: 130,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 24,
    border: "4px solid #e8dccf",
  };

  const messageBox = (type) => ({
    padding: "12px 16px",
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    ...(type === 'success' ? {
      border: "1px solid #c3e6cb",
      background: "#d4edda",
      color: "#155724"
    } : {
      border: "1px solid #f5c6cb",
      background: "#f8d7da",
      color: "#721c24"
    })
  });

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <div style={container}>
      <div className="page-container">
        <div className="page-inner">
          <main className="page-main" style={{ maxWidth: 520, margin: "0 auto" }}>

            <h1 className="section-title" style={{ textAlign: "center", marginBottom: 32, fontSize: 32, fontWeight: 800 }}>
              Edit Your Account
            </h1>

            {message && (
              <div style={{ maxWidth: 480, margin: "0 auto 20px", ...messageBox(messageType) }}>
                {message}
              </div>
            )}

            <div style={card}>

              {/* Avatar Preview */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <img
                  src={
                    form.profilePictureUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  alt="avatar"
                  style={avatarStyle}
                />
              </div>

              <div style={{ maxWidth: 420, margin: "0 auto" }}>
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
                  <label style={label}>Email Address</label>
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
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Buttons */}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    ...button("linear-gradient(135deg,#2e7d32,#388e3c)"),
                    ...(isSaving ? { opacity: 0.7, cursor: "not-allowed" } : {})
                  }}
                  onMouseEnter={(e) => !isSaving && (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>

                <button
                  onClick={() => navigate("/account")}
                  disabled={isSaving}
                  style={{
                    ...cancelBtn,
                    ...(isSaving ? { opacity: 0.7, cursor: "not-allowed" } : {})
                  }}
                  onMouseEnter={(e) => !isSaving && (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  Cancel
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
