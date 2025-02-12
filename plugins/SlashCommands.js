const { REST, Routes } = require("discord.js");
const path = require("path");
const fs = require("fs").promises;
const colors = require("colors");

module.exports = async (client = {}) => {
  const slashCommands = client.slashCommands || new Map();
  const slashCommandsArray = [];
  const organizedCommands = [];

  const loadCommands = async () => {
    try {
      slashCommands.clear();
      slashCommandsArray.length = 0;
      organizedCommands.length = 0;

      const commandFolders = await fs.readdir(
        path.join(__dirname, "../slashCommands")
      );
      const loadedNames = new Set();

      for (const folder of commandFolders) {
        const folderPath = path.join(__dirname, "../slashCommands", folder);
        const folderStat = await fs.stat(folderPath);

        if (!folderStat.isDirectory()) continue;

        const commandFiles = (await fs.readdir(folderPath)).filter((file) =>
          file.endsWith(".js")
        );

        if (commandFiles.length === 0) {
          console.log(colors.yellow(`Empty folder: ${folder}`));
          continue;
        }

        for (const file of commandFiles) {
          const commandPath = path.join(folderPath, file);
          let command;

          try {
            delete require.cache[require.resolve(commandPath)];
            command = require(commandPath);
          } catch (error) {
            continue;
          }

          if (!command.data) {
            continue;
          }

          // Log command data for debugging

          // Validate command name and description lengths
          const nameLength = command.data.name.length;
          const descriptionLength = command.data.description.length;

          if (nameLength > 32) {
            continue;
          }

          if (descriptionLength > 100) {
            continue;
          }

          if (loadedNames.has(command.data.name)) {
            continue;
          }

          loadedNames.add(command.data.name);
          slashCommands.set(command.data.name, command);
          slashCommandsArray.push(command.data.toJSON());
          organizedCommands.push({ folder, file, command: command.data.name });
        }
      }

      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
      const PublicRoutes = Routes.applicationCommands(process.env.CLIENT_ID);
      // const PrivateRoutes = Routes.applicationGuildCommands(
      //   process.env.CLIENT_ID, ( Use it if you need to reload slash commands for a specific guild )
      //  process.env.GUILD_ID
      // );
      await rest.put(PublicRoutes, {
        body: slashCommandsArray,
      });

      console.log(
        colors.bgCyan("[INFO] Slash commands | reloaded successfully.")
      );
    } catch (error) {}
  };

  await loadCommands();
};
