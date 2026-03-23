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
  //  cleanedStr = cleanedStr.replace(',', '');
  // Return the cleaned number, converting it back to a number type
  return parseFloat(cleanedStr);
}

/**
 * Parses a string into an array if it looks like a comma-separated list, or returns the input if it's already an array.
 * Throws an error if the input is neither an array nor a valid comma-separated string.
 *
 * @param {string|Array} input - The input to be parsed or returned.
 * @returns {Array} - The parsed array or the original array.
 * @throws {Error} - Throws an error if the input is neither an array nor a valid comma-separated string.
 */
export function parseStringToArray(input) {
  if (Array.isArray(input)) {
      // Input is already an array
      return input;
  } else if (typeof input === 'string' && input.includes(',')) {
      // Input is a string that looks like a comma-separated list
      try {
          const parsedArray = input.split(',').map(item => item.trim());
          return parsedArray;
      } catch (e) {
          throw new Error('Invalid comma-separated string format');
      }
  } else {
      throw new Error('Input is neither an array nor a valid comma-separated string');
  }
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
  // guard against null/undefined
  if (x === null || x === undefined) return "";

  const s = String(x);

  // no decimal → just thousands separators
  if (s.indexOf(".") === -1) {
    return s.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  // keep existing trimming logic, but use the local string
  let cleaned = removeExcessiveZeros(s);
  cleaned = removeRecurringDecimals(cleaned);

  return String(cleaned).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const formatNumber = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return value;

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Very small decimals -- 2 significant figures, no scientific notation
  if (abs > 0 && abs < 0.01) {
    const sig2 = parseFloat(abs.toPrecision(2));
    return sign + sig2.toString();
  }

  // Under 1000 -- 2 decimal places
  if (abs < 999.995) {
    return sign + abs.toFixed(2);
  }

  // 1000 to 9999 -- 0 decimal places, no suffix
  if (abs < 10000) {
    return sign + Math.round(abs).toString();
  }

  // 10,000 to 999,999 -- K suffix
  if (abs < 1_000_000) {
    return sign + (abs / 1_000).toFixed(2) + 'K';
  }

  // 1,000,000 to 999,999,999 -- M suffix
  if (abs < 1_000_000_000) {
    return sign + (abs / 1_000_000).toFixed(2) + 'M';
  }

  // 1,000,000,000+ -- B suffix
  return sign + (abs / 1_000_000_000).toFixed(2) + 'B';
};

export const formatOrdinal = (n) => {
  if (typeof n === 'number') {
    const s = ['th', 'st', 'nd', 'rd'],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  return n;
};