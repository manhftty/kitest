require('dotenv').config();
const { startDiscordBot } = require('./discord');
const { startTerminal } = require('./terminal');
const { startMinecraftBot } = require('./minecraft');
const keepAlive = require('./keepalive');

keepAlive();

const mcBot = startMinecraftBot();
startDiscordBot(mcBot);
startTerminal(mcBot);
