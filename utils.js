const url = require('url');

function generateSlugFromUrl(urlString) {
  const parsedUrl = url.parse(urlString);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''); // Remove leading and trailing slashes
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart;
}

module.exports = {
  generateSlugFromUrl,
};
