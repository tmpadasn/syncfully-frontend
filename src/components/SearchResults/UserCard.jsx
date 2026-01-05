/**
 * UserCard: User item display for SearchResults
 * Shows user avatar, name, and metadata
 * Clickable to navigate to user profile
 *
 * Props:
 *   - entity: User data object with title, coverUrl (avatar), meta
 *   - onUserClick: Function - callback when user card is clicked
 *   - ResultHeader: Component - for rendering name/subtitle
 *   - isLast: Boolean - whether this is last item (for divider)
 */
export function UserCard({
  entity,
  onUserClick,
  ResultHeader,
  isLast
}) {
  return (
    <div key={entity.entityId}>
      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div
          onClick={onUserClick}
          style={{
            flexShrink: 0,
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              overflow: 'hidden',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f2f2f2',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img src={entity.coverUrl} alt={entity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* User Info */}
        <div style={{ flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ResultHeader
            title={entity.title}
            subtitle={entity.subtitle}
            meta={entity.meta}
            onClick={onUserClick}
          />
          <p style={{ margin: 0, color: '#888', fontSize: 13 }}>User Account</p>
        </div>
      </div>

      {/* Divider */}
      {!isLast && (
        <div style={{
          marginTop: 22,
          borderBottom: '2px solid #9a420776',
          paddingBottom: 6,
          marginBottom: 12
        }} />
      )}
    </div>
  );
}
