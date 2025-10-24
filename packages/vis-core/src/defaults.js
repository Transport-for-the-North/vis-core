let mapApiToken = '';

export const setMapApiToken = (token) => {
  mapApiToken = token;
};

export const getMapApiToken = () => mapApiToken;

// ---- add runtime env/config state ----
let runtimeEnv = {
  prodOrDev: import.meta.env.VITE_PROD_OR_DEV ?? '',
  apiBaseDomain: import.meta.env.VITE_API_BASE_DOMAIN ?? '',
  apiBaseDomainDev: import.meta.env.VITE_API_BASE_DOMAIN_DEV ?? '',
};

export const setProdOrDev = (val) => { runtimeEnv.prodOrDev = val ?? ''; };
export const getProdOrDev = () => runtimeEnv.prodOrDev;

export const setApiBaseDomain = (val) => { runtimeEnv.apiBaseDomain = val ?? ''; };
export const getApiBaseDomain = () => runtimeEnv.apiBaseDomain;

export const setApiBaseDomainDev = (val) => { runtimeEnv.apiBaseDomainDev = val ?? ''; };
export const getApiBaseDomainDev = () => runtimeEnv.apiBaseDomainDev;
// ---- end runtime env/config state ----

export const mapStyles = {
  geoapifyPositron: () => `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${mapApiToken}`,

  osMapsApiRaster: () => ({
    version: 8,
    glyphs: "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${mapApiToken}`,
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "os-maps-zxy",
        type: "raster",
        source: "raster-tiles",
      },
    ],
  }),

  osVectorTileApiOpenGreyscale:
    "https://raw.githubusercontent.com/Transport-for-the-North/OS-Vector-Tile-API-Stylesheets/refs/heads/main/OS_VTS_3857_Open_Light.json",
};

export const getDefaultMapStyle = () => mapStyles.geoapifyPositron();
// Replace the direct export with a function
export const defaultMapStyle = getDefaultMapStyle;
export const defaultMapCentre = [-2.2, 54.2];
export const defaultMapZoom = 7.5;

export const CARD_CONSTANTS = {
  CARD_WIDTH: 300,
  TOGGLE_BUTTON_WIDTH: 40,
  TOGGLE_BUTTON_HEIGHT: 30,
  PADDING: 10,
}
export const defaultBgColour = '#7317DE';

export const defaultMapColourMapper = {
  'diverging': { value: 'BrBG', label: 'BrBG' },
  'continuous': { value: 'YlGnBu', label: 'YlGnBu' },
  'categorical': { value: 'Accent', lable: 'Accent'}
}

export const REQUEST_CONFIG = {
  MAX_GET_REQUEST_SIZE: 8 * 1024, // 8KB
  ERROR_MESSAGES: {
    REQUEST_TOO_LARGE: (size) => 
      `Your filter selection creates a request that's too large (${(size / 1024).toFixed(2)}KB). Please reduce the number of selected items or use fewer filters.`
  }
};