import axios from 'axios'

export default async function handler(req, res) {
  try {
    const apiKey = req.headers['x-csgo-api-key'] || process.env.CSGO_API_KEY

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' })
    }

    const { marketHashName, newPrice } = req.query

    // Улучшенное кодирование названия
    const encodedName = encodeURIComponent(marketHashName).replace(/'/g, '%27').replace(/!/g, '%21')

    const url = `https://market.csgo.com/api/MassSetPrice/${encodedName}/${newPrice}/?key=${apiKey}`

    console.log('API Request URL:', url) // Важно для отладки

    const { data } = await axios.get(url, {
      validateStatus: () => true // Чтобы axios не выбрасывал ошибку при 404
    })

    if (!data.success) {
      return res.status(400).json({
        error: data.error || 'API operation failed',
        details: data
      })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}
