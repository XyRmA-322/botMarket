import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' })
  }

  const { steamCookies } = req.body

  if (!steamCookies) {
    return res.status(400).json({ error: 'Steam cookies required' })
  }

  try {
    // 1. Получаем Steam WebAPI токен
    const tokenResponse = await axios.get('https://steamcommunity.com/pointssummary/ajaxgetasyncconfig', {
      headers: {
        Cookie: steamCookies,
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json'
      }
    })

    if (!tokenResponse.data?.success || !tokenResponse.data.data?.webapi_token) {
      throw new Error('Failed to get Steam token')
    }

    const accessToken = tokenResponse.data.data.webapi_token

    // 2. Отправляем ping-new запрос
    const pingResponse = await axios.post(
      `https://market.csgo.com/api/v2/ping-new?key=${process.env.CSGO_API_KEY}`,
      {
        access_token: accessToken
      },
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/json'
        }
      }
    )

    res.status(200).json({
      success: true,
      marketResponse: pingResponse.data
    })
  } catch (error) {
    console.error('Ping error:', error)
    res.status(500).json({
      error: 'Failed to ping CSGO Market',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
