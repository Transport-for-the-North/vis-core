import { pages } from "./pages";
import { mapStyles } from "defaults";

export const appConfig = {
  title: "Transport-related social exclusion in England",
  introduction:
    "<p>Transport-related social exclusion (TRSE) means that transport issues have a fundamental impact on everyday life, and limit the ability to fulfil everyday needs. This could mean being unable to access childcare or good job opportunities, facing poverty and financial hardship because of transport costs, or facing significant stress and anxiety from using the transport system as part of everyday life.</p>",
  background:
    "<p>Example background text goes here</p>",
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  contactText: "Please contact Tom Jarvis for any questions on this data tool.",
  contactEmail: "firstname.lastname@transportforthenorth.com",
  mapStyle: mapStyles.osMapsApiRaster,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/evci/placeholderTFN.png",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  appPages: [
    pages.combinedAuthority,
    pages.localAuthority,
    pages.england
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};