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
    const marketHashNames = req.query.marketHashNames || ''

    if (!marketHashNames) {
      return res.status(404).json({
        error: 'marketHashNames required',
        details: 'No marketHashNames provided'
      })
    }

    const { data } = await axios.get(`https://market.csgo.com/api/v2/search-list-items-by-hash-name-all?key=${apiKey}${marketHashNames}`)

    // res.setHeader('Cache-Control', 's-maxage=60')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Market API error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
