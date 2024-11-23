const {SlashCommandBuilder, PermissionFlagsBits} = require(`discord.js`);
//testing
module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`ban`)
        .setDescription(`Ban a user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(option =>
        option.setName(`user`)
            .setDescription(`User to ban`)
            .setRequired(true))
        .addStringOption(option =>
        option.setName(`reason`)
            .setDescription(`Reason for ban`)),
    async execute(interaction){
        const member = await interaction.options.getMember(`user`);
        const reason = await interaction.options.getString(`reason`) || `No reason provided`;

        try{
            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)){
                return await interaction.reply({
                    content: `I do not have permission to ban members`,
                    ephemeral: true
                });
            }

            if(member.permissions.has(PermissionFlagsBits.BanMembers)){
                return await interaction.reply({
                    content: `You cannot ban this member`,
                    ephemeral: true
                });
            }

            if(member.roles.highest.position >= interaction.guild.members.me.roles.highest.position){
                return await interaction.reply({
                    content: `I cannot ban this member`,
                    ephemeral: true
                });
            }

            await member.ban(member);
            await interaction.reply({
                content: `${member.user} has been banned from this server\nReason: ${reason}`
            });
            try{
                const name = interaction.user.username;
                await member.send(`${name} has banned you from ${interaction.guild.name}\nReason: ${reason}`);
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