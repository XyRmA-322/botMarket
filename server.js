import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

// Динамический импорт API-роутов
const apiModules = await Promise.all(
  ['prices', 'csgo-ping', 'get_items', 'mass_set_price', 'search_list_items_by_hash_name_all'].map(async (file) => {
    return {
      name: file,
      module: await import(`./api/${file}.js`)
    }
  })
)

apiModules.forEach(({ name, module }) => {
  app.all(`/api/${name}`, async (req, res) => {
    try {
      await module.default(req, res)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
})

app.listen(3001, () => console.log('API server: http://localhost:3000'))

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
