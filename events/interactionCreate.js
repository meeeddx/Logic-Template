const { TextDisplayBuilder, ContainerBuilder, MessageFlags } = require("discord.js");

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
        const errorMessage = new ContainerBuilder()
          .setAccentColor(16711680)
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(`⚠️ Oops! Something went wrong while processing your request.`)
          )
        await interaction.reply({ components: [errorMessage], flags: MessageFlags.IsComponentsV2 });
      }
    }
  },
};
