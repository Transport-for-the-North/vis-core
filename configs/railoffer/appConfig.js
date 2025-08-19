import { termsOfUse } from "configs/railoffer/termsOfUse";
import { pages } from "./pages";

export const appConfig = {
    title: "TfN's Rail Information Portal Visualiser",
    introduction: `<p>The Rail Information Portal has been developed to allow railway industry data to be shared with Transport for the North (TfN) Partners through the TfN Offer. This is to enable Partners to better use rail industry data to shape their rail work.</p>
        <p>The purpose of this platform is to collate and visualise rail data in an interactive, intuitive, and web-based format. This instance of the platform presents information that has been collated and processed by TfN, often from third-party sources, shared under Open Government Licence or other open licences.</p>
        <p><b>NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.</b></p>`,
    background: "",
    methodology: "",
    homePageFragments: [
        {
            content: `
            <p>
                Below are links to trusted external data sources that provide additional rail industry information not directly available within this platform.
            </p>
            <p>
                <i>Disclaimer: These links lead to external websites. Transport for the North is not responsible for the content or accuracy of external sites.</i>
            </p>
            <hr style="margin: 24px 0 32px 0; border: none; border-top: 1px solid #ccc;" />
            <div style="display: flex; flex-direction: column; gap: 32px;">
                <div style="display: flex; align-items: center;">
                    <a href="https://www.networkrail.co.uk/industry-and-commercial/information-for-operators/national-electronic-sectional-appendix/" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>Infrastructure, Signalling and Electrification</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            Access detailed infrastructure, signalling, and electrification information for the UK rail network.
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <a href="https://www.networkrail.co.uk/industry-and-commercial/information-for-operators/national-electronic-sectional-appendix/" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>Freight Gauging and Terminals</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            Find information on freight gauging and terminals, supporting freight operations and planning across the rail network.
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <a href="https://www.railwaydata.co.uk/levelcrossings" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>Level Crossings</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            Explore a comprehensive map and data on level crossings throughout the UK, supporting safety and planning initiatives.
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <a href="https://www.railwaydata.co.uk/stations/" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>Station Usage</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            View station usage statistics to understand passenger flows and demand at stations across the network.
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <a href="https://www.railwaydata.co.uk/timetables" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>Timetables and Services</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            Access timetables and service information to support journey planning and operational analysis.
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <a href="https://www.transportfocus.org.uk/publications/" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>Customer Satisfaction</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            Review the latest customer satisfaction reports and publications from Transport Focus.
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <a href="https://www.openrailwaymap.org/" target="_blank" style="text-decoration: none;">
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer;">
                            <b>OpenRailwayMap</b>
                        </button>
                    </a>
                    <div style="margin-left: 28px;">
                        <p>
                            OpenRailwayMap shows electrification, track gauge and other data from the sectional appendices.
                        </p>
                    </div>
                </div>
            </div>
            <hr style="margin: 24px 0 32px 0; border: none; border-top: 1px solid #ccc;" />
        `,
            sectionTitle: "External Data Sources",
            alignment: "left"
        }
    ],
    legalText: termsOfUse,
    contactText: "Please contact Jonathan Burton for any questions on this data tool or on Transport for the North’s work supporting partners.",
    contactEmail: "jonathan.burton@transportforthenorth.com",
    logoImage: "img/tfn-logo-fullsize.png",
    backgroundImage: "img/railoffer/main_background.png",
    logoutButtonImage: "img/burgerIcon.png",
    logoutImage: "img/logout.png",
    appPages: [
        pages.stationInformation,
        pages.stationInformationBool,
        pages.nodeLoadings,
        pages.nodeNSSeC,
        pages.nodeSocio,
        pages.linkLoadings,
        pages.timingLinks,
        pages.linkFrequency
    ],
    footer: {
        creditsText: "© Transport for the North 2024-5. All rights reserved.",
        privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
        cookiesLink: "https://transportforthenorth.com/cookies/",
        contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
    }
};