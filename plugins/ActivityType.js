const { ActivityType } = require("discord.js");

module.exports = {
  setActivity(client) {
    client.user.setStatus("idle");
    client.user.setPresence({
      activities: [
        {
          name: "Logic Template",
          type: ActivityType.Watching, // Competing, Listening, Playing, Streaming, Watching
        },
      ],
    });
  },
};