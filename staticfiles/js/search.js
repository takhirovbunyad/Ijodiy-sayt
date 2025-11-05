document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const btn = document.getElementById("search-btn");
  const results = document.getElementById("results");
  const loader = document.getElementById("loader"); // fullscreen loader
  let debounceTimer;

  // Loader ko‘rsatish
  function showLoader() {
    loader.style.display = "flex";
  }

  // Loaderni yashirish
  function hideLoader() {
    loader.style.display = "none";
  }

  // Qidiruv
  function search() {
    const query = input.value.trim();

    if (!query) {
      results.innerHTML = "";
      return;
    }

    showLoader();

    fetch(`/search-api/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        hideLoader();
        results.innerHTML = ""; // eski natijani tozalash

        const allData = [
          { items: data.dash, section: "BOSH SAHIFA" },
          { items: data.sher, section: "SHERLAR" },
          { items: data.books, section: "KITOBLAR" },
          { items: data.philosophy, section: "FILOSOFIYA" },
        ];

        let found = false;

        allData.forEach(group => {
          if (group.items && group.items.length > 0) {
            found = true;
            group.items.forEach(item => {
              let img = item.preview || item.img || "";
              let desc = item.description || item.desc || item.qisqa_qator || "";
              let title = item.title || item.sarlavha || "";
              let owner = item.owner || item.muallif || "";
              let url = item.url;

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
          }
        });

        if (!found) {
          results.innerHTML = `
            <div class="no-results">
              <img src="https://cdn-icons-png.flaticon.com/512/1178/1178479.png"
                alt="Hech nima topilmadi" />
              <p>Hech nima topilmadi</p>
            </div>
          `;
        }
      })
      .catch(err => {
        hideLoader();
        results.innerHTML = "<p style='text-align:center; color:#f00'>Natija yuklashda xatolik yuz berdi</p>";
        console.error(err);
      });
  }

  // Eventlar
  btn.addEventListener("click", search);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") search();
  });
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(search, 500);
  });
});
