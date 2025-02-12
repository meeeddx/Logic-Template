const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "Oops! Something went wrong while processing your request. If this issue persists, please [contact Support](https://discord.gg/2EKYrZ4nbP)."
          );
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
