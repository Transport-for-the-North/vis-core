/**
 * Centralised metadata table registry so pages can import a single source of truth.
 */
export const metadataTables = {
    v_vis_avp_programmes_run_info: {
        name: "v_vis_avp_programmes_run_info",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
    },
    dia_airquality_definitions: {
        name: "dia_airquality_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_airquality_definitions",
    },
    avp_networks: {
        name: "avp_networks",
        path: "/api/getgenericdataset?dataset_id=avp_data.avp_networks",
    },
    pba_accessibility_definitions: {
        name: "pba_accessibility_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.pba_accessibility_definitions",
    },
    pba_luti_runcodes: {
        name: "pba_luti_runcodes",
        path: "/api/getgenericdataset?dataset_id=avp_data.pba_luti_runcodes",
    },
    pba_wider_economic_impacts_luti_definitions: {
        name: "pba_wider_economic_impacts_luti_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.pba_wider_economic_impacts_luti_definitions",
    },
    dia_severance_outputs: {
        name: "dia_severance_outputs",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_severance_outputs",
    },
    dia_accessibility_definitions: {
        name: "dia_accessibility_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_accessibility_definitions",
    }
};