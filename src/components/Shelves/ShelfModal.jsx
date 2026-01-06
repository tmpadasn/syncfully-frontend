import { FiX } from 'react-icons/fi';
import styles from '../../styles/shelvesModules.module.css';

/**
 * ShelfModal Component
 * Modal dialog for creating or editing shelves.
 * Allows users to set shelf name (required) and description (optional).
 * Supports two modes: 'create' for new shelves and 'edit' for updating existing ones.
 */
export default function ShelfModal({
  isOpen,       // Controls modal visibility
  mode,         // 'create' or 'edit' - determines button labels and title
  formData,     // Object with name and description fields
  isSubmitting, // Whether form submission is in progress
  onClose,      // Callback to close the modal
  onSubmit,     // Callback when form is submitted
  onChange,     // Callback when input values change (field, value)
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Modal dialog - stops propagation to prevent closing on inner click */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header with title and close button */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'create' ? 'Create New Shelf' : 'Edit Shelf'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Form for shelf creation/editing */}
        <form onSubmit={onSubmit}>
          {/* Shelf name input - required field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Shelf Name *</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g., Favorites, To Read, Wishlist"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              autoFocus
            />
          </div>

          {/* Optional description field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="What is this shelf for?"
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
            />
          </div>

          {/* Form action buttons */}
          <div className={styles.formButtons}>
            {/* Cancel button */}
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            {/* Submit button with loading state */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Shelf' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
