const linkTOCSelector = {
  filterName: "TOC Selector",
  paramName: "toc",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  info:'Use this dropdown to filter links by train operator.',
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
    { displayValue: "2025/P05", paramValue: "2025/P05" },
    { displayValue: "2025/P06", paramValue: "2025/P06" },
    { displayValue: "2025/P07", paramValue: "2025/P07" },
    { displayValue: "2025/P08", paramValue: "2025/P08" },
    { displayValue: "2025/P09", paramValue: "2025/P09" },
    { displayValue: "2025/P10", paramValue: "2025/P10" },
    { displayValue: "2025/P11", paramValue: "2025/P11" },
    { displayValue: "2025/P12", paramValue: "2025/P12" },
    { displayValue: "2025/P13", paramValue: "2025/P13" },
    { displayValue: "2026/P01", paramValue: "2026/P01" },
    { displayValue: "2026/P02", paramValue: "2026/P02" },
    { displayValue: "2026/P03", paramValue: "2026/P03" },
    { displayValue: "2026/P04", paramValue: "2026/P04" },
    { displayValue: "2026/P05", paramValue: "2026/P05" }
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
  info:'Use this dropdown to filter data by weekday/weekend.',
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
    ],
  },
};

const linkLoadingsMetricSelector = {
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
        displayValue: "Load on Departure",
        paramValue: "mean_load_on_departure",
        legendSubtitleText: "Passengers"
      }
    ],
  },
};

const nodeLoadingsMetricSelector = {
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
  info:'Use this dropdown to filter nodes by station operator.',
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
            { displayValue: "Manchester Airport - Blackpool", paramValue: "NT3621" },
            { displayValue: "Bradford F Sq - Skipton", paramValue: "NT8206" },
            { displayValue: "Hull - Manchester Piccadilly", paramValue: "TP7330" },
            { displayValue: "London - Hull/Skipton", paramValue: "GR7030" },
            { displayValue: "Leeds - Carlisle", paramValue: "NT1510" },
            { displayValue: "London - Wolverhampton", paramValue: "VT1000" },
            { displayValue: "Manchester Piccadilly - Hadfield/Glossop", paramValue: "NT2301" },
            { displayValue: "Halifax - Leeds", paramValue: "NT8686" },
            { displayValue: "Newcastle - Ashington", paramValue: "NT8110" },
            { displayValue: "Doncaster - Goole", paramValue: "NT8167" },
            { displayValue: "Leeds - Knottingley/Goole", paramValue: "NT8416" },
            { displayValue: "Leeds - Knottingley/Goole", paramValue: "NT8410" },
            { displayValue: "Leeds - Doncaster", paramValue: "NT8247" },
            { displayValue: "Hunts Cross - Liverpool", paramValue: "ME3012" },
            { displayValue: "Bishop Auckland/Darlington - Saltburn", paramValue: "NT8010" },
            { displayValue: "Manchester - Chester", paramValue: "NT2290" },
            { displayValue: "Middlesbrough - Manchester Airport", paramValue: "TP7340" },
            { displayValue: "Leeds - Harrogate/Knaresborough", paramValue: "NT8306" },
            { displayValue: "Leeds - Manchester Victoria", paramValue: "NT8711" },
            { displayValue: "Wigan - Kirkby", paramValue: "NT2400" },
            { displayValue: "Leeds - Sheffield (via Barnsley)", paramValue: "NT8027" },
            { displayValue: "Manchester - Wigan/Southport", paramValue: "NT2250" },
            { displayValue: "Birmingham - South West", paramValue: "XC1840" },
            { displayValue: "Manchester - Stoke", paramValue: "NT2311" },
            { displayValue: "Newcastle - Liverpool", paramValue: "TP7310" },
            { displayValue: "Leeds - Sheffield (via Barnsley)", paramValue: "NT8026" },
            { displayValue: "Manchester - Crewe", paramValue: "NT2330" },
            { displayValue: "Leeds - York", paramValue: "NT8370" },
            { displayValue: "Rochdale - Clitheroe", paramValue: "NT3491" },
            { displayValue: "Nunthorpe - Newcastle (via Hartlepool)", paramValue: "NT7920" },
            { displayValue: "Sheffield - York", paramValue: "NT8450" },
            { displayValue: "London - Aberdeen/Inverness", paramValue: "GR7010" },
            { displayValue: "Leeds - York (from Blackpool)", paramValue: "NT7370" },
            { displayValue: "Manchester Airport - Edinburgh/Glasgow Central", paramValue: "TP7300" },
            { displayValue: "Newcastle - Saltburn", paramValue: "NT7910" },
            { displayValue: "Birmingham - Cardiff", paramValue: "XC3330" },
            { displayValue: "Penistone Line", paramValue: "NT8036" },
            { displayValue: "Bradford F Sq - Ilkley", paramValue: "NT8216" },
            { displayValue: "West Midlands", paramValue: "0000LM" },
            { displayValue: "Liverpool - Chester", paramValue: "NT2910" },
            { displayValue: "Liverpool - Wigan", paramValue: "NT2970" },
            { displayValue: "Liverpool - Chester", paramValue: "ME3062" },
            { displayValue: "Leeds - Sheffield (via Wakefield Westgate)", paramValue: "NT8106" },
            { displayValue: "Sheffield - Lincoln", paramValue: "NT8040" },
            { displayValue: "Hull - Sheffield", paramValue: "NT8080" },
            { displayValue: "Cleethorpes - Barton-on-Humber", paramValue: "EM8330" },
            { displayValue: "Birmingham - Glasgow", paramValue: "VT1140" },
            { displayValue: "Skipton - Leeds", paramValue: "NT8700" },
            { displayValue: "Liverpool - Kirkby", paramValue: "ME3032" },
            { displayValue: "Manchester - Blackburn (via Rochdale)", paramValue: "NT2420" },
            { displayValue: "Manchester - Crewe", paramValue: "NT2331" },
            { displayValue: "Liverpool - Blackpool", paramValue: "NT2490" },
            { displayValue: "Southport - Alderley Edge", paramValue: "NT2321" },
            { displayValue: "Stalybridge - Liverpool", paramValue: "NT2201" },
            { displayValue: "Birmingham - Manchester", paramValue: "XC1860" },
            { displayValue: "Manchester - Liverpool (via Eccles or Earlestown)", paramValue: "NT2980" },
            { displayValue: "Leeds - Manchester Victoria", paramValue: "NT8710" },
            { displayValue: "London - Manchester", paramValue: "VT1080" },
            { displayValue: "Lancaster - Morecambe", paramValue: "NT3520" },
            { displayValue: "Preston - Barrow", paramValue: "NT3540" },
            { displayValue: "Sheffield - Lincoln", paramValue: "NT8047" },
            { displayValue: "Bradford F Sq - Skipton", paramValue: "NT8200" },
            { displayValue: "Leeds - Bradford Forster Square", paramValue: "NT8186" },
            { displayValue: "Manchester Piccadilly - New Mills Central/Sheffield", paramValue: "NT2261" },
            { displayValue: "Manchester - Warrington", paramValue: "NT2360" },
            { displayValue: "Liverpool - Ormskirk", paramValue: "ME3042" },
            { displayValue: "Station Closed", paramValue: "Station Closed" },
            { displayValue: "Liverpool - Southport", paramValue: "ME3022" },
            { displayValue: "London - Leeds/Bradford/Harrogate", paramValue: "GR7020" },
            { displayValue: "Liverpool - Warrington", paramValue: "NT2992" },
            { displayValue: "Leeds - Skipton", paramValue: "NT8706" },
            { displayValue: "Nunthorpe - Newcastle (via Hartlepool)", paramValue: "NT7924" },
            { displayValue: "Manchester Airport  - Liverpool", paramValue: "NT2481" },
            { displayValue: "Blackpool - Colne", paramValue: "NT3500" },
            { displayValue: "Manchester Airport - Blackpool", paramValue: "NT3620" },
            { displayValue: "Stalybridge - Southport", paramValue: "NT2241" },
            { displayValue: "East Midlands", paramValue: "0000EM" },
            { displayValue: "Manchester Airport - Barrow/Windermere", paramValue: "NT3571" },
            { displayValue: "Manchester - Liverpool (via Eccles or Earlestown)", paramValue: "NT2982" },
            { displayValue: "Liverpool - Blackpool", paramValue: "NT2492" },
            { displayValue: "Leeds - Lancaster", paramValue: "NT8690" },
            { displayValue: "Preston - Ormskirk", paramValue: "NT3510" },
            { displayValue: "Birmingham - Leicester", paramValue: "XC2600" },
            { displayValue: "Liverpool - Ormskirk", paramValue: "ME3040" },
            { displayValue: "Scarborough - Bridlington", paramValue: "NT8389" },
            { displayValue: "Manchester - Chester", paramValue: "NT2291" },
            { displayValue: "Manchester Airport  - Liverpool", paramValue: "NT2480" },
            { displayValue: "Lancaster - Windermere", paramValue: "NT3610" },
            { displayValue: "York - Hull", paramValue: "NT8060" },
            { displayValue: "London - Liverpool", paramValue: "VT1090" },
            { displayValue: "Leeds - Selby", paramValue: "NT8350" },
            { displayValue: "Sheffield - Cleethorpes", paramValue: "NT8050" },
            { displayValue: "Wigan - Kirkby", paramValue: "NT2401" },
            { displayValue: "Liverpool - Chester", paramValue: "ME3060" },
            { displayValue: "Manchester - Hazel Grove/Buxton", paramValue: "NT2281" },
            { displayValue: "Leeds - Ilkley", paramValue: "NT8196" },
            { displayValue: "Manchester - Chester (via Eccles or Earlestown)", paramValue: "NT3660" },
            { displayValue: "Manchester - Hazel Grove/Buxton", paramValue: "NT2280" },
            { displayValue: "Rochdale - Blackburn (via Manchester)", paramValue: "NT2421" },
            { displayValue: "Leeds - Huddersfield (via Bradford)", paramValue: "NT8746" },
            { displayValue: "West Kirkby/New Brighton", paramValue: "ME3052" },
            { displayValue: "Birmingham - Cambridge", paramValue: "XC2680" },
            { displayValue: "Sheffield - Doncaster", paramValue: "NT8077" },
            { displayValue: "Doncaster - Scunthorpe", paramValue: "NT8257" },
            { displayValue: "Stockport - Stalybridge", paramValue: "NT2270" },
            { displayValue: "Newcastle - Carlisle", paramValue: "NT7930" },
            { displayValue: "Leeds - Manchester Victoria", paramValue: "NT8716" },
            { displayValue: "Knaresborough - York", paramValue: "NT8300" },
            { displayValue: "Manchester Airport - Barrow/Windermere", paramValue: "NT3570" },
            { displayValue: "London - Hereford", paramValue: "VT1040" },
            { displayValue: "Leeds - Sheffield (via Wakefield Westgate)", paramValue: "NT8107" },
            { displayValue: "Manchester Airport  - Liverpool", paramValue: "NT2482" },
            { displayValue: "Leeds - Doncaster", paramValue: "NT8246" },
            { displayValue: "Manchester Piccadilly - Rose Hill Marple", paramValue: "NT2260" },
            { displayValue: "Birmingham - Coast", paramValue: "XC1850" },
            { displayValue: "Cumbria Coast", paramValue: "NT3580" },
            { displayValue: "Liverpool - Wigan", paramValue: "NT2972" },
            { displayValue: "Liverpool - Chester", paramValue: "NT2912" },
            { displayValue: "Leeds - Selby", paramValue: "NT8356" },
            { displayValue: "Penistone Line", paramValue: "NT8037" },
            { displayValue: "Plymouth - Edinburgh (via Leeds)", paramValue: "XC1830" },
            { displayValue: "London - Glasgow", paramValue: "VT1120" },
            { displayValue: "Manchester - Warrington", paramValue: "NT2361" },
            { displayValue: "Newcastle - Berwick", paramValue: "NT7940" },
            { displayValue: "Southport - Alderley Edge", paramValue: "NT2240" },
            { displayValue: "London - Newcastle/Edinburgh", paramValue: "GR7000" },
            { displayValue: "Scarborough - Liverpool", paramValue: "TP7320" },
            { displayValue: "Transport for Wales", paramValue: "0000AW" },
            { displayValue: "Hull - Sheffield", paramValue: "NT8087" },
            { displayValue: "Liverpool - Warrington", paramValue: "NT2990" },
            { displayValue: "Leeds - Nottingham", paramValue: "NT8650" },
            { displayValue: "Leeds - Lincoln", paramValue: "NT8530" },
            { displayValue: "Rochdale - Clitheroe", paramValue: "NT3490" },
            { displayValue: "Manchester - Wigan/Southport", paramValue: "NT2251" },
            { displayValue: "Middlesbrough - Nunthorpe/Whitby", paramValue: "NT8000" },
            { displayValue: "Leeds - Knottingley", paramValue: "NT8226" },
            { displayValue: "Leeds - York", paramValue: "NT8376" },
            { displayValue: "Manchester - Cleethorpes", paramValue: "TP8170" },
            { displayValue: "Newcastle - Hexham", paramValue: "NT7960" },
            { displayValue: "Manchester Piccadilly - Crewe (via Stockport and Wilmslow)", paramValue: "NT2320" },
            { displayValue: "Manchester - Stoke", paramValue: "NT2310" },
            { displayValue: "Hull - Bridlington", paramValue: "NT8388" }
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
                paramValue: "wheelchairs_avail",
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

export const selectors = {
  linkTOCSelector: linkTOCSelector,
  railPeriodSelector: railPeriodSelector,
  dayOfWeekSelector: dayOfWeekSelector,
  linkLoadingsMetricSelector: linkLoadingsMetricSelector,
  nodeLoadingsMetricSelector: nodeLoadingsMetricSelector,
  timingLinkMetricSelector: timingLinkMetricSelector,
  nodeTOCSelector: nodeTOCSelector,
  booleanSelector: booleanSelector,
  routeNameSelector: routeNameSelector,
  stationSocioMetricSelector: stationSocioMetricSelector,
  stationNSSeCMetricSelector: stationNSSeCMetricSelector,
  stationInformationMetricSelector: stationInformationMetricSelector,
  stationInformationMetricBoolSelector: stationInformationMetricBoolSelector,
  authoritySelector: authoritySelector,
  timePeriod: timePeriod,
};