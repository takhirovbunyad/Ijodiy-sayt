
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("bookModal");
    const closeBtn = document.querySelector(".close");

    const modalTitle = document.getElementById("modalTitle");
    const modalOwner = document.getElementById("modalOwner");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");
    const modalReader = document.getElementById("modalReader");
    const modalFileDownload = document.getElementById("modalFileDownload");
    const modalAudioBlock = document.getElementById("modalAudioBlock");
    const modalAudio = document.getElementById("modalAudio");
    const modalAudioDuration = document.getElementById("modalAudioDuration");
    const modalAudioDownload = document.getElementById("modalAudioDownload");
    const modalFileType = document.getElementById("modalFileType");

    document.querySelectorAll(".book-card").forEach(card => {
        card.addEventListener("click", () => {
            modalTitle.textContent = card.dataset.title;
            modalOwner.textContent = "👤 " + card.dataset.owner;
            modalImage.src = card.dataset.img;
            modalDescription.textContent = card.dataset.description;
            modalFileType.textContent = card.dataset.fileType || "-";

            // PDF yoki URL o'qish
            if (card.dataset.url) {
                modalReader.src = card.dataset.url;
                modalReader.style.display = "block";
            } else if (card.dataset.file && card.dataset.file.endsWith(".pdf")) {
                modalReader.src = card.dataset.file;
                modalReader.style.display = "block";
            } else {
                modalReader.style.display = "none";
            }

            // Fayl yuklab olish
            if (card.dataset.file) {
                modalFileDownload.href = card.dataset.file;
                modalFileDownload.style.display = "inline-block";
            } else {
                modalFileDownload.style.display = "none";
            }

            // Audio
            if (card.dataset.audio) {
                modalAudio.src = card.dataset.audio;
                modalAudioDownload.href = card.dataset.audio;
                modalAudioDuration.textContent = card.dataset.audioDuration || "-";
                modalAudioBlock.style.display = "block";
            } else {
                modalAudioBlock.style.display = "none";
            }

            modal.style.display = "block";
        });
    });

    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
});

