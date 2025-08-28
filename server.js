import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const safePath = path.normalize(path.join(__dirname, 'dist', 'index.html'));
  const distPath = path.join(__dirname, 'dist');
  
  // Ensure the resolved path is within the dist directory
  if (!safePath.startsWith(distPath)) {
    return res.status(403).send('Access denied');
  }
  
  res.sendFile(safePath);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});