const mineflayer = require('mineflayer');
const fs = require('fs');
const config = require('./config.json');

function startMinecraftBot() {
  const bot = mineflayer.createBot({
    host: config.minecraft.host,
    port: config.minecraft.port,
    username: config.minecraft.username,
    password: config.minecraft.password || undefined,
    version: config.minecraft.version || false,
    auth: config.minecraft.password ? 'microsoft' : 'offline'
  });

  bot.on('login', () => console.log('✅ Logado no Minecraft como', bot.username));
  bot.on('end', () => console.log('🔴 Desconectado do servidor Minecraft'));

  bot.on('chat', (username, message) => {
    if (username !== bot.username) {
      console.log(`[${username}]: ${message}`);
    }
  });

  return bot;
}

module.exports = { startMinecraftBot };
