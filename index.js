const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const FIVEM_IP = "51.195.252.112:30131";
const CHANNEL_ID = "1457147404439519464";
const REFRESH_INTERVAL = 10 * 1000; // 10 seconds

let statusMessage = null;

async function getServerStatus() {
  try {
    const res = await fetch(`http://${FIVEM_IP}/players.json`);
    const players = await res.json();

    return { online: true, players: players.length };
  } catch {
    return { online: false, players: 0 };
  }
}

async function updateStatus() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return;

  const status = await getServerStatus();

  const embed = new EmbedBuilder()
    .setTitle("🎮 FiveM Server Status")
    .setColor(status.online ? "Green" : "Red")
    .addFields(
      { name: "Status", value: status.online ? "🟢 Online" : "🔴 Offline", inline: true },
      { name: "Players", value: `${status.players}`, inline: true }
    )
    .setFooter({ text: "Auto refresh every 10 seconds" })
    .setTimestamp();

  if (!statusMessage) {
    statusMessage = await channel.send({ embeds: [embed] });
  } else {
    await statusMessage.edit({ embeds: [embed] });
  }
}

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  updateStatus();
  setInterval(updateStatus, REFRESH_INTERVAL);
});

client.login(TOKEN);
