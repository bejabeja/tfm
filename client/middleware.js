const BOT_PATTERN = /whatsapp|telegram|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|applebot|imessage|viber/i;

const RESOURCE_OG_PATHS = { itinerary: 'itinerary', 'friend-profile': 'profile' };

export const config = {
  matcher: ['/itinerary/:id*', '/friend-profile/:id*'],
};

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_PATTERN.test(ua)) return;

  const url = new URL(request.url);
  const [, resource, id] = url.pathname.split('/');
  const ogPath = RESOURCE_OG_PATHS[resource];
  if (!ogPath || !id) return;

  const apiUrl = process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:3000';
  return new Response(null, {
    status: 302,
    headers: { Location: `${apiUrl}/og/${ogPath}/${id}` },
  });
}
