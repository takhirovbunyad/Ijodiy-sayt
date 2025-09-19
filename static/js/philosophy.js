document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  // Modalni ochish funksiyasi (API orqali ma’lumot olish)
  function openModal(id) {
    fetch(`/philosophy/${id}/json/`)
      .then(res => {
        if (!res.ok) throw new Error("Ma'lumot topilmadi");
        return res.json();
      })
      .then(data => {
        modalTitle.textContent = data.title;
        modalText.innerHTML = data.text;

        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');

        history.pushState(null, "", `/philosophy/${data.id}/`);
      })
      .catch(err => console.error(err));
  }

  // Modalni yopish funksiyasi
  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    history.pushState(null, "", "/philosophy/");
  }

  // Tugma orqali ochish
  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id, 10);
      if (id) openModal(id);
    });
  });

  // X tugmasi
  modalClose.addEventListener('click', closeModal);

  // Fon bosilganda yopish
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape bosilganda yopish
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Back/forward tugmalari
  window.addEventListener('popstate', () => {
    const idFromUrl = getPhilosophyIdFromUrl();
    if (idFromUrl) {
      openModal(idFromUrl);
    } else {
      closeModal();
    }
  });

  // URL path ichidan /philosophy/<id>/ ni ajratib olish
  function getPhilosophyIdFromUrl() {
    const match = window.location.pathname.match(/^\/philosophy\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Avtomatik modal ochish agar URL’da id bo‘lsa
  const idFromUrl = getPhilosophyIdFromUrl();
  if (idFromUrl) {
    openModal(idFromUrl);
  }
});
