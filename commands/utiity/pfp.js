 const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('pfp')
        .setDescription('Get profile picture')
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Get this user\'s profile picture')),
    async execute(interaction) {
        const userSpecified = interaction.options.getUser('user');

        if(userSpecified) {
            const embed = new EmbedBuilder()
                .setTitle(`${userSpecified.username}\'s profile picture`)
                .setImage(userSpecified.avatarURL({dynamic: true, size: 4096}))
                .setColor('Purple');

            await interaction.reply({embeds: [embed]});
        }
        else{
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}\'s profile picture`)
                .setImage(interaction.user.avatarURL({dynamic: true, size: 4096}))
                .setColor('Purple');

            await interaction.reply({embeds: [embed]});
        }
    }
}