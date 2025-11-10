<script lang="ts">
	import { onMount } from 'svelte';

	interface Level {
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
	}

	let levels: Level[] = [];
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
					// Extract the plcrLevels array from the JavaScript text
					const match = text.match(/export const plcrLevels = (\[[\s\S]*?\]);/);
					if (match && match[1]) {
						// Parse the array portion of the text
						const plcrLevels = JSON.parse(match[1]);
						if (Array.isArray(plcrLevels)) {
							levels = plcrLevels;
							filteredLevels = [...levels];
							applySort();
							loadError = null;
						} else {
							loadError = 'Invalid data format received';
							console.error('plcrLevels is not an array:', plcrLevels);
						}
					} else {
						loadError = 'Could not find levels data in response';
						console.error('Could not find plcrLevels in response');
					}
				} catch (error) {
					loadError = error instanceof Error ? error.message : 'Unknown error occurred';
					console.error('Error parsing levels data:', error);
					console.error('Response text:', text);
				}
				isLoading = false;
			})
			.catch(error => {
				console.error('Error loading levels:', error);
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
	<title>ADOFAI - Team Polychrome Custom Levels | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">ADOFAI - Team Polychrome Custom Levels</p>
			<nav class="nav">
				<a href="/adofai/levels/indie">
					<img src="/icons/person.svg" alt="Person" class="icon icon-inline">To Indie Levels Page
				</a>
				<a href="/adofai/about-plcr">
					<img src="/icons/groups_3.svg" alt="Team Page" class="icon icon-inline">Back to Team Page
				</a>
				<a href="/adofai">
					<img src="/icons/arrow_back_ios_new.svg" alt="Home" class="icon icon-inline">Back to ADOFAI Hub
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/groups_3.svg" alt="Groups" class="icon icon-large">Team Polychrome Level Collection</h2>
		<p>This is the custom levels page for our team. Here you can find all our carefully crafted levels, use the filters below to explore.</p>
		<p>You can also check out my indie levels.</p>
		<div style="margin-top: 1rem;">
			<a href="/adofai/levels/indie" class="link-button">
				<img src="/icons/person.svg" alt="Person" class="icon icon-inline">To Indie Levels Page
			</a>
			<a href="/adofai/about-plcr" class="link-button">
				<img src="/icons/groups_3.svg" alt="Team Page" class="icon icon-inline">About Our Team
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
		{:else if filteredLevels.length === 0}
			<div class="empty-message" style="text-align: center; padding: 2rem;">
				No levels found
			</div>
		{:else}
			{#each filteredLevels as level}
			<div class="level-card-container">
				<div 
					class="level-card" 
					role="button"
					tabindex="0"
					on:click={() => level.expanded = !level.expanded}
					on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { level.expanded = !level.expanded; e.preventDefault(); } }}
					style="cursor: pointer; border-radius: {level.expanded ? '24px 24px 0 0' : '24px'}"
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
		{/if}
	</main>

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