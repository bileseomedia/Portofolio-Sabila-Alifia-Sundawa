// ==================== NAVIGASI UI (dipanggil dari onclick di HTML) ====================
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('menuIconOpen');
  const iconClose = document.getElementById('menuIconClose');
  if (!menu) return;
  menu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
};

window.closeMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('menuIconOpen');
  const iconClose = document.getElementById('menuIconClose');
  if (!menu) return;
  menu.classList.add('hidden');
  iconOpen.classList.remove('hidden');
  iconClose.classList.add('hidden');
};

window.handleEmailContact = function() {
  const email = state?.profile?.email || 'sabila.alifia@placeholder.com';
  window.location.href = `mailto:${email}?subject=Halo Sabila!`;
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('open');
};

window.closeProjectDetail = function() {
  const modal = document.getElementById('projectDetailModal');
  if (modal) modal.classList.remove('open');
};

window.closeStudioModal = function() {
  const modal = document.getElementById('studioModal');
  if (modal) modal.classList.remove('open');
};

// Set tahun berjalan di footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
