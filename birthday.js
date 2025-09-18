// birthday.js — add a small header-only birthday hat on Dec 17 (UTC+8)
(function() {
  function isBirthdayUTC8() {
    const now = new Date();
    const utc8Date = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    // month is 0-indexed: December is 11
    return utc8Date.getUTCMonth() === 11 && utc8Date.getUTCDate() === 17;
  }

  function addHeaderBirthdayHat() {
    if (!isBirthdayUTC8()) return;
    const pageTitle = document.getElementById('pageTitle');
    if (!pageTitle) return;
    if (pageTitle.innerHTML.includes('bdayhat.png')) return;

    const img = document.createElement('img');
    img.src = 'bdayhat.png';
    img.alt = 'Birthday Hat';
    img.style.width = '30px';
    img.style.height = 'auto';
    img.style.verticalAlign = 'middle';
    img.style.marginRight = '10px';
    pageTitle.insertBefore(img, pageTitle.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHeaderBirthdayHat);
  } else {
    addHeaderBirthdayHat();
  }
})();
