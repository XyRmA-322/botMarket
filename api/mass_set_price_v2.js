import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const apiKey = req.headers['x-csgo-api-key'] || process.env.CSGO_API_KEY
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' })
    }

    const { items, currency = 'RUB' } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array required' })
    }

    if (items.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 items at once' })
    }

    const response = await axios.post(
      'https://market.csgo.com/api/v2/mass-set-price',
      { items },
      {
        params: {
          key: apiKey,
          cur: currency
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Mass set price error:', error)
    res.status(500).json({
      error: 'Failed to update prices',
      details: error.response?.data || error.message
    })
  }
}
