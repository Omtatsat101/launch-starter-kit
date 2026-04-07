type LaunchMetric = [label: string, value: string]

type LaunchProject = {
  id: string
  name: string
  tagline: string
  headline: string
  summary: string
  surface: string
  theme: 'canyon' | 'signal' | 'paper' | 'forge'
  metrics: LaunchMetric[]
  features: string[]
  actions: string[]
}

const themeMap = {
  canyon: {
    background: 'linear-gradient(135deg, #ca7231 0%, #efbc82 48%, #f7e9d0 100%)',
    panel: 'rgba(255, 250, 244, 0.88)',
    ink: '#181413',
    muted: '#6d635c',
    accent: '#bb6127',
  },
  signal: {
    background: 'linear-gradient(135deg, #0f5860 0%, #5dc3d0 44%, #ddfcff 100%)',
    panel: 'rgba(247, 252, 255, 0.82)',
    ink: '#0f181c',
    muted: '#50656f',
    accent: '#047e88',
  },
  paper: {
    background: 'linear-gradient(135deg, #b08968 0%, #e6ccb2 46%, #faf0df 100%)',
    panel: 'rgba(255, 255, 251, 0.88)',
    ink: '#211c15',
    muted: '#6b6257',
    accent: '#7f5530',
  },
  forge: {
    background: 'linear-gradient(135deg, #2c3138 0%, #454d55 30%, #e08b4f 100%)',
    panel: 'rgba(29, 34, 39, 0.92)',
    ink: '#f3ede6',
    muted: '#b7b1a9',
    accent: '#e38540',
  },
} as const

export function AdaptiveLaunchPage({ project }: { project: LaunchProject }) {
  const theme = themeMap[project.theme]

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '24px',
        background: '#f4efe7',
        color: theme.ink,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <section
        style={{
          width: 'min(1200px, 100%)',
          margin: '0 auto',
          borderRadius: '36px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          background: theme.panel,
          boxShadow: '0 24px 70px rgba(0,0,0,0.12)',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '24px', fontFamily: '"Iowan Old Style", serif' }}>
              {project.name}
            </strong>
            <span style={{ display: 'block', marginTop: '6px', color: theme.muted }}>{project.tagline}</span>
          </div>
          <span
            style={{
              alignSelf: 'flex-start',
              padding: '10px 12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.5)',
              color: theme.muted,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {project.surface}
          </span>
        </header>

        <section
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: '1.2fr 0.8fr',
            padding: '24px',
          }}
        >
          <article
            style={{
              minHeight: '340px',
              padding: '28px',
              borderRadius: '28px',
              background: theme.background,
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Launch starter
            </p>
            <h1
              style={{
                margin: '16px 0 0',
                maxWidth: '10ch',
                fontSize: 'clamp(42px, 7vw, 78px)',
                lineHeight: 0.92,
                letterSpacing: '-0.06em',
                fontFamily: '"Iowan Old Style", serif',
              }}
            >
              {project.headline}
            </h1>
            <p style={{ marginTop: '18px', maxWidth: '58ch', lineHeight: 1.6 }}>{project.summary}</p>
          </article>

          <article
            style={{
              borderRadius: '28px',
              padding: '22px',
              background: 'rgba(255,255,255,0.52)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '28px', fontFamily: '"Iowan Old Style", serif' }}>Launch metrics</h2>
            <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
              {project.metrics.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.58)',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '11px', color: theme.muted, textTransform: 'uppercase' }}>
                    {label}
                  </span>
                  <strong style={{ display: 'block', marginTop: '8px', fontSize: '22px' }}>{value}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            padding: '0 24px 24px',
          }}
        >
          <article
            style={{
              borderRadius: '28px',
              padding: '22px',
              background: 'rgba(255,255,255,0.52)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '28px', fontFamily: '"Iowan Old Style", serif' }}>Modules</h2>
            <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
              {project.features.map(feature => (
                <div
                  key={feature}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.58)',
                  }}
                >
                  <strong>{feature}</strong>
                </div>
              ))}
            </div>
          </article>

          <article
            style={{
              borderRadius: '28px',
              padding: '22px',
              background: 'rgba(255,255,255,0.52)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '28px', fontFamily: '"Iowan Old Style", serif' }}>Primary actions</h2>
            <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
              {project.actions.map(action => (
                <button
                  key={action}
                  type="button"
                  style={{
                    appearance: 'none',
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.64)',
                    color: theme.ink,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}
