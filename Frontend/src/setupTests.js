// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Add process and CommonJS polyfills for browser environment
if (typeof window !== 'undefined') {
  // Process polyfill
  if (!window.process) {
    window.process = {
      env: {},
      version: '',
      platform: '',
      nextTick: (cb) => setTimeout(cb, 0),
    };
  }

  // CommonJS module system polyfills
  if (typeof module === 'undefined') {
    window.module = {
      exports: {}
    };
  }
  
  if (typeof exports === 'undefined') {
    window.exports = module.exports;
  }
}
