import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'ts-node/register'; // Добавляем поддержку TS

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// Динамический импорт TS-модулей
const apiFiles = ['prices'];

apiFiles.forEach(async (file) => {
  const module = await import(`./api/${file}.ts`);
  app.all(`/api/${file}`, async (req, res) => {
    try {
      await module.default(req, res);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
});

app.listen(3000, () => console.log('Dev API server: http://localhost:3000'));