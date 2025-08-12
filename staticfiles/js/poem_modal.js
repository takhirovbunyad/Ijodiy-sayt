document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".poem-card");
  const poemModal = document.getElementById("poem-modal");
  const infoModal = document.getElementById("info-modal");

  const closeBtn = document.getElementById("modal-close");
  const infoCloseBtn = document.getElementById("info-close");
  const expandBtn = document.getElementById("modal-expand-btn");
  const copyBtn = document.getElementById("copy-poem-btn");
  const infoBtn = document.getElementById("info-btn");

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

  function openPoemModal(card) {
    modalTitle.textContent = card.dataset.title;
    let rawText = card.dataset.full || "";
    let decodedText = decodeUnicode(rawText);
    modalBody.innerHTML = decodedText.replace(/\r?\n/g, "<br>");
    modalAuthor.textContent = `— ${card.dataset.author || "Nomaʼlum"}`;

    // Modal o‘lcham va shriftni boshlang‘ich holatga qaytarish
    const modalContent = poemModal.querySelector(".modal-content");
    modalContent.style.width = "600px";
    modalContent.style.height = window.innerHeight * 0.6 + "px";
    modalContent.style.fontSize = "16px";
    step = 0;

    expandBtn.style.display = "block";
    copyBtn.classList.remove("hidden");

    // Qo‘shimcha ma'lumotlarni data dan olamiz
    infoBtn.onclick = () => {
      const janr = card.dataset.janr || "Nomaʼlum";
      const sana = card.dataset.sana || "Nomaʼlum";
      const til = card.dataset.til || "Nomaʼlum";
      const manba = card.dataset.manba || "Ko‘rsatilmagan";
      const haqida = card.dataset.haqida || "Yo‘q";

      infoList.innerHTML = `
        <li><strong>Janr:</strong> ${janr}</li>
        <li><strong>Muallif:</strong> ${card.dataset.author || "Nomaʼlum"}</li>
        <li><strong>Sana:</strong> ${sana}</li>
        <li><strong>Til:</strong> ${til}</li>
        <li><strong>Manba:</strong> ${manba}</li>
        <li><strong>Haqida:</strong> ${haqida}</li>
      `;
      infoModal.classList.remove("hidden");
    };

    poemModal.classList.remove("hidden");
  }

  cards.forEach(card => {
    card.addEventListener("click", () => openPoemModal(card));
  });

  closeBtn.onclick = () => {
    poemModal.classList.add("hidden");
    expandBtn.style.display = "none";
    copyBtn.classList.add("hidden");
  };

  infoCloseBtn.onclick = () => infoModal.classList.add("hidden");

  window.onclick = (e) => {
    if (e.target === poemModal) {
      poemModal.classList.add("hidden");
      expandBtn.style.display = "none";
      copyBtn.classList.add("hidden");
    }
    if (e.target === infoModal) {
      infoModal.classList.add("hidden");
    }
  };

  expandBtn.addEventListener("click", () => {
    step = (step + 1) % sizes.length;
    const size = sizes[step];
    const modalContent = poemModal.querySelector(".modal-content");

    modalContent.style.width = size.width + "px";
    modalContent.style.height = size.height + "px";
    modalContent.style.fontSize = size.fontSize + "px";
  });

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

  // Modal dastlab yashirilgan bo‘lsa, tugmalarni yashiramiz
  if (poemModal.classList.contains("hidden")) {
    expandBtn.style.display = "none";
    copyBtn.classList.add("hidden");
  }
});
