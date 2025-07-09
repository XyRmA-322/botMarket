import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// API routes
const apiFiles = ['prices', 'csgo-ping', 'get_items', 'mass_set_price', 'search_list_items_by_hash_name_all', 'mass_set_price_v2']

for (const file of apiFiles) {
  try {
    const module = await import(`./api/${file}.js`)
    app.all(`/api/${file}`, module.default)
    console.log(`Route /api/${file} loaded successfully`)
  } catch (err) {
    console.error(`Failed to load route /api/${file}:`, err)
  }
}

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)

// // Динамический импорт API роутов
// async function loadApiRoutes(app) {
//   // Очищаем кэш модулей
//   Object.keys(require.cache).forEach((key) => {
//     if (key.includes('/api/')) delete require.cache[key]
//   })

//   const apiFiles = ['prices', 'csgo-ping', 'get_items']

//   for (const file of apiFiles) {
//     try {
//       const module = await import(`./api/${file}.js`)
//       app.all(`/api/${file}`, module.default)
//     } catch (err) {
//       console.error(`Error loading ${file}:`, err)
//     }
//   }
// }

// export async function startServer() {
//   const app = express()

//   // Загружаем роуты при старте
//   await loadApiRoutes(app)

//   app.listen(import.meta.env.PORT, () => {
//     console.log('API server: http://localhost:' + import.meta.env.PORT)
//   })

//   return app
// }
