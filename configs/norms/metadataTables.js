const inputNormsScenarioMetadataTable = {
    name: "input_norms_scenario",
    path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario"
}

const keyLocationTypeMetadataTable = {
    name: "key_location_type_list",
    path: "/api/getgenericdataset?dataset_id=foreign_keys.key_location_type_list"
}

const userClassMetadataTable = {
    name: "norms_userclass_list",
    path: "/api/getgenericdataset?dataset_id=foreign_keys.norms_userclass_list"
}

const landUseSegmentMetadataTable = {
    name: "landuse_segment_list",
    path: "/api/getgenericdataset?dataset_id=foreign_keys.landuse_segment_list"
}

// Export the metadata tables
export const metadataTables = {
    inputNormsScenarioMetadataTable,
    keyLocationTypeMetadataTable,
    userClassMetadataTable,
    landUseSegmentMetadataTable
};