import styles from '../../styles/shelvesModules.module.css';

/**
 * DeleteConfirmation Modal Component
 * Displays a confirmation dialog before deleting a shelf.
 * Prevents accidental deletions with a secondary confirmation step.
 */
export default function DeleteConfirmation({
  isOpen,           // Controls modal visibility
  shelfName,        // Name of shelf to be deleted (displayed in message)
  onCancel,         // Callback when user cancels deletion
  onConfirm,        // Callback when user confirms deletion
}) {
  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className={styles.confirmOverlay} onClick={onCancel}>
      {/* Dialog container - stops propagation to prevent closing on inner click */}
      <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.confirmTitle}>Delete Shelf?</h3>

        {/* Message with shelf name highlighted */}
        <p className={styles.confirmMessage}>
          Are you sure you want to delete "<strong>{shelfName}</strong>"? This action cannot be undone.
        </p>

        {/* Action buttons */}
        <div className={styles.confirmButtons}>
          {/* Cancel button */}
          <button
            className={styles.confirmCancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>

          {/* Confirm delete button */}
          <button
            className={styles.confirmDeleteButton}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
