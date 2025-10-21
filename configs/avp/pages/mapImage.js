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
                filterName: "DoMin Run",
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
                    displayColumn: "nortms_run_id",
                    paramColumn: "nortms_run_id",
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
                filterName: "DoSom Network Scenario",
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
                    displayColumn: "nortms_run_id",
                    paramColumn: "nortms_run_id",
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