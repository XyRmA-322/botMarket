// api/prices.ts
import axios from 'axios'

export default async function handler(req, res) {
  try {
    const apiKey = req.headers['x-csgo-api-key'] || process.env.CSGO_API_KEY

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        details: 'No CSGO API key provided'
      })
    }
    const marketHashName = req.query.marketHashName || ''
    const newPrice = req.query.newPrice || ''

    if (!marketHashName) {
      return res.status(404).json({
        error: 'marketHashName required',
        details: 'No marketHashName provided'
      })
    }
    if (!newPrice) {
      return res.status(404).json({
        error: 'newPrice required',
        details: 'No newPrice provided'
      })
    }

    const { data } = await axios.get(`https://market.csgo.com/api/MassSetPrice/${marketHashName}/${newPrice}/items?key=${apiKey}`)

    res.setHeader('Cache-Control', 's-maxage=60')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Market API error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
