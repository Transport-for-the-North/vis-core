export const buildCopyright = (extraHtml) => {
  const year = new Date().getFullYear();
  return `Contains OS data © Crown copyright and database right ${year}${
    extraHtml ? ` | ${extraHtml}` : ''
  }`;
};