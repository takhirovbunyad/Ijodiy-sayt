document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const btn = document.getElementById("search-btn");
  const results = document.getElementById("results");
  let debounceTimer;

  function search() {
    const query = input.value.trim();
    results.innerHTML = "";

    if (!query) return;

    // Loader qo'shamiz
    const loader = document.createElement("div");
    loader.classList.add("loader");
    results.appendChild(loader);

    fetch(`/search-api/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        results.innerHTML = ""; // loader o'chadi va cardlar keladi

        const allData = [
          {items: data.dash, section: "BOSH SAHIFA"},
          {items: data.sher, section: "SHERLAR"},
          {items: data.books, section: "KITOBLAR"},
          {items: data.philosophy, section: "FILOSOFIYA"},
        ];

        allData.forEach(group => {
          group.items.forEach(item => {
            let img = item.preview || item.img || "";
            let desc = item.description || item.desc || item.qisqa_qator || "";
            let title = item.title || item.sarlavha || "";
            let owner = item.owner || item.muallif || "";
            let url = item.url || "#";

            const card = document.createElement("div");
            card.classList.add("result-card");

            card.innerHTML = `
              ${img ? `<img src="${img}" alt="${title}">` : ""}
              <span class="card-section">${group.section}</span>
              <div class="card-content">
                <h3>${title}</h3>
                <p>${desc}</p>
                ${owner ? `<small>${owner}</small>` : ""}
              </div>
              <a href="${url}" class="view-btn"><i class="fas fa-eye"></i> Ko‘rish</a>

            `;

            results.appendChild(card);
          });
        });
      })
      .catch(err => {
        results.innerHTML = "<p style='text-align:center; color:#f00'>Natija yuklashda xatolik yuz berdi</p>";
        console.error(err);
      });
  }

  // Tugma bosilganda ham ishlasin
  btn.addEventListener("click", search);

  // Enter bosilganda ham ishlasin
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") search();
  });

  // Real-time qidiruv (debounce bilan)
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(search, 500); // 0.5s kechikish
  });
});
