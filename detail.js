/**
 * Detail Page Script - Pemrograman Web Assignment Portal
 * Reads ?pekan=N from URL and renders the matching task's screenshots
 */

(function () {
  "use strict";

  // SVG Icons
  const ICONS = {
    globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  };

  /**
   * Read the ?pekan= parameter from the URL
   */
  function getPekanParam() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("pekan");
    if (value === null) return null;
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  /**
   * Find the task object by pekan number
   */
  function findTask(pekan) {
    if (typeof tugasMatkul === "undefined") return null;
    return tugasMatkul.find(function (t) {
      return t.pekan === pekan;
    }) || null;
  }

  /**
   * Show an error state when task is not found
   */
  function showError(message) {
    var header = document.getElementById("detail-header");
    var gallery = document.getElementById("gallery-section");

    if (header) {
      header.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <p>${message}</p>
        </div>
      `;
    }

    if (gallery) gallery.style.display = "none";
  }

  /**
   * Render the detail header (title, description, links)
   */
  function renderHeader(task) {
    var badge = document.getElementById("detail-badge");
    var title = document.getElementById("detail-title");
    var desc = document.getElementById("detail-desc");
    var links = document.getElementById("detail-links");

    if (badge) badge.textContent = "Pekan " + task.pekan;
    if (title) title.textContent = task.judul;
    if (desc) desc.textContent = task.keterangan;

    // Update page title
    document.title = "Pekan " + task.pekan + " — " + task.judul;

    // Render links
    if (links) {
      links.innerHTML = `
        <a href="${task.linkWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" id="detail-btn-web">
          ${ICONS.globe}
          Kunjungi Web
        </a>
        <a href="${task.linkSource}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" id="detail-btn-source">
          ${ICONS.code}
          Lihat Source Code
        </a>
      `;
    }
  }

  /**
   * Render the screenshot gallery
   */
  function renderGallery(task) {
    var gallery = document.getElementById("detail-gallery");
    var countEl = document.getElementById("gallery-count");

    if (!gallery) return;

    var screenshots = task.screenshots || [];

    if (countEl) {
      countEl.textContent = screenshots.length + " screenshot" + (screenshots.length !== 1 ? "s" : "") + " tersedia";
    }

    if (screenshots.length === 0) {
      gallery.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>Belum ada screenshot untuk tugas ini.</p>
        </div>
      `;
      return;
    }

    gallery.innerHTML = screenshots
      .map(function (shot, index) {
        var imgSrc = typeof shot === 'object' ? shot.file : shot;
        var label = typeof shot === 'object' && shot.nama ? shot.nama : 'Screenshot ' + (index + 1);
        return `
          <figure class="gallery-item glass" data-index="${index}">
            <div class="gallery-item-img-wrapper">
              <img
                src="${imgSrc}"
                alt="${label} — ${task.judul}"
                loading="lazy"
                onerror="this.src='https://placehold.co/800x450/e8e0f0/888?text=Gagal+Memuat'"
              />
              <div class="gallery-item-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </div>
            <figcaption class="gallery-item-caption">${label}</figcaption>
          </figure>
        `;
      })
      .join("");

    // Attach click events for lightbox
    var items = gallery.querySelectorAll(".gallery-item");
    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var img = item.querySelector("img");
        var caption = item.querySelector(".gallery-item-caption");
        openLightbox(img.src, caption ? caption.textContent : "");
      });
    });
  }

  /**
   * Lightbox functionality
   */
  function openLightbox(src, caption) {
    var overlay = document.getElementById("lightbox-overlay");
    var img = document.getElementById("lightbox-img");
    var cap = document.getElementById("lightbox-caption");

    if (!overlay || !img) return;

    img.src = src;
    if (cap) cap.textContent = caption;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    var overlay = document.getElementById("lightbox-overlay");
    if (!overlay) return;

    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function initLightbox() {
    var overlay = document.getElementById("lightbox-overlay");
    var closeBtn = document.getElementById("lightbox-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", closeLightbox);
    }

    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeLightbox();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /**
   * Scroll-to-top button logic
   */
  function initScrollTop() {
    var btn = document.getElementById("scroll-top-btn");
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
    var el = document.getElementById("current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /**
   * Initialise everything when DOM is ready
   */
  document.addEventListener("DOMContentLoaded", function () {
    var pekan = getPekanParam();

    if (pekan === null) {
      showError("Parameter pekan tidak ditemukan di URL. Silakan kembali ke beranda.");
      updateYear();
      initScrollTop();
      return;
    }

    var task = findTask(pekan);

    if (!task) {
      showError("Tugas untuk Pekan " + pekan + " tidak ditemukan.");
      updateYear();
      initScrollTop();
      return;
    }

    renderHeader(task);
    renderGallery(task);
    initLightbox();
    initScrollTop();
    updateYear();
  });
})();
