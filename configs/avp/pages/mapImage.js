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
                cardName: "Local Authority Summary",
                dataSource: "api",
                dataPath: "/api/avp/pca/locations/{id}",
                htmlFragment: '<p>{name}-{category}-{percent:id}</p>'
            }
        ],
        metadataTables: [
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
        ],
        additionalFeatures: {
            glossary: {
                dataDictionary: { 'EG': `${loremIpsum}` }
            },
        },
    },
}