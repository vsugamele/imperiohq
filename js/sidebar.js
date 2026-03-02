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
      Object.entries(cats).forEach(([cat, projects]) => {
        const icon = _baseCatIcons[cat] || '📁';
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
