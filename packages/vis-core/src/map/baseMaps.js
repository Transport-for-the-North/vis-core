import { getMapApiToken } from "../runtime";

/**
 * Descriptor for a base map.
 *
 * @typedef {Object} BaseMapDescriptor
 * @property {string} id - Unique identifier.
 * @property {string} label - Human-readable label shown in the UI.
 * @property {'light'|'dark'} theme - Colour theme.
 * @property {() => string} resolveStyle - Returns the style URL.
 * @property {Object} [labels] - Label placement and paint policy.
 */

const PLACE_LABELS = {
  placement: "above-application",
  layerPrefixes: ["place_", "place-"],
};

const DARK_LABEL_PAINT = {
  default: {
    "text-color": "#ffffff",
    "text-halo-color": "rgba(0, 0, 0, 0.85)",
    "text-halo-width": 1.25,
    "text-halo-blur": 0.5,
  },
  byLayerId: {
    place_city: {
      "text-halo-width": 1.5,
    },
    place_city_large: {
      "text-halo-width": 1.5,
    },
    place_capital: {
      "text-halo-width": 1.5,
    },
  },
};

export const BASE_MAPS = {
  positron: {
    id: "positron",
    label: "Light map",
    theme: "light",
    resolveStyle: () =>
      `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${getMapApiToken()}`,
    labels: {
      ...PLACE_LABELS,
      paint: "provider",
    },
  },

  darkMatter: {
    id: "darkMatter",
    label: "Dark map",
    theme: "dark",
    resolveStyle: () => "https://tiles.openfreemap.org/styles/dark",
    labels: {
      ...PLACE_LABELS,
      paint: DARK_LABEL_PAINT,
    },
  },
};

export const DEFAULT_BASE_MAP_ID = "positron";

/**
 * Returns the descriptor for a given base-map ID.
 * Falls back to the default descriptor if the ID is unknown.
 *
 * @param {string} id
 * @returns {BaseMapDescriptor}
 */
export const getBaseMap = (id) =>
  BASE_MAPS[id] ?? BASE_MAPS[DEFAULT_BASE_MAP_ID];

/**
 * Resolves the style URL from a base-map descriptor.
 *
 * @param {BaseMapDescriptor} descriptor
 * @returns {string}
 */
export const resolveBaseMapStyle = (descriptor) => descriptor.resolveStyle();

/**
 * Validates a base-map descriptor at development time.
 * Throws if any required field is missing or invalid.
 *
 * @param {unknown} descriptor
 */
export function validateBaseMapDescriptor(descriptor) {
  if (!descriptor?.id) {
    throw new Error("Base map requires an id");
  }

  if (!["light", "dark"].includes(descriptor.theme)) {
    throw new Error(
      `Base map "${descriptor.id}" requires theme "light" or "dark"`
    );
  }

  if (typeof descriptor.resolveStyle !== "function") {
    throw new Error(
      `Base map "${descriptor.id}" requires resolveStyle()`
    );
  }
}
