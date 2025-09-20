// loader.js
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");

  function showLoader() {
    if (loader) loader.classList.add("active");
  }

  function hideLoader() {
    if (loader) loader.classList.remove("active");
  }

  // --- Sahifadan sahifaga o'tishda loader ---
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        showLoader();
      }
    });
  });

  // --- Sahifa yuklanishi tugaganda loaderni yo'qotish ---
  window.addEventListener("pageshow", () => {
    hideLoader();
  });

  // --- Global fetch wrapper ---
  const _fetch = window.fetch;
  window.fetch = function (...args) {
    showLoader();
    return _fetch(...args)
      .then(res => {
        hideLoader();
        return res;
      })
      .catch(err => {
        hideLoader();
        throw err;
      });
  };

  // --- Modal ochilganda loader (agar data yuklansa) ---
  window.openWithLoader = function (callback) {
    showLoader();
    Promise.resolve(callback())
      .then(() => hideLoader())
      .catch(() => hideLoader());
  };
});
