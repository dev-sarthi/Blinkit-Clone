// ═══════════════════════════════════════════════════════
// QuickKart — Cosmetic JS only (no fetch/API calls)
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile menu toggle ────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ─── User dropdown toggle ─────────────────────────────
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userMenu = document.getElementById('userMenu');

  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove('open');
      }
    });
  }

  // ─── Auto-dismiss flash messages ──────────────────────
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach((flash) => {
    setTimeout(() => {
      flash.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      flash.style.opacity = '0';
      flash.style.transform = 'translateY(-10px)';
      setTimeout(() => flash.remove(), 400);
    }, 4000);
  });
});
