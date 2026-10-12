import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { pool } from './config/db.js';
import candidateRoutes from './routes/candidateRoutes.js';

const app = express();
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});
app.use('/api', candidateRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' });
});

app.listen(config.port, () => console.log(`API running at http://localhost:${config.port}`));
