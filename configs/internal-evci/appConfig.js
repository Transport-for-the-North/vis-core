import { stbConfig } from "./stbConfig";
import { pages } from "./pages";
import { filterGlossaryData, replacePlaceholdersInObject } from "utils";
import glossaryData from "./glossaryData";
import { mapStyles } from "defaults";

const generateContactHTML = (stbConfig) => {
  return stbConfig.map(stb => `
    <div class="contactItem">
      <img src="${stb.logoPath}" alt="${stb.stbName} Logo" class="stb-logo" />
      <div class="icon-links">
        <a href="mailto:${stb.contact}">
          <img src="img/envelope.svg" alt="Contact ${stb.stbName}" class="icon" />
        </a>
        <a href="${stb.website}" target="_blank">
          <img src="img/web-icon.svg" alt="Visit ${stb.stbName} website" class="icon" />
        </a>
      </div>
    </div>
  `).join('');
};

export const appConfig = {
  title: "STB Electric Vehicle Charging Infrastructure Framework",
  introduction:
    "<p>The phasing out of new petrol and diesel cars and vans has been confirmed and manufacturers are responded accordingly. The next decade will need to see a rapid transition to electric vehicles, and this uptake requires the enabling charging infrastructure to meet our EV needs effectively and efficiently, as one of the solutions to decarbonise transport.</p><p>With their regional perspective, partnerships, and analytical capabilities, Sub-national Transport Bodies are ideally positioned to support and shape planning and delivery of this critical infrastructure.</p>",
  background:
    "<p>A key challenge for national Government, local authorities and the private sector is planning and delivering critical EV charging infrastructure with confidence. This needs to be based on the latest qualitative and quantitative evidence which considers the full range of influencing factors for EV charging, and encourages the right investment which delivers comprehensive EV charging solutions across the region.</p><p>Transport for the North launched the EVCI Framework in October 2022. This will be extended to other STBs throughout 2024, starting with Midlands Connect and Transport for the South East, and Transport East, England’s Economic Heartland, Peninsula Transport and Western Gateway following later in the year. Providing a public source of EV charging intelligence for the whole of England. </p><p>The EVCI Framework supports value-for-money, consistent and integrated public sector activities and decisions towards the deployment of local EV charging infrastructure, to underpin any public sector funding, as well as to inform and enhance any delivery through partnership with the private sector. </p><p>This delivers an enhanced evidence base that considers the users’ needs and movements across STB region’s road network, and a route map for what that means for EV uptake and charging in granular place-based outputs. The tool also takes a whole systems approach in identifying the significant requirements placed on the electricity grid and energy networks arising from the electrification of road vehicles. </p><p>The evidence provides additional clarity on the scale and pace of change required across our regions to support a rapid and inclusive transition to electric vehicles. That is why we are sharing our evidence openly, to boost capacity and capability to plan and accelerate delivery on the ground, in a sustainable and inclusive way. </p><p>The STBs will continue to enhance the EVCI Framework, working in conjunction with Local Authorities, National Government and other stakeholders to identify new enabling capabilities, initiatives and applications. </p>",
  methodology: "",
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  homePageFragments: {
    stbContact: {
      sectionTitle: 'Partners',
      content: `
      <div class="contactsList">
        ${generateContactHTML(stbConfig)}
      </div>
      `,
      alignment: 'center',
      backgroundColor: 'white',
    },
  },
  mapStyle: mapStyles.geoapifyPositron,
  logoImage: null,
  logoPosition: 'right',
  backgroundImage: "img/evci/placeholderTFN.png",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  authenticationRequired: false,
  appPages: [
  ],
  footer: {
    creditsText: "© Transport for the North 2024. All rights reserved.",
    privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
    cookiesLink: "https://transportforthenorth.com/cookies/",
    contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
  }
};

async function loadAndAdaptPages() {
  const appPages = [];

  for (const stb of stbConfig) {
    for (const page of stb.pages) {
      try {
        const basePage = pages[page];
        if (basePage) {
          const adaptedPage = replacePlaceholdersInObject(basePage, stb);

          // Check if adaptedPage has additionalFeatures and glossary
          if (adaptedPage.config?.additionalFeatures?.glossary) {
            adaptedPage.config.additionalFeatures.glossary.dataDictionary = filterGlossaryData(glossaryData, stb.stbTag);
          }

          appPages.push(adaptedPage);
        }
      } catch (error) {
        console.error(`Failed to load base page definition for ${page}:`, error);
      }
    }
  }

  appConfig.appPages = appPages;
}

// Load and adapt the pages
loadAndAdaptPages();