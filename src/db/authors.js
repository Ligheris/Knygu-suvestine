const db = require('./connection');

function getAuthors() {
  return db.prepare('SELECT * FROM Autoriai ORDER BY pavarde, vardas').all();
}

function getAuthorById(id) {
  return db.prepare('SELECT * FROM Autoriai WHERE autoriaus_id = ?').get(id);
}

function addAuthor({ vardas, pavarde }) {
  return db.prepare('INSERT INTO Autoriai (vardas, pavarde) VALUES (?, ?)').run(vardas, pavarde).lastInsertRowid;
}

function updateAuthor(id, { vardas, pavarde }) {
  return db.prepare('UPDATE Autoriai SET vardas = ?, pavarde = ? WHERE autoriaus_id = ?').run(vardas, pavarde, id);
}

function deleteAuthor(id) {
  return db.prepare('DELETE FROM Autoriai WHERE autoriaus_id = ?').run(id);
}

module.exports = { getAuthors, getAuthorById, addAuthor, updateAuthor, deleteAuthor };
