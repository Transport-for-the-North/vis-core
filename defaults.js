export const mapStyles = {
  geoapifyPositron: `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${process.env.REACT_APP_MAP_API_TOKEN}`,

  osMapsApiRaster: {
    version: 8,
    glyphs: "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAP_API_TOKEN}`,
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
  },

  osVectorTileApiOpenGreyscale:
    "https://raw.githubusercontent.com/Transport-for-the-North/OS-Vector-Tile-API-Stylesheets/refs/heads/main/OS_VTS_3857_Open_Light.json",
};

export const defaultMapStyle = mapStyles.geoapifyPositron;
export const defaultMapCentre = [-2.2, 54.2];
export const defaultMapZoom = 7.5;
export const defaultBgColour = '#7317DE';