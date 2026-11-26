import { z } from 'zod';

export const config = {
  runtime: 'edge'
};

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
}

if (!process.env.TURNSTILE_SECRET_KEY) {
  throw new Error('TURNSTILE_SECRET_KEY must be set');
}

const validateTurnstile = async (token: string, remoteip?: string) => {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      ...(remoteip ? { remoteip } : {})
    })
  });

  if (!response.ok) {
    return false;
  }

  const json = await response.json();

  return Boolean(json.success) && (!json.action || json.action === 'highscore');
};

const schema = z.object({
  name: z.string().min(1).max(20),
  score: z.number().int().min(0),
  turnstileToken: z.string().min(1)
});

const handler = async (request: Request) => {
  const body = await request.json();

  const bodyResult = schema.safeParse(body);
  if (!bodyResult.success) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid body' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const { name, score, turnstileToken } = bodyResult.data;
  const remoteip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;

  const validTurnstile = await validateTurnstile(turnstileToken, remoteip);
  if (!validTurnstile) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid turnstile token'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/zadd/highscores/gt/${score}/${name.trim()}`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ success: false }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default handler;
