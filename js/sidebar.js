// ═══════════════════════════════════════════════════════
//  SIDEBAR COLAPSÁVEL
// ═══════════════════════════════════════════════════════
let sidebarCollapsed = JSON.parse(localStorage.getItem('imperio_sidebar_collapsed') || '{}');

// Override renderSidebar to support collapsible cats + subprojects
const _baseCatIcons = { iGaming: '🎰', Lançamentos: '🚀', Infoprodutos: '📦', Nutracêuticos: '🌿', Ecommerce: '🛒', Forex: '📈', Clínica: '🌿', Automação: '🤖' };
let sidebarParentCollapsed = JSON.parse(localStorage.getItem('imperio_sidebar_parent_collapsed') || '{}');
function toggleSidebarParent(parentId) {
  sidebarParentCollapsed[parentId] = !sidebarParentCollapsed[parentId];
  localStorage.setItem('imperio_sidebar_parent_collapsed', JSON.stringify(sidebarParentCollapsed));
  renderSidebar();
}
function renderSidebar() {
  window.projects = PROJECTS;
  const cats = {};
  // Separate root projects and subprojects
  const rootProjects = PROJECTS.filter(p => !p.parent_id);
  const subProjectsMap = {};
  PROJECTS.filter(p => p.parent_id).forEach(p => {
    if (!subProjectsMap[p.parent_id]) subProjectsMap[p.parent_id] = [];
    subProjectsMap[p.parent_id].push(p);
  });
  rootProjects.forEach(p => {
    if (!cats[p.categoria]) cats[p.categoria] = [];
    cats[p.categoria].push(p);
  });
  const container = document.getElementById('sidebar-projects');
  let html = '';

  const _customCatIcons = JSON.parse(localStorage.getItem('imperio_custom_cat_icons') || '{}');

  Object.entries(cats).forEach(([cat, projects]) => {
    const icon = _customCatIcons[cat] || _baseCatIcons[cat] || '📁';
    const collapsed = sidebarCollapsed[cat] ? 'collapsed' : '';
    html += `<div class="cat-header" onclick="toggleSidebarCat('${cat}')" style="padding:8px 14px 4px;font-size:10px;font-weight:700;color:var(--text3);letter-spacing:1px;display:flex;align-items:center;gap:6px">
          ${icon} ${cat}
          <span class="cat-toggle ${collapsed}" style="margin-left:auto">▾</span>
        </div>
        <div class="cat-projects ${collapsed}">`;
    projects.forEach(p => {
      const badge = p.vende ? '<span class="badge sell">SELL</span>' : `<span class="badge">${p.status}</span>`;
      const children = subProjectsMap[p.id] || [];
      const hasChildren = children.length > 0;
      const parentCollapsed = sidebarParentCollapsed[p.id];
      if (hasChildren) {
        html += `<div class="nav-item nav-parent" id="nav-${p.id}">
              <span class="icon" onclick="event.stopPropagation();toggleSidebarParent('${p.id}')" style="cursor:pointer;font-size:10px;color:var(--text3);width:14px;text-align:center">${parentCollapsed ? '▸' : '▾'}</span>
              <span class="icon" onclick="openProject('${p.id}')">${p.icon}</span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer" onclick="openProject('${p.id}')">${p.nome}</span>
              <span style="font-size:9px;color:var(--text3);margin-right:4px">${children.length}</span>
              ${badge}
            </div>`;
        if (!parentCollapsed) {
          children.forEach(sp => {
            const sBadge = sp.vende ? '<span class="badge sell">SELL</span>' : `<span class="badge">${sp.status}</span>`;
            html += `<div class="nav-item nav-subproject" onclick="openProject('${sp.id}')" id="nav-${sp.id}">
                  <span style="width:14px"></span>
                  <span class="icon" style="font-size:12px">${sp.icon}</span>
                  <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">${sp.nome}</span>
                  ${sBadge}
                </div>`;
          });
        }
      } else {
        html += `<div class="nav-item" onclick="openProject('${p.id}')" id="nav-${p.id}">
              <span class="icon">${p.icon}</span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nome}</span>
              ${badge}
            </div>`;
      }
    });
    html += `</div>`;
  });
  container.innerHTML = html;
}

function toggleSidebarCat(cat) {
  sidebarCollapsed[cat] = !sidebarCollapsed[cat];
  localStorage.setItem('imperio_sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  renderSidebar();
}

// ── Sidebar Nav Group Toggle (Sprint 1.1) ──────────────────────
let _snavCollapsed = JSON.parse(localStorage.getItem('imperio_snav_collapsed') || '{}');

function toggleSidebarGroup(group) {
  _snavCollapsed[group] = !_snavCollapsed[group];
  localStorage.setItem('imperio_snav_collapsed', JSON.stringify(_snavCollapsed));
  _applySnavState();
}

function _applySnavState() {
  ['gestao', 'ia', 'config'].forEach(g => {
    const items = document.getElementById('snav-items-' + g);
    const arrow = document.getElementById('snav-arrow-' + g);
    if (!items) return;
    if (_snavCollapsed[g]) {
      items.classList.add('snav-collapsed');
      if (arrow) arrow.classList.add('snav-collapsed');
    } else {
      items.classList.remove('snav-collapsed');
      if (arrow) arrow.classList.remove('snav-collapsed');
    }
  });
}

// Apply on load
document.addEventListener('DOMContentLoaded', () => {
  _applySnavState();

  // ── Mobile sidebar swipe-to-close (Sprint 7.1) ────────────────
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  let _touchStartX = 0;

  document.addEventListener('touchstart', e => { _touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _touchStartX;
    // swipe left → close sidebar
    if (dx < -50 && sidebar && sidebar.classList.contains('sidebar-mobile-open')) {
      closeSidebarMobile();
    }
    // swipe right from left edge → open sidebar
    if (dx > 50 && _touchStartX < 24) {
      openSidebarMobile();
    }
  }, { passive: true });
});

function openSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.add('sidebar-mobile-open');
  if (overlay) overlay.style.display = 'block';
}

function closeSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('sidebar-mobile-open');
  if (overlay) overlay.style.display = 'none';
}
