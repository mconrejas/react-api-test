import "@testing-library/jest-dom";

// Mock `window.matchMedia` to prevent errors in tests
global.window.matchMedia = global.window.matchMedia || function () {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  };
};
