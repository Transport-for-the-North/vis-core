import { termsOfUse } from "configs/severance/termsOfUse";
import { pages } from "./pages";
import { mapStyles } from "defaults";

export const appConfig = {
  title: "Severance across England",
  introduction:
    `<p>This tool reveals the extent of severance from key road and rail infrastructures across England. 
    We have quantified the extent of severance from the strategic road network (SRN), the major road network (MRN), 
    and the rail network on the ability to walk to access a range of key services.
    </p>
    <p> Creating and visualising this data can show
    <ul>
    <li>Severely, moderately, and lowest affected areas of severance</li>
    <li>Summarise severance metrics for every affected OA in England</li>
    </ul>
    </p>
    <p> This information can help support wider understanding around
    <ul>
    <li>How vital transport infrastructures can impact the lives of local people</li>
    <li>Better understand travel behaviours and perceptions</li>
    <li>Help support schemes or measures which aim to address severance-related impacts</li>
    </ul>
    </p>`,
  background:
    `<p>Severance can be understood as the negative impact that infrastructure and public realm design can have on 
    the travel behaviours, perceptions, and wellbeing of local people and those who need to navigate a particular area. 
    Sometimes described as the barrier effect, severance often refers to the separation of people from facilities, 
    services, and social networks within a community. </p>
    <p>One impact often associated with severance is that of social isolation and exclusion. 
    Better understanding social exclusion from transport is an ongoing objective for Transport for the North 
    as set out in our statutory Strategic Transport Plan. This plan lays out our three key ambitions for the North of England, 
    of which reducing transport-related social is one. </p>
    <p>The severance tool was created to support local authorities, other transport bodies, and the research community 
    so severance can be better understood and identified, encouraging the creation of schemes and measures to reduce severance 
    and it’s associated impacts, such as social exclusion. </p>`,
  methodology:
    `<p>This tool assess the walkability to a number of key services in a 10-minute ‘perfect walkable reach’ where SRN, MRN, or 
    rail network infrastructures can be found. This is done for the entirety of England at Output Area (OA) level.</p>
    <p>The perfect walkable reach is based on an average walk speed of 4.82km/h. This is the same speed used by the Department for 
    Transport in their 2019 Journey Time Statistics modelling series as well as being used across studies in relevant literature. </p>
    <p>The key services we are concerned with for this iteration of the tool are primary schools, secondary schools, further education centres, 
    GPs, and hospitals. When referring to key services in this context, we are exclusively referring to these no other destinations which 
    may be deemed as key services.</p>
    <p>To make sense of the interactive tool, we devised a 10-point decile scoring system. This scoring system is applied to each OA where 
    the SRN, MRN, or rail network are found, along with key service destinations. In its purest form, the decile scoring system ranks OAs 
    and residents’ ability to access key services. </p>
    <p>To learn more about our methodological approach and how we devised the severance scoring system, read our 2024 severance report 
    <a href="https://www.transportforthenorth.com/reports/community-severance-across-england/" target="_blank">here</a>.</p>`,
  legalText: termsOfUse,
  contactText: "For any questions or suggestions on enhancements for this data tool, please contact research@transportforthenorth.com",
  contactEmail: "research@transportforthenorth.com",
  mapStyle: mapStyles.geoapifyPositron,
  logoImage: "img/tfn-logo-fullsize.png",
  logoPosition: 'left',
  backgroundImage: "img/severance/Barnsley.png",
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