// sher.js
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".poem-card");
  const poemModal = document.getElementById("poem-modal");
  const closeBtn = document.getElementById("modal-close");
  const infoModal = document.getElementById("info-modal");
  const infoCloseBtn = document.getElementById("info-close");
  const expandBtn = document.getElementById("modal-expand-btn");
  const copyBtn = document.getElementById("copy-poem-btn");
  const infoBtn = document.getElementById("info-btn");
  const loader = document.getElementById("loader-overlay");

  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalAuthor = document.getElementById("modal-author");
  const infoList = document.getElementById("info-list");

  let step = 0;
  const sizes = [
    { width: 600, height: window.innerHeight * 0.6, fontSize: 19 },
    { width: 800, height: window.innerHeight * 0.75, fontSize: 21 },
    { width: 1000, height: window.innerHeight * 0.85, fontSize: 25 },
    { width: 1200, height: window.innerHeight * 0.9, fontSize: 28 }
  ];

  function decodeUnicode(str) {
    return str.replace(/\\u([\dA-F]{4})/gi, (match, grp) =>
      String.fromCharCode(parseInt(grp, 16))
    );
  }

  // 🔄 Loader wrapper
  function openWithLoader(action) {
    if (loader) loader.classList.add("active");

    return Promise.resolve(action())
      .finally(() => {
        if (loader) loader.classList.remove("active");
      });
  }

  function openPoemModal(data) {
    modalTitle.textContent = data.sarlavha;
    let rawText = data.matn || "";
    let decodedText = decodeUnicode(rawText);
    modalBody.innerHTML = decodedText.replace(/\r?\n/g, "<br>");
    modalAuthor.textContent = `— ${data.muallif || "Nomaʼlum"}`;

    const modalContent = poemModal.querySelector(".modal-content");
    modalContent.style.width = "600px";
    modalContent.style.height = window.innerHeight * 0.6 + "px";
    modalContent.style.fontSize = "16px";
    step = 0;

    // faqat modal ochilganda tugmalarni chiqaramiz
    expandBtn.style.display = "block";
    copyBtn.classList.remove("hidden");

    infoBtn.onclick = () => {
      infoList.innerHTML = `
        <li><strong>Janr:</strong> ${data.janr || "Nomaʼlum"}</li>
        <li><strong>Muallif:</strong> ${data.muallif || "Nomaʼlum"}</li>
        <li><strong>Sana:</strong> ${data.sana || "Nomaʼlum"}</li>
        <li><strong>Til:</strong> ${data.til || "Nomaʼlum"}</li>
        <li><strong>Manba:</strong> ${data.manba || "Ko‘rsatilmagan"}</li>
        <li><strong>Haqida:</strong> ${data.haqida || "Yo‘q"}</li>
      `;
      infoModal.classList.remove("hidden");
    };

    poemModal.classList.add("show");
    poemModal.classList.remove("hidden");
  }

  // 📌 Card bosilganda modal ochish
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const sherId = card.dataset.id;

      openWithLoader(() => {
        return fetch(`/sher/${sherId}/json/`, {
          headers: { "X-Requested-With": "XMLHttpRequest" }
        })
          .then(res => res.json())
          .then(data => {
            openPoemModal(data);
            const newUrl = `/sher/${sherId}/`;
            history.pushState({ id: sherId }, "", newUrl);
          });
      });
    });
  });

  // ❌ tugmasi
  closeBtn.onclick = () => {
    poemModal.classList.add("hidden");
    poemModal.classList.remove("show");
    history.pushState({}, "", "/sher/");

    // modal yopilganda tugmalarni yashirish
    expandBtn.style.display = "none";
    copyBtn.classList.add("hidden");
  };

  infoCloseBtn.onclick = () => infoModal.classList.add("hidden");

  window.onclick = (e) => {
    if (e.target === poemModal) {
      poemModal.classList.add("hidden");
      poemModal.classList.remove("show");
      history.pushState({}, "", "/sher/");

      // modal yopilganda tugmalarni yashirish
      expandBtn.style.display = "none";
      copyBtn.classList.add("hidden");
    }
    if (e.target === infoModal) {
      infoModal.classList.add("hidden");
    }
  };

  // 🔎 Kattalashtirish
  expandBtn.addEventListener("click", () => {
    step = (step + 1) % sizes.length;
    const size = sizes[step];
    const modalContent = poemModal.querySelector(".modal-content");

    modalContent.style.width = size.width + "px";
    modalContent.style.height = size.height + "px";
    modalContent.style.fontSize = size.fontSize + "px";
  });

  // 📋 Nusxa olish
  copyBtn.addEventListener("click", () => {
    const title = modalTitle.textContent.trim();
    const text = modalBody.innerText.trim();
    const author = modalAuthor.textContent.trim();
    const copyText = `${title}:\n\n${text}\n\n${author}`;

    const originalHTML = copyBtn.innerHTML;

    navigator.clipboard.writeText(copyText).then(() => {
      copyBtn.innerHTML = "✅";
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 300);
    }).catch(() => {
      copyBtn.innerHTML = "❌";
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 300);
    });
  });

  // 🌐 URL orqali auto modal
  if (window.openSherId) {
    const sherId = window.openSherId;

    openWithLoader(() =>
      fetch(`/sher/${sherId}/json/`, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
        .then(res => res.json())
        .then(data => {
          openPoemModal(data);
        })
    );
  }

  // sahifa yuklanganda tugmalar default yashirin bo‘lsin
  expandBtn.style.display = "none";
  copyBtn.classList.add("hidden");
});
