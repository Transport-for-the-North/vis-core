export const hasRouteParameter = (path) => /\{.+?\}/.test(path);

export const replaceRouteParameter = (path, paramName, paramValue) => path.replace(`{${paramName}}`, paramValue);

