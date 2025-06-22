const express = require('express');
const server = express();

server.all('/', (req, res) => {
  res.send('KitBot is alive!');
});

function keepAlive() {
  server.listen(3000, () => {
    console.log('🟢 KeepAlive ativo (porta 3000)');
  });
}

module.exports = keepAlive;
