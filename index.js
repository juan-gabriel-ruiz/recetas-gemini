import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = 3000;

// Emular __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Ruta para servir el HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Ruta para servir CSS
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});

// ✅ Ruta para servir logo
app.get('/logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'logo.png'));
});

// ✅ Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ✅ Ruta para generar receta
app.post('/generar-receta', async (req, res) => {
  const { nombrePlato } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

    const prompt = `Genera una receta completa para el plato: "${nombrePlato}". Incluye ingredientes, preparación paso a paso, tiempo de cocción y algún consejo útil.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const receta = response.text();

    res.json({ receta });
  } catch (error) {
    console.error('Error al generar la receta:', error);
    res.status(500).json({ error: 'No se pudo generar la receta.' });
  }
});

// ✅ Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});