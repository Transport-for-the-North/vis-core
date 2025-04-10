const colourOptions = {
  browns: [
    "#005ab5", // Perfect access: blue
    "#EFEBE9", // 1
    "#D7CCC8",
    "#BCAAA4",
    "#A1887F",
    "#8D6E63",
    "#795548",
    "#6D4C41",
    "#5D4037",
    "#4E342E",
    "#3E2723", // 10
    "#dc3220", // No access: red
  ],

  purples: [
    "#005ab5", // Perfect access: blue
    "#F3E5F5", // 1
    "#E1BEE7",
    "#CE93D8",
    "#BA68C8",
    "#AB47BC",
    "#9C27B0",
    "#8E24AA",
    "#7B1FA2",
    "#6A1B9A",
    "#4A148C", // 10
    "#dc3220", // No access: red
  ],

  teals: [
    "#005ab5", // Perfect access: blue
    "#E0F2F1", // 1
    "#B2DFDB",
    "#80CBC4",
    "#4DB6AC",
    "#26A69A",
    "#009688",
    "#00897B",
    "#00796B",
    "#00695C",
    "#004D40", // 10
    "#dc3220", // No access: red
  ],

  greys: [
    "#005ab5", // Perfect access: blue
    "#fafafa", // 1
    "#e0e0e0",
    "#c8c8c8",
    "#b0b0b0",
    "#989898",
    "#808080",
    "#686868",
    "#505050",
    "#383838",
    "#202020", // 10
    "#dc3220", // No access: red
  ],

  oranges: [
    "#0072B2", // Perfect access: colourblind‐friendly blue
    "#fff3e0", // 1
    "#ffe0b2",
    "#ffcc80",
    "#ffb74d",
    "#ffa726",
    "#ff9800",
    "#fb8c00",
    "#f57c00",
    "#ef6c00",
    "#e65100", // 10
    "#dc3220", // No access: colourblind‐friendly red
  ],

  mutedOranges: [
    "#005ab5", // Perfect access: blue
    "#fff3e0", // 1
    "#ffe1c3",
    "#ffd1a5",
    "#ffc189",
    "#ffb16c",
    "#ffa24f",
    "#ff932f",
    "#ff8510",
    "#ff7700",
    "#ff6900", // 10
    "#dc3220", // No access: red
  ],

  gnYlGnBuRd: [
    "#41ab5d", // Perfect access: green
    "#ffffd9", // 1
    "#edf8b1",
    "#c7e9b4",
    "#a8ddb5",
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#253494",
    "#081d58", // 10
    "#ef3b2c", // No access: red
  ],

  YlGnBu: [
    "#005ab5", // Perfect access: green
    "#ffffd9", // 1
    "#edf8b1",
    "#c7e9b4",
    "#a8ddb5",
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#253494",
    "#081d58", // 10
    "#dc3220", // No access: red
  ],

  puYlGnBuOr: [
    "#5d3a9b", // Perfect access
    "#ffffd9", // 1
    "#edf8b1",
    "#c7e9b4",
    "#a8ddb5",
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#253494",
    "#081d58", // 10
    "#E66100", // No access
  ],

  // Additional ColorBrewer option: BuPu.
  buPu: [
    "#005ab5", // Perfect access: blue
    "#F7FCFD", // 1
    "#E0ECF4",
    "#C6DBEF",
    "#9EBCDA",
    "#6BAED6",
    "#4292C6",
    "#2171B5",
    "#08519C",
    "#08306B",
    "#084275", // 10
    "#dc3220", // No access: red
  ],

  greenGnBu: [
    "#41ab5d", // Perfect access: green
    "#F7FCF0", // 1
    "#E0F3DB",
    "#CCEBC5",
    "#A8DDB5",
    "#7BCCC4",
    "#4EB3D3",
    "#2B8CBE",
    "#0868AC",
    "#085497",
    "#084081", // 10
    "#ef3b2c", // No access: red
  ],

  grBluesRd: [
    "#41ab5d", // Perfect access: green
    "#E3F2FD", // 1
    "#BBDEFB",
    "#90CAF9",
    "#64B5F6",
    "#42A5F5",
    "#2196F3",
    "#1E88E5",
    "#1976D2",
    "#1565C0",
    "#0D47A1", // 10
    "#ef3b2c", // No access: red
  ],

  grYellowsRd: [
    "#41ab5d", // Perfect access: green
    "#FFFDE7", // 1
    "#FFF9C4", 
    "#FFF59D", 
    "#FFF176", 
    "#FFEE58", 
    "#FFEB3B", 
    "#FDD835", 
    "#FBC02D", 
    "#F9A825", 
    "#F57F17", // 10
    "#ef3b2c"  // No access: red
  ],

  blYellowsRd: [
    "#005ab5", // Perfect access: blue
    "#FFFDE7", // 1
    "#FFF9C4", 
    "#FFF59D", 
    "#FFF176", 
    "#FFEE58", 
    "#FFEB3B", 
    "#FDD835", 
    "#FBC02D", 
    "#F9A825", 
    "#F57F17", // 10
    "#ef3b2c"  // No access: red
  ],
};

export const bands = [
  {
    name: "Severance across England",
    metric: [
      {
        name: "overall_decile_risk",
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 999],
        differenceValues: [],
        colours: colourOptions.blYellowsRd,
        labels: ["Perfect access", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "No access"],
      },
    ],
  },
];