require("dotenv").config();
const { TextDisplayBuilder, ContainerBuilder, MessageFlags } = require("discord.js");
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

      const errorMessage = new ContainerBuilder()
        .setAccentColor(16776960) // Yellow color
        .addTextDisplayComponents(
          new TextDisplayBuilder()
          .setContent(`⚠️ Oops! Something went wrong while processing your request.`)
        )

      await message.reply({ components: [errorMessage], flags: MessageFlags.IsComponentsV2 });
    }
  },
};
