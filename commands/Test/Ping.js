const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping!",
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Pong!")
      .setDescription(`Pong! ${interaction.client.ws.ping}ms`);
    await interaction.reply({ embeds: [embed] });
  },
};
