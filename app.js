/**
 * Cactus News Network (CaNN) - Application Controller
 * Handles article filtering, search, reader engagement (Likes & Reads),
 * bilingual Thai & English translation, modal viewer, and interactive Sudoku.
 */

// Application State
const state = {
  lang: localStorage.getItem('cann_lang') || 'en',
  theme: localStorage.getItem('cann_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  currentCategory: 'All',
  searchQuery: '',
  selectedArticleId: null,
  activeSudokuIndex: 0,
  sudokuGrid: [],
  selectedSudokuCell: null,
  viewMode: 'feed' // 'feed' or 'broadsheet'
};

// ================= LocalStorage Engagement Helpers =================
function getStoredEngagement(id, defaultReads, defaultLikes) {
  const localLikesKey = `cann_likes_${id}`;
  const localReadsKey = `cann_reads_${id}`;
  const userLikedKey = `cann_user_liked_${id}`;
  const userReadKey = `cann_user_read_${id}`;

  const currentLikes = parseInt(localStorage.getItem(localLikesKey), 10) || defaultLikes;
  const currentReads = parseInt(localStorage.getItem(localReadsKey), 10) || defaultReads;
  const isLiked = localStorage.getItem(userLikedKey) === 'true';
  const isRead = localStorage.getItem(userReadKey) === 'true';

  return { currentLikes, currentReads, isLiked, isRead };
}

function setStoredLike(id, isLiked, count) {
  localStorage.setItem(`cann_likes_${id}`, count);
  localStorage.setItem(`cann_user_liked_${id}`, isLiked ? 'true' : 'false');
}

function setStoredRead(id, isRead, count) {
  localStorage.setItem(`cann_reads_${id}`, count);
  localStorage.setItem(`cann_user_read_${id}`, isRead ? 'true' : 'false');
}

// ================= Initialization =================
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  applyLanguage(state.lang);
  initTicker();
  renderCategories();
  renderArticles();
  renderAds();
  renderOfficials();
  initSudoku();
  setupEventListeners();
});

// ================= Theme System (Dark / Light Mode) =================
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('cann_theme', state.theme);
  applyTheme(state.theme);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);

  const t = CANN_I18N[state.lang] || CANN_I18N.en;
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = isDark ? (t.themeLight || '☀️ Light') : (t.themeDark || '🌙 Dark');
    themeBtn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// ================= Language System (i18n) =================
function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'th') return;
  state.lang = lang;
  localStorage.setItem('cann_lang', lang);
  applyLanguage(lang);
  initTicker();
  renderCategories();
  renderArticles();
  renderAds();
  renderOfficials();
  initSudoku();
  
  // If modal is open, re-render it in new language
  if (state.selectedArticleId) {
    openArticleModal(state.selectedArticleId);
  }
}

function applyLanguage(lang) {
  const t = CANN_I18N[lang] || CANN_I18N.en;
  document.documentElement.lang = lang;

  // Language buttons
  const btnEn = document.getElementById('langBtnEn');
  const btnTh = document.getElementById('langBtnTh');
  if (btnEn && btnTh) {
    btnEn.classList.toggle('active', lang === 'en');
    btnTh.classList.toggle('active', lang === 'th');
  }

  // Theme button text
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    const isDark = state.theme === 'dark';
    themeBtn.textContent = isDark ? (t.themeLight || '☀️ Light') : (t.themeDark || '🌙 Dark');
  }

  // Ticker badge & links
  setElText('tickerBadge', t.breakingBadge);
  setElText('wikiLinkBtn', t.wikiLink);
  setElText('discordLinkBtn', t.discordLink);

  // Masthead
  setElText('volMeta', t.volMeta);
  setElText('archiveMeta', t.archiveMeta);
  setElText('nationMeta', t.nationMeta);
  setElText('siteTitle', t.siteTitle);
  setElText('siteSubtitle', t.siteSubtitle);
  setElText('siteTagline', t.mastheadTagline);

  // Nav Links
  setElText('navFrontpage', t.navFrontpage);
  setElText('navBreaking', t.navBreaking);
  setElText('navGeopolitics', t.navGeopolitics);
  setElText('navPolitics', t.navPolitics);
  setElText('navInterviews', t.navInterviews);
  setElText('navSudoku', t.navSudoku);
  setElText('navClassifieds', t.navClassifieds);

  const viewToggleBtn = document.getElementById('viewToggleBtn');
  if (viewToggleBtn) {
    const isBroadsheet = document.body.classList.contains('broadsheet-mode');
    viewToggleBtn.textContent = isBroadsheet ? t.btnFeed : t.btnBroadsheet;
  }

  // Search input placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  // Sidebar Titles
  setElText('serverCardTitle', t.serverCardTitle);
  setElText('serverStatusText', t.serverOnline);
  setElText('sidebarNationName', lang === 'th' ? CANN_DATA.server.nationTh : CANN_DATA.server.nationEn);
  setElText('serverDesc', t.serverDesc);
  setElText('sudokuTitle', t.sudokuTitle);
  setElText('sudokuBadge', t.sudokuBadge);
  setElText('btnCheckSudoku', t.btnCheckSudoku);
  setElText('btnResetSudoku', t.btnResetSudoku);
  setElText('leadershipTitle', t.leadershipTitle);
  setElText('classifiedsTitle', t.classifiedsTitle);

  // Footer
  setElText('footerAboutTitle', t.footerAboutTitle);
  setElText('footerAboutDesc', t.footerAboutDesc);
  setElText('footerPortalsTitle', t.footerPortalsTitle);
  setElText('footerNationTitle', t.footerNationTitle);
  setElText('footerNationDesc', t.footerNationDesc);
  setElText('footerCopyright', t.footerCopyright);
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ================= Top Ticker =================
function initTicker() {
  const tickerEl = document.getElementById('tickerText');
  if (!tickerEl) return;
  const headlinesList = CANN_DATA.tickerHeadlines[state.lang] || CANN_DATA.tickerHeadlines.en;
  const separator = state.lang === 'th' ? '  •  [CaNN แดนทะเลทราย]  •  ' : '  •  [CaNN DESERT]  •  ';
  const text = headlinesList.join(separator);
  tickerEl.textContent = text + separator + text;
}

// ================= Category Bar =================
function renderCategories() {
  const container = document.getElementById('categoryPills');
  if (!container) return;
  const t = CANN_I18N[state.lang] || CANN_I18N.en;

  const categories = [
    { key: 'All', label: t.categoryAll },
    { key: 'Breaking', label: t.categoryBreaking },
    { key: 'Geopolitics', label: t.categoryGeopolitics },
    { key: 'Politics', label: t.categoryPolitics },
    { key: 'Drama', label: t.categoryDrama },
    { key: 'Culture', label: t.categoryCulture },
    { key: 'Sports', label: t.categorySports },
    { key: 'Interviews', label: t.categoryInterviews }
  ];

  container.innerHTML = categories.map(cat => `
    <button class="pill-btn ${state.currentCategory === cat.key ? 'active' : ''}" data-cat="${cat.key}">
      ${cat.label}
    </button>
  `).join('');

  container.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.currentCategory = e.currentTarget.getAttribute('data-cat');
      container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderArticles();
    });
  });
}

// ================= Articles Rendering =================
function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  const heroContainer = document.getElementById('featuredLeadContainer');
  if (!grid) return;
  const t = CANN_I18N[state.lang] || CANN_I18N.en;
  const isTh = state.lang === 'th';

  let filtered = CANN_DATA.articles.filter(article => {
    const matchCat = state.currentCategory === 'All' || article.category.toLowerCase() === state.currentCategory.toLowerCase();
    const query = state.searchQuery.toLowerCase();
    if (!query) return matchCat;

    const title = (isTh && article.title_th ? article.title_th : article.title).toLowerCase();
    const sub = (isTh && article.subtitle_th ? article.subtitle_th : article.subtitle).toLowerCase();
    const lead = (isTh && article.lead_th ? article.lead_th : article.lead).toLowerCase();
    const content = (isTh && article.content_th ? article.content_th : article.content).toLowerCase();
    const tags = isTh && article.tags_th ? article.tags_th : article.tags;
    const matchSearch = title.includes(query) || sub.includes(query) || lead.includes(query) || content.includes(query) || tags.some(tag => tag.toLowerCase().includes(query));
    return matchCat && matchSearch;
  });

  // Render Hero Story on default view if no search
  if (!state.searchQuery && state.currentCategory === 'All') {
    const heroArticle = CANN_DATA.articles.find(a => a.id === 'cann-25') || CANN_DATA.articles[0];
    const heroEngage = getStoredEngagement(heroArticle.id, heroArticle.baseReads, heroArticle.baseLikes);

    const title = isTh && heroArticle.title_th ? heroArticle.title_th : heroArticle.title;
    const subtitle = isTh && heroArticle.subtitle_th ? heroArticle.subtitle_th : heroArticle.subtitle;
    const author = isTh && heroArticle.author_th ? heroArticle.author_th : heroArticle.author;
    const readTime = isTh && heroArticle.readTime_th ? heroArticle.readTime_th : heroArticle.readTime;

    if (heroContainer) {
      heroContainer.style.display = 'block';
      heroContainer.innerHTML = `
        <div class="featured-story-banner">
          <span class="banner-badge">${t.heroBadge}</span>
          <h2 class="featured-title">${title}</h2>
          <p class="featured-subtitle">${subtitle}</p>
          <div class="featured-meta">
            <span>📅 ${heroArticle.date}</span>
            <span>✍️ ${author}</span>
            <span>⏱️ ${readTime}</span>
            <span>📰 ${heroArticle.edition}</span>
          </div>
          <div class="featured-actions">
            <button class="btn-read-hero" onclick="openArticleModal('${heroArticle.id}')">
              ${t.btnReadHero}
            </button>
            <button class="interact-btn ${heroEngage.isLiked ? 'liked' : ''}" onclick="handleLikeClick('${heroArticle.id}', this)" title="Like this headline">
              <span>${heroEngage.isLiked ? '❤️' : '🤍'}</span>
              <span class="like-count">${heroEngage.currentLikes}</span> ${t.likeLabel}
            </button>
            <button class="interact-btn ${heroEngage.isRead ? 'read-done' : ''}" onclick="handleReadClick('${heroArticle.id}', this)" title="Mark as read">
              <span>${heroEngage.isRead ? '✓' : '👁️'}</span>
              <span class="read-count">${heroEngage.currentReads}</span> ${t.readLabel}
            </button>
          </div>
        </div>
      `;
    }
    // Filter hero out of normal grid to avoid duplicate
    filtered = filtered.filter(a => a.id !== heroArticle.id);
  } else if (heroContainer) {
    heroContainer.style.display = 'none';
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: white; border-radius: 12px; border: 1px dashed var(--ice-blue-border);">
        <h3 style="color: var(--primary-blue); margin-bottom: 8px;">${t.noResultsTitle}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${t.noResultsDesc}</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(article => {
    const engage = getStoredEngagement(article.id, article.baseReads, article.baseLikes);
    const title = isTh && article.title_th ? article.title_th : article.title;
    const lead = isTh && article.lead_th ? article.lead_th : article.lead;
    const category = isTh && article.category_th ? article.category_th : article.category;
    const tags = isTh && article.tags_th ? article.tags_th : article.tags;

    return `
      <article class="article-card" data-id="${article.id}">
        <div>
          <div class="article-card-header">
            <span class="article-category">${category}</span>
            <span class="article-date">${article.date}</span>
          </div>
          <h3 class="article-headline" onclick="openArticleModal('${article.id}')">${title}</h3>
          <p class="article-snippet">${lead}</p>
          <div class="article-tags">
            ${tags.map(tag => `<span class="tag-badge">#${tag}</span>`).join('')}
          </div>
        </div>
        <div class="article-engagement">
          <div class="engagement-actions">
            <button class="interact-btn ${engage.isLiked ? 'liked' : ''}" onclick="handleLikeClick('${article.id}', this)" title="Like">
              <span class="icon">${engage.isLiked ? '❤️' : '🤍'}</span>
              <span class="like-count">${engage.currentLikes}</span>
            </button>
            <button class="interact-btn ${engage.isRead ? 'read-done' : ''}" onclick="handleReadClick('${article.id}', this)" title="Mark as read">
              <span class="icon">${engage.isRead ? '✓' : '👁️'}</span>
              <span class="read-count">${engage.currentReads}</span>
            </button>
          </div>
          <span class="read-full-link" onclick="openArticleModal('${article.id}')">${t.readMoreLink}</span>
        </div>
      </article>
    `;
  }).join('');
}

// ================= Engagement Interactions =================
function handleLikeClick(articleId, btn) {
  const article = CANN_DATA.articles.find(a => a.id === articleId);
  if (!article) return;

  const engage = getStoredEngagement(articleId, article.baseReads, article.baseLikes);
  let newLiked = !engage.isLiked;
  let newLikes = newLiked ? engage.currentLikes + 1 : Math.max(0, engage.currentLikes - 1);

  setStoredLike(articleId, newLiked, newLikes);

  if (btn) {
    btn.classList.toggle('liked', newLiked);
    const countEl = btn.querySelector('.like-count');
    const iconEl = btn.querySelector('.icon') || btn.querySelector('span:first-child');
    if (countEl) countEl.textContent = newLikes;
    if (iconEl) iconEl.textContent = newLiked ? '❤️' : '🤍';
  }

  const modalLikeBtn = document.getElementById('modalLikeBtn');
  if (modalLikeBtn && state.selectedArticleId === articleId) {
    modalLikeBtn.classList.toggle('liked', newLiked);
    modalLikeBtn.querySelector('.like-count').textContent = newLikes;
    modalLikeBtn.querySelector('span:first-child').textContent = newLiked ? '❤️' : '🤍';
  }
}

function handleReadClick(articleId, btn) {
  const article = CANN_DATA.articles.find(a => a.id === articleId);
  if (!article) return;

  const engage = getStoredEngagement(articleId, article.baseReads, article.baseLikes);
  let newRead = !engage.isRead;
  let newReads = newRead ? engage.currentReads + 1 : Math.max(0, engage.currentReads - 1);

  setStoredRead(articleId, newRead, newReads);

  if (btn) {
    btn.classList.toggle('read-done', newRead);
    const countEl = btn.querySelector('.read-count');
    const iconEl = btn.querySelector('.icon') || btn.querySelector('span:first-child');
    if (countEl) countEl.textContent = newReads;
    if (iconEl) iconEl.textContent = newRead ? '✓' : '👁️';
  }

  const modalReadBtn = document.getElementById('modalReadBtn');
  if (modalReadBtn && state.selectedArticleId === articleId) {
    modalReadBtn.classList.toggle('read-done', newRead);
    modalReadBtn.querySelector('.read-count').textContent = newReads;
    modalReadBtn.querySelector('span:first-child').textContent = newRead ? '✓' : '👁️';
  }
}

// ================= Modal Viewer =================
function openArticleModal(articleId) {
  const article = CANN_DATA.articles.find(a => a.id === articleId);
  if (!article) return;

  state.selectedArticleId = articleId;
  const modal = document.getElementById('articleModal');
  const overlay = document.getElementById('modalOverlay');
  if (!modal || !overlay) return;

  const t = CANN_I18N[state.lang] || CANN_I18N.en;
  const isTh = state.lang === 'th';

  // Auto increment read if never read before
  const engage = getStoredEngagement(articleId, article.baseReads, article.baseLikes);
  if (!engage.isRead) {
    setStoredRead(articleId, true, engage.currentReads + 1);
    engage.currentReads += 1;
    engage.isRead = true;
    renderArticles();
  }

  const title = isTh && article.title_th ? article.title_th : article.title;
  const subtitle = isTh && article.subtitle_th ? article.subtitle_th : article.subtitle;
  const author = isTh && article.author_th ? article.author_th : article.author;
  const readTime = isTh && article.readTime_th ? article.readTime_th : article.readTime;
  const category = isTh && article.category_th ? article.category_th : article.category;
  const badge = isTh && article.badge_th ? article.badge_th : article.badge;
  const rawContent = isTh && article.content_th ? article.content_th : article.content;

  const formattedBody = rawContent
    .split('\n\n')
    .map(para => {
      let p = para.trim();
      if (p.startsWith('**Q') || p.startsWith('**คำถาม') || p.startsWith('*Lacha:*')) {
        return `<p style="background: #eff6ff; padding: 12px 16px; border-radius: 8px; border-left: 4px solid var(--secondary-blue); margin-bottom: 12px;">${formatMarkdown(p)}</p>`;
      }
      if (p.startsWith('*') && p.endsWith('*')) {
        return `<blockquote>${p.replace(/^\*|\*$/g, '')}</blockquote>`;
      }
      return `<p>${formatMarkdown(p)}</p>`;
    })
    .join('');

  modal.innerHTML = `
    <button class="modal-close-btn" onclick="closeArticleModal()" aria-label="Close">✕</button>
    <div class="modal-header">
      <div class="modal-badge-row">
        <span class="article-category">${category}</span>
        <span class="tag-badge" style="background: var(--ice-blue); color: var(--secondary-blue); font-weight:700;">${article.edition} (P. ${article.page})</span>
        <span class="tag-badge" style="background: #fee2e2; color: #dc2626; font-weight:700;">${badge}</span>
      </div>
      <h2 class="modal-title">${title}</h2>
      <p class="modal-subtitle">${subtitle}</p>
      <div class="modal-meta-bar">
        <span>📅 ${article.date}</span>
        <span>✍️ ${author}</span>
        <span>⏱️ ${readTime}</span>
        <span>🏛️ ${isTh ? CANN_DATA.server.nationTh : CANN_DATA.server.nationEn}</span>
      </div>
    </div>
    <div class="modal-body">
      ${formattedBody}
    </div>
    <div class="modal-footer">
      <div class="engagement-actions">
        <button id="modalLikeBtn" class="interact-btn ${engage.isLiked ? 'liked' : ''}" onclick="handleLikeClick('${article.id}', this)">
          <span>${engage.isLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${engage.currentLikes}</span> ${t.likeLabel}
        </button>
        <button id="modalReadBtn" class="interact-btn ${engage.isRead ? 'read-done' : ''}" onclick="handleReadClick('${article.id}', this)">
          <span>${engage.isRead ? '✓' : '👁️'}</span>
          <span class="read-count">${engage.currentReads}</span> ${t.readLabel}
        </button>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted);">
        ${t.officialRecordNote}
      </div>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  state.selectedArticleId = null;
  renderArticles();
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

// ================= Officials Roster =================
function renderOfficials() {
  const list = document.getElementById('officialsList');
  if (!list) return;
  const isTh = state.lang === 'th';

  list.innerHTML = CANN_DATA.officials.map(person => {
    const role = isTh ? person.roleTh : person.roleEn;
    const bio = isTh ? person.bioTh : person.bioEn;
    return `
      <li style="border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        <span style="font-size: 0.75rem; color: var(--secondary-blue); font-weight:700; text-transform:uppercase; display:block;">${role}</span>
        <strong style="color: var(--primary-blue); font-size: 0.9rem;">${person.name}</strong>
        <p style="color: var(--text-muted); font-size: 0.78rem; line-height: 1.35; margin-top: 2px;">${bio}</p>
      </li>
    `;
  }).join('');
}

// ================= Classifieds & Ads =================
function renderAds() {
  const container = document.getElementById('adsContainer');
  if (!container) return;
  const isTh = state.lang === 'th';

  container.innerHTML = CANN_DATA.ads.map(ad => {
    const title = isTh && ad.title_th ? ad.title_th : ad.title;
    const tagline = isTh && ad.tagline_th ? ad.tagline_th : ad.tagline;
    const desc = isTh && ad.desc_th ? ad.desc_th : ad.desc;
    const badge = isTh && ad.badge_th ? ad.badge_th : ad.badge;
    const price = isTh && ad.price_th ? ad.price_th : ad.price;

    return `
      <div class="ad-card">
        <span class="ad-badge">${badge}</span>
        <h4 class="ad-title">${title}</h4>
        <p class="ad-tagline">${tagline}</p>
        <p class="ad-desc">${desc}</p>
        <div class="ad-footer">
          <span>💰 ${price}</span>
          <span>${ad.contact}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ================= Interactive Sudoku =================
function initSudoku() {
  const puzzle = CANN_DATA.sudokuPuzzles[state.activeSudokuIndex];
  state.sudokuGrid = JSON.parse(JSON.stringify(puzzle.initial));
  state.selectedSudokuCell = null;
  renderSudokuBoard();
  renderSudokuControls();
  renderSudokuSelector();
}

function renderSudokuSelector() {
  const puzzleSelect = document.getElementById('sudokuPuzzleSelect');
  if (!puzzleSelect) return;
  const isTh = state.lang === 'th';

  puzzleSelect.innerHTML = CANN_DATA.sudokuPuzzles.map((p, i) => {
    const title = isTh && p.titleTh ? p.titleTh : p.titleEn;
    const diff = isTh && p.difficultyTh ? p.difficultyTh : p.difficultyEn;
    return `<option value="${i}" ${i === state.activeSudokuIndex ? 'selected' : ''}>${title} (${diff})</option>`;
  }).join('');
}

function renderSudokuBoard() {
  const board = document.getElementById('sudokuBoard');
  if (!board) return;

  const puzzle = CANN_DATA.sudokuPuzzles[state.activeSudokuIndex];
  board.innerHTML = '';

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = state.sudokuGrid[r][c];
      const isFixed = puzzle.initial[r][c] !== 0;
      const isSelected = state.selectedSudokuCell && state.selectedSudokuCell.r === r && state.selectedSudokuCell.c === c;
      
      const cell = document.createElement('div');
      cell.className = `sudoku-cell ${isFixed ? 'fixed' : 'user-input'} ${isSelected ? 'selected' : ''}`;
      if (r === 2 || r === 5) cell.style.borderBottom = '2px solid var(--primary-blue)';
      cell.textContent = val !== 0 ? val : '';

      cell.addEventListener('click', () => {
        if (!isFixed) {
          state.selectedSudokuCell = { r, c };
          renderSudokuBoard();
        }
      });

      board.appendChild(cell);
    }
  }
}

function renderSudokuControls() {
  const numPad = document.getElementById('sudokuNumPad');
  if (!numPad) return;

  numPad.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, '✕'].map(n => `
    <button class="sudoku-num-btn" data-num="${n}">${n}</button>
  `).join('');

  numPad.querySelectorAll('.sudoku-num-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const n = e.currentTarget.getAttribute('data-num');
      applySudokuInput(n);
    });
  });
}

function applySudokuInput(val) {
  if (!state.selectedSudokuCell) return;
  const { r, c } = state.selectedSudokuCell;
  const puzzle = CANN_DATA.sudokuPuzzles[state.activeSudokuIndex];

  if (puzzle.initial[r][c] !== 0) return;

  if (val === '✕' || val === 0) {
    state.sudokuGrid[r][c] = 0;
  } else {
    state.sudokuGrid[r][c] = parseInt(val, 10);
  }
  renderSudokuBoard();
}

function checkSudokuSolution() {
  const puzzle = CANN_DATA.sudokuPuzzles[state.activeSudokuIndex];
  let errors = 0;
  let empty = 0;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = state.sudokuGrid[r][c];
      if (val === 0) {
        empty++;
      } else if (puzzle.solution && val !== puzzle.solution[r][c]) {
        errors++;
      }
    }
  }

  const statusEl = document.getElementById('sudokuStatus');
  if (!statusEl) return;
  const isTh = state.lang === 'th';

  if (errors > 0) {
    statusEl.innerHTML = `<span style="color: #dc2626; font-size: 0.8rem; font-weight:700;">⚠️ ${isTh ? `พบเลขที่ขัดแย้งกัน ${errors} ตำแหน่ง!` : `Found ${errors} conflicting numbers!`}</span>`;
  } else if (empty > 0) {
    statusEl.innerHTML = `<span style="color: var(--secondary-blue); font-size: 0.8rem; font-weight:600;">${isTh ? `ถูกต้องดีมาก! (ยังเหลืออีก ${empty} ช่อง)` : `Looking good so far! (${empty} empty cells left)`}</span>`;
  } else {
    statusEl.innerHTML = `<span style="color: #16a34a; font-size: 0.8rem; font-weight:700;">🎉 ${isTh ? 'ยินดีด้วย! คุณแก้ซูโดกุสำเร็จ!' : 'Brilliant! Sudoku Solved!'}</span>`;
  }
}

function resetSudoku() {
  const puzzle = CANN_DATA.sudokuPuzzles[state.activeSudokuIndex];
  state.sudokuGrid = JSON.parse(JSON.stringify(puzzle.initial));
  state.selectedSudokuCell = null;
  const statusEl = document.getElementById('sudokuStatus');
  if (statusEl) statusEl.innerHTML = '';
  renderSudokuBoard();
}

// ================= Global Event Listeners =================
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderArticles();
    });
  }

  const puzzleSelect = document.getElementById('sudokuPuzzleSelect');
  if (puzzleSelect) {
    puzzleSelect.addEventListener('change', (e) => {
      state.activeSudokuIndex = parseInt(e.target.value, 10);
      initSudoku();
    });
  }

  const checkBtn = document.getElementById('btnCheckSudoku');
  if (checkBtn) checkBtn.addEventListener('click', checkSudokuSolution);

  const resetBtn = document.getElementById('btnResetSudoku');
  if (resetBtn) resetBtn.addEventListener('click', resetSudoku);

  window.addEventListener('keydown', (e) => {
    if (!state.selectedSudokuCell) return;
    if (e.key >= '1' && e.key <= '9') {
      applySudokuInput(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      applySudokuInput('✕');
    }
  });

  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeArticleModal();
      }
    });
  }

  const viewToggleBtn = document.getElementById('viewToggleBtn');
  if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('broadsheet-mode');
      const isBroadsheet = document.body.classList.contains('broadsheet-mode');
      const t = CANN_I18N[state.lang] || CANN_I18N.en;
      viewToggleBtn.innerHTML = isBroadsheet ? t.btnFeed : t.btnBroadsheet;
    });
  }
}
