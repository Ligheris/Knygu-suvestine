const db = require('./connection');

const BOOK_SELECT = `
SELECT Knygos.knygos_id, Knygos.pavadinimas, Knygos.ISBN, Knygos.leidimo_metai,
         Knygos.autoriaus_id, Knygos.zanro_id,
         Autoriai.vardas AS autoriaus_vardas, Autoriai.pavarde AS autoriaus_pavarde,
         Zanrai.zanro_pavadinimas,
         NOT EXISTS (
           SELECT 1 FROM Paskolinimai
           WHERE Paskolinimai.knygos_id = Knygos.knygos_id AND Paskolinimai.busena = 'Paskolinta'
         ) AS prieinama
  FROM Knygos
  JOIN Autoriai ON Knygos.autoriaus_id = Autoriai.autoriaus_id
  JOIN Zanrai ON Knygos.zanro_id = Zanrai.zanro_id
  `;

function getBooks() {
    return db.prepare(`${BOOK_SELECT} ORDER BY Knygos.pavadinimas`).all();
}

function getBookById(id) {
  return db.prepare(`${BOOK_SELECT} WHERE Knygos.knygos_id = ?`).get(id);
}

function searchBooks({ pavadinimas, autorius, zanroId, metaiNuo, metaiIki }) {
  const conditions = [];
  const params = [];

  if (pavadinimas) {
    conditions.push('Knygos.pavadinimas LIKE ?');
    params.push(`%${pavadinimas}%`);
  }
  if (autorius) {
    conditions.push("(Autoriai.vardas || ' ' || Autoriai.pavarde) LIKE ?");
    params.push(`%${autorius}%`);
  }
  if (zanroId) {
    conditions.push('Knygos.zanro_id = ?');
    params.push(zanroId);
  }
  if (metaiNuo) {
    conditions.push('Knygos.leidimo_metai >= ?');
    params.push(metaiNuo);
  }
  if (metaiIki) {
    conditions.push('Knygos.leidimo_metai <= ?');
    params.push(metaiIki);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return db.prepare(`${BOOK_SELECT} ${where} ORDER BY Knygos.pavadinimas`).all(...params);
}

function addBook({ pavadinimas, isbn, leidimoMetai, zanroId, autoriausId }) {
  const info = db.prepare(
    'INSERT INTO Knygos (pavadinimas, ISBN, leidimo_metai, zanro_id, autoriaus_id) VALUES (?, ?, ?, ?, ?)'
  ).run(pavadinimas, isbn, leidimoMetai, zanroId, autoriausId);
  return info.lastInsertRowid;
}

function updateBook(id, { pavadinimas, isbn, leidimoMetai, zanroId, autoriausId }) {
  return db.prepare(
    'UPDATE Knygos SET pavadinimas = ?, ISBN = ?, leidimo_metai = ?, zanro_id = ?, autoriaus_id = ? WHERE knygos_id = ?'
  ).run(pavadinimas, isbn, leidimoMetai, zanroId, autoriausId, id);
}

function deleteBook(id) {
  return db.prepare('DELETE FROM Knygos WHERE knygos_id = ?').run(id);
}

module.exports = { getBooks, getBookById, searchBooks, addBook, updateBook, deleteBook };