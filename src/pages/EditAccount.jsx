import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getUserById, updateUser } from "../api/users";
import { DEFAULT_AVATAR_URL } from "../config/constants";

/* EditAccount
  Renders a simple profile edit form. On mount the component loads the
  current user's data into local form state. Saving issues an update call
  and updates the authentication context with the server response.
*/


// This component provides the authenticated user's profile edit UX and handles form state and submission.
// Comments explain lifecycle points and non-obvious UI decisions; behaviour unchanged.
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

  // Load user
    /* Lifecycle: preload current user fields into local form state so the
      edit form operates purely as a controlled component. */
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

  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent duplicate submissions
    // Client-side email validation: provide immediate, test-detectable feedback
    // and avoid making the update API call when the email format is invalid.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(String(form.email).trim())) {
      setMessage('Invalid email address');
      setMessageType('error');
      return;
    }
    
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

  /* Update flow: apply optimistic UI by updating local auth context after server success.
     This separates server validation errors from local form state management. */

  const handleCancel = () => {
    navigate('/account');
  };

  // Input focus and button hover states
  const [focusedInput, setFocusedInput] = React.useState(null);
  const [saveHover, setSaveHover] = React.useState(false);
  const [cancelHover, setCancelHover] = React.useState(false);

  if (authLoading || loading) return <p>Loading…</p>;

  /* ===================== UI STYLES ===================== */
  const styles = {
    // Page layout
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "40px 20px",
      background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
    },
    cardWrapper: {
      width: "100%",
      maxWidth: "600px",
    },
    card: {
      width: "100%",
      background: "#ffffff",
      padding: "50px 80px",
      borderRadius: 20,
      boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
      border: "1px solid rgba(154, 66, 7, 0.1)",
      boxSizing: "border-box",
    },

    // Headings and sections
    pageTitle: {
      textAlign: "center",
      marginBottom: 32,
      fontSize: 36,
      fontWeight: 900,
      color: "#392c2c",
      letterSpacing: "-0.5px"
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 800,
      color: "#392c2c",
      marginBottom: 20,
      marginTop: 28,
      paddingBottom: 10,
      borderBottom: "2px solid #9a420740",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },

    // Form elements
    fieldGroup: {
      marginBottom: 24,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 8,
      color: "#6b5b4f",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: 10,
      border: "2px solid #e0d5cc",
      fontSize: 15,
      background: "#fdfbf8",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#9a4207",
      background: "#fff",
      boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)",
    },
    inputPlaceholder: {
      fontSize: 12,
      color: "#9a8371",
      marginTop: 6,
      fontStyle: "italic"
    },

    // Avatar section
    avatarContainer: {
      textAlign: "center",
      marginBottom: 36,
      paddingBottom: 32,
      borderBottom: "2px solid #f0e8dc",
    },
    avatar: {
      width: 140,
      height: 140,
      borderRadius: "50%",
      objectFit: "cover",
      border: "5px solid #9a4207",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
    usernameTag: {
      marginTop: 16,
      fontSize: 14,
      color: "#8b7355",
      fontWeight: 600
    },

    // Buttons
    buttonContainer: {
      marginTop: 36
    },
    button: (bg) => ({
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
    }),
    buttonPrimary: {
      background: "#9a4207",
    },
    buttonSecondary: {
      background: "#6b6b6b",
      marginTop: 12,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
    },

    // Messages
    messageBox: (type) => ({
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
    }),
  };

  // RETURN EDIT ACCOUNT PAGE LAYOUT
  return (
    <div style={styles.container}>
      <div style={styles.cardWrapper}>
        <h1 style={styles.pageTitle}>
          Edit Profile
        </h1>

        {message && (
          <div style={styles.messageBox(messageType)}>
            {messageType === 'success' ? '✓' : '✕'} {message}
          </div>
        )}

        <div style={styles.card}>

              {/* Avatar Section */}
              <div style={styles.avatarContainer}>
                <img
                  src={
                    user.profilePictureUrl ||
                    DEFAULT_AVATAR_URL
                  }
                  alt="Profile"
                  style={styles.avatar}
                />
                <p style={styles.usernameTag}>
                  @{form.username}
                </p>
              </div>

              {/* Profile Information Section */}
              <div style={styles.sectionHeader}>
                Profile Information
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'username' ? styles.inputFocus : {})
                  }}
                  type="text"
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'email' ? styles.inputFocus : {})
                  }}
                  type="email"
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'password' ? styles.inputFocus : {})
                  }}
                  type="password"
                  placeholder="Leave blank to keep current password"
                />
                <p style={styles.inputPlaceholder}>
                  Only fill this if you want to change your password
                </p>
              </div>

              {/* Action Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  onMouseEnter={() => setSaveHover(true)}
                  onMouseLeave={() => setSaveHover(false)}
                  style={{
                    ...styles.button("#9a4207"),
                    ...(isSaving ? styles.buttonDisabled : {}),
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
                    ...styles.button("#6b6b6b"),
                    marginTop: 12,
                    ...(isSaving ? styles.buttonDisabled : {}),
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
