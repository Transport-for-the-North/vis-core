// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback([
      {
        target,
        contentRect: {
          width: 800,
          height: 600,
        },
      },
    ]);
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  get() {
    return 800;
  },
});

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  get() {
    return 600;
  },
});

if (!HTMLElement.prototype.getBoundingClientRect) {
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

// Mock import.meta for Jest
global.importMeta = {
  env: {
    VITE_APP_NAME: 'test-app',
    VITE_AUTH0_DOMAIN: 'test.auth0.com',
    VITE_AUTH0_CLIENT_ID: 'test-client-id',
    VITE_AUTH0_CALLBACK_URL: 'http://localhost:3000/callback',
    VITE_AUTH0_AUDIENCE: 'test-audience',
    VITE_PUBLIC_URL: '/',
    VITE_APP_MAP_API_TOKEN: 'test-token',
    VITE_PROD_OR_DEV: 'development',
  }
};

jest.mock('maplibre-gl', () => {
  class Popup {
    constructor(options) {
      this.options = options;
      this.remove = jest.fn(() => this);
    }
    setLngLat(coords) {
      this.coords = coords;
      return this;
    }
    setHTML(html) {
      this.html = html;
      return this;
    }
    addTo(map) {
      this.map = map;
      return this;
    }
  }

  class LngLatBounds {
    constructor() {
      this.bounds = [];
    }
    extend(coord) {
      this.bounds.push(coord);
      return this;
    }
    getNorthEast() {
      return { lng: 1, lat: 1 };
    }
    getSouthWest() {
      return { lng: -1, lat: -1 };
    }
  }

  const Map = jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    setStyle: jest.fn(),
    flyTo: jest.fn(),
    isStyleLoaded: jest.fn(() => true),
    getLayer: jest.fn(() => true),
    getZoom: jest.fn(() => 10),
  }));

  const api = { Popup, LngLatBounds, Map };

  return {
    __esModule: true,
    default: api,   // supports: import maplibregl from 'maplibre-gl'
    ...api,         // supports: import { Map } from 'maplibre-gl' AND import * as maplibregl ...
  };
});

