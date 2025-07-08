// import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const app = express()
// app.use(express.json())

// // Динамический импорт API-роутов
// const apiModules = await Promise.all(
//   ['prices', 'csgo-ping', 'get_items', 'mass_set_price', 'search_list_items_by_hash_name_all', 'mass_set_price_v2'].map(async (file) => {
//     return {
//       name: file,
//       module: await import(`./api/${file}.js`)
//     }
//   })
// )

// apiModules.forEach(({ name, module }) => {
//   app.all(`/api/${name}`, async (req, res) => {
//     try {
//       await module.default(req, res)
//     } catch (error) {
//       res.status(500).json({ error: error.message })
//     }
//   })
// })

// app.listen(3010, () => console.log('API server: http://localhost:3000'))
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Динамический импорт API-роутов
const apiFiles = ['prices', 'csgo-ping', 'get_items', 'mass_set_price', 'search_list_items_by_hash_name_all', 'mass_set_price_v2']

for (const file of apiFiles) {
  try {
    const module = await import(`./api/${file}.js`)
    app.all(`/api/${file}`, async (req, res) => {
      try {
        await module.default(req, res)
      } catch (error) {
        console.error(`Error in ${file} route:`, error)
        res.status(500).json({ error: error.message })
      }
    })
  } catch (err) {
    console.error(`Failed to load ${file} route:`, err)
  }
}

// Serve static files from dist (Vue app)
app.use(express.static(path.join(__dirname, '../dist')))

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

export default app
