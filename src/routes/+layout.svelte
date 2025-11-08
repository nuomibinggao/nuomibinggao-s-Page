<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://api.fontshare.com/css?f[]=chillax@400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="style-v2.css">
</svelte:head>

{@render children()}