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

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:300 }}>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        style={{ padding:8 }}
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        style={{ padding:8 }}
      />

      <input
        name="profilePictureUrl"
        value={form.profilePictureUrl}
        onChange={handleChange}
        placeholder="Profile Picture URL"
        style={{ padding:8 }}
      />

      <button
        type="submit"
        style={{
          padding: "10px 14px",
          background: "#0b6623",
          color: "#fff",
          borderRadius: 6,
          fontWeight: "600"
        }}
      >
        Save Changes
      </button>
    </form>
  );
}
