import { pages } from "./pages";

export const appConfig = {
    authenticationRequired: true,
    title: "Strategic Analysis Workstreams - NPR Bradford 2025 SOBC",
    introduction:
        `
    <p>
        This platform is intended to provide a single source for appraisal work contributing to the Bradford SOBC.
    </p>
    <p>
        These analyses are designed to be detailed enough to use as evidence, interactive enough to explore intuitively, and attractive enough to be used in official documentation.
    </p>
    <p>
        This platform contains a mix of interactive <strong>web-based dashboards</strong>, one for each <em>strategic analysis workstream</em>. The four strategic analysis workstreams constitute:
    </p>
    <ul>
        <li><strong>People-Centred Analysis (PCA)</strong></li>
        <li><strong>Network Appraisal Criteria (NAC)</strong></li>
        <li><strong>Place-Based Analysis (PBA)</strong></li>
        <li><strong>Distributional Impacts Appraisal (DIA)</strong></li>
    </ul>

    `,
    background: "",
    methodology: "",
    homePageFragments: [
        {
            content: `
        <p>
        People Centred Analysis is a method of relaying technical outputs in a relatable and individual-focused manner and can add real 
        value to transport scheme business cases through highlighting the human perspective on the case for investment.
         The outputs of this workstream, presented as a set of Narratives/Personas, are tailored to specific programmes 
        and often involve working with local partners and authorities to ensure their relevancy.  
         </p>`,
            sectionTitle: "People Centred Analysis (PCA)",
            alignment: "left",
            mapUrl: "/person-centred-analysis",
            image: "img/avp/featuredBlocks/7.png",
        },
        {
            content: `
            
    <p>
        The NAC PowerBI dashboard is a holistic network or station choice comparison tool. 
        The dashboard collates a wide range of appraisal metrics from different workstreams 
        to highlight how each option performs against the strategic objectives of the business case.
    </p>
    <h3>Strategic Objectives for the Bradford SOBC:</h3>
    <ol>
        <li> Improve Rail Connectivity for Bradford</li>
        <li> Kickstart Economic Growth in Bradford</li>
        <li> Delivering greener transport - tackling carbon emissions and promoting cleaner energy</li>
    </ol>
    <p>
        You will be prompted to request access to the analysis in question, should you not have access to the resource already. 
        The request will be sent to the analyst that published it, and accepted within business hours.
    </p>

            `,
            sectionTitle: "Network Appraisal Criteria (NAC)",
            alignment: "left",
            mapUrl: "/nac",
            image: "img/avp/featuredBlocks/5.png",
        },
        {
            content: `
        <p>
        Place-Based Analysis, as defined in the Green Book and TAG, is a methodological approach used to evaluate the impacts of policies, programs, or projects on specific geographical areas within the United Kingdom. 
        This analysis involves spatially disaggregating the anticipated outcomes of a scheme to assess its social welfare and distributional effects across different regions, such as urban, suburban, and rural areas. 
        Outputs include metrics such as Change in Transport Related Social Exclusion, User and Level 3 benefits Gross Value Added (GVA ) and others.   
        </p>
        
        <p>
        
        </p>
        `,
            sectionTitle: "Place-Based Analysis (PBA)",
            alignment: "left",
            mapUrl: "/wider-impacts",
            image: "img/avp/featuredBlocks/6.png",
        },

        {
            content: `      
        
    <p>
        Distributional Impacts Appraisal assesses how the benefits of transport interventions are distributed across different social groups, ensuring that projects are evaluated for both economic efficiency and equity. By identifying which groups are positively or negatively affected, policymakers can make informed decisions that promote social inclusion and address inequalities.
    </p>
    <p>
        The appraisal considers impacts such as user benefits, noise, air quality, accidents, severance, security, accessibility, and personal affordability, analysing how these affect various demographic groups, including low-income households, the elderly, children, and people with disabilities. The goal is to ensure transport projects contribute to a more equitable distribution of benefits and do not disproportionately disadvantage any group, creating systems that are efficient, socially responsible, and inclusive.
    </p>
    <p>
        For the purposes of the Bradford Strategic Outline Business Case (SOBC), we have focused on analysing <strong>user benefits</strong>, <strong>air quality</strong>, and <strong>accessibility</strong>. As the business case progresses and more information becomes available, we will undertake a comprehensive analysis of additional impacts, including noise, accidents, severance, security, and personal affordability.
    </p>
    <p>
        This phased approach ensures that our appraisal remains thorough and responsive to emerging data, ultimately supporting a well-rounded and informed decision-making process.
    </p>

            `,
            sectionTitle: "Distributional Impact Appraisal (DIA)",
            alignment: "left",
            mapUrl: "/person-centred-analysis",
            image: "img/avp/featuredBlocks/Manchester Piccadilly Station.png",
        }
    ],
    legalText: 'termsOfUse',
    contactText: "Please contact me for any questions on this tool",
    contactEmail: "hello.me@transportforthenorth.com",
    logoImage: "img/tfn-logo-fullsize.png",
    backgroundImage: "img/nortms-bradford/bradford_citycentre.jpg",
    logoutButtonImage: "img/burgerIcon.png",
    logoutImage: "img/logout.png",
    appPages: [
        pages.backgroundInfo,
        pages.pca,
        pages.nac,
        pages.widerImpacts,
        pages.accessibility,
        pages.airQuality,
        pages.accidents,
        pages.severance
    ],
    footer: {
        creditsText: "© Transport for the North 2024-5. All rights reserved.",
        privacyPolicyLink: "https://transportforthenorth.com/privacy-policy/",
        cookiesLink: "https://transportforthenorth.com/cookies/",
        contactUsLink: "https://transportforthenorth.com/about-transport-for-the-north/contact-us/"
    }
};