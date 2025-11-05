// 🔗 Ulashish tugmasi
const shareBtn = document.getElementById("shareLinkBtn");
if (shareBtn) {
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
}
