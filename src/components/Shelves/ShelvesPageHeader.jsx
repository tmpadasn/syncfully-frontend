/**
 * ShelvesPageHeader Component
 * Displays the "My Shelves" title and "New Shelf" button
 */
import { FiPlus } from 'react-icons/fi';

export default function ShelvesPageHeader({ onCreateClick }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '2px solid #9a4207c8',
    }}>
      {/* Page Title */}
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#392c2c',
      }}>My Shelves</h1>
      {/* New Shelf Button */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: '#9a4207c8',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
        }}
        onClick={onCreateClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#7a3506';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#9a4207c8';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Plus icon */}
        <FiPlus size={20} /> New Shelf
      </button>
    </div>
  );
}
