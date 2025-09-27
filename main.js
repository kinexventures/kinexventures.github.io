// Inject nav
fetch("nav.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("nav-placeholder").innerHTML = data;
  });

// Inject footer
fetch("footer.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
