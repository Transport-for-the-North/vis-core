// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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
