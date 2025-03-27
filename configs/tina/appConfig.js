import { termsOfUse } from "configs/tina/termsOfUse";
import { pages } from "./pages";
import { mapStyles } from "defaults";

export const appConfig = {
  title: "Transport Intervention Needs Assessment",
  introduction:
    `<p> TO DO </p>`,
  background:
    `<p> Why? </p>`,
  methodology:
    `<p> How </p>
    <p> We </p>
    <p> Did It </p>`,
  legalText: termsOfUse,
  contactText: "Please contact tfnoffer@transportforthenorth.com for any questions on this data tool.",
  contactEmail: "tfnoffer@transportforthenorth.com",
  //mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/trse/TRSE_bg.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  appPages: [
    pages.hansen,
    //pages.tinaConnectivity,
    //pages.dataExplorer,
    //pages.pti,
    //pages.potential
    
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};