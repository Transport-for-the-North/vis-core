import { termsOfUse } from "./termsOfUse";
import { pages } from "./pages";

export const appConfig = {
  title: "TfN's Northern Rail Modelling System (NoRMS) Visualiser",
  introduction: `<p>The TfN’s Northern Rail Modelling System (NoRMS) Vis Framework aims to collate and visualise outputs from the Transport for the North Northern Rail Model (NoRMS), that is part of the Northern Transport Modelling System (NorTMS).
   NorTMS is a rail and highways modelling system and is used to appraise rail and highways scheme assessments.</p> <p>The purpose of this platform is to collate and visualise modelled rail data in an interactive, intuitive, and
   web-based format. This instance of the platform presents information from the Network North project. This visualisation tool builds on the modelling aspect of the work that delivers analysis
   based on scenario testing done using NoRMS.</p>`,
  background: "",
  methodology: "",
  legalText:
     termsOfUse,
  contactText: "Please contact Matteo Gravellu for any questions on this data tool.",
  contactEmail: "matteo.gravellu@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/norms/hero.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  appPages: [
    pages.stationTotals,
    pages.stationTotalsDifference,
    pages.stationTotalsSideBySide,
    pages.stationPairs,
    pages.stationPairsDifference,
    pages.stationPairsSideBySide,
    pages.stationCatchment,
    pages.stationCatchmentDifference,
    pages.stationCatchmentSideBySide,
    pages.linkTotals,
    pages.linkTotalsDifference,
    pages.linkTotalsSideBySide,
    pages.zoneTotals,
    pages.zoneTotalsDifference,
    pages.zoneTotalsSideBySide,
    pages.zonePairs,
    pages.zonePairsDifference,
    pages.zonePairsSideBySide,
    pages.zoneBenefits,
    pages.zoneBenefitsDifference,
    pages.keyLocationZoneTotal,
    pages.keyLocationZoneTotalDifference,
    pages.keyLocationZonePair,
    pages.keyLocationZonePairDifference,
    pages.popEmpZoneTotals,
    pages.popEmpZoneTotalsDifference,
    pages.popEmpZonePair,
    pages.popEmpZonePairDifference,
    pages.journeyTimeZonePair,
    pages.journeyTimeZonePairDifference
  ],
};
