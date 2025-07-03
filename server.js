import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// Динамический импорт API-роутов
const apiModules = await Promise.all(
  ['prices', 'ping-new'].map(async (file) => {
    return {
      name: file,
      module: await import(`./api/${file}.js`)
    };
  })
);

apiModules.forEach(({name, module}) => {
  app.all(`/api/${name}`, async (req, res) => {
    try {
      await module.default(req, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

app.listen(3000, () => console.log('API server: http://localhost:3000'));