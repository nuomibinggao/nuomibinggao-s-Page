<script lang="ts">
	import { onMount } from 'svelte';

	type Level = {
		id: number;
		title: string;
		icon: string;
		secondary_icon?: string;
		date: string;
		duration: string;
		description?: string;
		bilibili_bvid?: string;
		tuf_link?: string;
		soundcloud_link?: string;
		youtube_link?: string;
		expanded?: boolean;
	};

	type ComingSoonLevel = {
		id: number;
		title: string;
		icon: string;
		date: string;
		duration: string;
		description?: string;
		expanded?: boolean;
	};

	type LegacyLevel = {
		id: number;
		title: string;
		icon: string;
		date: string;
		meta: string;
		link: string;
	};

	let levels: Level[] = [];
	let comingSoonLevel: ComingSoonLevel | null = null;
	let legacyLevel: LegacyLevel | null = null;
	let filteredLevels: Level[] = [];
	let splashText = 'Loading...';
	let sortOption = 'date-desc';
	let searchQuery = '';
	let isLoading = true;
	let loadError: string | null = null;

	onMount(() => {
		// Load levels data
		fetch('https://api.melty-studios.com/get-levels')
			.then(response => response.text())
			.then(text => {
				try {
					// Extract all the different level arrays from the JavaScript text
					const comingSoonMatch = text.match(/export const comingSoonLevel = (\{[\s\S]*?\});/);
					const indieLevelsMatch = text.match(/export const indieLevels = (\[[\s\S]*?\]);/);
					const legacyLevelMatch = text.match(/export const legacyLevel = (\{[\s\S]*?\});/);

					if (comingSoonMatch && comingSoonMatch[1]) {
						comingSoonLevel = JSON.parse(comingSoonMatch[1]);
					}
					if (indieLevelsMatch && indieLevelsMatch[1]) {
						levels = JSON.parse(indieLevelsMatch[1]);
						filteredLevels = [...levels];
						applySort();
					}
					if (legacyLevelMatch && legacyLevelMatch[1]) {
						legacyLevel = JSON.parse(legacyLevelMatch[1]);
					}

					loadError = null;
				} catch (error) {
					loadError = error instanceof Error ? error.message : 'Unknown error occurred';
					console.error('Error parsing levels data:', error);
					console.error('Response text:', text);
				}
				isLoading = false;
			})
			.catch(error => {
				loadError = error instanceof Error ? error.message : 'Unknown error occurred';
				console.error('Error loading levels:', error);
				isLoading = false;
			});

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

	function applySort() {
		const sorted = [...filteredLevels].sort((a, b) => {
			const aDate = a.date;
			const bDate = b.date;
			const aName = a.title.toLowerCase();
			const bName = b.title.toLowerCase();

			switch (sortOption) {
				case 'name-asc':
					return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
				case 'name-desc':
					return bName.localeCompare(aName, undefined, { sensitivity: 'base' });
				case 'date-asc':
					return aDate.localeCompare(bDate);
				case 'date-desc':
					return bDate.localeCompare(aDate);
				default:
					return 0;
			}
		});
		filteredLevels = sorted;
	}

	function handleSearch() {
		const query = searchQuery.toLowerCase();
		filteredLevels = levels.filter(level => 
			level.title.toLowerCase().includes(query) || 
			(level.description && level.description.toLowerCase().includes(query))
		);
		applySort();
	}

	$: if (sortOption) {
		applySort();
	}

	$: if (searchQuery !== undefined) {
		handleSearch();
	}
</script>

<svelte:head>
	<title>ADOFAI - Indie Levels | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">ADOFAI - Indie Levels</p>
			<nav class="nav">
				<a href="/adofai/levels/plcr">
					<img src="/icons/groups_3.svg" alt="Group" class="icon icon-inline">To Team Levels Page
				</a>
				<a href="/adofai">
					<img src="/icons/arrow_back_ios_new.svg" alt="Home" class="icon icon-inline">Back to ADOFAI Hub
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/person.svg" alt="Person" class="icon icon-large">Custom Level Collection</h2>
		<p>This page contains all the custom levels made by me, use the filters below to explore.</p>
		<p>You can also check out the team levels.</p>
		<div style="margin-top: 1rem;">
			<a href="/adofai/levels/plcr" class="link-button">
				<img src="/icons/groups_3.svg" alt="Groups" class="icon icon-inline">To Team Levels Page
			</a>
			<a href="/adofai" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Home" class="icon icon-inline">Back to ADOFAI Hub
			</a>
		</div>
	</div>

	<div class="search-bar">
		<input type="text" bind:value={searchQuery} placeholder="Search levels..." />
	</div>

	<div class="sort-bar">
		<span>Filter By</span>
		<select bind:value={sortOption}>
			<option value="date-desc">Date (Newest First)</option>
			<option value="date-asc">Date (Oldest First)</option>
			<option value="name-asc">Name (A-Z)</option>
			<option value="name-desc">Name (Z-A)</option>
		</select>
	</div>

	<main class="list-view">
		{#if isLoading}
			<div class="loading-message" style="text-align: center; padding: 2rem;">
				Loading levels...
			</div>
		{:else if loadError}
			<div class="error-message" style="text-align: center; padding: 2rem; color: #ff5555;">
				Error loading levels: {loadError}
			</div>
		{:else}
			{#if comingSoonLevel}
				<div class="level-card-container coming-soon-container">
					<div 
						class="level-card coming-soon-card"
						role="button"
						tabindex="0"
						on:click={() => comingSoonLevel!.expanded = !comingSoonLevel!.expanded}
						on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { comingSoonLevel!.expanded = !comingSoonLevel!.expanded; e.preventDefault(); } }}
						style="cursor: pointer; border-radius: {comingSoonLevel.expanded ? '0.75rem 0.75rem 0 0' : '0.75rem'}"
					>
						<div class="level-info">
							<img src="/icons/{comingSoonLevel.icon}" alt="Coming Soon" class="level-icon coming-soon-icon" />
							<span>{comingSoonLevel.title}</span>
						</div>
						<div class="level-meta">
							<div>
								<img src="/icons/schedule.svg" alt="Duration" class="icon icon-small">Duration: {comingSoonLevel.duration}
							</div>
							<div>
								<img src="/icons/event.svg" alt="Release date" class="icon icon-small">Released: {comingSoonLevel.date}
							</div>
						</div>
					</div>

					<div class="level-expanded" class:open={comingSoonLevel.expanded}>
						<div class="coming-soon-placeholder">
							<div style="
								background: linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(120, 119, 198, 0.1) 100%);
								border: 2px dashed var(--primary-color);
								border-radius: 8px;
								text-align: center;
								color: var(--primary-color);
								font-size: 1.3rem;
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: center;
								min-height: 200px;
								gap: 1rem;
							">
								<img src="/icons/hourglass_empty.svg" alt="Coming Soon" class="icon" style="width: 3rem; height: 3rem; animation: pulse 2s ease-in-out infinite;">
								<div style="font-weight: 600;">Work in Progress</div>
								<div style="font-size: 0.9rem; color: var(--text-color-light);">Check back soon for the next level!</div>
							</div>
						</div>

						{#if comingSoonLevel.description}
							<div class="level-description">
								{@html comingSoonLevel.description}
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#each filteredLevels as level}
				<div class="level-card-container">
					<div 
						class="level-card" 
						role="button"
						tabindex="0"
						on:click={() => level.expanded = !level.expanded}
						on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { level.expanded = !level.expanded; e.preventDefault(); } }}
						style="cursor: pointer; border-radius: {level.expanded ? '0.75rem 0.75rem 0 0' : '0.75rem'}"
					>
						<div class="level-info">
							{#if level.secondary_icon}
								<div class="icon-container">
									<img src={level.icon} alt="Level Icon" class="level-icon" />
									<img src={level.secondary_icon} alt="Secondary Icon" class="level-icon-secondary" />
								</div>
							{:else}
								<img src={level.icon} alt="Level Icon" class="level-icon" />
							{/if}
							{level.title}
						</div>
						<div class="level-meta">
							<div>
								<img src="/icons/schedule.svg" alt="Duration" class="icon icon-small">Duration: {level.duration}
							</div>
							<div>
								<img src="/icons/event.svg" alt="Release date" class="icon icon-small">Released: {level.date}
							</div>
						</div>
					</div>

					<div class="level-expanded" class:open={level.expanded}>
						{#if level.bilibili_bvid}
							<div class="video-container">
								<iframe 
									src="https://player.bilibili.com/player.html?bvid={level.bilibili_bvid}&page=1&muted=false&high-quality=1&autoplay=0" 
									scrolling="no" 
									style="border: 0; margin: 0; padding: 0;"
									title="Level Preview"
									allowfullscreen>
								</iframe>
							</div>
						{:else}
							<div class="missing-video">
								<div style="
									background: rgba(255, 255, 255, 0.1);
									border: 2px dashed var(--border-color-dark);
									border-radius: 8px;
									text-align: center;
									color: var(--text-color-darkest);
									font-size: 1.1rem;
									display: flex;
									align-items: center;
									justify-content: center;
									min-height: 200px;
								">
									<img src="/icons/videocam_off.svg" alt="Video Missing" class="icon icon-large" style="margin-right: 0.5rem; width: 2rem; height: 2rem;">
									Video Missing
								</div>
							</div>
						{/if}

						{#if level.description}
							<div class="level-description">
								{@html level.description}
							</div>
						{/if}

						<div class="level-actions">
							{#if level.tuf_link}
								<a href={level.tuf_link} target="_blank" rel="noopener" class="link-button">
									<img src="/icons/open_in_new.svg" alt="Open" class="icon icon-inline">View Level on TUF Forums
								</a>
							{:else}
								<button class="link-button" disabled>
									<img src="/icons/open_in_new_off.svg" alt="Open" class="icon icon-inline">Level Still Uploading
								</button>
							{/if}

							{#if level.soundcloud_link}
								<a href={level.soundcloud_link} target="_blank" rel="noopener" class="link-button">
									<img src="/icons/music_note.svg" alt="Music" class="icon icon-inline">Listen on Soundcloud
								</a>
							{:else if level.youtube_link}
								<a href={level.youtube_link} target="_blank" rel="noopener" class="link-button">
									<img src="/icons/play_circle.svg" alt="Play" class="icon icon-inline">Watch on YouTube
								</a>
							{:else}
								<button class="link-button" disabled>
									<img src="/icons/open_in_new_off.svg" alt="Music" class="icon icon-inline">No Music Link Available
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}

			{#if legacyLevel}
				<a href={legacyLevel.link} target="_blank" rel="noopener" class="level-card-link">
					<div class="level-card legacy-level" data-date={legacyLevel.date}>
						<div class="level-info">
							<img src="/icons/{legacyLevel.icon}.svg" alt={legacyLevel.title} class="icon icon-large">
							{legacyLevel.title}
						</div>
						<div class="level-meta">
							<div>
								<img src="/icons/event.svg" alt="Release date" class="icon icon-small">Latest Release: {legacyLevel.date}
							</div>
							<div>Difficulty Varies From G2 - U6</div>
						</div>
					</div>
				</a>
			{/if}
		{/if}
	</main>

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