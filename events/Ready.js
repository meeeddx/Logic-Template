const activity = require("../plugins/ActivityType");
const colors = require("colors");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    activity.setActivity(client);
    console.log(colors.bgMagenta(`[INFO] ${client.user.tag} | Ready!`));
  },
};
