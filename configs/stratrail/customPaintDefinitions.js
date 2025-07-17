export const crpLinesLayerPaint = {
    "line-color": [
      'case',
      ['!=', ['get', 'link_desc'], null], '#00ff00', // Green if link_desc has any value
      '#ff0000' // Red if null/missing
    ],
    "line-width": 5,
    "line-opacity": 1
};

// export const crpLinesLayerPaint = {
//     "line-color": [
//       'match',
//       ['get', 'link_desc'],
//       'Bishop Line', '#e74c3c',
//       'Calder Valley Line', '#3498db',
//       'Clitheroe Line', '#9b59b6',
//       'Crewe to Manchester', '#2ecc71',
//       'Cumbrian Coast Line', '#f39c12',
//       'East Lancashire', '#1abc9c',
//       'Esk Valley', '#e67e22',
//       'Furness Line', '#34495e',
//       'High Peak & Hope Valley', '#f1c40f',
//       'Lakes Line', '#95a5a6',
//       'Leeds-Morecambe Line', '#8e44ad',
//       'Mid Cheshire', '#16a085',
//       'North Cheshire', '#27ae60',
//       'North and Notts Lincs', '#2980b9',
//       'Penistone', '#c0392b',
//       'Settle-&-Carlisle', '#d35400',
//       'South East Lancashire', '#7f8c8d',
//       'South East Manchester', '#f39c12',
//       'South Fylde', '#e91e63',
//       'Tyne Valley', '#9c27b0',
//       'West of Lancashire', '#607d8b',
//       'Yorkshire Coast', '#ff5722',
//       '#cccccc' // Default fallback color
//     ],
//     "line-width": [
//         "interpolate",
//         ["linear"],
//         ["zoom"],
//         7,
//         1, 
//         10,
//         2,
//         15,
//         4,
//     ],
//     "line-opacity": 0.65
// };