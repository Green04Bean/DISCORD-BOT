const {SlashCommandBuilder, PermissionFlagsBits} = require(`discord.js`);

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`kick`)
        .setDescription(`Kick a user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option =>
        option.setName(`user`)
            .setDescription(`User to kick`)
            .setRequired(true))
        .addStringOption(option =>
        option.setName(`reason`)
            .setDescription(`Reason for kick`)),
    async execute(interaction){
        const member = await interaction.options.getMember(`user`);
        const reason = await interaction.options.getString(`reason`) || `No reason provided`;

        try{
            /*if(!interaction.inGuild()){
                return await interaction.reply({
                    content: `This command can only be used in a server`
                });
            }*/

            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)){
                return await interaction.reply({
                    content: `I do not have permission to kick members`,
                    ephemeral: true
                });
            }

            if(member.permissions.has(PermissionFlagsBits.KickMembers)){
                return await interaction.reply({
                    content: `You cannot kick this member`,
                    ephemeral: true
                });
            }

            if(member.roles.highest.position >= interaction.guild.members.me.roles.highest.position){
                return await interaction.reply({
                    content: `I cannot kick this member`,
                    ephemeral: true
                });
            }

            await member.kick(member);
            await interaction.reply({
                content: `${member.user} has been kicked from this server\nReason: ${reason}`
            });
            try{
                const name = interaction.user.username;
                await member.send(`${name} has kicked you from ${interaction.guild.name}\nReason: ${reason}`);
            }
            catch(error){
                interaction.followUp({
                    content: `An error has occurred when DMing the member`,
                    ephemeral: true
                });
            }
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