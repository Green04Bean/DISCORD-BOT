const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`slowmode`)
        .setDescription(`Apply a slowmode to the current channel`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addIntegerOption(option =>
        option.setName(`delay`)
            .setDescription(`Slowmode delay`)
            .setRequired(true)
            .addChoices(
                {name: `Off`, value: 0},
                {name: `5 seconds`, value: 5},
                {name: `10 seconds`, value: 10},
                {name: `15 seconds`, value: 15},
                {name: `30 seconds`, value: 30},
                { name: '1 minute', value: 60 },
                { name: '2 minutes', value: 120 },
                { name: '5 minutes', value: 300 },
                { name: '10 minutes', value: 600 },
                { name: '15 minutes', value: 900 },
                { name: '30 minutes', value: 1800 },
                { name: '1 hour', value: 3600 },
                { name: '2 hours', value: 7200 },
                { name: '6 hours', value: 21600 }
            )),
    async execute(interaction){
        const seconds = interaction.options.getInteger(`delay`);

        try{
            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)){
                return await interaction.reply({
                    content: `I do not have permission to apply a slowmode to channels`,
                    ephemeral: true
                });
            }

            const durations = {
                0: 'off',
                    5: '5 seconds',
                    10: '10 seconds',
                    15: '15 seconds',
                    30: '30 seconds',
                    60: '1 minute',
                    120: '2 minutes',
                    300: '5 minutes',
                    600: '10 minutes',
                    900: '15 minutes',
                    1800: '30 minutes',
                    3600: '1 hour',
                    7200: '2 hours',
                    21600: '6 hours'
            };
            await interaction.channel.setRateLimitPerUser(seconds);
            await interaction.reply({
                content: `The slowmode delay for this channel is now ${durations[seconds]}`
            });
        }
        catch(error){
            console.log(error);
            await interaction.reply({
                content: `An error has occurred`,
                ephemeral: true
            });
        }
    }
}