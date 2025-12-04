<script lang="ts">
	import { onMount } from 'svelte';
	import { setupSplashText } from '$lib/splash';

	onMount(() => {
		setupSplashText('splashText');

		const header = document.getElementById('header');
		const container = document.getElementById('container');

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
	<title>Melty API Documentation | Melty Pages</title>
</svelte:head>

<div class="container" id="container">
	<header id="header">
		<div class="header-content">
			<h1><a href="/" style="color: inherit; text-decoration: none;">Melty Pages</a></h1>
			<p class="subtitle">Melty API Documentation</p>
			<nav class="nav">
				<a href="https://github.com/nuomibinggao/Melty-API" target="_blank" rel="noopener">
					<img src="/icons/code.svg" alt="GitHub" class="icon icon-inline">GitHub
				</a>
				<a href="https://github.com/nuomibinggao/Melty-API/issues" target="_blank" rel="noopener">
					<img src="/icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue
				</a>
				<a href="/projecthub">
					<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">Back to Hub
				</a>
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Home Page
				</a>
			</nav>
		</div>
	</header>

	<section class="intro">
		<h2>Overview</h2>
		<p>Welcome to the Melty API documentation. This API provides programmatic access to ADOFAI custom levels data</p>
		<p>All API endpoints are accessible via <code>https://api.melty-studios.com</code>.</p>
		<div>
			<a href="https://github.com/nuomibinggao/Melty-API" class="link-button" target="_blank" rel="noopener">
				<img src="/icons/code.svg" alt="GitHub" class="icon icon-inline">GitHub
			</a>
			<a href="https://github.com/nuomibinggao/Melty-API/issues" class="link-button" target="_blank" rel="noopener">
				<img src="/icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue
			</a>
			<a href="/projecthub" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">Back to Hub
			</a>
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Home Page
			</a>
		</div>
	</section>

	<div class="doc-section">
		<h2>Authentication</h2>
		<p>No authentication is required to access public endpoints. Some administrative endpoints may require authentication via API keys or other methods.</p>
	</div>

	<div class="doc-section">
		<h2>Endpoints</h2>
		
		<div class="endpoint-card card">
			<h3>Get Levels Data</h3>
			<div>
				<span class="endpoint-method get">GET</span>
				<span class="endpoint-path">/get-levels</span>
			</div>
			<p>Returns all levels data as a JavaScript module that can be directly imported.</p>
			
			<h4>Response Format</h4>
			<p>The response is a JavaScript module with the following structure:</p>
			
      <pre class="code-example">
export const comingSoonLevel = &#123; /* level data */ &#125;;
export const indieLevels = [ /* array of levels */ ];
export const plcrLevels = [ /* array of levels */ ];
export const legacyLevel = &#123; /* level data */ &#125;;
      </pre>

			<div>
				<span class="endpoint-method get">GET</span>
				<span class="endpoint-path">/get-level-by-id</span>
			</div>
			<p>Returns data of a single level in JSON format, determined by the inserted unique ID in the URL.</p>
			<p><strong>/get-level-by-id/indie/1</strong> returns an indie level with the ID of 1</p>
			<p><strong>/get-level-by-id/plcr/1</strong> returns an Team Polychrome level with the ID of 1</p>

			<h4>Response Format</h4>
			<p>The response is a JSON formatted object with the following structure (using /indie/1 as an example):</p>

			<pre class="code-example">
&#123;
	"type": "indie",
	"level": &#123;
		"id": 1,
		"variation_of": null,
		"variation_name": "",
		"title": "trung-nova - REFLECTION»«REFRACTION",
		"icon": "https://api.tuforums.com/v2/media/image/icon/Q3.png",
		"secondary_icon": "https://api.tuforums.com/v2/media/image/icon/U14J.png",
		"date": "2025-08-01",
		"duration": "3:07",
		"bilibili_bvid": "BV1CmhnzfEjF",
		"description": "\u003Cp\u003EThis level was made to experiment high keycount rolling patterns and the judgment limiting gimmicks, it is a high-difficulty level.\u003C/p\u003E\u003Cp\u003EThis song was made for COEGTS 2025 Main Mappool NM2.\u003C/p\u003E",
		"tuf_link": "https://tuforums.com/levels/9729",
		"soundcloud_link": "https://soundcloud.com/trung-nova_727/reflectionrefraction"
	&#125;
&#125;
			</pre>
		</div>
		
		<div class="doc-footer">
			<p>Wondering why there are only a few endpoints? That's because the API is still working in progress... More features coming soon.</p>
			<p>Need help with the API? Report an issue or request a feature on our <a href="https://github.com/nuomibinggao/Melty-API/issues">GitHub</a> repo.</p>
			<p><strong>API Version v1</strong></p>
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