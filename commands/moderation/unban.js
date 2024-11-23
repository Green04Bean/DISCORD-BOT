const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`unban`)
        .setDescription(`Unban a user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addStringOption(option =>
        option.setName(`userid`)
            .setDescription(`ID of the user to unban`)
            .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getString(`userid`);

        try{
            const fetchedBans = await interaction.guild.bans.fetch();
            const isBanned = fetchedBans.has(userId);
            if(!isBanned){
                return await interaction.reply({
                    content: `This member is not banned`,
                    ephemeral: true
                });
            }

            await interaction.guild.members.unban(userId);
            await interaction.reply({
                content: `Successfully unbanned the member with ID: ${userId}`,
                ephemeral: true
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