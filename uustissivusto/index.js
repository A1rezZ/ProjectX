import fs from 'fs';
import path from 'path';
import express from 'express';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { getWeek } from 'date-fns';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();
const PORT       = 3004;

app.use(express.static(path.join(__dirname, 'public')));

const rawSql = fs.readFileSync(path.join(__dirname, 'uutissivusto.sql'), 'utf8');

const db = new sqlite3.Database(':memory:', err => {
  if (err) {
    console.error('DB', err);
    process.exit(1);
  }
  db.exec(
    `CREATE TABLE uutiset(
      uutinen_id   INTEGER PRIMARY KEY,
      otsikko      TEXT    NOT NULL,
      julkaisuaika TEXT    NOT NULL,
      kirjoittaja  TEXT    NOT NULL,
      sisalto      TEXT    NOT NULL,
      paauutinen   INTEGER NOT NULL
    );`,
    err => {
      if (err) {
        console.error('error', err);
        process.exit(1);
      }
      const match = rawSql.match(/INSERT INTO `?uutiset`? [\s\S]*?;/i);
      if (!match) {
        console.error('error');
        process.exit(1);
      }
      const insertSql = match[0].replace(/`/g, '');
      db.exec(insertSql, err => {
        if (err) {
          console.error('error', err);
          process.exit(1);
        }
        console.log('✅');
        app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
      });
    }
  );
});

app.get('/', async (_req, res) => {
  let weatherHtml = '';
  try {
    const weekNum = getWeek(new Date());
    const xmlText = await fetch(`http://localhost:3001/saa/${weekNum}`).then(r => r.text());
    const data    = await parseStringPromise(xmlText);
    weatherHtml = data.saa.havainto.map(d => {
      const date = d.paivamaara[0].slice(5);
      return `<div class="weather-day">
        <div class="wd-date">${date}</div>
        <div class="wd-temp">${d.lampotila[0]}°C</div>
        <div class="wd-desc">${d.saatila[0]}</div>
      </div>`;
    }).join('');
  } catch {
    weatherHtml = `<div class="weather-day error">Weather service unavailable</div>`;
  }

  let writersHtml = '';
  try {
    const blogs = await fetch('http://localhost:3002/blogit').then(r => r.json());
    writersHtml = blogs.slice(0,5).map(b =>
      `<li>${b.otsikko} — <small>${b.kirjoittaja}</small></li>`
    ).join('');
  } catch {
    writersHtml = `<li class="error">Blog service unavailable</li>`;
  }

  let mainNews = '', latestNews = '';
  try {
    const rows = await new Promise((ok, fail) =>
      db.all('SELECT * FROM uutiset ORDER BY julkaisuaika DESC', [], (e, r) => e ? fail(e) : ok(r))
    );
    mainNews = rows.filter(r => r.paauutinen === 1).map(u => `
      <div class="card">
        <h3>${u.otsikko}</h3>
        <div class="meta">${u.julkaisuaika} — ${u.kirjoittaja}</div>
        <p>${u.sisalto}</p>
      </div>`
    ).join('');
    latestNews = rows.filter(r => r.paauutinen === 0).slice(0,5)
      .map(u => `<li>${u.otsikko}<br><small>${u.julkaisuaika}</small></li>`)
      .join('');
  } catch {
    mainNews = `<div class="error">News service unavailable</div>`;
  }

  res.send(`<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Satavaltakunnan tarinat</title>
  <style>
    :root {
      --bg-dark: #0a0a0a;
      --fg-light:#eee;
      --accent:#f39c12;
      --card-bg:rgba(31,31,31,0.5);
      --card-border:#444;
    }
    body{margin:0;padding:0;background:var(--bg-dark);color:var(--fg-light);font-family:sans-serif;overflow-x:hidden;}
    #bg-video{position:fixed;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;}
    .video-controls{position:fixed;top:1rem;right:1rem;background:rgba(0,0,0,0.6);padding:0.5rem;border-radius:4px;z-index:2;display:flex;align-items:center;gap:0.5rem;}
    .video-controls label{font-size:0.9rem;color:#fff;}
    .video-controls input[type=range]{-webkit-appearance:none;appearance:none;width:120px;height:6px;background:#555;border-radius:3px;outline:none;}
    .video-controls input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:var(--accent);border-radius:50%;cursor:pointer;}
    .video-controls input[type=range]::-moz-range-thumb{width:16px;height:16px;background:var(--accent);border-radius:50%;cursor:pointer;}
    .video-controls button{background:var(--accent);border:none;color:#000;padding:0.3rem 0.6rem;border-radius:3px;cursor:pointer;font-size:0.8rem;}
    .video-controls button:hover{background:#e08e0b;}
    header{background:rgba(0,0,0,0.6);border-bottom:2px solid var(--accent);text-align:center;padding:2rem;position:relative;z-index:1;}
    header h1{margin:0;color:var(--accent);font-size:2.5rem;}
    header p{margin:0.5rem 0;color:#aaa;}
    .container{width:90%;max-width:1200px;margin:2rem auto;position:relative;z-index:1;}
    h2{color:var(--accent);margin-bottom:1rem;}
    .flex{display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:2rem;}
    .weather-day{background:var(--card-bg);border:1px solid var(--card-border);padding:1rem;flex:1 1 120px;text-align:center;border-radius:4px;}
    .wd-date{font-weight:bold;margin-bottom:0.5rem;}
    .wd-temp{font-size:1.2rem;}
    .wd-desc{font-style:italic;color:#ccc;}
    .bottom{display:flex;flex-wrap:wrap;gap:2rem;}
    .main{flex:2;min-width:300px;}
    .sidebar{flex:1;min-width:200px;}
    .card{background:var(--card-bg);border:1px solid var(--card-border);padding:1rem;margin-bottom:1rem;border-radius:4px;}
    .card h3{margin-top:0;color:var(--accent);}
    .meta{font-size:0.9rem;color:#888;margin-bottom:0.5rem;}
    .sidebar ul{list-style:none;padding:1rem;background:var(--card-bg);border:1px solid var(--card-border);border-radius:4px;}
    .sidebar li{margin:0.5rem 0;color:#fff;}
    .error{color:#e74c3c;}
    footer{text-align:center;margin:3rem 0;color:#555;font-size:0.9rem;position:relative;z-index:1;}
  </style>
</head>
<body>
  <video id="bg-video" autoplay muted preload="auto">
    <source src="videos/video1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <div class="video-controls">
    <label>Volume<input id="volume-slider" type="range" min="0" max="1" step="0.01" value="0.5"></label>
    <button id="next-btn">Next Video</button>
  </div>
  <header><h1>Satavaltakunnan tarinat</h1><p>Uutisia lumotusta maasta</p></header>
  <div class="container">
    <section><h2>Viikon sää — viikko ${getWeek(new Date())}</h2><div class="flex">${weatherHtml}</div></section>
    <div class="bottom">
      <div class="main">${mainNews}</div>
      <aside class="sidebar"><h2>Uusimmat uutiset</h2><ul>${latestNews}</ul><h2>Vierailijat</h2><ul>${writersHtml}</ul></aside>
    </div>
  </div>
  <footer>&copy; Satavaltakunta</footer>
  <script>
    (function(){
      const videos=['videos/video1.mp4','videos/video2.mp4','videos/video3.mp4'];
      let idx=0;
      const vid=document.getElementById('bg-video');
      const slider=document.getElementById('volume-slider');
      const nextBtn=document.getElementById('next-btn');
      vid.src=videos[0]; vid.volume=parseFloat(slider.value); vid.load(); vid.play();
      vid.addEventListener('ended',()=>{ idx=(idx+1)%videos.length; vid.src=videos[idx]; vid.load(); vid.play(); });
      slider.addEventListener('input',e=>{ vid.muted=false; vid.volume=parseFloat(e.target.value); });
      nextBtn.addEventListener('click',()=>{ idx=(idx+1)%videos.length; vid.src=videos[idx]; vid.load(); vid.play(); });
    })();
  </script>
</body>
</html>`);
});
