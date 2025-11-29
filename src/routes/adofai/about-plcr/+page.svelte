<script lang="ts">
	import { onMount } from 'svelte';
	import { setupSplashText } from '$lib/splash';

	onMount(() => {
		setupSplashText('splashText');
	});
</script>

<svelte:head>
	<title>ADOFAI - Team Polychrome | Melty Pages</title>
</svelte:head>

<div class="container">
	<header id="header">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">ADOFAI - Team Polychrome</p>
		</div>
	</header>

	<div class="intro">
		<h2>About Our Team</h2>
		<p>Welcome to <strong>Team Polychrome</strong>! We are a dedicated group of ADOFAI players committed to create experimental and fun custom levels through innovation and collaborative teamwork.</p>
		<p>Feel free to check out some of our previous works here.</p>
		<p>Unfortunately, we are not able to upload our works to Bilibili yet until further notice, for now, you can check the <a href="/adofai/plcr-levels">custom level page</a> or search the <a href="https://tuforums.com/levels" target="_blank" rel="noopener">TUF Forums</a>.</p>

		<div class="additional-buttons">
			<a href="https://space.bilibili.com/3546710827600010" target="_blank" rel="noopener" class="link-button bilibili-button">
				<img src="/icons/play_circle.svg" alt="Play Circle" class="icon icon-inline">Bilibili Profile
			</a>
			<a href="/adofai/levels/plcr" class="link-button">
				<img src="/icons/music_note.svg" alt="Music note" class="icon icon-inline">Custom Levels
			</a>
			<a href="https://afdian.com/a/nuomibinggao" target="_blank" rel="noopener" class="link-button donate-button">
				<img src="/icons/volunteer_activism.svg" alt="Support" class="icon icon-inline">Support Us
			</a>
		</div>
		
		<div class="back-button-wrapper">
			<a href="/adofai" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Home" class="icon icon-inline">Back to ADOFAI Hub
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