const linkTOCSelector = {
  filterName: "TOC Selector",
  paramName: "toc",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
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
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Monday",
        paramValue: 'Mon',
      },
      {
        displayValue: "Tuesday",
        paramValue: 'Tue',
      },
      {
        displayValue: "Wednesday",
        paramValue: 'Wed',
      },
      {
        displayValue: "Thursday",
        paramValue: 'Thu',
      },
      {
        displayValue: "Friday",
        paramValue: 'Fri',
      },
      {
        displayValue: "Saturday",
        paramValue: 'Sat',
      },
      {
        displayValue: "Sunday",
        paramValue: 'Sun',
      }
    ],
  },
};

const linkLoadingsMetricSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Boarders",
        paramValue: "mean_passengers_on",
      },
      {
        displayValue: "Alighters",
        paramValue: "mean_passengers_off",
      },
      {
        displayValue: "Capacity",
        paramValue: "mean_capacity",
      },
      {
        displayValue: "Load on Departure",
        paramValue: "mean_load_on_departure",
      }
    ],
  },
};