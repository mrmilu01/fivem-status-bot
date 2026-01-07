const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const FIVEM_IP = "51.195.252.112:30131";
const CHANNEL_ID = "1457147404439519464";
const MESSAGE_ID = "1458321223799935037"; // 👈 very important
const REFRESH_INTERVAL = 3 * 1000; // 3 seconds

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
  const message = await channel.messages.fetch(MESSAGE_ID);

  const status = await getServerStatus();

  const embed = new EmbedBuilder()
    .setTitle("🎮 FiveM Server Status")
    .setColor(status.online ? "Green" : "Red")
    .addFields(
      { name: "Status", value: status.online ? "🟢 Online" : "🔴 Offline", inline: true },
      { name: "Players", value: `${status.players}`, inline: true }
    )
    .setFooter({ text: "Real-time refresh every 3 seconds" })
    .setTimestamp();

  await message.edit({ embeds: [embed] });
}

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  updateStatus();
  setInterval(updateStatus, REFRESH_INTERVAL);
});

client.login(TOKEN);
