const express = require('express');
const path = require('path');
const books = require('./db/books');
const genres = require('./db/genres');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/katalogas', (req, res) => {
  const q = req.query;
  const filtrai = {
    pavadinimas: String(q.pavadinimas || '').trim(),
    autorius: String(q.autorius || '').trim(),
    zanroId: Number.parseInt(q.zanroId, 10) || '',
    metaiNuo: Number.parseInt(q.metaiNuo, 10) || '',
    metaiIki: Number.parseInt(q.metaiIki, 10) || ''
  };

  res.render('katalogas', {
    knygos: books.searchBooks(filtrai),
    zanrai: genres.getGenres(),
    filtrai
  });
});

app.get('/knyga/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const knyga = Number.isInteger(id) ? books.getBookById(id) : null;

  if (!knyga) {
    return res.status(404).render('klaida', {
      pavadinimas: 'Knyga nerasta',
      zinute: 'Tokios knygos kataloge nėra.'
    });
  }
  res.render('knyga', { knyga });
});

app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});