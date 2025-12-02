/**
 * Centralised layers registry so pages can import a single source of truth.
 */

const avpNetworkLineGeometry = {
    name: "Network",
    type: "tile",
    source: "api",
    path: "/api/vectortiles/avp_network_line_geometry/{z}/{x}/{y}?programme_id={programmeId}&network={networkId}",
    sourceLayer: "geometry",
    geometryType: "line",
    isHoverable: false,
    isStylable: false,
    shouldHaveTooltipOnHover: true,
    shouldHaveLabel: false,
    labelZoomLevel: 12,
    labelNulls: true,
    hoverNulls: true,
    hiddenByDefault: false
}

const avpNetworkLineGeometryById = {
    ...avpNetworkLineGeometry,
    path: "/api/vectortiles/avp_network_line_geometry/{z}/{x}/{y}?programme_id={programmeId}&id={networkId}"
}

const avpNetworkStationGeometry = {
    name: "Stations",
    type: "tile",
    source: "api",
    path: "/api/vectortiles/avp_network_station_point_geometries/{z}/{x}/{y}?network={networkId}",
    sourceLayer: "geometry",
    geometryType: "point",
    isHoverable: false,
    isStylable: false,
    shouldHaveTooltipOnHover: true,
    shouldHaveLabel: true,
    labelZoomLevel: 12,
    labelNulls: true,
    hoverNulls: true,
    hiddenByDefault: false
}

export const layers = {
    avpNetworkLineGeometry,
    avpNetworkLineGeometryById,
    avpNetworkStationGeometry,    
}