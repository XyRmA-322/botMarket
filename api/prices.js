import axios from 'axios';

export default async function handler(
  req,
  res
) {
  try {
    const { data } = await axios.get('https://market.csgo.com/api/v2/prices/RUB.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Authorization': `Bearer ${process.env.CSGO_API_KEY}`
      }
    });
    
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Market API error',
      details: error instanceof Error ? error.message : error
    });
  }
}