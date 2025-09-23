import { indieLevels, legacyLevel } from './levels.js';

function createLevelCard(level) {
  const levelCardContainer = document.createElement('div');
  levelCardContainer.classList.add('level-card-container');

  const levelCard = document.createElement('div');
  levelCard.classList.add('level-card');
  levelCard.setAttribute('data-date', level.date);

  const levelInfo = document.createElement('div');
  levelInfo.classList.add('level-info');

  if (level.secondary_icon) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');

    const primaryIcon = document.createElement('img');
    primaryIcon.src = level.icon;
    primaryIcon.alt = 'Level Icon';
    primaryIcon.classList.add('level-icon');
    iconContainer.appendChild(primaryIcon);

    const secondaryIcon = document.createElement('img');
    secondaryIcon.src = level.secondary_icon;
    secondaryIcon.alt = 'Secondary Icon';
    secondaryIcon.classList.add('level-icon-secondary');
    iconContainer.appendChild(secondaryIcon);

    levelInfo.appendChild(iconContainer);
  } else {
    const icon = document.createElement('img');
    icon.src = level.icon;
    icon.alt = 'Level Icon';
    icon.classList.add('level-icon');
    levelInfo.appendChild(icon);
  }
  levelInfo.append(level.title);
  levelCard.appendChild(levelInfo);

  const levelMeta = document.createElement('div');
  levelMeta.classList.add('level-meta');
  levelMeta.innerHTML = `<div><span class="material-icons icon-small">access_time</span>Duration: ${level.duration}</div><div><span class="material-icons icon-small">event</span>Released: ${level.date}</div>`;
  levelCard.appendChild(levelMeta);

  levelCardContainer.appendChild(levelCard);

  const levelExpanded = document.createElement('div');
  levelExpanded.classList.add('level-expanded');

  if (level.bilibili_bvid) { // Only add video for levels with bilibili_bvid
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');
    videoContainer.innerHTML = `
      <iframe 
        src="https://player.bilibili.com/player.html?bvid=${level.bilibili_bvid}&page=1&muted=false&high-quality=1&autoplay=0" 
        scrolling="no" 
        border="0"
        frameborder="no" 
        framespacing="0" 
        allowfullscreen="true">
      </iframe>
    `;
    levelExpanded.appendChild(videoContainer);
  }

  if (level.description) { // Only add description if it exists
    const levelDescription = document.createElement('div');
    levelDescription.classList.add('level-description');
    levelDescription.innerHTML = level.description;
    levelExpanded.appendChild(levelDescription);
  }

  if (level.tuf_link || level.soundcloud_link) { // Only add actions if links exist
    const levelActions = document.createElement('div');
    levelActions.classList.add('level-actions');
    if (level.tuf_link) {
      levelActions.innerHTML += `<a href="${level.tuf_link}" target="_blank" rel="noopener" class="link-button"><span class="material-icons icon-inline">open_in_new</span>View Level on TUF Forums</a>`;
    }
    if (level.soundcloud_link) {
      levelActions.innerHTML += `<a href="${level.soundcloud_link}" target="_blank" rel="noopener" class="link-button"><span class="material-icons icon-inline">music_note</span>Listen on Soundcloud</a>`;
    }
    levelExpanded.appendChild(levelActions);
  }

  levelCardContainer.appendChild(levelExpanded);

  return levelCardContainer;
}

function createLegacyLevelCard(legacyLevel) {
  const levelCardLink = document.createElement('a');
  levelCardLink.href = legacyLevel.link;
  levelCardLink.target = '_blank';
  levelCardLink.rel = 'noopener';
  levelCardLink.classList.add('level-card-link');

  const levelCard = document.createElement('div');
  levelCard.classList.add('level-card', 'legacy-level');
  levelCard.setAttribute('data-date', legacyLevel.date);

  const levelInfo = document.createElement('div');
  levelInfo.classList.add('level-info');
  levelInfo.innerHTML = `<span class="material-icons icon-large">${legacyLevel.icon}</span>${legacyLevel.title}`;
  levelCard.appendChild(levelInfo);

  const levelMeta = document.createElement('div');
  levelMeta.classList.add('level-meta');
  levelMeta.innerHTML = `<span class="material-icons icon-small">event</span>${legacyLevel.meta}`;
  levelCard.appendChild(levelMeta);

  levelCardLink.appendChild(levelCard);
  return levelCardLink;
}

function renderLevels(levelsToRender) {
  const levelsList = document.getElementById('levelsList');
  levelsList.innerHTML = ''; // Clear existing levels
  levelsToRender.forEach(level => {
    levelsList.appendChild(createLevelCard(level));
  });
  levelsList.appendChild(createLegacyLevelCard(legacyLevel)); // Add legacy level at the end
  attachExpandCollapseListeners(); // Re-attach listeners after rendering
}

function attachExpandCollapseListeners() {
  const expandableContainers = document.querySelectorAll('.level-card-container');
  expandableContainers.forEach(container => {
    const card = container.querySelector('.level-card');
    const expandedSection = container.querySelector('.level-expanded');
    if (card && expandedSection) {
      card.style.cursor = 'pointer';
      card.onclick = function(e) { // Use onclick to avoid multiple event listeners
        e.preventDefault();
        expandedSection.classList.toggle('open');
        if (expandedSection.classList.contains('open')) {
          card.style.borderRadius = '0.75rem 0.75rem 0 0';
        } else {
          card.style.borderRadius = '0.75rem';
        }
      };
    }
  });
}

const sortSelect = document.getElementById('sortOptions');
const levelsList = document.getElementById('levelsList');
const levelSearch = document.getElementById('levelSearch');

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderLevels(indieLevels); // Render indie levels directly
  sortSelect.dispatchEvent(new Event('change')); // Trigger initial sort
});

sortSelect.addEventListener('change', () => {
  const option = sortSelect.value;
  let sortedLevels = [...indieLevels]; // Create copy of indie levels

  sortedLevels.sort((a, b) => {
    const aDate = a.date;
    const bDate = b.date;
    const aName = a.title.toLowerCase();
    const bName = b.title.toLowerCase();

    if (option === 'name-asc') {
      return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
    } else if (option === 'name-desc') {
      return bName.localeCompare(aName, undefined, { sensitivity: 'base' });
    } else if (option === 'date-asc') {
      return aDate.localeCompare(bDate);
    } else if (option === 'date-desc') {
      return bDate.localeCompare(aDate);
    }
    return 0;
  });
  renderLevels(sortedLevels);
});

levelSearch.addEventListener('input', () => {
  const query = levelSearch.value.toLowerCase();
  const filteredLevels = indieLevels.filter(level => {
    return level.title.toLowerCase().includes(query) || (level.description && level.description.toLowerCase().includes(query));
  });
  renderLevels(filteredLevels);
});