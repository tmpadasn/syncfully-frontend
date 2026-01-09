import { FiX } from 'react-icons/fi';

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      {/* Modal dialog - stops propagation to prevent closing on inner click */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header with title and close button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #eee',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#392c2c' }}>
            {mode === 'create' ? 'Create New Shelf' : 'Edit Shelf'}
          </h2>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#999',
            transition: 'color 0.2s ease',
          }} onClick={onClose} onMouseEnter={(e) => e.currentTarget.style.color = '#333'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
            <FiX size={24} />
          </button>
        </div>

        {/* Form for shelf creation/editing */}
        <form onSubmit={onSubmit}>
          {/* Shelf name input - required field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#392c2c',
            }}>Shelf Name *</label>
            <input
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease',
              }}
              type="text"
              placeholder="e.g., Favorites, To Read, Wishlist"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9a4207c8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              autoFocus
            />
          </div>

          {/* Optional description field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#392c2c',
            }}>Description</label>
            <textarea
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease',
                minHeight: '80px',
                resize: 'vertical',
              }}
              placeholder="What is this shelf for?"
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9a4207c8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            />
          </div>

          {/* Form action buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            {/* Cancel button */}
            <button
              type="button"
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
              onClick={onClose}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d0d0d0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e0e0e0'}
            >
              Cancel
            </button>

            {/* Submit button with loading state */}
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#9a4207c8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background 0.2s ease',
                opacity: isSubmitting ? 0.6 : 1,
              }}
              disabled={isSubmitting}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = '#7a3506')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = '#9a4207c8')}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Shelf' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
