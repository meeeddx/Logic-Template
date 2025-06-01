const { TextDisplayBuilder, ContainerBuilder, MessageFlags } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping!",
  async execute(interaction) {
    const ContainerPing = new ContainerBuilder()
            .setAccentColor(16711680)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                .setContent(`**${interaction.client.ws.ping}ms**`)
            )
    await interaction.reply({ components: [ContainerPing], flags: MessageFlags.IsComponentsV2 });
  },
};
