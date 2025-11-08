<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Splash text functionality - load from splash.json
    const splashElement = document.getElementById('splashText');
    
    fetch('/splash.json') // Path adjusted for SvelteKit static folder
      .then(response => response.json())
      .then(splashTexts => {
        function getRandomSplash() {
          const randomIndex = Math.floor(Math.random() * splashTexts.length);
          return splashTexts[randomIndex];
        }
        
        function updateSplashText() {
          splashElement.textContent = getRandomSplash();
        }
        
        // Initialize with a random splash text
        updateSplashText();
        
        // Change splash text on click
        splashElement.addEventListener('click', updateSplashText);
      })
      .catch(error => {
        console.error('Error loading splash texts:', error);
        splashElement.textContent = 'Crafted with care';
      });

    // Scroll header functionality
    const header = document.getElementById('header');
    const container = document.getElementById('container');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        header.classList.add('scrolled');
        container.classList.add('with-fixed-header');
      } else {
        header.classList.remove('scrolled');
        container.classList.remove('with-fixed-header');
      }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav a').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for anchor links within the page
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100; // Account for fixed header
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  });
</script>

<div class="container" id="container">
  <header id="header">
    <div class="header-content">
      <h1>Melty Pages</h1>
      <p class="subtitle">A Clean Space</p>
      <nav class="nav">
        <a href="/changelog"><img src="/icons/update.svg" alt="Update" class="icon icon-inline">Changelog</a>
        <a href="https://github.com/nuomibinggao/Melty-Pages" target="_blank" rel="noopener"><img src="/icons/code.svg" alt="Code" class="icon icon-inline">Source Code</a>
        <a href="https://github.com/nuomibinggao/Melty-Pages/issues" target="_blank" rel="noopener"><img src="/icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue</a>
      </nav>
    </div>
  </header>

  <slot />

  <footer>
    © 2025 nuomibinggao • MIT License
    <div class="footer-note" id="splashText">Loading...</div>
  </footer>
</div>