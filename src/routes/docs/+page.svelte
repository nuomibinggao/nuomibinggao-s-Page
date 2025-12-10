<script lang="ts">
	import { onMount } from 'svelte';
	import { setupSplashText } from '$lib/splash';

	interface Document {
		id: string;
		title: string;
		icon: string;
		date: string;
		tags: string[];
		description: string;
		links: {
			href: string;
			text: string;
			icon: string;
			download?: boolean | string;
		}[];
	}

	let documents: Document[] = [
		{
			id: 'rust-docs',
			title: 'Rust Programming Notes',
			icon: 'github_icon.svg',
			date: '2025-10-15',
			tags: ['Rust'],
			description: 'Personal notes for learning the <a href="https://rust-lang.org" target="_blank" rel="noopener">Rust</a> Programming Language.',
			links: [
				{
					href: '/docs/rust-learning-docs/',
					text: 'Read Document',
					icon: 'article_person.svg'
				},
				{
					href: '/md-docs/rust-learning-docs/rust-learning-docs.md',
					text: 'Download Document',
					icon: 'download.svg',
					download: 'rust-learning-docs.md'
				}
			]
		}
	];

	const allTags = [...new Set(documents.flatMap(doc => doc.tags))];
	let activeFilters = ['all'];
	let searchTerm = '';
	let sortOption = 'date-desc';
	let filteredDocuments = [...documents];

	function toggleFilter(tag: string) {
		if (tag === 'all') {
			activeFilters = ['all'];
		} else {
			if (activeFilters.includes('all')) {
				activeFilters = [tag];
			} else {
				if (activeFilters.includes(tag)) {
					activeFilters = activeFilters.filter(f => f !== tag);
					if (activeFilters.length === 0) {
						activeFilters = ['all'];
					}
				} else {
					activeFilters = [...activeFilters, tag];
				}
			}
		}
		applyFilters();
	}

	function applyFilters() {
		let tempDocs = [...documents];

		// Filter by tags
		if (!activeFilters.includes('all')) {
			tempDocs = tempDocs.filter(doc => 
				activeFilters.some(f => doc.tags.includes(f))
			);
		}

		// Filter by search term
		if (searchTerm) {
			const lowerCaseSearch = searchTerm.toLowerCase();
			tempDocs = tempDocs.filter(doc => 
				doc.title.toLowerCase().includes(lowerCaseSearch) ||
				doc.description.toLowerCase().includes(lowerCaseSearch)
			);
		}

		// Sort
		switch (sortOption) {
			case 'date-desc':
				tempDocs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
				break;
			case 'date-asc':
				tempDocs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				break;
			case 'name-asc':
				tempDocs.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'name-desc':
				tempDocs.sort((a, b) => b.title.localeCompare(a.title));
				break;
		}

		filteredDocuments = tempDocs;
	}

	onMount(() => {
		setupSplashText('splashText');

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

	$: {
		if (documents) {
			applyFilters();
		}
	}
</script>

<svelte:head>
	<title>Learning Documents | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">Learning Documents</p>
			<nav class="nav">
				<a href="/projecthub">
					<img src="/icons/arrow_back_ios_new.svg" alt="Arrow back" class="icon icon-inline">Back to Hub
				</a>
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/article_person.svg" alt="Article" class="icon icon-large">Document Collection</h2>
		<p>Welcome to my collection of learning documents! Here you'll find documentation I've created to help understand various technologies and concepts.</p>
		<div style="margin-top: 1rem;">
			<a href="/projecthub" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Arrow back" class="icon icon-inline">Back to Hub
			</a>
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
			</a>
		</div>
	</div>

	<div class="filters">
		<button 
			on:click={() => toggleFilter('all')} 
			class:active={activeFilters.includes('all')}
		>All</button>
		{#each allTags as tag}
			<button 
				on:click={() => toggleFilter(tag)} 
				class:active={activeFilters.includes(tag)}
			>{tag}</button>
		{/each}
	</div>

	<div class="controls">
		<div class="search-section">
			<input type="text" bind:value={searchTerm} placeholder="Search documents..." />
			<label for="sortOptions">Sort by:</label>
			<select bind:value={sortOption} id="sortOptions">
				<option value="date-desc">Date (Newest First)</option>
				<option value="date-asc">Date (Oldest First)</option>
				<option value="name-asc">Name (A-Z)</option>
				<option value="name-desc">Name (Z-A)</option>
			</select>
		</div>
	</div>

	<main class="grid" id="docsGrid">
		{#each filteredDocuments as doc (doc.id)}
			<div class="card">
				<h2>
					<img src="/icons/{doc.icon}" alt={doc.title} class="icon icon-inline">{doc.title}
				</h2>
				<div class="date">{doc.date}</div>
				<div class="tags">
					{#each doc.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
				<p>{@html doc.description}</p>
				<div class="links">
					{#each doc.links as link}
						<a 
							href={link.href}
							class="link-button"
							download={link.download}
						>
							<img src="/icons/{link.icon}" alt={link.text} class="icon icon-inline">{link.text}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</main>

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