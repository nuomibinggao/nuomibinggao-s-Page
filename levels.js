// Default empty values
export let indieLevels = [];
export let plcrLevels = [];
export let legacyLevel = null;
export let comingSoonLevel = null;
export let levelsData = [];

// Promise that resolves when data is loaded
export const levelsLoaded = (async () => {
  try {
    const res = await fetch('https://melty-api.sicheng-guide.workers.dev/get-levels');
    const data = await res.json();

    indieLevels = data.indieLevels || [];
    plcrLevels = data.plcrLevels || [];
    legacyLevel = data.legacyLevel || null;
    comingSoonLevel = data.comingSoonLevel || null;
    levelsData = data.levelsData || [...indieLevels, ...plcrLevels];

    console.log('Levels loaded:', levelsData.length);
  } catch (err) {
    console.error('Failed to fetch levels:', err);
  }
})();
