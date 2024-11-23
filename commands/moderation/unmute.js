const {SlashCommandBuilder, PermissionFlagsBits} = require(`discord.js`);

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`unmute`)
        .setDescription(`Unmute a user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option =>
        option.setName(`user`)
            .setDescription(`User to unmute`)
            .setRequired(true)),
    async execute(interaction){
        const member = await interaction.options.getMember(`user`);

        try{
            /*if(!interaction.inGuild()){
                return await interaction.reply({
                    content: `This command can only be used in a server`
                });
            }*/

            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)){
                return await interaction.reply({
                    content: `I do not have permission to unmute members`,
                    ephemeral: true
                });
            }

            if(member.permissions.has(PermissionFlagsBits.ModerateMembers)){
                return await interaction.reply({
                    content: `You cannot unmute this member`,
                    ephemeral: true
                });
            }

            if(member.roles.highest.position >= interaction.guild.members.me.roles.highest.position){
                return await interaction.reply({
                    content: `I cannot unmute this member`,
                    ephemeral: true
                });
            }

            if(!member.isCommunicationDisabled()){
                return await interaction.reply({
                    content: `This member is not currently muted`,
                    ephemeral: true
                })
            }

            await member.timeout(null);
            await interaction.reply({
                content: `${member.user} has been unmuted`
            });

            try {
                const name = interaction.user.username;
                await member.send(`${name} has unmuted you in ${interaction.guild.name}`);
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