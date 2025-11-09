<script lang="ts">
	import { onMount } from 'svelte';

	let splashText = 'Loading...';

	onMount(() => {
		// Load splash texts
		fetch('/splash.json')
			.then(response => response.json())
			.then(splashTexts => {
				function getRandomSplash() {
					const randomIndex = Math.floor(Math.random() * splashTexts.length);
					return splashTexts[randomIndex];
				}
				
				splashText = getRandomSplash();
			})
			.catch(error => {
				console.error('Error loading splash texts:', error);
				splashText = 'Crafted with care';
			});

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

	function updateSplashText() {
		fetch('/splash.json')
			.then(response => response.json())
			.then(splashTexts => {
				const randomIndex = Math.floor(Math.random() * splashTexts.length);
				splashText = splashTexts[randomIndex];
			})
			.catch(error => {
				console.error('Error loading splash texts:', error);
				splashText = 'Crafted with care';
			});
	}
</script>

<svelte:head>
	<title>A Dance of Fire and Ice | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">A Dance of Fire and Ice</p>
			<nav class="nav">
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/music_note.svg" alt="Music" class="icon icon-large">Welcome to the ADOFAI Hub</h2>
		<p>Explore my collection of custom levels for <strong>A Dance of Fire and Ice</strong>. From solo creations to collaborative team projects, discover rhythm-based challenges designed with creativity and precision.</p>
		<p>Choose a section below to dive into the levels, or learn more about the teams and creators behind them.</p>

		<div>
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
			</a>
		</div>
	</div>

	<div class="sections">
		<div class="section-card" id="indie-levels">
			<h3><img src="/icons/person.svg" alt="Person" class="icon icon-large">Indie Level Collection</h3>
			<p>Browse through all my personal custom levels. Each level features unique mechanics, carefully selected music, and creative design.</p>
			<p><strong>What We Offer</strong></p>
			<ul style="color: var(--text-color-light); margin-left: 1.5rem; margin-bottom: 1rem;">
				<li>Full video previews</li>
				<li>Downloadable levels from TUF Forums</li>
				<li>Music links (Soundcloud / YouTube)</li>
			</ul>
			<a href="/adofai/levels/indie" class="link-button">
				<img src="/icons/arrow_forward_ios.svg" alt="Arrow" class="icon icon-inline">View Indie Levels
			</a>
		</div>

		<div class="section-card" id="team-levels">
			<h3><img src="/icons/groups_3.svg" alt="Groups" class="icon icon-large">Team Polychrome Portfolio</h3>
			<p>Discover the collaborative works of <strong>Team Polychrome</strong>. We're a dedicated group creating experimental and innovative custom levels through teamwork and shared creativity.</p>
			<p><strong>What We Offer</strong></p>
			<ul style="color: var(--text-color-light); margin-left: 1.5rem; margin-bottom: 1rem;">
				<li>Collaborative level designs</li>
				<li>Experimental mechanics and concepts</li>
				<li>Team-produced content</li>
				<li>Regular updates and new releases</li>
			</ul>
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<a href="/adofai/about-plcr" class="link-button">
					<img src="/icons/info.svg" alt="Info" class="icon icon-inline">About Team
				</a>
				<a href="/adofai/levels/plcr" class="link-button">
					<img src="/icons/arrow_forward_ios.svg" alt="Arrow" class="icon icon-inline">View Team Levels
				</a>
			</div>
		</div>

		<div class="section-card" id="kv-profiles">
			<h3><img src="/icons/keyboard.svg" alt="Keyboard" class="icon icon-large">KeyViewer Profiles</h3>
			<p>Premade profiles for the KeyViewer mod. It contains all major keysets and support easy customizing.</p>
			<p><strong>What We Offer</strong></p>
			<ul style="color: var(--text-color-light); margin-left: 1.5rem; margin-bottom: 1rem;">
				<li>Multiple keycount keysets</li>
				<li>Minimal design</li>
				<li>Easy customization</li>
			</ul>
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<a href="/adofai/kv/download" class="link-button">
					<img src="/icons/download.svg" alt="Info" class="icon icon-inline">Downloads
				</a>
			</div>
		</div>

		<div class="section-card" id="ov-tags">
			<h3><img src="/icons/label.svg" alt="Tags" class="icon icon-large">Not Enough Tags</h3>
			<p>Extra QoL tags focused on customization for the Overlayer mod. Mod minimum version 3.29.0 and scripting minimum 1.7.5 required.</p>
			<p><strong>What We Offer</strong></p>
			<ul style="color: var(--text-color-light); margin-left: 1.5rem; margin-bottom: 1rem;">
				<li>Fully open source tags</li>
				<li>Up to date code</li>
				<li>Requires some tinkering to fully customize</li>
			</ul>
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<a href="https://github.com/nuomibinggao/Not-Enough-Tags" class="link-button github-button">
					<img src="/icons/code.svg" alt="Info" class="icon icon-inline">GitHub
				</a>
			</div>
		</div>

		<div class="section-card" id="about">
			<h3><img src="/icons/info.svg" alt="Info" class="icon icon-large">About This Hub</h3>
			<p>This hub serves as a central location for all ADOFAI-related content, including both indie and collaborative projects.</p>
			<p><strong>Quick Links</strong></p>
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<a href="https://tuforums.com" target="_blank" rel="noopener" class="link-button tuf-button">
					<img src="/icons/TUF.png" alt="Play" class="icon icon-inline">TUF Forums
				</a>
				<a href="https://7thbe.at" target="_blank" rel="noopener" class="link-button">
					<img src="/icons/open_in_new.svg" alt="External" class="icon icon-inline">7th Beat Games Website
				</a>
			</div>
		</div>
	</div>

	<div class="section-card" style="margin-top: 2rem;">
		<h3><img src="/icons/info.svg" alt="Info" class="icon icon-large">What is ADOFAI?</h3>
		<p><strong>A Dance of Fire and Ice</strong> is a strict one-button rhythm game where you control two orbiting planets along a winding path. Press on every beat to keep them in sync while navigating increasingly complex patterns.</p>
		<p>The game combines minimalist design with challenging gameplay, and features a thriving custom level community where creators can design their own musical journeys.</p>
		<a href="https://store.steampowered.com/app/977950/A_Dance_of_Fire_and_Ice" target="_blank" rel="noopener" class="link-button">
			<img src="/icons/open_in_new.svg" alt="External" class="icon icon-inline">Get ADOFAI on Steam
		</a>
	</div>

	<footer>
		© 2025 nuomibinggao • MIT License
		<div 
			class="footer-note"
			role="button"
			tabindex="0"
			on:click={updateSplashText}
			on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { updateSplashText(); e.preventDefault(); } }}
		>{splashText}</div>
	</footer>
</div>