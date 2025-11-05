document.addEventListener('DOMContentLoaded', () => {
  const modeToggleBtn = document.getElementById('mode-toggle');
  const modeIcon = modeToggleBtn.querySelector('img');

  const lightIcon = "https://www.svgrepo.com/show/433086/light-mode.svg";
  const darkIcon = "https://www.svgrepo.com/show/381213/dark-mode-night-moon.svg";

  // Saqlash va yuklash uchun localStorage ishlatamiz:
  function setMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      modeIcon.src = darkIcon;
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      modeIcon.src = lightIcon;
      localStorage.setItem('darkMode', 'false');
    }
  }

  // Bosilganda rejimni o‘zgartirish
  modeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setMode(!isDark);
  });

  // Sahifa yuklanganda oldingi rejimni o‘rnatish
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    setMode(true);
  } else {
    setMode(false);
  }
});
