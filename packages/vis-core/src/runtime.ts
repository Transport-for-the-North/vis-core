// One and only place that stores runtime config for the whole package.

let mapApiToken = '';

type Mode = 'production' | 'development' | '';

// Helper to safely get environment variables
// In Jest: uses global importMeta injected by jest.config.js  
// In Vite/runtime: uses import.meta.env (transformed by Babel)
declare const importMeta: any;
const env = typeof importMeta !== 'undefined' ? importMeta.env : {};

let runtimeEnv: {
  prodOrDev: Mode;
  apiBaseDomain: string;
  apiBaseDomainDev: string;
  appName: string;
} = {
  prodOrDev: (import.meta as any)?.env?.VITE_PROD_OR_DEV ?? '',
  apiBaseDomain: (import.meta as any)?.env?.VITE_API_BASE_DOMAIN ?? '',
  apiBaseDomainDev: (import.meta as any)?.env?.VITE_API_BASE_DOMAIN_DEV ?? '',
  appName: (import.meta as any)?.env?.VITE_APP_NAME ?? '',
};

// ---- setters / getters ----
export const setAppName = (v: string) => { runtimeEnv.appName = v || ''; };
export const getAppName = () => runtimeEnv.appName;

export const setMapApiToken = (v?: string) => { mapApiToken = v ?? ''; };
export const getMapApiToken = () => mapApiToken;

export const setProdOrDev = (v?: string) => {
  const s = (v ?? '').toLowerCase();
  runtimeEnv.prodOrDev = s.startsWith('prod') ? 'production' : s.startsWith('dev') ? 'development' : '';
};
export const getProdOrDev = (): Mode => runtimeEnv.prodOrDev;

export const setApiBaseDomain = (v?: string) => {
  runtimeEnv.apiBaseDomain = (v ?? '').replace(/\/+$/, '');
};
export const getApiBaseDomain = () => runtimeEnv.apiBaseDomain;

export const setApiBaseDomainDev = (v?: string) => {
  runtimeEnv.apiBaseDomainDev = (v ?? '').replace(/\/+$/, '');
};
export const getApiBaseDomainDev = () => runtimeEnv.apiBaseDomainDev;

// Optional tiny debug helper (remove later if you like)
export const __runtimeSnapshot = () => ({ ...runtimeEnv, mapApiToken });
