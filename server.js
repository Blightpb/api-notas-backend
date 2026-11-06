const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;   // Render define a porta; local usa 3000
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (erro) {
    return [];
  }
}

function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

app.get('/api/notes', (req, res) => {
  res.json(readNotes());
});

app.get('/api/notes/:id', (req, res) => {
  const note = readNotes().find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Nota não encontrada' });
  res.json(note);
});

app.post('/api/notes', (req, res) => {
  const { titulo, texto } = req.body;
  if (!titulo || !texto) {
    return res.status(400).json({ error: 'Título e texto são obrigatórios' });
  }
  const notes = readNotes();
  const newNote = {
    id: Date.now().toString(),
    titulo,
    texto,
    criadoEm: new Date().toISOString()
  };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Nota não encontrada' });

  const { titulo, texto } = req.body;
  if (!titulo || !texto) {
    return res.status(400).json({ error: 'Título e texto são obrigatórios' });
  }
  notes[index] = { ...notes[index], titulo, texto };
  writeNotes(notes);
  res.json(notes[index]);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const filtradas = notes.filter(n => n.id !== req.params.id);
  if (filtradas.length === notes.length) {
    return res.status(404).json({ error: 'Nota não encontrada' });
  }
  writeNotes(filtradas);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  if (!fs.existsSync(DATA_FILE)) writeNotes([]);
});