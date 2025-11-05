
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('successModal');
  const modalMsg = document.getElementById('modalMessage');
  const modalClose = document.getElementById('modalClose');

  function showModal(text = "Rahmat! Tez orada javob beramiz.", autoClose = true) {
    if (modalMsg) modalMsg.textContent = text;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    // Auto close after 3.2s
    if (autoClose) {
      setTimeout(hideModal, 60200);
    }
  }

  function hideModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  modalClose && modalClose.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  // 1) Server-side Django messages orqali ochish
  const djangoMsgEl = document.getElementById('django-message');
  if (djangoMsgEl) {
    const msg = djangoMsgEl.dataset.message || "Xabaringiz yuborildi.";
    showModal(msg, true);
  }

  // 2) Client-side: AJAX submit fallback (optional — agar server redirect bo'lsa ishlamas ekan,
  //    shunchaki normal submit bo'lsa ham server messages orqali modal ko'rsatadi)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Agar siz AJAX bilan yubormoqchi bo'lsangiz, uncomment qiling va backend ajaxni qabul qilishi kerak.
      // Hozir: agar user JS <u>va</u> backend AJAXni qabul qilsa, modalni ko'rsatadi va formni tozalaydi.
      const useAjax = false; // agar true qilinsa, form AJAX orqali yuboriladi
      if (!useAjax) return; // oddiy submit davom etsin

      e.preventDefault();
      const data = new FormData(form);
      fetch(form.action, {
        method: form.method || 'POST',
        body: data,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
      }).then(r => {
        if (r.ok) {
          showModal("Xabaringiz muvaffaqiyatli yuborildi!", true);
          form.reset();
        } else {
          showModal("Xatolik yuz berdi — keyinroq urinib ko‘ring.", true);
        }
      }).catch(() => {
        showModal("Xatolik: tarmoq bilan bog‘liq muammo.", true);
      });
    });
  }
});
