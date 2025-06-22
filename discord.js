const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

function startDiscordBot(mcBot) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
  const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

  let bans = [];
  try {
    bans = JSON.parse(fs.readFileSync('./data/bans.json'));
  } catch {
    bans = [];
  }

  client.on('ready', () => {
    console.log(`✅ Logado no Discord como ${client.user.tag}`);
  });

  client.on('messageCreate', async (message) => {
    if (message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
    if (message.author.bot) return;

    const args = message.content.slice(1).split(' ');
    const cmd = args.shift().toLowerCase();
    const isDev = message.author.username === config.developer.username;

    if (cmd === 'kit') {
      const target = args[0];
      const kitname = args[1];

      if (!target || !kitname) {
        message.reply('❌ Use: !kit <nick> <kitname>');
        return;
      }

      if (bans.includes(target)) {
        message.reply('🚫 Usuário banido.');
        return;
      }

      const kits = JSON.parse(fs.readFileSync('./data/kits.json'));
      const kit = kits[kitname];

      if (!kit) {
        message.reply('❌ Kit não encontrado.');
        return;
      }

      mcBot.chat(`/tpa ${target}`);
      webhook.send(`📦 Entregando kit ${kitname} para ${target}`);

      setTimeout(async () => {
        for (const itemName of kit) {
          const item = mcBot.inventory.items().find(i => i.name === itemName);
          if (item) {
            await mcBot.tossStack(item);
          }
        }
        mcBot.chat('/kill');
        webhook.send(`✅ Kit ${kitname} entregue para ${target}`);
      }, 10000);
    }

    if (isDev) {
      if (cmd === 'ban') {
        const target = args[0];
        if (!target) return;
        if (!bans.includes(target)) {
          bans.push(target);
          fs.writeFileSync('./data/bans.json', JSON.stringify(bans));
          message.reply(`🚫 Banido ${target}`);
        }
      }

      if (cmd === 'unban') {
        const target = args[0];
        const index = bans.indexOf(target);
        if (index !== -1) {
          bans.splice(index, 1);
          fs.writeFileSync('./data/bans.json', JSON.stringify(bans));
          message.reply(`✅ Unbanned ${target}`);
        }
      }

      if (cmd === 'shutdown') {
        message.reply('🛑 Desligando bot...');
        process.exit();
      }

      if (cmd === 'leave') {
        mcBot.quit();
        message.reply('🚪 Saindo do Minecraft...');
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}

module.exports = { startDiscordBot };
