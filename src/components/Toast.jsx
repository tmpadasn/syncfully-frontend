import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';

export default function Toast({ message, onClose, duration = 4000, link }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const handleClick = () => {
    if (link) {
      navigate(link);
      onClose();
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#9a4207',
        color: 'white',
        padding: '20px 28px',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(154, 66, 7, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        animation: 'slideInBottom 0.3s ease-out',
        maxWidth: '450px',
        minWidth: '320px'
      }}
    >
      <div
        onClick={handleIconClick}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <FiZap size={24} />
      </div>
      <span style={{ fontSize: '16px', fontWeight: '500', flex: 1 }}>{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          marginLeft: 'auto',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '22px',
          padding: '0',
          lineHeight: '1',
          opacity: 0.8,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        ×
      </button>
      <style>{`
        @keyframes slideInBottom {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
