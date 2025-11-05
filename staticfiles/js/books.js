// books.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookModal');
    const closeBtn = modal.querySelector('.close');

    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalReader = document.getElementById('modalReader');
    const openInNewWindowBtn = document.getElementById('openInNewWindow');
    const modalFileDownload = document.getElementById('modalFileDownload');
    const modalAudioDownload = document.getElementById('modalAudioDownload');

    // 🔹 Modalni to‘ldiruvchi funksiya (faqat file bilan)
    function openModal(data, bookId = null) {
        modalTitle.textContent = data.title || '';
        modalDescription.textContent = data.description || '';

        // PDF faylni o‘qitish
        if (data.file) {
            modalReader.src = data.file;
            modalReader.style.display = 'block';
            openInNewWindowBtn.style.display = 'inline-block';
            openInNewWindowBtn.dataset.url = data.file;
        } else {
            modalReader.src = '';
            modalReader.style.display = 'none';
            openInNewWindowBtn.style.display = 'none';
            openInNewWindowBtn.dataset.url = '';
        }

        // Yuklab olish tugmalari
        if (data.file) {
            modalFileDownload.href = data.file;
            modalFileDownload.style.display = 'inline-block';
        } else {
            modalFileDownload.href = '';
            modalFileDownload.style.display = 'none';
        }

        if (data.audio) {
            modalAudioDownload.href = data.audio;
            modalAudioDownload.style.display = 'inline-block';
        } else {
            modalAudioDownload.href = '';
            modalAudioDownload.style.display = 'none';
        }

        modal.style.display = 'block';

        // URLni o‘zgartirish
        if (bookId) {
            window.history.pushState({}, '', `/books/${bookId}/`);
        }
    }

    // 🔹 Modalni yopish
    function closeModal() {
        modal.style.display = 'none';
        modalReader.src = '';
        // URLni qaytarish
        window.history.pushState({}, '', '/books/');
    }

    // 🔹 Card bosilganda modal ochish + URL o‘zgartirish
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-id');
            const data = {
                title: card.dataset.title || '',
                description: card.dataset.description || '',
                file: card.dataset.file || '',
                audio: card.dataset.audio || ''
            };
            openModal(data, bookId);
        });
    });

    // 🔹 Close tugmasi
    closeBtn.addEventListener('click', closeModal);

    // 🔹 Modal tashqarisini bosganda yopish
    window.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 🔹 "TO‘LIQ OCHISH" tugmasi – PDF’ni yangi oynada ochadi
    openInNewWindowBtn.addEventListener('click', () => {
        const url = openInNewWindowBtn.dataset.url;
        if (url) {
            window.open(url, '_blank', 'width=900,height=700,resizable=yes,scrollbars=yes');
        }
    });

    // 🔹 Sahifa yuklanganda: agar template `openBookId` yuborsa – auto open
    if (window.openBookId) {
        const card = document.querySelector(`.book-card[data-id="${window.openBookId}"]`);
        if (card) {
            const data = {
                title: card.dataset.title || '',
                description: card.dataset.description || '',
                file: card.dataset.file || '',
                audio: card.dataset.audio || ''
            };
            openModal(data, window.openBookId);
        }
    }
});


// 🔗 Ulashish tugmasi
const shareBtn = document.getElementById("shareLinkBtn");
shareBtn.addEventListener("click", async () => {
  const currentUrl = window.location.href;
  try {
    await navigator.clipboard.writeText(currentUrl);
    shareBtn.textContent = "✅ Nusxalandi!";
    setTimeout(() => {
      shareBtn.textContent = "🔗 Ulashish";
    }, 2000);
  } catch (err) {
    alert("URL nusxalanmadi. Qo‘lda tanlang va Ctrl+C bosing.");
  }
});
