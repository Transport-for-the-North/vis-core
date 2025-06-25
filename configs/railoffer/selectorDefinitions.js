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
        displayValue: "NT",
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
  type: "toggle",
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
        displayValue: "NT",
        paramValue: 'NT',
      },
      {
        displayValue: "GR",
        paramValue: 'GR',
      },
      {
        displayValue: "EM",
        paramValue: 'EM',
      },
      {
        displayValue: "VT",
        paramValue: 'VT',
      },
      {
        displayValue: "ME",
        paramValue: 'ME',
      },
      {
        displayValue: "GM",
        paramValue: 'GM',
      },
      {
        displayValue: "NR",
        paramValue: 'NR',
      },
      {
        displayValue: "AW",
        paramValue: 'AW',
      },
      {
        displayValue: "TP",
        paramValue: 'TP',
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
    paramName: "routeName",
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
                displayValue: "Hull-Sheffield (SY)",
                paramValue: "Hull-Sheffield (SY)"
            },
            {
                displayValue: "Hull-Sheffield",
                paramValue: "Hull-Sheffield"
            },
            {
                displayValue: "Leeds-Skipton",
                paramValue: "Leeds-Skipton"
            },
            {
                displayValue: "Doncaster-Scunthorpe (SY)",
                paramValue: "Doncaster-Scunthorpe (SY)"
            },
            {
                displayValue: "Leeds-Manchester Victoria (WY)",
                paramValue: "Leeds-Manchester Victoria (WY)"
            },
            {
                displayValue: "Plymouth-Edinburgh (via Leeds)",
                paramValue: "Plymouth-Edinburgh (via Leeds)"
            },
            {
                displayValue: "Middlesbrough-Nunthorpe/Whitby",
                paramValue: "Middlesbrough-Nunthorpe/Whitby"
            },
            {
                displayValue: "Leeds-Huddersfield (via Bradford)",
                paramValue: "Leeds-Huddersfield (via Bradford)"
            },
            {
                displayValue: "Manchester-Stoke (GM)",
                paramValue: "Manchester-Stoke (GM)"
            },
            {
                displayValue: "Manchester-Stoke",
                paramValue: "Manchester-Stoke"
            },
            {
                displayValue: "Leeds-Carlisle",
                paramValue: "Leeds-Carlisle"
            },
            {
                displayValue: "Leeds-Manchester Victoria (GM)",
                paramValue: "Leeds-Manchester Victoria (GM)"
            },
            {
                displayValue: "Leeds-Sheffield (via Wakefield Westgate)(SY)",
                paramValue: "Leeds-Sheffield (via Wakefield Westgate)(SY)"
            },
            {
                displayValue: "Manchester-Chester (via Eccles or Earlestown)",
                paramValue: "Manchester-Chester (via Eccles or Earlestown)"
            },
            {
                displayValue: "Wigan-Kirkby (GM)",
                paramValue: "Wigan-Kirkby (GM)"
            },
            {
                displayValue: "Manchester Piccadilly-Rose Hill Marple",
                paramValue: "Manchester Piccadilly-Rose Hill Marple"
            },
            {
                displayValue: "Hull-Bridlington",
                paramValue: "Hull-Bridlington"
            },
            {
                displayValue: "Bradford F Sq-Skipton",
                paramValue: "Bradford F Sq-Skipton"
            },
            {
                displayValue: "Leeds-Lincoln",
                paramValue: "Leeds-Lincoln"
            },
            {
                displayValue: "Manchester-Chester",
                paramValue: "Manchester-Chester"
            },
            {
                displayValue: "Leeds-Sheffield (via Wakefield Westgate)(WY)",
                paramValue: "Leeds-Sheffield (via Wakefield Westgate)(WY)"
            },
            {
                displayValue: "Leeds-Manchester Victoria",
                paramValue: "Leeds-Manchester Victoria"
            },
            {
                displayValue: "Bradford F Sq-Ilkley",
                paramValue: "Bradford F Sq-Ilkley"
            },
            {
                displayValue: "Liverpool - Chester",
                paramValue: "Liverpool - Chester"
            },
            {
                displayValue: "PenistoneLine (SY)",
                paramValue: "PenistoneLine (SY)"
            },
            {
                displayValue: "Manchester-Crewe (GM)",
                paramValue: "Manchester-Crewe (GM)"
            },
            {
                displayValue: "London-Liverpool",
                paramValue: "London-Liverpool"
            },
            {
                displayValue: "Sheffield-Doncaster (SY)",
                paramValue: "Sheffield-Doncaster (SY)"
            },
            {
                displayValue: "Leeds-Knottingley",
                paramValue: "Leeds-Knottingley"
            },
            {
                displayValue: "West Kirkby/New Brighton",
                paramValue: "West Kirkby/New Brighton"
            },
            {
                displayValue: "Bishop Auckland/Darlington-Saltburn",
                paramValue: "Bishop Auckland/Darlington-Saltburn"
            },
            {
                displayValue: "Manchester-Liverpool (via Eccles or Earlestown)",
                paramValue: "Manchester-Liverpool (via Eccles or Earlestown)"
            },
            {
                displayValue: "Liverpool - Southport",
                paramValue: "Liverpool - Southport"
            },
            {
                displayValue: "Newcastle-Hexham",
                paramValue: "Newcastle-Hexham"
            },
            {
                displayValue: "Sheffield-Lincoln",
                paramValue: "Sheffield-Lincoln"
            },
            {
                displayValue: "Southport-Alderley Edge",
                paramValue: "Southport-Alderley Edge"
            },
            {
                displayValue: "Manchester Airport-Blackpool (GM)",
                paramValue: "Manchester Airport-Blackpool (GM)"
            },
            {
                displayValue: "Leeds-York",
                paramValue: "Leeds-York"
            },
            {
                displayValue: "Sheffield-York",
                paramValue: "Sheffield-York"
            },
            {
                displayValue: "Cumbria Coast",
                paramValue: "Cumbria Coast"
            },
            {
                displayValue: "Birmingham-Cardiff",
                paramValue: "Birmingham-Cardiff"
            },
            {
                displayValue: "Manchester-Hazel Grove/Buxton(GM)",
                paramValue: "Manchester-Hazel Grove/Buxton(GM)"
            },
            {
                displayValue: "Hull-Manchester Piccadilly",
                paramValue: "Hull-Manchester Piccadilly"
            },
            {
                displayValue: "Manchester Airport -Liverpool",
                paramValue: "Manchester Airport -Liverpool"
            },
            {
                displayValue: "Manchester-Warrington",
                paramValue: "Manchester-Warrington"
            },
            {
                displayValue: "Leeds-Nottingham",
                paramValue: "Leeds-Nottingham"
            },
            {
                displayValue: "Newcastle-Berwick",
                paramValue: "Newcastle-Berwick"
            },
            {
                displayValue: "Cleethorpes-Barton-on-Humber",
                paramValue: "Cleethorpes-Barton-on-Humber"
            },
            {
                displayValue: "Leeds-York(WY)",
                paramValue: "Leeds-York(WY)"
            },
            {
                displayValue: "Leeds-Doncaster (SY)",
                paramValue: "Leeds-Doncaster (SY)"
            },
            {
                displayValue: "Halifax-Leeds",
                paramValue: "Halifax-Leeds"
            },
            {
                displayValue: "Manchester-Wigan/Southport",
                paramValue: "Manchester-Wigan/Southport"
            },
            {
                displayValue: "Blackpool-Colne",
                paramValue: "Blackpool-Colne"
            },
            {
                displayValue: "Scarborough-Bridlington",
                paramValue: "Scarborough-Bridlington"
            },
            {
                displayValue: "Manchester Piccadilly-Hadfield/Glossop",
                paramValue: "Manchester Piccadilly-Hadfield/Glossop"
            },
            {
                displayValue: "Doncaster-Goole (SY)",
                paramValue: "Doncaster-Goole (SY)"
            },
            {
                displayValue: "Leeds-Knottingley/Goole",
                paramValue: "Leeds-Knottingley/Goole"
            },
            {
                displayValue: "Newcastle-Liverpool",
                paramValue: "Newcastle-Liverpool"
            },
            {
                displayValue: "Middlesbrough-Manchester Airport",
                paramValue: "Middlesbrough-Manchester Airport"
            },
            {
                displayValue: "Preston-Ormskirk",
                paramValue: "Preston-Ormskirk"
            },
            {
                displayValue: "Liverpool-Cheter (M)",
                paramValue: "Liverpool-Cheter (M)"
            },
            {
                displayValue: "Manchester Airport -Liverpool (M)",
                paramValue: "Manchester Airport -Liverpool (M)"
            },
            {
                displayValue: "Rochdale-Blackburn (via Manchester)",
                paramValue: "Rochdale-Blackburn (via Manchester)"
            },
            {
                displayValue: "Newcastle-Ashington",
                paramValue: "Newcastle-Ashington"
            },
            {
                displayValue: "Skipton-Leeds",
                paramValue: "Skipton-Leeds"
            },
            {
                displayValue: "Lancaster-Windermere",
                paramValue: "Lancaster-Windermere"
            },
            {
                displayValue: "Leeds-Knottingley/Goole(WY)",
                paramValue: "Leeds-Knottingley/Goole(WY)"
            },
            {
                displayValue: "Manchester-Hazel Grove/Buxton",
                paramValue: "Manchester-Hazel Grove/Buxton"
            },
            {
                displayValue: "Nunthorpe-Newcastle (via Hartlepool)",
                paramValue: "Nunthorpe-Newcastle (via Hartlepool)"
            },
            {
                displayValue: "Nunthorpe-Newcastle (via Hartlepool)(TW)",
                paramValue: "Nunthorpe-Newcastle (via Hartlepool)(TW)"
            },
            {
                displayValue: "Liverpool-Wigan (M)",
                paramValue: "Liverpool-Wigan (M)"
            },
            {
                displayValue: "London-Hull/Skipton",
                paramValue: "London-Hull/Skipton"
            },
            {
                displayValue: "Sheffield-Lincoln(SY)",
                paramValue: "Sheffield-Lincoln(SY)"
            },
            {
                displayValue: "Leeds-Selby(WY)",
                paramValue: "Leeds-Selby(WY)"
            },
            {
                displayValue: "Preston-Barrow",
                paramValue: "Preston-Barrow"
            },
            {
                displayValue: "Liverpool-Warrington (M)",
                paramValue: "Liverpool-Warrington (M)"
            },
            {
                displayValue: "Knaresborough-York",
                paramValue: "Knaresborough-York"
            },
            {
                displayValue: "Liverpool-Blackpool",
                paramValue: "Liverpool-Blackpool"
            },
            {
                displayValue: "Stockport-Stalybridge",
                paramValue: "Stockport-Stalybridge"
            },
            {
                displayValue: "Lancaster-Morecambe",
                paramValue: "Lancaster-Morecambe"
            },
            {
                displayValue: "York-Hull",
                paramValue: "York-Hull"
            },
            {
                displayValue: "Scarborough-Liverpool",
                paramValue: "Scarborough-Liverpool"
            },
            {
                displayValue: "Leeds-Bradford Forster Square",
                paramValue: "Leeds-Bradford Forster Square"
            },
            {
                displayValue: "Liverpool-Warrington",
                paramValue: "Liverpool-Warrington"
            },
            {
                displayValue: "Manchester Airport -Liverpool (GM)",
                paramValue: "Manchester Airport -Liverpool (GM)"
            },
            {
                displayValue: "Liverpool - Ormskirk",
                paramValue: "Liverpool - Ormskirk"
            },
            {
                displayValue: "Liverpool-Blackpool  (M)",
                paramValue: "Liverpool-Blackpool  (M)"
            },
            {
                displayValue: "Stalybridge-Liverpool (GM)",
                paramValue: "Stalybridge-Liverpool (GM)"
            },
            {
                displayValue: "Manchester-Chester (GM)",
                paramValue: "Manchester-Chester (GM)"
            },
            {
                displayValue: "Sheffield-Cleethorpes",
                paramValue: "Sheffield-Cleethorpes"
            },
            {
                displayValue: "Hunts Cross - Liverpool",
                paramValue: "Hunts Cross - Liverpool"
            },
            {
                displayValue: "Manchester-Blackburn (via Rochdale)",
                paramValue: "Manchester-Blackburn (via Rochdale)"
            },
            {
                displayValue: "Manchester-Warrington (GM)",
                paramValue: "Manchester-Warrington (GM)"
            },
            {
                displayValue: "Leeds-Lancaster",
                paramValue: "Leeds-Lancaster"
            },
            {
                displayValue: "Newcastle-Saltburn",
                paramValue: "Newcastle-Saltburn"
            },
            {
                displayValue: "Liverpool - Kirkby",
                paramValue: "Liverpool - Kirkby"
            },
            {
                displayValue: "Manchester Piccadilly-New Mills Central/Sheffield",
                paramValue: "Manchester Piccadilly-New Mills Central/Sheffield"
            },
            {
                displayValue: "Manchester-Cleethorpes",
                paramValue: "Manchester-Cleethorpes"
            },
            {
                displayValue: "Manchester Airport - Barrow/Windermere",
                paramValue: "Manchester Airport - Barrow/Windermere"
            },
            {
                displayValue: "London-Hereford",
                paramValue: "London-Hereford"
            },
            {
                displayValue: "Birmingham-Glasgow",
                paramValue: "Birmingham-Glasgow"
            },
            {
                displayValue: "Birmingham-Manchester",
                paramValue: "Birmingham-Manchester"
            },
            {
                displayValue: "Leeds-Selby",
                paramValue: "Leeds-Selby"
            },
            {
                displayValue: "London-Newcastle/Edinburgh",
                paramValue: "London-Newcastle/Edinburgh"
            },
            {
                displayValue: "Manchester-Crewe",
                paramValue: "Manchester-Crewe"
            },
            {
                displayValue: "London-Manchester",
                paramValue: "London-Manchester"
            },
            {
                displayValue: "London-Aberdeen/Inverness",
                paramValue: "London-Aberdeen/Inverness"
            },
            {
                displayValue: "Manchester Airport-Blackpool",
                paramValue: "Manchester Airport-Blackpool"
            },
            {
                displayValue: "Leeds-York (from Blackpool)",
                paramValue: "Leeds-York (from Blackpool)"
            },
            {
                displayValue: "Leeds-Ilkley",
                paramValue: "Leeds-Ilkley"
            },
            {
                displayValue: "Birmingham-Coast",
                paramValue: "Birmingham-Coast"
            },
            {
                displayValue: "London-Glasgow",
                paramValue: "London-Glasgow"
            },
            {
                displayValue: "Manchester-Liverpool (via Eccles or Earlestown) (M)",
                paramValue: "Manchester-Liverpool (via Eccles or Earlestown) (M)"
            },
            {
                displayValue: "Rochdale-Clitheroe",
                paramValue: "Rochdale-Clitheroe"
            },
            {
                displayValue: "Manchester Piccadilly-Crewe (via Stockport and Wilmslow)",
                paramValue: "Manchester Piccadilly-Crewe (via Stockport and Wilmslow)"
            },
            {
                displayValue: "Stalybridge-Southport (GM)",
                paramValue: "Stalybridge-Southport (GM)"
            },
            {
                displayValue: "Leeds-Sheffield (via Barnsley)(SY)",
                paramValue: "Leeds-Sheffield (via Barnsley)(SY)"
            },
            {
                displayValue: "London-Leeds/Bradford/Harrogate",
                paramValue: "London-Leeds/Bradford/Harrogate"
            },
            {
                displayValue: "Manchester Airport-Barrow/Windermere (GM)",
                paramValue: "Manchester Airport-Barrow/Windermere (GM)"
            },
            {
                displayValue: "Leeds-Doncaster (WY)",
                paramValue: "Leeds-Doncaster (WY)"
            },
            {
                displayValue: "Leeds-Harrogate/Knaresborough",
                paramValue: "Leeds-Harrogate/Knaresborough"
            },
            {
                displayValue: "Manchester-Wigan/Southport (GM)",
                paramValue: "Manchester-Wigan/Southport (GM)"
            },
            {
                displayValue: "Leeds-Sheffield (via Barnsley)(WY)",
                paramValue: "Leeds-Sheffield (via Barnsley)(WY)"
            },
            {
                displayValue: "PenistoneLine (WY)",
                paramValue: "PenistoneLine (WY)"
            },
            {
                displayValue: "Southport-Alderley Edge (GM)",
                paramValue: "Southport-Alderley Edge (GM)"
            },
            {
                displayValue: "Liverpool - Chester (M)",
                paramValue: "Liverpool - Chester (M)"
            },
            {
                displayValue: "Newcastle-Carlisle",
                paramValue: "Newcastle-Carlisle"
            },
            {
                displayValue: "Bradford F Sq-Skipton (WY)",
                paramValue: "Bradford F Sq-Skipton (WY)"
            },
            {
                displayValue: "Manchester Airport-Edinburgh/Glasgow Central",
                paramValue: "Manchester Airport-Edinburgh/Glasgow Central"
            },
            {
                displayValue: "Liverpool-Cheter",
                paramValue: "Liverpool-Cheter"
            },
            {
                displayValue: "Liverpool-Wigan",
                paramValue: "Liverpool-Wigan"
            },
            {
                displayValue: "Wigan-Kirkby",
                paramValue: "Wigan-Kirkby"
            },
            {
                displayValue: "Rochdale-Clitheroe (GM)",
                paramValue: "Rochdale-Clitheroe (GM)"
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
  stationInformationMetricBoolSelector: stationInformationMetricBoolSelector
};