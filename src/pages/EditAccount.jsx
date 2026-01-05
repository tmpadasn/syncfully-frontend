/**
 * Edit Account Page
 *
 * Provides authenticated user's profile edit interface with real-time form validation
 * Loads current user data on mount and updates auth context after successful save
 *
 * Features:
 *   - Live profile information editing (username, email, password)
 *   - User avatar display with username tag
 *   - Email validation with inline error messaging
 *   - Success/error feedback with auto-redirect on success
 *   - Duplicate submission prevention
 *
 * Data Strategy:
 *   - Loads user data on mount into controlled form state
 *   - Validates email format client-side before API call
 *   - Updates auth context optimistically after server confirmation
 *   - Redirects to account page 1.5s after successful save
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserById, updateUser } from '../api/users';
import { DEFAULT_AVATAR_URL } from '../config/constants';
import { editAccountStyles } from '../styles/editAccountStyles';

// Helper: Validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

// Helper: Load user data into form state
const loadUserData = async (userId) => {
  const data = await getUserById(userId);
  return { username: data.username, email: data.email, password: "" };
};

// Helper: Update user and refresh auth context
const handleSaveUser = async (userId, formData, setUser, user) => {
  const updated = await updateUser(userId, formData);
  setUser({ ...user, username: updated.username, email: updated.email });
  return updated;
};

// Component: Reusable form field
const FormField = ({ label, name, type = "text", value, onChange, focused, setFocused, placeholder = "" }) => (
  <div style={editAccountStyles.fieldGroup}>
    <label style={editAccountStyles.label}>{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused(null)}
      type={type}
      placeholder={placeholder}
      style={{
        ...editAccountStyles.input,
        ...(focused === name ? editAccountStyles.inputFocus : {})
      }}
    />
    {type === 'password' && <p style={editAccountStyles.inputPlaceholder}>Only fill this if you want to change your password</p>}
  </div>
);

// Component: Reusable button with hover state
const ActionButton = ({ label, onClick, disabled, hover, setHover, color, marginTop = 0 }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{
      ...editAccountStyles.button(color),
      marginTop,
      ...(disabled ? editAccountStyles.buttonDisabled : {}),
      ...(hover && !disabled ? { transform: "translateY(-2px)", boxShadow: `0 6px 16px ${color === "#9a4207" ? "rgba(154, 66, 7, 0.3)" : "rgba(0, 0, 0, 0.2)"}` } : {})
    }}
  >
    {label}
  </button>
);

// Edit Account Page Component
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

  // Handler: Update form field
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handler: Save changes
  const handleSave = async () => {
    if (isSaving || !isValidEmail(form.email)) {
      if (!isValidEmail(form.email)) setMessage('Invalid email address'), setMessageType('error');
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
    <div style={editAccountStyles.container}>
      <div style={editAccountStyles.cardWrapper}>
        <h1 style={editAccountStyles.pageTitle}>Edit Profile</h1>
        {message && <div style={editAccountStyles.messageBox(messageType)}>{messageType === 'success' ? '✓' : '✕'} {message}</div>}
        <div style={editAccountStyles.card}>
          <div style={editAccountStyles.avatarContainer}>
            <img src={user.profilePictureUrl || DEFAULT_AVATAR_URL} alt="Profile" style={editAccountStyles.avatar} />
            <p style={editAccountStyles.usernameTag}>{form.username}</p>
          </div>
          <div style={editAccountStyles.sectionHeader}>Profile Information</div>
          <FormField label="Username" name="username" value={form.username} onChange={handleChange} focused={focusedInput} setFocused={setFocusedInput} />
          <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} focused={focusedInput} setFocused={setFocusedInput} />
          <FormField label="New Password" name="password" type="password" value={form.password} onChange={handleChange} focused={focusedInput} setFocused={setFocusedInput} placeholder="Leave blank to keep current password" />
          <div style={editAccountStyles.buttonContainer}>
            <ActionButton label={isSaving ? "Saving Changes..." : "Save Changes"} onClick={handleSave} disabled={isSaving} hover={saveHover} setHover={setSaveHover} color="#9a4207" />
            <ActionButton label="Cancel" onClick={() => navigate('/account')} disabled={isSaving} hover={cancelHover} setHover={setCancelHover} color="#6b6b6b" marginTop={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
