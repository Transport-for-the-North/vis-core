// packages/vis-core/src/index.ts
export * as Components from './Components';
export * as contexts from './contexts';
export * as hocs from './hocs';
export * as hooks from './hooks';
export * as layouts from './layouts';
export * as reducers from './reducers';
export * as services from './services';
export * as utils from './utils';

export { setMapApiToken, setProdOrDev, setApiBaseDomain, setApiBaseDomainDev } from './defaults';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';


// tiny sanity export
export const helloFromCore = () => "Hello from vis-core";

// example shared component
export function CoreButton({ children }: { children: React.ReactNode }) {
  return <button style={{ padding: 8, borderRadius: 6 }}>{children}</button>;
}