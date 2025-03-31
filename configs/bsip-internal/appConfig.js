import { pages as bsipPages } from "../bsip/pages";
import { appConfig as bsipAppConfig } from "configs/bsip/appConfig";


export const appConfig = {
    ...bsipAppConfig,
    title: "Bus Analytics Tool - Internal Evaluation",
    appPages: [
        ...Object.values(bsipPages).map(page => ({
            ...page,
            config: {
                ...page.config,
                visualisations: page.config.visualisations.map((visualisation) => ({
                    ...visualisation,
                    dataPath: visualisation.name === "Bus Accessibility" ? "/api/bsip/accessibilityV2/staging" : visualisation.dataPath,
                    dataPath: visualisation.name === "Bus Reliability" ? "/api/bsip/reliabilityV2/staging" : visualisation.dataPath,
                }))
            }
        }))
    ]
};
