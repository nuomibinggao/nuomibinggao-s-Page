<script lang="ts">
	import { onMount } from 'svelte';

	let splashText = 'Loading...';

	onMount(() => {
		// Load splash texts
		fetch('/splash.json')
			.then(response => response.json())
			.then(splashTexts => {
				splashText = getRandomSplash(splashTexts);
			})
			.catch(error => {
				console.error('Error loading splash texts:', error);
				splashText = 'Crafted with care';
			});

		// Set up scroll handler
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
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function getRandomSplash(splashTexts: string[]): string {
		const randomIndex = Math.floor(Math.random() * splashTexts.length);
		return splashTexts[randomIndex];
	}

	function updateSplashText() {
		fetch('/splash.json')
			.then(response => response.json())
			.then(splashTexts => {
				splashText = getRandomSplash(splashTexts);
			})
			.catch(error => {
				console.error('Error loading splash texts:', error);
				splashText = 'Crafted with care';
			});
	}
</script>

<svelte:head>
	<title>ADOFAI - How to Install KeyViewer Profiles | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">ADOFAI - Step-by-step KeyViewer installation guide</p>
			<nav class="nav">
				<a href="https://www.fontshare.com/fonts/chillax" target="_blank" rel="noopener">
					<img src="/icons/download.svg" alt="Download" class="icon icon-inline">Download Fonts
				</a>
				<a href="/adofai/kv/download">
					<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">Back to Downloads Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/help.svg" alt="Help" class="icon icon-large">KeyViewer Installation Tutorial</h2>
		<p>Follow this step-by-step guide to install and configure KeyViewer profiles for ADOFAI.</p>
		<div style="margin-top: 1rem;">
			<a href="https://www.fontshare.com/fonts/chillax" target="_blank" rel="noopener" class="link-button">
				<img src="/icons/download.svg" alt="Download" class="icon icon-inline">Download Fonts
			</a>
			<a href="/adofai/kv/download" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">Back to Downloads Page
			</a>
		</div>
	</div>

	<div class="tutorial-step">
		<h2>
			<span class="step-number">1</span>
			<img src="/icons/download.svg" alt="Download" class="icon icon-inline">
			Download a Profile
		</h2>
		<p>Go to the <a href="/adofai/kv/download">KeyViewer Downloads</a> page and click the download button for the profile you want (e.g., 8K, 10K, 16K, etc.). The file will be saved as a <code>.json</code> file.</p>
	</div>

	<div class="tutorial-step">
		<h2>
			<span class="step-number">2</span>
			<img src="/icons/settings.svg" alt="Settings" class="icon icon-inline">
			Open KeyViewer Config
		</h2>
		<p>Launch ADOFAI, make sure to install KeyViewer 4.0.0 or later. In game, press <strong>Ctrl + F10</strong> (Default) to open Unity Mod Manager, look for the <strong>KeyViewer</strong> mod, and click the options button.</p>
	</div>

	<div class="tutorial-step">
		<h2>
			<span class="step-number">3</span>
			<img src="/icons/upload.svg" alt="Import" class="icon icon-inline">
			Import the Profile
		</h2>
		<ul>
			<li>In KeyViewer, click <strong>Import Profile</strong>.</li>
			<li>Click it and select the downloaded <code>.json</code> file from your computer.</li>
			<li>The profile should now appear in your list. Select it to activate.</li>
		</ul>
	</div>

	<div class="tutorial-step">
		<h2>
			<span class="step-number">4</span>
			<img src="/icons/tune.svg" alt="Tune" class="icon icon-inline">
			Adjust and Save
		</h2>
		<p>When imported, the font will not load, you need to manually change the font in the mod config. Recommended fonts can be downloaded <a href="https://www.fontshare.com/fonts/chillax" target="_blank" rel="noopener">here</a>. You may also need to adjust the position (referred to <strong>Offset</strong> in mod config) to make the profile appear on your screen depending on your resolution, you can ignore this if you are on 2K (2560 × 1440) resolution. Make sure to save your changes by pressing <strong>Save</strong> at the bottom of the mod manager window.</p>
	</div>

	<div class="note">
		<img src="/icons/warning.svg" alt="Warning" class="icon icon-inline icon-yellow">
		<strong>Note:</strong> If you have trouble importing, make sure you are using KeyViewer version 4.9.7 or later. If the profile does not appear, check the position and offset settings.
	</div>

	<footer>
		&copy; 2025 nuomibinggao • MIT License
		<div 
			class="footer-note"
			role="button"
			tabindex="0"
			on:click={updateSplashText}
			on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { updateSplashText(); e.preventDefault(); } }}
		>{splashText}</div>
	</footer>
</div>