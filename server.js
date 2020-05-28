const express = require('express');
const app = express();
const load_ = require('./load_database.js');

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage'
  });
});

app.get('/grades', (req, res) => {
  res.render('show');
});

app.get('/reload', (req, res) => {
  load_.load_database(req, res);
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});