// src/ui/animations.js
export function animateSlideIn(element) {
  if (!element) {
    console.warn('animateSlideIn: Element is undefined');
    return;
  }
  element.style.display = 'block';
  element.classList.remove('slide-out');
  element.classList.add('slide-in');
}

export function animateSlideOut(element) {
  if (!element) {
    console.warn('animateSlideOut: Element is undefined');
    return;
  }
  element.classList.remove('slide-in');
  element.classList.add('slide-out');
  element.addEventListener('animationend', () => {
    element.style.display = 'none';
  }, { once: true });
  // Fallback: Force hide after 1 second if animation fails
  setTimeout(() => {
    element.style.display = 'none';
  }, 1000);
}

export function animateShake(element) {
  if (!element) {
    console.warn('animateShake: Element is undefined');
    return;
  }
  element.classList.add('shake');
}

export function animateDropIn(element) {
  if (!element) {
    console.warn('animateDropIn: Element is undefined');
    return;
  }
  element.style.display = 'block';
  element.classList.remove('drop-out');
  element.classList.add('drop-in');
}

export function animateDropOut(element) {
  if (!element) {
    console.warn('animateDropOut: Element is undefined');
    return;
  }
  element.classList.remove('drop-in');
  element.classList.add('drop-out');
  element.addEventListener('animationend', () => {
    element.style.display = 'none';
  }, { once: true });
  // Fallback: Force hide after 1 second if animation fails
  setTimeout(() => {
    element.style.display = 'none';
  }, 1000);
}