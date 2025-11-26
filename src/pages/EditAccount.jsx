import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getUserById, updateUser } from "../api/users";

export default function EditAccount() {
  const { user, authLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
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
        password: ""
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
        email: updated.email
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

  const handleCancel = () => {
    navigate('/account');
  };

  // Input focus and button hover states
  const [focusedInput, setFocusedInput] = React.useState(null);
  const [saveHover, setSaveHover] = React.useState(false);
  const [cancelHover, setCancelHover] = React.useState(false);

  if (authLoading || loading) return <p>Loading…</p>;

  /* ---------------------------------------------------------
     UI Styles
  --------------------------------------------------------- */
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
  };

  const cardWrapper = {
    width: "100%",
    maxWidth: "600px",
  };

  const card = {
    width: "100%",
    background: "#ffffff",
    padding: "50px 80px",
    borderRadius: 20,
    boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
    border: "1px solid rgba(154, 66, 7, 0.1)",
    boxSizing: "border-box",
  };

  const sectionHeader = {
    fontSize: 18,
    fontWeight: 800,
    color: "#392c2c",
    marginBottom: 20,
    marginTop: 28,
    paddingBottom: 10,
    borderBottom: "2px solid #9a420740",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  };

  const fieldGroup = {
    marginBottom: 24,
  };

  const label = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    color: "#6b5b4f",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  };

  const input = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: "2px solid #e0d5cc",
    fontSize: 15,
    background: "#fdfbf8",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const inputFocus = {
    borderColor: "#9a4207",
    background: "#fff",
    boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)",
  };

  const button = (bg, hoverBg) => ({
    width: "100%",
    padding: "16px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: ".5px",
    fontSize: 16,
    color: "#fff",
    background: bg,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  });

  const avatarContainer = {
    textAlign: "center",
    marginBottom: 36,
    paddingBottom: 32,
    borderBottom: "2px solid #f0e8dc",
  };

  const avatarStyle = {
    width: 140,
    height: 140,
    borderRadius: "50%",
    objectFit: "cover",
    border: "5px solid #9a4207",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  };

  const messageBox = (type) => ({
    padding: "16px 20px",
    marginBottom: 24,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 10,
    ...(type === 'success' ? {
      border: "2px solid #66bb6a",
      background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      color: "#1b5e20"
    } : {
      border: "2px solid #ef5350",
      background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
      color: "#b71c1c"
    })
  });

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <div style={container}>
      <div style={cardWrapper}>
        <h1 
          style={{ 
            textAlign: "center", 
            marginBottom: 32, 
            fontSize: 36, 
            fontWeight: 900,
            color: "#392c2c",
            letterSpacing: "-0.5px"
          }}
        >
          Edit Profile
        </h1>

        {message && (
          <div style={{ ...messageBox(messageType), marginBottom: 24 }}>
            {messageType === 'success' ? '✓' : '✕'} {message}
          </div>
        )}

        <div style={card}>

              {/* Avatar Section */}
              <div style={avatarContainer}>
                <img
                  src={
                    user.profilePictureUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  alt="Profile"
                  style={avatarStyle}
                />
                <p style={{ 
                  marginTop: 16, 
                  fontSize: 14, 
                  color: "#8b7355",
                  fontWeight: 600 
                }}>
                  @{form.username}
                </p>
              </div>

              {/* Profile Information Section */}
              <div style={sectionHeader}>
                Profile Information
              </div>

              <div style={fieldGroup}>
                <label style={label}>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...input,
                    ...(focusedInput === 'username' ? inputFocus : {})
                  }}
                  type="text"
                />
              </div>

              <div style={fieldGroup}>
                <label style={label}>Email Address</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...input,
                    ...(focusedInput === 'email' ? inputFocus : {})
                  }}
                  type="email"
                />
              </div>

              <div style={fieldGroup}>
                <label style={label}>New Password</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...input,
                    ...(focusedInput === 'password' ? inputFocus : {})
                  }}
                  type="password"
                  placeholder="Leave blank to keep current password"
                />
                <p style={{
                  fontSize: 12,
                  color: "#9a8371",
                  marginTop: 6,
                  fontStyle: "italic"
                }}>
                  Only fill this if you want to change your password
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 36 }}>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  onMouseEnter={() => setSaveHover(true)}
                  onMouseLeave={() => setSaveHover(false)}
                  style={{
                    ...button("#9a4207", "#7a3205"),
                    opacity: isSaving ? 0.6 : 1,
                    ...(saveHover && !isSaving ? { 
                      transform: "translateY(-2px)", 
                      boxShadow: "0 6px 16px rgba(154, 66, 7, 0.3)" 
                    } : {})
                  }}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  onMouseEnter={() => setCancelHover(true)}
                  onMouseLeave={() => setCancelHover(false)}
                  style={{
                    ...button("#6b6b6b", "#5b5b5b"),
                    marginTop: 12,
                    opacity: isSaving ? 0.6 : 1,
                    ...(cancelHover && !isSaving ? { 
                      transform: "translateY(-2px)", 
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)" 
                    } : {})
                  }}
                >
                  Cancel
                </button>
              </div>

        </div>
      </div>
    </div>
  );
}
