import { pages } from "./pages";
import { mapStyles } from "defaults";

export const appConfig = {
  title: "Transport-related social exclusion in England",
  introduction:
    `<p>This tool shows how the risk of transport-related social exclusion (TRSE) varies across England. 
    It does so by measuring access to a wide range of everyday places with the transport options available, 
    and measuring the vulnerability of populations to social exclusion, through factors such as 
    poverty, disability, caring responsibilities, and poor health.</p>
    <p>You can view data comparing each neighbourhood to the relevant combined authority, local authority, 
    or to all of England by selecting the relevant tab above. </p>`,
  background:
    `<p>TRSE means that transport issues have a fundamental impact on everyday life, and limit the ability 
    to fulfil everyday needs. This could mean being unable to access childcare or good job opportunities, 
    facing poverty because of transport costs, experiencing loneliness and social isolation, or facing stress 
    and anxiety from using the transport system as part of everyday life.</p>
    <p>Reducing transport-related social exclusion is one of three key regional ambitions set out in 
    Transport for the North’s 2024 Strategic Transport Plan. TfN developed this tool to monitor progress towards 
    this regional objective, as well as to support local authorities, other transport bodies, and the 
    research community in identifying areas and communities affected by TRSE.</p>
    <p>We have developed this tool through extensive primary research with residents of the North of England, 
    including through surveys and qualitative methods. We continue to update our primary evidence base, 
    and publish research reports at: transportforthenorth.com/social-inclusion. </p>`,
  methodology:
    `<p>This tool measures transport-related social exclusion by examining two things: (1) Access to everyday places 
    with the transport options available. (2) The vulnerability of the population to social exclusion. We do this at 
    the Output Area level for all of England, as well as grouping our data by local and combined authorities.</p>
    <p>Our analysis of access to everyday places considers the following destinations: Work, primary schools, secondary schools, 
    further education colleges, hospitals, GP surgeries, pharmacies, dentists, banks, supermarkets, and town centres. We do this 
    for all available modes of public transport and for car travel. We measure access and journey times for a weekday morning peak 
    time, and weekday evening post-peak time, and a weekend afternoon.</p>
    <p>Our analysis of vulnerability to social exclusion considers poverty, disability, caring responsibilities, poor health, 
    and a range of other factors that our research has shown makes populations more vulnerable to social exclusion. We use 
    statistics produced by the Department for Work and Pensions, the Office for National Statistics, and the 2021 Census to measure 
    each of these factors, and used a factor analysis process to group and weight these. Our approach is inspired by and broadly 
    similar to the English Indices of Deprivation, but has been tailored to reflect the outcomes of our research into TRSE.</p>`,
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
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