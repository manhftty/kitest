const readline = require('readline');
const config = require('./config.json');

function startTerminal(mcBot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'KitBot> '
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();

    if (input === 'help') {
      console.log('Comandos: help, status, coords, leave, restart, quit');
    } else if (input === 'status') {
      console.log(`🟩 Logado como ${mcBot.username} em ${config.minecraft.host}:${config.minecraft.port}`);
    } else if (input === 'coords') {
      const pos = mcBot.entity.position;
      console.log(`📍 Localização: X:${pos.x} Y:${pos.y} Z:${pos.z}`);
    } else if (input === 'leave') {
      mcBot.quit();
      console.log('🚪 Saindo do Minecraft...');
    } else if (input === 'restart') {
      console.log('♻️ Reiniciando...');
      process.exit(1);
    } else if (input === 'quit') {
      console.log('🛑 Desligando...');
      process.exit(0);
    } else {
      console.log(`❌ Comando desconhecido: ${input}`);
    }

    rl.prompt();
  });
}

module.exports = { startTerminal };
