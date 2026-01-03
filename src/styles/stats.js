// Small style tokens for stat cards used in Account/Profile pages.
// These keep the look consistent across pages.
export const statsStyles = {
  statCard: {
    background: "linear-gradient(135deg, #faf6f1 0%, #f5f0ea 100%)",
    padding: "20px 16px",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    flex: 1,
    textAlign: "center",
    border: "1px solid #efe5db",
  },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "#9a4207",
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.75,
    marginTop: 8,
    fontWeight: 600,
  },
};

// The `statsStyles` object provides small, reusable tokens for statistic
// presentation (value, label, card). Using tokens ensures a consistent
// visual treatment across `Account` and `Profile` pages.
