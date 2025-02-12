require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const { getPrefix } = require("../db/Prefix");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    try {
      if (message.author.bot || !message.guild) return;

      const prefix = await getPrefix(message.guild.id);
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      let command = message.client.commands.get(commandName);
      if (!command) {
        for (const cmd of message.client.commands.values()) {
          if (cmd.aliases && cmd.aliases.includes(commandName)) {
            command = cmd;
            break;
          }
        }
      }
      if (!command) return;
      await command.execute(message, args);
    } catch (error) {
      console.error("Error processing message:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          `⚠️ Oops! Something went wrong while processing your request. If this issue persists, please **[Contact Support](https://discord.gg/Qc9zuygR4k)**.`
        );

      await message.reply({ embeds: [errorEmbed] });
    }
  },
};
