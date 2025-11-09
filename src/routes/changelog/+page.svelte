<script lang="ts">
	import { onMount } from 'svelte';

	const changelog = [
		{
			date: '2025-11-9 Log 3',
			version: 'v3 - Svelte Migration Completed',
			changes: [
				'Migrated all of the ADOFAI related pages.',
				'Changed some splash text.',
				'Added a "Loading Levels..." text when levels are being loaded.',
				'Restructured the ADOFAI section for better navigation.',
				'Splash texts can now be changed by either left clicking, pressing [Enter], or [Space] when focused on the splash text element. (idk why i did this)'
			]
		},
		{
			date: '2025-11-9 Log 2',
			version: 'v3 - Svelte Migration Started',
			notes: ['Currently Migrated Pages:'],
			changes: [
				'Home Page (index.html → +page.svelte)',
				'Error 404 Page (404.html → +error.svelte)',
				'Links Page (links.html → links/+page.svelte)',
				'Changelog Page (changelog.html → changelog/+page.svelte)',
				'Project Hub Page (projecthub.html → projecthub/+page.svelte)',
				'API Docs Page (api-docs.html → api-docs/+page.svelte)',
				'Docs Hub Page (docs.html → docshub/+page.svelte)',
				'Docs Page (docshub.html → docs/+page.svelte)',
				'Rust Learning Docs Page (md-docs/rust-learning-docs/rust-learning-docs.html → docs/rust-learning-docs/+page.svelte)'
			]
		},
		{
			date: '2025-11-9 Log 1',
			version: 'v2 Update 9 - Final Update',
			notes: [
				'We are proud to annouce that we are migrating to the <a href="https://svelte.dev" rel="noopener">Svelte</a> framework! This means better performance, and better UI potential.',
				'Currently the website is still migrating to Svelte (Currently marked as branch "v3" in GitHub), so the live website is still on the "v2n" branch.'
			],
			changes: [
				'Cleaned up the codebase and tweaked some details.',
				'Minor bugfixes.'
			]
		},
		{
			date: '2025-11-2',
			version: 'v2 Update 8 - API Intergration',
			notes: ['Happy Halloween!'],
			changes: [
				'Completely removed the backup level data, the website now uses the Melty API to get levels.',
				'Added documentation to the Melty API. Can be found in the project hub.'
			]
		},
		{
			date: '2025-10-27',
			version: 'v2 Update 7 - ADOFAI Content Structure Redesign',
			changes: [
				'Restructured the content for ADOFAI, added a hub for ADOFAI content.',
				'Deleted everything related to ADOFAI in the Project Hub page.',
				'A few bugfixes and tweaks'
			]
		},
		{
			date: '2025-10-26',
			version: 'v2 Update 6 - Website Updates',
			notes: ['Updates to the website will slow down due to API development.'],
			changes: [
				'Added a new Melty Studios portfolio link on the main page, it is still under construction.',
				'Changed the ADOFAI Custom Levels project\'s icon to <span><img src="icons/arrow_forward_ios.svg" alt="Back" class="icon icon-small"></span>.',
				'Live demo is back up, it is now running on <a href="https://www.cloudflare.com" rel="noopener">Cloudflare</a>.'
			]
		},
		{
			date: '2025-10-24',
			version: 'v2 Update 5 - API Test',
			changes: [
				'Added Melty API intergration to test Cloudflare database, this feature is still under development, you can check the source code for the API <a href="https://github.com/nuomibinggao/Melty-API" target="_blank" rel="noopener">here</a>.',
				'Added new project Melty API.',
				'Added auto updating date for projects Melty Pages and Melty API, fixed ADOFAI Custom Levels project date not updating.',
				'Deleted the ADOFAI Custom Levels card in the main page.',
				'Changed the Back to Hub button in the team levels page to Back to Team Page.',
				'Fixed some styles in the changelog.',
				'Fixed nav bar not showing up on some pages.',
				'Deleted the "Current Version" in the changelog.'
			]
		},
		{
			date: '2025-10-21',
			version: 'v2 Update 4 - Website Rebranding',
			changes: [
				'Changed the website name to "Melty Pages".',
				'Added a coming soon section on the custom level page.',
				'Fixed the nav bar style on mobile devices.'
			]
		},
		{
			date: '2025-10-19',
			version: 'v2 Update 3 - New Project',
			notes: ['Future versions will focus on subtle decorations and API intergration to the website.'],
			changes: [
				'Added a new Docs Hub for all my documents for learning.',
				'Added a new downloadable markdown file for my Rust learning notes.',
				'Added missing link buttons for the level pages.',
				'Added a new level to the indie levels page.'
			]
		},
		{
			date: '2025-09-25',
			version: 'v2 Update 2 - Video Logic Update',
			changes: [
				'Fixed a bug in the custom levels page where level cards without a video would show an empty space instead of a "Video Missing" placeholder.',
				'Improved the team levels page by dynamically checking for videos. It now shows a video if available, or a "Video Missing" placeholder if not, making it consistent with the custom levels page.',
				'Changed the "Back to Main Page" icon to <span><img src="icons/home.svg" alt="Home" class="icon icon-small"></span>.',
				'Fixed the icons on the level\'s 404 pages to use the local SVG icons.',
				'Changed the links buttons below each level to be block displayed.',
				'Fixed the missing video background not fully showing on screen.'
			]
		},
		{
			date: '2025-09-24',
			version: 'v2 Update 1 - Icon Fixes',
			changes: [
				'Changed icons to be hosted locally, fixing the icon issue.',
				'Fixed some color issues in clickable text.',
				'Added descriptions to team levels.',
				'Changed some icons.',
				'Added more splash text.'
			]
		},
		{
			date: '2025-09-23',
			version: 'v2 - Website Refurbish',
			changes: [
				'Initial release of personal website with modern dark theme',
				'Added smooth scrolling navigation and responsive design',
				'Improved the Team Levels Page for consistancy.',
				'Integrated splash text system with randomized footer messages',
				'Added this changelog, future changes will be logged here.'
			]
		},
		{
			date: '2025-09-22',
			version: 'v1 - Final Update',
			notes: ['v1 is no longer supported, this is its final update'],
			changes: [
				'Removed the clear filters button.',
				'v1, the old version of this website is archived on <a href="https://github.com/nuomibinggao/Melty-Pages/tree/v1" target="_blank" rel="noopener">GitHub</a>.'
			]
		}
	];

	onMount(() => {
		const splashElement = document.getElementById('splashText');
		
		if (splashElement) {
			fetch('/splash.json')
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
					
					updateSplashText();
					
				splashElement.addEventListener('click', updateSplashText);
				})
				.catch(error => {
					console.error('Error loading splash texts:', error);
					if (splashElement) {
						splashElement.textContent = 'Crafted with care';
					}
				});
		}

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
	<title>Changelog | Melty Pages</title>
</svelte:head>

<div class="container" id="container">
	<header id="header">
		<div class="header-content">
			<h1><a href="/" style="color: inherit; text-decoration: none;">Melty Pages</a></h1>
			<p class="subtitle">Website Changelog</p>
			<nav class="nav">
				<a href="/"><img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Home Page</a>
				<a href="https://github.com/nuomibinggao/Melty-Pages/issues" target="_blank" rel="noopener"><img src="/icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue</a>
			</nav>
		</div>
	</header>

	<section class="intro">
		<h2><img src="/icons/update.svg" alt="Update" class="icon icon-large">Website Updates & Changes</h2>
		<p>Track the evolution of this website with detailed release notes and improvements.</p>
		<div>
			<a href="/" class="link-button"><img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Home Page</a>
			<a href="https://github.com/nuomibinggao/Melty-Pages/issues" target="_blank" rel="noopener" class="link-button"><img src="/icons/bug_report.svg" alt="Report" class="icon icon-inline">Report an Issue</a>
		</div>
	</section>

	<section class="changelog">
		{#each changelog as entry}
			<div class="changelog-entry">
				<div class="changelog-date">{entry.date}</div>
				<div class="changelog-content">
					<h4>{entry.version}</h4>
					{#if entry.notes}
						{#each entry.notes as note}
							<h5>{@html note}</h5>
						{/each}
					{/if}
					{#if entry.changes}
						<ul>
							{#each entry.changes as change}
								<li>{@html change}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/each}

		<div class="changelog-footer">
			<p>For technical details and source code changes, visit the <a href="https://github.com/nuomibinggao/Melty-Pages/commits" target="_blank" rel="noopener"><img src="/icons/code.svg" alt="Code" class="icon icon-inline">commit history</a>.</p>
			<p>Have suggestions or found a bug? <a href="https://github.com/nuomibinggao/Melty-Pages/issues" target="_blank" rel="noopener"><img src="/icons/bug_report.svg" alt="Bug report" class="icon icon-inline">Report an issue</a>.</p>
		</div>
	</section>

	<footer>
		&copy 2025 nuomibinggao • MIT License
		<div class="footer-note" id="splashText">Loading...</div>
	</footer>
</div>
