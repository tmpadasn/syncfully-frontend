/**
 * Edit Account Page - User profile edit interface with form validation
 * Features: Live editing (username, email, password), avatar display, email validation,
 * success/error feedback with auto-redirect, duplicate submission prevention
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { getUserById, updateUser } from '../api';
import { FormField, ActionButton, ProfileHeader, MessageBox } from '../components';

// Style definitions for layout, typography, and spacing
const styles = {
  container: { minHeight: '100vh', padding: '40px 20px', background: 'var(--bg)',
               display: 'flex', justifyContent: 'center', alignItems: 'center' },
  cardWrapper: { width: '100%', maxWidth: '600px' },
  pageTitle: { textAlign: 'center', marginBottom: 32, fontSize: 36, fontWeight: 900, color: '#392c2c', letterSpacing: '-0.5px' },
  card: { width: '100%', background: '#ffffff', padding: '36px 80px', borderRadius: 20,
          boxShadow: '0 24px 48px rgba(0,0,0,0.1)', border: '1px solid rgba(154, 66, 7, 0.1)', boxSizing: 'border-box' },
  sectionHeader: { fontSize: 18, fontWeight: 800, color: '#392c2c', marginBottom: 20, marginTop: 32, paddingBottom: 12,
                   borderBottom: '2px solid rgba(154, 66, 7, 0.25)', textTransform: 'uppercase', letterSpacing: 0.8 },
  buttonContainer: { marginTop: 36 }
};

// Validation: Check email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
// API: Fetch user data from backend
const loadUserData = async (userId) => { const data = await getUserById(userId);
                     return { username: data.username, email: data.email, password: "" }; };
// API: Update user data and refresh auth context
const handleSaveUser = async (userId, formData, setUser, user) => {
      const updated = await updateUser(userId, formData);
                            setUser({ ...user, username: updated.username, email: updated.email });
                      return updated; };

export default function EditAccount() {
  const { user, authLoading, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (authLoading || !user) return;

    (async () => {
      try {
        const formData = await loadUserData(user.userId);
        setForm(formData);
      } catch (err) {
        setMessage('Failed to load profile data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  // Update form field on input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validate and save profile changes
  const handleSave = async () => {
    if (isSaving || !isValidEmail(form.email)) {
      if (!isValidEmail(form.email)) {
        setMessage('Invalid email address');
        setMessageType('error');
      }
      return;
    }

    try {
      setIsSaving(true);
      await handleSaveUser(user.userId, form, setUser, user);
      setMessage("✓ Changes saved successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/account"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
      setMessageType("error");
      setIsSaving(false);
    }
  };

  if (authLoading || loading) return <p>Loading…</p>;

  return (
    <div style={styles.container}>
      <div style={styles.cardWrapper}>
        {/* Page title */}
        <h1 style={styles.pageTitle}>
          Edit Profile
        </h1>

        {/* Feedback message */}
        <MessageBox message={message} messageType={messageType} />

        <div style={styles.card}>
          {/* Avatar section */}
          <ProfileHeader user={user} />

          {/* Form header */}
          <div style={styles.sectionHeader}>
            Profile Information
          </div>

          {/* Username field */}
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            focused={focusedInput}
            setFocused={setFocusedInput}
          />

          {/* Email field */}
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            focused={focusedInput}
            setFocused={setFocusedInput}
          />

          {/* Password field */}
          <FormField
            label="New Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            focused={focusedInput}
            setFocused={setFocusedInput}
            placeholder="Leave blank to keep current password"
          />

          {/* Action buttons */}
          <div style={{ marginTop: 36 }}>
            <ActionButton
              label={isSaving ? "Saving Changes..." : "Save Changes"}
              onClick={handleSave}
              disabled={isSaving}
              hover={saveHover}
              setHover={setSaveHover}
              color="#9a4207"
            />
            <ActionButton
              label="Cancel"
              onClick={() => navigate('/account')}
              disabled={isSaving}
              hover={cancelHover}
              setHover={setCancelHover}
              color="#6b6b6b"
              marginTop={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
}