const fs      = require('fs');
const path    = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app      = express();
const PORT     = 3002;
const SQL_FILE = path.join(__dirname, 'blogit.sql');

const rawSql = fs.readFileSync(SQL_FILE, 'utf8');

const db = new sqlite3.Database(':memory:', err => {
  if (err) {
    console.error('error:', err);
    process.exit(1);
  }

  const createTable = `
    CREATE TABLE blogikirjoitus(
      kirjoitus_id   INTEGER PRIMARY KEY,
      otsikko        TEXT    NOT NULL,
      teksti         TEXT    NOT NULL,
      julkaisuaika   TEXT    NOT NULL,
      blogi_id       INTEGER NOT NULL
    );
  `;
  db.exec(createTable, err => {
    if (err) {
      console.error('error', err);
      process.exit(1);
    }

    const insertMatch = rawSql.match(
      /INSERT INTO `?blogikirjoitus`? \([^)]*\) VALUES[\s\S]*?;\s*/i
    );
    if (!insertMatch) {
      console.error('no dump');
      process.exit(1);
    }
    const insertSql = insertMatch[0].replace(/`/g, '');

    db.exec(insertSql, err => {
      if (err) {
        console.error('error:', err);
        process.exit(1);
      }
      console.log('Starting server. Loading...');
      startServer();
    });
  });
});

function startServer() {
  app.get('/', (_req, res) => {
    res.send('käytä /blogit');
  });

  app.get('/blogit', (_req, res) => {
    const sql = `
      SELECT kirjoitus_id, otsikko, teksti, julkaisuaika, blogi_id
      FROM blogikirjoitus
      ORDER BY julkaisuaika DESC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('bd', err);
        return res.status(500).json({ error: 'error' });
      }
      res.json(rows);
    });
  });

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/blogit`);
  });
}
