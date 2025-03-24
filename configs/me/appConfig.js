import { termsOfUse } from "./termsOfUse";
import { pages as trsePages } from "configs/trse/pages";
import { pages as mePages } from "./pages";
import { mapStyles } from "defaults";
import { bands } from "configs/trse/bands"

export const appConfig = {
  title: "Monitoring & Evaluation Dashboard",
  introduction:
    `
    <p>This tool provides insights and visualisations for the monitoring and evaluation (M&E) efforts. 
    It integrates the targets from the Strategic Transport Plan (STP),
     published in April 2024 and data visualisations to help measure progress towards the ambitions of the STP. </p>
     
     <p> The STP Monitoring and Evaluation Dashboard (M&E dashboard)  presents the headline metrics that TfN use to measure our progress towards achieving the three strategic ambitions set out in our STP.
       The overall approach to monitoring progress on delivering the STP is set out in the Monitoring and Evaluation Strategy which complements the M&E dashboard. 
       The headline metrics displayed in the M&E dashboard are of the highest strategic importance and define the vision of the STP, with most having associated medium-term and long-term targets based on our evidence. 
       The dashboard will be used annually to report progress against the headline metrics and identify where further actions or policies may be necessary to support the STP trajectory. 
       These outcomes will inform TfN's annual Business Plans, which set out what TfN will do as an organisation to support delivery of our collective vision.  </p>
    
    <p>The targets set in the Strategic Transport Plan and displayed in the M&E dashboard are pan-Northern targets. 
    TfN recognises that local targets may vary, due to variations in place types across the North; 
    Local Transport Authorities will progress towards their own specified targets at different paces.</p> 
     `,
  background:`
  The M&E dashboard provides time series data, where appropriate,  for each of the STP targets,  including a baseline measurement for each. 
  The data sources for the metrics are a mix of open-source data, data from TfN’s in-house modelling (our Analytical Framework), 
  and commissioned data to measure progress.  
  `,
  methodology:"",
  legalText: termsOfUse,
  contactText: "Please contact research@transportforthenorth.com for any questions on this data tool.",
  contactEmail: "research@transportforthenorth.com",
  mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/me/me_homepage.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  loadBands: async() => {
    return bands.bands;
  },
  appPages: [
    mePages.mePowerBi, // Include M&E-specific page
    ...Object.values(trsePages).map(page => ({
      ...page, // Spread the properties of the page
      category: "TRSE", // Set the category to "TRSE"
    })) // Include TRSE pages
    
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};