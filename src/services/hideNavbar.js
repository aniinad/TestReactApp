// Check for the 'embed' query parameter
const params = new URLSearchParams(window.location.search);
const isEmbedded = params.get('embed') === 'true';

// Optionally, also check if inside an iframe
const inIframe = window.self !== window.top;

if (isEmbedded || inIframe) {
  // Hide the navigation bar (adjust selector as needed)
  const navbar = document.querySelector('.navbar'); // or '#navbar', etc.
  if (navbar) {
    navbar.style.display = 'none';
  }
}