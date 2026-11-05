import '@testing-library/jest-dom';
import '../i18n';

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}

window.IntersectionObserver = window.IntersectionObserver || MockIntersectionObserver;
global.IntersectionObserver = global.IntersectionObserver || MockIntersectionObserver;

if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
