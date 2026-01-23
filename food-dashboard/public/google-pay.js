// Load Google Pay API
(function() {
  const script = document.createElement('script');
  script.src = 'https://pay.google.com/gp/p/js/pay.js';
  script.async = true;
  script.onload = () => {
    console.log('Google Pay API loaded');
  };
  document.head.appendChild(script);
})();