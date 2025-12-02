import { termsOfUse } from "./termsOfUse";
import { pages as carbonPages } from "./pages";
import { mapStyles } from "defaults";
import { bands } from "./bands";

export const appConfig = {
  title: "Carbon Baseline Dashboard",
  introduction:
    `This dashboard is part of a suite of tools designed for use by TfN’s constituent authorities to help quantify the carbon implications of their plans and policies. 
    It provides an overview of historic emissions and forecasts how these might change under different decarbonisation pathways and scenarios, as well as in response to 
    changes such as greater uptake of active travel or public transport. It also shows changes in vehicle kilometres over time across multiple scenarios and estimates the 
    carbon impacts of various policies, helping identify where interventions could be most effective. The dashboard also shows spatial analysis where emissions can be 
    viewed at ward level, and destination analysis to understand trip patterns.`,
  methodology:"",
  legalText: termsOfUse,
  contactText: "Please contact David Waters for any questions on this data tool.",
  contactEmail: "david.waters@transportforthenorth.com",
  mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/carbon-baseline/CarbonVisImg.png",
  additionalImage: "",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: true,
  loadBands: async() => {
    return bands.bands;
  },
  appPages: [
    carbonPages.carbonPowerBi,
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};