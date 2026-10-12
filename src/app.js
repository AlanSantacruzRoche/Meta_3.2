import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import YAML from 'yaml';
import sequelize from './config/database.js';
import './models/index.js';
import jugadoresRoutes from './routes/jugadores.routes.js';
import rostersRoutes from './routes/rosters.routes.js';
import auxiliaresRoutes from './routes/auxiliares.routes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API = '/api/v1';
app.get(`${API}/health`, async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
app.use(`${API}/jugadores`, jugadoresRoutes);
app.use(`${API}/rosters`, rostersRoutes);
app.use(`${API}`, auxiliaresRoutes);

const openapi = YAML.parse(fs.readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use((req, res) => res.status(404).json({ error: 'Endpoint no encontrado.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const port = Number(process.env.PORT || 3000);
const start = async () => {
  try {
    await sequelize.authenticate();
    // Para una práctica inicial. En producción, usar migraciones de Sequelize.
    await sequelize.sync();
    console.log('Conexión a MySQL establecida.');
    app.listen(port, () => console.log(`API activa en http://localhost:${port}`));
  } catch (error) {
    console.error('No se pudo iniciar la API. Revisa MySQL y el archivo .env.', error.message);
    process.exit(1);
  }
};
start();
