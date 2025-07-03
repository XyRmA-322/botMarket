import axios from 'axios';

export default async function handler(
  req,
  res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { steamToken } = req.body;
  
  if (!steamToken) {
    return res.status(400).json({ error: 'Steam token is required' });
  }

  try {
    const response = await axios.post(
      'https://market.csgo.com/api/v2/ping-new',
      {
        access_token: steamToken
      },
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CSGO_API_KEY}`
        }
      }
    );

    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Ping error:', error);
    res.status(500).json({
      error: 'Failed to ping market.csgo.com',
      details: error instanceof Error ? error.message : error
    });
  }
}