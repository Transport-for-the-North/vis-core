import { loremIpsum } from "utils";

export const pca = {
    pageName: "Person-Centred Analysis",
    url: "/person-centred-analysis",
    about:
        `<p>This is customisable 'about' text. Use it to describe what's being visualised and how the user can interact with the data. If required, add more useful context about the data.</p>`,
    type: "MapLayout",
    category: null,
    legalText: 'foo',
    termsOfUse: 'bar',
    customMapZoom: 14,
    customMapCentre: [-1.76369, 53.79073],
    config: {
        layers: [
            {
                name: "PCA Locations",
                type: "tile",
                geometryType: "symbol",
                path: "/api/avp/pca/locations/{z}/{x}/{y}",
                sourceLayer: "geometry",
                source: "api",
                isClickable: true,
                isHoverable: true,
                shouldHaveTooltipOnClick: false,
                shouldHaveTooltipOnHover: true,
                shouldHaveLabel: true,
                customRenderer: "image-marker",
                hiddenByDefault: false,
                bufferSize: 8
            }
        ],
        visualisations: [
            {
                name: "Detailed Information",
                type: "calloutCard",
                cardType: "fullscreen",
                cardName: "",
                dataSource: "api",
                dataPath: "/api/avp/pca/locations/{id}",
            }
        ],
        metadataTables: [
            {
                name: "v_vis_avp_programmes_run_info",
                path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info"
            },
        ],
        filters: [
            {
                filterName: "Select point in map",
                paramName: "id",
                target: "api",
                actions: [{ action: "UPDATE_PATH_PARAMS" }],
                visualisations: ["Detailed Information"],
                type: "map",
                layer: "PCA Locations",
                field: "id",
            },
            {
                filterName: "DoMin Run (Year, Scenario, Demand, NoRMS Catalog)",
                paramName: "runCodeDoMin",
                target: "api",
                actions: [
                    { action: "UPDATE_QUERY_PARAMS" },
                ],
                visualisations: ["Detailed Information"],
                info:"",
                type: "dropdown",
                shouldBeBlankOnInit: false,
                shouldFilterOnValidation: false,
                shouldFilterOthers: false,
                shouldBeValidated: false,
                isClearable: false,
                multiSelect: false,
                values: {
                    source: "metadataTable",
                    metadataTableName: "v_vis_avp_programmes_run_info",
                    displayColumn: "nortms_run_id_display",
                    paramColumn: "nortms_run_id",
                    infoOnHoverColumn: "network_desc",
                    infoBelowOnChangeColumn: "network_desc",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: true,
                            operator: 'equals'
                        },
                        {
                            column: 'programme_id',
                            values: 2,
                            operator: 'equals'
                        },
                        {
                            column: 'network_type',
                            values: 'dm',
                            operator: 'equals'
                        },
                    ]
                },
            },
            {
                filterName: "DoSom Run (Year, Scenario, Demand, NoRMS Catalog)",
                paramName: "runCodeDoSom",
                target: "api",
                actions: [
                    { action: "UPDATE_QUERY_PARAMS" },
                ],
                visualisations: ["Detailed Information"],
                info:"",
                type: "dropdown",
                shouldBeBlankOnInit: false,
                shouldFilterOnValidation: false,
                shouldFilterOthers: false,
                shouldBeValidated: false,
                isClearable: false,
                multiSelect: false,
                values: {
                    source: "metadataTable",
                    metadataTableName: "v_vis_avp_programmes_run_info",
                    displayColumn: "nortms_run_id_display",
                    paramColumn: "nortms_run_id",
                    infoOnHoverColumn: "network_desc",
                    infoBelowOnChangeColumn: "network_desc",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: true,
                            operator: 'equals'
                        },
                        {
                            column: 'programme_id',
                            values: 2,
                            operator: 'equals'
                        },
                        {
                            column: 'network_type',
                            values: 'ds',
                            operator: 'equals'
                        },
                    ]
                },
            },
        ],
        additionalFeatures: {
            glossary: {
                dataDictionary: { 'EG': `${loremIpsum}` }
            },
        },
    },
}