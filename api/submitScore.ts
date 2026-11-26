import { z } from 'zod';

export const config = {
  runtime: 'edge'
};

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
}

const validateTurnstile = async (token: string) => {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY ?? '', response: token })
  });
  const json = await response.json();

  // Test keys return an empty action
  return json.success && (!json.action || json.action === 'highscore');
};

const schema = z.object({
  // Names go into the Upstash command path, where the URL parser rewrites many characters
  // (e.g. `../../../../flushall`, `..`, trailing control characters), so only allow a safe set
  name: z
    .string()
    .max(20)
    .trim()
    .min(1)
    .regex(/^(?!\.\.?$)[\p{L}\p{M}\p{N} _.'-]+$/u),
  score: z.number().int().min(0),
  turnstileToken: z.string()
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

  const validTurnstile = await validateTurnstile(turnstileToken);
  if (!validTurnstile) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid turnstile token'
      }),
      {
        status: 400
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
      status: 500,
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
