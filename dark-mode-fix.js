// dark-mode-fix.js → Permanent dark mode across ALL pages
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('nkawiheDarkMode', isDark);
  const btn = document.getElementById('darkModeToggle');
  if (btn) btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

// Apply saved mode when page loads
if (localStorage.getItem('nkawiheDarkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('darkModeToggle');
  if (btn) {
    btn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  }
});