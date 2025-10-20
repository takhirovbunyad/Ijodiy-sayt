document.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("load-btn");
  const cardContainer = document.getElementById("card-container");

  if (!loadBtn) return;

  loadBtn.addEventListener("click", async () => {
    const page = parseInt(loadBtn.dataset.page);

    try {
      const res = await fetch(`/load_more_cards/?page=${page}`);
      const data = await res.json();

      data.cards.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.id = item.id;
        card.dataset.title = item.title;
        card.dataset.desc = item.description;
        card.dataset.source = item.source;
        card.dataset.url = item.url;

        card.innerHTML = `
          <img src="${item.preview}" alt="${item.title}">
          <div class="card-body">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <small>Manba: ${item.source}</small>
          </div>
        `;

        // Modal uchun click event
        card.addEventListener("click", () => {
          const event = new CustomEvent("cardClick", { detail: item });
          window.dispatchEvent(event);
        });

        cardContainer.appendChild(card);
      });

      if (data.has_next) {
        loadBtn.dataset.page = page + 1;
      } else {
        loadBtn.style.display = "none";
      }
    } catch (err) {
      console.error("❌ Yuklashda xatolik:", err);
    }
  });
});
