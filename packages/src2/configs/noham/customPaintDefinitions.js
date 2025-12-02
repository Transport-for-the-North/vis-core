export const nodeCustomPaint = {
  // Define the radius of the circles based on zoom level for scalability
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    7,
    1, 
    10,
    2,
    15,
    4,
  ],
  'circle-color': [
      'match',
      ['get', 'node_type'],
      'pri', '#2ecc71',   // Green for Priority Junction
      'sig', '#e74c3c',   // Red for Signalised Junction
      'rnd', '#f1c40f',   // Yellow for Roundabout
      'rnd_u', '#e67e22', // Orange for Roundabout with U-turns
      'dum', '#d3d3d3',   // Light Grey for Dummy Node
      'ext', '#2c3e50',   // Dark Blue for External Node
      '#add8e6'           // Light Blue for Default color
    ],
    'circle-stroke-width': 0.1,
    'circle-stroke-color': '#ffffff',
    "circle-opacity": 1,
};
 
 