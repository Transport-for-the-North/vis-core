export const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel risus ante. Donec eu molestie odio, quis dapibus ipsum. Quisque in erat aliquet, facilisis ante commodo, maximus erat. Cras convallis varius lectus, et imperdiet mi lobortis vel. Nunc a arcu enim. Fusce viverra ex porta est egestas sodales. Vestibulum lacus metus, imperdiet hendrerit libero non, gravida feugiat tortor. Sed nulla tortor, sodales id sem quis, auctor vehicula ante. Donec id ullamcorper velit. Pellentesque vel commodo quam. In sollicitudin nulla ac consectetur pharetra. "

/**
 * Formats a number with commas for thousands separator.
 * @function numberWithCommas
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 */
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }