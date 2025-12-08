<script lang="ts">
  import { onMount } from 'svelte';
  import { setupSplashText } from '$lib/splash';
  
  interface FormData {
    id: number | null;
    title: string;
    date: string;
    duration: string;
    description: string;
    icon: string;
    secondary_icon: string;
    bilibili_bvid: string;
    youtube_link: string;
    soundcloud_link: string;
    tuf_link: number | null;
    category: 'indie' | 'plcr';
    variation_of: number | null;
    variation_name: string | null;
  }
  
  interface LevelObject {
    id: number | null;
    title: string;
    variation_of?: number | null;
    variation_name?: string | null;
    date: string;
    duration: string;
    description: string;
    icon: string | null;
    secondary_icon?: string | null;
    bilibili_bvid?: string;
    youtube_link?: string;
    soundcloud_link?: string;
    tuf_link?: string;
  }
  
  let formData: FormData = {
    id: null,
    title: '',
    date: '',
    duration: '',
    description: '',
    icon: '',
    secondary_icon: '',
    bilibili_bvid: '',
    youtube_link: '',
    soundcloud_link: '',
    tuf_link: null,
    category: 'indie',
    variation_of: null,
    variation_name: ''
  };
  
  let latest_level_id: number = 0;
  let jsonOutput: string = '{}';
  let errorHint: string = '';
  let showError: boolean = false;
  let isSuccess: boolean = false;
  let shakeError: boolean = false;
  let successSubmit: boolean = false;
  let levelsResponseText: string = '';

  let selectedModifyCategory: 'indie' | 'plcr' | 'new' = 'new';
  let levelsForCategory: { id: number; title: string }[] = [];
  let selectedLevelId: number | null = null;

  async function fetchLevelsForCategory(category: 'indie' | 'plcr') {
    try {
      const response = await fetch(`https://api.melty-studios.com/get-levels/json/${category}`);
      if (response.ok) {
        levelsForCategory = await response.json();
        selectedLevelId = null; // Reset level selection
      } else {
        console.error(`Failed to fetch levels for category ${category}`);
        levelsForCategory = [];
      }
    } catch (error) {
      console.error(`Error fetching levels for category ${category}:`, error);
      levelsForCategory = [];
    }
  }

  function resetFormForNewLevel() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    // Default form data
    const defaultFormData = {
        id: null,
        title: '',
        date: `${yyyy}-${mm}-${dd}`,
        duration: '',
        description: '',
        icon: '',
        secondary_icon: '',
        bilibili_bvid: '',
        youtube_link: '',
        soundcloud_link: '',
        tuf_link: null,
        category: selectedModifyCategory === 'new' ? 'indie' : selectedModifyCategory,
        variation_of: null,
        variation_name: ''
    };

    formData = defaultFormData;

    // Only update ID if we are in "new level" mode
    if (selectedModifyCategory === 'new') {
        updateIdForCategory(formData.category);
    }
    updatePreview();
  }

  async function handleLevelSelectionChange() {
    if (selectedLevelId === null) {
        resetFormForNewLevel();
        return;
    }

    try {
      const response = await fetch(`https://api.melty-studios.com/get-level-by-id/${selectedModifyCategory as 'indie' | 'plcr'}/${selectedLevelId}`);
      if (response.ok) {
        const level: LevelObject = (await response.json()).level;
        
        const getDifficultyFromUrl = (url: string | null | undefined) => {
          if (!url) return '';
          const match = url.match(/icon\/([^/]+)\.png/);
          return match ? match[1] : '';
        };

        formData = {
          id: level.id,
          title: level.title,
          date: level.date,
          duration: level.duration,
          description: level.description,
          icon: getDifficultyFromUrl(level.icon),
          secondary_icon: getDifficultyFromUrl(level.secondary_icon),
          bilibili_bvid: level.bilibili_bvid || '',
          youtube_link: level.youtube_link || '',
          soundcloud_link: level.soundcloud_link || '',
          tuf_link: level.tuf_link ? Number(level.tuf_link.replace('https://tuforums.com/levels/', '')) : null,
          category: selectedModifyCategory as 'indie' | 'plcr',
          variation_of: level.variation_of || null,
          variation_name: level.variation_name || ''
        };
        updatePreview();
      } else {
        console.error(`Failed to fetch level details for ID ${selectedLevelId}`);
      }
    } catch (error) {
      console.error(`Error fetching level details for ID ${selectedLevelId}:`, error);
    }
  }

  function handleCategorySelectionChange() {
    if (selectedModifyCategory === 'new') {
        levelsForCategory = [];
        selectedLevelId = null; // Add this line
        resetFormForNewLevel();
    } else {
        fetchLevelsForCategory(selectedModifyCategory as 'indie' | 'plcr');
        resetFormForNewLevel();
    }
  }

  function updateIdForCategory(category: 'indie' | 'plcr') {
    if (selectedLevelId !== null) return;
    
    const levels = parseJsResponse(levelsResponseText) || {};
    const ids: number[] = [];
    if (Array.isArray(levels.indieLevels)) {
      for (const l of levels.indieLevels) ids.push(Number(l?.id || 0));
    }
    if (Array.isArray(levels.plcrLevels)) {
      for (const l of levels.plcrLevels) ids.push(Number(l?.id || 0));
    }
    const maxId = ids.length ? Math.max(...ids) : 0;
    if (maxId > 0) {
      latest_level_id = maxId;
      formData = { ...formData, id: latest_level_id + 1 };
    } else {
      formData = { ...formData, id: 1 };
    }
  }

  function handleCategoryChange() {
    if (selectedModifyCategory === 'new') {
        updateIdForCategory(formData.category);
    }
    updatePreview();
  }
  
  function parseJsResponse(text: string): any | null {
    if (!text) return null;
    // Try strict JSON first
    try {
      return JSON.parse(text);
    } catch (e) {}

    // Look for assignment/definition patterns like: export const indieLevels = [...] or var foo = {...};
    const assignMatch = text.match(/=[\s\n]*([\[{][\s\S]*[\]}])/);
    if (assignMatch && assignMatch[1]) {
      const candidate = assignMatch[1];
      try { return JSON.parse(candidate); } catch (e) {}
      try { return Function('"use strict"; return (' + candidate + ');')(); } catch (e) {}
    }

    // JSONP / callback style: callback({...});
    const callMatch = text.match(/^[^(]*\(\s*([\[{][\s\S]*[\]}])\s*\);?\s*$/m);
    if (callMatch && callMatch[1]) {
      const candidate = callMatch[1];
      try { return JSON.parse(candidate); } catch (e) {}
      try { return Function('"use strict"; return (' + candidate + ');')(); } catch (e) {}
    }

    // Fallback: extract first { ... } or [ ... ] block
    const firstObj = text.indexOf('{');
    const lastObj = text.lastIndexOf('}');
    if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
      const sub = text.slice(firstObj, lastObj + 1);
      try { return JSON.parse(sub); } catch (e) {}
      try { return Function('"use strict"; return (' + sub + ');')(); } catch (e) {}
    }

    const firstArr = text.indexOf('[');
    const lastArr = text.lastIndexOf(']');
    if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
      const sub = text.slice(firstArr, lastArr + 1);
      try { return JSON.parse(sub); } catch (e) {}
      try { return Function('"use strict"; return (' + sub + ');')(); } catch (e) {}
    }

    return null;
  }

  function extractFirstId(text: string, category: 'indie' | 'plcr'): number | null {
    if (!text) return null;
    const name = category === 'indie' ? 'indieLevels' : 'plcrLevels';

    // Try a direct export match first
    const exportToken = `export const ${name} = [`;
    let start = text.indexOf(exportToken);
    if (start === -1) {
      // Fallback to a looser match: const <name> = [
      const looseToken = `const ${name} = [`;
      start = text.indexOf(looseToken);
    }

    if (start !== -1) {
      const sub = text.slice(start);
      const idMatch = sub.match(/["']?id["']?\s*:\s*(\d+)/);
      if (idMatch && idMatch[1]) return Number(idMatch[1]);
    }

    // If no export block found, try a general search for the array name then id
    const generalMatch = text.match(new RegExp(`${name}\\s*=\\s*\\[`, 'm'));
    if (generalMatch && generalMatch.index !== undefined) {
      const sub = text.slice(generalMatch.index);
      const idMatch = sub.match(/["']?id["']?\s*:\s*(\d+)/);
      if (idMatch && idMatch[1]) return Number(idMatch[1]);
    }

    return null;
  }

  onMount(async () => {
    try {
      const [indieResponse, plcrResponse] = await Promise.all([
        fetch('https://api.melty-studios.com/get-levels/json/indie'),
        fetch('https://api.melty-studios.com/get-levels/json/plcr')
      ]);

      const indieLevels = indieResponse.ok ? await indieResponse.json() : [];
      const plcrLevels = plcrResponse.ok ? await plcrResponse.json() : [];

      const ids = [...indieLevels, ...plcrLevels].map(level => level.id);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;

      if (maxId > 0) {
        latest_level_id = maxId;
        formData = { ...formData, id: latest_level_id + 1 };
      } else {
        formData = { ...formData, id: 1 };
      }
    } catch (error) {
        console.error('Failed to fetch latest level ID:', error);
        formData = { ...formData, id: 1 };
    }

    if (selectedModifyCategory !== 'new') {
      fetchLevelsForCategory(selectedModifyCategory as 'indie' | 'plcr');
    }

    // Set today's date as default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    formData = { ...formData, date: `${yyyy}-${mm}-${dd}` };
    
    updatePreview();
    setupSplashText('splashText');
  });
  
  function getIconUrl(difficulty: string): string | null {
    if (!difficulty) return null;
    let iconName: string;
    let avaliableDifficulties = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20',
'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20',
'U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20',
'U1J', 'U2J', 'U3J', 'U4J', 'U5J', 'U6J', 'U7J', 'U8J', 'U9J', 'U10J', 'U11J', 'U12J', 'U13J', 'U14J', 'U15J', 'U16J', 'U17J', 'U18J', 'U19J', 'U20J',
'U15M',
'Q0', 'Q1', 'Q2', 'Q3', 'Q4', 'QQ',
'UNRANKED', '0', 'MARATHON', 'MA', 'GIMMICK', 'CENSORED', '-2', 'IMPOSSIBLE', '-21'];

    if (!avaliableDifficulties.includes(difficulty.toUpperCase())) {
      return null;
    } else{
      switch (difficulty.toUpperCase()) {
        case '0':
        case 'UNRANKED':
          iconName = 'Unranked.png';
          break;
        case 'MARATHON':
        case 'MA':
          iconName = 'MA.png';
          break;
        case 'GIMMICK':
          iconName = 'Gimmick.png';
          break;
        case '-2':
        case 'CENSORED':
          iconName = 'Censored.png';
          break;
        case '-21':
        case 'IMPOSSIBLE':
          iconName = 'Impossible.png';
          break;
        default:
          iconName = `${difficulty}.png`;
          break;
      }
    }

    return `https://api.tuforums.com/v2/media/image/icon/${iconName}`;
  }
  
  function generateLevelObject(): LevelObject {
    const levelObj: LevelObject = {
      id: formData.id,
      title: formData.title,
      variation_of: formData.variation_of,
      variation_name: formData.variation_name || null,
      date: formData.date,
      duration: formData.duration,
      description: formData.description,
      icon: getIconUrl(formData.icon),
    };

    if (formData.secondary_icon) {
      levelObj.secondary_icon = getIconUrl(formData.secondary_icon);
    }
    if (formData.bilibili_bvid) {
      levelObj.bilibili_bvid = formData.bilibili_bvid;
    }
    if (formData.youtube_link) {
      levelObj.youtube_link = formData.youtube_link;
    }
    if (formData.soundcloud_link) {
      levelObj.soundcloud_link = formData.soundcloud_link;
    }
    if (formData.tuf_link) {
      levelObj.tuf_link = `https://tuforms.com/levels/${formData.tuf_link}`;
    }
    
    // Clean up optional fields that are empty, so they don't appear in the JSON
    if (!levelObj.variation_of) delete levelObj.variation_of;
    if (!levelObj.variation_name) delete levelObj.variation_name;
    if (!levelObj.secondary_icon) delete levelObj.secondary_icon;
    if (!levelObj.bilibili_bvid) delete levelObj.bilibili_bvid;
    if (!levelObj.youtube_link) delete levelObj.youtube_link;
    if (!levelObj.soundcloud_link) delete levelObj.soundcloud_link;
    if (!levelObj.tuf_link) delete levelObj.tuf_link;

    return levelObj;
  }
  
  function updatePreview(): void {
    const levelObj = generateLevelObject();
    jsonOutput = JSON.stringify(levelObj, null, 2);
  }
  
  function handleInput(): void {
    updatePreview();
  }
  
	function displayError(message: string) {
		errorHint = message;
		showError = true;
		shakeError = true;
		setTimeout(() => {
			shakeError = false;
		}, 600);
		setTimeout(() => {
			showError = false;
			errorHint = '';
		}, 4000);
	}

  // Form validation
	function handleSubmit() {
		if (!formData.title) {
			displayError('Please fill in: Title');
			return;
		}
		if (!formData.date) {
			displayError('Please fill in: Release Date');
			return;
		}
		if (!formData.duration) {
			displayError('Please fill in: Duration');
			return;
		}
        const durationPattern = /^[0-9:?]+$/;
        if (!durationPattern.test(formData.duration)) {
            displayError('Invalid Duration format. Please use only numbers, colons, and question marks (e.g., 5:27, 1:??).');
            return;
        }
		if (!formData.description) {
			displayError('Please fill in: Description');
			return;
		}
		if (!formData.icon) {
			displayError('Please fill in: Primary Icon Name');
			return;
		}
        if (getIconUrl(formData.icon) === null) {
            displayError('Invalid Primary Icon Name. Please use a valid difficulty (e.g., Q3, P1, Unranked).');
            return;
        }
        if (formData.secondary_icon && getIconUrl(formData.secondary_icon) === null) {
            displayError('Invalid Secondary Icon Name. Please use a valid difficulty (e.g., U14J).');
            return;
        }
        if (formData.tuf_link !== null && formData.tuf_link !== null && isNaN(Number(formData.tuf_link))) {
            displayError('Invalid TUF Forums Link. Please enter only numbers for the level ID.');
            return;
        }
        if (formData.variation_of !== null && formData.variation_of !== null && isNaN(Number(formData.variation_of))) {
            displayError('Invalid Variation Of ID. Please enter only numbers for the level ID.');
            return;
        }
		
		const isVariationOfFilled = formData.variation_of !== null && formData.variation_of <= 0;
		const isVariationNameFilled = formData.variation_name !== null && formData.variation_name.trim() !== '';

		if (isVariationOfFilled !== isVariationNameFilled) {
			displayError('Both "Variation Of" and "Variation Name" must be filled if the level is a variation.');
			return;
		}

		if (!formData.category) {
			displayError('Please select a category for your level');
			return;
		}

		// Success feedback
		errorHint = 'Level submitted successfully! (Under construction)';
		isSuccess = true;
		showError = true;
		successSubmit = true;
		setTimeout(() => {
			errorHint = '';
			isSuccess = false;
			showError = false;
			successSubmit = false;
		}, 3000);

		// This is where you would typically send the data to a server (WIP)
		console.log('Submitting:', jsonOutput);
	}
</script>

<svelte:head>
  <title>ADOFAI - Modify Level Data</title>
</svelte:head>

<div class="container">
  <header>
    <div class="header-content">
      <h1>Melty Pages</h1>
      <p class="subtitle">ADOFAI - Modify Level Data</p>
      <nav class="nav">
        <a href="/admin">
          <img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">
          Back to Admin Panel
        </a>
      </nav>
    </div>
  </header>

  <div class="intro">
    <h2>
      <img src="/icons/upload.svg" alt="Upload" class="icon icon-large">
      Modify Level Data
    </h2>
    <p><strong><img src="/icons/construction.svg" alt="Under Construction" class="icon icon-inline">This page is under construction, please come back later.</strong></p>
    <p>Fill out this form to submit a new level to show on the website. Make sure to check critical information to avoid misinformation.</p>
    <div style="margin-top: 1rem;">
      <a href="/admin" class="link-button">
        <img src="/icons/arrow_back_ios_new.svg" alt="Back" class="icon icon-inline">
        Back to Admin Panel
      </a>
    </div>
  </div>

  <div class="upload-form">
    <form id="levelForm" on:submit|preventDefault={handleSubmit} novalidate>
      <!-- Level Selection -->
      <div class="form-section">
        <h3>Action</h3>
        <div class="form-group">
          <select id="modify-category" bind:value={selectedModifyCategory} on:change={handleCategorySelectionChange}>
            <option value="new">Upload New Level</option>
            <option value="indie">Modify Indie Level</option>
            <option value="plcr">Modify PLCR (Team Collab) Level</option>
          </select>
          <small>Select if you want to upload a new level or modify an existing one.</small>
        </div>
        
        {#if selectedModifyCategory !== 'new' && levelsForCategory.length > 0}
        <div class="form-group">
          <label for="level-select">Select Level</label>
          <select id="level-select" bind:value={selectedLevelId} on:change={handleLevelSelectionChange}>
            <option value={null}>-- Select a level --</option>
            {#each levelsForCategory as level}
              <option value={level.id}>ID: {level.id} | {level.title}</option>
            {/each}
          </select>
          <small>After selecting a level, the form below will be auto-filled.</small>
        </div>
        {/if}
      </div>

      <!-- Basic Information -->
      <div class="form-section">
        <h3>Basic Information</h3>
        
        <div class="form-group">
          <label for="title">Title <span class="required">*</span></label>
          <input 
            type="text" 
            id="title" 
            bind:value={formData.title}
            on:input={handleInput}
            required 
            placeholder="e.g., XH - Secret Malware"
          >
          <small>The full title of your level including artist name</small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Release Date <span class="required">*</span></label>
            <input 
              type="text" 
              id="date" 
              bind:value={formData.date}
              on:input={handleInput}
              required 
              placeholder="YYYY-MM-DD"
            >
            <small>When the level was released</small>
          </div>

          <div class="form-group">
            <label for="duration">Duration <span class="required">*</span></label>
            <input 
              type="text" 
              id="duration" 
              bind:value={formData.duration}
              on:input={handleInput}
              required 
              placeholder="e.g., 5:27"
            >
            <small>Length of the level (HH:MM:SS format)</small>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description <span class="required">*</span></label>
          <textarea 
            id="description" 
            bind:value={formData.description}
            on:input={handleInput}
            required 
            placeholder="Describe your level, include HTML tags for formatting"
          ></textarea>
          <small>Use HTML tags like &lt;p&gt; for paragraphs and &lt;a href="..."&gt; for links</small>
        </div>
      </div>

      <!-- Difficulty Icons -->
      <div class="form-section">
        <h3>Difficulty & Icons</h3>
        
        <div class="form-group">
          <label for="icon">Primary Icon Name <span class="required">*</span></label>
          <input 
            type="text" 
            id="icon" 
            bind:value={formData.icon}
            on:input={handleInput}
            required 
            placeholder="e.g., Q3"
          >
          <small>The difficulty name (PGU)</small>
        </div>

        <div class="form-group">
          <label for="secondary_icon">Secondary Icon Name</label>
          <input 
            type="text" 
            id="secondary_icon" 
            bind:value={formData.secondary_icon}
            on:input={handleInput}
            placeholder="e.g., U14J"
          >
          <small>(Optional) Admin average difficulty of a Q level (the small icon beside the main icon on TUF Forums)</small>
        </div>
      </div>

      <!-- Media Links -->
      <div class="form-section">
        <h3>Media & Links</h3>
        
        <div class="form-group">
          <label for="bilibili_bvid">Bilibili BVID</label>
          <input 
            type="text" 
            id="bilibili_bvid" 
            bind:value={formData.bilibili_bvid}
            on:input={handleInput}
            placeholder="e.g., BV1n6sEzNE2n"
          >
          <small>The BVID from Bilibili video URL (bilibili.com/video/<strong>BV1n6sEzNE2n</strong>)</small>
        </div>

        <div class="form-group">
          <label for="youtube_link">YouTube Link (For Music)</label>
          <input 
            type="url" 
            id="youtube_link" 
            bind:value={formData.youtube_link}
            on:input={handleInput}
            placeholder="https://www.youtube.com/watch?v=..."
          >
          <small>Full YouTube video URL</small>
        </div>

        <div class="form-group">
          <label for="soundcloud_link">Soundcloud Link</label>
          <input 
            type="url" 
            id="soundcloud_link" 
            bind:value={formData.soundcloud_link}
            on:input={handleInput}
            placeholder="https://soundcloud.com/..."
          >
          <small>Link to the song on Soundcloud</small>
        </div>

        <div class="form-group">
          <label for="tuf_link">TUF Forums Level ID</label>
          <input 
            type="number"
            id="tuf_link" 
            bind:value={formData.tuf_link}
            on:input={handleInput}
            placeholder="e.g., 11050"
          >
          <small>The Level ID for the level on TUF Forums (tuforums.com/levels/<strong>11050</strong>)</small>
        </div>
      </div>

      <!-- Variations -->
      <div class="form-section">
        <h3>Variations</h3>
        
        <div class="form-group">
          <label for="variation_of">Variation Of (Level ID)</label>
          <input 
            type="number" 
            id="variation_of" 
            bind:value={formData.variation_of}
            on:input={handleInput}
            placeholder="e.g., 7"
          >
          <small>If this level is a variation, enter the ID of the original level</small>
        </div>

        <div class="form-group">
          <label for="variation_name">Variation Name</label>
          <input 
            type="text" 
            id="variation_name" 
            bind:value={formData.variation_name}
            on:input={handleInput}
            placeholder="e.g., Nerfed"
          >
          <small>Name of this variation (e.g., "Nerfed", "EX")</small>
        </div>
      </div>

      <!-- Category Selection -->
      <div class="form-section">
        <h3>Category</h3>
        
        <div class="form-group">
          <label for="category">Level Category <span class="required">*</span></label>
          <select 
            id="category" 
            bind:value={formData.category}
            on:change={handleCategoryChange}
            required
          >
            <option value="indie">Indie / Custom Level (Solo work)</option>
            <option value="plcr">Team Polychrome Level (Collaborative)</option>
          </select>
          <small>Choose whether this is solo work or a collaboration</small>
        </div>
      </div>

      <!-- Submit Section -->
      <div class="form-section">
        <h3>Review & Submit</h3>
        <div class="preview-container">
          <div class="json-preview">
            <h4>Generated JSON</h4>
            <pre id="jsonOutput" style="white-space: pre-wrap;">{jsonOutput}</pre>
          </div>
        </div>
      </div>

      <div class="form-section">          
        <div class="submit-section">
          <button 
            type="submit" 
            class="submit-button"
            class:shake-error={shakeError}
            class:success-submit={successSubmit}
          >
            <img src="/icons/upload.svg" alt="Submit" class="icon icon-inline">
            Submit Level
          </button>
          <div 
            class="error-hint" 
            class:show={showError}
            class:success={isSuccess}
          >
            {errorHint}
          </div>
        </div>
      </div>
    </form>
  </div>

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
