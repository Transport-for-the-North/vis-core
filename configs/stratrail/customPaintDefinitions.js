export const crpLinesLayerPaint = {
    "line-color": [
      'match',
      ['get', 'link_desc'],
      'Bishop Line', '#e74c3c',
      'Calder Valley Line', '#3498db',
      'Clitheroe Line', '#9b59b6',
      'Crewe to Manchester', '#2ecc71',
      'Cumbrian Coast Line', '#f39c12',
      'East Lancashire', '#1abc9c',
      'Esk Valley', '#e67e22',
      'Furness Line', '#34495e',
      'High Peak & Hope Valley', '#f1c40f',
      'Lakes Line', '#95a5a6',
      'Leeds-Morecambe Line', '#8e44ad',
      'Mid Cheshire', '#16a085',
      'North Cheshire', '#27ae60',
      'North and Notts Lincs', '#2980b9',
      'Penistone', '#c0392b',
      'Settle-&-Carlisle', '#d35400',
      'South East Lancashire', '#7f8c8d',
      'South East Manchester', '#f39c12',
      'South Fylde', '#e91e63',
      'Tyne Valley', '#9c27b0',
      'West of Lancashire', '#607d8b',
      'Yorkshire Coast', '#ff5722',
      '#cccccc' // Default fallback color
    ],
    "line-width": 4,
    "line-opacity": 0.3
};

export const gaugeClearanceCustomPaint = {
  "line-color": [
    'match',
    ['get', 'gauge_clearance'],
    'W10 Loading Gauge', '#195e0aff',
    'W12 Loading Gauge', '#031086ff',
    '#808080ff' // Default fallback color
  ],
  "line-width": [
    'match',
    ['get', 'gauge_clearance'],
    'W10 Loading Gauge', 6,
    'W12 Loading Gauge', 6,
    0
  ],
  "line-opacity": 0.4
}
export const combinedAuthorityFreightCustomPaint = {
  "fill-color": [
    'match',
    ['get', 'name'],
    'North East', '#D2691E',
    'North West', '#6a3ddcff',
    'Yorkshire and The Humber', '#24e5ffff',
    '#808080' // Default fallback color
  ],
  "fill-opacity": [
    'match',
    ['get', 'name'],
    'North East', 0.2,
    'North West', 0.2,
    'Yorkshire and The Humber', 0.2,
    0
  ]
};

export const highGaugeLayerPaint = {
  "line-color": [
    'match',
    ['get', 'freight_realisation'],
    "FBR W12 MVP", "#b46e1fff",
    "High Gauge (W10/W12)", "#000000ff",
    "Transpennine Route Upgrade", "#7f4ae2ff",
    'Existing Rail Network', '#545454ff',
    '#545454ff' // Default fallback color
  ],
  "line-width": [
    'match',
    ['get', 'freight_realisation'],
    "FBR W12 MVP", 4,
    "High Gauge (W10/W12)", 4,
    "Transpennine Route Upgrade", 4,
    'Existing Rail Network', 1,
    0
  ],
  "line-opacity": 0.85
}

export const highGaugeClearedLayerPaint = {
  "line-color": [
    'match',
    ['get', 'high_gauge_cleared_network'],
    'TransPennine High Gauge Cleared Network', '#950303ff',
    'Existing Rail Network', '#545454ff',
    '#545454ff' // Default fallback color
  ],
  "line-width": [
    'match',
    ['get', 'high_gauge_cleared_network'],
    'TransPennine High Gauge Cleared Network', 4,
    'Existing Rail Network', 1,
    0
  ],
  "line-opacity": 0.85
};

export const freightLocationLayerPaint = {
  "circle-color": "#f5f5f5",
  "circle-radius": 5,
  "circle-opacity": 0.9,
  "circle-stroke-color": "#000000",
  "circle-stroke-width": 2,
  "circle-stroke-opacity": 1
};

export const freightJunctionLayerPaint = {
  "circle-color": "#f5f5f5",
  "circle-radius": 5,
  "circle-opacity": 0.9,
  "circle-stroke-color": "#000000",
  "circle-stroke-width": 2,
  "circle-stroke-opacity": 1
};

export const invisiblePolygonCustomPaint = {
  "fill-opacity": 0,
};

export const parentAuthorityBoundaryCustomPaint = {
  "line-color": "#808080",
  "line-width": 0.75,
  "line-opacity": 0.65
};