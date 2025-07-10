import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// 1. Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 2. Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// 3. Список API endpoints
const apiEndpoints = [
  { path: 'prices', method: 'all' },
  { path: 'csgo-ping', method: 'all' },
  { path: 'get_items', method: 'all' },
  { path: 'mass_set_price', method: 'all' },
  { path: 'search_list_items_by_hash_name_all', method: 'all' },
  { path: 'mass_set_price_v2', method: 'post' }
]

// 4. Загрузка API handlers
async function loadApiRoutes() {
  for (const endpoint of apiEndpoints) {
    try {
      const module = await import(`./api/${endpoint.path}.js`)

      if (typeof module.default !== 'function') {
        throw new Error(`Handler for ${endpoint.path} is not a function`)
      }

      switch (endpoint.method) {
        case 'all':
          app.all(`/api/${endpoint.path}`, module.default)
          break
        case 'post':
          app.post(`/api/${endpoint.path}`, module.default)
          break
        default:
          app.all(`/api/${endpoint.path}`, module.default)
      }

      console.log(`✅ Route /api/${endpoint.path} (${endpoint.method}) loaded`)
    } catch (err) {
      console.error(`❌ Failed to load /api/${endpoint.path}:`, err.message)
    }
  }
}

// 5. Загрузка статики
app.use(
  express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript')
      } else if (filePath.endsWith('.css')) {
        res.set('Content-Type', 'text/css')
      }
    }
  })
)

// 6. Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// 7. Запуск сервера
const startServer = async () => {
  await loadApiRoutes()

  const PORT = process.env.PORT || 3003
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log('Available routes:')
    apiEndpoints.forEach((ep) => console.log(`- /api/${ep.path} (${ep.method.toUpperCase()})`))
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

export default app

// import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import cors from 'cors'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const app = express()

// // Middleware
// app.use(cors())
// app.use(express.json())

// // API routes
// const apiFiles = ['prices', 'csgo-ping', 'get_items', 'mass_set_price', 'search_list_items_by_hash_name_all', 'mass_set_price_v2']

// for (const file of apiFiles) {
//   try {
//     const module = await import(`./api/${file}.js`)
//     app.all(`/api/${file}`, module.default)
//     console.log(`Route /api/${file} loaded successfully`)
//   } catch (err) {
//     console.error(`Failed to load route /api/${file}:`, err)
//   }
// }

// // Serve static files
// app.use(express.static(path.join(__dirname, 'dist')))

// // SPA fallback
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

// export default app
