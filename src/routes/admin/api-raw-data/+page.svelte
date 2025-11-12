<script lang="ts">
	import { title } from "process";

	let endpointName = '';
	let apiResponse = '';
	let error = '';
	let isHeaderScrolled = false;

	function handleScroll() {
		isHeaderScrolled = window.scrollY > 100;
	}

	async function fetchData() {
		if (!endpointName) {
			error = 'Please enter an endpoint name.';
			apiResponse = '';
			return;
		}

		try {
			const response = await fetch(`https://api.melty-studios.com/${endpointName}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				apiResponse = JSON.stringify(data, null, 2);
			} else {
				// Assume it's text (JavaScript, plain text, etc.)
				apiResponse = await response.text();
			}
			error = '';
		} catch (e: any) {
			error = e.message;
			apiResponse = '';
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			fetchData();
		}
	}
</script>

<svelte:head>
  <title>API Endpoint Raw Data Viewer | Melty Pages</title>
</svelte:head>

<svelte:window on:scroll={handleScroll} />

<div class="container" id="mainContainer" class:with-fixed-header={isHeaderScrolled}>
	<header id="mainHeader" class:scrolled={isHeaderScrolled}>
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">API Endpoint Raw Data Viewer</p>
			<nav class="nav">
				<a href="/admin">
					<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">Back to Admin Panel
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/data_object.svg" alt="API" class="icon icon-large">API Endpoint Requester</h2>
    <p><strong><img src="/icons/construction.svg" alt="Under Construction" class="icon icon-inline">This page is under construction, please come back later.</strong></p>
		<p>This is a debug tool for getting API requests by fetching data using code directly in the website.</p>
		<div>
			<a href="/admin" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">Back to Admin Panel
			</a>
		</div>
  </div>

	<div class="form-group">
		<div class="form-row">
			<input
				type="text"
				bind:value={endpointName}
				placeholder="e.g., 'get-levels'"
				on:keydown={handleKeyDown}
				class="form-control"
			/>
			<button on:click={fetchData} class="link-button">Fetch Data</button>
		</div>
	</div>

	{#if error}
		<div class="error-hint show">
			<strong>Error:</strong>
			{error}
		</div>
	{/if}

	{#if apiResponse}
		<div class="doc-section">
			<h2><img src="/icons/data_object.svg" alt="API" class="icon icon-large">API Response</h2>
			<pre class="code-example"><code class="response-code">{apiResponse}</code></pre>
		</div>
	{/if}
</div>
