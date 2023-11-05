export const config = {
  runtime: 'edge'
};

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
}

const handler = async () => {
  const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/zrevrange/highscores/0/9/WITHSCORES`, {
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

  const data = await response.json();

  const highscores = [];
  for (let i = 0; i < data.result.length; i += 2) {
    highscores.push({
      name: data.result[i],
      score: parseInt(data.result[i + 1])
    });
  }

  return new Response(JSON.stringify(highscores), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default handler;
