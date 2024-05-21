/**
 * Returns the opacity property name for a given layer type.
 *
 * @param {string} layerType - The type of the layer. Expected values are 'line', 'fill', or 'circle'.
 * @returns {string} The corresponding opacity property name.
 * @throws Will throw an error if the layer type is invalid.
 */
export function getOpacityProperty(layerType) {
    let opacityProp;
    switch (layerType) {
      case 'line': {
        opacityProp = "line-opacity";
        break;
      }
      case 'fill': {
        opacityProp = "fill-opacity";
        break;
      }
      case 'circle': {
        opacityProp = "circle-opacity";
        break;
      }
      default:
        throw new Error(`Invalid layer type ${layerType}`);
    }
    return opacityProp;
  }