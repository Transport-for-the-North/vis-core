const fetchData = async (endpoint, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `http://localhost:7127${endpoint}${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  return response.json();
};

  const addOrUpdateSource = (map, name, url) => {
    if (map.isStyleLoaded()) {
      // If the style is already loaded, add or update the source
      if (map.getSource(name)) {
        map.getSource(name).setData(url);
      } else {
        map.addSource(name, {
          type: 'geojson',
          data: url,
        });
      }
    } else {
      // If the style is not yet loaded, wait for the 'style.load' event
      map.once('style.load', () => {
        // Now the style is loaded, add or update the source
        if (map.getSource(name)) {
          map.getSource(name).setData(url);
        } else {
          map.addSource(name, {
            type: 'geojson',
            data: url,
          });
        }
      });
    }
  };

export default { fetchData, addOrUpdateSource }