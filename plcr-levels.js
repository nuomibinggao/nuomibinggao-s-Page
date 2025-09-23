import { levelsData } from './levels.js';

function createLevelCard(level) {
  const levelCardLink = document.createElement('a');
  levelCardLink.href = level.tuf_link;
  levelCardLink.target = '_blank';
  levelCardLink.classList.add('level-card-link');

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
  levelMeta.innerHTML = `<span class="material-icons icon-small">access_time</span> Duration: ${level.duration} | <span class="material-icons icon-small">event</span> Released: ${level.date}`;
  levelCard.appendChild(levelMeta);

  levelCardLink.appendChild(levelCard);
  return levelCardLink;
}

function renderLevels(levelsToRender) {
  const levelsList = document.getElementById('levelsList');
  levelsList.innerHTML = ''; // Clear existing levels
  levelsToRender.forEach(level => {
    // Only render levels that have a bilibili_bvid property (i.e., not PLCR levels)
    // For plcr-levels.html, we only want to render the PLCR levels.
    // I will assume PLCR levels do NOT have a bilibili_bvid property.
    if (!level.bilibili_bvid) {
      levelsList.appendChild(createLevelCard(level));
    }
  });
}

const sortSelect = document.getElementById('sortOptions');
const levelSearch = document.getElementById('levelSearch');

document.addEventListener('DOMContentLoaded', () => {
  // Filter levelsData to only include PLCR levels for this page
  const plcrLevels = levelsData.filter(level => !level.bilibili_bvid);
  renderLevels(plcrLevels); // Render PLCR levels initially
  sortSelect.dispatchEvent(new Event('change')); // Trigger initial sort
});

sortSelect.addEventListener('change', () => {
  const option = sortSelect.value;
  let sortedLevels = levelsData.filter(level => !level.bilibili_bvid); // Filter for PLCR levels

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
  const filteredLevels = levelsData.filter(level => {
    // Filter for PLCR levels and then search within them
    return !level.bilibili_bvid && (level.title.toLowerCase().includes(query) || (level.description && level.description.toLowerCase().includes(query)));
  });
  renderLevels(filteredLevels);
});