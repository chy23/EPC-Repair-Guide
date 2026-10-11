/**
 * 麗園國小常見電腦問題指南 - 核心應用程式邏輯 (分層式跳轉路由)
 * 層級 0: 封面 (#cover)
 * 層級 1: 大項目列表 (#categories)
 * 層級 2: 細項問題清單 (#category/:id)
 * 層級 3: 題目與解法詳解頁 (#question/:id)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 檢視容器
  const views = {
    cover: document.getElementById("view-cover"),
    categories: document.getElementById("view-categories"),
    categoryQuestions: document.getElementById("view-category-questions"),
    questionDetail: document.getElementById("view-question-detail")
  };

  // 封面相關
  const btnBackToCover = document.getElementById("btn-back-to-cover");
  
  // 大項目相關
  const categoriesCardsGrid = document.getElementById("categories-cards-grid");
  const categoriesMainList = document.getElementById("categories-main-list");
  const globalSearchInput = document.getElementById("global-search-input");
  const globalSearchClear = document.getElementById("global-search-clear");
  const searchResultsContainer = document.getElementById("search-results-container");
  const searchResultsList = document.getElementById("search-results-list");
  const searchResultCount = document.getElementById("search-result-count");

  // 細項問題列表相關
  const btnBackToCategories = document.getElementById("btn-back-to-categories");
  const crumbToCategories = document.getElementById("crumb-to-categories");
  const crumbCategoryName = document.getElementById("crumb-category-name");
  const subCategoryHeaderTitle = document.getElementById("sub-category-header-title");
  const subCategoryHeaderBadge = document.getElementById("sub-category-header-badge");
  const subCategoryBanner = document.getElementById("sub-category-banner");
  const categoryQuestionsList = document.getElementById("category-questions-list");
  const categoryQuestionsCount = document.getElementById("category-questions-count");

  // 詳解頁相關
  const btnBackToQuestions = document.getElementById("btn-back-to-questions");
  const crumbDetailToCategories = document.getElementById("crumb-detail-to-categories");
  const crumbDetailToQuestions = document.getElementById("crumb-detail-to-questions");
  const crumbDetailTitle = document.getElementById("crumb-detail-title");
  const detailCategoryBadge = document.getElementById("detail-category-badge");
  const questionDetailContent = document.getElementById("question-detail-content");
  const btnPrevQuestion = document.getElementById("btn-prev-question");
  const btnNextQuestion = document.getElementById("btn-next-question");
  const btnBackListBottom = document.getElementById("btn-back-list-bottom");

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
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");

  let currentCategoryObj = null;
  let currentQuestionObj = null;
  let currentZoom = 1;

  // 1. 初始化主題
  initTheme();

  // 2. 渲染大項目選單
  renderCategoriesGrid();

  // 3. 註冊路由與導航監聽
  initRouter();

  // 4. 註冊搜尋事件
  initSearch();

  // 5. 註冊燈箱與彈窗事件
  initModals();

  /* ==========================================================================
     路由與視圖切換
     ========================================================================== */
  function initRouter() {
    // 點擊封面空白處進入大項目
    views.cover.addEventListener("click", (e) => {
      if (e.target.closest(".cover-quick-repair-btn")) {
        e.stopPropagation();
        openRepairModal();
        return;
      }
      navigateTo("#categories");
    });

    // 返回封面
    btnBackToCover.addEventListener("click", () => navigateTo("#cover"));

    // 細項問題頁返回大項目
    btnBackToCategories.addEventListener("click", () => navigateTo("#categories"));
    crumbToCategories.addEventListener("click", () => navigateTo("#categories"));

    // 詳解頁返回問題清單或大項目
    crumbDetailToCategories.addEventListener("click", () => navigateTo("#categories"));
    crumbDetailToQuestions.addEventListener("click", () => {
      if (currentCategoryObj) {
        navigateTo(`#category/${currentCategoryObj.id}`);
      } else {
        navigateTo("#categories");
      }
    });
    btnBackToQuestions.addEventListener("click", () => {
      if (currentCategoryObj) {
        navigateTo(`#category/${currentCategoryObj.id}`);
      } else {
        navigateTo("#categories");
      }
    });
    btnBackListBottom.addEventListener("click", () => {
      if (currentCategoryObj) {
        navigateTo(`#category/${currentCategoryObj.id}`);
      } else {
        navigateTo("#categories");
      }
    });

    // 詳解頁上一題 / 下一題
    btnPrevQuestion.addEventListener("click", () => {
      if (!currentCategoryObj || !currentQuestionObj) return;
      const idx = currentCategoryObj.items.findIndex(i => i.id === currentQuestionObj.id);
      if (idx > 0) {
        navigateTo(`#question/${currentCategoryObj.items[idx - 1].id}`);
      }
    });
    btnNextQuestion.addEventListener("click", () => {
      if (!currentCategoryObj || !currentQuestionObj) return;
      const idx = currentCategoryObj.items.findIndex(i => i.id === currentQuestionObj.id);
      if (idx < currentCategoryObj.items.length - 1) {
        navigateTo(`#question/${currentCategoryObj.items[idx + 1].id}`);
      }
    });

    // 監聽網址 Hash 變更
    window.addEventListener("hashchange", handleRoute);

    // 初始載入路由
    handleRoute();
  }

  function navigateTo(hash) {
    if (window.location.hash === hash) {
      handleRoute();
    } else {
      window.location.hash = hash;
    }
  }

  function handleRoute() {
    const hash = window.location.hash || "#cover";
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (hash === "#cover") {
      switchView("cover");
      return;
    }

    if (hash === "#categories") {
      switchView("categories");
      return;
    }

    if (hash.startsWith("#category/")) {
      const catId = hash.replace("#category/", "");
      const foundCat = GUIDE_DATA.find(c => c.id === catId);
      if (foundCat) {
        currentCategoryObj = foundCat;
        renderCategoryQuestionsView(foundCat);
        switchView("categoryQuestions");
      } else {
        navigateTo("#categories");
      }
      return;
    }

    if (hash.startsWith("#question/")) {
      const qId = hash.replace("#question/", "");
      let foundCat = null;
      let foundItem = null;

      for (const cat of GUIDE_DATA) {
        const item = cat.items.find(i => i.id === qId);
        if (item) {
          foundCat = cat;
          foundItem = item;
          break;
        }
      }

      if (foundCat && foundItem) {
        currentCategoryObj = foundCat;
        currentQuestionObj = foundItem;
        renderQuestionDetailView(foundCat, foundItem);
        switchView("questionDetail");
      } else {
        navigateTo("#categories");
      }
      return;
    }

    // 預設跳回封面
    switchView("cover");
  }

  function switchView(viewName) {
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add("active");
      } else {
        views[key].classList.remove("active");
      }
    });
  }

  /* ==========================================================================
     層級 1：渲染四大項目卡片清單
     ========================================================================== */
  function renderCategoriesGrid() {
    let html = "";
    GUIDE_DATA.forEach((cat) => {
      html += `
        <div class="category-select-card" data-cat-id="${cat.id}">
          <div class="cat-card-left">
            <div class="cat-icon-badge cat-${cat.color}">
              ${getCategoryIcon(cat.icon)}
            </div>
            <div class="cat-card-body">
              <span class="cat-card-top-tag">${cat.badge}</span>
              <h3 class="cat-card-title">${cat.title}</h3>
              <p class="cat-card-desc">${cat.description}</p>
            </div>
          </div>
          <div class="cat-card-right">
            <span class="cat-count-pill">${cat.items.length} 則問題</span>
            <div class="cat-arrow-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      `;
    });

    categoriesCardsGrid.innerHTML = html;

    // 點擊大項目卡片進入細項問題清單
    categoriesCardsGrid.querySelectorAll(".category-select-card").forEach(card => {
      card.addEventListener("click", () => {
        const catId = card.getAttribute("data-cat-id");
        navigateTo(`#category/${catId}`);
      });
    });
  }

  /* ==========================================================================
     層級 2：渲染細項問題列表頁
     ========================================================================== */
  function renderCategoryQuestionsView(category) {
    // 麵包屑與標頭資訊
    crumbCategoryName.textContent = category.shortTitle;
    subCategoryHeaderTitle.textContent = category.shortTitle;
    subCategoryHeaderBadge.textContent = `共 ${category.items.length} 題`;

    // 分類導覽資訊橫幅
    subCategoryBanner.innerHTML = `
      <div class="cat-icon-badge cat-${category.color}">
        ${getCategoryIcon(category.icon)}
      </div>
      <div class="cat-card-body">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); line-height: 1.35;">${category.title}</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">${category.description}</p>
      </div>
    `;

    categoryQuestionsCount.textContent = `共 ${category.items.length} 則問題`;

    // 問題列表卡片
    let itemsHtml = "";
    category.items.forEach((item, index) => {
      itemsHtml += `
        <article class="question-item-card" data-q-id="${item.id}">
          <div class="q-card-content">
            <span class="q-card-num-badge">問題 ${index + 1}</span>
            <h4 class="q-card-title">${item.title}</h4>
            <div class="q-card-tags">
              ${(item.tags || []).slice(0, 3).map(t => `<span class="tag-badge">#${t}</span>`).join("")}
            </div>
          </div>
          <div class="q-card-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </article>
      `;
    });

    categoryQuestionsList.innerHTML = itemsHtml;

    // 點擊問題卡片進入詳解頁
    categoryQuestionsList.querySelectorAll(".question-item-card").forEach(card => {
      card.addEventListener("click", () => {
        const qId = card.getAttribute("data-q-id");
        navigateTo(`#question/${qId}`);
      });
    });
  }

  /* ==========================================================================
     層級 3：渲染題目與解法獨立詳解頁
     ========================================================================== */
  function renderQuestionDetailView(category, item) {
    // 麵包屑與標籤
    crumbDetailToQuestions.textContent = category.shortTitle;
    crumbDetailTitle.textContent = item.title;
    detailCategoryBadge.textContent = category.badge;

    // 計算上一題 / 下一題按鈕狀態
    const currentIndex = category.items.findIndex(i => i.id === item.id);
    btnPrevQuestion.disabled = (currentIndex <= 0);
    btnNextQuestion.disabled = (currentIndex >= category.items.length - 1);

    // 組合詳解頁完整內容
    let html = `
      <div class="detail-headline-card">
        <span class="detail-category-tag">${category.badge}</span>
        <h2 class="detail-main-title">${item.title}</h2>
        <div class="problem-tags">
          ${(item.tags || []).map(t => `<span class="tag-badge">#${t}</span>`).join("")}
        </div>
      </div>
    `;

    // 1. 原因分析
    if (item.cause) {
      html += `
        <div class="info-block info-block-cause">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            【原因分析】
          </div>
          <p class="info-text">${item.cause}</p>
        </div>
      `;
    }

    // 2. 單一解決方式
    if (item.solution) {
      html += `
        <div class="info-block info-block-solution">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            【解決方式】
          </div>
          <p class="info-text">${item.solution}</p>
        </div>
      `;
    }

    // 3. 多重解決方式
    if (item.solutions) {
      html += `
        <div class="info-block info-block-solution">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            【解決方式】
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
      html += `
        <div class="info-block info-block-solution">
          <div class="info-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
            【解決解法（擇一執行）】
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

    // 4. N4660 BIOS 7 步驟專屬區塊
    if (item.biosSteps) {
      html += `
        <div class="stepper-header">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>
            N4660 主機 BIOS 設定步驟 (依序執行 1~7 步)
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

    // 5. 網路參數清單 (eduroam)
    if (item.details) {
      html += `
        <div class="spec-list">
          <div style="font-weight: 700; margin-bottom: 0.2rem; color: var(--primary);">eduroam 連線參數設定對照</div>
          ${item.details.map(d => `
            <div class="spec-row">
              <span class="spec-name">${d.label}</span>
              <span class="spec-val">${d.value}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (item.tips) {
      html += `
        <div class="info-block info-block-neutral">
          <div class="info-label">連線優勢與秘訣</div>
          <ul class="styled-list">
            ${item.tips.map(t => `<li><span class="list-bullet">•</span><div>${t}</div></li>`).join("")}
          </ul>
        </div>
      `;
    }

    // 6. 親師生重點
    if (item.keyPoints) {
      html += `
        <div class="info-block info-block-neutral">
          <div class="info-label">重點提示</div>
          <ul class="styled-list">
            ${item.keyPoints.map(kp => `<li><span class="list-bullet">•</span><div>${kp}</div></li>`).join("")}
          </ul>
        </div>
      `;
    }

    // 7. 角色矩陣卡片 (找誰還原)
    if (item.roles) {
      html += `
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

    // 8. 驗證步驟清單
    if (item.steps) {
      html += `
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

    // 9. 圖片展示
    if (item.images && item.images.length > 0) {
      html += `
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
          ${item.images.map(img => `
            <div class="step-image-wrap" data-img-src="${img.img}" data-img-title="${img.title}">
              <img src="${img.img}" alt="${img.title}" loading="lazy">
              <div class="img-zoom-tag">點擊放大查看：${img.title}</div>
            </div>
          `).join("")}
        </div>
      `;
    }

    // 10. 注意事項
    if (item.precautions) {
      html += `
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
      html += `
        <div class="info-block info-block-neutral">
          <ul class="styled-list">
            ${item.notes.map(n => `<li><span class="list-bullet">※</span><div>${n}</div></li>`).join("")}
          </ul>
        </div>
      `;
    }

    if (item.notice) {
      html += `
        <div class="info-block info-block-notice">
          <p class="info-text" style="font-weight: 700;">⚠️ ${item.notice}</p>
        </div>
      `;
    }

    // 11. 仍無法解決？線上報修引導區塊
    html += `
      <div class="detail-repair-action-card">
        <div class="repair-card-text">
          <div style="font-weight: 800; font-size: 0.95rem; color: #991b1b; display: flex; align-items: center; gap: 0.4rem;">
            <span>⚠️ 依照上述步驟若仍無法解決問題？</span>
          </div>
          <p style="font-size: 0.82rem; color: #b91c1c; margin-top: 0.2rem;">
            請記得通報報修，由資訊組派員或廠商協助處理。
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <a href="https://esa.ntpc.edu.tw/web-maintain/templates/maintain_pub.html?schno=014793" target="_blank" rel="noopener noreferrer" class="btn-detail-online-repair">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            線上填寫報修單 (schno=014793) ➔
          </a>
          <button type="button" class="btn-detail-quick-dial btn-repair-open">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            分機 814
          </button>
        </div>
      </div>
    `;

    questionDetailContent.innerHTML = html;

    // 重新綁定報修彈窗按鈕
    questionDetailContent.querySelectorAll(".btn-repair-open").forEach(btn => {
      btn.addEventListener("click", openRepairModal);
    });

    // 綁定放大圖片事件
    questionDetailContent.querySelectorAll(".step-image-wrap").forEach(wrap => {
      wrap.addEventListener("click", () => {
        const src = wrap.getAttribute("data-img-src");
        const title = wrap.getAttribute("data-img-title") || "放大檢視";
        openLightbox(src, title);
      });
    });

    // 完整 BIOS 全圖
    questionDetailContent.querySelectorAll(".btn-view-full-bios").forEach(btn => {
      btn.addEventListener("click", () => {
        const pages = JSON.parse(btn.getAttribute("data-pages") || "[]");
        if (pages.length > 0) {
          openLightbox(pages[0].img, pages[0].title);
        }
      });
    });
  }

  /* ==========================================================================
     搜尋功能 (跨分類快速搜尋)
     ========================================================================== */
  function initSearch() {
    globalSearchInput.addEventListener("input", () => {
      const query = globalSearchInput.value.trim().toLowerCase();
      if (!query) {
        categoriesMainList.style.display = "flex";
        searchResultsContainer.style.display = "none";
        return;
      }

      categoriesMainList.style.display = "none";
      searchResultsContainer.style.display = "flex";

      const matched = [];
      GUIDE_DATA.forEach(cat => {
        cat.items.forEach(item => {
          const text = (item.title + " " + (item.cause || "") + " " + (item.solution || "") + " " + (item.tags || []).join(" ")).toLowerCase();
          if (text.includes(query)) {
            matched.push({ cat, item });
          }
        });
      });

      searchResultCount.textContent = `${matched.length} 筆`;

      if (matched.length === 0) {
        searchResultsList.innerHTML = `
          <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
            <p style="font-weight: 700;">未找到與「${query}」相關的問題</p>
            <p style="font-size: 0.85rem; margin-top: 0.2rem;">請嘗試不同關鍵字，或利用上方「報修專區」聯繫資訊組。</p>
          </div>
        `;
        return;
      }

      let resHtml = "";
      matched.forEach(({ cat, item }) => {
        resHtml += `
          <article class="question-item-card" data-q-id="${item.id}">
            <div class="q-card-content">
              <span class="q-card-num-badge">${cat.shortTitle}</span>
              <h4 class="q-card-title">${item.title}</h4>
              <div class="q-card-tags">
                ${(item.tags || []).slice(0, 3).map(t => `<span class="tag-badge">#${t}</span>`).join("")}
              </div>
            </div>
            <div class="q-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </article>
        `;
      });

      searchResultsList.innerHTML = resHtml;

      searchResultsList.querySelectorAll(".question-item-card").forEach(card => {
        card.addEventListener("click", () => {
          const qId = card.getAttribute("data-q-id");
          navigateTo(`#question/${qId}`);
        });
      });
    });

    globalSearchClear.addEventListener("click", () => {
      globalSearchInput.value = "";
      categoriesMainList.style.display = "flex";
      searchResultsContainer.style.display = "none";
      globalSearchInput.focus();
    });
  }

  /* ==========================================================================
     圖片燈箱與報修彈窗
     ========================================================================== */
  function initModals() {
    // 燈箱
    lightboxCloseBtn.addEventListener("click", closeLightbox);
    imageLightbox.addEventListener("click", (e) => {
      if (e.target === imageLightbox || e.target.classList.contains("lightbox-img-stage")) {
        closeLightbox();
      }
    });

    lightboxZoomIn.addEventListener("click", () => {
      currentZoom = Math.min(currentZoom + 0.3, 3);
      lightboxImg.style.transform = `scale(${currentZoom})`;
    });

    lightboxZoomOut.addEventListener("click", () => {
      currentZoom = Math.max(currentZoom - 0.3, 0.8);
      lightboxImg.style.transform = `scale(${currentZoom})`;
    });

    lightboxZoomReset.addEventListener("click", () => {
      currentZoom = 1;
      lightboxImg.style.transform = `scale(1)`;
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && imageLightbox.classList.contains("active")) {
        closeLightbox();
      }
    });

    // 報修彈窗
    btnRepairTriggers.forEach(btn => {
      btn.addEventListener("click", openRepairModal);
    });

    repairModalClose.addEventListener("click", closeRepairModal);
    repairModal.addEventListener("click", (e) => {
      if (e.target === repairModal) {
        closeRepairModal();
      }
    });
  }

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxCaption.textContent = title;
    currentZoom = 1;
    lightboxImg.style.transform = `scale(1)`;
    imageLightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    imageLightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxImg.src = "";
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
     主題控制
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem("ly_theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    themeToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const nextTheme = isDark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("ly_theme", nextTheme);
      });
    });
  }

  function getCategoryIcon(type) {
    switch (type) {
      case "monitor":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
      case "wifi":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
      case "key":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 2l-2 2m-2-2l2 2m-2 2l2-2m-2 2l-6.5 6.5a5.5 5.5 0 1 1-2.83-2.83L17 4l4-2z"></path></svg>`;
      case "shield-check":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`;
      default:
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
  }
});
