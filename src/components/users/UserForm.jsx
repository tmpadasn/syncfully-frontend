import { useState } from "react";

// UserForm: small controlled form used for editing basic user fields.
// It manages local form state and emits a single `onSubmit` event with the form payload.
/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== FORM CONTAINER ===================== */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    maxWidth: 380,
  },

  /* ===================== FORM LABEL ===================== */
  label: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    color: "#4a3f3f",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },

  /* ===================== FORM INPUT ===================== */
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 18,
    borderRadius: 8,
    border: "1px solid #e0d5cc",
    fontSize: 14,
    background: "#fdfbf8",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },

  /* ===================== SUBMIT BUTTON ===================== */
  button: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    color: "#fff",
    background: "linear-gradient(135deg,#2e7d32,#388e3c)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
  },
};

export default function UserForm({ initial = {}, onSubmit }) {
  const [form, setForm] = useState({
    username: initial.username || "",
    email: initial.email || "",
    profilePictureUrl: initial.profilePictureUrl || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div>
        <label style={styles.label}>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          style={styles.input}
          type="text"
        />
      </div>

      <div>
        <label style={styles.label}>Email Address</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          style={styles.input}
          type="email"
        />
      </div>

      <div>
        <label style={styles.label}>Profile Picture URL</label>
        <input
          name="profilePictureUrl"
          value={form.profilePictureUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          style={styles.input}
          type="text"
        />
      </div>

      <button
        type="submit"
        style={styles.button}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      >
        Save Changes
      </button>
    </form>
  );
}
