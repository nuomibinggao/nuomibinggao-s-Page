<script lang="ts">
	import { onMount } from 'svelte';
	import { setupSplashText } from '$lib/splash';


	let header: HTMLElement | null = null;
	let container: HTMLElement | null = null;

	onMount(() => {
		header = document.getElementById('header');
		container = document.getElementById('container');

		const handleScroll = () => {
			if (!header || !container) return;
			const scrollY = window.scrollY;
			
			if (scrollY > 100) {
				header.classList.add('scrolled');
				container.classList.add('with-fixed-header');
			} else {
				header.classList.remove('scrolled');
				container.classList.remove('with-fixed-header');
			}
		};

		window.addEventListener('scroll', handleScroll);

		setupSplashText('splashText');

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>My Links | Melty Pages</title>
	<link href="https://api.fontshare.com/css?f[]=chillax@400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="/style-v2.css">
</svelte:head>

<div class="container" id="container">
	<header id="header">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">Connect with me across platforms</p>
			<nav class="nav">
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/add_link.svg" alt="Link" class="icon icon-large">My Links</h2>
		<p>Find me across various platforms and social media. Feel free to reach out!</p>
		<div>
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
			</a>
		</div>
	</div>

	<main class="grid">
		<div class="card">
			<h2><img src="/icons/code.svg" alt="Code" class="icon icon-large">GitHub Profile</h2>
			<p>Check out my coding projects and contributions.</p>
			<div class="links">
				<a href="https://github.com/nuomibinggao" target="_blank" rel="noopener" class="link-button github-button">
					<img src="/icons/code.svg" alt="Code" class="icon icon-inline">GitHub
				</a>
			</div>
		</div>

		<div class="card">
			<h2><img src="/icons/video_library.svg" alt="Video Library" class="icon icon-large">Bilibili Channel</h2>
			<p>Watch my ADOFAI content and enjoy some funny moments.</p>
			<div class="links">
				<a href="https://space.bilibili.com/1223643343" target="_blank" rel="noopener" class="link-button bilibili-button">
					<img src="/icons/play_circle.svg" alt="Play" class="icon icon-inline">Bilibili
				</a>
			</div>
		</div>

		<div class="card">
			<h2><img src="/icons/extension.svg" alt="Extension" class="icon icon-large">Modrinth Profile</h2>
			<p>Find my Minecraft mods and modpacks.</p>
			<div class="links">
				<a href="https://modrinth.com/user/nuomibinggao" target="_blank" rel="noopener" class="link-button modrinth-button">
					<img src="/icons/sports_esports.svg" alt="Gaming" class="icon icon-inline">Modrinth
				</a>
			</div>
		</div>

		<div class="card">
			<h2><img src="/icons/volunteer_activism.svg" alt="Support" class="icon icon-large">Support Me</h2>
			<p>Feel free to support my work, thank you for your generosity.</p>
			<div class="links">
				<a href="https://afdian.com/a/nuomibinggao" target="_blank" rel="noopener" class="link-button donate-button">
					<img src="/icons/volunteer_activism.svg" alt="Support" class="icon icon-inline">Donate
				</a>
			</div>
		</div>
	</main>

	<div class="intro">
		<h2><img src="/icons/contact_mail.svg" alt="Contact" class="icon icon-large">Contact Me</h2>
		<p>If you need to reach out, you can contact me through:</p>
		<p>Email: <a href="mailto:nuomibinggao@hotmail.com">nuomibinggao@hotmail.com</a></p>
	</div>

	<footer>
		&copy; 2025 nuomibinggao • MIT License
		<div class="footer-note" id="splashText" role="button" tabindex="0">Loading...</div>
	</footer>
</div>
