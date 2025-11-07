const administrativeBoundarySelector = {
  filterName: "Administrative Boundaries",
  paramName: "zoneTypeId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: { targetLayer: "Administrative Boundaries" },
    },
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  layer: "Administrative Boundaries",
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Local Authority",
        paramValue: 18,
      },
      {
        displayValue: "MSOA",
        paramValue: 6,
      },
    ],
  },
};

const administrativeBoundaryFixedSelector = {
  filterName: "Administrative Boundaries Fixed",
  paramName: "zoneTypeId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "MSOA",
        paramValue: "6",
      }
    ],
  },
};

const administrativeBoundaryFixedLSOASelector = {
  filterName: "Administrative Boundaries Fixed",
  paramName: "zoneTypeId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "LSOA",
        paramValue: "19",
      }
    ],
  },
};

const zoneSelector = {
  filterName: "Optional location filter",
  type: "mapFeatureSelectWithControls",
  paramName: "zoneId",
  target: "api",
  actions: [
    {
      action: 'SET_SELECTED_FEATURES'
    },
    {
      action: 'UPDATE_VISUALISED_FEATURES'
    },
  ],
  visualisations: null,
  layer: "Administrative Boundaries",
  selectionModes: ['polygon', 'feature', 'draw_rectangle'], // Available selection modes
  defaultMode: 'draw_rectangle', // Default selection mode
};

const linkSelector = {
  filterName: "Optional location filter",
  type: "mapFeatureSelectWithControls",
  paramName: "linkId",
  target: "api",
  actions: [
    {
      action: 'SET_SELECTED_FEATURES'
    },
    {
      action: 'UPDATE_VISUALISED_FEATURES'
    },
  ],
  visualisations: null,
  layer: "Major Roads",
  selectionModes: ['polygon', 'feature', 'draw_rectangle'], // Available selection modes
  defaultMode: 'draw_rectangle', // Default selection mode
};

const siteSelector = {
  filterName: "Optional location filter",
  type: "mapFeatureSelectWithControls",
  paramName: "siteId",
  target: "api",
  actions: [
    {
      action: 'SET_SELECTED_FEATURES'
    },
    {
      action: 'UPDATE_VISUALISED_FEATURES',
    },
  ],
  visualisations: null,
  layer: "Potential Charging Sites",
  selectionModes: ['polygon', 'feature', 'draw_rectangle'], // Available selection modes
  defaultMode: 'draw_rectangle', // Default selection mode
};

const yearSelector = {
  filterName: "Year",
  paramName: "scenarioYear",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "slider",
  values: {
    "source": "local",
    "values": [
      {
        "displayValue": 2023,
        "paramValue": 2023
      },
      {
        "displayValue": 2025,
        "paramValue": 2025
      },
      {
        "displayValue": 2030,
        "paramValue": 2030
      },
      {
        "displayValue": 2035,
        "paramValue": 2035
      },
      {
        "displayValue": 2040,
        "paramValue": 2040
      },
      {
        "displayValue": 2045,
        "paramValue": 2045
      },
      {
        "displayValue": 2050,
        "paramValue": 2050
      }
    ]
  },
};

const yearTripletSelector = {
  filterName: "Year",
  paramName: "scenarioYear",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "slider",
  values: {
    "source": "local",
    "values": [
      {
        "displayValue": 2025,
        "paramValue": 2025
      },
      {
        "displayValue": 2030,
        "paramValue": 2030
      },
      {
        "displayValue": 2035,
        "paramValue": 2035
      }
    ]
  },
};

const travelScenarioSelectorBase = {
  filterName: "Travel Scenario",
  paramName: "travelScenarioId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Business as usual",
        paramValue: 1,
      },
      {
        displayValue: "Accelerated EV",
        paramValue: 3,
      },
    ],
  },
};

const travelScenarioSelectorAdditional = {
  ...travelScenarioSelectorBase,
  values: {
    ...travelScenarioSelectorBase.values,
    values: [
      ...travelScenarioSelectorBase.values.values,
      {
        displayValue: "Just About Managing",
        paramValue: 2,
      },
      {
        displayValue: "Digitally Distributed",
        paramValue: 4,
      },
      {
        displayValue: "Live Local",
        paramValue: 7,
      },
      {
        displayValue: "Metropolitan Mobility",
        paramValue: 8,
      },
    ],
  },
};

const behaviouralScenarioSelector = {
  filterName: "Behavioural Scenario",
  paramName: "behaviourScenarioId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      // {
      //   displayValue: "Unknown",
      //   paramValue: 0,
      // },
      {
        displayValue: "Baseline",
        paramValue: 1,
      },
      {
        displayValue: "Destination",
        paramValue: 2,
      },
      // {
      //   displayValue: "Not Applicable",
      //   paramValue: 3,
      // },
      //{
      //  displayValue: "Local Charging Hub focus",
      //  paramValue: 4,
      //},
      // {
        // displayValue: "Queuing acceptance",
        // paramValue: 5,
      // },
    ],
  },
};

const tfnBehaviouralScenarioSelector = {
  filterName: "Behavioural Scenario",
  paramName: "behaviourScenarioId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      // {
      //   displayValue: "Unknown",
      //   paramValue: 0,
      // },
      {
        displayValue: "Baseline",
        paramValue: 1,
      },
      {
        displayValue: "Destination",
        paramValue: 2,
      },
      // {
      //   displayValue: "Not Applicable",
      //   paramValue: 3,
      // },
      {
        displayValue: "Local Charging Hub focus",
        paramValue: 4,
      },
      {
        displayValue: "Queuing acceptance",
        paramValue: 5,
      },
    ],
  },
};

const vehicleTypeSelector = {
  filterName: "Vehicle Type",
  paramName: "modeCode",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Car and Van",
        paramValue: "lgv",
      },
      {
        displayValue: "HGV",
        paramValue: "hgv",
      },
    ],
  },
};

const vehicleTypeWithoutAllSelector = {
  filterName: "Vehicle Type",
  paramName: "modeCode",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Car",
        paramValue: "car",
      },
      {
        displayValue: "LGV",
        paramValue: "lgv",
      },
      {
        displayValue: "HGV",
        paramValue: "hgv",
      },
    ],
  },
};

const vehicleTypeWithBusTaxi = {
  filterName: "Vehicle Type",
  paramName: "modeCode",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Car",
        paramValue: "car",
      },
      {
        displayValue: "LGV",
        paramValue: "lgv",
      },
      {
        displayValue: "HGV",
        paramValue: "hgv",
      },
      {
        displayValue: "Bus",
        paramValue: "bus",
      },
      {
        displayValue: "Taxi & PHV",
        paramValue: "phv",
      },
    ],
  },
};

const vehicleTypeAllSelector = {
  filterName: "Vehicle Type",
  paramName: "modeCode",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "All",
        paramValue: "all",
      },
      {
        displayValue: "Car",
        paramValue: "car",
      },
      {
        displayValue: "LGV",
        paramValue: "lgv",
      },
      {
        displayValue: "HGV",
        paramValue: "hgv",
      },
    ],
  },
};

const fuelTypeSelector = {
  filterName: "Fuel Type",
  paramName: "fuelTypeCode",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Battery Electric Vehicle",
        paramValue: "bev",
      },
      {
        displayValue: "Plug-in Hybrid Electric Vehicle",
        paramValue: "phev",
      },
    ],
  },
};

const chargingCategorySelector = {
  filterName: "Charging Category",
  paramName: "chargingCategoryId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Destination",
        paramValue: 1,
      },
      {
        displayValue: "HGV Depot",
        paramValue: 2,
      },
      {
        displayValue: "Home",
        paramValue: 3,
      },
      {
        displayValue: "On-street residential charging",
        paramValue: 4,
      },
      {
        displayValue: "Workplace",
        paramValue: 5,
      },
      // {
      //   displayValue: "HGV en route",
      //   paramValue: 6,
      // },
      // {
      //   displayValue: "En route",
      //   paramValue: 7,
      // },
      //{
      //  displayValue: "Local Charging Hubs",
      //  paramValue: 8,
      //},
    ],
  },
};

const tfnChargingCategorySelector = {
  filterName: "Charging Category",
  paramName: "chargingCategoryId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Destination",
        paramValue: 1,
      },
      {
        displayValue: "HGV Depot",
        paramValue: 2,
      },
      {
        displayValue: "Home",
        paramValue: 3,
      },
      {
        displayValue: "On-street residential charging",
        paramValue: 4,
      },
      {
        displayValue: "Workplace",
        paramValue: 5,
      },
      // {
      //   displayValue: "HGV en route",
      //   paramValue: 6,
      // },
      // {
      //   displayValue: "En route",
      //   paramValue: 7,
      // },
      {
        displayValue: "Local Charging Hubs",
        paramValue: 8,
      },
      {
        displayValue: "Rapid Charging",
        paramValue: 11,
      },
    ],
  },
};

const tfseChargingCategorySelector = {
  filterName: "Charging Category",
  paramName: "chargingCategoryId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Destination",
        paramValue: 1,
      },
      {
        displayValue: "HGV Depot",
        paramValue: 2,
      },
      {
        displayValue: "Home",
        paramValue: 3,
      },
      {
        displayValue: "On-street residential charging",
        paramValue: 4,
      },
      {
        displayValue: "Workplace",
        paramValue: 5,
      },
      {
        displayValue: "Van Depot",
        paramValue: 9,
      },
      {
        displayValue: "Bus Depot",
        paramValue: 10,
      },
    ],
  },
};

const areaValueDisplaySelector = {
  filterName: "Display values as...",
  paramName: "showValuesAs",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "value",
      },
      {
        displayValue: "Per sq km",
        paramValue: "perSqKm",
      },
      {
        displayValue: "Per 000 vehs",
        paramValue: "perThousandVehicles",
      },
    ],
  },
};

const distanceValueDisplaySelector = {
  filterName: "Display values as...",
  paramName: "showValuesAs",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "value",
      },
      {
        displayValue: "Per km",
        paramValue: "perKm",
      },
    ],
  },
};

const chargerSpeedSelector = {
  filterName: "Charger Speed",
  paramName: "deviceSpeedId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Slow",
        paramValue: 1,
      },
      {
        displayValue: "Fast",
        paramValue: 8,
      },
      // {
      //   displayValue: "Standard",
      //   paramValue: 2,
      // },
      {
        displayValue: "Rapid",
        paramValue: 3,
      },
      {
        displayValue: "Ultra-rapid",
        paramValue: 4,
      },
      {
        displayValue: "Any Speed",
        paramValue: 5,
      },
      {
        displayValue: "Any Non-rapid",
        paramValue: 6,
      },
      {
        displayValue: "Any Rapid or Faster",
        paramValue: 7,
      },
    ],
  },
};

const columnNameCPSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Installed devices",
        paramValue: "device_count",
        legendSubtitleText: "device count"
      },
      {
        displayValue: "Installed charger power",
        paramValue: "kw_total",
        legendSubtitleText: "kW"
      },
    ],
  },
};

const columnNameOSPASelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      // {
      //   displayValue: "Demand Park Access",
      //   paramValue: "demand_park_access_lsoa",
      //   legendSubtitleText: "LSOA"
      // },
      {
        displayValue: "Car park access",
        paramValue: "car_park_access_perc",
        legendSubtitleText: "% households with access"
      },
      // {
      //   displayValue: "Non Driveway Count",
      //   paramValue: "non_driveway_count",
      //   legendSubtitleText: "Count"
      // },
      // {
      //   displayValue: "Driveway Count",
      //   paramValue: "driveway_count",
      //   legendSubtitleText: "Count"
      // },
      // {
      //   displayValue: "Total Count",
      //   paramValue: "total_count",
      //   legendSubtitleText: "Count"
      // },
      {
        displayValue: "Driveway access",
        paramValue: "driveway_perc",
        legendSubtitleText: "% homes with access"
      },
    ],
  },
};

const columnNameOSPASelectorDrivewayOnly = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Driveway access",
        paramValue: "driveway_perc",
        legendSubtitleText: "% homes with access"
      },
    ],
  },
};

const columnNameCVFixedSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Commercial Viability",
        paramValue: "commercial",
        legendSubtitleText: "viability"
      }
    ],
  },
};

const columnNameMMHFixedSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Multi-Modal Hubs",
        paramValue: "multi_modal_hub",
        legendSubtitleText: "Hubs"
      }
    ],
  },
};

const columnNameSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Stops count",
        paramValue: "stops_count",
        legendSubtitleText: "stops"
      },
      {
        displayValue: "Charger power",
        paramValue: "kw_total",
        legendSubtitleText: "kW"
      },
    ],
  },
};

const stbTagSelector = {
  filterName: "STB Name",
  paramName: "stbTag",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "@stbTagDisplay@",
        paramValue: "@stbTag@",
      }
    ],
  },
};

const runTypeCodeFixedSelector = {
  filterName: "Run Type Code Fixed",
  paramName: "runTypeCode",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "D",
      }
    ],
  },
};

const runTypeCodeDynamicSelector = {
  filterName: "Vehicle Stock Projection",
  paramName: "runTypeCode",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "D",
      },
      {
        displayValue: "Income-based",
        paramValue: "I",
      }
    ],
  },
};

const infrastructureTypeSelector = {
  filterName: "Infrastructure Type",
  paramName: "infrastructureTypeId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Pavement",
        paramValue: "Pavement",
      },
      {
        displayValue: "Road",
        paramValue: "Road",
      }
    ],
  },
};

export const selectors = {
  year: yearSelector,
  yearTriplet: yearTripletSelector,
  administrativeBoundary: administrativeBoundarySelector,
  administrativeBoundaryFixed: administrativeBoundaryFixedSelector,
  administrativeBoundaryFixedLSOA: administrativeBoundaryFixedLSOASelector,
  travelScenarioBase: travelScenarioSelectorBase,
  travelScenarioAdditional: travelScenarioSelectorAdditional,
  behaviouralScenario: behaviouralScenarioSelector,
  tfnBehaviouralScenario: tfnBehaviouralScenarioSelector,
  vehicleType: vehicleTypeSelector,
  vehicleTypeWithoutAll: vehicleTypeWithoutAllSelector,
  vehicleTypeWithBusTaxi: vehicleTypeWithBusTaxi,
  vehicleTypeAll: vehicleTypeAllSelector,
  fuelType: fuelTypeSelector,
  chargingCategory: chargingCategorySelector,
  tfnChargingCategory: tfnChargingCategorySelector,
  tfseChargingCategory: tfseChargingCategorySelector,
  areaValueDisplay: areaValueDisplaySelector,
  distanceValueDisplay: distanceValueDisplaySelector,
  chargerSpeed: chargerSpeedSelector,
  infrastructureType: infrastructureTypeSelector,
  columnNameCP: columnNameCPSelector,
  columnNameOSPA: columnNameOSPASelector,
  columnNameOSPADrivewayOnly: columnNameOSPASelectorDrivewayOnly,
  columnNameCVFixed: columnNameCVFixedSelector,
  columnNameMMHFixed: columnNameMMHFixedSelector,
  columnName: columnNameSelector,
  stbTag: stbTagSelector,
  runTypeCodeFixed: runTypeCodeFixedSelector,
  runTypeCodeDynamic: runTypeCodeDynamicSelector,
  zoneSelector: zoneSelector,
  siteSelector: siteSelector,
  linkSelector: linkSelector
};