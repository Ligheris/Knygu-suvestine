const db = require('./connection');

function getGenres() {
  return db.prepare('SELECT * FROM Zanrai ORDER BY zanro_pavadinimas').all();
}

function addGenre(pavadinimas) {
  return db.prepare('INSERT INTO Zanrai (zanro_pavadinimas) VALUES (?)').run(pavadinimas).lastInsertRowid;
}

function updateGenre(id, pavadinimas) {
  return db.prepare('UPDATE Zanrai SET zanro_pavadinimas = ? WHERE zanro_id = ?').run(pavadinimas, id);
}

function deleteGenre(id) {
  return db.prepare('DELETE FROM Zanrai WHERE zanro_id = ?').run(id);
}

module.exports = { getGenres, addGenre, updateGenre, deleteGenre };
