export function updateSplashText(element: HTMLElement | null) {
  if (!element) return;

  fetch('/splash.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(splashTexts => {
      if (Array.isArray(splashTexts) && splashTexts.length > 0) {
        const randomIndex = Math.floor(Math.random() * splashTexts.length);
        element.textContent = splashTexts[randomIndex];
      } else {
        element.textContent = 'Crafted with care';
      }
    })
    .catch(error => {
      console.error('Error loading or parsing splash texts:', error);
      element.textContent = 'Crafted with care';
    });
}

export function setupSplashText(elementId: string) {
  const splashElement = document.getElementById(elementId);
  if (splashElement) {
    updateSplashText(splashElement);
    splashElement.addEventListener('click', () => updateSplashText(splashElement));
  }
}
