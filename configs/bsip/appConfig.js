import { termsOfUse } from "configs/bsip/termsOfUse";
import { pages } from "./pages";

export const appConfig = {
  title: "Bus Analytics Tool",
  introduction:
    `<p>Buses are the quickest, easiest, and most effective way to deliver far-reaching improvements to our public transport system. They account for the majority of public transport journeys across the North of England.</p>
    <p>A fast, frequent, and integrated bus network is vital to the North’s economic success. Buses also play a key role in reducing social isolation and catalysing social mobility supporting low income, young, old, and disabled passengers to access jobs, education, and services. With the appropriate investment, buses will contribute to achieving the Strategic Transport Plan ambitions:</p>
    <ul>
        <li>Improving economic performance</li>
        <li>Enhancing social inclusion and health</li>
        <li>Rapid decarbonisation of surface transport.</li>
    </ul>
    <p>Access to robust data and evidence to inform decision making has been a key request from all local authorities delivering bus service improvements. Transport for the North’s public transport model integrates bus and light rail demand data into TfN’s wider Analytical Framework.</p>
    <p>This data portal is provided as a tool available free of charge to Transport for the North’s partner organisations, with outputs detailing:</p>
    <ul>
        <li>Scheduled public service bus, tram and light rail services in the North of England</li>
        <li>Public service bus, tram and light rail journey time reliability data, by route.</li>
        <li>Bus accessibility data, segmented by journey type e.g. travel to work, travel to education etc.</li>
    </ul>
    <p>The above combined with geospatial data on population, jobs and demographic indices.</p>`,
  background: "",
  methodology: "",
  legalText: termsOfUse,
  contactText: "Please contact Kirsten Keen for any questions on this data tool or on Transport for the North’s work supporting Bus Service Improvements.",
  contactEmail: "kirsten.keen@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/bsip/hero.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  appPages: [
    pages.accessibility,
    pages.reliability
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};