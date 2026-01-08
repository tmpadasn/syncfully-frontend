import { useNavigate } from "react-router-dom";

/**
 * Edit and Delete account action buttons component
 * Displays two buttons in a side-by-side grid:
 * - Edit Account: navigates to /account/edit for profile editing
 * - Delete Account: triggers account deletion with confirmation
 *
 * Only shown on Account page (Account.jsx), never on Profile pages
 *
 * Props:
 *   onDelete: Callback function for account deletion (includes confirmation logic)
 */
export default function EditDeleteButtons({ onDelete }) {
  const navigate = useNavigate();

  return (
    // Two-column grid with equal width buttons separated by gap
    <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 32,
          paddingTop: 32,
          borderTop: "1px solid #efe5db" }}>
      {/* Edit Account Button - navigates to account edit form */}
      <button
        style={{
          padding: "13px 26px",
          borderRadius: 8,
          border: "none",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          color: "#fff",
          background: "linear-gradient(135deg,#9a4207,#b95716)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
        }}
        onClick={() => navigate("/account/edit")}
        // Lift button on hover for visual feedback
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      >
        ✏️ Edit Account
      </button>

      {/* Delete Account Button - triggers account deletion */}
      <button
        style={{
          padding: "13px 26px",
          borderRadius: 8,
          border: "none",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          color: "#fff",
          background: "#c0392b",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
        }}
        onClick={onDelete}
        // Lift button on hover for visual feedback
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      >
        🗑️ Delete Account
      </button>
    </div>
  );
}
