import { termsOfUse } from "configs/me/termsOfUse"; // Change to the real termsOfUse AVP

export const nac = {
  pageName: "NAC",
  url: "/nac",
  type: "IFrameEmbed",
  category: null,
  legalText: termsOfUse,
  termsOfUse: termsOfUse,
  about: "",
  config: {
    url: "https://app.powerbi.com/reportEmbed?reportId=2cc34c49-9dbb-4cc6-9b24-8d3492a3ef05&autoAuth=true&ctid=d58a9e1d-4dca-4595-a9e8-7934a15f3419"
  }
};