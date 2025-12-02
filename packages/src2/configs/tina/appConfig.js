import { termsOfUse } from "configs/tina/termsOfUse";
import { pages } from "./pages";
import { mapStyles } from "defaults";

export const appConfig = {
  title: "Transport Intervention Needs Assessment",
  introduction:
    `<p> TINA is a product of the TfN Offer. It has been designed to help users understand the data on offer within the context of accessibility and problems in the transport network. It is formed of 2 parts, (i) An online data platform to browse the available data, (ii) A Multi-Criteria Assessment tool to aid with early stage assessment of potential transport investment opportunities. </p>`,
  background:
    `<p> TINA is designed to be an early stage assessment tool and data platform. It uses metrics to contextualise and score different areas on their need for transport investment. Put simply, the tool aims to point out the areas with lower performance in various metrics when compared to the rest of the transport network. It has been designed to complement the more detailed data on offer from the TfN Offer. </p>`,
  methodology:
   
`<p><strong>PTI</strong>, or <strong>Potential to Improve</strong>, is a metric used to capture the level of access different areas have to distinct attractions. At current, this methodology is based on where trips are produced and where there are attractions to those trips.</p>

<p>The current iteration of PTI only takes car travel into account and assesses the level of congestion in the network. When comparing the connection between two zones, a higher PTI indicates a high level of congestion on the network that is reducing accessibility. It is worth noting that PTI does not take reassignment of traffic into account should the congestion be removed. It only considers the traffic that already uses that part of the network.</p>

<p>In future we hope to expand this methodology to encompass all modes of transport.</p>

<p><strong>Examples:</strong></p>
<ul>
  <li>If a zone has poor access to education and a low PTI, this indicates that there are not enough schools nearby, regardless of congestion.</li>
  <li>If a zone has poor access to education and a high PTI, this indicates that there are plenty of schools nearby, but they are not accessible due to congestion.</li>
</ul>`,

  legalText: termsOfUse,
  contactText: "Please contact tfnoffer@transportforthenorth.com for any questions on this data tool.",
  contactEmail: "tfnoffer@transportforthenorth.com",
  //mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/noham/hero.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  appPages: [
    pages.potential,
    pages.hansen,
    pages.los,
    pages.rail
    //pages.tinaConnectivity,
    //pages.dataExplorer,
    //pages.pti,
    
    
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};