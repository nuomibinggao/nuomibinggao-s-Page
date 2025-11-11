<svelte:head>
	<title>Melty Pages</title>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Splash text functionality - load from splash.json
		const splashElement = document.getElementById('splashText');
		
		fetch('splash.json')
		.then(response => response.json())
		.then(splashTexts => {
			function getRandomSplash() {
			const randomIndex = Math.floor(Math.random() * splashTexts.length);
			return splashTexts[randomIndex];
			}
			
			function updateSplashText() {
			if (splashElement) {
				splashElement.textContent = getRandomSplash();
			}
			}
			
			// Initialize with a random splash text
			updateSplashText();
			
			// Change splash text on click
			if (splashElement) {
				splashElement.addEventListener('click', updateSplashText);
			}
		})
		.catch(error => {
			console.error('Error loading splash texts:', error);
			if (splashElement) {
				splashElement.textContent = 'Crafted with care';
			}
		});

		// Scroll header functionality
		const header = document.getElementById('header');
		const container = document.getElementById('container');

		window.addEventListener('scroll', () => {
		const scrollY = window.scrollY;
		
		if (header && container) {
			if (scrollY > 100) {
				header.classList.add('scrolled');
				container.classList.add('with-fixed-header');
			} else {
				header.classList.remove('scrolled');
				container.classList.remove('with-fixed-header');
			}
		}
		});

		// Smooth scroll for navigation links
		document.querySelectorAll('.nav a').forEach(anchor => {
		anchor.addEventListener('click', function (e: Event) {
			const target = e.target as HTMLAnchorElement;
			const href = target.getAttribute('href');
			
			// Only prevent default for anchor links within the page
			if (href && href.startsWith('#')) {
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
			// For external links or page links, let the default behavior happen
		});
		});
	});
</script>

<div class="container" id="container">
    <header id="header">
      <div class="header-content">
        <h1>Melty Pages</h1>
        <p class="subtitle">A Website By nuomibinggao</p>
        <nav class="nav">
          <a href="/changelog"><img src="icons/update.svg" alt="Update" class="icon icon-inline">Changelog</a>
          <a href="https://github.com/nuomibinggao/Melty-Pages" target="_blank" rel="noopener"><img src="icons/code.svg" alt="Code" class="icon icon-inline">Source Code</a>
          <a href="https://github.com/nuomibinggao/Melty-Pages/issues" target="_blank" rel="noopener"><img src="icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue</a>
					<a href="/adofai/admin"><img src="icons/admin_panel_settings.svg" alt="Admin Panel" class="icon icon-inline">Admin Panel</a>
        </nav>
      </div>
    </header>

    <section class="intro">
      <h2><span><img src="icons/waving_hand.svg" alt="Waving hand" class="icon icon-large">Welcome</span></h2>
      <p>I'm <b>nuomibinggao</b>, a student passionate about technology and games. This minimal space showcases my projects and provides ways to connect with me.</p>
      <p>Feel free to explore my work and reach out through the links below.</p>
      <p>Why "Melty Pages"? Because the bugs on this website makes it melt down... Slowly...</p>
      <p>This website is open source on <a href="https://github.com/nuomibinggao/Melty-Pages" target="_blank" rel="noopener"><img src="icons/code.svg" alt="Code" class="icon icon-inline">GitHub</a>.</p>
      <a href="/changelog" class="link-button"><img src="icons/update.svg" alt="Update" class="icon icon-inline">View Website Changelog</a>
      <a href="https://github.com/nuomibinggao/Melty-Pages/issues" target="_blank" rel="noopener" class="link-button"><img src="icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue</a>
			<a href="/admin" class="link-button"><img src="icons/admin_panel_settings.svg" alt="Admin Panel" class="icon icon-inline">Admin Panel</a>
    </section>

    <div class="sections">

      <section class="section-card" id="studios">
        <h3><img src="icons/melty-icon.png" alt="Studios" class="icon icon-large">Melty Studios</h3>
        <p>This is our team portfolio website, it is still under construction. Maybe come back later...</p>
      </section>

      <section class="section-card" id="projects">
        <h3><img src="icons/folder.svg" alt="Folder" class="icon icon-large">Projects Hub</h3>
        <p>Browse through my various projects and contributions.</p>
        <a href="/projecthub" class="link-button"><img src="icons/arrow_forward_ios.svg" alt="Arrow forward" class="icon icon-inline">View Projects</a>
      </section>

      <section class="section-card" id="adofai">
        <h3><img src="icons/adofai_logo.png" alt="Groups" class="icon icon-adofai"></h3>
        <p>This is a section dedicated to ADOFAI content, see our custom levels and other resources here.</p>
        <a href="/adofai" class="link-button"><img src="icons/arrow_forward_ios.svg" alt="Arrow forward" class="icon icon-inline">View Section</a>
      </section>

      <section class="section-card" id="links">
        <h3><img src="icons/add_link.svg" alt="Link" class="icon icon-large">Connect</h3>
        <p>Find me across various platforms and social media.</p>
        <a href="links" class="link-button"><img src="icons/arrow_forward_ios.svg" alt="Arrow forward" class="icon icon-inline">My Links</a>
      </section>
    </div>

    <footer>
      &copy; 2025 nuomibinggao • MIT License
      <div class="footer-note" id="splashText">Loading...</div>
    </footer>
</div>