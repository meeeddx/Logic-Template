const { SlashCommandBuilder, TextDisplayBuilder, ContainerBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
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
