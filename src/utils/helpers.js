// src/utils/helpers.js
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function addClass Temporarily(element, className, duration) {
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), duration);
}