// Add process polyfill for browser environment
import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';

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
