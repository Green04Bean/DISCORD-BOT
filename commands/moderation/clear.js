const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`clear`)
        .setDescription(`Clear messages from this channel`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false)
        .addIntegerOption(option =>
        option.setName(`amount`)
            .setDescription(`Amount of messages to clear`)
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(1)),
    async execute(interaction) {
        const amount = interaction.options.getInteger(`amount`);

        try{
            await interaction.channel.bulkDelete(amount);
            await interaction.reply({
                content: `Successfully cleared ${amount} messages`
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