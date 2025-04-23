const fs         = require('fs');
const path       = require('path');
const express    = require('express');
const sqlite3    = require('sqlite3').verbose();
const { create } = require('xmlbuilder2');

const app     = express();
const DB_DIR  = path.join(__dirname, 'db');
const DB_PATH = path.join(DB_DIR, 'saa.db');
const SQL_DMP = path.join(__dirname, 'saa.sql');


app.use(express.static(__dirname));

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(DB_PATH)) {
  const dumpDb = fs.readFileSync(SQL_DMP, 'utf8');
  const tmpDb = new sqlite3.Database(DB_PATH);
  tmpDb.exec(dumpDb, err => {
    if (err) {
      console.error('SQL:', err);
      process.exit(1);
    }
    tmpDb.close(startServer);
  });
} else {
  startServer();
}

function startServer() {
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

  app.get(['/saa/:vko', '/saa'], (req, res) => {
    const weekParam = req.params.vko || req.query.vko;
    const vko = parseInt(weekParam, 10);
    if (isNaN(vko)) {
      return res.status(400).send('(vko).');
    }

    const root = create({ version: '1.0' })
      .ins('xml-stylesheet', 'type="text/xsl" href="/style.xsl"')
      .ele('saa');

    db.all(
      `SELECT 
         pvm        AS paivamaara,
         lampotila,
         tuulennopeus,
         saatila
       FROM saa
       WHERE vko = ?
       ORDER BY pvm`,
      [vko],
      (err, rows) => {
        if (err) {
          console.error('bdbdbdbdbd', err);
          return res.status(500).send('errror.');
        }
        rows.forEach(r => {
          root.ele('havainto')
            .ele('paivamaara').txt(r.paivamaara).up()
            .ele('lampotila')  .txt(r.lampotila)  .up()
            .ele('tuulennopeus').txt(r.tuulennopeus).up()
            .ele('saatila')    .txt(r.saatila)    .up()
          .up();
        });

        res
          .type('application/xml')
          .send(root.end({ prettyPrint: true }));
      }
    );
  });

  app.get('/', (req, res) => {
    res.send(' /saa/:vko /saa?vko=');
  });

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/saa/1`);
  });
}
