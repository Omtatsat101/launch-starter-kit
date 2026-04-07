import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.cwd())
const dataPath = path.join(root, 'data', 'project-manifest.json')
const cssPath = path.join(root, 'templates', 'core.css')
const outputRoot = path.join(root, 'output')
const sitesRoot = path.join(outputRoot, 'sites')

const themeVars = {
  canyon: {
    '--bg': '#efe6da',
    '--panel': 'rgba(255, 250, 244, 0.86)',
    '--ink': '#181413',
    '--muted': '#6d635c',
    '--line': 'rgba(55, 34, 18, 0.12)',
    '--accent': '#bb6127',
    '--hero': 'linear-gradient(135deg, #ca7231 0%, #efbc82 48%, #f7e9d0 100%)',
    '--shadow': '0 24px 70px rgba(34, 22, 10, 0.14)',
  },
  signal: {
    '--bg': '#dce7ec',
    '--panel': 'rgba(247, 252, 255, 0.78)',
    '--ink': '#0f181c',
    '--muted': '#50656f',
    '--line': 'rgba(10, 39, 48, 0.12)',
    '--accent': '#047e88',
    '--hero': 'linear-gradient(135deg, #0f5860 0%, #5dc3d0 44%, #ddfcff 100%)',
    '--shadow': '0 24px 70px rgba(14, 68, 76, 0.14)',
  },
  paper: {
    '--bg': '#f2eee4',
    '--panel': 'rgba(255, 255, 251, 0.84)',
    '--ink': '#211c15',
    '--muted': '#6b6257',
    '--line': 'rgba(41, 29, 14, 0.12)',
    '--accent': '#7f5530',
    '--hero': 'linear-gradient(135deg, #b08968 0%, #e6ccb2 46%, #faf0df 100%)',
    '--shadow': '0 24px 70px rgba(70, 47, 26, 0.12)',
  },
  forge: {
    '--bg': '#171a1d',
    '--panel': 'rgba(29, 34, 39, 0.9)',
    '--ink': '#f3ede6',
    '--muted': '#b7b1a9',
    '--line': 'rgba(255, 255, 255, 0.08)',
    '--accent': '#e38540',
    '--hero': 'linear-gradient(135deg, #2c3138 0%, #454d55 30%, #e08b4f 100%)',
    '--shadow': '0 28px 90px rgba(0, 0, 0, 0.34)',
  },
  sage: {
    '--bg': '#f0f2ed',
    '--panel': 'rgba(248, 252, 246, 0.86)',
    '--ink': '#1a2118',
    '--muted': '#5a6b56',
    '--line': 'rgba(30, 50, 25, 0.12)',
    '--accent': '#6b8f71',
    '--hero': 'linear-gradient(135deg, #4a7a52 0%, #92b896 44%, #e8f0e4 100%)',
    '--shadow': '0 24px 70px rgba(34, 60, 38, 0.14)',
  },
  vedic: {
    '--bg': '#faf5ef',
    '--panel': 'rgba(255, 252, 247, 0.86)',
    '--ink': '#201a12',
    '--muted': '#7a6b55',
    '--line': 'rgba(60, 40, 15, 0.12)',
    '--accent': '#9b6b3b',
    '--hero': 'linear-gradient(135deg, #8a5a2a 0%, #c9a06a 44%, #f5e8d4 100%)',
    '--shadow': '0 24px 70px rgba(70, 48, 20, 0.14)',
  },
  ruby: {
    '--bg': '#f7f0ea',
    '--panel': 'rgba(255, 250, 246, 0.86)',
    '--ink': '#1f1414',
    '--muted': '#7a5a5a',
    '--line': 'rgba(60, 20, 20, 0.12)',
    '--accent': '#8b3a3a',
    '--hero': 'linear-gradient(135deg, #6e2a2a 0%, #c27070 44%, #f2dcd0 100%)',
    '--shadow': '0 24px 70px rgba(70, 26, 26, 0.14)',
  },
  neon: {
    '--bg': '#f0f4f8',
    '--panel': 'rgba(248, 250, 255, 0.86)',
    '--ink': '#12101c',
    '--muted': '#5a5878',
    '--line': 'rgba(30, 20, 60, 0.12)',
    '--accent': '#6c3caf',
    '--hero': 'linear-gradient(135deg, #4a2888 0%, #8b5cd0 44%, #d8ccf0 100%)',
    '--shadow': '0 24px 70px rgba(44, 24, 80, 0.14)',
  },
  play: {
    '--bg': '#faf7f2',
    '--panel': 'rgba(255, 252, 248, 0.86)',
    '--ink': '#2a1f18',
    '--muted': '#7a6b5c',
    '--line': 'rgba(50, 30, 15, 0.12)',
    '--accent': '#C4856A',
    '--hero': 'linear-gradient(135deg, #B87058 0%, #d4a88a 44%, #e8f0e4 100%)',
    '--shadow': '0 24px 70px rgba(70, 44, 30, 0.14)',
  },
}

const adapterTargets = {
  store: ['Shopify section', 'Next.js landing page', 'Electron promo shell'],
  website: ['Next.js marketing page', 'Shopify content section', 'Tauri webview shell'],
  portfolio: ['Next.js portfolio page', 'Electron profile shell', 'Tauri showcase shell'],
  chatbot: ['Next.js app route', 'Electron assistant shell', 'Tauri assistant shell'],
  'local-app': ['Electron local tool shell', 'Tauri local utility shell', 'Next.js internal app page'],
  desktop: ['Electron renderer shell', 'Tauri desktop shell', 'Next.js control dashboard'],
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderThemeVars(theme) {
  return Object.entries(themeVars[theme] ?? themeVars.canyon)
    .map(([key, value]) => `${key}:${value};`)
    .join('')
}

function renderStats(metrics) {
  return metrics
    .map(([label, value]) => `
      <div class="stat-card">
        <span class="stat-label">${escapeHtml(label)}</span>
        <strong class="stat-value">${escapeHtml(value)}</strong>
      </div>
    `)
    .join('')
}

function renderFeatureList(features) {
  return features
    .map(item => {
      const isArray = Array.isArray(item)
      const title = isArray ? item[0] : item
      const desc = isArray ? item[1] : `Ready-to-use launch module for the ${item.toLowerCase()} layer.`
      return `
      <article class="feature-item">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(desc)}</span>
      </article>
    `})
    .join('')
}

function renderActionList(actions) {
  return actions
    .map(item => {
      const isArray = Array.isArray(item)
      const title = isArray ? item[0] : item
      const desc = isArray ? item[1] : 'Primary action surfaced as a launch-ready CTA block.'
      return `
      <article class="action-item">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(desc)}</span>
      </article>
    `})
    .join('')
}

function renderSources(sources) {
  return sources
    .map(item => `<span class="pill">${escapeHtml(item)}</span>`)
    .join('')
}

function renderAdapters(surface) {
  return (adapterTargets[surface] ?? adapterTargets.website)
    .map(item => `<span class="pill">${escapeHtml(item)}</span>`)
    .join('')
}

function renderSpecialArea(project) {
  switch (project.specialMode) {
    case 'wordle':
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Parent Controls</strong>
            <div class="selector-row" style="margin-top:10px">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => `<span class="selector-pill">${n} letters</span>`).join('')}
            </div>
          </article>
          <div class="custom-grid two">
            <article class="custom-box">
              <strong>Language Surface</strong>
              <div class="selector-row" style="margin-top:10px">
                <span class="selector-pill">English</span>
                <span class="selector-pill">Hindi</span>
                <span class="selector-pill">Gujarati</span>
                <span class="selector-pill">Spanish</span>
              </div>
            </article>
            <article class="custom-box">
              <strong>Game Board</strong>
              <span>Adaptive rows, hint chips, and parent-chosen word length for beginner to advanced kids.</span>
            </article>
          </div>
        </div>
      `
    case 'translator':
      return `
        <div class="custom-area">
          <div class="custom-grid two">
            <article class="custom-box">
              <strong>Source Text</strong>
              <span>Paste speech, notes, or product copy into the source pane.</span>
            </article>
            <article class="custom-box">
              <strong>Translated Output</strong>
              <span>Review translated text, alternate phrasings, and phrase memory.</span>
            </article>
          </div>
          <article class="custom-box">
            <strong>Language Presets</strong>
            <div class="selector-row" style="margin-top:10px">
              <span class="selector-pill">EN -> HI</span>
              <span class="selector-pill">EN -> GU</span>
              <span class="selector-pill">HI -> EN</span>
              <span class="selector-pill">Custom</span>
            </div>
          </article>
        </div>
      `
    case 'remote':
      return `
        <div class="custom-area">
          <div class="custom-grid two">
            <article class="custom-box">
              <strong>Device Pane</strong>
              <span>Desktop, laptop, or local AI node with health and connection state.</span>
            </article>
            <article class="custom-box">
              <strong>Queue Pane</strong>
              <span>Command queue, active tasks, and execution history.</span>
            </article>
          </div>
          <article class="custom-box">
            <strong>Quick Controls</strong>
            <div class="selector-row" style="margin-top:10px">
              <span class="selector-pill">Launch model</span>
              <span class="selector-pill">Restart service</span>
              <span class="selector-pill">Sync files</span>
              <span class="selector-pill">Open terminal</span>
            </div>
          </article>
        </div>
      `
    case 'resume-agent':
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Pipeline</strong>
            <div class="selector-row" style="margin-top:10px">
              <span class="selector-pill">Drive fetch</span>
              <span class="selector-pill">LinkedIn scrape</span>
              <span class="selector-pill">Score jobs</span>
              <span class="selector-pill">Tailor resume</span>
              <span class="selector-pill">Email summary</span>
            </div>
          </article>
        </div>
      `
    case 'portfolio':
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Featured Case Study</strong>
            <span>Challenge, move, result, and system thinking in one editorial module.</span>
          </article>
          <div class="custom-grid two">
            <article class="custom-box"><strong>Proof Rail</strong><span>Wins, launches, and operator snapshots.</span></article>
            <article class="custom-box"><strong>Archive</strong><span>Secondary work, public links, and experiments.</span></article>
          </div>
        </div>
      `
    case 'waitlist':
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Join the Waitlist</strong>
            <span>Be the first to know when we launch. No spam — just one email when it's live.</span>
            <form action="${escapeHtml(project.formAction ?? '#')}" method="POST" style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
              <input type="email" name="email" placeholder="your@email.com" required style="flex:1;min-width:200px;padding:12px 16px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,0.78);font:600 15px/1 var(--font-body);color:var(--ink);outline:none">
              <button type="submit" style="padding:12px 24px;border-radius:999px;border:none;background:var(--accent);color:#fff;font:700 13px/1 var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;cursor:pointer">Notify Me</button>
            </form>
          </article>
          ${project.waitlistFeatures ? `<div class="custom-grid two">${project.waitlistFeatures.map(f => `
            <article class="custom-box">
              <strong>${escapeHtml(f[0])}</strong>
              <span>${escapeHtml(f[1])}</span>
            </article>
          `).join('')}</div>` : ''}
        </div>
      `
    case 'resell':
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Brand Vision</strong>
            <span>${escapeHtml(project.brandVision ?? 'A premium brand opportunity in an emerging market.')}</span>
          </article>
          <article class="custom-box">
            <strong>Interested in this brand?</strong>
            <span>We welcome partnership inquiries, licensing conversations, and acquisition interest.</span>
            <a href="mailto:${escapeHtml(project.contactEmail ?? 'hello@hariomtatsat.com')}?subject=${encodeURIComponent(project.name + ' — Brand Inquiry')}" style="display:inline-block;margin-top:12px;padding:10px 20px;border-radius:999px;background:var(--accent);color:#fff;font:700 12px/1 var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;text-decoration:none">Get in Touch</a>
          </article>
        </div>
      `
    case 'whatsapp':
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Join the Community</strong>
            <span>${escapeHtml(project.communityPitch ?? 'Connect with buyers and sellers in our growing community.')}</span>
            <a href="https://wa.me/${escapeHtml(project.whatsappNumber ?? '1234567890')}?text=${encodeURIComponent(project.whatsappMessage ?? 'Hi! I\'m interested in ' + project.name)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:12px 24px;border-radius:999px;background:#25D366;color:#fff;font:700 13px/1 var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;text-decoration:none">&#9742; Join on WhatsApp</a>
          </article>
          <article class="custom-box">
            <strong>Stay Updated</strong>
            <span>Get deal alerts and market insights delivered to your inbox.</span>
            <form action="${escapeHtml(project.formAction ?? '#')}" method="POST" style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
              <input type="email" name="email" placeholder="your@email.com" required style="flex:1;min-width:200px;padding:12px 16px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,0.78);font:600 15px/1 var(--font-body);color:var(--ink);outline:none">
              <button type="submit" style="padding:12px 24px;border-radius:999px;border:none;background:var(--accent);color:#fff;font:700 13px/1 var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;cursor:pointer">Subscribe</button>
            </form>
          </article>
        </div>
      `
    default:
      return `
        <div class="custom-area">
          <article class="custom-box">
            <strong>Launch Surface</strong>
            <span>This starter is generated from the local project manifest and can be adapted into Shopify, Next, Electron, or Tauri.</span>
          </article>
        </div>
      `
  }
}

function renderPage(project, css) {
  const sourcePills = renderSources(project.sources)
  const adapterPills = renderAdapters(project.surface)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(project.name)}${project.isDomainShell ? '' : ' Starter'}</title>
  <meta name="description" content="${escapeHtml(project.summary)}">
  <style>${css}</style>
</head>
<body>
  <main class="frame" style="${renderThemeVars(project.theme)}">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"></div>
        <div class="brand-copy">
          <strong>${escapeHtml(project.name)}</strong>
          <span>${escapeHtml(project.tagline)}</span>
        </div>
      </div>
      <div class="topbar-badges">
        ${project.isDomainShell
          ? (project.topbarBadges ?? []).map(b => `<span class="badge">${escapeHtml(b)}</span>`).join('')
          : `<span class="badge">${escapeHtml(project.surface)}</span><span class="badge">${escapeHtml(project.theme)}</span>`}
      </div>
    </header>
    <section class="shell">
      <section class="hero">
        <div>
          <p class="hero-kicker">${project.isDomainShell ? escapeHtml(project.domain ?? project.name) : 'Launch starter / ' + escapeHtml(project.surface)}</p>
          <h1 class="hero-title">${escapeHtml(project.headline)}</h1>
          <p class="hero-copy">${escapeHtml(project.summary)}</p>
        </div>
        <div class="stats-row">${renderStats(project.metrics)}</div>
      </section>
      <section class="stack">
        <article class="card">
          <h2 class="section-title">${project.isDomainShell ? 'What We Offer' : 'Launch modules'}</h2>
          <p class="card-copy">${project.isDomainShell ? escapeHtml(project.offerCopy ?? project.tagline) : 'Reusable modules shaped for this product surface and ready to port into the framework adapters.'}</p>
          <div class="feature-list">${renderFeatureList(project.features)}</div>
        </article>
        <article class="card">
          <h2 class="section-title">${project.isDomainShell ? 'Coming Soon' : 'Primary actions'}</h2>
          <p class="card-copy">${project.isDomainShell ? 'We\'re building something worth waiting for.' : 'Production-facing calls to action and workflow entry points.'}</p>
          <div class="action-list">${renderActionList(project.actions)}</div>
        </article>
      </section>
    </section>
    <section class="shell" style="padding-top:0">
      <section class="card">
        <h2 class="section-title">${project.isDomainShell ? 'Get Started' : 'Tailored product area'}</h2>
        <p class="card-copy">${escapeHtml(project.buildNote ?? project.tagline)}</p>
        ${renderSpecialArea(project)}
      </section>
      ${project.isDomainShell ? '' : `<section class="card">
        <h2 class="section-title">Grounding</h2>
        <p class="card-copy">This starter was generated from the following local sources and project signals.</p>
        <div class="pill-row" style="margin-top:18px">${sourcePills}</div>
      </section>
      <section class="card">
        <h2 class="section-title">Port path</h2>
        <p class="card-copy">Use the matching adapters in this kit to move this starter into a production stack without redesigning from scratch.</p>
        <div class="pill-row" style="margin-top:18px">${adapterPills}</div>
      </section>`}
    </section>
    <footer class="footer">
      <span class="footer-note">${project.isDomainShell ? escapeHtml(project.footerNote ?? '© ' + new Date().getFullYear() + ' ' + project.name) : 'Plug-and-go output: static starter page + framework adapter path.'}</span>
      <span class="footer-note">${project.isDomainShell ? escapeHtml(project.domain ?? '') : 'Project id: ' + escapeHtml(project.id)}</span>
    </footer>
  </main>
</body>
</html>`
}

function renderIndex(projects, css) {
  const cards = projects.map(project => `
    <a class="gallery-card" href="./sites/${escapeHtml(project.slug)}.html" style="${renderThemeVars(project.theme)}">
      <span class="badge">${escapeHtml(project.surface)}</span>
      <h2>${escapeHtml(project.name)}</h2>
      <p>${escapeHtml(project.summary)}</p>
    </a>
  `).join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Launch Starter Kit</title>
  <style>${css}</style>
</head>
<body>
  <main class="gallery">
    <header class="gallery-header">
      <p class="hero-kicker" style="color:var(--accent)">Organized Launch System</p>
      <h1 class="hero-title" style="max-width:12ch;color:var(--ink)">Production-leaning starters for the projects already in Organized.</h1>
      <p class="hero-copy" style="color:var(--muted);max-width:70ch">Static launch surfaces generated from local project docs, ideas, and manifests. Use these directly or port them into the included Shopify, Next.js, Electron, and Tauri adapters.</p>
    </header>
    <section class="gallery-grid">
      ${cards}
    </section>
  </main>
</body>
</html>`
}

function renderBrandGenerator(projects, css) {
  const projectsJson = JSON.stringify(projects)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Generator</title>
  <style>${css}</style>
  <style>
    .generator-shell {
      width: min(1440px, 100%);
      margin: 0 auto;
    }

    .generator-grid {
      display: grid;
      gap: 18px;
      grid-template-columns: 360px minmax(0, 1fr);
    }

    .field {
      display: grid;
      gap: 8px;
      margin-top: 16px;
    }

    .field label {
      font: 700 12px/1 var(--font-mono);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .field select {
      width: 100%;
      min-height: 48px;
      border-radius: 16px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.78);
      color: var(--ink);
      padding: 0 14px;
      font: 600 15px/1 var(--font-body);
    }

    .preview-shell {
      border-radius: 30px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.54);
      padding: 18px;
    }

    .preview-frame {
      width: 100%;
      min-height: 860px;
      border: 0;
      border-radius: 24px;
      background: white;
    }

    .cta-stack {
      display: grid;
      gap: 10px;
      margin-top: 18px;
    }

    .generator-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.72);
      color: var(--ink);
      text-decoration: none;
      font: 700 12px/1 var(--font-mono);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    @media (max-width: 980px) {
      .generator-grid {
        grid-template-columns: 1fr;
      }

      .preview-frame {
        min-height: 620px;
      }
    }
  </style>
</head>
<body>
  <main class="generator-shell">
    <section class="frame">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div class="brand-copy">
            <strong>Brand Generator</strong>
            <span>Preview and jump into launch-ready starters from the Organized manifest.</span>
          </div>
        </div>
        <div class="topbar-badges">
          <span class="badge">14 projects</span>
          <span class="badge">Starter output</span>
        </div>
      </header>

      <section class="shell" style="grid-template-columns:1fr; padding-bottom: 0">
        <section class="hero">
          <div>
            <p class="hero-kicker">Surface + theme selector</p>
            <h1 class="hero-title" style="max-width: 11ch">Generate the look, then jump straight into the starter page.</h1>
            <p class="hero-copy">Use this as the routing layer for store, website, portfolio, chatbot, local-app, and desktop launches already mapped from Organized.</p>
          </div>
        </section>
      </section>

      <section class="shell" style="grid-template-columns:1fr; padding-top:18px">
        <div class="generator-grid">
          <article class="card">
            <h2 class="section-title">Generator controls</h2>
            <p class="card-copy">Pick a project, then explore its current surface and theme. The preview loads the generated starter immediately.</p>
            <div class="field">
              <label for="projectSelect">Project</label>
              <select id="projectSelect"></select>
            </div>
            <div class="field">
              <label for="surfaceSelect">Surface</label>
              <select id="surfaceSelect"></select>
            </div>
            <div class="field">
              <label for="themeSelect">Theme</label>
              <select id="themeSelect"></select>
            </div>
            <div class="cta-stack">
              <a id="openStarter" class="generator-button" href="./sites/kiddiego.html">Open starter page</a>
              <a class="generator-button" href="./index.html">Open gallery index</a>
            </div>
            <div class="custom-area">
              <article class="custom-box">
                <strong id="projectName">Project title</strong>
                <span id="projectSummary">Project summary</span>
              </article>
              <article class="custom-box">
                <strong>Primary actions</strong>
                <div class="selector-row" id="actionRow"></div>
              </article>
            </div>
          </article>
          <article class="preview-shell">
            <iframe id="previewFrame" class="preview-frame" title="Starter preview" src="./sites/kiddiego.html"></iframe>
          </article>
        </div>
      </section>
    </section>
  </main>

  <script>
    const projects = ${projectsJson}
    const projectSelect = document.getElementById('projectSelect')
    const surfaceSelect = document.getElementById('surfaceSelect')
    const themeSelect = document.getElementById('themeSelect')
    const previewFrame = document.getElementById('previewFrame')
    const openStarter = document.getElementById('openStarter')
    const projectName = document.getElementById('projectName')
    const projectSummary = document.getElementById('projectSummary')
    const actionRow = document.getElementById('actionRow')

    function fillSelect(select, values, selectedValue) {
      select.innerHTML = values
        .map(value => '<option value="' + value + '"' + (value === selectedValue ? ' selected' : '') + '>' + value + '</option>')
        .join('')
    }

    const surfaces = [...new Set(projects.map(item => item.surface))]
    const themes = [...new Set(projects.map(item => item.theme))]

    function findProject() {
      const current = projects.find(item => item.slug === projectSelect.value)
      const matching = projects.find(item => item.surface === surfaceSelect.value && item.theme === themeSelect.value)
      return matching ?? current ?? projects[0]
    }

    function updatePreview() {
      const project = findProject()
      fillSelect(surfaceSelect, surfaces, surfaceSelect.value || project.surface)
      fillSelect(themeSelect, themes, themeSelect.value || project.theme)
      projectSelect.value = project.slug
      previewFrame.src = './sites/' + project.slug + '.html'
      openStarter.href = './sites/' + project.slug + '.html'
      projectName.textContent = project.name + ' / ' + project.surface + ' / ' + project.theme
      projectSummary.textContent = project.summary
      actionRow.innerHTML = project.actions.map(action => '<span class="selector-pill">' + action + '</span>').join('')
    }

    fillSelect(projectSelect, projects.map(item => item.slug), projects[0].slug)
    fillSelect(surfaceSelect, surfaces, projects[0].surface)
    fillSelect(themeSelect, themes, projects[0].theme)
    updatePreview()
    projectSelect.addEventListener('change', updatePreview)
    surfaceSelect.addEventListener('change', updatePreview)
    themeSelect.addEventListener('change', updatePreview)
  </script>
</body>
</html>`
}

async function main() {
  const [manifestRaw, css] = await Promise.all([
    fs.readFile(dataPath, 'utf8'),
    fs.readFile(cssPath, 'utf8'),
  ])

  const projects = JSON.parse(manifestRaw)

  await fs.mkdir(sitesRoot, { recursive: true })

  await Promise.all(projects.map(project => {
    const html = renderPage(project, css)
    return fs.writeFile(path.join(sitesRoot, `${project.slug}.html`), html, 'utf8')
  }))

  await Promise.all([
    fs.writeFile(path.join(outputRoot, 'index.html'), renderIndex(projects, css), 'utf8'),
    fs.writeFile(path.join(outputRoot, 'brand-generator.html'), renderBrandGenerator(projects, css), 'utf8'),
    fs.writeFile(path.join(outputRoot, 'projects.json'), JSON.stringify(projects, null, 2), 'utf8'),
  ])

  console.log(`Generated ${projects.length} launch starters in ${outputRoot}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
