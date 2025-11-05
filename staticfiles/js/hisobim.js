// Modal ochish/yopish
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("password-modal");
  const openBtn = document.getElementById("change-password-btn");
  const closeBtn = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");

  // Ochish
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Yopish
  [closeBtn, cancelBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  });

  // Modal tashqarisiga bosganda yopish
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});
