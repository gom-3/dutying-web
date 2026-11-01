// Only fixed public destinations are allowed. Never forward the original query or body.
const destinations = Object.freeze({
  home: 'https://www.dutying.ai/',
  login: 'https://www.dutying.ai/login',
  terms: 'https://www.dutying.ai/terms',
  privacy: 'https://www.dutying.ai/privacy',
  sitemap: 'https://www.dutying.ai/sitemap.xml',
});

export default function handler(req, res) {
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'public, max-age=300');
  const target = new URL(req.url, 'https://retired.invalid').searchParams.get('retirementTarget');
  const destination = Object.hasOwn(destinations, target) ? destinations[target] : null;
  if ((req.method !== 'GET' && req.method !== 'HEAD') || !destination) {
    res.statusCode = 410;
    res.end();
    return;
  }
  res.statusCode = 308;
  res.setHeader('Location', destination);
  res.end();
}
