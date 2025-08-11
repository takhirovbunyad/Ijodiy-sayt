document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  // HTML ichidagi JSON ma'lumotni o'qiymiz
  const philosophyDataScript = document.getElementById('philosophy-data');
  const philosophyList = JSON.parse(philosophyDataScript.textContent);

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id, 10);
      const item = philosophyList.find(i => i.id === id);
      if (item) {
        modalTitle.textContent = item.title;
        modalText.innerHTML = item.text;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});
