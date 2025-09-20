// modal.js
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".modal .close");

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const title = card.dataset.title;
      const desc = card.dataset.desc;
      const source = card.dataset.source;
      const url = card.dataset.url;

      // Video HTML tayyorlash (YouTube universal parser)
      let videoHTML = "";
      if (url) {
        let videoId = null;
        if (url.includes("youtube.com/watch?v=")) {
          videoId = new URL(url).searchParams.get("v");
        } else if (url.includes("youtu.be/")) {
          videoId = url.split("youtu.be/")[1].split("?")[0];
        }
        if (videoId) {
          videoHTML = `
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${videoId}"
                      frameborder="0" allowfullscreen>
              </iframe>
            </div>`;
        }
      }

      // Modal elementlarini to‘ldirish
      document.getElementById("modal-title").innerText = title;
      document.getElementById("modal-desc").innerText = desc;
      document.getElementById("modal-source").innerText = source;
      document.getElementById("modal-video").innerHTML = videoHTML;
      document.getElementById("modal-link").href = url || "#";

      // Modalni ochish
      modal.style.display = "block";
      // URL update (modalga mos)
      history.pushState(null, "", `/${card.dataset.id}/`);
    });
  });

  // Modalni yopish
// Modalni yopish
    function closeModal() {
     modal.style.display = "none";
     history.pushState(null, "", "/");
}



  closeBtn.addEventListener("click", closeModal);

  // Fon bosilganda yopish
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Agar browserda back/forward tugmasi bosilsa modalni yopish
  window.addEventListener("popstate", () => {
    if (modal.style.display === "block") closeModal();
  });
});
