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
                This portal provides access to a variety of visualisations based on data retrieved from various open sources. Below are some details on how to navigate and use the platform effectively and the relative data that each page contains.
            </p>
            <hr style="margin: 24px 0 32px 0; border: none; border-top: 1px solid #ccc;" />
            <ul>
                <li><b>Navigation:</b> Use the menu to explore different visualisations available in the portal.</li>
                <li><b>Interactivity:</b> Many visualisations are interactive. Hover over elements to show tooltips, or click elements to show more information (currently only in the investment pages).</li>
                <li><b>Information:</b> Each page contains an "About this visualisation" section that provides context and details about the data being presented and how it was calculated.</li>
                <li><b>Filters:</b> Use the filters provided on each page to refine the data displayed according to your interests. Each filter contains a info button so the user can understand exactly what it is filtering.</li>
                <li><b>Data Sources:</b> Each visualisation includes information about the data sources used, ensuring transparency and reliability. This is visible in the "About this visualisation" section in each map page.</li>
                <li><b>Layer Control:</b> Toggle different layers on and off and change colour schemes in the "Map layer control" section to customize the view according to your needs.</li>
                <li><b>Tooltips:</b> Hover over map features to see detailed information in tooltips.</li>
                <li><b>Download Data:</b> Where available, use the download options to export data for further analysis.</li>
            </ul>
            <hr style="margin: 24px 0 32px 0; border: none; border-top: 1px solid #ccc;" />
            <p>
                Below are the list of each pages available in the portal along with a brief description of the data they contain.
            </p>
            <ul>
                <li><b>Performance Dashboard:</b> This visualisation shows key performance indicators for Northern and Transpennine Express services.</li>
                <li><b>Station Information:</b> Various station information such as True/False statistics, such as if the station contains help points, ticket machines etc. Also contains numerical data such as car park spaces and cycle spaces at each station in the NorTMS model.</li>
                <li><b>Station Loadings:</b> This visualisation shows the boarding and alighting summaries at each station in the NorTMS model.</li>
                <li><b>Station Socio-Economic Classifications (NS-SeC):</b> This visualisation shows the NS-SeC (socio-economic classification) information for each station in the NorTMS model which has been connected to LSOA centroids using a 2.5km buffer.</li>
                <li><b>Station Economic Activity Status:</b> This visualisation shows the economic activity information for each station in the NorTMS model which has been connected to LSOA centroids using a 2.5km buffer.</li>
                <li><b>Station Car or Van Availability:</b> This visualisation shows the availability of cars and vans for households near each station, based on 2021 Census data mapped using a 2.5km buffer around stations.</li>
                <li><b>Station Household Deprivation:</b> This visualisation shows household deprivation indicators across four dimensions (education, employment, health, and housing) for areas near each station, using 2021 Census data.</li>
                <li><b>Station Travel to Work Distance:</b> This visualisation shows the distance people travel from home to workplace for areas near each station, categorised from working at home to 60km+ distances, using 2021 Census data.</li>
                <li><b>Station Work Method of Travel:</b> This visualisation shows the main methods of transport used for the longest part of usual journeys to work, including all transport modes from walking to train travel, using 2021 Census data.</li>
                <li><b>Link Loadings:</b> This visualisation shows the boarding and alighting summaries for each link in the NorTMS model.</li>
                <li><b>BPLAN Timing Links:</b> This visualisation shows the BPLAN timing link information for each link in our TIPLOC-TIPLOC network.</li>
                <li><b>Link Frequency:</b> This visualisation shows the frequency (trains per hour) for each link in the NorTMS model.</li>
                <li><b>Transport-Related Social Exclusion (TRSE):</b> This page links to the Transport-Related Social Exclusion (TRSE) tool, which provides insights into social exclusion related to transport for local authorities, combined authorities and the whole of England.</li>
            </ul>
            `,
            sectionTitle: "Portal Information",
            alignment: "left"
        },
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
                        <button style="width: 280px; height: 50px; font-size: 0.95rem; border: none; border-radius: 6px; cursor: pointer; background-color: #7317de; color: #fff;">
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
    backgroundImage: "img/railoffer/7.png",//Manchester_Piccadilly_Station.png",
    logoutButtonImage: "img/burgerIcon.png",
    logoutImage: "img/logout.png",
    appPages: [
        pages.stationInformation,
        pages.nodeLoadings,
        pages.nodeNSSeC,
        pages.nodeSocio,
        pages.nodeCarOrVan,
        pages.nodeHouseholdDeprivation,
        pages.nodeWorkTravelDistance,
        pages.nodeWorkTravelMethod,
        pages.linkLoadings,
        pages.timingLinks,
        pages.linkFrequency,
        pages.performanceBi
    ],
    externalLinks: [
        {
        category: null,
        external: true,
        label: "Transport-Related Social Exclusion (TRSE)",
        url: "https://trse.transportforthenorth.com/",
        },
    ],
    footer: {
        creditsText: "© Transport for the North 2024-5. All rights reserved.",
        privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
        cookiesLink: "https://transportforthenorth.com/cookies/",
        contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
    }
};