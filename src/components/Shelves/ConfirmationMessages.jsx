/*
 * Contains reusable confirmation message and delete confirmation modal components.
 */

/**
 * MessageAlert Component
 * Reusable success/error message display component.
 * Used across the app for displaying feedback messages.
 */
export function MessageAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
        color: message.type === 'error' ? '#c62828' : '#2e7d32',
        border: message.type === 'error' ? '1px solid #ef5350' : '1px solid #66bb6a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <span>{message.text}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 8px',
            lineHeight: '1',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ×
        </button>
      )}
    </div>
  );
}

/**
 * DeleteConfirmation Modal Component
 * Displays a confirmation dialog before deleting a shelf.
 * Prevents accidental deletions with a secondary confirmation step.
 * Shows success/error messages within the modal.
 */
export function DeleteConfirmation({
  isOpen,           // Controls modal visibility
  shelfName,        // Name of shelf to be deleted (displayed in message)
  message,          // Message object { type: 'success' | 'error', text: string }
  onCancel,         // Callback when user cancels deletion
  onConfirm,        // Callback when user confirms deletion
}) {
  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }} onClick={onCancel}>
      {/* Dialog container - stops propagation to prevent closing on inner click */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#392c2c',
          marginBottom: '12px',
        }}>Delete Shelf?</h3>

        {/* Message with shelf name highlighted */}
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '24px',
          lineHeight: '1.5',
        }}>
          Are you sure you want to delete "<strong>{shelfName}</strong>"? This action cannot be undone.
        </p>

        {/* Status message display */}
        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '500',
            background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
            color: message.type === 'error' ? '#c62828' : '#2e7d32',
            border: message.type === 'error' ? '1px solid #ef5350' : '1px solid #66bb6a',
          }}>
            {message.text}
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          {/* Cancel button */}
          <button
            style={{
              padding: '10px 20px',
              background: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background 0.2s ease',
            }}
            onClick={onCancel}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d0d0d0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e0e0e0'}
          >
            Cancel
          </button>

          {/* Confirm delete button */}
          <button
            style={{
              padding: '10px 20px',
              background: '#9a4207',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background 0.2s ease',
            }}
            onClick={onConfirm}
            onMouseEnter={(e) => e.currentTarget.style.background = '#7a3506'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#9a4207'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
