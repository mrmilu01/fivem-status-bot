const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN; // DO NOT put token here
const FIVEM_IP = "51.195.252.112:30131";

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!status") {
    try {
      const response = await fetch(`http://${FIVEM_IP}/players.json`);
      const players = await response.json();

      const embed = new EmbedBuilder()
        .setTitle("🎮 FiveM Server Status")
        .setColor("Green")
        .addFields(
          { name: "Status", value: "🟢 Online", inline: true },
          { name: "Players", value: `${players.length}`, inline: true }
        )
        .setFooter({ text: "FiveM Status Bot" })
        .setTimestamp();

      message.reply({ embeds: [embed] });

    } catch (error) {
      message.reply("🔴 **Server Offline or Not Reachable**");
    }
  }
});

client.login(TOKEN);
