import { WorkCard } from '../../imports/workDetailsImports';

// Left sidebar component displaying work cover image and external purchase/view links
export default function WorkDetailsLeftSidebar({ work, onLinkHover }) {
  return (
    <aside style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {/* Work cover image */}
      <div style={{ marginLeft: -10 }}>
        <WorkCard work={work} coverStyle={{ width: 180, height: 260 }} flat hideInfo />
      </div>

      {/* External links to find work online */}
      <div style={{ marginTop: 12, width: 180 }}>
        {work?.findAt?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {/* Render link for each source (library, bookstore, etc.) */}
            {work.findAt.map((f, i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '18px 20px',
                  background: 'linear-gradient(135deg, #9a4207, #b95716)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: '0 4px 12px rgba(154, 66, 7, 0.3)',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => onLinkHover(e, true)}
                onMouseLeave={(e) => onLinkHover(e, false)}
              >
                <span>🔗</span>
                <span>
                  Find it Here{f.label && f.label !== 'External Link' ? `: ${f.label}` : ''}
                </span>
              </a>
            ))}
          </div>
        ) : (
          // Fallback message when no external links available
          <p>Available from online stores and libraries.</p>
        )}
      </div>
    </aside>
  );
}
