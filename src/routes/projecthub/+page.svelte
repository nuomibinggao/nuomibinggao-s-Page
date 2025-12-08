<script lang="ts">
	import { onMount } from 'svelte';
	import { setupSplashText } from '$lib/splash';

	let projects = [
		{
			id: 'melty-pages',
			name: 'Melty Pages',
			icon: 'web.svg',
			date: '2025-10-23',
			tags: ['HTML 5', 'CSS', 'JavaScript', 'Svelte'],
			description: 'The source code of this website, licensed under the <a href="https://opensource.org/license/mit" target="_blank" rel="noopener">MIT License</a>, so it\'s free to use if you provide credit.',
			links: [
				{
					href: 'https://github.com/nuomibinggao/Melty-Pages',
					text: 'GitHub',
					icon: 'code.svg',
					class: 'github-button'
				}
			]
		},
		{
			id: 'melty-api',
			name: 'Melty API',
			icon: 'web.svg',
			date: '2025-10-23',
			tags: ['JavaScript'],
			description: 'A Cloudflare worker that acts as the backend for the Melty Pages (this) website, it connects to a D1 database on Cloudflare for storage, and is licensed under the <a href="https://opensource.org/license/mit" target="_blank" rel="noopener">MIT License</a>, so it\'s free to use if you provide credit.',
			links: [
				{
					href: 'https://github.com/nuomibinggao/Melty-API',
					text: 'GitHub',
					icon: 'code.svg',
					class: 'github-button'
				},
				{
					href: '/api-docs',
					text: 'API Documentation',
					icon: 'article_person.svg'
				}
			]
		},
		{
			id: 'vanyllia',
			name: 'Vanyllia Modpack',
			icon: 'extension.svg',
			date: '2025-08-17',
			tags: ['Minecraft'],
			description: 'A Minecraft modpack focusing on improving vanilla features and performance optimization while maintaining the core gameplay experience.',
			links: [
				{
					href: 'https://modrinth.com/modpack/vanyllia',
					text: 'Modrinth',
					icon: 'sports_esports.svg',
					class: 'modrinth-button'
				}
			]
		},
		{
			id: 'learning-docs',
			name: 'Learning Docs',
			icon: 'article_person.svg',
			date: '2025-10-15',
			tags: ['Markdown'],
			description: 'Collection of my personal learning documents covering various topics and technologies. The documents will update as I learn more.',
			links: [
				{
					href: '/docs',
					text: 'View Documents',
					icon: 'article_person.svg'
				}
			]
		}
	];

	let filteredProjects = [...projects];
	let activeFilters = ['all'];
	let searchTerm = '';
	let sortOption = 'date-desc';
	// Keep track of splash texts
	let splashTexts: string[] = [];

	const allTags = [...new Set(projects.flatMap(p => p.tags))];

	function applyFilters() {
		let tempProjects = [...projects];

		// Filter by tags
		if (!activeFilters.includes('all')) {
			tempProjects = tempProjects.filter(p => 
				activeFilters.some(f => p.tags.includes(f))
			);
		}

		// Filter by search term
		if (searchTerm) {
			const lowerCaseSearch = searchTerm.toLowerCase();
			tempProjects = tempProjects.filter(p => 
				p.name.toLowerCase().includes(lowerCaseSearch) ||
				p.description.toLowerCase().includes(lowerCaseSearch)
			);
		}

		// Sort
		switch (sortOption) {
			case 'date-desc':
				tempProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
				break;
			case 'date-asc':
				tempProjects.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				break;
			case 'name-asc':
				tempProjects.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'name-desc':
				tempProjects.sort((a, b) => b.name.localeCompare(a.name));
				break;
		}

		filteredProjects = tempProjects;
	}

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



	onMount(() => {
		const fetchData = async () => {
			try {
				const [pagesRes, apiRes] = await Promise.all([
					fetch('https://api.github.com/repos/nuomibinggao/Melty-Pages/commits'),
					fetch('https://api.github.com/repos/nuomibinggao/Melty-API/commits')
				]);

				// Create a copy of projects to modify
				let updatedProjects = [...projects];

				if (pagesRes.ok) {
					const commits = await pagesRes.json();
					// Check if we have the data structure we expect
					if (Array.isArray(commits) && commits.length > 0 && 
					    commits[0].commit && commits[0].commit.committer && commits[0].commit.committer.date) {
						const latestCommitDate = new Date(commits[0].commit.committer.date).toISOString().split('T')[0];
						// Find the project and update its date
						const projectIndex = updatedProjects.findIndex(p => p.id === 'melty-pages');
						if (projectIndex !== -1) {
							updatedProjects[projectIndex] = {
								...updatedProjects[projectIndex],
								date: latestCommitDate
							};
						}
					} else {
						console.warn('Unexpected response structure for Melty-Pages commits:', commits);
					}
				} else {
					console.warn('Failed to fetch commits for Melty-Pages:', pagesRes.status, pagesRes.statusText);
				}

				if (apiRes.ok) {
					const commits = await apiRes.json();
					// Check if we have the data structure we expect
					if (Array.isArray(commits) && commits.length > 0 && 
					    commits[0].commit && commits[0].commit.committer && commits[0].commit.committer.date) {
						const latestCommitDate = new Date(commits[0].commit.committer.date).toISOString().split('T')[0];
						// Find the project and update its date
						const projectIndex = updatedProjects.findIndex(p => p.id === 'melty-api');
						if (projectIndex !== -1) {
							updatedProjects[projectIndex] = {
								...updatedProjects[projectIndex],
								date: latestCommitDate
							};
						}
					} else {
						console.warn('Unexpected response structure for Melty-API commits:', commits);
					}
				} else {
					console.warn('Failed to fetch commits for Melty-API:', apiRes.status, apiRes.statusText);
				}
				
				// Update projects array and trigger filters
				projects = updatedProjects;
				applyFilters(); // Explicitly trigger filter update
			} catch (error) {
				console.error('Error fetching latest commit dates:', error);
			}
			
			setupSplashText('splashText');
		};

		fetchData();

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

    // Re-run filters when projects, searchTerm, or sortOption changes
    $: {
        if (projects) {
            applyFilters();
        }
    }

</script>

<svelte:head>
	<title>Projects Hub | Melty Pages</title>
</svelte:head>

<div class="container" id="mainContainer">
	<header id="mainHeader">
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">Projects Hub</p>
			<nav class="nav">
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/folder.svg" alt="Folder" class="icon icon-large">Project Collection</h2>
		<p>Welcome to my projects hub! Here you'll find all my coding projects, custom levels, and creative works. Use the filters and search below to explore different categories.</p>
		<div style="margin-top: 1rem;">
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
			</a>
		</div>
	</div>

	<div class="filters">
		<button on:click={() => toggleFilter('all')} class:active={activeFilters.includes('all')}>All Projects</button>
		{#each allTags as tag}
			<button on:click={() => toggleFilter(tag)} class:active={activeFilters.includes(tag)}>{tag}</button>
		{/each}
	</div>

	<div class="controls">
		<div class="search-section">
			<input type="text" bind:value={searchTerm} placeholder="Search projects..." />
			<label for="sortOptions">Sort by:</label>
			<select bind:value={sortOption} id="sortOptions">
				<option value="date-desc">Date (Newest First)</option>
				<option value="date-asc">Date (Oldest First)</option>
				<option value="name-asc">Name (A-Z)</option>
				<option value="name-desc">Name (Z-A)</option>
			</select>
		</div>
	</div>

	<main class="grid" id="projectsGrid">
		{#each filteredProjects as project (project.id)}
			<div class="card">
				<h2><img src="/icons/{project.icon}" alt={project.name} class="icon icon-inline">{project.name}</h2>
				<div class="date">{project.date}</div>
				<div class="tags">
					{#each project.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
				<p>{@html project.description}</p>
				<div class="links">
					{#each project.links as link}
						<a href={link.href} target={link.href.startsWith('http') ? '_blank' : ''} rel="noopener" class="link-button {link.class || ''}">
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
