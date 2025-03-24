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
  noSub.forEach((p) =>
    result.push({ ...p, external: p.external || false })
  );
  
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
      external: subGroups[subName][0].external || false,
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

/**
 * Build the navigation bar links based on internal pages and external links available in the application context.
 *
 * This function processes internal pages and external links into a unified array of link objects that
 * can be used to render a navigation bar. It supports grouping pages and links by category into dropdown menus,
 * and sets properties such as labels, URLs, and background colors.
 *
 * @param {Object} appContext - The application context containing pages and optional external links.
 * @param {Array<Object>} appContext.appPages - Array of internal page objects.
 * @param {string} appContext.appPages[].pageName - The display name of the internal page.
 * @param {string} appContext.appPages[].url - The URL path of the internal page.
 * @param {string} [appContext.appPages[].customLogoPath] - Optional path for a custom logo.
 * @param {string} [appContext.appPages[].category] - Optional category name to group the page.
 * @param {string} appContext.appPages[].navbarLinkBgColour - The background color for the navbar link.
 * @param {Array<Object>} [appContext.externalLinks] - Optional array of external link objects.
 * @param {string} appContext.externalLinks[].label - The display label of the external link.
 * @param {string} appContext.externalLinks[].url - The URL for the external link.
 * @param {string} [appContext.externalLinks[].category] - Optional category name to group the external link.
 * @param {string} appContext.externalLinks[].navbarLinkBgColour - The background colour for the navbar link.
 *
 * @returns {Array<Object>} An array of navigation link objects ready to be rendered as part of the navbar.
 *
 * @example
 * const appContext = {
 *   appPages: [
 *     { pageName: "About", url: "/about", navbarLinkBgColour: "#123456" },
 *     { pageName: "Portfolio", url: "/portfolio", category: "Work", navbarLinkBgColour: "#654321" }
 *   ],
 *   externalLinks: [
 *     { label: "GitHub", url: "https://github.com", navbarLinkBgColour: "#abcdef" },
 *     { label: "LinkedIn", url: "https://linkedin.com", category: "Social", navbarLinkBgColour: "#fedcba" }
 *   ]
 * };
 *
 * const navbarLinks = buildNavbarLinks(appContext);
 */
export function buildNavbarLinks(appContext) {
  const links = [];

  // Add Home link.
  links.push({ label: "Home", url: "/", navbarLinkBgColour: "#7317de" });

  // Internal pages without a category.
  appContext.appPages
    .filter((page) => !page.category)
    .forEach((page) => {
      links.push({
        label: page.pageName,
        url: page.url,
        customLogoPath: page.customLogoPath,
        navbarLinkBgColour: page.navbarLinkBgColour,
      });
    });

  // Group internal pages with categories.
  const pagesByCategory = {};
  appContext.appPages
    .filter((page) => page.category)
    .forEach((page) => {
      if (!pagesByCategory[page.category]) pagesByCategory[page.category] = [];
      pagesByCategory[page.category].push(page);
    });
  Object.keys(pagesByCategory).forEach((category) => {
    const tree = buildDropdownTree(pagesByCategory[category]);
    links.push({
      label: category,
      dropdownItems: tree,
      navbarLinkBgColour: pagesByCategory[category][0].navbarLinkBgColour,
    });
  });

  // Process external links.
  if (appContext.externalLinks) {
    // External links without a category.
    appContext.externalLinks
      .filter((link) => !link.category)
      .forEach((link) => {
        links.push({
          label: link.label,
          url: link.url,
          navbarLinkBgColour: link.navbarLinkBgColour,
          external: true,
        });
      });
    // External links with categories.
    const externalByCategory = {};
    appContext.externalLinks
      .filter((link) => link.category)
      .forEach((link) => {
        if (!externalByCategory[link.category]) externalByCategory[link.category] = [];
        externalByCategory[link.category].push(link);
      });
    Object.keys(externalByCategory).forEach((category) => {
      const tree = buildDropdownTree(
        externalByCategory[category].map((link) => ({
          ...link,
          external: true,
        }))
      );
      links.push({
        label: category,
        dropdownItems: tree,
        navbarLinkBgColour: externalByCategory[category][0].navbarLinkBgColour,
      });
    });
  }
  return links;
}
