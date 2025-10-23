// Indie/Custom Levels - Solo work with videos
export let indieLevels = [];

// PLCR/Team Levels - Collaborative work
export let plcrLevels = [];

// Legacy level data
export let legacyLevel = null;

// Coming soon level
export let comingSoonLevel = null;

// Backward compatibility - combined data (deprecated, use separate arrays above)
export let levelsData = [];

// Fetch data from API
async function fetchLevels() {
  try {
    const response = await fetch('https://melty-api.sicheng-guide.workers.dev/get-levels');
    const text = await response.text();
    
    // Create a function from the returned JavaScript code and execute it
    const moduleFunction = new Function(`{ ${text}; return { indieLevels, plcrLevels, legacyLevel, comingSoonLevel, levelsData }; }`);
    const data = moduleFunction();
    
    // Update exported values
    indieLevels = data.indieLevels || [];
    plcrLevels = data.plcrLevels || [];
    legacyLevel = data.legacyLevel || null;
    comingSoonLevel = data.comingSoonLevel || null;
    levelsData = data.levelsData || [...indieLevels, ...plcrLevels];
  } catch (error) {
    console.error('Failed to fetch level data:', error);
    // Keep the default empty values
  }
}

// Start fetching data immediately
fetchLevels();

// For backward compatibility with existing imports
export { indieLevels, plcrLevels, legacyLevel, comingSoonLevel, levelsData };
