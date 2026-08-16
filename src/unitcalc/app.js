document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  
  // Initialize theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Homepage Search Filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const links = document.querySelectorAll('.conv-link');
      
      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        const li = link.parentElement;
        
        if (text.includes(query)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });
      
      // Hide empty categories
      const categories = document.querySelectorAll('.category-card');
      categories.forEach(cat => {
        const visibleLinks = cat.querySelectorAll('li:not([style*="display: none"])');
        if (visibleLinks.length === 0) {
          cat.style.display = 'none';
        } else {
          cat.style.display = '';
        }
      });
    });
  }
});
