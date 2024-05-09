export const hasRouteParameter = (path) => {
    // Check if the path contains at least one "{parameter}" other than "{z}/{x}/{y}"
    const parameterPattern = /\{(?![zyx]\})[^{}]+\}/; // Matches any parameter that is not {z}, {x}, or {y}
    return parameterPattern.test(path);
};

export const replaceRouteParameter = (path, paramName, paramValue) => path.replace(`{${paramName}}`, paramValue);

