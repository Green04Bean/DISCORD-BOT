const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

(async () => {
    try {
        console.log('Fetching all guild-specific commands...');

        // Fetch all guild-specific commands
        const commands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );

        console.log(`Found ${commands.length} guild-specific commands.`);

        // Delete each command
        for (const command of commands) {
            await rest.delete(
                Routes.applicationGuildCommand(clientId, guildId, command.id)
            );
            console.log(`Deleted command: ${command.name}`);
        }

        console.log('All guild-specific commands have been deleted.');
    } catch (error) {
        console.error('Error while deleting guild commands:', error);
    }
})();
