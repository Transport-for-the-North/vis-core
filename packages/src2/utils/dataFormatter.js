/**
 * dataFormatter.js
 *
 * This module provides functions for formatting data values.
 * It supports multiple formatting options such as date, datetime,
 * currency, uppercase/lowercase strings, number formatting, JSON stringification,
 * and even custom formatting via a user-provided function.
 */

/**
 * Formats a data value based on the provided format type and options.
 *
 * Supported format types:
 *   - "date":       Format as a locale-specific short date string (without time).
 *   - "datetime":   Format as a locale-specific date and time string.
 *   - "currency":   Format as currency using Intl.NumberFormat.
 *   - "uppercase":  Convert the value to uppercase.
 *   - "lowercase":  Convert the value to lowercase.
 *   - "number":     Format as a localized number.
 *   - "json":       Convert the value to a pretty-printed JSON string.
 *   - "custom":     Use a custom formatting function provided via options.customFormatter.
 *   - "longdate":   Format a date into a locale-specific long format including the day of the week.
 *
 * @param {*} value - The input value to format.
 * @param {string} formatType - The type of formatting to apply.
 * @param {object} [options={}] - Optional settings to control formatting.
 * @param {string} [options.locale] - Locale string (e.g., "en-US") to use for locale-specific formatting.
 * @param {string} [options.currency="USD"] - Currency code to use when formatting currency.
 * @param {function} [options.customFormatter] - Custom formatting function for "custom" format type.
 *
 * @returns {*} - The formatted value if formatting can be applied; otherwise, the original value.
 */
export function formatDataValue(value, formatType, options = {}) {
  if (value == null) {
    return value;
  }
  switch (formatType) {
    case "date": {
      // Format as a locale date string.
      const date = new Date(value);
      return isNaN(date.getTime())
        ? value
        : date.toLocaleDateString(options.locale);
    }
    case "datetime": {
      // Format as a locale date-time string.
      const date = new Date(value);
      return isNaN(date.getTime())
        ? value
        : date.toLocaleString(options.locale);
    }
    case "longdate": {
      // Format a date into a locale-specific long format including the weekday.
      // Example: "Wednesday, December 25, 2020"
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }
      const locale = options.locale || undefined;
      const formatter = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formatter.format(date);
    }
    case "currency": {
      // Format the value as currency using Intl.NumberFormat.
      const currency = options.currency || "USD";
      const locale = options.locale || undefined;
      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      });
      return formatter.format(value);
    }
    case "uppercase": {
      // Convert the value to uppercase.
      return String(value).toUpperCase();
    }
    case "lowercase": {
      // Convert the value to lowercase.
      return String(value).toLowerCase();
    }
    case "number": {
      // Format the value as a localized number.
      const locale = options.locale || undefined;
      return Number(value).toLocaleString(locale);
    }
    case "json": {
      // Convert the value to a nicely formatted JSON string.
      return JSON.stringify(value, null, 2);
    }
    case "custom": {
      // Use a custom formatting function if provided.
      if (typeof options.customFormatter === "function") {
        return options.customFormatter(value);
      }
      return value;
    }
    default:
      // If the formatType is not recognized, return the value unchanged.
      return value;
  }
}