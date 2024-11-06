/**
 * Contains the definitions used by the template to build pages for each STB.
 */
export const stbConfig = [
  {
    stbName: "Transport for the North",
    stbTag: "tfn",
    stbTagDisplay: "TfN",
    stbZoneId: 31390,
    termsOfUseLink:
      "https://transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/",
    urlBase: "/transport-for-the-north",
    logoPath: "/img/evci/tfn-logo-fullsize.png",
    contact: "EVCI@transportforthenorth.com",
    mapCentre: [-2.2, 54.2],
    mapZoom: 7.5,
    website:
      "https://transportforthenorth.com/major-roads-network/EV-charging-infrastructure",
    primaryBgColour: '#0d0f3d',
    secondaryBgColour: '#00dec6',
    primaryFontColour: '#000000',
    secondaryFontColour: '#00dec6',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites','cpArea','cpLocation','cpMajorRoad', 'co2Savings']
  },
  {
    stbName: "Transport for the South East",
    stbTag: "tfse",
    stbTagDisplay: "TfSE",
    stbZoneId: 31391,
    termsOfUseLink:
      "https://transportforthesoutheast.org.uk/our-work/electric-vehicle-charging-infrastructure-strategy/",
    urlBase: "/transport-for-the-south-east",
    logoPath: "/img/evci/tfse-logo.png",
    contact: "joshua.jiao@eastsussex.gov.uk",
    mapCentre:  [-0.78624, 51.20819],
    mapZoom: 8.21,
    website:
      "https://transportforthesoutheast.org.uk/our-work/electric-vehicle-charging-infrastructure-strategy/",
    primaryBgColour: '#0078be',
    secondaryBgColour: '#ec6c60',
    primaryFontColour: '#ffffff',
    secondaryFontColour: '#000000',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites']
  },
  {
    stbName: "Midlands Connect",
    stbTag: "mc",
    stbTagDisplay: "Midlands Connect",
    stbZoneId: 31395,
    termsOfUseLink:
      "https://www.midlandsconnect.uk/about-us/projects/electric-vehicle-infrastructure/",
    urlBase: "/midlands-connect",
    logoPath: "/img/evci/mc-logo.png",
    contact: "evc@midlandsconnect.uk",
    mapCentre: [-1.4, 52.7],
    mapZoom: 7.5,
    website:
      "https://www.midlandsconnect.uk/about-us/projects/electric-vehicle-infrastructure/",
    primaryBgColour: '#017500',
    secondaryBgColour: '#272b30',
    primaryFontColour: '#ffffff',
    secondaryFontColour: '#000000',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites']
  },
  {
    stbName: "England's Economic Heartland",
    stbTag: "eeh",
    stbTagDisplay: "EEH",
    stbZoneId: 31388,
    termsOfUseLink:
      "https://www.englandseconomicheartland.com/our-work/cutting-emissions/",
    urlBase: "/england-economic-heartland",
    logoPath: "/img/evci/eeh-logo.png",
    contact: "businessunit@englandseconomicheartland.com",
    mapCentre: [-0.6, 52.1],
    mapZoom: 7.5,
    website:
      "https://www.englandseconomicheartland.com/our-work/cutting-emissions/",
    primaryBgColour: '#00099a',
    secondaryBgColour: '#6b004c',
    primaryFontColour: '#ffffff',
    secondaryFontColour: '#000000',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites']
  },
  {
    stbName: "Peninsula Transport",
    stbTag: "peninsula",
    stbTagDisplay: "Peninsula",
    stbZoneId: 31397,
    termsOfUseLink:
      "https://www.peninsulatransport.org.uk/going-electric/",
    urlBase: "/peninsula-transport",
    logoPath: "/img/evci/peninsula-logo.png",
    contact: "info@peninsulatransport.org.uk",
    mapCentre: [-4, 50.75],
    mapZoom: 7.5,
    website:
      "https://www.peninsulatransport.org.uk/going-electric/",
    primaryBgColour: '#0099ff',
    secondaryBgColour: '#80ff00',
    primaryFontColour: '#ffffff',
    secondaryFontColour: '#000000',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites']
  },
  {
    stbName: "Transport East",
    stbTag: "te",
    stbTagDisplay: "TE",
    stbZoneId: 31389,
    termsOfUseLink:
      "https://www.transporteast.gov.uk/electric-vehicles/",
    urlBase: "/transport-east",
    logoPath: "/img/evci/te-logo.png",
    contact: "info@transporteast.gov.uk",
    mapCentre: [0.95, 52.36],
    mapZoom: 7.5,
    website:
      "https://www.transporteast.gov.uk/electric-vehicles/",
    primaryBgColour: '#2CA3DD',
    secondaryBgColour: '#0E9059',
    primaryFontColour: '#ffffff',
    secondaryFontColour: '#000000',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites']
  },
  {
    stbName: "Western Gateway",
    stbTag: "wg",
    stbTagDisplay: "WG",
    stbZoneId: 31396,
    termsOfUseLink:
      "https://westerngatewaystb.org.uk/electric-vehicles/",
    urlBase: "/western-gateway",
    logoPath: "/img/evci/wg-logo.png",
    contact: "westerngatewaystb@westofengland-ca.gov.uk",
    mapCentre: [-2.8, 51.32],
    mapZoom: 7.5,
    website:
      "https://westerngatewaystb.org.uk/electric-vehicles/",
    primaryBgColour: '#4D8514',
    secondaryBgColour: '#ffffff',
    primaryFontColour: '#ffffff',
    secondaryFontColour: '#000000',
    pages: ['evUptake','annualChargingDemand','evcpRequirements','enrouteChargingSites']
  }
];