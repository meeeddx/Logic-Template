const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const chokidar = require('chokidar');

module.exports = (client) => {
    client.slashCommands = new Collection();
    const slashCommandsPath = path.join(__dirname, '../slashCommands');

    const loadCommands = () => {
        client.slashCommands.clear();
        const slashCommandFolders = fs.readdirSync(slashCommandsPath);

        for (const folder of slashCommandFolders) {
            const folderPath = path.join(slashCommandsPath, folder);

            if (fs.statSync(folderPath).isDirectory()) {
                const slashCommandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

                for (const file of slashCommandFiles) {
                    const filePath = path.join(folderPath, file);
                    delete require.cache[require.resolve(filePath)];
                    const slashCommand = require(filePath);
                    if (slashCommand.data && slashCommand.execute) {
                        client.slashCommands.set(slashCommand.data.name, slashCommand);
                    } else {
                        console.warn(`Slash command file ${file} in folder ${folder} is missing required properties.`);
                    }
                }
            }
        }
    };

    loadCommands();

    const watcher = chokidar.watch(slashCommandsPath, {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });

    watcher
        .on('add', path => {
            loadCommands();
        })
        .on('change', path => {
            loadCommands();
        })
        .on('unlink', path => {
            loadCommands();
        });

    client.slashCommands.forEach((cmd, name) => {
    });

};