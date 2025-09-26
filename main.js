// Include nav/footer dynamically
function includeHTML(id, file) {
  fetch(file)
    .then(response => response.ok ? response.text() : Promise.reject('Failed to load'))
    .then(data => { document.getElementById(id).innerHTML = data; })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

includeHTML('nav-placeholder', 'nav.html');
includeHTML('footer-placeholder', 'footer.html');

// Mobile Menu Toggle
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('menu-toggle')) {
    const nav = document.querySelector('.nav-list');
    nav.classList.toggle('active');
  }
});
