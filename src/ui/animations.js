// src/ui/animations.js
export function animateShake(element) {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), 200);
}

export function animateSlideIn(element) {
  element.classList.add('slide-in');
}

export function animateSlideOut(element) {
  element.classList.add('slide-out');
  setTimeout(() => {
    element.style.display = 'none';
    element.classList.remove('slide-in', 'slide-out');
  }, 500);
}

export function animateDropIn(element) {
  element.classList.add('drop-in');
  setTimeout(() => element.classList.remove('drop-in'), 500);
}

export function animateDropOut(element) {
  element.classList.add('drop-out');
  setTimeout(() => {
    element.style.display = 'none';
    element.classList.remove('drop-out');
  }, 500);
}