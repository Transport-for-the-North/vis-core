/**
 * Builds a nested tree structure from an array of page objects by grouping pages with a subCategory.
 *
 * Pages without a subCategory remain at the top level, while pages with a subCategory are grouped.
 *
 * @param {Array<Object>} pages - An array of page objects (each may have a 'subCategory').
 * @returns {Array<Object>} A tree structure with nested children where applicable.
 */
export function buildDropdownTree(pages) {
  const result = [];
  // Add pages that do not have a subCategory.
  const noSub = pages.filter((p) => !p.subCategory);
  noSub.forEach((p) => result.push({ ...p }));

  // Group pages by subCategory.
  const subGroups = {};
  pages.forEach((p) => {
    if (p.subCategory) {
      if (!subGroups[p.subCategory]) subGroups[p.subCategory] = [];
      subGroups[p.subCategory].push(p);
    }
  });

  // For each subCategory, add a grouping node with its children.
  Object.keys(subGroups).forEach((subName) => {
    result.push({
      pageName: subName,
      children: subGroups[subName],
    });
  });

  return result;
}

/**
 * Creates a common onClick handler for a navigation item.
 *
 * This helper returns a function that, when invoked, calls the parent onClick handler with
 * the standardized arguments (item URL, custom logo path, and navigation link background colour).
 *
 * @param {Object} item - A navigation item containing at least a 'url', and optionally 'customLogoPath' and 'navbarLinkBgColour'.
 * @param {Function} onClick - The parent onClick handler.
 * @param {string} defaultBgColor - Default background colour to use if the item does not provide one.
 * @returns {Function} The generated onClick handler.
 */
export function createNavItemClickHandler(item, onClick, defaultBgColor) {
  return () =>
    onClick(
      item.url,
      item.customLogoPath || null,
      item.navbarLinkBgColour || defaultBgColor
    );
}
