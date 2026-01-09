/**
 * ProfileHeader Component
 * Displays user avatar and username tag
 */

import { DEFAULT_AVATAR_URL } from '../../config/constants';

export default function ProfileHeader({ user }) {
  return (
    // Container with bottom border
    <div style={{
      textAlign: 'center',
      marginBottom: 36,
      paddingBottom: 32,
      borderBottom: '2px solid #f0e8dc'
    }}>
      {/* Avatar with fallback to default */}
      <img
        src={user.profilePictureUrl || DEFAULT_AVATAR_URL}
        alt="Profile"
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #e8dccf',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
        }}
      />
      {/* Username display */}
      <p style={{
        marginTop: 16,
        fontSize: 14,
        color: '#8b7355',
        fontWeight: 600
      }}>
        {user.username}
      </p>
    </div>
  );
}
