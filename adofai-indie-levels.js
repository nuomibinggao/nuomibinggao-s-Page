import { comingSoonLevel, indieLevels, legacyLevel } from './adofai-levels.js';
function createComingSoonCard() {
  const levelCardContainer = document.createElement('div');
  levelCardContainer.classList.add('level-card-container', 'coming-soon-container');

  const levelCard = document.createElement('div');
  levelCard.classList.add('level-card', 'coming-soon-card');

  const levelInfo = document.createElement('div');
  levelInfo.classList.add('level-info');
  
  const icon = document.createElement('img');
  icon.src = comingSoonLevel.icon;
  icon.alt = 'Coming Soon';
  icon.classList.add('level-icon', 'coming-soon-icon');
  levelInfo.appendChild(icon);
  
  const titleSpan = document.createElement('span');
  titleSpan.textContent = comingSoonLevel.title;
  levelInfo.appendChild(titleSpan);
  
  levelCard.appendChild(levelInfo);

  const levelMeta = document.createElement('div');
  levelMeta.classList.add('level-meta');
  levelMeta.innerHTML = `
    <div><img src="icons/schedule.svg" alt="Duration" class="icon icon-small">Duration: ${comingSoonLevel.duration}</div>
    <div><img src="icons/event.svg" alt="Release date" class="icon icon-small">Released: ${comingSoonLevel.date}</div>
  `;
  levelCard.appendChild(levelMeta);

  levelCardContainer.appendChild(levelCard);

  const levelExpanded = document.createElement('div');
  levelExpanded.classList.add('level-expanded');

  const placeholderContainer = document.createElement('div');
  placeholderContainer.classList.add('coming-soon-placeholder');
  placeholderContainer.innerHTML = `
    <div style="
      background: linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(120, 119, 198, 0.1) 100%);
      border: 2px dashed var(--primary-color);
      border-radius: 8px;
      text-align: center;
      color: var(--primary-color);
      font-size: 1.3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      gap: 1rem;
    ">
      <img src="icons/hourglass_empty.svg" alt="Coming Soon" class="icon" style="width: 3rem; height: 3rem; animation: pulse 2s ease-in-out infinite;">
      <div style="font-weight: 600;">Work in Progress</div>
      <div style="font-size: 0.9rem; color: var(--text-color-light);">Check back soon for the next level!</div>
    </div>
  `;
  levelExpanded.appendChild(placeholderContainer);

  if (comingSoonLevel.description) {
    const levelDescription = document.createElement('div');
    levelDescription.classList.add('level-description');
    levelDescription.innerHTML = comingSoonLevel.description;
    levelExpanded.appendChild(levelDescription);
  }

  levelCardContainer.appendChild(levelExpanded);

  return levelCardContainer;
}

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
  levelMeta.innerHTML = `<div><img src="icons/schedule.svg" alt="Duration" class="icon icon-small">Duration: ${level.duration}</div><div><img src="icons/event.svg" alt="Release date" class="icon icon-small">Released: ${level.date}</div>`;
  levelCard.appendChild(levelMeta);

  levelCardContainer.appendChild(levelCard);

  const levelExpanded = document.createElement('div');
  levelExpanded.classList.add('level-expanded');

  if (level.bilibili_bvid) {
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
  } else {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('missing-video');
    videoContainer.innerHTML = `
      <div style="
        background: rgba(255, 255, 255, 0.1);
        border: 2px dashed var(--border-color-dark);
        border-radius: 8px;
        text-align: center;
        color: var(--text-color-darkest);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      ">
        <img src="icons/videocam_off.svg" alt="Video Missing" class="icon icon-large" style="margin-right: 0.5rem; width: 2rem; height: 2rem;">
        Video Missing
      </div>
    `;
    levelExpanded.appendChild(videoContainer);
  }

  if (level.description) {
    const levelDescription = document.createElement('div');
    levelDescription.classList.add('level-description');
    levelDescription.innerHTML = level.description;
    levelExpanded.appendChild(levelDescription);
  }

  const levelActions = document.createElement('div');
  levelActions.classList.add('level-actions');

  if (level.tuf_link) {
    const tufButton = document.createElement('a');
    tufButton.href = level.tuf_link;
    tufButton.target = '_blank';
    tufButton.rel = 'noopener';
    tufButton.classList.add('link-button');
    tufButton.innerHTML = `<img src="icons/open_in_new.svg" alt="Open" class="icon icon-inline">View Level on TUF Forums`;
    levelActions.appendChild(tufButton);
  } else {
    const tufButton = document.createElement('button');
    tufButton.classList.add('link-button');
    tufButton.disabled = true;
    tufButton.innerHTML = `<img src="icons/open_in_new_off.svg" alt="Open" class="icon icon-inline">Level Still Uploading`;
    levelActions.appendChild(tufButton);
  }

  if (level.soundcloud_link) {
    const musicButton = document.createElement('a');
    musicButton.href = level.soundcloud_link;
    musicButton.target = '_blank';
    musicButton.rel = 'noopener';
    musicButton.classList.add('link-button');
    musicButton.innerHTML = `<img src="icons/music_note.svg" alt="Music" class="icon icon-inline">Listen on Soundcloud`;
    levelActions.appendChild(musicButton);
  } else if (level.youtube_link) {
    const musicButton = document.createElement('a');
    musicButton.href = level.youtube_link;
    musicButton.target = '_blank';
    musicButton.rel = 'noopener';
    musicButton.classList.add('link-button');
    musicButton.innerHTML = `<img src="icons/play_circle.svg" alt="Play" class="icon icon-inline">Watch on YouTube`;
    levelActions.appendChild(musicButton);
  } else {
    const musicButton = document.createElement('button');
    musicButton.classList.add('link-button');
    musicButton.disabled = true;
    musicButton.innerHTML = `<img src="icons/open_in_new_off.svg" alt="Music" class="icon icon-inline">No Music Link Avaliable`;
    levelActions.appendChild(musicButton);
  }

  levelExpanded.appendChild(levelActions);

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
  levelInfo.innerHTML = `<img src="icons/${legacyLevel.icon}.svg" alt="${legacyLevel.title}" class="icon icon-large">${legacyLevel.title}`;
  levelCard.appendChild(levelInfo);

  const levelMeta = document.createElement('div');
  levelMeta.classList.add('level-meta');
  levelMeta.innerHTML = `
    <div><img src="icons/event.svg" alt="Release date" class="icon icon-small">Latest Release: ${legacyLevel.date}</div>
    <div>Difficulty Varies From G2 - U6</div>`;
  levelCard.appendChild(levelMeta);

  levelCardLink.appendChild(levelCard);
  return levelCardLink;
}

function renderLevels(levelsToRender) {
  const levelsList = document.getElementById('levelsList');
  levelsList.innerHTML = '';
  
  // Always add coming soon card at the top
  levelsList.appendChild(createComingSoonCard());
  
  // Add regular levels
  levelsToRender.forEach(level => {
    levelsList.appendChild(createLevelCard(level));
  });
  
  // Add legacy level at the end
  levelsList.appendChild(createLegacyLevelCard(legacyLevel));
  
  attachExpandCollapseListeners();
}

function attachExpandCollapseListeners() {
  const expandableContainers = document.querySelectorAll('.level-card-container');
  expandableContainers.forEach(container => {
    const card = container.querySelector('.level-card');
    const expandedSection = container.querySelector('.level-expanded');
    if (card && expandedSection) {
      card.style.cursor = 'pointer';
      card.onclick = function(e) {
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

document.addEventListener('DOMContentLoaded', () => {
  renderLevels(indieLevels);
  sortSelect.dispatchEvent(new Event('change'));
});

sortSelect.addEventListener('change', () => {
  const option = sortSelect.value;
  let sortedLevels = [...indieLevels];

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