<script lang="ts">
  import { onMount } from 'svelte';
  import { setupSplashText } from '$lib/splash';
  
  interface FormData {
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
  }
  
  interface LevelObject {
    title: string;
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
    category: 'indie'
  };
  
  let jsonOutput: string = '{}';
  let errorHint: string = '';
  let showError: boolean = false;
  let isSuccess: boolean = false;
  let shakeError: boolean = false;
  let successSubmit: boolean = false;
  let splashText: string = 'Loading...';
  
  onMount(() => {
    // Set today's date as default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    formData.date = `${yyyy}-${mm}-${dd}`;
    
    updatePreview();
    setupSplashText('splashText');
    setupScrollHeader();
  });
  
  function setupScrollHeader(): () => void {
    const handleScroll = (): void => {
      const header = document.querySelector('header');
      const container = document.querySelector('.container');
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        header?.classList.add('scrolled');
        container?.classList.add('with-fixed-header');
      } else {
        header?.classList.remove('scrolled');
        container?.classList.remove('with-fixed-header');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }
  
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
      title: formData.title,
      date: formData.date,
      duration: formData.duration,
      description: formData.description,
      icon: getIconUrl(formData.icon)
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
			displayError('Please fill in: Primary Icon URL');
			return;
		}
        if (getIconUrl(formData.icon) === null) {
            displayError('Invalid Primary Icon URL. Please use a valid difficulty (e.g., Q3, P1, Unranked).');
            return;
        }
        if (formData.secondary_icon && getIconUrl(formData.secondary_icon) === null) {
            displayError('Invalid Secondary Icon URL. Please use a valid difficulty (e.g., U14J).');
            return;
        }
        if (formData.tuf_link !== null && formData.tuf_link !== null && isNaN(Number(formData.tuf_link))) {
            displayError('Invalid TUF Forums Link. Please enter only numbers for the level ID.');
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
  
  function handleKeyPress(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      updateSplashText();
    }
  }
</script>

<svelte:head>
  <title>ADOFAI - Submit New Level</title>
  <link href="https://api.fontshare.com/css?f[]=chillax@400,700&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
  <header>
    <div class="header-content">
      <h1>Melty Pages</h1>
      <p class="subtitle">ADOFAI - Submit New Level</p>
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
      Submit New Custom Level
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
    <form id="levelForm" on:submit={handleSubmit} novalidate>
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
          <label for="icon">Primary Icon URL <span class="required">*</span></label>
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
          <label for="secondary_icon">Secondary Icon URL</label>
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
            type="url" 
            id="tuf_link" 
            bind:value={formData.tuf_link}
            on:input={handleInput}
            placeholder="e.g., 11050"
          >
          <small>The Level ID for the level on TUF Forums (tuforums.com/levels/<strong>11050</strong>)</small>
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
            on:change={handleInput}
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
            <pre id="jsonOutput">{jsonOutput}</pre>
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
      on:click={updateSplashText} 
      on:keypress={handleKeyPress}
      role="button" 
      tabindex="0"
    >
      {splashText}
    </div>
  </footer>
</div>
