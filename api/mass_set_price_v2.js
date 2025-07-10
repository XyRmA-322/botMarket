import axios from 'axios'

export default async function handler(req, res) {
  try {
    // Проверка метода
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Проверка заголовков
    const apiKey = req.headers['x-csgo-api-key'] || process.env.CSGO_API_KEY
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' })
    }

    // Проверка тела запроса
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Request body must be JSON' })
    }

    const { items, currency = 'RUB' } = req.body

    // Валидация items
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' })
    }

    if (items.length === 0) {
      return res.status(400).json({ error: 'Items array cannot be empty' })
    }

    if (items.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 items at once' })
    }

    // Запрос к CSGO Market API
    const response = await axios.post(
      'https://market.csgo.com/api/v2/mass-set-price',
      { items },
      {
        params: { key: apiKey, cur: currency },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    )

    // Проверка ответа
    if (!response.data) {
      throw new Error('Empty response from CSGO Market API')
    }

    return res.status(200).json(response.data)
  } catch (error) {
    console.error('Full error:', error)
    const errorDetails = {
      message: error.message,
      responseData: error.response?.data,
      requestConfig: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    }

    return res.status(500).json({
      error: 'Failed to update prices',
      details: errorDetails
    })
  }
}
