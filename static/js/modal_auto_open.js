// modal_auto_open.js
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const match = path.match(/\/dash\/(\d+)\//);

  if (match) {
    const card = document.querySelector(`.card[data-id="${match[1]}"]`);
    if (card) {
      card.click(); // avtomatik modal ochiladi
    }
  }
});
