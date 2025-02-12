const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbFolderPath = path.join(__dirname, '../db');
if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath);
}

const dbPath = path.join(dbFolderPath, 'prefix.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS prefixes (
        guild_id TEXT PRIMARY KEY,
        prefix TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
    }
});

/**
 * Get prefix for a guild.
 * @param {string} guildId - The ID of the guild.
 * @returns {Promise<string>} - The prefix for the guild or the default prefix.
 */
function getPrefix(guildId) {
    return new Promise((resolve, reject) => {
        const defaultPrefix = process.env.PREFIX || '!';
        db.get(`SELECT prefix FROM prefixes WHERE guild_id = ?`, [guildId], (err, row) => {
            if (err) return reject(err);
            resolve(row ? row.prefix : defaultPrefix);
        });
    });
}

/**
 * Set prefix for a guild.
 * @param {string} guildId - The ID of the guild.
 * @param {string} newPrefix - The new prefix to set.
 * @returns {Promise<void>}
 */
function setPrefix(guildId, newPrefix) {
    return new Promise((resolve, reject) => {
        db.run(
            `
            INSERT INTO prefixes (guild_id, prefix) VALUES (?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET prefix = ?
            `,
            [guildId, newPrefix, newPrefix],
            (err) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

module.exports = {
    getPrefix,
    setPrefix,
};
