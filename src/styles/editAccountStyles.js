/**
 * Edit Account Page Styles
 *
 * Centralized style object for EditAccount page component
 * Organized by functional section for maintainability and reusability
 *
 * Sections:
 *   - Page Layout: container, cardWrapper, card
 *   - Headings: pageTitle, sectionHeader
 *   - Form Elements: fieldGroup, label, input, inputFocus, inputPlaceholder
 *   - Avatar: avatarContainer, avatar, usernameTag
 *   - Buttons: buttonContainer, button, buttonPrimary, buttonSecondary, buttonDisabled, buttonHover
 *   - Messages: messageBox (success/error variants)
 */

/**
 * Edit Account Styles Object
 *
 * Contains all inline styles for the EditAccount page
 * Some styles are functions to support dynamic values (e.g., button colors, message types)
 *
 * Usage: import styles, then apply with style={styles.propertyName}
 */
export const editAccountStyles = {
  // Page layout - centered card container
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

  // Buttons - dynamic function for custom background colors
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

  // Messages - dynamic function for success/error variants
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
