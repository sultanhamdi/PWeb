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
    document: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
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
    if (desc) desc.innerHTML = task.keterangan;

    // Update page title
    document.title = "Pekan " + task.pekan + " — " + task.judul;

    // Render links
    if (links) {
      var linksHTML = "";
      if (task.linkWeb) {
        linksHTML += `
          <a href="${task.linkWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" id="detail-btn-web">
            ${ICONS.globe}
            Kunjungi Web
          </a>
        `;
      }
      if (task.dokumenSpesifikasi) {
        linksHTML += `
          <a href="${task.dokumenSpesifikasi}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" id="detail-btn-docs">
            ${ICONS.document}
            Dokumen Spesifikasi
          </a>
        `;
      }
      if (task.linkSource) {
        linksHTML += `
          <a href="${task.linkSource}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" id="detail-btn-source">
            ${ICONS.code}
            Lihat Source Code
          </a>
        `;
      }
      links.innerHTML = linksHTML;
    }
  }

  /**
   * Render the document embed (if available)
   */
  function renderDocs(task) {
    var docsSection = document.getElementById("docs-section");
    var docsContainer = document.getElementById("detail-docs");

    if (!docsSection || !docsContainer) return;

    if (task.linkDocsEmbed) {
      docsSection.style.display = "block";
      docsContainer.innerHTML = `
        <iframe 
          src="${task.linkDocsEmbed}" 
          width="100%" 
          height="600px" 
          frameborder="0" 
          allowfullscreen="true" 
          mozallowfullscreen="true" 
          webkitallowfullscreen="true">
        </iframe>
      `;
    } else {
      docsSection.style.display = "none";
      docsContainer.innerHTML = "";
    }
  }

  /**
   * Render the screenshot gallery
   */
  function renderGallery(task) {
    var gallerySection = document.getElementById("gallery-section");
    var gallery = document.getElementById("detail-gallery");
    var countEl = document.getElementById("gallery-count");

    if (!gallery) return;

    var screenshots = task.screenshots || [];

    if (screenshots.length === 0) {
      if (gallerySection) gallerySection.style.display = "none";
      return;
    } else {
      if (gallerySection) gallerySection.style.display = "block";
    }

    if (countEl) {
      countEl.textContent = screenshots.length + " screenshot" + (screenshots.length !== 1 ? "s" : "") + " tersedia";
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
    renderDocs(task);
    renderGallery(task);
    initLightbox();
    initScrollTop();
    updateYear();
  });
})();
