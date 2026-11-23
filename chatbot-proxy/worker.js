const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 800;
const MAX_MESSAGES = 40;
const MAX_BODY_CHARS = 60000;
const MAX_TOOLS = 20;

const ALLOWED_ORIGINS = ['http://localhost:4200', 'https://secreta77.github.io'];

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function reply(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return reply({ error: 'Origin not allowed' }, 403, {});
    }

    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return reply({ error: 'Method not allowed' }, 405, cors);
    }

    const text = await request.text();
    if (text.length > MAX_BODY_CHARS) {
      return reply({ error: 'Request too large' }, 413, cors);
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return reply({ error: 'Invalid JSON' }, 400, cors);
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
      return reply({ error: 'Invalid messages' }, 400, cors);
    }

    const payload = {
      model: MODEL,
      max_tokens: Math.min(Number(body.max_tokens) || MAX_TOKENS, MAX_TOKENS),
      system: typeof body.system === 'string' ? body.system : undefined,
      messages: body.messages,
      tools: Array.isArray(body.tools) ? body.tools.slice(0, MAX_TOOLS) : undefined,
    };

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  },
};
