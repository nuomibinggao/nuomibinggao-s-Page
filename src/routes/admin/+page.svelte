<script lang="ts">
	import { onMount } from 'svelte';
	import { setupSplashText } from '$lib/splash';

	onMount(() => {
		setupSplashText('splashText');

		const header = document.getElementById('mainHeader');
		const container = document.getElementById('mainContainer');

		const handleScroll = () => {
			if (header && container) {
				if (window.scrollY > 100) {
					header.classList.add('scrolled');
					container.classList.add('with-fixed-header');
				} else {
					header.classList.remove('scrolled');
					container.classList.remove('with-fixed-header');
				}
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>Admin Control Panel | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">Admin Control Panel</p>
			<nav class="nav">
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/admin_panel_settings.svg" alt="Admin" class="icon icon-large">Admin Control Panel</h2>
    <p><strong><img src="/icons/construction.svg" alt="Under Construction" class="icon icon-inline">This page is under construction, please come back later.</strong></p>
    <p><strong>If you are a user, please go back as you cannot gain access from this point on.</strong></p>
		<p>This is the control panel for the ADOFAI section's content, here you can upload, delete, and modify levels and their data.</p>
		<div>
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
			</a>
		</div>
  </div>

  <div class="sections">
    <div class="section-card">
      <h3><img src="/icons/panorama.svg" alt="Level" class="icon icon-large">ADOFAI Level Managment</h3>

      <a href="/admin/adofai/levelmanage" class="link-button">
        <img src="/icons/settings.svg" alt="Manage" class="icon icon-inline">Manage Levels
      </a>
    </div>

    <div class="section-card">
      <h3><img src="/icons/bug_report.svg" alt="Level" class="icon icon-large">API Debug</h3>

      <a href="/admin/api-raw-data" class="link-button">
        <img src="/icons/data_object.svg" alt="Data" class="icon icon-inline">View Raw API Returned Data
      </a>
      <a href="https://github.com/nuomibinggao/Melty-API" rel="noopener" class="link-button github-button">
        <img src="/icons/code.svg" alt="Code" class="icon icon-inline">GitHub
      </a>
    </div>
  </div>

	<footer>
		&copy; 2025 nuomibinggao • MIT License
		<div 
			class="footer-note"
			id="splashText"
			role="button"
			tabindex="0"
		>Loading...</div>
	</footer>
</div>