document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".modal .close");
  const shareBtn = document.getElementById("shareLinkBtn");

  function openModal(data) {
    const { title, description, source, url, id } = data;

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
                    frameborder="0" allowfullscreen></iframe>
          </div>`;
      }
    }

    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-desc").innerText = description;
    document.getElementById("modal-source").innerText = source;
    document.getElementById("modal-video").innerHTML = videoHTML;
    document.getElementById("modal-link").href = url || "#";

    modal.style.display = "block";
    history.pushState(null, "", `/dash/${id}/`);
  }

  function closeModal() {
    modal.style.display = "none";
    history.pushState(null, "", "/home/");
  }

  // Card bosilganda modal ochish
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      openModal({
        id: card.dataset.id,
        title: card.dataset.title,
        description: card.dataset.desc,
        source: card.dataset.source,
        url: card.dataset.url
      });
    });
  });

  // Yangi yuklangan cardlar uchun event listener
  window.addEventListener("cardClick", e => openModal(e.detail));

  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener("popstate", () => {
    if (modal.style.display === "block") closeModal();
  });

  // Ulashish tugmasi
  shareBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareBtn.innerText = "✅ Nusxa olindi!";
      setTimeout(() => (shareBtn.innerText = "🔗 Ulashish"), 2000);
    } catch (err) {
      alert("URLni nusxalab bo‘lmadi.");
    }
  });
});
