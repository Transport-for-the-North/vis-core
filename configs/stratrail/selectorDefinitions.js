const linkTOCSelector = {
  filterName: "TOC Selector",
  paramName: "toc",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  info:'Use this dropdown to select various different links by TOC. The full name for each TOC is visible in the "About this visualisation" section.',
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Northern",
        paramValue: 'NT',
      }
    ],
  },
};

const railPeriodSelector = {
  filterName: "Rail Period Selector",
  paramName: "railPeriod",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  info:'Use this dropdown to filter data by rail period. The format for rail period is year/period.',
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "2025/P12",
        paramValue: '2025/P12',
      },
      {
        displayValue: "2025/P13",
        paramValue: "2025/P13",
      },
      {
        displayValue: "2026/P01",
        paramValue: '2026/P01',
      }
    ],
  },
};

const dayOfWeekSelector = {
  filterName: "Day of Week Selector",
  paramName: "serviceWeekday",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  info:'Use this dropdown to filter data by weekday/weekend. Data is shown over the whole rail timetable for weekend and weekdays.',
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
        {
            displayValue: "Weekday",
            paramValue: 'Weekday',
        },
        {
            displayValue: "Weekend",
            paramValue: 'Weekend',
        },
    //   {
    //     displayValue: "Monday",
    //     paramValue: 'Mon',
    //   },
    //   {
    //     displayValue: "Tuesday",
    //     paramValue: 'Tue',
    //   },
    //   {
    //     displayValue: "Wednesday",
    //     paramValue: 'Wed',
    //   },
    //   {
    //     displayValue: "Thursday",
    //     paramValue: 'Thu',
    //   },
    //   {
    //     displayValue: "Friday",
    //     paramValue: 'Fri',
    //   },
    //   {
    //     displayValue: "Saturday",
    //     paramValue: 'Sat',
    //   },
    //   {
    //     displayValue: "Sunday",
    //     paramValue: 'Sun',
    //   }
    ],
  },
};

const loadingsMetricSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }, { action: "UPDATE_LEGEND_TEXT" }
  ],
  info:'Use this dropdown to select the metric that will style the map.',
  visualisations: null,
  containsLegendInfo: true,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Boarders",
        paramValue: "mean_passengers_on",
        legendSubtitleText: "Passengers"
      },
      {
        displayValue: "Alighters",
        paramValue: "mean_passengers_off",
        legendSubtitleText: "Passengers"
      },
      {
        displayValue: "Capacity",
        paramValue: "mean_capacity",
        legendSubtitleText: "Passengers"
      },
      {
        displayValue: "Load on Departure",
        paramValue: "mean_load_on_departure",
        legendSubtitleText: "Passengers"
      }
    ],
  },
};

const timingLinkMetricSelector = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }, { action: "UPDATE_LEGEND_TEXT" }
    ],
    info:'Use this dropdown to select the metric that will style the map.',
    visualisations: null,
    containsLegendInfo: true,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
                displayValue: "Sectional Running Time",
                paramValue: "sectional_running_time_mins",
                legendSubtitleText: "minutes"
            },
            {
                displayValue: "Speed",
                paramValue: "speed_mph",
                legendSubtitleText: "mph"
            }
        ]
    }
}

const nodeTOCSelector = {
  filterName: "TOC Selector",
  paramName: "stationOperator",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  info:'Use this dropdown to select various different stations by TOC. The full name for each TOC is visible in the "About this visualisation" section.',
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Northern",
        paramValue: 'NT',
      },
      {
        displayValue: "East Coast",
        paramValue: 'GR',
      },
      {
        displayValue: "East Midlands",
        paramValue: 'EM',
      },
      {
        displayValue: "West Coast",
        paramValue: 'VT',
      },
      {
        displayValue: "Merseyrail",
        paramValue: 'ME',
      },
      {
        displayValue: "Greater Manchester",
        paramValue: 'GM',
      },
      {
        displayValue: "Network Rail",
        paramValue: 'NR',
      },
      {
        displayValue: "Transport for Wales",
        paramValue: 'AW',
      },
      {
        displayValue: "Transpennine",
        paramValue: 'TP',
      },
      {
        displayValue: "West Midlands",
        paramValue: 'LM',
      },
      {
        displayValue: "London Northwestern",
        paramValue: 'LN',
      }
    ],
  },
};

const booleanSelector = {
    filterName: null,
    paramName: null,
    target: "api",
    info:'Use this dropdown to filter data by selecting True/False values.',
    actions: [
        { action: "UPDATE_QUERY_PARAMS" },
    ],
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
                displayValue: "True",
                paramValue: "true",
            },
            {
                displayValue: "False",
                paramValue: "false",
            }
        ]
    }
}

const routeNameSelector = {
    filterName: "Route",
    paramName: "routeCode",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" },
    ],
    info:'Use this dropdown to filter data by the route. Stations have more than one route.',
    visualisations: null,
    mutltiSelect: true,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
            displayValue: "Leeds-Manchester Victoria (GM)",
            paramValue: "NT8711"
            },
            {
            displayValue: "Leeds-Sheffield (via Wakefield Westgate)(SY)",
            paramValue: "NT8107"
            },
            {
            displayValue: "Manchester-Chester (via Eccles or Earlestown)",
            paramValue: "NT3660"
            },
            {
            displayValue: "Wigan-Kirkby (GM)",
            paramValue: "NT2401"
            },
            {
            displayValue: "Manchester Piccadilly-Rose Hill Marple",
            paramValue: "NT2260"
            },
            {
            displayValue: "Hull-Bridlington",
            paramValue: "NT8388"
            },
            {
            displayValue: "Bradford F Sq-Skipton",
            paramValue: "NT8200"
            },
            {
            displayValue: "Leeds-Lincoln",
            paramValue: "NT8530"
            },
            {
            displayValue: "Manchester-Chester",
            paramValue: "NT2290"
            },
            {
            displayValue: "Leeds-Sheffield (via Wakefield Westgate)(WY)",
            paramValue: "NT8106"
            },
            {
            displayValue: "Leeds-Manchester Victoria",
            paramValue: "NT8710"
            },
            {
            displayValue: "Bradford F Sq-Ilkley",
            paramValue: "NT8216"
            },
            {
            displayValue: "Liverpool - Chester",
            paramValue: "ME3060"
            },
            {
            displayValue: "PenistoneLine (SY)",
            paramValue: "NT8037"
            },
            {
            displayValue: "Manchester-Crewe (GM)",
            paramValue: "NT2331"
            },
            {
            displayValue: "London-Liverpool",
            paramValue: "VT1090"
            },
            {
            displayValue: "Sheffield-Doncaster (SY)",
            paramValue: "NT8077"
            },
            {
            displayValue: "Leeds-Knottingley",
            paramValue: "NT8226"
            },
            {
            displayValue: "West Kirkby/New Brighton",
            paramValue: "ME3052"
            },
            {
            displayValue: "Bishop Auckland/Darlington-Saltburn",
            paramValue: "NT8010"
            },
            {
            displayValue: "Leeds-Knottingley/Goole",
            paramValue: "NT8410"
            },
            {
            displayValue: "Newcastle-Liverpool",
            paramValue: "TP7310"
            },
            {
            displayValue: "Middlesbrough-Manchester Airport",
            paramValue: "TP7340"
            },
            {
            displayValue: "Preston-Ormskirk",
            paramValue: "NT3510"
            },
            {
            displayValue: "Liverpool-Cheter (M)",
            paramValue: "NT2912"
            },
            {
            displayValue: "Manchester Airport -Liverpool (M)",
            paramValue: "NT2482"
            },
            {
            displayValue: "Rochdale-Blackburn (via Manchester)",
            paramValue: "NT2421"
            },
            {
            displayValue: "Newcastle-Ashington",
            paramValue: "NT8110"
            },
            {
            displayValue: "Skipton-Leeds",
            paramValue: "NT8700"
            },
            {
            displayValue: "Lancaster-Windermere",
            paramValue: "NT3610"
            },
            {
            displayValue: "Leeds-Knottingley/Goole(WY)",
            paramValue: "NT8416"
            },
            {
            displayValue: "Manchester-Hazel Grove/Buxton",
            paramValue: "NT2280"
            },
            {
            displayValue: "Nunthorpe-Newcastle (via Hartlepool)",
            paramValue: "NT7920"
            },
            {
            displayValue: "Nunthorpe-Newcastle (via Hartlepool)(TW)",
            paramValue: "NT7924"
            },
            {
            displayValue: "Liverpool-Wigan (M)",
            paramValue: "NT2972"
            },
            {
            displayValue: "London-Hull/Skipton",
            paramValue: "GR7030"
            },
            {
            displayValue: "Sheffield-Lincoln(SY)",
            paramValue: "NT8047"
            },
            {
            displayValue: "Leeds-Selby(WY)",
            paramValue: "NT8356"
            },
            {
            displayValue: "Preston-Barrow",
            paramValue: "NT3540"
            },
            {
            displayValue: "Liverpool-Warrington (M)",
            paramValue: "NT2992"
            },
            {
            displayValue: "Knaresborough-York",
            paramValue: "NT8300"
            },
            {
            displayValue: "Manchester-Crewe (GM)",
            paramValue: "NT2331"
            },
            {
            displayValue: "London-Liverpool",
            paramValue: "VT1090"
            },
            {
            displayValue: "Sheffield-Doncaster (SY)",
            paramValue: "NT8077"
            },
            {
            displayValue: "Leeds-Knottingley",
            paramValue: "NT8226"
            },
            {
            displayValue: "Manchester-Liverpool (via Eccles or Earlestown)",
            paramValue: "NT2980"
            },
            {
            displayValue: "Liverpool - Southport",
            paramValue: "ME3022"
            },
            {
            displayValue: "Newcastle-Hexham",
            paramValue: "NT7960"
            },
            {
            displayValue: "Sheffield-Lincoln",
            paramValue: "NT8040"
            },
            {
            displayValue: "Southport-Alderley Edge",
            paramValue: "NT2240"
            },
            {
            displayValue: "Manchester Airport-Blackpool (GM)",
            paramValue: "NT3621"
            },
            {
            displayValue: "Leeds-York",
            paramValue: "NT8370"
            },
            {
            displayValue: "Sheffield-York",
            paramValue: "NT8450"
            },
            {
            displayValue: "Cumbria Coast",
            paramValue: "NT3580"
            },
            {
            displayValue: "Birmingham-Cardiff",
            paramValue: "XC3330"
            },
            {
            displayValue: "Manchester-Hazel Grove/Buxton(GM)",
            paramValue: "NT2281"
            },
            {
            displayValue: "Hull-Manchester Piccadilly",
            paramValue: "TP7330"
            },
            {
            displayValue: "Manchester Airport -Liverpool",
            paramValue: "NT2480"
            },
            {
            displayValue: "Manchester-Warrington",
            paramValue: "NT2360"
            },
            {
            displayValue: "Leeds-Nottingham",
            paramValue: "NT8650"
            },
            {
            displayValue: "Newcastle-Berwick",
            paramValue: "NT7940"
            },
            {
            displayValue: "Cleethorpes-Barton-on-Humber",
            paramValue: "EM8330"
            },
            {
            displayValue: "London-Leeds/Bradford/Harrogate",
            paramValue: "GR7020"
            },
            {
            displayValue: "Manchester Airport-Barrow/Windermere (GM)",
            paramValue: "NT3571"
            },
            {
            displayValue: "Leeds-Doncaster (WY)",
            paramValue: "NT8246"
            },
            {
            displayValue: "Leeds-Harrogate/Knaresborough",
            paramValue: "NT8306"
            },
            {
            displayValue: "Manchester-Wigan/Southport (GM)",
            paramValue: "NT2251"
            },
            {
            displayValue: "Leeds-Sheffield (via Barnsley)(WY)",
            paramValue: "NT8026"
            },
            {
            displayValue: "PenistoneLine (WY)",
            paramValue: "NT8036"
            },
            {
            displayValue: "Southport-Alderley Edge (GM)",
            paramValue: "NT2321"
            },
            {
            displayValue: "Liverpool - Chester (M)",
            paramValue: "ME3062"
            },
            {
            displayValue: "Newcastle-Carlisle",
            paramValue: "NT7930"
            },
            {
            displayValue: "Bradford F Sq-Skipton (WY)",
            paramValue: "NT8206"
            },
            {
            displayValue: "Manchester Airport-Edinburgh/Glasgow Central",
            paramValue: "TP7300"
            },
            {
            displayValue: "Liverpool-Cheter",
            paramValue: "NT2910"
            },
            {
            displayValue: "Liverpool-Wigan",
            paramValue: "NT2970"
            },
            {
            displayValue: "Wigan-Kirkby",
            paramValue: "NT2400"
            },
            {
            displayValue: "Rochdale-Clitheroe (GM)",
            paramValue: "NT3491"
            }
        ]
    }
}

const stationInformationMetricBoolSelector = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }, { action: "UPDATE_LEGEND_TEXT" }
    ],
    info:'Use this dropdown to select the metric that will style the map.',
    containsLegendInfo: true,
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
                displayValue: "Help Points",
                paramValue: "help_points",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Ticket Purchase - Weekdays",
                paramValue: "ticket_weekday",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Ticket Purchase - Weekend",
                paramValue: "ticket_weekend",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Ticket Machine",
                paramValue: "ticket_machine",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Ticket Office",
                paramValue: "ticket_office",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Seated Areas",
                paramValue: "seated_area",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Ramp Access",
                paramValue: "ramp_access",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Toilets",
                paramValue: "national_key_toilet",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Wheelchairs Available",
                paramValue: "wheelchair_avail",
                legendSubtitleText: "True/False"
            },
            {
                displayValue: "Car Park Free?",
                paramValue: "carpark_free",
                legendSubtitleText: "True/False"
            },
        ]
    }
}

const stationInformationMetricSelector = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }, { action: "UPDATE_LEGEND_TEXT" }
    ],
    info:'Use this dropdown to select the metric that will style the map.',
    containsLegendInfo: true,
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
                displayValue: "Car Park Spaces",
                paramValue: "carpark_spaces",
                legendSubtitleText: "Spaces"
            },
            {
                displayValue: "Cycle Spaces",
                paramValue: "cycle_spaces",
                legendSubtitleText: "Spaces"
            },
            // {
            //     displayValue: "Help Points",
            //     paramValue: "help_points",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Ticket Purchase - Weekdays",
            //     paramValue: "ticket_weekday",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Ticket Purchase - Weekend",
            //     paramValue: "ticket_weekend",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Ticket Machine",
            //     paramValue: "ticket_machine",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Ticket Office",
            //     paramValue: "ticket_office",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Seated Areas",
            //     paramValue: "seated_area",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Ramp Access",
            //     paramValue: "ramp_access",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Toilets",
            //     paramValue: "national_key_toilet",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Wheelchairs Available",
            //     paramValue: "wheelchair_avail",
            //     legendSubtitleText: "True/False"
            // },
            // {
            //     displayValue: "Car Park Free?",
            //     paramValue: "carpark_free",
            //     legendSubtitleText: "True/False"
            // },
        ]
    }
}

const stationNSSeCMetricSelector = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }, { action: "UPDATE_LEGEND_TEXT" }
    ],
    info:'Use this dropdown to select the metric that will style the map.',
    containsLegendInfo: true,
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
                displayValue: "L1, L2 and L3",
                paramValue: "l1_l2_l3",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L4, L5 and L6",
                paramValue: "l4_l5_l6",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L7",
                paramValue: "l7",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L8 and L9",
                paramValue: "l8_l9",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L10 and L11",
                paramValue: "l10_l11",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L12",
                paramValue: "l12",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L13",
                paramValue: "l13",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L14(1) and L14(2)",
                paramValue: "l14_1_l14_2",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L15",
                paramValue: "l15",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "L1, L2 and L3 (%)",
                paramValue: "percent_l1_l2_l3",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L4, L5 and L6 (%)",
                paramValue: "percent_l4_l5_l6",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L7 (%)",
                paramValue: "percent_l7",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L8 and L9 (%)",
                paramValue: "percent_l8_l9",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L10 and L11 (%)",
                paramValue: "percent_l10_l11",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L12 (%)",
                paramValue: "percent_l12",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L13 (%)",
                paramValue: "percent_l13",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L14(1) and L14(2) (%)",
                paramValue: "percent_l14_1_l14_2",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "L15 (%)",
                paramValue: "percent_l15",
                legendSubtitleText: "% of Individuals"
            }
        ]
    }
}

const stationSocioMetricSelector = {
    filterName: "Metric",
    paramName: "columnName",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }, { action: "UPDATE_LEGEND_TEXT" }
    ],
    info:'Use this dropdown to select the metric that will style the map.',
    containsLegendInfo: true,
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            {
                displayValue: "Economically Active (exc students)",
                paramValue: "economically_active_exc_students",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "Economically Active (inc students)",
                paramValue: "economically_active_inc_student",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "Economically Inactive",
                paramValue: "economically_inactive",
                legendSubtitleText: "Individuals"
            },
            {
                displayValue: "Economically Active (exc students) (%)",
                paramValue: "percent_economically_active_exc_students",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "Economically Active (inc students) (%)",
                paramValue: "percent_economically_active_inc_student",
                legendSubtitleText: "% of Individuals"
            },
            {
                displayValue: "Economically Inactive (%)",
                paramValue: "percent_economically_inactive",
                legendSubtitleText: "% of Individuals"
            }
        ]
    }
}

const nodeInvestmentThemeSelector = {
    filterName: "Theme",
    paramName: "theme",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }
    ],
    info:'Use this dropdown to select the theme of the investments.',
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            { displayValue: "Infrastructure Upgrade", paramValue: "Infrastructure Upgrade" },
            { displayValue: "Electrification", paramValue: "Electrification" },
            { displayValue: "Route Upgrade", paramValue: "Route Upgrade" },
            { displayValue: "Station Improvement", paramValue: "Station Improvement" },
            { displayValue: "Freight", paramValue: "Freight" },
            { displayValue: "New Station", paramValue: "New Station" },
            { displayValue: "Performance and Reliability", paramValue: "Performance and Reliability" },
            { displayValue: "Neighbouring Development", paramValue: "Neighbouring Development" },
            { displayValue: "New Infrastructure", paramValue: "New Infrastructure" },
            { displayValue: "Service Development", paramValue: "Service Development" }
        ]
    }
}

const linkInvestmentThemeSelector = {
    filterName: "Theme",
    paramName: "theme",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }
    ],
    info:'Use this dropdown to select the theme of the investments.',
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            { displayValue: "Infrastructure Upgrade", paramValue: "Infrastructure Upgrade" },
            { displayValue: "Electrification", paramValue: "Electrification" },
            { displayValue: "Route Upgrade", paramValue: "Route Upgrade" },
            { displayValue: "Station Improvement", paramValue: "Station Improvement" },
            { displayValue: "Freight", paramValue: "Freight" },
            { displayValue: "Performance and Reliability", paramValue: "Performance and Reliability" },
            { displayValue: "New Infrastructure", paramValue: "New Infrastructure" },
            { displayValue: "Service Development", paramValue: "Service Development" }
        ]
    }
}

const investmentFeatureSelector = {
  filterName: "",
  paramName: "featureId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "map",
  layer: null,
  field: "id",
}

const authoritySelector = {
    filterName: "Authority",
    paramName: "authorityCode",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }
    ],
    info:'Use this dropdown to select the authority that stations fall under. Any stations outside of the north are labelled as "Outside Northern Authorities".',
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            { displayValue: "Cheshire East", paramValue: "1" },
            { displayValue: "Cheshire West and Chester", paramValue: "2" },
            { displayValue: "Cumberland Council", paramValue: "3" },
            { displayValue: "Derbyshire", paramValue: "4" },
            { displayValue: "Greater Manchester Combined Authority", paramValue: "5" },
            { displayValue: "Hull and East Yorkshire", paramValue: "6" },
            { displayValue: "Lancashire County Combined Authority", paramValue: "7" },
            { displayValue: "Lincolnshire", paramValue: "8" },
            { displayValue: "Liverpool City Region", paramValue: "9" },
            { displayValue: "North East Combined Authority", paramValue: "10" },
            { displayValue: "Nottinghamshire", paramValue: "11" },
            { displayValue: "South Yorkshire Mayoral Combined Authority", paramValue: "12" },
            { displayValue: "Staffordshire", paramValue: "13" },
            { displayValue: "Tees Valley Combined Authority", paramValue: "14" },
            { displayValue: "Warrington Borough Council", paramValue: "15" },
            { displayValue: "West Yorkshire Combined Authority", paramValue: "16" },
            { displayValue: "Westmorland and Funess", paramValue: "17" },
            { displayValue: "York and North Yorkshire", paramValue: "18" },
            { displayValue: "Outside Northern Authorities", paramValue: "19" },
        ]
    }
}

const timePeriod = {
    filterName: "Time Period",
    paramName: "timePeriod",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }
    ],
    info:'Use this dropdown to select the time period for the data.',
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            { displayValue: "AM (7-10AM)", paramValue: "AM" },
            { displayValue: "IP (10AM-4PM)", paramValue: "IP" },
            { displayValue: "PM (4-7PM)", paramValue: "PM" },
            { displayValue: "OP (7PM-7AM)", paramValue: "OP" },
        ]
    }
}

const nodeFreightInterventionSelector = {
    filterName: "Freight Intervention",
    paramName: "freightIntervention",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }
    ],
    info:'Use this dropdown to select the freight intervention for the data.',
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [

        ]
    }
}

const linkFreightInterventionSelector = {
    filterName: "Freight Intervention",
    paramName: "freightIntervention",
    target: "api",
    actions: [
        { action: "UPDATE_QUERY_PARAMS" }
    ],
    info:'Use this dropdown to select the freight intervention for the data.',
    visualisations: null,
    type: "dropdown",
    values: {
        source: "local",
        values: [
            
        ]
    }
}

export const selectors = {
  linkTOCSelector: linkTOCSelector,
  railPeriodSelector: railPeriodSelector,
  dayOfWeekSelector: dayOfWeekSelector,
  loadingsMetricSelector: loadingsMetricSelector,
  timingLinkMetricSelector: timingLinkMetricSelector,
  nodeTOCSelector: nodeTOCSelector,
  booleanSelector: booleanSelector,
  routeNameSelector: routeNameSelector,
  stationSocioMetricSelector: stationSocioMetricSelector,
  stationNSSeCMetricSelector: stationNSSeCMetricSelector,
  stationInformationMetricSelector: stationInformationMetricSelector,
  stationInformationMetricBoolSelector: stationInformationMetricBoolSelector,
  nodeInvestmentThemeSelector: nodeInvestmentThemeSelector,
  linkInvestmentThemeSelector: linkInvestmentThemeSelector,
  investmentFeatureSelector: investmentFeatureSelector,
  authoritySelector: authoritySelector,
  timePeriod: timePeriod,
  nodeFreightInterventionSelector: nodeFreightInterventionSelector,
  linkFreightInterventionSelector: linkFreightInterventionSelector
};