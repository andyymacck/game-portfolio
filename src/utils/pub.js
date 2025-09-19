// Helper to reference files you drop into /public with simple paths
// Usage: pub('my-image.jpg') -> '/<basename>/my-image.jpg' in build
export const pub = (relPath = '') => {
  const base = process.env.PUBLIC_URL || '';
  // ensure single slash join
  const clean = String(relPath).replace(/^\/+/, '');
  return `${base}/${clean}`;
};

export default pub;
