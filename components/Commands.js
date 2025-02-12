const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.commands = new Map();
  const commandsPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(commandsPath);
  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(path.join(folderPath, file));
        if (command.name && command.execute) {
          client.commands.set(command.name, command);
        } else {
          console.warn(
            `Command file ${file} in folder ${folder} is missing required properties.`
          );
        }
      }
    }
  }
};
