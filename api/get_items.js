// api/prices.ts
import axios from 'axios'

export default async function handler(req, res) {
  try {
    // Получаем API ключ из заголовка запроса
    const apiKey = req.headers['x-csgo-api-key'] || process.env.CSGO_API_KEY

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        details: 'No CSGO API key provided'
      })
    }

    const { data } = await axios.get('https://market.csgo.com/api/v2/items?key=' + apiKey)

    // res.setHeader('Cache-Control', 's-maxage=60')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Market API error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
