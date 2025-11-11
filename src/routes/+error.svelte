<script lang="ts">
	import { onMount } from 'svelte';

	let errorClass = '#4a9eff';
	let header: HTMLElement | null = null;
	let container: HTMLElement | null = null;

	// Function to convert hex to rgba
	function hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	let errorGlowColorFrom: string;
	let errorGlowColorTo: string;

	// Update glow colors whenever errorClass changes
	$: {
		errorGlowColorFrom = hexToRgba(errorClass, 0.3);
		errorGlowColorTo = hexToRgba(errorClass, 0.6);
	}

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

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function changeColor() {
		const colors = ['#4a9eff', '#ff4a9e', '#9eff4a', '#ff9e4a', '#9e4aff'];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		errorClass = randomColor;
	}

	function goBack() {
		history.back();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			changeColor();
		}
	}
</script>

<svelte:head>
	<title>404 Not Found | Melty Pages</title>
</svelte:head>

<div class="container" id="container">
	<header id="header">
		<div class="header-content">
			<h1><a href="/" style="color: inherit; text-decoration: none;">Melty Pages</a></h1>
		</div>
	</header>

	<div class="error-container">
		<div 
			class="error-code" 
			on:click={changeColor} 
			on:keydown={handleKeyDown}
			role="button"
			tabindex="0"
			style="color: {errorClass}; --error-glow-color-from: {errorGlowColorFrom}; --error-glow-color-to: {errorGlowColorTo}"
		>404</div>
		<h2 class="error-title">
			<img src="/icons/error.svg" alt="Error" class="icon-large">Page Not Found
		</h2>
		<p class="error-message">
			Oops! The page you're looking for seems to have wandered off into the digital void. 
			Don't worry though, it happens to the best of us.
		</p>
		
		<div class="error-actions">
			<a href="/" class="error-button primary">
				<img src="/icons/home.svg" alt="Home" class="icon-inline">Go Home
			</a>
			<button class="error-button" on:click={goBack}>
				<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon-inline">Go Back
			</button>
		</div>

		<div class="suggestions">
			<h3><img src="/icons/help.svg" alt="Help" class="icon-inline">What you can do:</h3>
			<ul>
				<li><img src="/icons/spellcheck.svg" alt="Spellcheck" class="icon-inline">Check the URL for typos</li>
				<li><img src="/icons/web.svg" alt="Home" class="icon-inline">Visit the <a href="/">homepage</a> to start over</li>
				<li><img src="/icons/folder.svg" alt="Work" class="icon-inline">Browse my <a href="/projecthub">projects</a></li>
				<li><img src="/icons/add_link.svg" alt="Link" class="icon-inline">Find my <a href="/links">social links</a></li>
			</ul>
		</div>
	</div>

	<footer>
		&copy; 2025 nuomibinggao • MIT License
		<div class="footer-note">Even errors can look good</div>
	</footer>
</div>
