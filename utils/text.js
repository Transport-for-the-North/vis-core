export const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel risus ante. Donec eu molestie odio, quis dapibus ipsum. Quisque in erat aliquet, facilisis ante commodo, maximus erat. Cras convallis varius lectus, et imperdiet mi lobortis vel. Nunc a arcu enim. Fusce viverra ex porta est egestas sodales. Vestibulum lacus metus, imperdiet hendrerit libero non, gravida feugiat tortor. Sed nulla tortor, sodales id sem quis, auctor vehicula ante. Donec id ullamcorper velit. Pellentesque vel commodo quam. In sollicitudin nulla ac consectetur pharetra. "

/**
 * Formats a number with commas for thousands separator.
 * @function numberWithCommas
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 */

 function removeExcessiveZeros(number) {
  // Convert the number to a string
  let numStr = number.toString();
  
  // Regular expression to find six or more zeros followed by any digits
  let regex = /(0{6,}\d*)$/;
  
  // Replace the matched sequence with an empty string
  let cleanedStr = numStr.replace(regex, '');
  
  // Return the cleaned number, converting it back to a number type
  return parseFloat(cleanedStr);
}

function removeRecurringDecimals(number) {
  // Convert the number to a string
  let numStr = number.toString();
  
  // Regular expression to find recurring decimals at the end
  // This regex captures repeating digits at the end of the number
  let regex = /(\d+?)\1+$/;
  
  // Replace the recurring part with a single instance
  let cleanedStr = numStr.replace(regex, '$1');
  
  // Return the cleaned number, converting it back to a number type
  return parseFloat(cleanedStr);
}

export function numberWithCommas(x) {
    x = x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    // Check if it contains a decimal.
    if (x.toString().indexOf('.') === -1) {
      return x
    }
    // Regex to remove excessive zeros.
    x = removeExcessiveZeros(x)
    // Regex to truncate recurring decimals.
    x = removeRecurringDecimals(x)
    return x
  }