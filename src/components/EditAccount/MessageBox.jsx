/**
 * MessageBox Component
 * Displays success or error messages with styling
 */

export default function MessageBox({ message, messageType }) {
  // Don't render if no message
  if (!message) return null;

  // Determine styling based on message type
  const isSuccess = messageType === 'success';
  const icon = isSuccess ? '✓' : '✕';
  const borderColor = isSuccess ? '#66bb6a' : '#ef5350';
  const background = isSuccess
    ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
    : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
  const textColor = isSuccess ? '#1b5e20' : '#b71c1c';

  return (
    // Message box container with dynamic styles
    <div style={{
      padding: '16px 20px',
      marginBottom: 24,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: `2px solid ${borderColor}`,
      background: background,
      color: textColor
    }}>
      {/* Icon and message content */}
      {icon} {message}
    </div>
  );
}
