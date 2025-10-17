import { loremIpsum } from "utils";

export const mapImage = {
    pageName: "Map Image",
    url: "/map-image",
    about:
        `<p>Visualise life</p>`,
    type: "MapLayout",
    category: null,
    legalText: 'foo',
    termsOfUse: 'bar',
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
                cardName: "",
                dataSource: "api",
                dataPath: "/api/avp/pca/locations/{id}",
                htmlFragment: '<p>{programme_id}-{label}-{location_id}-{text_with_placeholders}</p>'
            }
        ],
        metadataTables: [
            {
                name: "v_vis_avp_programmes_run_info",
                path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info"
            }
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
                filterName: "Catalogue version",
                paramName: null,
                target: "api",
                actions: [],
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
                    displayColumn: "nortms_catalog_version",
                    paramColumn: "nortms_catalog_version",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: false,
                            operator: 'equals'
                        },
                        {
                            column: 'programme_id',
                            values: 2,
                            operator: 'equals'
                        },
                    ]
                },
            },
            {
                filterName: "Demand scenario",
                paramName: null,
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
                    displayColumn: "demand_scenario",
                    paramColumn: "demand_scenario",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: false,
                            operator: 'equals'
                        },
                        {
                            column: 'programme_id',
                            values: 2,
                            operator: 'equals'
                        },
                    ]
                },
            },
            {
                filterName: "DoMin Network Scenario",
                paramName: null,
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
                    displayColumn: "network_scenario",
                    paramColumn: "network_scenario",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: false,
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
                filterName: "DoSom Network Scenario",
                paramName: null,
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
                    displayColumn: "network_scenario",
                    paramColumn: "network_scenario",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: false,
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
            {
                filterName: "Year",
                paramName: null,
                target: "api",
                actions: [],
                visualisations: ["Detailed Information"],
                info:"",
                type: "dropdown",
                shouldBeBlankOnInit: false,
                shouldFilterOnValidation: true,
                shouldFilterOthers: false,
                shouldBeValidated: false,
                isClearable: false,
                multiSelect: false,
                values: {
                    source: "metadataTable",
                    metadataTableName: "v_vis_avp_programmes_run_info",
                    displayColumn: "year",
                    paramColumn: "year",
                    sort: "ascending",
                    where: [
                        {
                            column: 'has_pca',
                            values: false,
                            operator: 'equals'
                        },
                        {
                            column: 'programme_id',
                            values: 2,
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