/**
 * Script - Pemrograman Web Assignment Portal
 * Dynamically renders task cards from data.js
 */

(function () {
  "use strict";

  // SVG Icons
  const ICONS = {
    globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><polyline points="5 12 12 5 19 12"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  };

  /**
   * Create a single task card HTML string
   */
  function createTaskCard(task) {
    const firstShot =
      task.screenshots && task.screenshots.length > 0
        ? task.screenshots[0]
        : null;
    const coverImage = firstShot
      ? (typeof firstShot === 'object' ? firstShot.file : firstShot)
      : "https://placehold.co/600x340/e8e0f0/888?text=No+Preview";

    const screenshotCount =
      task.screenshots ? task.screenshots.length : 0;

    return `
      <article class="task-card glass" id="task-pekan-${task.pekan}">
        <div class="task-card-thumbnail">
          <img
            src="${coverImage}"
            alt="Screenshot Tugas Pekan ${task.pekan}"
            loading="lazy"
            onerror="this.src='https://placehold.co/600x340/e8e0f0/888?text=No+Preview'"
          />
          <span class="week-badge">Pekan ${task.pekan}</span>
          ${screenshotCount > 1 ? `<span class="screenshot-count">${screenshotCount} screenshot</span>` : ""}
        </div>
        <div class="task-card-body">
          <h3 class="task-card-title">${task.judul}</h3>
          <p class="task-card-desc">${task.keterangan}</p>
          <div class="task-card-actions task-card-actions--triple">
            <a
              href="detail.html?pekan=${task.pekan}"
              class="btn btn-primary"
              id="btn-screenshot-pekan-${task.pekan}"
            >
              ${ICONS.image}
              Lihat Screenshot
            </a>
            <a
              href="${task.linkWeb}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary"
              id="btn-web-pekan-${task.pekan}"
            >
              ${ICONS.globe}
              Kunjungi Web
            </a>
            <a
              href="${task.linkSource}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary"
              id="btn-source-pekan-${task.pekan}"
            >
              ${ICONS.code}
              Lihat Source
            </a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Render all task cards into #task-container
   */
  function renderTasks() {
    const container = document.getElementById("task-container");
    if (!container) return;

    // Sort by pekan in descending order (newest first)
    const sorted = [...tugasMatkul].sort((a, b) => b.pekan - a.pekan);

    if (sorted.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <p>Belum ada tugas yang tersedia.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = sorted.map(createTaskCard).join("");
  }

  /**
   * Scroll-to-top button logic
   */
  function initScrollTop() {
    const btn = document.getElementById("scroll-top-btn");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 400) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /**
   * Update footer year dynamically
   */
  function updateYear() {
    const el = document.getElementById("current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /**
   * Initialise everything when DOM is ready
   */
  document.addEventListener("DOMContentLoaded", function () {
    renderTasks();
    initScrollTop();
    updateYear();
  });
})();
