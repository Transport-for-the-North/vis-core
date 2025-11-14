import { pages } from "./pages";
import { loremIpsum } from "utils";

export const appConfig = {
    authenticationRequired: true,
    title: "AVP",
    introduction:
        `<p>${loremIpsum}</p>
    `,
    background: "",
    methodology: "",
    homePageFragments: [
        {
            content: `
        <p>${loremIpsum}</p>`,
            sectionTitle: "Overview",
            alignment: "left",
        }
    ],
    legalText: 'termsOfUse',
    contactText: "Please contact me for any questions on this tool",
    contactEmail: "hello.me@transportforthenorth.com",
    logoImage: "img/tfn-logo-fullsize.png",
    backgroundImage: "img/bsip/hero.jpg",
    logoutButtonImage: "img/burgerIcon.png",
    logoutImage: "img/logout.png",
    appPages: [
        pages.pca,
        pages.nac,
        pages.widerImpacts,
        pages.accessibility
    ],
    footer: {
        creditsText: "© Transport for the North 2024-5. All rights reserved.",
        privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
        cookiesLink: "https://transportforthenorth.com/cookies/",
        contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
    }
};