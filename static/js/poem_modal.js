document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".poem-card");
  const modal = document.getElementById("poem-modal");
  const closeBtn = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalAuthor = document.getElementById("modal-author");
  const modalContent = modal.querySelector(".modal-content");
  const expandBtn = document.getElementById("modal-expand-btn");

  function decodeUnicode(str) {
    return str.replace(/\\u([\dA-F]{4})/gi, (match, grp) =>
      String.fromCharCode(parseInt(grp, 16))
    );
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title;
      let rawText = card.dataset.full;
      let decodedText = decodeUnicode(rawText);
      modalBody.innerHTML = decodedText.replace(/\r?\n/g, "<br>");
      modalAuthor.textContent = `— ${card.dataset.author}`;
      modal.classList.remove("hidden");

      // Modal boshlang‘ich o‘lchamlari va shrift o‘lchamini tiklash
      modalContent.style.width = "600px";
      modalContent.style.height = window.innerHeight * 0.6 + "px";
      modalContent.style.fontSize = "16px";
      step = 0;

      expandBtn.style.display = "block";  // tugmani ko‘rsatish
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    expandBtn.style.display = "none"; // tugmani yashirish
  });

  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      expandBtn.style.display = "none"; // tugmani yashirish
    }
  });

  const sizes = [
    { width: 600, height: window.innerHeight * 0.6, fontSize: 19 },
    { width: 800, height: window.innerHeight * 0.75, fontSize: 21 },
    { width: 1000, height: window.innerHeight * 0.85, fontSize: 25 },
    { width: 1200, height: window.innerHeight * 0.9, fontSize: 28 }
  ];

  let step = 0;

  expandBtn.addEventListener("click", () => {
    step = (step + 1) % sizes.length;
    const size = sizes[step];

    modalContent.style.width = size.width + "px";
    modalContent.style.height = size.height + "px";
    modalContent.style.fontSize = size.fontSize + "px";
  });

  // Tugmani dastlab yashir, agar modal oldin yopiq bo‘lsa
  if (modal.classList.contains("hidden")) {
    expandBtn.style.display = "none";
  }
});
