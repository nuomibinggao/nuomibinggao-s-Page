<script lang="ts">
	import { onMount } from 'svelte';

	type Profile = {
		name: string;
		fileName: string;
		keyCount: number;
		icon: string;
		colors: {
			primary: string;
			secondary?: string;
			leftSecondary?: string;
			rightSecondary?: string;
		};
		noText?: boolean;
		colored?: boolean;
	};

	let profiles: Profile[] = [
		{
			name: '8K Profile',
			fileName: '8K.json',
			keyCount: 8,
			icon: 'keyboard',
			colors: {
				primary: '#FFFFFFFF'
			}
		},
		{
			name: '10K Profile',
			fileName: '10K.json',
			keyCount: 10,
			icon: 'keyboard',
			colors: {
				primary: '#FFFFFFFF',
				secondary: '#5F5F5FCC'
			}
		},
		{
			name: '12K Profile',
			fileName: '12K.json',
			keyCount: 12,
			icon: 'keyboard',
			colors: {
				primary: '#FFFFFFFF',
				secondary: '#5F5F5FCC'
			}
		},
		{
			name: '16K Profile',
			fileName: '16K.json',
			keyCount: 16,
			icon: 'keyboard',
			colors: {
				primary: '#FFFFFFFF',
				secondary: '#5F5F5FCC'
			}
		},
		{
			name: '16K Profile (No Text)',
			fileName: '16K No Text.json',
			keyCount: 16,
			icon: 'keyboard_keys',
			noText: true,
			colors: {
				primary: '#FFFFFFFF',
				secondary: '#5F5F5FCC'
			}
		},
		{
			name: '16K Profile (Color)',
			fileName: '16K Color.json',
			keyCount: 16,
			icon: 'palette',
			colored: true,
			colors: {
				primary: '#FFFFFFFF',
				leftSecondary: '#FFCCFFCC',
				rightSecondary: '#87CEFACC'
			}
		}
	];

	let filteredProfiles = [...profiles];
	let sortOption = 'keycount-desc';
	let searchQuery = '';
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

	function applySort() {
		const sorted = [...filteredProfiles].sort((a, b) => {
			if (sortOption === 'keycount-asc') {
				return a.keyCount - b.keyCount;
			} else if (sortOption === 'keycount-desc') {
				return b.keyCount - a.keyCount;
			}
			return 0;
		});
		filteredProfiles = sorted;
	}

	function handleSearch() {
		const query = searchQuery.toLowerCase();
		filteredProfiles = profiles.filter(profile => {
			const nameMatch = profile.name.toLowerCase().includes(query);
			const colorMatch = Object.values(profile.colors).some(color => 
				color && color.toLowerCase().includes(query)
			);
			return nameMatch || colorMatch;
		});
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
	<title>ADOFAI - KeyViewer Profiles Downloads | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">ADOFAI - KeyViewer Profiles</p>
			<nav class="nav">
				<a href="/adofai/kv/install">
					<img src="/icons/help.svg" alt="Help" class="icon icon-small">How to Install Profiles
				</a>
				<a href="https://www.fontshare.com/fonts/chillax" target="_blank" rel="noopener">
					<img src="/icons/download.svg" alt="Download" class="icon icon-small">Download Fonts
				</a>
				<a href="/adofai">
					<img src="/icons/arrow_back_ios_new.svg" alt="Home" class="icon icon-inline">Back to ADOFAI Hub
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/keyboard.svg" alt="Keyboard" class="icon icon-large">KeyViewer Profile Collection</h2>
		<p>This is the page for all my premade KeyViewer profiles, here you can download all of them.</p>
		<p>You can watch <a href="https://www.bilibili.com/video/BV1xRHZz7Eeq" target="_blank" rel="noopener">this video</a> for preview.</p>
		<div style="margin-top: 1rem;">
			<a href="/adofai/kv/install" class="link-button">
				<img src="/icons/help.svg" alt="Help" class="icon icon-small">How to Install Profiles
			</a>
			<a href="https://www.fontshare.com/fonts/chillax" target="_blank" rel="noopener" class="link-button">
				<img src="/icons/download.svg" alt="Download" class="icon icon-small">Download Fonts
			</a>
			<a href="/adofai" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Home" class="icon icon-inline">Back to ADOFAI Hub
			</a>
		</div>
	</div>

	<div class="search-bar">
		<input type="text" bind:value={searchQuery} placeholder="Search profiles..." />
	</div>

	<div class="sort-bar">
		<span>Sort By</span>
		<select bind:value={sortOption}>
			<option value="keycount-desc">Key Count (Highest First)</option>
			<option value="keycount-asc">Key Count (Lowest First)</option>
		</select>
	</div>

	<main class="list-view">
		{#each filteredProfiles as profile}
			<a href="/kv-files/{profile.fileName}" download class="level-card-link">
				<div class="level-card" data-name={profile.keyCount}>
					<div class="level-info">
						<img src="/icons/{profile.icon}.svg" alt={profile.name} class="icon icon-inline">{profile.name}
					</div>
					<div class="level-meta">
						Primary Color: <span class="hex-label" style="color: {profile.colors.primary}; background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">{profile.colors.primary}</span>
						{#if profile.colored}
							| Secondary Color: Left <span class="hex-label" style="color: {profile.colors.leftSecondary}; background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">{profile.colors.leftSecondary}</span>,
							Right <span class="hex-label" style="color: {profile.colors.rightSecondary}; background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">{profile.colors.rightSecondary}</span>
						{:else if profile.colors.secondary}
							| Secondary Color: <span class="hex-label" style="color: {profile.colors.secondary}; background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">{profile.colors.secondary}</span>
						{/if}
					</div>
				</div>
			</a>
		{/each}
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