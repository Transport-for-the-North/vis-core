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
    <p>The above combined with geospatial data on population, jobs and demographic indices.</p>
    `,
  background: "",
  methodology: "",
  homePageFragments: [
    {
      content: `
        <p> Public transport data presented in this visualisation is derived from scheduled bus, tram and light rail timetable data made available through the national Bus Open Data Service (BODS). Observed performance/reliability is based on observed data via GPS. </p>
      <p> Scheduled bus timetable data has been sourced from the Bus Open Data Service (BODS) in General Transit Feed Specification (GTFS) format.
          Adjusted  GTFS bus timetable data has been created by TfN, based on observed bus locations from the BODS real time API (GPS), over a period of one week using TfN’s BODSE-Extractor GitHub repository.</p>
      <p> Bus accessibility metrics have been derived using these respective timetables with the open-source route planner OpenTripPlanner (OTP), using TfN’s OTP4GB-py GitHub repository. </p>
      <p> Accessibility via public transport to destinations within a single zone are not captured. TfN is investigating options for processing the large datasets required to map accessibility/reliability at a more refined zoning level.  </p>
      <p> Specific parameters used for the current data: </p>
      <ul>
            <li>Bus travel times from OTP were specifically calculated on the timetable for Monday 15th April 2024.</li>
            <li>Travel times are calculated between the population weighted centroids of each zone. The actual start point for the calculation is the Open Street Map link nearest the centroid</li>
            <li>Maximum walk distance to / from bus stops is 10km</li>
            <li>Routes are not calculated for zone pairs which are further than 150km apart (crow-fly).</li>
            <li>Routes are only included if they arrive at their destination between 7am and 10am, weekday only.</li>
            <li>Destinations used within the accessiiblity visualisation are restricted to England only.</li>
        </ul>
      <p> Data utilised within this visualisation will contain any limitations within BODS services (both scheduled timetables and real time API). 
          This visualisation may additionally contain OTP related limitations (if OTP returns an unknown error for a trip that should be possible according to BODS GTFS timetables). </p>
      <p> TfN has performed high-level analysis on the ratio of OTP returned trips possible / trips not possible, along with the number OTP related errors returned from the processing of these respective GTFS datasets in OTP. 
          TfN has not performed any checks on the integrity of BODS data. </p>
      <p> TfN aim to update the BODS data feed for this visualisation tool every three months.  </p>`,
      sectionTitle: "Data Configuration",
      alignment: "left",
      images: [
        "img/bsip/1.jpg",
        "img/bsip/2.jpg",
        "img/bsip/4.jpg"
      ],
    }
  ],
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