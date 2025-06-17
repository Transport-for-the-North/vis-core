import { termsOfUse } from "configs/railoffer/termsOfUse";
// import { pages } from "./pages";

export const appConfig = {
    title: "TfN's Northern Rail Modelling System (NoRMS) Visualiser",
    introduction: `<p>The Rail Information Portal has been developed to allow railway industry data to be shared with Transport for the North (TfN) Partners through the TfN Offer. This is to enable Partners to better use rail industry data to shape their rail work.  
        The purpose of this platform is to collate and visualise rail data in an interactive, intuitive, and web-based format. This instance of the platform presents information that has been collated and processed by TfN, often from third-party sources, shared under Open Government Licence or other open licences.</p>`,
    background: "",
    methodology: "",
    legalText: termsOfUse,
    contactText: "Please contact Jonathan Burton for any questions on this data tool or on Transport for the North’s work supporting partners.",
    contactEmail: "jonathan.burton@transportforthenorth.com",
    logoImage: "img/tfn-logo-fullsize.png",
    backgroundImage: "img/bsip/hero.jpg",
    logoutButtonImage: "img/burgerIcon.png",
    logoutImage: "img/logout.png",
    appPages: [

    ],
    footer: {
        creditsText: "© Transport for the North 2024-5. All rights reserved.",
        privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
        cookiesLink: "https://transportforthenorth.com/cookies/",
        contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
    }
};