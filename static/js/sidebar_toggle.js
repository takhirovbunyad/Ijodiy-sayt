try {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.book-spine');

  if (!hamburger) {
    console.error("Hamburger elementi topilmadi! ID 'hamburger' ga ega element bo'lishi kerak.");
  }
  if (!sidebar) {
    console.error("Sidebar elementi topilmadi! Sinf '.book-spine' ga ega element bo'lishi kerak.");
  }

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      console.log('Sidebar ochish/yopish toggle qilindi. Hozirgi classList:', sidebar.classList.value);
    });
  }
} catch (error) {
  console.error('JS xatosi:', error);
}
