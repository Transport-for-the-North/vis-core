import { termsOfUse } from "./termsOfUse";
import { pages as trsePages } from "configs/trse/pages";
import { pages as mePages } from "./pages";
import { mapStyles } from "defaults";
import { bands } from "configs/trse/bands"

export const appConfig = {
  title: "Monitoring & Evaluation Dashboard",
  introduction:
    `<p>This tool provides insights and visualizations for monitoring and evaluation (M&E) efforts. 
    It integrates key performance indicators and data visualizations to support data-driven decision-making.</p>`,
  background:
    `<p>The M&E dashboard aims to facilitate transparency and performance tracking by providing access 
    to real-time and historical data across various projects and initiatives.</p>
    <p>It enables stakeholders to analyze trends, measure impacts, and assess the effectiveness of policies 
    and programs.</p>`,
  methodology:
    `<p>The dashboard aggregates data from multiple sources, including Power BI reports, external databases, 
    and analytics platforms. The insights presented are derived from structured methodologies ensuring accuracy 
    and reliability.</p>`,
  legalText: termsOfUse,
  contactText: "Please contact research@transportforthenorth.com for any questions on this data tool.",
  contactEmail: "research@transportforthenorth.com",
  mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/me/M&E_bg.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  loadBands: async() => {
    return bands.bands;
  },
  appPages: [
    ...Object.values(trsePages).map(page => ({
      ...page, // Spread the properties of the page
      category: "TRSE", // Set the category to "TRSE"
    })), // Include TRSE pages
    mePages.mePowerBi, // Include M&E-specific page
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};