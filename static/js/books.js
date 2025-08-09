    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('bookModal');
        const closeBtn = modal.querySelector('.close');

        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalReader = document.getElementById('modalReader');
        const openInNewWindowBtn = document.getElementById('openInNewWindow');
        const modalFileDownload = document.getElementById('modalFileDownload');
        const modalAudioDownload = document.getElementById('modalAudioDownload');

        document.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.dataset.title || '';
                const description = card.dataset.description || '';
                const url = card.dataset.url || '';
                const file = card.dataset.file || '';
                const audio = card.dataset.audio || '';

                // Modalga ma'lumotlar joylanadi
                modalTitle.textContent = title;
                modalDescription.textContent = description;

                // Iframe va alohida oynada o'qish tugmasi
                if (url) {
                    modalReader.src = url;
                    modalReader.style.display = 'block';

                    openInNewWindowBtn.style.display = 'inline-block';
                    openInNewWindowBtn.dataset.url = url;
                } else {
                    modalReader.src = '';
                    modalReader.style.display = 'none';

                    openInNewWindowBtn.style.display = 'none';
                    openInNewWindowBtn.dataset.url = '';
                }

                // Kitob faylini yuklab olish
                if (file) {
                    modalFileDownload.href = file;
                    modalFileDownload.style.display = 'inline-block';
                } else {
                    modalFileDownload.href = '';
                    modalFileDownload.style.display = 'none';
                }

                // Audio faylini yuklab olish
                if (audio) {
                    modalAudioDownload.href = audio;
                    modalAudioDownload.style.display = 'inline-block';
                } else {
                    modalAudioDownload.href = '';
                    modalAudioDownload.style.display = 'none';
                }

                modal.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            modalReader.src = '';
        });

        window.addEventListener('click', e => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modalReader.src = '';
            }
        });

        openInNewWindowBtn.addEventListener('click', () => {
            const url = openInNewWindowBtn.dataset.url;
            if (url) {
                window.open(url, '_blank', 'width=900,height=700,resizable=yes,scrollbars=yes');
            }
        });
    });
