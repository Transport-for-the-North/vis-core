import { termsOfUse } from "configs/severance/termsOfUse";
import { pages } from "./pages";
import { mapStyles } from "defaults";

export const appConfig = {
  title: "Severance in England",
  introduction:
    `<p>This tool shows...</p>`,
  background:
    `<p> ... </p>`,
  methodology:
    `<p> ... </p>`,
  legalText: termsOfUse,
  contactText: "Please contact research@transportforthenorth.com for any questions on this data tool.",
  contactEmail: "research@transportforthenorth.com",
  mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/trse/TRSE_bg.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  appPages: [
    pages.england
  ],
  footer: {
    creditsText: "© Transport for the North 2024-5. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};