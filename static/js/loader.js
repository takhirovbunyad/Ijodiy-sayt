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

  // --- Sahifa yuklanishi tugaganda ---
  window.addEventListener("load", () => {
    // Agar URL da modal ochilishi kerak bo‘lsa (masalan /dash/1/)
    const modalSlugMatch = window.location.pathname.match(/\/dash\/\d+\//);
    if (modalSlugMatch) {
      // modal_auto_open.js modalni ochgandan so‘ng yashiradi
      document.addEventListener("modalOpened", () => {
        hideLoader();
      });
    } else {
      // Odatdagi holatda darhol yashirish
      hideLoader();
    }
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

  // --- Modal ochilganda loader qo‘llab-quvvatlashi ---
  window.openWithLoader = function (callback) {
    showLoader();
    Promise.resolve(callback())
      .then(() => {
        hideLoader();
        // modal ochilganda event trigger qilamiz
        document.dispatchEvent(new CustomEvent("modalOpened"));
      })
      .catch(() => hideLoader());
  };
});
