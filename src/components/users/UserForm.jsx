import { useState } from "react";

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

  const label = {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    color: "#4a3f3f",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  };

  const input = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 18,
    borderRadius: 8,
    border: "1px solid #e0d5cc",
    fontSize: 14,
    background: "#fdfbf8",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const button = {
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
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 380 }}>
      <div>
        <label style={label}>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          style={input}
          type="text"
        />
      </div>

      <div>
        <label style={label}>Email Address</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          style={input}
          type="email"
        />
      </div>

      <div>
        <label style={label}>Profile Picture URL</label>
        <input
          name="profilePictureUrl"
          value={form.profilePictureUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          style={input}
          type="text"
        />
      </div>

      <button
        type="submit"
        style={button}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      >
        Save Changes
      </button>
    </form>
  );
}
