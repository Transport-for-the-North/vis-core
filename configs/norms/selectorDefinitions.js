const timePeriodCodeValues = {
    source: "local",
    values: [
      {
        displayValue: "All",
        paramValue: "all",
      },
      {
        displayValue: "AM",
        paramValue: "am",
      },
      {
        displayValue: "IP",
        paramValue: "ip",
      },
      {
        displayValue: "OP",
        paramValue: "op",
      },
      {
        displayValue: "PM",
        paramValue: "pm",
      },
    ]
  }

const scenarioCodeValues = {
  source: "local",
  values: [
    {
      displayValue: "IGX 2018",
      paramValue: "IGX_2018",
    },
    {
      displayValue: "JPI 2042",
      paramValue: "JPI_2042",
    },
    {
      displayValue: "JRT 2042",
      paramValue: "JRT_2042",
    },
    {
      displayValue: "JRU 2052",
      paramValue: "JRU_2052",
    },
    {
      displayValue: "JRV 2042",
      paramValue: "JRV_2042",
    },
    {
      displayValue: "JRW 2052",
      paramValue: "JRW_2052",
    },
    {
      displayValue: "JRX 2042",
      paramValue: "JRX_2042",
    },
    {
      displayValue: "JRY 2052",
      paramValue: "JRY_2052",
    },
    {
      displayValue: "JRZ 2042",
      paramValue: "JRZ_2042",
    },
    {
      displayValue: "JSA 2052",
      paramValue: "JSA_2052",
    },
    {
      displayValue: "K9N 2042",
      paramValue: "K9N_2042",
    },
    {
      displayValue: "K9O 2052",
      paramValue: "K9O_2052",
    },
    {
      displayValue: "KZI 2042",
      paramValue: "KZI_2042",
    },
    {
      displayValue: "UAA 2042",
      paramValue: "UAA_2042",
    },
    {
      displayValue: "UAB 2052",
      paramValue: "UAB_2052",
    },
    {
      displayValue: "UAC 2042",
      paramValue: "UAC_2042",
    },
    {
      displayValue: "UAD 2052",
      paramValue: "UAD_2052",
    },
    {
      displayValue: "UAE 2042",
      paramValue: "UAE_2042",
    },
    {
      displayValue: "UAF 2052",
      paramValue: "UAF_2052",
    },
  ],
};

const userClassIdValues = {
  source: "local",
  values: [
    {
      displayValue: "All",
      paramValue: "0",
    },
    {
      displayValue: "Business, all car availabilities",
      paramValue: "123",
    },
    {
      displayValue: "Commuting, all car availability",
      paramValue: "456",
    },
    {
      displayValue: "Other, all car availabilities",
      paramValue: "789",
    },
    {
      displayValue: "All",
      paramValue: "0",
    },
    {
      displayValue: "Business, car available from home",
      paramValue: "1",
    },
    {
      displayValue: "Business, car available to home",
      paramValue: "2",
    },
    {
      displayValue: "Business, car non available",
      paramValue: "3",
    },
    {
      displayValue: "Commuting, car available from home",
      paramValue: "4",
    },
    {
      displayValue: "Commuting, car available to home",
      paramValue: "5",
    },
    {
      displayValue: "Commuting, car non available",
      paramValue: "6",
    },
    {
      displayValue: "Other, car available from home",
      paramValue: "7",
    },
    {
      displayValue: "Other, car available to home",
      paramValue: "8",
    },
    {
      displayValue: "Other, car non available",
      paramValue: "9",
    }
  ]
}

const landuseValues = {
  source: "local",
  values: [
    {
      displayValue: "Employment",
      paramValue: "emp",
      legendSubtitleText: "employment"
    },
    {
      displayValue: "Population",
      paramValue: "pop",
      legendSubtitleText: "population"
    }
  ]
}

const originOrDestinationValues = {
  source: "local",
  values: [
    {
      displayValue: "Origin",
      paramValue: "origin"
    },
    {
      displayValue: "Destination",
      paramValue: "destination",
    },
  ],
}

const thresholdValues = {
  source: "local",
  values: [
    {
      displayValue: "30",
      paramValue: 30,
    },
    {
      displayValue: "60",
      paramValue: 60,
    },
    {
      displayValue: "90",
      paramValue: 90,
    },
    {
      displayValue: "120",
      paramValue: 120,
    },
  ]
}

const timePeriodCodesValues = {
  source: "local",
  values: [
    {
      displayValue: "AM",
      paramValue: "am",
    },
    {
      displayValue: "IP",
      paramValue: "ip",
    },
    {
      displayValue: "PM",
      paramValue: "pm",
    },
  ]
}

const landuseReferenceValues = {
  source: "local",
  values: [
    {
      displayValue: "NTEM8",
      paramValue: "ntem8",
    },
    {
      displayValue: "EDGE",
      paramValue: "edge",
    },
  ],
}

const landuseExogValues = {
  source: "local",
  values: [
    {
      displayValue: "Static",
      paramValue: "static",
    },
    {
      displayValue: "Dynamic",
      paramValue: "dynamic",
    },
  ],
}

const scenarioFilterNetwork = {
    filterName: "Filter Scenario by Network",
    target: "validate",
    actions: [{ action: "none" }],
    visualisations: null,
    type: "dropdown",
    shouldBeBlankOnInit: true,
    shouldFilterOnValidation: false,
    shouldFilterOthers: true,
    multiSelect: false,
    isClearable: true,
    values: {
        source: "metadataTable",
        metadataTableName: "input_norms_scenario",
        displayColumn: "network_spec",
        paramColumn: "network_spec",
        sort: "ascending",
        exclude: ["NA"]
    },
}

const scenarioFilterDemand = {
    filterName: "Filter Scenario by Demand Scenario",
    target: "validate",
    actions: [{ action: "none" }],
    visualisations: null,
    type: "dropdown",
    shouldBeBlankOnInit: true,
    shouldFilterOnValidation: false,
    shouldFilterOthers: true,
    multiSelect: false,
    isClearable: true,
    values: {
        source: "metadataTable",
        metadataTableName: "input_norms_scenario",
        displayColumn: "demand_code",
        paramColumn: "demand_code",
        sort: "ascending",
        exclude: ["NA"]
    },
}

const scenarioFilterYear = {
    filterName: "Filter Scenario by Year",
    target: "validate",
    actions: [{ action: "none" }],
    visualisations: null,
    type: "dropdown",
    shouldBeBlankOnInit: true,
    shouldFilterOnValidation: false,
    shouldFilterOthers: true,
    multiSelect: false,
    isClearable: true,
    values: {
        source: "metadataTable",
        metadataTableName: "input_norms_scenario",
        displayColumn: "scenario_year",
        paramColumn: "scenario_year",
        sort: "ascending",
        exclude: [0]
    },
}

const scenarioFilter = {
    filterName: "Scenario",
    paramName: "scenarioCode",
    target: "api",
    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
    visualisations: null,
    info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
    type: "dropdown",
    shouldBeBlankOnInit: false,
    shouldFilterOnValidation: false,
    shouldFilterOthers: false,
    isClearable: true,
    multiSelect: false,
    values: {
        source: "metadataTable",
        metadataTableName: "input_norms_scenario",
        displayColumn: "scenario_code",
        paramColumn: "scenario_code",
        sort: "ascending",
        exclude: ["NA"]
    },
}

const timePeriod =  {
    filterName: "Time Period",
    paramName: "timePeriodCode",
    target: "api",
    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
    visualisations: null,
    info:"Select the desired time period.",
    type: "toggle",
    values: timePeriodCodeValues,
}

const metricFilter = {
    filterName: "Metric",
    paramName: "propertyName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" },
        { action: "UPDATE_LEGEND_TEXT" }
    ],
    visualisations: null,
    info:"Select the desired metric.",
    type: "dropdown",
    containsLegendInfo: true,
    values: {
        source: "local",
        values: [
        { paramValue: "Boardings", displayValue: "Boardings", legendSubtitleText: "Passengers" },
        { paramValue: "Interchanges", displayValue: "Interchanges", legendSubtitleText: "Passengers" },
        { paramValue: "Egress", displayValue: "Egress", legendSubtitleText: "Egress" },
        { paramValue: "Access", displayValue: "Access", legendSubtitleText: "Access" },
        { paramValue: "Alightings", displayValue: "Alightings", legendSubtitleText: "Alightings" }
        ]
    },
}

const userClassFilter = {
    filterName: "User Class",
    paramName: "userClassId",
    target: "api",
    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
    visualisations: null,
    info:"Select the desired user class.",
    type: "dropdown",
    shouldBeBlankOnInit: false,
    shouldFilterOnValidation: false,
    shouldBeValidated: false,
    shouldFilterOthers: false,
    multiSelect: false,
    isClearable: false,
    values: {
        source: "metadataTable",
        metadataTableName: "norms_userclass_list",
        displayColumn: "name",
        paramColumn: "id",
        sort: "ascending",
        exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
}

const originOrDestinationFilter = {
    filterName: "Origin or Destination",
    paramName: "originOrDestination",
    target: "api",
    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
    visualisations: null,
    type: "toggle",
    values: originOrDestinationValues,
}

const pairsMetricFilter = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" },
        { action: "UPDATE_LEGEND_TEXT" }
    ],
    visualisations: null,
    info:"Select the desired metric.",
    type: "dropdown",
    containsLegendInfo: true,
    values: {
        source: "local",
        values: [
        {
            displayValue: "Demand",
            paramValue: "demand",
            legendSubtitleText: "Demand",
        },
        {
            displayValue: "Generalised Cost",
            paramValue: "gen_cost",
            legendSubtitleText: "Cost",
        },
        {
            displayValue: "Generalised Journey Time",
            paramValue: "gen_jt",
            legendSubtitleText: "Seconds",
        }
        ]
    }
}

const stationMapSelection = {
    filterName: "Please select a station in the map",
    paramName: "nodeId",
    target: "api",
    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
    visualisations: null,
    type: "map",
    layer: null,
    field: "id",
}

const catchmentMetricFilter = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" },
        { action: "UPDATE_LEGEND_TEXT" }
    ],
    visualisations: null,
    info:"Select the desired metric.",
    type: "dropdown",
    containsLegendInfo: true,
    values: {
        source: "local",
        values: [
        { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
        { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
        { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
        { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
        { paramValue: "gen_cost_total", displayValue: "Generalised Cost Total", legendSubtitleText: "Cost" },
        { paramValue: "demand_walk", displayValue: "Demand Walk", legendSubtitleText: "Demand" },
        { paramValue: "demand_car", displayValue: "Demand Car", legendSubtitleText: "Demand" },
        { paramValue: "demand_bus", displayValue: "Demand Bus", legendSubtitleText: "Demand" },
        { paramValue: "demand_lrt", displayValue: "Demand LRT", legendSubtitleText: "Demand" },
        { paramValue: "demand_total", displayValue: "Demand Total", legendSubtitleText: "Demand" }
        ]
    },
}

const linkMetricFilter = {
  filterName: "Metric",
  paramName: "propertyName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  info:"Select the desired metric.",
  type: "dropdown",
  containsLegendInfo: true,
  values: {
    source: "local",
    values: [
      {
        displayValue: "No. Passengers",
        paramValue: "No. Passengers",
        legendSubtitleText: "Passengers",
      },
      {
        displayValue: "Total Crush Capacity",
        paramValue: "Total Crush Capacity",
        legendSubtitleText: "Capacity",
      },
      {
        displayValue: "Total Crush Load Factor",
        paramValue: "Total Crush Load Factor",
        legendSubtitleText: "Factor",
      },
      {
        displayValue: "Total Seat Capacity",
        paramValue: "Total Seat Capacity",
        legendSubtitleText: "Capacity",
      },
      {
        displayValue: "Total Seat Load Factor",
        paramValue: "Total Seat Load Factor",
        legendSubtitleText: "Factor",
      },
      {
        displayValue: "Trains per hour",
        paramValue: "Trains per hour",
        legendSubtitleText: "units",
      },
    ]
  },
}

const zoneMetricFilter = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  info:"Select the desired metric.",
  type: "dropdown",
  containsLegendInfo: true,
  values: {
    source: "local",
    values: [
      {
        displayValue: 'Revenue',
        paramValue: 'revenue',
        legendSubtitleText: "£",
      },
      {
        displayValue: 'Demand',
        paramValue: 'demand',
        legendSubtitleText: "Passengers",
      },
    ],
  },
}

const benefitsMetricFilter = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  info:"Select the desired metric.",
  type: "dropdown",
  containsLegendInfo: true,
  values: {
    source: "local",
    values: [
      {
        displayValue: 'Total Generalised Cost',
        paramValue: 'total_gen_cost',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'IVT',
        paramValue: 'ivt',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'Crowding',
        paramValue: 'crowding',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'Wait Time',
        paramValue: 'wait_time',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'Walk Time',
        paramValue: 'walk_time',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'Penalty',
        paramValue: 'penalty',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'Access Egress',
        paramValue: 'access_egress',
        legendSubtitleText: "Pass. Mins",
      },
      {
        displayValue: 'Value of choice',
        paramValue: 'value_of_choice',
        legendSubtitleText: "Pass. Mins",
      },
    ],
  },
}

const benefitsScenariosFilter = {
  filterName: "Scenario 1/Scenario 2 Do Minimum",
  target: "validate",
  actions: [{ action: "none" }],
  visualisations: null,
  info:"Select a 1 scenario for both scenario 1 and scenario 2.",
  type: "dropdown",
  shouldBeBlankOnInit: false,
  shouldFilterOnValidation: false,
  shouldFilterOthers: false,
  isClearable: false,
  multiSelect: false,
  values: {
    source: "metadataTable",
    metadataTableName: "input_norms_scenario",
    displayColumn: "dm_scenario_code",
    paramColumn: "dm_scenario_code",
    sort: "ascending",
    exclude: ["NA"]
  },
}

const segmentUserClassFilter = {
  filterName: "Filter User Class by Segment",
  paramName: "userClassIds",
  target: "validate",
  actions: [{ action: "none" }],
  visualisations: null,
  type: "dropdown",
  shouldBeBlankOnInit: true,
  shouldFilterOnValidation: false,
  shouldBeValidated: false,
  shouldFilterOthers: true,
  multiSelect: true,
  isClearable: true,
  values: {
    source: "metadataTable",
    metadataTableName: "norms_userclass_list",
    displayColumn: "user_segment",
    paramColumn: "user_segment",
    sort: "ascending",
    exclude: ['All']
  },
}

const keyLocationTypeFilter = {
  filterName: "Key Location Type",
  paramName: "keyLocationTypeId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  info:"Select the desired key location.",
  type: "dropdown",
  containsLegendInfo: true,
  shouldBeBlankOnInit: false,
  shouldFilterOnValidation: false,
  shouldBeValidated: false,
  shouldFilterOthers: false,
  multiSelect: false,
  isClearable: false,
  values: {
    source: "metadataTable",
    metadataTableName: "key_location_type_list",
    displayColumn: "name",
    paramColumn: "id",
    sort: "ascending",
    legendSubtitleTextColumn: "name"
  },
}

const thresholdValueFilter = {
  filterName: "Threshold Value",
  paramName: "thresholdValue",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  info: "Threshold value to filter data",
  values: thresholdValues
}

const zoneSelectionFilter = {
  filterName: "Select a zone in the map",
  paramName: "zoneId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "map",
  layer: "NoRMS Zones Pair Result",
  field: "id",
}

const landuseFilter = {
  filterName: "Landuse",
  paramName: "landuse",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  info:"Select the Land Use metric to show. Choose between population and employment and desired segmentation (please refer to the “about this visualisation” to know more). ",
  type: "dropdown",
  containsLegendInfo: true,
  shouldBeBlankOnInit: false,
  shouldFilterOnValidation: false,
  shouldBeValidated: false,
  shouldFilterOthers: false,
  multiSelect: false,
  isClearable: false,
  values: landuseValues
}

const landuseSegFilter = {
  filterName: "Landuse Segment 1",
  paramName: "landuseSegment1",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  shouldBeBlankOnInit: false,
  shouldFilterOnValidation: false,
  shouldBeValidated: true,
  shouldFilterOthers: false,
  multiSelect: false,
  isClearable: true,
  values: {
    source: "metadataTable",
    metadataTableName: "landuse_segment_list",
    displayColumn: "segment1",
    paramColumn: "segment1",
    sort: "ascending",
    exclude: []
  },
}

const landuseRefFilter = {
  filterName: "Landuse Reference",
  paramName: "landuseReference",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: landuseReferenceValues
}

const landuseExogFilter = {
  filterName: "Landuse Exog",
  paramName: "landuseExog",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "toggle",
  values: landuseExogValues
}

const journeyTimeMetricFilter = {
  filterName: "Metric",
  paramName: "journey_time",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: ["Journey Time Accessibility Pair"],
  info:"Select the desired metric.",
  type: "dropdown",
  containsLegendInfo: true,
  shouldBeBlankOnInit: false,
  shouldFilterOnValidation: false,
  shouldBeValidated: false,
  shouldFilterOthers: false,
  multiSelect: false,
  isClearable: false,
  values: {
    source: "local",
    values: [
      { paramValue: "journey_time", displayValue: "Journey Time", legendSubtitleText: "mins" },
    ]
  },
}