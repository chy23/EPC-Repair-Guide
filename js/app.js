/**
 * 麗園國小常見電腦問題指南 - 核心應用程式邏輯
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM 元素快取
  const coverView = document.getElementById("cover-view");
  const mainContainer = document.getElementById("main-container");
  const btnBackCover = document.getElementById("btn-back-cover");
  const categoryTabsWrap = document.getElementById("category-tabs");
  const guideContentArea = document.getElementById("guide-content-area");
  const searchInput = document.getElementById("search-input");
  const searchClearBtn = document.getElementById("search-clear-btn");
  const emptySearchState = document.getElementById("empty-search-state");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  
  // 燈箱與報修彈窗
  const imageLightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const lightboxZoomIn = document.getElementById("lightbox-zoom-in");
  const lightboxZoomOut = document.getElementById("lightbox-zoom-out");
  const lightboxZoomReset = document.getElementById("lightbox-zoom-reset");
  
  const repairModal = document.getElementById("repair-modal");
  const repairModalClose = document.getElementById("repair-modal-close");
  const btnRepairTriggers = document.querySelectorAll(".btn-repair-open");
  const fabToTop = document.getElementById("fab-to-top");

  let currentCategory = "all";
  let currentZoom = 1;

  // 1. 初始化深淺主題
  initTheme();

  // 2. 渲染分類按鈕與問題內容
  renderCategoryTabs();
  renderGuideContent();

  // 3. 處理封面與主畫面的切換
  initViewRouting();

  // 4. 搜尋與篩選事件
  initSearchAndFilters();

  // 5. 燈箱手勢與縮放
  initLightbox();

  // 6. 報修彈窗與捲動事件
  initModalsAndScroll();

  /* ==========================================================================
     畫面狀態與路由切換
     ========================================================================== */
  function initViewRouting() {
    // 檢查網址是否有 hash（若有 hash 直接進入主畫面並展開對應問題）
    const hash = window.location.hash;
    if (hash && hash !== "#cover") {
      showMainView(false);
      handleHashNavigation(hash);
    } else {
      showCoverView(false);
    }

    // 點擊封面「空白處或任意處」進入主頁
    coverView.addEventListener("click", (e) => {
      // 若點擊的是封面上的快速報修按鈕，則不切換畫面，只開彈窗
      if (e.target.closest(".cover-quick-repair-btn")) {
        e.stopPropagation();
        openRepairModal();
        return;
      }
      showMainView(true);
    });

    // 點擊返回封面按鈕
    btnBackCover.addEventListener("click", () => {
      showCoverView(true);
    });

    // 監聽瀏覽器前進/上一頁
    window.addEventListener("popstate", () => {
      const currentHash = window.location.hash;
      if (!currentHash || currentHash === "#cover") {
        showCoverView(false);
      } else {
        showMainView(false);
        handleHashNavigation(currentHash);
      }
    });
  }

  function showCoverView(pushState = true) {
    coverView.classList.remove("hidden-view");
    mainContainer.classList.remove("active-view");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (pushState && window.location.hash !== "#cover") {
      history.pushState(null, "", "#cover");
    }
  }

  function showMainView(pushState = true) {
    coverView.classList.add("hidden-view");
    mainContainer.classList.add("active-view");
    if (pushState && (!window.location.hash || window.location.hash === "#cover")) {
      history.pushState(null, "", "#main");
    }
  }

  function handleHashNavigation(hash) {
    const targetId = hash.replace("#", "");
    if (!targetId || targetId === "main") return;

    // 若 hash 是問題 ID
    setTimeout(() => {
      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        targetCard.classList.add("expanded");
        targetCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }

  /* ==========================================================================
     分類標籤與內容渲染
     ========================================================================== */
  function renderCategoryTabs() {
    let tabsHtml = `<button class="tab-pill active" data-cat="all">🌟 全部問題</button>`;
    GUIDE_DATA.forEach((cat) => {
      tabsHtml += `<button class="tab-pill" data-cat="${cat.id}">${cat.shortTitle}</button>`;
    });
    categoryTabsWrap.innerHTML = tabsHtml;

    // 綁定分頁點擊事件
    categoryTabsWrap.querySelectorAll(".tab-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryTabsWrap.querySelectorAll(".tab-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-cat");
        applyFilter();
      });
    });
  }

  function renderGuideContent() {
    let html = "";

    GUIDE_DATA.forEach((cat) => {
      html += `
        <section class="category-section" id="section-${cat.id}" data-category-id="${cat.id}">
          <div class="category-header-card">
            <div class="cat-head-left">
              <div class="cat-icon-badge cat-${cat.color}">
                ${getCategoryIcon(cat.icon)}
              </div>
              <div class="cat-info">
                <h2>${cat.title}</h2>
                <p>${cat.description}</p>
              </div>
            </div>
            <div class="cat-count-badge">${cat.items.length} 則指南</div>
          </div>
          <div class="category-items-list">
            ${cat.items.map((item) => renderProblemCard(item, cat)).join("")}
          </div>
        </section>
      `;
    });

    guideContentArea.innerHTML = html;

    // 綁定所有手風琴卡片的點擊展開/收合
    attachAccordionEvents();
  }

  function renderProblemCard(item, category) {
    return `
      <article class="problem-card" id="${item.id}" data-tags="${(item.tags || []).join(' ').toLowerCase()}">
        <div class="problem-header" role="button" tabindex="0" aria-expanded="false">
          <div class="problem-title-group">
            <span class="problem-q-badge">${category.badge}</span>
            <h3 class="problem-title">${item.title}</h3>
            <div class="problem-tags">
              ${(item.tags || []).slice(0, 4).map(t => `<span class="tag-badge">#${t}</span>`).join("")}
            </div>
          </div>
          <div class="accordion-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <div class="problem-body">
          <div class="problem-body-content">
            ${renderProblemDetails(item)}
          </div>
        </div>
      </article>
    `;
  }

  function renderProblemDetails(item) {
    let detailsHtml = "";

    // 1. 原因分析區塊
    if (item.cause) {
      detailsHtml += `
        <div class="info-block info-block-cause">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            原因分析
          </div>
          <p class="info-text">${item.cause}</p>
        </div>
      `;
    }

    // 2. 單一解決方式
    if (item.solution) {
      detailsHtml += `
        <div class="info-block info-block-solution">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            解決方式
          </div>
          <p class="info-text">${item.solution}</p>
        </div>
      `;
    }

    // 3. 多重解決方式 (例如大屏、學生預設密碼逾期)
    if (item.solutions) {
      detailsHtml += `
        <div class="info-block info-block-solution">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            步驟與處置方法
          </div>
          <ul class="styled-list">
            ${item.solutions.map(s => `
              <li>
                <span class="list-bullet">✦</span>
                <div><strong>${s.label}：</strong>${s.text}</div>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    if (item.solutionList) {
      detailsHtml += `
        <div class="info-block info-block-solution">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
            解法（擇一執行）
          </div>
          <ul class="styled-list">
            ${item.solutionList.map(s => `
              <li>
                <span class="list-bullet">✔</span>
                <div><strong>${s.role}：</strong>${s.text}</div>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    // 4. N4660 BIOS 7 步驟專區（附精美圖解與點擊放大）
    if (item.biosSteps) {
      detailsHtml += `
        <div class="stepper-header">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>
            N4660 主機 BIOS 設定 7 大步驟
          </h4>
        </div>
        <div class="bios-steps-container">
          ${item.biosSteps.map(step => `
            <div class="bios-step-item">
              <div class="step-top-row">
                <span class="step-number-badge">${step.step}</span>
                <span class="step-item-title">${step.title}</span>
              </div>
              <p class="step-item-desc">${step.desc}</p>
              ${step.tip ? `<div class="step-tip">💡 提示：${step.tip}</div>` : ""}
              ${step.img ? `
                <div class="step-image-wrap" data-img-src="${step.img}" data-img-title="步驟 ${step.step}：${step.title}">
                  <img src="${step.img}" alt="步驟 ${step.step} 截圖" loading="lazy">
                  <div class="img-zoom-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    點擊放大檢視
                  </div>
                </div>
              ` : ""}
            </div>
          `).join("")}
        </div>
        <div class="full-pages-toggle-wrap">
          <button class="btn-secondary-action btn-view-full-bios" data-pages='${JSON.stringify(item.extraImages)}'>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            查看原始 BIOS 完整整頁圖表 (共 3 頁)
          </button>
        </div>
      `;
    }

    // 5. 網路連線參數表格 (eduroam)
    if (item.details) {
      detailsHtml += `
        <div class="spec-list">
          ${item.details.map(d => `
            <div class="spec-row">
              <span class="spec-name">${d.label}</span>
              <span class="spec-val">${d.value}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    // 6. 親師生平台重點清單
    if (item.keyPoints) {
      detailsHtml += `
        <div class="info-block info-block-neutral">
          <div class="info-label">重點提示</div>
          <ul class="styled-list">
            ${item.keyPoints.map(kp => `<li><span class="list-bullet">•</span><div>${kp}</div></li>`).join("")}
          </ul>
        </div>
      `;
    }

    // 7. 角色矩陣卡片 (忘記密碼找誰)
    if (item.roles) {
      detailsHtml += `
        <div class="roles-grid">
          ${item.roles.map(r => `
            <div class="role-card">
              <span class="role-badge">${r.identity}</span>
              <span class="role-contact">${r.contact}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    // 8. 驗證步驟清單 (如何驗證備用信箱及行動電話)
    if (item.steps) {
      detailsHtml += `
        <div class="bios-steps-container">
          ${item.steps.map(s => `
            <div class="bios-step-item">
              <div class="step-top-row">
                <span class="step-number-badge">${s.stepNum}</span>
                <span class="step-item-title">${s.title}</span>
              </div>
              <p class="step-item-desc">${s.desc}</p>
              ${s.img ? `
                <div class="step-image-wrap" data-img-src="${s.img}" data-img-title="步驟 ${s.stepNum}：${s.title}">
                  <img src="${s.img}" alt="${s.title}" loading="lazy">
                  <div class="img-zoom-tag">點擊放大檢視</div>
                </div>
              ` : ""}
            </div>
          `).join("")}
        </div>
      `;
    }

    // 9. 圖片展示 (官方簡報截圖)
    if (item.images && item.images.length > 0) {
      detailsHtml += `
        <div class="extra-images-grid" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
          ${item.images.map(img => `
            <div class="step-image-wrap" data-img-src="${img.img}" data-img-title="${img.title}">
              <img src="${img.img}" alt="${img.title}" loading="lazy">
              <div class="img-zoom-tag">點擊放大查看：${img.title}</div>
            </div>
          `).join("")}
        </div>
      `;
    }

    // 10. 注意事項 / 註解
    if (item.precautions) {
      detailsHtml += `
        <div class="info-block info-block-notice">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            注意事項
          </div>
          <ul class="styled-list">
            ${item.precautions.map(p => `<li><span class="list-bullet">⚠</span><div>${p}</div></li>`).join("")}
          </ul>
        </div>
      `;
    }

    if (item.notes) {
      detailsHtml += `
        <div class="info-block info-block-neutral">
          <ul class="styled-list">
            ${item.notes.map(n => `<li><span class="list-bullet">※</span><div>${n}</div></li>`).join("")}
          </ul>
        </div>
      `;
    }

    if (item.notice) {
      detailsHtml += `
        <div class="info-block info-block-notice">
          <p class="info-text" style="font-weight: 600;">⚠️ ${item.notice}</p>
        </div>
      `;
    }

    return detailsHtml;
  }

  function attachAccordionEvents() {
    const headers = guideContentArea.querySelectorAll(".problem-header");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const card = header.closest(".problem-card");
        const isExpanded = card.classList.contains("expanded");
        
        // 切換展開狀態
        card.classList.toggle("expanded");
        header.setAttribute("aria-expanded", !isExpanded);

        // 如果展開了，更新 URL hash
        if (!isExpanded) {
          history.replaceState(null, "", `#${card.id}`);
        }
      });
    });

    // 圖片點擊放大事件
    guideContentArea.querySelectorAll(".step-image-wrap").forEach((imgWrap) => {
      imgWrap.addEventListener("click", (e) => {
        e.stopPropagation();
        const src = imgWrap.getAttribute("data-img-src");
        const title = imgWrap.getAttribute("data-img-title") || "放大檢視";
        openLightbox(src, title);
      });
    });

    // 查看完整 BIOS 原始頁面按鈕
    guideContentArea.querySelectorAll(".btn-view-full-bios").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pages = JSON.parse(btn.getAttribute("data-pages") || "[]");
        if (pages.length > 0) {
          openLightbox(pages[0].img, pages[0].title);
        }
      });
    });
  }

  /* ==========================================================================
     搜尋與篩選機制
     ========================================================================== */
  function initSearchAndFilters() {
    searchInput.addEventListener("input", () => {
      applyFilter();
    });

    searchClearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      applyFilter();
    });
  }

  function applyFilter() {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    const sections = guideContentArea.querySelectorAll(".category-section");

    sections.forEach((section) => {
      const catId = section.getAttribute("data-category-id");
      const isCatMatch = (currentCategory === "all" || currentCategory === catId);

      const cards = section.querySelectorAll(".problem-card");
      let sectionVisibleCount = 0;

      cards.forEach((card) => {
        const cardText = card.innerText.toLowerCase();
        const cardTags = card.getAttribute("data-tags") || "";
        const isSearchMatch = !keyword || cardText.includes(keyword) || cardTags.includes(keyword);

        if (isCatMatch && isSearchMatch) {
          card.style.display = "block";
          sectionVisibleCount++;
          visibleCount++;

          // 如果正在搜尋，自動展開吻合的問題以便閱讀
          if (keyword) {
            card.classList.add("expanded");
          }
        } else {
          card.style.display = "none";
        }
      });

      // 如果分類內無吻合項目，隱藏該分類區塊標題
      section.style.display = (sectionVisibleCount > 0) ? "flex" : "none";
    });

    // 無結果提示
    if (visibleCount === 0) {
      emptySearchState.classList.add("active");
    } else {
      emptySearchState.classList.remove("active");
    }
  }

  /* ==========================================================================
     圖片燈箱 (LIGHTBOX)
     ========================================================================== */
  function initLightbox() {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
    imageLightbox.addEventListener("click", (e) => {
      if (e.target === imageLightbox || e.target.classList.contains("lightbox-img-stage")) {
        closeLightbox();
      }
    });

    lightboxZoomIn.addEventListener("click", () => {
      currentZoom = Math.min(currentZoom + 0.3, 3);
      updateLightboxZoom();
    });

    lightboxZoomOut.addEventListener("click", () => {
      currentZoom = Math.max(currentZoom - 0.3, 0.8);
      updateLightboxZoom();
    });

    lightboxZoomReset.addEventListener("click", () => {
      currentZoom = 1;
      updateLightboxZoom();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && imageLightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxCaption.textContent = title;
    currentZoom = 1;
    updateLightboxZoom();
    imageLightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    imageLightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  function updateLightboxZoom() {
    lightboxImg.style.transform = `scale(${currentZoom})`;
  }

  /* ==========================================================================
     報修彈窗與捲動行為
     ========================================================================== */
  function initModalsAndScroll() {
    btnRepairTriggers.forEach(btn => {
      btn.addEventListener("click", openRepairModal);
    });

    repairModalClose.addEventListener("click", closeRepairModal);
    repairModal.addEventListener("click", (e) => {
      if (e.target === repairModal) {
        closeRepairModal();
      }
    });

    // 捲動至頂部按鈕
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        fabToTop.classList.add("visible");
      } else {
        fabToTop.classList.remove("visible");
      }
    }, { passive: true });

    fabToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function openRepairModal() {
    repairModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeRepairModal() {
    repairModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  /* ==========================================================================
     深淺色主題切換
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem("ly_theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const nextTheme = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("ly_theme", nextTheme);
    });
  }

  // 圖示工具輔助函式
  function getCategoryIcon(type) {
    switch (type) {
      case "monitor":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
      case "wifi":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
      case "key":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 2l-2 2m-2-2l2 2m-2 2l2-2m-2 2l-6.5 6.5a5.5 5.5 0 1 1-2.83-2.83L17 4l4-2z"></path></svg>`;
      case "shield-check":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`;
      default:
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
  }
});
