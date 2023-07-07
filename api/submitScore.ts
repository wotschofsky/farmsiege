import { z } from 'zod';

export const config = {
  runtime: 'edge',
};

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set'
  );
}

const validateRecaptcha = async (token: string) => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const json = await response.json();

  return json.success && json.score >= 0.5;
};

const schema = z.object({
  name: z.string().min(1).max(20),
  score: z.number().int().min(0),
  recaptcha: z.string(),
});

const handler = async (request: Request) => {
  const body = await request.json();

  const bodyResult = schema.safeParse(body);
  if (!bodyResult.success) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid body' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const { name, score, recaptcha } = bodyResult.data;

  const validRecaptcha = await validateRecaptcha(recaptcha);
  if (!validRecaptcha) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid recaptcha',
      }),
      {
        status: 400,
      }
    );
  }

  const response = await fetch(
    `${
      process.env.UPSTASH_REDIS_REST_URL
    }/zadd/highscores/gt/${score}/${name.trim()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return new Response(JSON.stringify({ success: false }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default handler;
